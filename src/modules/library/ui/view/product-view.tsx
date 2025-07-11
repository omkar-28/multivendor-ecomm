"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ReviewSidebar } from "../components/review-sidebar";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Suspense } from "react";
import { ReviewFormLoading } from "../components/review-form";

interface Props {
    productId: string;
}

export const ProductView = ({ productId }: Props) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.library.getOne.queryOptions({
        productId: productId
    }));

    return (
        <div className="min-h-screen bg-white">
            <nav className="p-4 bg-[#F4F4F0] w-full border-b border-black">
                <Link prefetch href="/library" className="flex items-center gap-2">
                    <ArrowLeftIcon className="size-4" />
                    <span className="text-base font-medium">Back to library</span>
                </Link>
            </nav>

            <header className="bg-[#F4F4F0] py-8 border-b border-black">
                <div className="max-w-(--breakpoint-xl) mx-auto lg:px-12">
                    <h1 className="text-[40px] font-medium">{data?.name}</h1>
                </div>
            </header>

            <section className="max-w-(--breakpoint-xl) mx-auto lg:px-12 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
                    <div className="lg:col-span-2">
                        <div className="p-4 bg-white rounded-md border border-black gap-4">
                            <Suspense fallback={<ReviewFormLoading />}>
                                <ReviewSidebar productId={productId} />
                            </Suspense>
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                        {data?.content ?
                            <RichText data={data?.content} /> :
                            <p className="font-medium italic text-muted-foreground">
                                No special content
                            </p>}
                    </div>
                </div>
            </section>
        </div>
    )
}
