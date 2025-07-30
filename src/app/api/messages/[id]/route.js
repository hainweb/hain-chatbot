import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDb, getDb } from "@/lib/db";

export async function GET(req, context) {
  const { id } = context.params;
  await connectToDb();
  const db = getDb();
  try {
    const messages = await db
      .collection("messages")
      .find({ chatId: new ObjectId(id) })
      .toArray();
    console.log("messages", messages);

    if (!messages) {
      return NextResponse.json(
        { error: "Messages not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(messages);
  } catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}

export async function POST(req, context) {
  const { id } = context.params;

  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const db = await connectToDb();

    await db
      .collection("chats")
      .updateOne({ _id: new ObjectId(id) }, { $push: { messages: message } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
