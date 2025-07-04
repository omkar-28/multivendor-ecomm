import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

export const categoriesRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ({ ctx }) => {

        const data = await ctx.payload.find({
            collection: 'categories',
            depth: 1,
            pagination: false,
            where: {
                parent: {
                    exists: false, // Only fetch top-level categories
                }
            },
            sort: 'name',
        });

        const formattedData = data?.docs.map((doc) => ({
            ...doc,
            subcategories: (doc.subcategories?.docs ?? [])?.map((subcat) => ({
                ...(subcat as Category),
            }))
        }));

        return formattedData;
    }),
});