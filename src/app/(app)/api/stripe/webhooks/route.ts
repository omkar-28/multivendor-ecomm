import { Stripe } from 'stripe';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import { ExpandedLineItem } from '@/modules/checkout/types';


export async function POST(req: Request) {
    const payload = await getPayload({ config });
    const signature = req.headers.get('stripe-signature') as string;
    const body = await (await req.blob()).text();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        console.error(`Webhook Error: ${err}`);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    const permittedEvents: string[] = [
        'checkout.session.completed',
    ];

    if (permittedEvents.includes(event.type)) {
        let data;
        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    data = event.data.object as Stripe.Checkout.Session;

                    if (!data.metadata?.userId) {
                        throw new Error('User ID not found');
                    }

                    const user = await payload.findByID({
                        collection: 'users',
                        id: data.metadata.userId,
                    })

                    if (!user) {
                        throw new Error('User not found');
                    }

                    const expandedSession = await stripe.checkout.sessions.retrieve(data.id, {
                        expand: ['line_items.data.price.product'],
                    });

                    if (!expandedSession.line_items?.data || expandedSession.line_items.data.length === 0) {
                        throw new Error('No line items found in the session');
                    }

                    const lineItems = expandedSession.line_items.data as ExpandedLineItem[];

                    for (const item of lineItems) {
                        const productMetadata = item.price.product.metadata as {
                            stripeAccountId: string;
                            id: string;
                            name: string;
                            price: number;
                        };

                        if (!productMetadata.stripeAccountId || !productMetadata.id) {
                            throw new Error('Product metadata is missing required fields');
                        }

                        await payload.create({
                            collection: 'orders',
                            data: {
                                stripeCheckoutSessionId: data.id,
                                user: user.id,
                                product: productMetadata.id,
                                name: productMetadata.name,
                            },
                        });
                    }

                    break;
                default:
                    throw new Error(`Unhandled event type: ${event.type}`);
            }
        } catch (error) {
            console.error(`Error processing event ${event.type}:`, error);
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }
    }

    return NextResponse.json({ message: 'Webhook received successfully' }, { status: 200 });
}