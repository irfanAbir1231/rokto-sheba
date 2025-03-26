import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Define a global type extension to add mongoose property
declare global {
  var mongoose: MongooseConn | undefined;
}

let cached: MongooseConn = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "roktosheba",
      // bufferCommands: false,
      // connectTimeoutMS: 10000,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
