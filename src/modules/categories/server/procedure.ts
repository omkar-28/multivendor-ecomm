import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";


export type CustomCategory = Omit<Category, 'subcategories'> & {
    subcategories: CustomCategory[];
};

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

        const mapCategoryToCustomCategory = (category: Category): CustomCategory => ({
            ...category,
            subcategories: Array.isArray(category?.subcategories?.docs)
                ? (category.subcategories.docs as Category[])
                    .filter((subcat): subcat is Category => typeof subcat === 'object' && subcat !== null)
                    .map(mapCategoryToCustomCategory)
                : [],
        });

        const formattedData = (data.docs as Category[]).map(mapCategoryToCustomCategory);

        return formattedData;
    }),
});