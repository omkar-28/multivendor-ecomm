import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';
import React from 'react'

const MAX_RATING = 5;
const MIN_RATING = 0;

interface StarRatingProps {
    rating: number;
    className?: string;
    iconClassName?: string;
    text?: string;
}

const StarRating = ({ rating, className, iconClassName, text }: StarRatingProps) => {
    const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING)); // Replace with actual rating logic

    return (
        <div className={cn(
            "flex items-center gap-1",
            className
        )}>
            {Array.from({ length: MAX_RATING }, (_, index) => (
                <StarIcon key={index} className={cn(
                    "size-4",
                    index < safeRating ? "fill-black" : "",
                    iconClassName
                )} />
            ))}
            {text && <span className="text-sm text-gray-600">{text}</span>}
        </div>
    )
}

export default StarRating