import { MongoClient, Db } from "mongodb";

const state: { db: Db | null } = {
  db: null,
};

export async function connectToDb(): Promise<void> {
  const url = process.env.MONGODB_URI as string;
  const dbName = "chatbot";

  if (state.db) return;

  try {
    const client = await MongoClient.connect(url);

    state.db = client.db(dbName);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}

export function getDb(): Db {
  if (!state.db) {
    throw new Error("DB not initialized. Call connectToDb() first.");
  }
  return state.db;
}
