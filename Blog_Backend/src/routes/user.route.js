import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountsDetails,
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/get-current-user").get(verifyJwt, getCurrentUser);
router
  .route("/update-user-account-details")
  .post(verifyJwt, updateAccountsDetails);

export default router;
