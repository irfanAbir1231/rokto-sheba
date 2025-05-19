import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var mongoose: MongooseConn | undefined;
}

const cached: MongooseConn = global.mongoose!;

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
