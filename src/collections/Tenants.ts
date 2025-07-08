import { isSuperAdmin } from '@/lib/access'
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    access: {
        read: () => true,
        create: ({ req }) => isSuperAdmin(req?.user),
        delete: ({ req }) => isSuperAdmin(req?.user),
    },
    admin: {
        useAsTitle: 'slug',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Store name',
            admin: {
                description: 'The name of the store (e.g. Shopnex store), displayed in the header and footer.',
            },
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            index: true,
            unique: true,
            access: {
                create: ({ req }) => isSuperAdmin(req?.user),
            },
            admin: {
                description: 'The slug of the store (e.g. [slug].shopnex.com), used in the URL.',
            },
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'stripeAccountId',
            type: 'text',
            required: true,
            access: {
                update: ({ req }) => isSuperAdmin(req?.user),
            },
            admin: {
                description: 'Stripe account ID associated with your shop/tenant. This is automatically set when the tenant submits their Stripe account details.',
            },
        },
        {
            name: 'stripeDetailsSubmitted',
            type: 'checkbox',
            admin: {
                description: 'You cannot create products until you have a Stripe account set up. ',
            },
        }
    ],
}
