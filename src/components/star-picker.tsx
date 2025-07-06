"use client";

import { useState } from "react";
import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
    className?: string;
}

export const StarPicker = ({ value = 0, onChange, disabled, className }: Props) => {
    const [hoveredValue, setHoveredValue] = useState<number | null>(0);

    const handleMouseEnter = (index: number) => {
        if (!disabled) {
            setHoveredValue(index);
        }
    };

    const handleMouseLeave = () => {
        setHoveredValue(null);
    };

    return (
        <div className={cn("flex items-center gap-1", disabled && "opacity-50 cursor-not-allowed", className)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    disabled={disabled}
                    className={cn("p-0.5 hover:scale-110 transition",
                        !disabled && "cursor-pointer",
                        disabled && "cursor-not-allowed hover:scale-none"
                    )}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onChange?.(star)}
                >
                    <StarIcon
                        className={cn("size-5", (hoveredValue ?? value) >= star ? "fill-black stroke-black" : "stroke-black")}
                    />
                </button>
            ))}
        </div>
    );
}