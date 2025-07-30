import Layout from "@/app/LayoutPage";
import ChatClient from "./ChatClient";
import { ObjectId } from "mongodb";
import { connectToDb, getDb } from "@/lib/db";

interface Props {
  params: { id: string };
}

interface Message {
  _id: string;
  chatId: string;
  role: string;
  content: string;
  tool?: string;
  createdAt: string;
  fileNames?: string[];
}

export default async function ChatPage({ params }: Props) {
  const chatId = params.id;

  let initialMessages: Message[] = [];

  try {
    await connectToDb();
    const db = getDb();

    const messages = await db
      .collection("messages")
      .find({ chatId: new ObjectId(chatId) })
      .toArray();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialMessages = messages.map((msg: any) => ({
      _id: msg._id.toString(),
      chatId: msg.chatId.toString(),
      role: msg.role,
      content: msg.content,
      tool: msg.tool,
      createdAt: msg.createdAt?.toString() ?? "",
      fileNames: msg.fileNames ?? [],
    }));
  } catch (err) {
    console.error("GET Error:", err);
  }

  return (
    <Layout>
      <ChatClient chatId={chatId} initialMessages={initialMessages} />
    </Layout>
  );
}
