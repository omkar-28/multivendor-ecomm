import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CircleXIcon } from "lucide-react";

interface Props {
    total: number;
    onCheckout: () => void;
    isCanceled?: boolean;
    isPending?: boolean;
}

export const CheckoutSidebar = ({
    total,
    onCheckout,
    isCanceled = false,
    isPending = false,
}: Props) => {
    return (
        <div className="bg-white border border-black rounded-md flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-black">
                <h2 className="text-xl font-bold">Checkout Summary</h2>
                <p className="text-lg font-medium">Total: {formatCurrency(total)}</p>
            </div>
            <div className="p-4 flex items-center justify-center">
                <Button
                    variant="elevated"
                    disabled={isPending || isCanceled}
                    onClick={onCheckout}
                    className="h-12 text-base w-full text-white bg-primary hover:bg-pink-400 hover:text-primary"
                >
                    {isPending ? 'Processing...' : 'Checkout'}
                </Button>
            </div>
            {isCanceled && (
                <div className="p-4 flex items-center justify-center border-t border-black">
                    <div className="bg-red-200 border border-red-400 font-medium px-4 py-3 rounded flex items-center w-full">
                        <div className="flex items-center">
                            <CircleXIcon className="size-6 fill-red-500 text-red-100" />
                            <span className="ml-2 text-red-500">Your order has been canceled</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const CheckoutSidebarSkeleton = () => {
    return (
        <div className="bg-white border border-black rounded-md flex flex-col animate-pulse">
            <div className="flex items-center justify-between p-4 border-b border-black">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="p-4 flex items-center justify-center">
                <div className="h-12 w-full bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};