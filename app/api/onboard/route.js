//for login, register and logout
import { NextResponse } from "next/server";
import { DataAPIClient } from "@datastax/astra-db-ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

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

export async function POST(request) {
  console.log("request in progress");
  try {
    const { name, email, password, type } = await request.json();

    if (type === "logout") {
      console.log("trying to logout");
      const cookie = serialize("token", "", {
        httpOnly: true,
        sameSite: "Strict",
        path: "/",
        expires: new Date(0), // Expire the cookie
      });

      return NextResponse.json(
        { message: "Logout successful" },
        {
          status: 200,
          headers: {
            "Set-Cookie": cookie,
            "Content-Type": "application/json",
          },
        }
      );
    }
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
        createdAt: new Date(),
      });

      return NextResponse.json({
        message: "Registered successfully, proceed to login", //changing this affects the frontend, leave the success message as it is
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

      // set the cookie
      const cookie = serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return new Response(JSON.stringify({ message: "Login successful" }), {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      });
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

// return error message if a GET request is made
export async function GET() {
  return NextResponse.json({ message: "unauthorized" }, { status: 404 });
}

