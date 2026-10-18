import { setServers } from "node:dns";
import { MongoClient } from "mongodb";

// Use Google DNS to resolve MongoDB SRV records.
setServers(["8.8.8.8", "8.8.4.4"]);

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env.local");
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