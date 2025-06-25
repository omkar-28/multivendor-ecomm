import Footer from "./_components/footer";
import { Navbar } from "./_components/navbar";

interface Props {
    children?: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 bg-[#f4f4f0]">
                {/* Main content area */}
                {children}
            </div>
            {/* Footer */}
            <Footer />
        </div>
    )
}

export default Layout;
