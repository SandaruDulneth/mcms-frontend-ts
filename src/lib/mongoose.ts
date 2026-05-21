import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "mcms";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

type MongooseGlobal = typeof globalThis & {
  _mcmsMongoose?: MongooseCache;
};

const globalForMongoose = globalThis as MongooseGlobal;

const cached = globalForMongoose._mcmsMongoose ?? {
  connection: null,
  promise: null,
};

if (!globalForMongoose._mcmsMongoose) {
  globalForMongoose._mcmsMongoose = cached;
}

export async function connectMongoose() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  cached.promise ??= mongoose.connect(uri, {
    dbName,
    bufferCommands: false,
  });

  cached.connection = await cached.promise;
  return cached.connection;
}
