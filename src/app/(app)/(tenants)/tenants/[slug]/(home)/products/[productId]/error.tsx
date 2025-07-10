"use client";

import { TriangleAlertIcon } from "lucide-react";

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center border shadow-md rounded-lg p-8 mx-auto mt-20">
            <TriangleAlertIcon className="text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Available</h1>
            <p className="text-lg text-gray-600 max-w-md text-center">
                The product you are looking for is either not available, has been archived, or could not be found.
            </p>
        </div>
    )
}

export default ErrorPage