import mongoose from "npm:mongoose";

export async function connectToDatabase() {
  const dbUrl = Deno.env.get("DB_URL");
    if (!dbUrl) {
        throw new Error("DB_URL environment variable is not set");
    }
    await mongoose.connect(dbUrl);
    console.log("Connected to the database");
}