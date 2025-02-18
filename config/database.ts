import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dataBase = async () => {
  try {
    await connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fintech")
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
      });
  } catch (error: any) {
    console.log(`Error conecting to database: ${error.message}`);
  }
};
