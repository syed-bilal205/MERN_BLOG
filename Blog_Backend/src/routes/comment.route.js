import { Router } from "express";
import {
  createComments,
  deleteTheComment,
  updateTheComment,
  getCommentsForBlog,
} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-comment/:blogId").post(verifyJwt, createComments);
router.route("/update-comment/:commentId").patch(verifyJwt, updateTheComment);
router.route("/delete-comment/:commentId").delete(verifyJwt, deleteTheComment);
router.route("/get-comments/:blogId").get(verifyJwt, getCommentsForBlog);

export default router;
