import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders, cookies as nextCookies } from "next/headers";
// Make sure this file does NOT import anything from 'react' or use React context/hooks.

import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from './../schemas';

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders();

        const session = await ctx.payload.auth({ headers });

        if (!session) {
            throw new Error("No session found");
        }
        return session
    }),
    logout: baseProcedure.mutation(async () => {
        const cookies = await nextCookies();
        cookies.delete("AUTH_COOKIE")
    }),
    register: baseProcedure.input(
        registerSchema
    ).mutation(async ({ input, ctx }) => {
        const existingData = await ctx.payload.find({
            collection: "users",
            limit: 1,
            where: {
                username: {
                    equals: input.username,
                }
            }
        });
        const existingUser = existingData?.docs?.[0];
        if (existingUser) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Username already exists",
            });
        }

        await ctx.payload.create({
            collection: "users",
            data: {
                email: input.email,
                password: input.password,
                username: input.username,
            },
        });

        const data = await ctx.payload.login({
            collection: "users",
            data: {
                email: input.email,
                password: input.password,
            }
        })

        if (!data) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid email or password",
            });
        }

        const cookies = await nextCookies();
        if (!data.token) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "No token returned from login",
            });
        }
        cookies.set({
            name: AUTH_COOKIE,
            value: data.token,
            httpOnly: true,
            path: "/",
            // sameSite: 'none',
        });
    }),
    login: baseProcedure.input(loginSchema)
        .mutation(async ({ input, ctx }) => {
            const data = await ctx.payload.login({
                collection: "users",
                data: {
                    email: input.email,
                    password: input.password,
                }
            });

            if (!data) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid email or password",
                });
            }

            const cookies = await nextCookies();
            if (!data.token) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "No token returned from login",
                });
            }
            cookies.set({
                name: AUTH_COOKIE,
                value: data.token,
                httpOnly: true,
                path: "/",
                // sameSite: 'none',
            });

            return data;
        }),
});