import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
});

export async function sendEmail(to: string, subject: string, text: string) {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
    });
}

export async function sendRegistrationOtpEmail(email: string, otp: string) {
    await sendEmail(
        email,
        "SellOnCampus Email Verification",
        `Your SellOnCampus verification code is ${otp}. This code expires in 2 minutes`
    );
}

export async function sendPasswordResetOtpEmail(email: string, otp: string) {
    await sendEmail(
        email, "SellOnCampus Password Reset",
        `Your SellOnCampus password reset code is ${otp}. This code expires in 2 minutes`
    )
}