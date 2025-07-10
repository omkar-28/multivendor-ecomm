import { ProductView, ProductViewSkeleton } from "@/modules/products/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
    params: Promise<{ productId: string; slug: string }>;
}

const Page = async ({ params }: Props) => {
    const { productId, slug } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {/* HydrationBoundary is used to ensure that the data is available for the ProductView component */}
            <Suspense fallback={<ProductViewSkeleton />}>
                <ProductView
                    productId={productId}
                    tenantSlug={slug}
                />
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page