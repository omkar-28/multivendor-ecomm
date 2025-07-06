import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const reviewsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const productData = await ctx.payload.findByID({
                collection: 'products',
                id: input.productId,
            });
            if (!productData) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
            }

            const reviewData = await ctx.payload.find({
                collection: 'reviews',
                where: {
                    and: [
                        {
                            product: {
                                equals: productData.id,
                            },
                        },
                        {
                            user: {
                                equals: ctx.session.user?.id,
                            },
                        },
                    ],
                },
                limit: 1,
            });

            const review = reviewData?.docs?.[0];

            if (!review) {
                return null
            }

            return review;
        }),
    create: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
                rating: z.number().min(1, { message: "Rating is required" }).max(5),
                description: z.string().min(1, "Description is required"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const product = await ctx.payload.findByID({
                collection: 'products',
                id: input.productId,
                depth: 0,
            });

            if (!product) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
            }

            const existingReview = await ctx.payload.find({
                collection: 'reviews',
                where: {
                    and: [
                        {
                            product: {
                                equals: product.id,
                            },
                        },
                        {
                            user: {
                                equals: ctx.session.user?.id,
                            },
                        },
                    ],
                },
                limit: 1,
            });

            if (existingReview?.docs?.length) {
                throw new TRPCError({ code: "CONFLICT", message: "You have already reviewed this product" });
            }

            const userId = ctx.session.user?.id;
            if (!userId) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "User ID is missing" });
            }
            const review = await ctx.payload.create({
                collection: 'reviews',
                data: {
                    product: product.id,
                    user: userId,
                    rating: input.rating,
                    description: input.description,
                },
            });

            return review;
        }),
    update: protectedProcedure
        .input(
            z.object({
                reviewId: z.string(),
                rating: z.number().min(1, { message: "Rating is required" }).max(5),
                description: z.string().min(1, "Description is required"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const review = await ctx.payload.findByID({
                collection: 'reviews',
                depth: 0,
                id: input.reviewId,
            });

            if (!review) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
            }

            if (review.user !== ctx.session.user?.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "You can only update your own reviews" });
            }

            const updatedReview = await ctx.payload.update({
                collection: 'reviews',
                id: input.reviewId,
                data: {
                    rating: input.rating,
                    description: input.description,
                },
            });

            return updatedReview;
        }),
});