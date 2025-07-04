import { DEFAULT_CURSOR, DEFAULT_LIMIT } from "@/constant";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const tagsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z.number().default(DEFAULT_CURSOR),
                limit: z.number().default(DEFAULT_LIMIT),
            })
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.payload.find({
                collection: 'tags',
                page: input.cursor,
                limit: input.limit,
            });

            return data
        }),
});