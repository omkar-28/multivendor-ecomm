"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { SubCategoryMenu } from "./sub-category-menu";
import Link from "next/link";
import { CustomCategoriesManyOutput } from "@/modules/categories/types";

interface CategoryDropdownProps {
    category: CustomCategoriesManyOutput[1];
    isActive: boolean;
    isNavigationHovered: boolean;
}
export const CategoryDropdown = ({ category, isActive, isNavigationHovered }: CategoryDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null);

    const onMouseEnter = () => {
        if (category?.subcategories)
            setIsOpen(true);
    }
    const onMouseLeave = () => {
        setIsOpen(false);
    }
    return (
        <div
            ref={dropDownRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="relative"
        >
            <div className="relative">
                <Button variant='elevated' className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white text-black hover:border-primary", isActive && !isNavigationHovered && "bg-white border-primary", isOpen && "bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0)] -translate-x-[4px] -translate-y-[4px]")} >
                    <Link href={`/${category?.slug === 'all' ? "" : category?.slug}`}>
                        {category.name}
                    </Link>
                </Button>

                {category?.subcategories && category?.subcategories?.length > 0 && (
                    <div className={cn("opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -trnaslte-x-1/2", isOpen && "opacity-100")} />
                )}
            </div>
            <SubCategoryMenu
                category={category}
                isOpen={isOpen}
            />
        </div>
    );
}