import { Router } from "express";
import {
  createBlogPost,
  getAllTheBlogPosts,
  updateTheBlogImage,
  updateTheBlogDetails,
  deleteTheBlogWithImage,
  getTheBlog,
} from "../controllers/blog.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/create-blog-post")
  .post(upload.single("blogImg"), verifyJwt, createBlogPost);
router.route("/get-all-posts").get(getAllTheBlogPosts);
router
  .route("/update-the-blog-image/:blogId")
  .patch(upload.single("blogImg"), verifyJwt, updateTheBlogImage);
router
  .route("/update-blog-details/:blogId")
  .patch(verifyJwt, updateTheBlogDetails);

router.route("/delete-blog/:blogId").delete(verifyJwt, deleteTheBlogWithImage);

router.route("/get-blog/:blogId").get(verifyJwt, getTheBlog);

export default router;
