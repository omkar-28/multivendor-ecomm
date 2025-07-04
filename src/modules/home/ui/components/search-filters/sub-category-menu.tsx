/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { CustomCategoriesManyOutput } from "@/modules/categories/types";

interface SubCategoryMenuProps {
    category: CustomCategoriesManyOutput[1];
    isOpen: boolean;
}
export const SubCategoryMenu = ({ category, isOpen,
}: SubCategoryMenuProps) => {
    if (!isOpen || !category?.subcategories || (category?.subcategories ?? [])?.length === 0) {
        return null;
    }

    const backgroundColor = category.color || "#f4f4f0"; // Default background color if not specified
    return (
        <div className="absolute z-100" style={{ top: "100%", left: 0 }}>
            {/* //Invsisible div to prevent click-through */}
            <div className="h-3 w-60" />
            <div className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]" style={{ backgroundColor }}>
                {(category?.subcategories ?? [])?.map((subcategory: any) => (
                    <Link
                        key={subcategory.slug}
                        href={`/${category?.slug}/${subcategory.slug}`}
                        className="w-full text-left p-2 hover:bg-black hover:text-white flex justify-between items-center underline font-medium">
                        {subcategory.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}
