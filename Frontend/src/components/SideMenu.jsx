import { useUser } from "@clerk/clerk-react";
import { SIDE_MENU_DATA } from "../assets/data";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ activeMenu }) => {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        /* DESIGN.md: paper white, 1px black right border, no shadow */
        <div className="w-56 h-[calc(100vh-61px)] bg-paper border-r border-ink sticky top-[61px] z-20 flex flex-col">

            {/* ── User profile block ── */}
            {/* DESIGN.md: circular avatar is the only round shape allowed */}
            <div className="px-5 pt-6 pb-5 border-b border-ink">
                <div className="flex items-center gap-3">
                    {user?.imageUrl ? (
                        <img
                            src={user.imageUrl}
                            alt="Profile"
                            className="w-9 h-9 rounded-full border border-hairline shrink-0"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full border border-ink flex items-center justify-center shrink-0">
                            <span className="font-mono text-[0.63rem] tracking-ribbon uppercase text-page-ink">
                                {user?.firstName?.[0] || "U"}
                            </span>
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="font-ui font-bold text-sm tracking-btn text-page-ink truncate leading-none mb-0.5">
                            {user?.fullName || "User"}
                        </p>
                        <p className="font-mono text-[0.63rem] tracking-kicker uppercase text-caption leading-none">
                            Member
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Navigation links ── */}
            {/* DESIGN.md: hairline rules separate items, color = ink + link-blue on active */}
            <nav className="flex flex-col flex-1 py-2">
                {SIDE_MENU_DATA.map((item, index) => {
                    const isActive = activeMenu === item.label;
                    return (
                        <button
                            key={`menu_${index}`}
                            onClick={() => navigate(item.path)}
                            className={[
                                "flex items-center gap-3 w-full text-left px-5 py-3",
                                "border-b border-hairline",
                                "cursor-pointer transition-colors duration-[120ms]",
                                "rounded-none",          // DESIGN.md: square corners always
                                isActive
                                    ? "bg-ink text-paper"
                                    : "bg-paper text-page-ink hover:text-link-blue",
                            ].join(" ")}
                        >
                            {/* Icon */}
                            <item.icon
                                size={16}
                                strokeWidth={isActive ? 2 : 1.5}
                                className={isActive ? "text-paper" : "text-caption"}
                            />
                            {/* Label — UI font, not mono, per DESIGN.md Apercu=ui for navigation */}
                            <span className="font-ui text-sm tracking-btn font-semibold leading-none">
                                {item.label}
                            </span>
                            {/* Active marker — mono kicker */}
                            {isActive && (
                                <span className="ml-auto font-mono text-[0.63rem] tracking-kicker uppercase text-paper/60 leading-none">
                                    Active
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default SideMenu;
