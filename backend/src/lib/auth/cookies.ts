import type { Response } from "express";
const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
};

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie("accessToken", accessToken, {
        ...baseCookieOptions,
        maxAge: 1000 * 60 * 15, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
        ...baseCookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
}

export function clearAuthCookies(res: Response) {
    res.clearCookie("accessToken", baseCookieOptions);
    res.clearCookie("refreshToken", baseCookieOptions);
}