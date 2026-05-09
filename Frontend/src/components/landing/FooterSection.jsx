const FooterSection = () => {
    const productLinks = [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Testimonials", href: "#testimonials" },
    ];
    const legalLinks = [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
    ];

    return (
        <footer id="footer" className="bg-page-ink border-t-2 border-ink">
            <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-16">

                {/* ── TOP: Wordmark + nav columns ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 pt-12 pb-10 border-b border-white/15">

                    {/* Nav grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {/* Product */}
                        <div>
                            <p className="font-mono font-bold text-[0.75rem] tracking-ribbon uppercase text-paper leading-none pb-2 mb-4 border-b border-white/20">
                                Product
                            </p>
                            <nav className="flex flex-col gap-2.5">
                                {productLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.href}
                                        className="font-ui text-[0.69rem] leading-[1.45] text-paper hover:text-link-blue transition-colors duration-[120ms] no-underline"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Legal */}
                        <div>
                            <p className="font-mono font-bold text-[0.75rem] tracking-ribbon uppercase text-paper leading-none pb-2 mb-4 border-b border-white/20">
                                Legal
                            </p>
                            <nav className="flex flex-col gap-2.5">
                                {legalLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.href}
                                        className="font-ui text-[0.69rem] leading-[1.45] text-paper hover:text-link-blue transition-colors duration-[120ms] no-underline"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                        </div>


                    </div>
                    <div className="flex flex-col justify-center items-end text-right w-full overflow-hidden">
                        <h1 className="font-display font-bold text-[12vw] tracking-hero text-paper mb-2 leading-none">
                            ShareVault
                        </h1>
                        <p className="font-body text-sm leading-[1.5] text-white/55 max-w-[200px]">
                            Secure file sharing made simple and trustworthy.
                        </p>
                    </div>
                </div>

                {/* ── BOTTOM: copyright ── */}
                <div className="flex flex-wrap justify-between items-center gap-2 py-5">
                    <p className="font-mono text-[0.75rem] tracking-meta uppercase text-white/35">
                        © {new Date().getFullYear()} ShareVault. All rights reserved.
                    </p>
                    <p className="font-mono text-[0.75rem] tracking-meta uppercase text-white/25">
                        Designed with editorial restraint.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default FooterSection;
