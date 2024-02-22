import mongoose from "mongoose";
import { DB_NAME } from "../constant";

const connectDB = async (database_uri: string) => {
  console.log(database_uri);
  try {
    await mongoose.connect(`${database_uri}/${DB_NAME}`);
    console.log(`DB is connected`);
  } catch (error) {
    console.log("MONGODB connection Failed", error);
    process.exit(1);
  }
};

export { connectDB };
