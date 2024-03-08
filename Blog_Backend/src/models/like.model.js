import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
