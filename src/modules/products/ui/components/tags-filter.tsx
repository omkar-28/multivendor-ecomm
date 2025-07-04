import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DEFAULT_LIMIT } from "@/constant";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

interface Props {
    value?: string[] | null;
    onChange: (value: string[]) => void;
}

export const TagsFilter = ({ value, onChange }: Props) => {
    const trpc = useTRPC();
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(trpc.tags.getMany.infiniteQueryOptions(
        {
            limit: DEFAULT_LIMIT
        },
        {
            getNextPageParam: (lastPage) => {
                return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
            },
        }
    ));

    const handleOnClick = (tag: string) => {
        if (value?.includes(tag)) {
            onChange(value?.filter((t) => t !== tag) || []);
        } else {
            onChange([...value || [], tag]);
        }
    }
console.log(data)
    return (
        <div className="flex flex-col gap-y-2">
            {isLoading ? (
                <div className="flex items-center justify-center p-4">
                    <LoaderIcon className="size-4 animate-spin" />
                </div>
            ) : (
                data?.pages.map((page) =>
                    page.docs.map((tag) => (
                        <div
                            key={tag.id}
                            className="flex items-center justify-between cursor-pointer gap-y-4"
                            onClick={() => handleOnClick(tag.name)}
                        >
                            <Label className="font-medium" htmlFor={tag?.name}>{tag?.name}</Label>
                            <Checkbox
                                checked={value?.includes(tag.name) || false}
                                onChange={() => handleOnClick(tag.name)}
                                className="border-2 border-black/50"
                            />
                        </div>
                    ))
                )
            )}

            {hasNextPage && (
                <button
                    className="underline font-medium justify-start text-start disabled:opacity-50"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? "Loading more..." : "Load more"}
                </button>
            )}
        </div>
    )
}
