import { SearchInput } from "../_components/search-input";
import { CustomCategory } from "../type";
import { Categories } from "./categories";

interface SearchFiltersProps {
    data: CustomCategory[]; // Adjust the type as per your data structure
}

const SearchFilters = ({ data }: SearchFiltersProps) => {
    return (
        <div className="px-4 lg:px-12 py-6 border-b flex flex-col gap-4 w-full">
            <SearchInput data={data} />
            <div className="hidden lg:block">
                <Categories data={data} />
            </div>
        </div>
    )
}

export default SearchFilters