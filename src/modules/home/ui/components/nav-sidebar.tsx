import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";

interface NavbarItem {
    children?: React.ReactNode;
    href?: string;
}

interface Props {
    items: NavbarItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const NavSideBar = ({
    items, open, onOpenChange
}: Props) => {
    
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="p-0 transition-none">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex flex-col h-full pb-2 overflow-y-auto">
                    {items?.map(item => (
                        <Link onClick={() => onOpenChange(false)} href={item.href || '#'} key={item.href} className="w-full p-4 text-left hover:bg-black hover:text-white flex items-center text-base font-medium transition-colors">
                            {item.children}
                        </Link>
                    ))}

                    <div className="border-t">
                        <Link href='/sign-in' className="w-full p-4 text-left hover:bg-black hover:text-white flex items-center text-base font-medium transition-colors">Log in</Link>
                        <Link href='/sign-in' className="w-full p-4 text-left hover:bg-black hover:text-white flex items-center text-base font-medium transition-colors">Start selling</Link>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
export default NavSideBar