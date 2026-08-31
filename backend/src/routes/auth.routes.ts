import { Router } from "express";
import {
    requestRegistrationOtp, verifyRegistrationOtp, register, login, refreshAccessToken, logout,
    requestPasswordResetOtp, verifyPasswordResetOtp, resetPassword
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register/request-otp", requestRegistrationOtp);
router.post("/register/verify-otp", verifyRegistrationOtp);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.post("/forgot-password", requestPasswordResetOtp);
router.post("/forgot-password/verify-otp", verifyPasswordResetOtp);
router.post("/reset-password", resetPassword);

export default router;