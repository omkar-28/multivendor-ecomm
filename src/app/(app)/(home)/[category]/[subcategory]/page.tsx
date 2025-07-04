import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductListSkeleton } from "@/modules/products/ui/components/product-list";
import { Suspense } from "react";
import { ProductListView } from "@/modules/products/views/product-list-view";
import { loadProductFilter } from "@/modules/products/search-params";
import type { SearchParams } from "nuqs/server";
import { DEFAULT_LIMIT } from "@/constant";

interface Props {
    params: Promise<{ subcategory: string }>;
    searchParams: Promise<SearchParams>;
}

const SubCategoryPage = async ({ params, searchParams }: Props) => {
    const { subcategory } = await params;
    const filters = await loadProductFilter(searchParams);

    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        ...filters,
        category: subcategory,
        limit: DEFAULT_LIMIT,
    }
    ));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ProductListSkeleton />}>
                <ProductListView category={subcategory} />
            </Suspense>
        </HydrationBoundary>
    )
}

export default SubCategoryPage;
