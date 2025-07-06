import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { Media, Tenant } from "@/payload-types";
import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { stripe } from "@/lib/stripe";

export const checkoutRouter = createTRPCRouter({
    purchase: protectedProcedure
        .input(
            z.object({
                productIds: z.array(z.string()).min(1, "At least one product ID is required"),
                tenantSlug: z.string().min(1, "Tenant slug is required"),
            })
        ).mutation(async ({ ctx, input }) => {
            const products = await ctx.payload.find({
                collection: 'products',
                depth: 2, // Populate "category", "image" and "tenant"
                where: {
                    and: [
                        {
                            id: {
                                in: input.productIds
                            }
                        },
                        {
                            "tenant.slug":
                            {
                                equals: input.tenantSlug
                            }
                        }
                    ]
                }
            });

            if (products?.totalDocs !== input.productIds.length) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Some products not found'
                });
            }

            const tenantData = await ctx.payload.find({
                collection: 'tenants',
                limit: 1,
                pagination: false,
                where: {
                    slug: {
                        equals: input.tenantSlug
                    }
                }
            });

            const tenant = tenantData?.docs[0];

            if (!tenant) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Tenant not found'
                });
            }

            // TODO: Throw error if stripe is not configured

            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.docs.map((product) => ({
                quantity: 1, // Assuming quantity is 1 for each product
                price_data: {
                    unit_amount: Number(product.price) * 100, // Convert to cents
                    currency: 'usd', // Assuming USD, change if needed
                    product_data: {
                        name: product.name,
                        metadata: {
                            stripeAccountId: tenant.stripeAccountId,
                            id: product.id,
                            name: product.name,
                            price: product.price
                        } as ProductMetadata, // Ensure metadata is typed correctly
                    },
                },
            }));

            const checkout = await stripe.checkout.sessions.create({
                customer_email: ctx.session.user?.email,
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
                mode: 'payment',
                line_items: lineItems,
                invoice_creation: {
                    enabled: true,
                },
                metadata: {
                    userId: ctx.session.user?.id,
                } as CheckoutMetadata,
            });

            if (!checkout.url) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to create checkout session'
                });
            }

            return {
                url: checkout.url,
            }

        }),
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