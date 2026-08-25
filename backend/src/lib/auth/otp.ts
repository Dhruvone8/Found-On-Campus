import { randomInt } from "node:crypto";
import argon2 from "argon2";

export function generateOtp(): string {
    return randomInt(1000, 10000).toString();
}

export async function hashOtp(otp: string): Promise<string> {
    return argon2.hash(otp);
}

export async function verifyOtp(otp: string, hashedOtp: string): Promise<boolean> {
    return argon2.verify(hashedOtp, otp);
}