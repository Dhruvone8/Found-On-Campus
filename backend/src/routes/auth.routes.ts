import { Router } from "express";
import { requestRegistrationOtp } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register/request-otp", requestRegistrationOtp);

export default router;