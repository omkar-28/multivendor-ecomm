import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { Media, Tenant } from "@/payload-types";

import { DEFAULT_CURSOR, DEFAULT_LIMIT } from "@/constant";
import { TRPCError } from "@trpc/server";

export const libraryRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const ordersData = await ctx.payload.find({
                collection: 'orders',
                limit: 1, // Limit to 1 to get the specific product   
                pagination: false, // Disable pagination to get a single order
                where: {
                    and: [
                        {
                            user: {
                                equals: ctx.session.user?.id,
                            },
                        },
                        {
                            product: {
                                equals: input.productId,
                            },
                        },
                    ]
                }
            });

            const order = ordersData?.docs[0];

            if (!order) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `Order for product ${input.productId} not found for user ${ctx.session.user?.id}`,
                });
            }

            const productsData = await ctx.payload.findByID({
                collection: 'products',
                id: input.productId,
            });

            if (!productsData) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `Product with ID ${input.productId} not found`,
                });
            }

            return productsData
        }),
    getMany: protectedProcedure
        .input(
            z.object({
                cursor: z.number().default(DEFAULT_CURSOR), // Default cursor for pagination
                limit: z.number().default(DEFAULT_LIMIT), // Default limit for pagination
            }),
        )
        .query(async ({ ctx, input }) => {
            const ordersData = await ctx.payload.find({
                collection: 'orders',
                depth: 0, // We want get ids, without populating
                page: input.cursor, // Use cursor for pagination
                limit: input.limit,
                where: {
                    user: {
                        equals: ctx.session.user?.id,
                    },
                }
            });

            const productIds = ordersData?.docs.map((order) => order.product) || [];
            const productsData = await ctx.payload.find({
                collection: 'products',
                pagination: false,
                where: {
                    id: {
                        in: productIds,
                    },
                },
            });

            const dataWithReviews = await Promise.all(
                productsData.docs.map(async (doc) => {
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
                ...productsData,
                docs: dataWithReviews.map((doc) => ({
                    ...doc,
                    image: doc.image as Media | null, // Ensure image is typed correctly
                    tenant: doc.tenant as Tenant & { image: Media | null }, // Ensure tenant is typed correctly
                })),
            }
        }),
});