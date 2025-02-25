import { NextResponse } from "next/server";
import { DataAPIClient } from "@datastax/astra-db-ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_USER_COLLECTION,
  JWT_SECRET,
} = process.env;

// Initialize AstraDB client
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });
const usersCollection = db.collection(ASTRA_DB_USER_COLLECTION);

const createCollection = async () => {
  try {
    if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN) {
      throw new Error("Missing AstraDB connection details in .env");
    }
    // Check if collection already exists
    const collections = await db.listCollections();
    if (collections.includes(ASTRA_DB_USER_COLLECTION)) {
      console.log(`Collection "${ASTRA_DB_USER_COLLECTION}" already exists.`);
      return;
    }

    // Create collection
    await db.createCollection(ASTRA_DB_USER_COLLECTION);
    console.log(
      `Collection "${ASTRA_DB_USER_COLLECTION}" created successfully.`
    );
  } catch (error) {
    console.error("Error creating collection:", error);
  }
};

// Run the function
// createCollection();

(async () => {
  const colls = await db.listCollections();
  console.log("Connected to AstraDB:", colls);
})();

export async function POST(request) {
  try {
    const { name, email, password, type } = await request.json();

    if (!email || !password)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    if (type === "register") {
      if (!name)
        return NextResponse.json(
          { error: "Name is required" },
          { status: 400 }
        );

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser)
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user in AstraDB
      await usersCollection.insertOne({
        name,
        email,
        password: hashedPassword,
      });

      return NextResponse.json({
        message: "Registered successfully, proceed to login",
      });
    }

    if (type === "login") {
      // Check if the user exists
      const user = await usersCollection.findOne({ email });
      if (!user)
        return NextResponse.json({ error: "Invalid email" }, { status: 401 });

      // Validate password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 401 }
        );

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return NextResponse.json({ message: "Login successful", token });
    }

    return NextResponse.json(
      { error: "Invalid request type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
