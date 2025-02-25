import { NextResponse } from "next/server";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_USER_COLLECTION,
  ASTRA_DB_CHAT_HISTORY_COLLECTION,
} = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });
const collection = db.collection(ASTRA_DB_USER_COLLECTION);
const chatCollection = db.collection(ASTRA_DB_CHAT_HISTORY_COLLECTION);

export async function GET() {
  try {
    const userList = collection.find({});
    const user2Array = await userList.toArray(); //must await it

    const chats = chatCollection.find({});
    const chats2array = await chats.toArray(); //must await it too

    // const userExists = collection.findOne({email: "admin@admin.com"})
    // if(!userExists){
    //   console.log("user does not exist");
    // }
    // if(userExists){
    //   const userid = (await userExists)._id;
    //   console.log(userid)
    // }

    return NextResponse.json({ users: user2Array, chats: chats2array });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
