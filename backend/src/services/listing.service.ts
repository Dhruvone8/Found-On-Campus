import { prisma } from "../lib/prisma.js"
import { AppError } from "../lib/error.js";

interface CreateListingData {
    sellerId: string;
    title: string;
    description: string;
    price: number;
    categoryId: string;
    condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";
    brand?: string;
    color?: string;
    model?: string;
}

export async function createListing(data: CreateListingData) {
    const category = await prisma.category.findUnique({
        where: {
            id: data.categoryId,
        }
    });

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    const listing = await prisma.listing.create({
        data: {
            sellerId: data.sellerId,
            title: data.title,
            description: data.description,
            price: data.price,
            categoryId: data.categoryId,
            condition: data.condition,

            ...(data.brand !== undefined && {
                brand: data.brand
            }),

            ...(data.color !== undefined && {
                color: data.color
            }),

            ...(data.model !== undefined && {
                model: data.model
            })
        }
    });

    return listing;
}

export async function getListingById(listingId: string) {
    const listing = await prisma.listing.findUnique({
        where: {
            id: listingId
        },
        include: {
            category: true,
        }
    });

    if (!listing) {
        throw new AppError("Listing not Found", 404);
    }

    return listing;
}