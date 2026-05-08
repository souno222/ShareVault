import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

const LandingNav = ({ openSignIn, openSignUp, isSignedIn, navigate }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { signOut } = useClerk();

    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Testimonials", href: "#testimonials" },
    ];

    return (
        <header className="sticky top-0 z-50">

            {/* ── Main Nav Bar ── */}
            <div className="bg-paper border-b-2 border-ink">
                <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-16 flex items-center justify-between h-16">
                    {/* Wordmark */}
                    <a
                        href="/"
                        className="font-display font-bold text-[1.75rem] tracking-hero text-ink no-underline leading-none"
                    >
                        ShareVault
                    </a>

                    {/* Desktop nav links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link, i) => (
                            <a
                                key={i}
                                href={link.href}
                                className="font-ui text-sm text-page-ink hover:text-link-blue hover:underline transition-colors duration-[120ms] no-underline"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTAs */}
                    <div className="hidden md:flex items-end gap-3">
                        {isSignedIn ? (
                            <button
                                onClick={() => signOut()}
                                className="font-ui font-bold text-sm tracking-btn text-ink bg-paper border-2 border-ink px-5 py-2.5 rounded-none cursor-pointer hover:bg-ink hover:text-paper transition-colors duration-150"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/sign-up')}
                                    className="font-ui font-bold text-sm tracking-btn text-ink bg-paper border-2 border-ink px-5 py-2.5 rounded-none cursor-pointer hover:bg-ink hover:text-paper transition-colors duration-150"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>

                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation"
                        className="md:hidden p-2 bg-transparent border-none cursor-pointer text-ink"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile drawer */}
                {mobileOpen && (
                    <div className="md:hidden bg-paper border-t border-ink px-4 py-4">
                        <nav className="flex flex-col">
                            {navLinks.map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="font-mono text-xs tracking-kicker uppercase text-page-ink no-underline py-3 border-b border-hairline block"
                                >
                                    {item.label}
                                </a>
                            ))}
                            <div className="flex gap-3 pt-4">
                                {isSignedIn ? (
                                    <button
                                        className="flex-1 font-ui font-bold text-sm tracking-btn text-ink bg-paper border-2 border-ink py-3 rounded-none cursor-pointer hover:bg-ink hover:text-paper transition-colors duration-150"
                                        onClick={() => {
                                            signOut();
                                            setMobileOpen(false);
                                        }}
                                    >
                                        Sign Out
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="flex-1 font-ui font-bold text-sm tracking-btn text-ink bg-paper border-2 border-ink py-3 rounded-none cursor-pointer hover:bg-ink hover:text-paper transition-colors duration-150"
                                            onClick={() => { navigate('/sign-up'); setMobileOpen(false); }}
                                        >
                                            Get Started
                                        </button>
                                        <button
                                            className="flex-1 font-ui font-bold text-sm tracking-btn text-paper bg-ink border-2 border-paper py-3 rounded-none cursor-pointer hover:bg-paper hover:text-ink transition-colors duration-150"
                                            onClick={() => { navigate('/sign-in'); setMobileOpen(false); }}
                                        >
                                            Sign In
                                        </button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default LandingNav;
