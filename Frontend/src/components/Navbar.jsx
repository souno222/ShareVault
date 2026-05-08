import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, X } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { SignedIn } from "@clerk/clerk-react";
import SideMenu from "./SideMenu";
import CreditsDisplay from "./CreditsDisplay";
import { UserCreditsContext } from "../context/UserCreditsContext";

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const { credits, fetchCredits } = useContext(UserCreditsContext);

    useEffect(() => {
        fetchCredits();
    }, [fetchCredits]);

    return (
        <>
            {/* ── Main Navbar ── */}
            {/* DESIGN.md: white nav bar, 2px black border bottom, no shadow */}
            <div className="flex items-center justify-between gap-4 bg-paper border-b-2 border-ink py-0 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 h-[61px]">

                {/* Left: hamburger + wordmark */}
                <div className="flex items-center gap-4">
                    {/* Hamburger — visible below lg */}
                    <button
                        onClick={() => setOpenSideMenu(!openSideMenu)}
                        className="lg:hidden bg-transparent border-none p-1.5 cursor-pointer text-ink hover:bg-hairline transition-colors"
                        aria-label="Toggle menu"
                    >
                        {openSideMenu ? <X size={22} /> : <MenuIcon size={22} />}
                    </button>

                    {/* Wordmark — Playfair Display per DESIGN.md */}
                    <Link
                        to="/"
                        className="font-display font-bold text-[1.5rem] tracking-hero text-ink no-underline leading-none"
                    >
                        ShareVault
                    </Link>
                </div>

                {/* Right: credits chip + user avatar */}
                <SignedIn>
                    <div className="flex items-center gap-4 ml-auto">
                        {/* Credits — link to subscription */}
                        <Link to="/subscription" className="no-underline">
                            <CreditsDisplay credits={credits} />
                        </Link>

                        {/* Clerk UserButton — the only circular element allowed (round icon button) */}
                        <div className="flex-shrink-0">
                            <UserButton />
                        </div>
                    </div>
                </SignedIn>
            </div>

            {/* ── Mobile side-drawer ── */}
            {/* DESIGN.md: border, no shadow, paper white */}
            {openSideMenu && (
                <div className="fixed top-[61px] left-0 right-0 border-b border-ink bg-paper lg:hidden z-20">
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}
        </>
    );
};

export default Navbar;
