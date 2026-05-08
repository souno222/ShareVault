import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import SideMenu from "../components/SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useUser();

    return (
        <div className="min-h-screen bg-paper">
            {/* Top nav bar */}
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className="flex">
                    {/* Sidebar — hidden below 1080px */}
                    <div className="max-[1080px]:hidden shrink-0">
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    {/* Main content area */}
                    {/* DESIGN.md: whitespace is editorial, not decorative */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
