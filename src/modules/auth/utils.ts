import { cookies as nextCookies } from "next/headers";

interface Props {
    prefix?: string;
    value: string;
}
export const generateAuthCookie = async ({ prefix, value }: Props) => {
    const cookies = await nextCookies();
    cookies.set({
        name: `${prefix}-token`,
        value,
        httpOnly: true,
        path: "/",
    })
}