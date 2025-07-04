"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { PriceFilter } from "./price-filter";
import { useProductFilter } from "../../hooks/use-product-filter";
import { TagsFilter } from "./tags-filter";

interface Props {
    title: string;
    classname?: string;
    children: React.ReactNode;
}

const ProductFilter = ({ title, classname, children }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

    return (
        <div className={cn(
            "p-4 border-b flex flex-col gap-2",
            classname
        )}>
            <div
                onClick={() => setIsOpen((current) => !current)}
                className="flex items-center justify-between cursor-pointer"
            >
                <p className="font-medium">{title}</p>
                <Icon className="size-5" />
            </div>
            {isOpen && children}
        </div>
    )
}

export const ProductFilters = () => {
    const [filters, setFilters] = useProductFilter();

    const hasAnyFilter = Object.entries(filters).some(([key, value]) => {
        if (key === "sort") return false; // Skip sort filter for this check

        if (Array.isArray(value)) {
            return value.length > 0;
        }

        if (typeof value === "string") {
            return value.trim() !== "";
        }
        return value !== null;
    });

    const onChange = (key: keyof typeof filters, value: unknown) => {
        setFilters((current) => ({
            ...current,
            [key]: value,
        }));
    }

    return (
        <div className="border rounded-md bg-white">
            <div className="p-4 border-b flex items-center justify-between">
                <p className="font-medium">Filters</p>

                {hasAnyFilter && <button className="underline" onClick={() => setFilters({
                    minPrice: "",
                    maxPrice: "",
                    tags: [],
                    sort: "default",
                })} type="button">
                    Clear
                </button>}
            </div>

            <ProductFilter title="Price">
                <PriceFilter
                    minPrice={filters?.minPrice}
                    maxPrice={filters?.maxPrice}
                    onMinPriceChange={(value) => onChange("minPrice", value)}
                    onMaxPriceChange={(value) => onChange("maxPrice", value)}
                />
            </ProductFilter>

            <ProductFilter title="Tags" classname="border-b-0">
                <TagsFilter
                    value={filters?.tags}
                    onChange={(value) => onChange("tags", value)}
                />
            </ProductFilter>
        </div>
    )
}