import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import Link from "next/link";

interface Props {
    tenantSlug: string;
    productId: string;
    isPurchased?: boolean; // Optional prop to indicate if the product is purchased
};

export const CartButton = ({ tenantSlug, productId, isPurchased }: Props) => {
    const cart = useCart(tenantSlug);

    if (isPurchased) {
        return (
            <Button
                asChild
                variant='elevated'
                className="size-12 flex-1 font-medium border-black bg-white"
            >
                <Link href={`/library/${productId}`}>
                    View in Library
                </Link>
            </Button>
        );
    }

    return (
        <Button
            variant="elevated"
            className={cn(
                "flex-1 bg-pink-400 border-black h-12 font-semibold",
                cart.isProductInCart(productId) && "bg-white"
            )}
            onClick={() => cart.toggleProduct(productId)}
        >
            {cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
        </Button>
    );
};

export const CartButtonSkeleton = () => {
    return (
        <Button
            variant="elevated"
            className="flex-1 bg-pink-400 border-black h-12 font-semibold animate-pulse"
            disabled
        >
            Loading...
        </Button>
    );
}