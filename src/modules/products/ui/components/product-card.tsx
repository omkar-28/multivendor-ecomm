import StarRating from "@/components/star-rating";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    // Define any props needed for the ProductCard component
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
    tenantSlug: string;
    tenantImageUrl?: string | null;
    reviewRating: number;
    reviewCount: number;
}

export const ProductCard = ({
    id,
    name,
    price,
    imageUrl = null,
    tenantSlug,
    tenantImageUrl = null,
    reviewRating,
    reviewCount
}: ProductCardProps) => {
    const router = useRouter();
    const handleUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();

        router.push(generateTenantURL(tenantSlug));
    }

    return (
        <Link href={`${generateTenantURL(tenantSlug)}/products/${id}`}>
            <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full flex flex-col">
                <div className="relative aspect-square">
                    <Image
                        alt={name}
                        fill
                        className="object-cover"
                        src={imageUrl || "/placeholder.png"}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority
                    />
                </div>
                <div className="p-4 border-y flex flex-col gap-3 flex-1">
                    <h2 className="text-lg font-medium line-clamp-4">{name}</h2>
                    {/* TODO: Redirect to user shop */}
                    <div className="flex items-center gap-2" onClick={handleUserClick}>
                        {tenantImageUrl && (
                            <Image
                                alt={tenantSlug}
                                src={tenantImageUrl}
                                width={16}
                                height={16}
                                className="rounded-full border shrink-0 size-[16px]"
                            />
                        )}
                        <p className="text-sm underline font-medium">{tenantSlug}</p>
                    </div>

                    {reviewCount > 0 && (
                        <div className="flex items-center gap-1">
                            <StarRating rating={reviewRating} iconClassName="size-3.5" />
                            <p className="text-sm font-medium">
                                ({reviewCount} reviews)
                            </p>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="relative px-2 py-1 border bg-pink-400 w-fit">
                        <p className="text-sm font-medium">{formatCurrency(price)}</p>
                    </div>
                </div>
            </div>
        </Link >
    )
}

export const ProductCardSkeleton = () => {
    return (
        <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse" />
    )
}