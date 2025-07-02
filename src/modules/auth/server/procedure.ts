import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";
// Make sure this file does NOT import anything from 'react' or use React context/hooks.

import { loginSchema, registerSchema } from './../schemas';
import { generateAuthCookie } from "../utils";

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders();

        const session = await ctx.payload.auth({ headers });

        if (!session) {
            throw new Error("No session found");
        }
        return session
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

        if (!data.token) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "No token returned from login",
            });
        }

        await generateAuthCookie({ prefix: ctx.payload.config.cookiePrefix, value: data.token });
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

            if (!data.token) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "No token returned from login",
                });
            }

            await generateAuthCookie({ prefix: ctx.payload.config.cookiePrefix, value: data.token });

            return data;
        }),
});