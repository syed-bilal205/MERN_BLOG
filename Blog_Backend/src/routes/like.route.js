import { Router } from "express";
import { toggleLike } from "../controllers/like.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/blogs-likes/:blogId").patch(verifyJwt, toggleLike);

export default router;
