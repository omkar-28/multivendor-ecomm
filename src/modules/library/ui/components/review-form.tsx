import { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarPicker } from "@/components/star-picker";

import { ReviewsGetOneOutput } from "@/modules/reviews/types";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
    productId: string;
    initialData?: ReviewsGetOneOutput;
}

const reviewFormSchema = z.object({
    rating: z.number().min(1, { message: "Rating is required" }).max(5),
    description: z.string().min(1, "Description is required"),
});

export const ReviewForm = ({ productId, initialData }: Props) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [isPreview, setIsPreview] = useState(!!initialData);

    const createReview = useMutation(trpc.reviews.create.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
                productId: productId
            }));
            setIsPreview(true);
        },
        onError: (error) => {
            console.error("Error creating review:", error);
            toast.error(error.message || "Failed to create review");
        },
    }));

    const updateReview = useMutation(trpc.reviews.update.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
                productId: productId
            }));
            setIsPreview(true);
        },
        onError: (error) => {
            console.error("Error updating review:", error);
            toast.error(error.message || "Failed to update review");
        },
    }));

    const form = useForm<z.infer<typeof reviewFormSchema>>({
        resolver: zodResolver(reviewFormSchema),
        defaultValues: {
            rating: initialData?.rating ?? 0,
            description: initialData?.description ?? "",
        },
    });

    const onSubmit = (data: z.infer<typeof reviewFormSchema>) => {
        console.log(data)
        if (initialData) {
            updateReview.mutate({
                rating: data.rating,
                description: data.description,
                reviewId: initialData.id, // Assuming initialData has an id field
            });
        } else {
            createReview.mutate({
                productId: productId,
                rating: data.rating,
                description: data.description,
            });
        }
    }

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <p className="font-medium">
                    {isPreview ? "Edit your review" : "Write a review"}
                </p>

                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <StarPicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isPreview || createReview.isPending || updateReview.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Write your review here..."
                                    disabled={isPreview}
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!isPreview && (
                    <Button
                        variant='elevated'
                        disabled={createReview.isPending || updateReview.isPending}
                        type="submit"
                        size='lg'
                        className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
                    >
                        {initialData ? "Update Review" : "Submit Review"}
                    </Button>
                )}
            </form>
            {isPreview && (
                <Button
                    onClick={() => setIsPreview(false)}
                    size='lg'
                    type="button"
                    variant='elevated'
                    className="w-fit mt-4"
                >
                    Edit
                </Button>
            )}
        </Form>
    )
}
