import { authRouter } from '@/modules/auth/server/procedure';
import { createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedure';
import { productsRouter } from '@/modules/products/server/procedure';
import { tagsRouter } from '@/modules/tags/server/procedure';
import { tenantaRouter } from '@/modules/tenants/server/procedure';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    categories: categoriesRouter,
    products: productsRouter,
    tags: tagsRouter,
    tenants: tenantaRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;