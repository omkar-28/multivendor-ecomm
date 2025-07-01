import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export  type CustomCategoriesManyOutput = inferRouterOutputs<AppRouter>["categories"]["getMany"];
export type categoriesGetManyOutputSigle = CustomCategoriesManyOutput[0];