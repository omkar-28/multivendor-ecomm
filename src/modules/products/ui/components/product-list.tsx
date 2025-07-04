"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
    category?: string; // Optional category filter
}

export const ProductList = ({ category }: Props) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({ category }));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {data?.docs.map((product) => (
                <div key={product.id} className="border border-gray-200 p-4 rounded-md bg-white shadow-sm">
                    <h2 className="text-xl font-medium">{product.name}</h2>
                    <p className="text-gray-600">{product.description}</p>
                    <p className="text-xl font-bold mt-2">${product.price.toFixed(2)}</p>
                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    )
}

export const ProductListSkeleton = () => {
    return (
        <div>
            Loading products...
        </div>
    )
}