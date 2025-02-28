import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const {
  GEMINI_API_KEY,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_CHAT_HISTORY_COLLECTION,
  ASTRA_DB_USER_COLLECTION,
  JWT_SECRET,
} = process.env;

// Validate required environment variables
if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN) {
  throw new Error("Missing Astra DB connection details in .env");
}

// Initialize database and AI clients
function initClients() {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const embeddingModel = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });

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

// Database Service
const dbService = {
  async validateUser(collections, email) {
    return await collections.users.findOne({ email });
  },

  async getChatHistory(collections, chatId) {
    return await collections.chatHistory.findOne({ _id: chatId });
  },

  async createChatHistory(collections, userEmail) {
    const chatHistory = {
      userId: userEmail,
      messages: [],
      createdAt: new Date(),
    };
    const result = await collections.chatHistory.insertOne(chatHistory);
    return result.insertedId; // Get new chat ID
  },

  async saveChatHistory(collections, chatId, messages) {
    return await collections.chatHistory.updateOne(
      { _id: chatId },
      { $set: { messages } },
      { upsert: true }
    );
  },
  async vectorSearch(collection, vector, limit = 10) {
    const searchResults = collection.find(null, {
      sort: { $vector: vector },
      limit,
    });
    return await searchResults.toArray();
  },
};

// AI Service
const aiService = {
  async generateEmbedding(embeddingModel, text) {
    const embeddingResponse = await embeddingModel.embedContent(text);
    return embeddingResponse.embedding.values;
  },

  async getAIResponse(genAI, message, history, context) {
    const systemInstruction = `You are Agent Bryan, an AI assistant specializing in Bryan Johnson's \"Don't Die Blueprint.\" Your role is to help users understand the blueprint and provide insights on longevity and health optimization. Try and engage the user in a conversation
    - If a user asks about Bryan or any other of his works, explain it to the user
    - If a user asks about the blueprint, explain it in simple terms and provide relevant insights.  Also send them the link [The Personalize Page](/personalize) so that they can use the blueprint if they want to. Also bold the link.
    - If a user asks for a personalized blueprint, ask him to provide personal details (age, diet, activity level, health goals) only,and then you will generate  tailored recommendations for him based on the blueprint principles. Don't say that you can't offer medical advice. 
    - If a user sends only a greeting (e.g., "hi", "hello"), respond positively and introduce the "Don't Die Blueprint" in a friendly way.  
    - If a question is unrelated, respond with: 'I can only answer questions about the Don't Die Blueprint and longevity.'  
    -  Respond in the same language as the query.  
    - Before responding, check if the answer to the query is in the ${context} above.  
      If found, use that information. Otherwise, rely on your originally trained data.  Don't return an object or array no matter what.
    
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

// Initialize Clients
const { genAI, embeddingModel, db, collections } = initClients();

// Main API Handler
export async function POST(request) {
  // Get the token from the cookie and ensure user is validated before making requests
  const token = request.cookies.get("token")?.value;
  if (!token) {
    console.log("no token sent");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;
    console.log("logged in to chat as", userEmail);
    const { message, history, chatId } = await request.json();
    console.log("Request:", { message, history, chatId });

    // Validate user email
    if (!userEmail) {
      return NextResponse.json(
        { error: "User not logged in" },
        { status: 401 }
      );
    }

    // Validate user existence
    const user = await dbService.validateUser(collections, userEmail);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate message
    if (!message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    // Determine chat history handling
    let chatHistory;
    let activeChatId = chatId;

    if (chatId) {
      chatHistory = await dbService.getChatHistory(collections, chatId);
      if (!chatHistory) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
    } else {
      activeChatId = await dbService.createChatHistory(collections, userEmail);
      chatHistory = { userId: userEmail, messages: [], createdAt: new Date() };
    }

    if (chatHistory.messages.length >= 10) {
      return NextResponse.json(
        { error: "Message limit reached", limitReached: true },
        { status: 403 }
      );
    }

    // Get AI response
    const responseText = await aiService.getAIResponse(
      genAI,
      message,
      history,
      ""
    );

    // Update chat history
    chatHistory.messages.push(
      { role: "user", msg: message },
      { role: "AI", msg: responseText }
    );
    await dbService.saveChatHistory(
      collections,
      activeChatId,
      chatHistory.messages
    );

    return NextResponse.json({ message: responseText, chatId: activeChatId });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}
