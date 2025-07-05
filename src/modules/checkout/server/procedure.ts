import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { Media, Tenant } from "@/payload-types";
import { TRPCError } from "@trpc/server";

export const checkoutRouter = createTRPCRouter({

    getProducts: baseProcedure
        .input(
            z.object({
                ids: z.array(z.string())
            })
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.payload.find({
                collection: 'products',
                depth: 2, // Populate "category", "image" and "tenant"
                where: {
                    id: {
                        in: input.ids,
                    }
                }
            });

            if (data?.totalDocs !== input.ids.length) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Some products not found'
                });
            }

            const totalPrice = data.docs.reduce((acc, product) => {
                const price = Number(product.price) || 0; // Ensure price is a number
                return acc + (isNaN(price) ? 0 : price);
            }, 0);

            return {
                ...data,
                totalPrice,
                docs: data.docs.map((doc) => ({
                    ...doc,
                    image: doc.image as Media | null, // Ensure image is typed correctly
                    tenant: doc.tenant as Tenant & { image: Media | null }, // Ensure tenant is typed correctly
                })),
            }
        }),
});