import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { loadProductFilter } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/views/product-list-view";
import { DEFAULT_LIMIT } from "@/constant";

interface Props {
  searchParams: Promise<SearchParams>;
}

const HomePage = async ({ searchParams }: Props) => {
  const filters = await loadProductFilter(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
    ...filters,
    limit: DEFAULT_LIMIT
  }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  )
}

export default HomePage;
