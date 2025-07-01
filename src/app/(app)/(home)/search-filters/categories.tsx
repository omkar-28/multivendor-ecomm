"use client";

import { useEffect, useRef, useState } from "react";
import { CategoryDropdown } from "./category-dropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategoriesSideBar } from "./categories-sidebar";
import { CustomCategoriesManyOutput } from "@/modules/categories/types";

interface CategoriesProps {
    data: CustomCategoriesManyOutput; // Adjust the type as per your data structure
}

export const Categories = ({ data }: CategoriesProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const viewAllRef = useRef<HTMLDivElement>(null);

    const [visibleCount, setVisibleCount] = useState(data.length);
    const [isAnyHovered, setIsAnyHovered] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const activeCategory = 'all';
    const activeCategoryIndex = data.findIndex((category) => category.slug === activeCategory);
    const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

    useEffect(() => {
        const calculateWidth = () => {
            if (!containerRef.current || !measureRef.current || !viewAllRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            const viewAllWidth = viewAllRef.current.offsetWidth;
            const availableWidth = containerWidth - viewAllWidth

            const items = Array.from(measureRef?.current?.children);
            let totalWidth = 0;
            let visible = 0

            for (const item of items) {
                const width = item.getBoundingClientRect().width

                if (totalWidth + width > availableWidth) break;

                totalWidth += width
                visible++
            }

            setVisibleCount(visible)
        }

        const resizeObserver = new ResizeObserver(calculateWidth);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [data.length]);

    return (
        <div className="relative w-full">
            <CategoriesSideBar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
            {/* Hidden div to measure all the items */}
            <div
                ref={measureRef} className="absolute opacity-0 pointer-events-none flex"
                style={{ position: 'fixed', top: -99999, left: -9999 }}
            >
                {data.map((category) => {
                    return <div key={category.id}>
                        <CategoryDropdown
                            category={category}
                            isActive={activeCategory === category.slug}
                            isNavigationHovered={false}
                        />
                    </div>
                })}
            </div>

            <div
                ref={containerRef}
                className="flex flex-nowrap items-center"
                onMouseEnter={() => setIsAnyHovered(true)}
                onMouseLeave={() => setIsAnyHovered(false)}
            >
                {data.slice(0, visibleCount).map((category) => {
                    return <div key={category.id}>
                        <CategoryDropdown
                            category={category}
                            isActive={activeCategory === category.slug}
                            isNavigationHovered={false}
                        />
                    </div>
                })}

                <div ref={viewAllRef} className="shrink-0">
                    <Button
                        className={cn(
                            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white text-black",
                            isActiveCategoryHidden && !isAnyHovered && "bg-white border-primary"
                        )}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        View All
                        <ListFilterIcon className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}