import { z } from "zod";

export const createListingSchema = z.object({
    title: z.string().trim().min(3).max(50),
    description: z.string().trim().min(10).max(200),
    price: z.number().nonnegative(),
    categoryId: z.string().min(1),
    condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]),
    brand: z.string().trim().max(20).optional(),
    model: z.string().trim().max(30).optional(),
    color: z.string().trim().max(15).optional(),
});