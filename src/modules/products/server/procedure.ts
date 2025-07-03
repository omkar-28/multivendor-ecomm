import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from "payload";
import { z } from "zod";
import { Category } from "@/payload-types";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                category: z.string().nullable().optional(), // Optional category filter
                limit: z.number().default(10), // Default limit for pagination
                offset: z.number().default(0), // Default offset for pagination
            })
        )
        .query(async ({ ctx, input }) => {
            const where: Where = {};
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
                }

                where["category.slug"] = {
                    in: [parentCategory.slug, ...subCategoriesSlugs], // Filter products by category slug  
                };
            }

            const data = await ctx.payload.find({
                collection: 'products',
                depth: 1, // Populate "category", "image"
                where,
            });

            return data
        }),
});