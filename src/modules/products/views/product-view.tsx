"use client";

import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LinkIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

interface ProductViewProps {
    productId: string;
    tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
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
                                <div className="flex items-center gap-1">
                                    <StarRating
                                        rating={3}
                                        iconClassName="size-4"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="block lg:hidden px-6 py-4 items-center justify-center border-b border-black">
                            <div className="flex items-center gap-1">
                                <StarRating
                                    rating={3}
                                    iconClassName="size-4"
                                />
                                <p className="text-base font-medium">
                                    {5} ratings
                                </p>
                            </div>
                        </div>

                        <div className="p-6">
                            {data.description ? (
                                <p>{data?.description}</p>
                            ) : (
                                <p className="font-medium text-muted-foreground italic">No description provided</p>
                            )}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="border-t lg:border-t-0 lg:border-l h-full border-black">
                            <div className="flex flex-col gap-4 p-6 border-b border-black">
                                <div className="flex flex-row items-center gap-2">
                                    <Button
                                        variant="elevated"
                                        className="flex-1 bg-pink-400 border-black h-12"
                                    >
                                        Add to cart
                                    </Button>

                                    <Button
                                        variant='elevated'
                                        className="size-12 border-black"
                                        onClick={() => { }}
                                        disabled={false}
                                    >
                                        <LinkIcon />
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
                                        <p>({5})</p>
                                        <p className="text-base">{5} ratings</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <Fragment key={stars}>
                                            <div className="flex items-center gap-2">
                                                <StarIcon className="size-4 fill-black" />
                                                <p className="text-sm font-medium">{stars} star</p>
                                            </div>
                                            <Progress value={(stars / 5) * 100} className="rounded-full h-2.5 [&_.bg-primary]:bg-pink-400" />
                                            <p className="text-sm font-medium">({stars * 10})</p>
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
