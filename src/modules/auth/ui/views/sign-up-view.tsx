"use client";

import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { registerSchema } from "../../schemas";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});

export const SignUpView = () => {
    const router = useRouter();

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const registerMutation = useMutation(trpc.auth.register.mutationOptions());

    const form = useForm<z.infer<typeof registerSchema>>({
        mode: 'all',
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        },
    });

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        console.log("Form submitted with data:", values);
        // Handle form submission logic here
        registerMutation.mutate(values, {
            onError: (error) => {
                console.error("Error during registration:", error);
                // Handle error, e.g., show error message
                toast.error(error.message || "Registration failed. Please try again.");

            },
            onSuccess: async () => {
                toast.success("Registration successful! Redirecting to sign-in page...");
                // Optionally redirect or perform other actions on success
                await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
                toast.dismiss();
                router.push('/');
            },
        });
    };

    const username = form.watch("username");
    const usernameErrors = form.formState.errors.username;

    const showPreview = username && !usernameErrors;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-8 p-4 lg:p-16"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <Link href='/'>
                                <span className={cn("text-2xl font-semibold", poppins.className)}>Shopnex</span>
                            </Link>

                            <Button asChild variant='ghost' size='sm' className="text-base border-none underline">
                                <Link prefetch href='/sign-in'>Already have an account? Sign In</Link>
                            </Button>
                        </div>

                        <h1 className="text-4xl font-medium">Join over 1000 creators earning money from shopnex</h1>

                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className={cn("hidden", showPreview && "block")}>
                                        Your store will be available at&nbsp;
                                        {/* TODO: Use proper method to generate preview url */}
                                        <strong>{username}</strong>.shopnex.com
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" variant="elevated" disabled={registerMutation.isPending} className="bg-black text-white hover:bg-pink-400 hover:text-primary">
                            Create Account
                        </Button>
                    </form>
                </Form>
            </div>
            <div
                className="h-screen w-full lg:col-span-2 hidden lg:block"
                style={{
                    backgroundImage: "url('/auth-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
        </div>
    );
}