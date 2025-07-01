"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { SearchInput } from "../_components/search-input";
import { Categories } from "./categories";

export const SearchFilters = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
    return (
        <div className="px-4 lg:px-12 py-6 border-b flex flex-col gap-4 w-full" style={{backgroundColor: '#F5F5F5'}}>
            <SearchInput />
            <div className="hidden lg:block">
                <Categories data={data} />
            </div>
        </div>
    )
}

export const SearchFiltersLoading = () => {
    return (
        <div className="px-4 lg:px-12 py-6 border-b flex flex-col gap-4 w-full" style={{backgroundColor: '#F5F5F5'}}>
            <SearchInput disabled />
            <div className="hidden lg:block">
                <div className="h-11" />
            </div>
        </div>
    )
}