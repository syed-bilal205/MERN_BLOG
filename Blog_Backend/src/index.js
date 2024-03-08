import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import { app } from "./app.js";
import { connectDB } from "./db/connection.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8001, () => {
      console.log(`server started at the port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`error while connecting to the server ${error}`);
  });
