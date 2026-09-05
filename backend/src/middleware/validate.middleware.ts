import type { Response, Request, NextFunction } from 'express';
import { z } from "zod";

export const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues,
            });
        }

        req.body = result.data;
        next();
    }
}

export const validateQuery = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation Failed",
                errors: result.error.issues
            });
        }

        res.locals.validatedQuery = result.data;

        next();
    }
}