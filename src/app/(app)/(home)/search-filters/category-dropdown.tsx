"use client";
import { Button } from "@/components/ui/button";
import { useDropdownPosition } from "@/hooks/use-dropdown-position";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import { useRef, useState } from "react";
import { SubCategoryMenu } from "./sub-category-menu";

interface CategoryDropdownProps {
    category: Category;
    isActive: boolean;
    isNavigationHovered: boolean;
}
export const CategoryDropdown = ({ category, isActive, isNavigationHovered }: CategoryDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null);
    const position = useDropdownPosition(dropDownRef);

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
        >
            <div className="relative">
                <Button variant='elevated' className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white text-black hover:border-primary", isActive && !isNavigationHovered && "bg-white border-primary")} >
                    {category.name}
                </Button>

                {category?.subcategories?.length > 0 && (
                    <div className={cn("opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -trnaslte-x-1/2", isOpen && "opacity-100")} />
                )}
            </div>
            <SubCategoryMenu
                category={category}
                isOpen={isOpen}
                position={position}
            />
        </div>
    );
}