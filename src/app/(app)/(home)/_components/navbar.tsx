'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavSideBar from "./nav-sidebar";
import { useState } from "react";
import { MenuIcon } from "lucide-react";

interface NavbarItemProps {
    children: React.ReactNode;
    isActive?: boolean;
    href: string;
}

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});

const NavbarItem = ({ children, href, isActive }: NavbarItemProps) => {
    return (
        <Button variant='outline' className={cn("bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg", isActive && "bg-black text-white hover:bg-black hover:text-white")} asChild>
            <Link href={href}>
                {children}
            </Link>
        </Button>
    )
}

const navbarItems = [
    { href: '/', children: 'Home' },
    { href: '/about', children: 'About' },
    { href: '/features', children: 'Features' },
    { href: '/pricing', children: 'Pricing' },
    { href: '/contact', children: 'Contact' },
]

export const Navbar = () => {
    const pathName = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <nav className="h-20 flex border-b justify-between font-medium bg-white">
            <Link href='/' className='p-6 flex items-center'>
                <span className={cn("text-4xl font-semibold", poppins.className)}>Shopnex</span>
            </Link>
            <NavSideBar items={navbarItems} open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
            <div className="items-center gap-4 hidden lg:flex">
                {navbarItems.map((item) => (<NavbarItem key={item.href} href={item.href} isActive={pathName === item.href}>
                    {item.children}
                </NavbarItem>))}
            </div>

            <div className="hidden lg:flex">
                <Button asChild variant='secondary' className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 trasition-colors text-lg">
                    <Link href='/sign-in'>Login</Link>
                </Button>
                <Button asChild className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black trasition-colors text-lg">
                    <Link href='/sign-up'>Start selling</Link>
                </Button>
            </div>

            <div className="flex lg:hidden items-center justify-center pr-4">
                <Button variant='ghost' className="border-transparent bg-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <MenuIcon />
                </Button>
            </div>
        </nav>
    )
}
