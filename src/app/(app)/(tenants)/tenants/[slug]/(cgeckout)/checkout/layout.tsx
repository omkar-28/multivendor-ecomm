import { Navbar } from "@/modules/checkout/ui/components/navbar";
import { Footer } from "@/modules/tenants/ui/components/footer";

interface Props {
    children: React.ReactNode;
    params: Promise<{ slug: string; }>;
}

const Layout = async ({ children, params }: Props) => {
    const { slug } = await params;

    return (
        <div className='min-h-screen bg-[#f4f40] flex flex-col'>
            <Navbar slug={slug} />

            <div className="flex-1">
                <div className="max-w-(--breakpoint-xl) mx-auto">
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Layout