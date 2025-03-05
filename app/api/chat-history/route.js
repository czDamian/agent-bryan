//chat history for sidebar component

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

// Get or initialize chat history

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
    console.log("logged in as", userEmail);
    let chatHistory = db.collection(ASTRA_DB_CHAT_HISTORY_COLLECTION);
    const results = await chatHistory
      .find({ userId: userEmail })
      .limit(10)
      .toArray();

    // Get the whole chat history or create a new one if none exists
    chatHistory =
      results && results.length > 0
        ? results
        : { userId: userEmail, messages: [], createdAt: new Date() };

    return NextResponse.json({ history: chatHistory }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

// return error message if a GET request is made
export async function GET() {
  return NextResponse.json({ message: "unauthorized" }, { status: 400 });
}
