import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Joi from "joi";

export const createComments = asyncHandler(async (req, res) => {
  const createCommentsSchema = Joi.object({
    content: Joi.string().required().min(3).max(8000),
  });

  const { error } = createCommentsSchema.validate(req.body);

  if (error) {
    throw new ApiError(400, "Validation error");
  }

  const { content } = req.body;
  const { blogId } = req.params;
  const { user } = req;

  if (!content) {
    throw new ApiError(400, "Cannot comment empty");
  }

  const comment = await Comment.create({
    content: content,
    blog: blogId,
    author: user?._id,
  });

  if (!comment) {
    throw new ApiError(500, "Internal server error");
  }

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully"));
});

export const updateTheComment = asyncHandler(async (req, res) => {
  const createCommentsSchema = Joi.object({
    content: Joi.string().required().min(3).max(8000),
  });

  const { error } = createCommentsSchema.validate(req.body);

  if (error) {
    throw new ApiError(400, "Validation error");
  }

  const { content } = req.body;
  const { commentId } = req.params;

  if (!content) {
    throw new ApiError(400, "All fields are required");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content: content,
    },
    { new: true }
  );

  if (!comment) {
    throw new ApiError(500, "Internal server error");
  }

  res
    .status(200)
    .json(new ApiResponse(200, comment, "comment update successfully"));
});

export const deleteTheComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "comment not found");
  }

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    throw new ApiError(400, "Could not delete the comment");
  }

  res.status(200).json(new ApiResponse(200, {}, "comment deleted"));
});

export const getCommentsForBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const comments = await Comment.find({ blog: blogId });

  if (!comments) {
    throw new ApiError(404, "Comments not found for the specified blog post");
  }

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});
