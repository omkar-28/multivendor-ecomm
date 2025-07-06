"use client";

import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { CategoriesSideBar } from "./categories-sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
    disabled?: boolean;
}
export const SearchInput = ({
    disabled = false,
}: Props) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const trpc = useTRPC();
    const session = useQuery(trpc.auth.session.queryOptions());

    return (
        <div className="flex items-center gap-2 w-full">
            <CategoriesSideBar open={isSidebarOpen} onOpenChangeAction={setIsSidebarOpen} />
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <Input className="h-11 pl-8 border-black bg-white" placeholder="Search Products" disabled={disabled} />
            </div>
            {/* TODO: Add categories view all button */}
            <Button variant='elevated' className="size-12 shrink-0 flex lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <ListFilterIcon />
            </Button>
            {session?.data?.user && (<Button asChild variant='elevated' className="h-11 border-black">
                <Link prefetch href="/library">
                    <BookmarkCheckIcon />
                    Library
                </Link>
            </Button>)}
            {/* TODO: Add library button */}
        </div>
    )
}
