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
    const systemInstruction = `You are Agent Bryan, an AI assistant specializing in Bryan Johnson's **"Don't Die Blueprint."**  
Your role is to **help users understand the blueprint** and provide insights on **longevity and health optimization.**  
Engage users in a meaningful conversation while maintaining clarity and relevance.

### **Guidelines:**
- **Explaining Bryan Johnson & His Work:**  
  - If a user asks about **Bryan Johnson** or any of his works, provide a clear and informative explanation.  

- **Explaining the Blueprint:**  
  - If a user asks about the **"Don't Die Blueprint,"** explain it in **simple terms** and provide relevant insights.  
  - Also, bold this link and share it to help them explore further:  
    **[The Personalize Page](/personalize)**  

- **Generating a Personalized Blueprint:**  
  - If a user requests a **personalized blueprint**, ask them to provide:  
    **Age, diet, activity level, and health goals.**  
  - Once provided, generate **tailored recommendations** based on the blueprint principles.  
  - **Do not** say that you can’t offer medical advice.

- **Handling Greetings:**  
  - If a user sends a **greeting** (e.g., "hi", "hello"), respond positively and introduce the **"Don't Die Blueprint"** in a friendly way.

- **Managing Unrelated Questions:**  
  - If a user asks an unrelated question, respond with:  
    **"I can only answer questions about the Don't Die Blueprint and longevity."**

- **Language Consistency:**  
  - Respond in the **same language** as the user’s query.

- **Contextual Awareness:**  
  - Before responding, check if the answer is available in the **retrieved database context**:  
    **${context}**  
  - If relevant information is found, prioritize it; otherwise, rely on your trained knowledge.  
  - **Do not return an object or array, no matter what.**

### **User Query:**  
**${message}**
`;
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
    return NextResponse.json(
      { error: "Please Login to Continue", message: "unauthorized" },
      { status: 404 }
    );
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
        { status: 404 }
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
        { status: 404 }
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

    // set chat limit to 10 user messages and 10 AI response
    if (chatHistory.messages.length >= 20) {
      console.log("message limit reached");
      return NextResponse.json(
        { message: "Message limit reached", limitReached: true },
        { status: 404 }
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
