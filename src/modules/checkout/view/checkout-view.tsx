"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../hooks/use-cart";
import { toast } from "sonner";
import { generateTenantURL } from "@/lib/utils";
import { CheckoutItem, CheckoutItemSkeleton } from "../ui/components/checkout-items";
import { CheckoutSidebar, CheckoutSidebarSkeleton } from "../ui/components/checkout-sidebar";
import { InboxIcon } from "lucide-react";

interface Props {
    tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: Props) => {
    const { productIds, clearAllCarts, removeProduct } = useCart(tenantSlug);
    const trpc = useTRPC();
    const { data, error, isLoading } = useQuery(trpc.checkout.getProducts.queryOptions({
        ids: productIds,
    }));

    if (error) {
        if (error.data?.code === "NOT_FOUND") {
            clearAllCarts();
            toast.error("Invalid products found, Cart cleared.");
        }
        return (
            <div className="flex items-center flex-col justify-center h-full">
                <h1 className="text-2xl font-bold">{tenantSlug}</h1>
                <p className="text-red-500">Error: {error.message}</p>
            </div>
        );
    }

    if (!isLoading && data?.docs.length === 0) {
        return (
            <div className="lg:pt-16 pt-4 px-4 lg:px-12">
                <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                    <InboxIcon />
                    <p className="text-base font-medium">No products found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
                <div className="lg:col-span-4">
                    <div className="border border-black rounded-md overflow-hidden bg-white">
                        {isLoading ? (
                            <CheckoutItemSkeleton />
                        ) : <>
                            {data?.docs.map((product, index) => (
                                <CheckoutItem
                                    key={product.id}
                                    isLast={index === data.docs.length - 1}
                                    imageUrl={product?.image?.url || ""}
                                    name={product?.name || ""}
                                    productUrl={`${generateTenantURL(product?.tenant?.slug)}/products/${product?.id}`}
                                    tenantUrl={generateTenantURL(product?.tenant?.slug)}
                                    tenantName={product?.tenant?.name || ""}
                                    price={product?.price || 0}
                                    onRemove={() => removeProduct(product.id)}
                                />

                            ))}
                        </>
                        }

                    </div>
                </div>
                <div className="lg:col-span-3">
                    {isLoading ? (
                        <CheckoutSidebarSkeleton />
                    ) : (
                        <CheckoutSidebar
                            total={data?.totalPrice || 0}
                            onCheckout={() => { }}
                            isCanceled={false}
                            isPending={false}
                        />)}

                </div>
            </div>
        </div>
    );
}