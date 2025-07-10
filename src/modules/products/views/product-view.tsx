"use client";

import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCheckIcon, LinkIcon, StarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { RichText } from "@payloadcms/richtext-lexical/react"
import { CartButtonSkeleton } from "../ui/components/cart-button";
import { toast } from "sonner";

interface ProductViewProps {
    productId: string;
    tenantSlug: string;
}

const CartButton = dynamic(() => import("../ui/components/cart-button").then(mod => mod.CartButton), {
    ssr: false,
    loading: () => <CartButtonSkeleton />
});

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.products.getOne.queryOptions({
        id: productId,
    }));

    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="border border-black rounder-sm bg-white overflow-hidden">
                <div className="relative aspect-[3.9] border-b border-black">
                    <Image
                        src={data?.coverImage?.url || "/placeholder.png"}
                        alt={data?.name || "Product Image"}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-6">
                    <div className="col-span-4">
                        <div className="p-6">
                            <h1 className="text-4xl font-medium">{data.name}</h1>
                        </div>
                        <div className="border-y border-black flex">
                            <div className="px-6 py-4 items-center justify-center border-r border-black">
                                <div className="relative px-2 py-1 border border-black bg-pink-400 w-fit">
                                    <p className="text-lg font-medium">
                                        {formatCurrency(data.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="px-6 py-4 flex items-center justify-center lg:border-r border-black">
                                <Link href={generateTenantURL(tenantSlug)} className="flex items-center gap-2">
                                    {data?.tenant?.image?.url && (
                                        <Image
                                            src={data.tenant.image.url}
                                            alt={data.tenant.name}
                                            width={20}
                                            height={20}
                                            className="rounded-full border shrink-0 size-[20px]"
                                        />
                                    )}
                                    <p className="text-base underline font-medium">{data?.name}</p>
                                </Link>
                            </div>

                            <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                                <div className="flex items-center gap-2">
                                    <StarRating
                                        rating={data?.reviewRating || 0}
                                        iconClassName="size-4"
                                    />
                                    <p className="text-base font-medium">
                                        {data?.reviewCount} ratings
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="block lg:hidden px-6 py-4 items-center justify-center border-b border-black">
                            <div className="flex items-center gap-2">
                                <StarRating
                                    rating={data?.reviewRating || 0}
                                    iconClassName="size-4"
                                />
                                <p className="text-base font-medium">
                                    {data?.reviewCount} ratings
                                </p>
                            </div>
                        </div>

                        <div className="p-6">
                            {data.description ? (
                                <RichText data={data?.description} />
                            ) : (
                                <p className="font-medium text-muted-foreground italic">No description provided</p>
                            )}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="border-t lg:border-t-0 lg:border-l h-full border-black">
                            <div className="flex flex-col gap-4 p-6 border-b border-black">
                                <div className="flex flex-row items-center gap-2">
                                    <CartButton isPurchased={data?.isPurchased} tenantSlug={tenantSlug} productId={productId} />

                                    <Button
                                        variant='elevated'
                                        className="size-12 border-black"
                                        onClick={() => {
                                            if (typeof navigator !== "undefined" && navigator.clipboard) {
                                                navigator.clipboard.writeText(window.location.href);
                                                setIsCopied(true);
                                                toast.success("Product link copied to clipboard");
                                            } else {
                                                toast.error("Clipboard API not supported");
                                            }

                                            setTimeout(() => {
                                                setIsCopied(false);
                                            }, 2000);
                                        }}
                                        disabled={isCopied}
                                    >
                                        {isCopied ? <CheckCheckIcon /> : <LinkIcon />}
                                    </Button>
                                </div>

                                <p className="text-center font-medium">
                                    {data?.refundPolicy === "no-refund" ? "No Refund Policy" : `${data?.refundPolicy} money back guarantee`}
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-medium">Ratings</h3>
                                    <div className="flex items-center gap-x-1 font-medium">
                                        <StarIcon className="size-4 fill-black" />
                                        <p>({data?.reviewRating})</p>
                                        <p className="text-base">{data?.reviewCount} ratings</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <Fragment key={stars}>
                                            <div className="flex items-center gap-2">
                                                <StarIcon className="size-4 fill-black" />
                                                <p className="text-sm font-medium">{stars} {stars === 1 ? "star" : "stars"}</p>
                                            </div>
                                            <Progress value={data?.ratingDistribution[stars]} className="rounded-full h-2.5 [&_.bg-primary]:bg-pink-400" />
                                            <p className="text-sm font-medium">{data?.ratingDistribution[stars]}%</p>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ProductViewSkeleton = () => {
    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="border border-black rounder-sm bg-white overflow-hidden">
                <div className="relative aspect-[3.9] border-b border-black bg-gray-200 animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-6">
                    <div className="col-span-4 p-6 space-y-4">
                        <div className="h-8 bg-gray-200 animate-pulse w-1/2" />
                        <div className="h-6 bg-gray-200 animate-pulse w-full" />
                        <div className="h-4 bg-gray-200 animate-pulse w-full" />
                    </div>
                    <div className="col-span-2 p-6 space-y-4">
                        <div className="h-8 bg-gray-200 animate-pulse w-full" />
                        <div className="h-6 bg-gray-200 animate-pulse w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}