import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async function () {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `MONGODB connected to host ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`error while connecting to the database ${error}`);
  }
};

export { connectDB };
