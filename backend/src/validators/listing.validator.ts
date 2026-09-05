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

export const updateListingSchema = z.object({
    title: z.string().trim().min(3).max(50).optional(),
    description: z.string().trim().min(10).max(200).optional(),
    price: z.number().nonnegative().optional(),
    categoryId: z.string().min(1).optional(),
    condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]).optional(),

    brand: z.string().trim().max(20).nullable().optional(),
    color: z.string().trim().max(15).nullable().optional(),
    model: z.string().trim().max(30).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided" });

export const updateListingStatusSchema = z.object({
    status: z.enum(["ACTIVE", "RESERVED", "SOLD"]),
})

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
})