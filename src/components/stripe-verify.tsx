import { Button, Link } from '@payloadcms/ui';

export const StripeVerify = () => {
    return (
        <Link href="/stripe-verify">
            <Button
                className="w-full"
            >
                Verify Stripe Account
            </Button>
        </Link>
    )
};