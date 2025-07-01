
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient, trpc } from '@/trpc/server';
import Footer from "./_components/footer";
import { Navbar } from "./_components/navbar";
import { SearchFilters, SearchFiltersLoading } from "./search-filters";
import { Suspense } from 'react';

interface Props {
    children?: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
    const queryclient = getQueryClient();

    void queryclient.prefetchQuery(trpc.categories.getMany.queryOptions())

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <HydrationBoundary state={dehydrate(queryclient)}>
                <Suspense fallback={<SearchFiltersLoading />}>
                    {/* Search filters component */}
                    <SearchFilters />
                </Suspense>
            </HydrationBoundary>
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
