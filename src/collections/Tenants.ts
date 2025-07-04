import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
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
            admin: {
                readOnly: true,
            },
        },
        {
            name: 'stripeDetailsSubmitted',
            type: 'checkbox',
            admin: {
                readOnly: true,
                description: 'You cannot create products until you have a Stripe account set up. ',
            },
        }
    ],
}
