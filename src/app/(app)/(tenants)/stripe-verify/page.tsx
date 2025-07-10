"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";


const Page = () => {
    const trpc = useTRPC();
    const { mutate: verify } = useMutation(trpc.checkout.verify.mutationOptions({
        onSuccess(data) {
            window.location.href = data.url;
        },
        onError(error) {
            console.error("Error during Stripe verification:", error);
            // Handle error, e.g., show error message
            toast.error(error.message || "Verification failed. Please try again.");
            window.location.href = "/"
        }
    }));

    useEffect(() => {
        verify()
    }, [verify]);

    return (
        <div className="flex flex-col min-h-screen items-center justify-center">
            <LoaderIcon className="h-10 w-10 animate-spin text-gray-500" />
            <p className="ml-2 text-gray-500">Redirecting to Stripe verification...</p>
            <p className="text-gray-500">Please wait...</p>

        </div>
    )
}

export default Page