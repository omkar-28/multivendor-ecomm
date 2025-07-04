import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductListSkeleton } from "@/modules/products/ui/components/product-list";
import { Suspense } from "react";
import { ProductListView } from "@/modules/products/views/product-list-view";
import { loadProductFilter } from "@/modules/products/search-params";
import type { SearchParams } from "nuqs/server";

interface Props {
    params: Promise<{ subcategory: string }>;
    searchParams: Promise<SearchParams>;
}

const SubCategoryPage = async ({ params, searchParams }: Props) => {
    const { subcategory } = await params;
    const filters = await loadProductFilter(searchParams);

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({ category: subcategory, ...filters }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ProductListSkeleton />}>
                <ProductListView category={subcategory} />
            </Suspense>
        </HydrationBoundary>
    )
}

export default SubCategoryPage;
