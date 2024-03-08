import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import authRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import likeRoute from "./routes/like.route.js";
import commentRoute from "./routes/comment.route.js";

// route define
app.use("/api/v1/user", authRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/like", likeRoute);
app.use("/api/v1/comment", commentRoute);

export { app };
