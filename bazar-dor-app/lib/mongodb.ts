import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add MONGODB_URI to your environment variables");
}

const options = {};

declare global {
  var _mongoClient: MongoClient | undefined;
}

const client =
  global._mongoClient ?? new MongoClient(uri, options);

if (process.env.NODE_ENV !== "production") {
  global._mongoClient = client;
}

export { client };

export const db = client.db("bazardor");