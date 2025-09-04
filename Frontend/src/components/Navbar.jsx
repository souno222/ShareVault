import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, X,Share2,Wallet } from "lucide-react";
import { UserButton} from "@clerk/clerk-react";
import { SignedIn } from "@clerk/clerk-react";
import SideMenu from "./SideMenu";
import CreditsDisplay from "./CreditsDisplay";
const Navbar =({activeMenu}) => {   
    const [openSideMenu, setOpenSideMenu] = useState(false);
    return (
        <div className="flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 sm:px-7 sticky top-0 z-30">
            {/**Left side - menu button and title */}
            <div className="flex items-center gap-5">
                <button 
                onClick={() => setOpenSideMenu(!openSideMenu)} 
                className="block lg:hidden text-black hover:bg-grey-100 p-1 rounded transition-colors">
                    {openSideMenu ? (
                       <X className="text-2xl"/>
                    ):(
                        <MenuIcon className="text-2xl"/>
                    )}
                </button>
                <div className="flex item-center gap-2">
                    <Share2 className="text-blue-600"/>
                    <span className="text-lg font-medium text-black truncate">
                        ShareVault
                    </span>
                </div>
            </div>

            {/* Right Side - Credits and user button*/}
            <SignedIn>
            <div className="flex items-center gap-4">
                <Link to="/subscription">
                    <CreditsDisplay credits={5}/>
                </Link>
                <div className="relative">
                    <UserButton />
                </div>
            </div>
            </SignedIn>
            {/** Side menu for small screens */}
            {openSideMenu && (
                <div className="fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20">
                    {/** Side Menu bar */}
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}
        </div>
    )
}

export default Navbar;
       