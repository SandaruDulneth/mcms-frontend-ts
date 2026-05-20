import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "mcms";

type MongoGlobal = typeof globalThis & {
  _mcmsMongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as MongoGlobal;

export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const clientPromise =
    globalForMongo._mcmsMongoClientPromise ?? new MongoClient(uri).connect();

  if (process.env.NODE_ENV !== "production") {
    globalForMongo._mcmsMongoClientPromise = clientPromise;
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}
