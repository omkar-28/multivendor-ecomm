import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
    tenantSlug: string;
    productId: string;
};

export const CartButton = ({ tenantSlug, productId }: Props) => {
    const cart = useCart(tenantSlug);

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