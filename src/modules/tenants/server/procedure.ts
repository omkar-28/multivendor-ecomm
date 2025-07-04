import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const tenantaRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(
            z.object({
                slug: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const tenantsData = await ctx.payload.find({
                collection: 'tenants',
                depth: 1, //tenant.image
                where: {
                    slug: {
                        equals: input.slug,
                    },
                },
                limit: 1,
                pagination: false,
            });

            const tenant = tenantsData?.docs?.[0];
            if (!tenant) {
                throw new TRPCError({ code: "NOT_FOUND", message: `Tenant with slug ${input.slug} not found` });
            }

            return tenant as Tenant & { image: Media | null };
        }),
});