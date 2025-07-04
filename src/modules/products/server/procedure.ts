import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from "payload";
import { z } from "zod";
import { Category } from "@/payload-types";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                category: z.string().nullable().optional(), // Optional category filter
                minPrice: z.string().nullable().optional(), // Optional minimum price filter
                maxPrice: z.string().nullable().optional(), // Optional maximum price filter
            })
        )
        .query(async ({ ctx, input }) => {
            const where: Where = {};

            // If minPrice is provided, filter products by minimum price
            if (input.minPrice) {
                where.price = {
                    greater_than_equal: (input.minPrice),
                };
            }
            // If maxPrice is provided, filter products by maximum price
            if (input.maxPrice) {
                where.price = {
                    less_than_equal: (input.maxPrice),
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

            const data = await ctx.payload.find({
                collection: 'products',
                depth: 1, // Populate "category", "image"
                where,
            });

            return data
        }),
});