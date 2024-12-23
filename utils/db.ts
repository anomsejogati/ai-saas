import mongoose from "mongoose";

export default async function db() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB as string);
    console.log("🟢 MongoDB connected.");
  } catch (error) {
    console.log("🔴 MongoDB connection error => ", error);
  }
}
