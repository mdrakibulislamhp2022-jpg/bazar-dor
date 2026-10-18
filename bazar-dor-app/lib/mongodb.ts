import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

declare global {
  var _mongoClient: MongoClient | undefined;
}

const client =
  global._mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  global._mongoClient = client;
}

export { client };

export const db = client.db("bazardor");