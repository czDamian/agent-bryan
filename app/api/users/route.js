import { NextResponse } from "next/server";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_USER_COLLECTION,
} = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });
const collection = db.collection(ASTRA_DB_USER_COLLECTION);

// export async function GET() {
//   try {
//     const userList = collection.find({});
//     const user2Array = await userList.toArray();
//     return NextResponse.json({ users: user2Array });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// return error message if a GET request is made
export async function GET() {
  return NextResponse.json({ message: "unauthorized" }, { status: 404 });
}
