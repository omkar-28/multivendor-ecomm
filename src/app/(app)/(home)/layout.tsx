import configPromise from '@payload-config';
import { getPayload } from "payload";
import Footer from "./_components/footer";
import { Navbar } from "./_components/navbar";
import SearchFilters from "./search-filters/page";
import { Category } from '@/payload-types';

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
        }
    });

    const formattedData = (data.docs as Category[]).map((category) => ({
        ...category,
        subcategories: (category?.subcategories?.docs ?? []).map((subcategory) => ({
            ...(subcategory as Category),
        }))
    }));

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
