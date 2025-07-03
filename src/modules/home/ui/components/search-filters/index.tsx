"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { SearchInput } from "./search-input";
import { Categories } from "./categories";
import { useParams } from "next/navigation";
import { DEFAULT_BG_COLOR } from "@/modules/home/constant";
import { BreadCrumbNavigation } from "./breadcrumbs-nav";

export const SearchFilters = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

    const params = useParams();
    const categoryParam = params.category as string | undefined;
    const activeCategory = categoryParam || 'all';

    const activeCategoryData = data.find((category) => category.slug === activeCategory);

    const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR; // Default color if not found
    const activeCategoryName = activeCategoryData?.name || null; // Default name if not found

    const activeSubCategory = params.subcategory as string | undefined;
    const activeSubCategoryName = activeCategoryData?.subcategories.find((subcategory) => subcategory.slug === activeSubCategory)?.name || undefined;

    return (
        <div className="px-4 lg:px-12 py-6 border-b flex flex-col gap-4 w-full" style={{ backgroundColor: activeCategoryColor }}>
            <SearchInput />
            <div className="hidden lg:block">
                <Categories data={data} />
            </div>

            <BreadCrumbNavigation
                activeCategory={activeCategory}
                activeCategoryName={activeCategoryName}
                activeSubCategoryName={activeSubCategoryName}
            />

        </div>
    )
}

export const SearchFiltersLoading = () => {
    return (
        <div className="px-4 lg:px-12 py-6 border-b flex flex-col gap-4 w-full" style={{ backgroundColor: '#F5F5F5' }}>
            <SearchInput disabled />
            <div className="hidden lg:block">
                <div className="h-11" />
            </div>
        </div>
    )
}