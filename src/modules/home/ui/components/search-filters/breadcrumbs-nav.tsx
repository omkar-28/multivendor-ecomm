import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import React from 'react'

interface BreadCrumbNavigationProps {
    activeCategory?: string | null;
    activeCategoryName?: string | null;
    activeSubCategoryName?: string | undefined;
}
export const BreadCrumbNavigation = ({
    activeCategory,
    activeCategoryName,
    activeSubCategoryName
}: BreadCrumbNavigationProps) => {
    if (!activeCategoryName || activeCategory === 'all') {
        return null; // Don't render breadcrumbs if no category is selected or if 'all' is
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {activeSubCategoryName ? (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className='text-xl font-medium underline text-primary'>
                                <Link href={`${activeCategory}`}>{activeCategoryName}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className='text-primary font-medium text-lg'>
                            /
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className='text-xl font-medium'>
                                {activeSubCategoryName}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                ) : (
                    <BreadcrumbItem>
                        <BreadcrumbPage className='text-xl font-medium'>
                            {activeCategoryName}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
