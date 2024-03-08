import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import Joi from "joi";
import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBlogPost = asyncHandler(async (req, res) => {
  /*
  get the blog data
  validate the data
  if error give the error 
  upload the image to cloudinary
  get the blog update the data in database
  give the response
  */
  const createTheBlogPost = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  });

  const { error } = createTheBlogPost.validate(req.body);

  if (error) {
    throw new ApiError(422, `Validation Error ${error.message}`);
  }

  const { title, content } = req.body;
  const author = req.user;
  //   console.log(author.userName);

  if ([title, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const blogImageLocalPath = req.files?.blogImg?.[0]?.path;

  if (!blogImageLocalPath) {
    throw new ApiError(400, "Blog image file is required");
  }

  const uploadedBlogImage = await uploadOnCloudinary(blogImageLocalPath);

  //   console.log(uploadedBlogImage.public_id);

  const createdBlog = await Blog.create({
    title: title,
    content: content,
    blogImg: uploadedBlogImage.url,
    author: author,
  });

  if (!createdBlog) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdBlog, "Blog created successfully"));
});

export const getAllTheBlogPosts = asyncHandler(async (req, res) => {
  // pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  //   searching
  const searchQuery = {};
  if (req.query.search) {
    searchQuery.title = { $regex: req.query.search, $options: "i" };
  }

  //   sorting
  let sortQuery = { createdAt: -1 }; //new to old

  if (req.query.sort === "old_to_new") {
    sortQuery = { createdAt: 1 };
  }

  const blog = await Blog.aggregate([
    { $match: searchQuery },
    { $sort: sortQuery },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "blog",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "blog",
        as: "comments",
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        title: 1,
        blogImg: 1,
        likes: { $size: "$likes" },
        comments: { $size: "$comments" },
        author: { $arrayElemAt: ["$author.userName", 0] },
        createdAt: -1,
      },
    },
  ]);

  if (!blog) {
    throw new ApiError(404, "Could not find the data");
  }

  res
    .status(201)
    .json(new ApiResponse(200, blog, "blog data fetched successfully"));
});

export const updateTheBlogImage = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blogToUpdate = await Blog.findById(blogId);
  if (!blogToUpdate) {
    throw new ApiError(404, "Blog post not found");
  }

  // if (!req.files || !req.files.blogImg || req.files.blogImg.length === 0) {
  //   throw new ApiError(400, "Blog image file is required");
  // }

  const blogImageLocalPath = req.files?.blogImg?.[0]?.path;

  if (!blogImageLocalPath) {
    throw new ApiError(400, "Invalid blog image file path");
  }

  if (blogToUpdate.blogImg) {
    await deleteFromCloudinary(blogToUpdate.blogImg.split("/").pop());
  }

  const uploadedBlogImage = await uploadOnCloudinary(blogImageLocalPath);

  blogToUpdate.blogImg = uploadedBlogImage.url;
  await blogToUpdate.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, blogToUpdate, "Blog image updated successfully")
    );
});

export const updateTheBlogDetails = asyncHandler(async (req, res) => {
  const updateBlogDetailsSchema = Joi.object({
    title: Joi.string(),
    content: Joi.string(),
  });

  const { error } = updateBlogDetailsSchema.validate(req.body);

  if (error) {
    throw new ApiError(400, "Validation error");
  }

  const { title, content } = req.body;
  const { blogId } = req.params;

  if (!title && !content) {
    throw new ApiError(400, "Filed is required");
  }

  const blog = await Blog.findByIdAndUpdate(
    blogId,
    {
      title: title,
      content: content,
    },
    { new: true }
  );

  if (!blog) {
    throw new ApiError(400, "Blog not found");
  }

  res.status(200).json(new ApiResponse(200, blog, "blog update successfully"));
});

export const deleteTheBlogWithImage = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "cannot find the blog");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(400, "blog not found");
  }

  await deleteFromCloudinary(blog.blogImg.split("/").pop());

  await Blog.findByIdAndDelete(blog?._id);

  res.status(200).json(new ApiResponse(200, {}, "Blog deleted successfully"));
});

export const getTheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(400, "Blog not found");
  }

  res.status(200).json(new ApiResponse(200, blog, "Blog fetched successfully"));
});
