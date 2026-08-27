import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { requestOtp, verifyOtpCode } from "../services/auth/otp.service.js";
import { sendRegistrationOtpEmail } from "../services/email/email.service.js";
import { verifyOtp } from "../lib/auth/otp.js";

export async function requestRegistrationOtp(req: Request, res: Response) {
    try {
        // Validate the request body
        const { email } = req.body;

        // Validate the email
        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Normalize the email to lowercase and trim whitespace
        const normalizedEmail = email.trim().toLowerCase();

        // Validate whether the email is a valid VIT email address
        const isCollegeEmail = normalizedEmail.endsWith("@vit.edu.in");
        const isDevTestEmail =
            process.env.NODE_ENV !== "production" &&
            normalizedEmail === process.env.DEV_TEST_EMAIL;

        if (!isCollegeEmail && !isDevTestEmail) {
            return res.status(400).json({
                message: "Email must be a valid VIT email address",
            });
        }

        // Check if the user already exists in the database
        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Request an OTP for registration
        const otp = await requestOtp(normalizedEmail, "REGISTRATION");

        // Send the OTP to the user's email
        await sendRegistrationOtpEmail(normalizedEmail, otp);

        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("Error requesting registration OTP:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function verifyRegistrationOtp(req: Request, res: Response) {
    try {
        // Validate the request body
        const { email, otp } = req.body;

        // Validate the email
        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({
                message: "Email is Required",
            });
        }

        // Validate the Otp
        if (typeof otp !== "string" || !/^\d{4}$/.test(otp)) {
            return res.status(400).json({
                message: "A Valid 4 - digit Otp Code is required",
            });
        }

        // Normalize the email
        const normalizedEmail = email.trim().toLowerCase();

        // Check if the otp is valid for the given email and purpose
        const isVerified = await verifyOtpCode(
            normalizedEmail, otp, "REGISTRATION",
        );

        // If OTP verification fails
        if (!isVerified) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
            });
        };

        return res.status(200).json({
            message: "Email Verified Successfully",
        });

    } catch (error) {
        console.error("Error verifying registration OTP", error);
        return res.status(500).json({ message: "Interval Server Error" });
    }
}