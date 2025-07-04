import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { loadProductFilter } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/views/product-list-view";

interface Props {
    params: Promise<{ category: string }>;
    searchParams: Promise<SearchParams>;
}

const ProductPage = async ({ params, searchParams }: Props) => {
    const { category } = await params;
    const filters = await loadProductFilter(searchParams);

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({ category, ...filters }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={category} />
        </HydrationBoundary>
    )
}

export default ProductPage;
