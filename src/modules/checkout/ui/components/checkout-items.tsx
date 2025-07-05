import { cn, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  isLast?: boolean;
  imageUrl: string;
  name: string;
  productUrl: string;
  tenantUrl: string;
  tenantName: string;
  price: number;
  onRemove: () => void;
}

export const CheckoutItem = ({
  isLast = false,
  imageUrl,
  name,
  productUrl,
  tenantUrl,
  tenantName,
  price,
  onRemove
}: Props) => {
  return (
    <div className={cn(
      "grid grid-cols-[8.5rem_1fr_auto] gap-4 border-b border-black",
      isLast && "border-b-0"
    )}>
      <div className="overflow-hidden border-r border-black">
        <div className="relative aspect-square">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={name}
            fill
            className="object-cover"
            sizes="8.5rem"
            priority
          />
        </div>
      </div>

      <div className="py-4 flex flex-col justify-between">
        <div>
          <Link href={productUrl}>
            <h4 className="font-bold underline">{name}</h4>
          </Link>

          <Link href={tenantUrl}>
            <p className="font-medium underline">{tenantName}</p>
          </Link>
        </div>
      </div>

      <div className="py-4 pr-4 flex flex-col justify-between">
        <p className="font-medium">
          {formatCurrency(price)}
        </p>
        <button className="underline font-medium cursor-pointer" onClick={onRemove} type="button">
          Remove
        </button>
      </div>
    </div>
  )
}

export const CheckoutItemSkeleton = () => {

  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="grid grid-cols-[8.5rem_1fr_auto] gap-4 border-b border-black animate-pulse">
          <div className="overflow-hidden border-r border-black">
            <div className="relative aspect-square bg-gray-200" />
          </div>

          <div className="py-4 flex flex-col justify-between">
            <div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-5 bg-gray-200 rounded w-1/2" />
            </div>
          </div>

          <div className="py-4 pr-4 flex flex-col justify-between">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-5 bg-gray-200 rounded w-1/3" />
          </div>
        </div>))
      }
    </>
  );
};
