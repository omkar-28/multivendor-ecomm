import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";
import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
    slug: 'products',
    access: {
        create: ({ req }) => {
            if (isSuperAdmin(req?.user)) return true;
            const tenant = req?.user?.tenants?.[0]?.tenant as Tenant;

            return Boolean(tenant?.stripeDetailsSubmitted);
        },
        delete: ({ req }) => isSuperAdmin(req?.user),
    },
    admin: {
        useAsTitle: 'name',
        description: "You must verify your Stripe account before creating products. Products are visible to customers only after purchase.",
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "description",
            type: "richText",
        },
        {
            name: "price",
            type: "number",
            required: true,
            admin: {
                description: "Price in USD",
            }
        },
        {
            name: "category",
            type: "relationship",
            relationTo: 'categories',
            hasMany: false,
        },
        {
            name: "tags",
            type: "relationship",
            relationTo: 'tags',
            hasMany: false,
        },
        {
            name: "image",
            type: "upload",
            relationTo: 'media',
        },
        {
            name: "coverImage",
            type: "upload",
            relationTo: 'media',
        },
        {
            name: "refundPolicy",
            type: "select",
            options: ["30-days", "14-days", "7-days", "3-days", "1-day", "no-refund"],
            defaultValue: "30-days",
        },
        {
            name: "content",
            type: "richText",
            admin: {
                description: "Protected content, only visible to the customer after purchase. Add product documentation, download files, getting started guides, and bonus content here. Supports markdown formatting.",
            }
        },
        {
            name: "isPrivate",
            label: "Private Product",
            type: "checkbox",
            defaultValue: false,
            admin: {
                description: "Private products are not visible to customers in the store. They can only be purchased via a direct link.",
            }
        },
        {
            name: "isArchived",
            label: "Archive",
            defaultValue: false,
            type: "checkbox",
            admin: {
                description: "Archive this product to hide it from the store. It will not be visible to customers.",
            }
        },
    ]
}