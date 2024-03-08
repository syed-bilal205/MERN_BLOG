import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import mongoose from "mongoose";

export const toggleLike = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  // const { user } = req;

  if (!blogId) {
    throw new ApiError(400, "Blog id not exist");
  }

  const likes = await Like.findOne({
    likedBy: req.user?._id,
    blog: blogId,
  });

  if (!likes) {
    await Like.create({
      likedBy: req.user?._id,
      blog: blogId,
    });
    const totalLikes = await Like.countDocuments({ blog: blogId });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: true, totalLikes },
          "Liked Successfully"
        )
      );
  } else {
    await Like.deleteOne({ _id: likes?._id });
    const totalLikes = await Like.countDocuments({ blog: blogId });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: false, totalLikes },
          "unLiked successfully"
        )
      );
  }
});
