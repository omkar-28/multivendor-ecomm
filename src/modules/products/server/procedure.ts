import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Sort, Where } from "payload";
import { z } from "zod";
import { Category, Media, Tenant } from "@/payload-types";
import { sortValues } from "../search-params";
import { DEFAULT_CURSOR, DEFAULT_LIMIT } from "@/constant";
import { headers as nextHeaders } from "next/headers";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const headers = await nextHeaders();
            const session = await ctx.payload.auth({ headers });
            let isPurchased = false;
            // Fetch a single product by ID
            const data = await ctx.payload.findByID({
                collection: 'products',
                id: input.id,
                depth: 2, // Populate "category", "image" and "tenant"
                select: {
                    content: false, // Exclude content field
                }
            });

            if (data?.isArchived) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Product not found or has been archived.',
                });
            }

            if (session && session.user) {
                // If the user is authenticated, populate the tenant image
                const ordersData = await ctx.payload.find({
                    collection: 'orders',
                    pagination: false,
                    limit: 1,
                    where: {
                        and: [
                            {
                                product: {
                                    equals: input.id, // Match the product ID
                                }
                            },
                            {
                                user: {
                                    equals: session.user.id, // Match the authenticated user ID
                                }
                            }
                        ],
                    },
                });

                isPurchased = !!ordersData.docs[0] // Check if the user has purchased the product
            }

            const review = await ctx.payload.find({
                collection: 'reviews',
                pagination: false,
                where: {
                    product: {
                        equals: input.id, // Match the product ID
                    },
                },
            });

            const reviewRating = review?.docs.length > 0
                ? review.docs.reduce((acc, review) => acc + review.rating, 0) / review?.totalDocs : 0; // Calculate average rating

            const ratingDistribution: Record<number, number> = {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0,
            };

            // Calculate rating distribution
            if (review?.totalDocs > 0) {
                review.docs.forEach((review) => {
                    const rating = review.rating;
                    // Ensure rating is between 1 and 5
                    if (rating >= 1 && rating <= 5) {
                        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
                    }
                });

                Object.keys(ratingDistribution).forEach((key) => {
                    const rating = Number(key);
                    const count = ratingDistribution[rating] || 0;
                    ratingDistribution[rating] = Math.round((count / review.totalDocs) * 100); // Convert to percentage
                });
            }

            return {
                ...data,
                isPurchased, // Add isPurchased flag to the response
                image: data.image as Media | null, // Ensure image is typed correctly
                coverImage: data.coverImage as Media | null, // Ensure coverImage is typed correctly
                tenant: data.tenant as Tenant & { image: Media | null }, // Ensure tenant is typed correctly
                reviewRating, // Add average rating to the response
                reviewCount: review?.totalDocs || 0, // Add review count to the response
                ratingDistribution
            }
        }),
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z.number().default(DEFAULT_CURSOR), // Default cursor for pagination
                limit: z.number().default(DEFAULT_LIMIT), // Default limit for pagination
                category: z.string().nullable().optional(), // Optional category filter
                minPrice: z.string().nullable().optional(), // Optional minimum price filter
                maxPrice: z.string().nullable().optional(), // Optional maximum price filter
                tags: z.array(z.string()).nullable().optional(), // Optional tags filter
                sort: z.enum(sortValues).nullable().optional(), // Sorting option
                tenantSlug: z.string().nullable().optional(), // Optional tenant slug filter
            })
        )
        .query(async ({ ctx, input }) => {
            const where: Where = {
                isArchived: {
                    not_equals: true, // Filter out archived products
                },
            };
            let sort: Sort = "-createdAt"; // Default sort by createdAt in descending order

            if (input.sort === "newest") {
                // If sort is provided, set the sort order based on the input
                sort = "name"; // Sort by createdAt in descending order
            } else if (input.sort === "oldest") {
                sort = "createdAt"; // Sort by createdAt in ascending order
            }

            // If minPrice is provided, filter products by minimum price
            if (input.minPrice) {
                where.price = {
                    ...where.price, // Preserve existing price conditions
                    greater_than_equal: (input.minPrice),
                };
            }
            // If maxPrice is provided, filter products by maximum price
            if (input.maxPrice) {
                where.price = {
                    ...where.price, // Preserve existing price conditions
                    less_than_equal: (input.maxPrice),
                };
            }

            if (input.tenantSlug) {
                // If tenantSlug is provided, filter products by tenant slug
                where['tenant.slug'] = {
                    equals: input.tenantSlug,
                };
            } else {
                where["isPrivate"] = {
                    not_equals: true, // Filter out private products if tenantSlug is not provided
                };
            }

            if (input.category) {
                // If category is provided, filter products by category
                const categoriesData = await ctx.payload.find({
                    collection: 'categories',
                    limit: 1,
                    depth: 1, // Populate "subcategories"
                    pagination: false,
                    where: {
                        slug: {
                            equals: input.category,
                        }
                    }
                });

                const formattedData = categoriesData?.docs.map((doc) => ({
                    ...doc,
                    subcategories: (doc.subcategories?.docs ?? [])?.map((subcat) => ({
                        ...(subcat as Category),
                        subcategories: undefined,
                    }))
                }));

                const subCategoriesSlugs = []
                const parentCategory = formattedData[0];

                if (parentCategory) {
                    subCategoriesSlugs.push(...parentCategory.subcategories.map((subCategory) => subCategory.slug));

                    where["category.slug"] = {
                        in: [parentCategory.slug, ...subCategoriesSlugs], // Filter products by category slug  
                    };
                }

            }

            if (input.tags && input.tags.length > 0) {
                // If tags are provided, filter products by tags
                where['tags.name'] = {
                    in: input.tags,
                };
            }

            const data = await ctx.payload.find({
                collection: 'products',
                depth: 2, // Populate "category", "image" and "tenant"
                where,
                sort,
                page: input.cursor, // Use cursor for pagination
                limit: input.limit,
                select: {
                    content: false, // Exclude content field
                }
            });

            const dataWithReviews = await Promise.all(
                data.docs.map(async (doc) => {
                    const reviewsData = await ctx.payload.find({
                        collection: 'reviews',
                        pagination: false,
                        where: {
                            product: {
                                equals: doc.id, // Match the product ID
                            },
                        },
                    });

                    return {
                        ...doc,
                        reviewCount: reviewsData.totalDocs, // Count of reviews for the product
                        reviewRating:
                            reviewsData?.docs.length === 0
                                ? 0
                                : reviewsData.docs.reduce((acc, review) => acc + review.rating, 0) / reviewsData?.totalDocs, // Average rating
                    }
                })
            )

            return {
                ...data,
                docs: dataWithReviews.map((doc) => ({
                    ...doc,
                    image: doc.image as Media | null, // Ensure image is typed correctly
                    tenant: doc.tenant as Tenant & { image: Media | null }, // Ensure tenant is typed correctly
                })),
            }
        }),
});