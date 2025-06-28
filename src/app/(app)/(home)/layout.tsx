import configPromise from '@payload-config';
import { getPayload } from "payload";
import Footer from "./_components/footer";
import { Navbar } from "./_components/navbar";
import SearchFilters from "./search-filters";
import { Category } from '@/payload-types';
import { CustomCategory } from './type';

interface Props {
    children?: React.ReactNode;
}

const Layout = async ({ children }: Props) => {

    const payload = await getPayload({
        config: configPromise,
    })

    const data = await payload.find({
        collection: 'categories',
        depth: 1,
        pagination: false,
        where: {
            parent: {
                exists: false, // Only fetch top-level categories
            }
        },
        sort: 'name',
    });

    const mapCategoryToCustomCategory = (category: Category): CustomCategory => ({
        ...category,
        subcategories: Array.isArray(category?.subcategories?.docs)
            ? (category.subcategories.docs as Category[])
                .filter((subcat): subcat is Category => typeof subcat === 'object' && subcat !== null)
                .map(mapCategoryToCustomCategory)
            : [],
    });

    const formattedData: CustomCategory[] = (data.docs as Category[]).map(mapCategoryToCustomCategory);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <SearchFilters data={formattedData} />
            <div className="flex-1 bg-[#f4f4f0]">
                {/* Main content area */}
                {children}
            </div>
            {/* Footer */}
            <Footer />
        </div>
    )
}

export default Layout;
