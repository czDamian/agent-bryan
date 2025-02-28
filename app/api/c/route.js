//for fetching specific chat history based on the provided chat Id

import { DataAPIClient } from "@datastax/astra-db-ts";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
// Environment variables
const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_CHAT_HISTORY_COLLECTION,
  JWT_SECRET,
} = process.env;

// Validate required environment variables
if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN) {
  throw new Error("Missing Astra DB connection details in .env");
}
// Initialize Astra DB
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {
  namespace: ASTRA_DB_NAMESPACE,
});

// Get a specific chat history

export async function POST(request) {
  // Get the token from the cookie and ensure user is validated before making requests
  const token = request.cookies.get("token")?.value;
  if (!token) {
    console.log("no token sent");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  //authenticate above then proceed to display chat
  const { chatId } = await request.json();
  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
  }

  console.log("chat id backend", chatId);
  let chatHistory = db.collection(ASTRA_DB_CHAT_HISTORY_COLLECTION);
  const results = await chatHistory.find({ _id: chatId }).toArray();
  //   console.log("specific chat history", results);

  if (results.length === 0) {
    return NextResponse.json(
      { error: "Chat history not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ history: results }, { status: 200 });
}

export async function GET() {
  const chatId = "d48de76f-057d-4cc7-8de7-6f057d5cc72b";
  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
  }

  console.log("chat id backend", chatId);
  let chatHistory = db.collection(ASTRA_DB_CHAT_HISTORY_COLLECTION);
  const results = await chatHistory.find({ _id: chatId }).toArray();
  //   console.log("specific chat history", results);

  if (results.length === 0) {
    return NextResponse.json(
      { error: "Chat history not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ history: results }, { status: 200 });
}
