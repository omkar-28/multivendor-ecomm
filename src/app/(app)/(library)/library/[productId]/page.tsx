import { ProductView } from '@/modules/library/ui/view/product-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React from 'react'

interface Props {
    params: Promise<{ productId: string }>
}

const Page = async ({ params }: Props) => {
    const { productId } = await params;

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.library.getOne.queryOptions({
        productId: productId
    }));

    void queryClient.prefetchQuery(trpc.reviews.getOne.queryOptions({
        productId: productId
    }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductView productId={productId} />
        </HydrationBoundary>
    )
}

export default Page