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
        update: ({ req }) => isSuperAdmin(req?.user),
        delete: ({ req }) => isSuperAdmin(req?.user),
    },
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "description",
            // TODO: Change  to richText 
            type: "text",
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
            // TODO: Change  to richText 
            type: "textarea",
            admin: {
                description: "Protected content, only visible to the customer after purchase. Add product documentation, download files, getting started guides, and bonus content here. Supports markdown formatting.",
            }
        }
    ]
}