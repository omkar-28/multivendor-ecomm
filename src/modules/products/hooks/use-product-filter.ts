
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

const sortValues = ["newest", "oldest", "default"] as const;

const Productparams = {
    sort: parseAsStringLiteral(sortValues).withDefault("default"),
    minPrice: parseAsString
        .withOptions({
            clearOnDefault: true,
        })
        .withDefault(""),
    maxPrice: parseAsString
        .withOptions({
            clearOnDefault: true,
        })
        .withDefault(""),
    tags: parseAsArrayOf(parseAsString)
        .withOptions({
            clearOnDefault: true,
        })
        .withDefault([]),
}

export const useProductFilter = () => {
    return useQueryStates(Productparams);
}