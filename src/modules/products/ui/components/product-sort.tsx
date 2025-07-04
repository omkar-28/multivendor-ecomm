"use client";

import { Button } from "@/components/ui/button";
import { useProductFilter } from "../../hooks/use-product-filter";
import { cn } from "@/lib/utils";

export const ProductSort = () => {
    const [filters, setFilters] = useProductFilter();
console.log(filters.sort);
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="secondary"
                size="sm"
                className={cn(
                    "rounded-full bg-white hover:bg-white border-2 norder-black",
                    filters.sort !== "newest" && "bg-transparent border-2 border-transparent hover:border-border hover:bg-white",
                )}
                onClick={() => setFilters((current) => ({
                    ...current,
                    sort: "newest",
                }))}
            >
                Newest
            </Button>

            <Button
                variant="secondary"
                size="sm"
                className={cn(
                    "rounded-full bg-white hover:bg-white",
                    filters.sort !== "oldest" && "bg-transparent border-transparent hover:border-border hover:bg-white",
                )}
                onClick={() => setFilters((current) => ({
                    ...current,
                    sort: "oldest",
                }))}
            >
                Oldest
            </Button>

            <Button
                variant="secondary"
                size="sm"
                className={cn(
                    "rounded-full bg-white hover:bg-white shadow-none",
                    filters.sort !== "default" && "bg-transparent border-transparent hover:border-border hover:bg-white",
                )}
                onClick={() => setFilters((current) => ({
                    ...current,
                    sort: "default",
                }))}
            >
                Default
            </Button>
        </div>
    )
}