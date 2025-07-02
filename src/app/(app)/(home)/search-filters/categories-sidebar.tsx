"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { CustomCategoriesManyOutput } from "@/modules/categories/types";

interface CategoriesSideBarProps {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void
}
export const CategoriesSideBar = ({ open, onOpenChangeAction }: CategoriesSideBarProps) => {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.categories.getMany.queryOptions());

    const router = useRouter()
    const [parentCategories, setParentCategories] = useState<CustomCategoriesManyOutput | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CustomCategoriesManyOutput[1] | null>(null);

    //if we have parent category, show those or shor root category.
    const currentCategories = parentCategories ?? data ?? [];

    const handleOpenChange = (open: boolean) => {
        setSelectedCategory(null);
        setParentCategories(null)
        onOpenChangeAction(open)
    }

    function handleClickCategory(category: CustomCategoriesManyOutput[1]) {
        if (category?.subcategories && category?.subcategories?.length > 0) {
            setParentCategories(category?.subcategories as CustomCategoriesManyOutput);
            setSelectedCategory(category)
        } else {
            // this is a leaf cat not subCat
            if (parentCategories && selectedCategory) {
                // this is a subCat - navigate to category/subcategory
                router?.push(`/${selectedCategory?.slug}/${category?.slug}`)
            } else {
                // this is main category
                if (category?.slug === 'all') {
                    router.push('/')
                } else {
                    router.push(`/${category?.slug}`)
                }
            }
            handleOpenChange(false)
        }
    }

    const backgroundColor = selectedCategory?.color || 'white'
    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent
                side="left"
                className="p-0 transition-none"
                style={{ background: backgroundColor }}
                aria-describedby={undefined}
            >
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        Categories
                    </SheetTitle>
                </SheetHeader>
                {/* Example usage of data to avoid unused variable error */}
                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                    {parentCategories && (
                        <button onClick={() => parentCategories && (setParentCategories(null), setSelectedCategory(null))} className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                            <ChevronLeftIcon className="size-4" />
                            Back
                        </button>
                    )}
                    {currentCategories?.map((category) => (
                        <button
                            key={category.slug}
                            className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between text-base font-medium cursor-pointer"
                            onClick={() => handleClickCategory(category)}
                        >
                            {category?.name}
                            {category?.subcategories && category?.subcategories?.length > 0 && (<ChevronRightIcon className="size-4" />)}
                        </button>
                    ))}
                </ScrollArea>
            </SheetContent>

        </Sheet>
    )
}
