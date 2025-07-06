import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { Media, Tenant } from "@/payload-types";

import { DEFAULT_CURSOR, DEFAULT_LIMIT } from "@/constant";

export const libraryRouter = createTRPCRouter({
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
            })

            return {
                ...productsData,
                docs: productsData.docs.map((doc) => ({
                    ...doc,
                    image: doc.image as Media | null, // Ensure image is typed correctly
                    tenant: doc.tenant as Tenant & { image: Media | null }, // Ensure tenant is typed correctly
                })),
            }
        }),
});