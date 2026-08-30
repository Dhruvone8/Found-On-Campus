import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { requestOtp, verifyOtpCode } from "../services/auth/otp.service.js";
import { sendRegistrationOtpEmail } from "../services/email/email.service.js";
import { verifyOtp } from "../lib/auth/otp.js";
import argon2 from "argon2";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../lib/auth/tokens.js";
import { setAuthCookies, setAccessTokenCookie, clearAuthCookies } from "../lib/auth/cookies.js";

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

export async function register(req: Request, res: Response) {
    try {
        const { name, email, password, otp } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "Name is required" });
        }

        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const isCollegeEmail = normalizedEmail.endsWith("@vit.edu.in");
        const isDevTestEmail =
            process.env.NODE_ENV !== "production" &&
            normalizedEmail === process.env.DEV_TEST_EMAIL;

        if (!isCollegeEmail && !isDevTestEmail) {
            return res.status(400).json({
                message: "Email must be a valid VIT email address",
            });
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const verification = await prisma.verification.findFirst({
            where: {
                email: normalizedEmail,
                purpose: "REGISTRATION",
                verifiedAt: {
                    not: null,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!verification) {
            return res.status(400).json({ message: "Email not verified" });
        }

        const hashedPassword = await argon2.hash(password);

        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                passwordHash: hashedPassword,
                emailVerifiedAt: verification?.verifiedAt!,
            },
        });

        await prisma.verification.delete({
            where: {
                id: verification!.id,
            },
        });

        const accessToken = await createAccessToken(user.id);
        const refreshToken = await createRefreshToken(user.id);

        setAuthCookies(res, accessToken, refreshToken);

        return res.status(201).json({
            message: "Registration successful",
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ message: "Email is required" })
        }

        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({
                message: "Password is required"
            })
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user with the email 
        const user = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        // If user doesn't exist
        if (!user) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            })
        };

        // If user exists, Check account status
        if (user.status !== "ACTIVE") {
            return res.status(403).json({
                message: "Account is Banned or Suspended"
            })
        };

        if (!user.passwordHash) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        // If account is active, verify the password
        const isPasswordValid = await argon2.verify(user.passwordHash, password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            })
        };

        // If everything is fine, create the tokens and set cookies
        const accessToken = await createAccessToken(user.id);
        const refreshToken = await createRefreshToken(user.id);
        setAuthCookies(res, accessToken, refreshToken);

        return res.status(200).json({
            message: "Login Successful"
        });
    } catch (error) {
        console.error("Login error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

export async function refreshAccessToken(req: Request, res: Response) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = await verifyRefreshToken(refreshToken);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const accessToken = await createAccessToken(userId);

        setAccessTokenCookie(res, accessToken);

        return res.status(200).json({ message: "Access token refreshed successfully" });

    } catch (error) {
        console.error("Refresh token error", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export async function logout(_req: Request, res: Response) {
    clearAuthCookies(res);

    return res.status(200).json({ message: "Logout Successful" });
}