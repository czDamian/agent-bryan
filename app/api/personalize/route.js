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
  JWT_SECRET,
} = process.env;

// Initialize the client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });
const collection = db.collection(ASTRA_DB_COLLECTION);
const universalMessage =
  "how to create a personalized blueprint based on activity level, diet and health goals"; //use this for .....
let docContext = "";
if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN) {
  throw new Error("Missing Astra DB connection details in .env");
}

export async function POST(request) {
  // Get the token from the cookie and ensure user is validated before making requests
  const token = request.cookies.get("token")?.value;
  if (!token) {
    console.log("no token sent");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await request.json();
  console.log("Message:", message);
  if (!message)
    return NextResponse.json({ error: "No message provided" }, { status: 400 });

  const nameOfUser = message.name;
  const ageOfUser = message.age;
  const dietOfUser = message.diet;
  const activityLevelOfUser = message.activityLevel;
  const healthGoalsOfUser = message.healthGoals;
  console.log("Name of User:", nameOfUser);
  try {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userEmail = decoded.email;
      console.log("accessing personalize page as", userEmail);
      // Generate embedding for the latest message
      //   const embeddingResponse = await embeddingModel.embedContent(message);
      const embeddingResponse = await embeddingModel.embedContent(
        universalMessage
      );
      const vector = embeddingResponse.embedding.values;
      //   console.log("Embedding Vector:", vector);
      //correct

      // AstraDB vector search query
      const searchResults = collection.find(null, {
        sort: {
          $vector: vector,
        },
        limit: 10,
      });
      const searchResultsArray = await searchResults.toArray();
      // console.log("Search Results:", searchResultsArray);
      if (!Array.isArray(searchResultsArray)) {
        throw new Error("AstraDB query did not return an array.");
      }

      // Construct AI prompt using retrieved data
      const docsMap = searchResultsArray?.map((doc) => doc.text);
      docContext = JSON.stringify(docsMap);
      // console.log(docContext);
    } catch (error) {
      console.log("Error:", error);
      return NextResponse.json(
        { error: "Failed to query DB" },
        { status: 500 }
      );
    }
    console.log(ageOfUser);
    console.log(dietOfUser);
    const systemInstruction = `You are Agent Bryan, an AI assistant specializing in Bryan Johnson’s "Don’t Die Blueprint." 
    Your role is to help to create personalized blueprints for users based on the principles Bryan Johnson’s “Don’t Die Blueprint”. 
    -Assume the user does not know anything about the blueprint
    - If a user asks for a personalized blueprint, ask him to provide personal details (age, diet, activity level, health goals) only,and then you will generate  tailored recommendations for him based on the blueprint principles. Don't say that you can't offer medical advice.  
    - If a question is unrelated, respond with: 'I can only answer questions about the Don't Die Blueprint and longevity.'  
    -  Respond in the same language as the query.  
    - Before responding, check if the answer to the query is in the ${docContext} above.  
      If found, use that information. Otherwise, rely on your originally trained data.  

    The user data to use and generate personalized blueprint is as follows: The name of the person requesting for personalized blueprint is  ${nameOfUser} and he is ${ageOfUser} years old with a diet of ${dietOfUser}, an activity level of ${activityLevelOfUser} and health goals ${healthGoalsOfUser}.
    - Don't repeat the user's personal details back in your response. Just respond with the best personalized blueprint you can find for him and in a simple and understandable way`;

    const extendedModel = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction,
    });
    const result = await extendedModel.generateContent(universalMessage);
    const responseText = result.response.text();

    return NextResponse.json({ message: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    docContext = "";
    return NextResponse.json(
      { error: "Failed to fetch AI response", error },
      { message: "An error occured" },
      { status: 500 }
    );
  }
}
