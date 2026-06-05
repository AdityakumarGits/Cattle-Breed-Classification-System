import express from "express";
import { signup, verifyOTP , login,  logout, googleLogin, forgotPassword,
  resetPassword } from "../controller/authcontroller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

export default router;


