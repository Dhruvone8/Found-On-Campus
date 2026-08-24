import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/auth/tokens.js"

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { payload } = await verifyAccessToken(accessToken);

        if (payload.type !== "access") {
            return res.status(401).json({ message: "Invalid access token" });
        }

        if (typeof payload.sub !== "string") {
            return res.status(401).json({ message: "Invalid access token" });
        }

        req.userId = payload.sub;

        next();
    } catch {
        return res.status(401).json({
            message: "Invalid access token"
        })
    }
}