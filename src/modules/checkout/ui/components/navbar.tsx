"use client";

import { Button } from "@/components/ui/button";
import { generateTenantURL } from "@/lib/utils";
import Link from "next/link";

interface Props {
    slug: string;
}

export const Navbar = ({ slug }: Props) => {

    return (
        <nav className="h-20 border-b font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">

                <span className="text-lg">Checkout</span>

                <Button asChild className="bg-white border-black" variant='elevated'>
                    <Link href={generateTenantURL(slug)} className="flex items-center gap-2">
                        Continue shopping</Link>
                </Button>
            </div>
        </nav>
    )
} 