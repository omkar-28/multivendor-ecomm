"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useProductFilter } from "../../hooks/use-product-filter";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { DEFAULT_LIMIT } from "@/constant";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    category?: string; // Optional category filter
    tenantSlug?: string; // Optional tenant slug filter
    narrowView?: boolean; // Optional prop to indicate if the view is narrow
}

export const ProductList = ({ category, tenantSlug, narrowView }: Props) => {
    const [filters] = useProductFilter();
    const trpc = useTRPC();
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        ...filters,
        category: category,
        tenantSlug,
        limit: DEFAULT_LIMIT
    }, {
        getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        }
    }));

    if (data?.pages?.[0]?.docs.length === 0) {
        return (
            <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                <InboxIcon />
                <p className="text-base font-medium">No products found</p>
            </div>
        )
    }

    return (
        <>
            <div className={cn(
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
                narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
            )}>
                {data?.pages?.flatMap((page) => page.docs).map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        imageUrl={product.image?.url}
                        tenantSlug={product.tenant?.slug}
                        tenantImageUrl={product.tenant?.image?.url}
                        reviewRating={3}
                        reviewCount={5}
                    />
                ))}
            </div>

            <div className="flex justify-center pt-8">
                {hasNextPage && (
                    <Button
                        className="font-medium disabled:opacity-50 text-base bg-white"
                        variant='elevated'
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? "Loading..." : "Load More"}
                    </Button>
                )}
            </div>
        </>
    )
}

export const ProductListSkeleton = ({ narrowView }: Props) => {
    return (
        <div className={cn(
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
            narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
        )}>
            {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    )
}