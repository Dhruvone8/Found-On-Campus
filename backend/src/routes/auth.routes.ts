import { Router } from "express";
import { requestRegistrationOtp, verifyRegistrationOtp } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register/request-otp", requestRegistrationOtp);
router.post("/register/verify-otp", verifyRegistrationOtp);

export default router;