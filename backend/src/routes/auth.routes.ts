import { Router } from "express";
import { requestRegistrationOtp, verifyRegistrationOtp, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register/request-otp", requestRegistrationOtp);
router.post("/register/verify-otp", verifyRegistrationOtp);
router.post("/register", register)

export default router;