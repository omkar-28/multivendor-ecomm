"use client";

import { Button } from "@/components/ui/button";
import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookmarkCheckIcon, ShoppingCartIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

interface Props {
    slug: string;
}

const CheckoutButton = dynamic(() => import("@/modules/checkout/ui/components/checkout-button").then(mod => mod.CheckoutButton), {
    ssr: false,
    loading: () => <Button disabled className="bg-white border-black"><ShoppingCartIcon className="text-black" /></Button>
});

export const Navbar = ({ slug }: Props) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }));

    return (
        <nav className="h-20 border-b font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
                <Link href={generateTenantURL(slug)} className="flex items-center gap-2">
                    {data?.image?.url && (<Image src={data?.image?.url} alt={data?.slug} width={32} height={32} className="w-8 h-8 rounded-full border shrink-0 size-[32px]" />)}
                    <span className="text-lg">{data?.name}</span>
                </Link>

                <div className="flex items-center gap-3">
                    <Button asChild variant='elevated' className="h-11 border-black">
                        <Link prefetch href="library">
                            <BookmarkCheckIcon />
                            Library
                        </Link>
                    </Button>
                    <CheckoutButton hideIfEmpty tenantSlug={slug} />
                </div>
            </div>
        </nav>
    )
}

export const NavbarSkeleton = () => {
    return (
        <nav className="h-20 border-b font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
                <div className="animate-pulse p-1" />
                <Button disabled className="bg-white border-black"><ShoppingCartIcon className="text-black" /></Button>
            </div>
        </nav>
    )
}