import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Environment variables
const {
  GEMINI_API_KEY,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_CHAT_HISTORY_COLLECTION,
  ASTRA_DB_USER_COLLECTION,
} = process.env;

// Validate required environment variables
if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN) {
  throw new Error("Missing Astra DB connection details in .env");
}

// Initialize clients
function initClients() {
  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const embeddingModel = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });

  // Initialize Astra DB
  const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
  const db = client.db(ASTRA_DB_API_ENDPOINT, {
    namespace: ASTRA_DB_NAMESPACE,
  });

  return {
    genAI,
    embeddingModel,
    db,
    collections: {
      data: db.collection(ASTRA_DB_COLLECTION),
      users: db.collection(ASTRA_DB_USER_COLLECTION),
      chatHistory: db.collection(ASTRA_DB_CHAT_HISTORY_COLLECTION),
    },
  };
}

// Database service
const dbService = {
  // Verify database connection
  verifyConnection: async function (db) {
    try {
      const colls = await db.listCollections();
      console.log("Connected to AstraDB:", colls);
      return true;
    } catch (error) {
      console.error("Failed to connect to AstraDB:", error);
      return false;
    }
  },

  // Validate user exists
  validateUser: async function (collections, email) {
    const user = await collections.users.findOne({ email });
    return user;
  },

  // Get or initialize chat history
  getChatHistory: async function (collections, userId) {
    const results = await collections.chatHistory
      .find({ id: userId })
      .toArray();
    console.log("chat history", results);

    // Get the first document or create a new one if none exists
    let chatHistory =
      results && results.length > 0
        ? results[0]
        : { id: userId, messages: [], createdAt: new Date() };

    return chatHistory;
  },

  // Perform vector search
  vectorSearch: async function (collection, vector, limit = 10) {
    const searchResults = collection.find(null, {
      sort: {
        $vector: vector,
      },
      limit,
    });
    return await searchResults.toArray();
  },

  // Save chat history
  saveChatHistory: async function (collections, userId, messages) {
    return await collections.chatHistory.updateOne(
      { id: userId },
      { $set: { messages } },
      { upsert: true }
    );
  },
};

// AI service
const aiService = {
  // Generate embeddings
  generateEmbedding: async function (embeddingModel, text) {
    const embeddingResponse = await embeddingModel.embedContent(text);
    return embeddingResponse.embedding.values;
  },

  // Get AI response
  getAIResponse: async function (genAI, message, history, context) {
    const systemInstruction = `You are Agent Bryan, an AI assistant specializing in Bryan Johnson's "Don't Die Blueprint." 
    Your role is to help users understand the blueprint and provide insights on longevity and health optimization. Try and engage the user in a conversation

    - If a user asks about the blueprint, explain it in simple terms and provide relevant insights.  Also send them the link [The Personalize Page](/personalize) so that they can use the blueprint if they want to. Also bold the link.
    - If a user asks for a personalized blueprint, ask him to provide personal details (age, diet, activity level, health goals) only,and then you will generate  tailored recommendations for him based on the blueprint principles. Don't say that you can't offer medical advice. 
    - If a user sends only a greeting (e.g., "hi", "hello"), respond positively and introduce the "Don't Die Blueprint" in a friendly way.  
    - If a question is unrelated, respond with: 'I can only answer questions about the Don't Die Blueprint and longevity.'  
    -  Respond in the same language as the query.  
    - Before responding, check if the answer to the query is in the ${context} above.  
      If found, use that information. Otherwise, rely on your originally trained data.  
    
    The question to answer is: ${message}`;

    const extendedModel = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction,
    });

    const chat = extendedModel.startChat({ history });
    const result = await chat.sendMessage(message);
    return result.response.text();
  },
};

// Initialize on startup
const { genAI, embeddingModel, db, collections } = initClients();
dbService.verifyConnection(db);

// Main handler
export async function POST(request) {
  // TODO: Implement proper authentication
  const userEmail = "admin@admin.com";
  let docContext = "";

  try {
    // Validate user
    const validateUser = await dbService.validateUser(collections, userEmail);
    if (!validateUser) {
      return NextResponse.json(
        { error: "User not logged in" },
        { status: 401 }
      );
    }

    const userId = validateUser._id;
    let chatHistory = await dbService.getChatHistory(collections, userId);

    // Parse request
    const { message, history } = await request.json();
    console.log("Message:", message);
    console.log("History:", history);

    if (!message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    try {
      // Generate embedding and search for relevant context
      const vector = await aiService.generateEmbedding(embeddingModel, message);
      const searchResultsArray = await dbService.vectorSearch(
        collections.data,
        vector
      );
      console.log("Search Results:", searchResultsArray);

      if (!Array.isArray(searchResultsArray)) {
        throw new Error("AstraDB query did not return an array.");
      }

      // Construct context from search results
      const docsMap = searchResultsArray?.map((doc) => doc.text);
      docContext = JSON.stringify(docsMap);
      console.log(docContext);
    } catch (error) {
      console.log("Error during vector search:", error);
      return NextResponse.json(
        { error: "Failed to query DB" },
        { status: 500 }
      );
    }

    // Get AI response
    const responseText = await aiService.getAIResponse(
      genAI,
      message,
      history,
      docContext
    );

    // Save chat history
    // Make sure chatHistory is properly structured
    if (!chatHistory) {
      chatHistory = { id: userId, messages: [] };
    }

    // Make sure messages is an array
    if (!Array.isArray(chatHistory.messages)) {
      chatHistory.messages = [];
    }

    // Add new messages
    chatHistory.messages.push(message, responseText);

    // Save the updated chat history
    await dbService.saveChatHistory(collections, userId, chatHistory.messages);
    return NextResponse.json({ message: responseText });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
