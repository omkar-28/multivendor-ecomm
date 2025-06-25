import { Category } from "@/payload-types";
import { CategoryDropdown } from "./category-dropdown";

interface CategoriesProps {
    data: any; // Adjust the type as per your data structure
}

export const Categories = ({ data }: CategoriesProps) => {
    return (
        <div className="relative w-full">
            <div className="flex flex-nowrap items-center">
                {data.map((category: Category) => {
                    return <div key={category.id}>
                        <CategoryDropdown
                            category={category}
                            isActive={false}
                            isNavigationHovered={false}
                        />
                    </div>
                })}
            </div>
        </div>
    );
}