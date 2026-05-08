import TextType from "../TextType";
const HeroSection = ({ openSignIn, openSignUp, isSignedIn, navigate }) => {
    const stats = [
        { number: "1K+", label: "Active Users" },
        { number: "500K+", label: "Files Shared" },
        { number: "99.9%", label: "Uptime SLA" },
    ];

    return (
        <section className="bg-paper border-b border-ink">
            <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-16">

                {/* ── HERO COPY ── */}
                <div className="pt-12 pb-0">
                    {/* Eyebrow kicker */}
                    <p className="font-mono text-[0.81rem] tracking-kicker uppercase text-caption leading-kicker mb-3">
                        Secure File Sharing Platform
                    </p>

                    {/* H1 — product name in large Playfair */}
                    <h1 className="font-display font-bold text-[4rem] leading-hero tracking-hero text-page-ink max-w-3xl mb-4">
                        ShareVault
                    </h1>

                    {/* H2 — italic tagline */}
                    <h2 className="font-display italic font-thin text-[2.25rem] leading-[1.15] tracking-hero text-page-ink max-w-3xl mb-6">
                        <TextType text={["Share, Manage, and Protect Your Files — at the Speed of Trust."]}
                            typingSpeed={50}
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter="" />
                    </h2>

                    {/* Deck */}
                    <p className="font-body text-[1.19rem] leading-deck tracking-[0.108px] text-page-ink max-w-xl mb-10">
                        ShareVault gives individuals and teams a secure space to upload,
                        organize, and distribute files with surgical precision. No clutter.
                        No compromise.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap gap-4 mb-12">
                        <button
                            id="hero-cta-signup"
                            onClick={() => navigate('/sign-up')}
                            className="font-ui font-bold text-base tracking-btn text-ink bg-paper border-2 border-ink px-6 py-3 rounded-none cursor-pointer hover:bg-ink hover:text-paper transition-colors duration-150"
                        >
                            Get Started Free
                        </button>
                        {isSignedIn ? (
                            <button
                                id="hero-cta-dashboard"
                                onClick={() => navigate("/dashboard")}
                                className="font-ui font-bold text-base tracking-btn text-paper bg-ink border-2 border-ink px-6 py-3 rounded-none cursor-pointer hover:bg-paper hover:text-ink transition-colors duration-150"
                            >
                                Go to Dashboard
                            </button>
                        ) : (
                            <button
                                id="hero-cta-signin"
                                onClick={() => navigate('/sign-in')}
                                className="font-ui font-bold text-base tracking-btn text-paper bg-ink border-2 border-ink px-6 py-3 rounded-none cursor-pointer hover:bg-paper hover:text-ink transition-colors duration-150"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>

                {/* ── HAIRLINE RULE ── */}
                <hr className="border-0 border-t border-ink m-0" />

                {/* ── STATS ROW ── */}
                <div className="grid md:grid-cols-3 grid-cols-1 border-b border-ink">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={`py-6 md:py-8 ${
                                i !== 2 ? "border-b md:border-b-0 md:border-r border-ink" : ""
                            } ${
                                i === 0 ? "md:pr-8" : i === 2 ? "md:pl-8" : "md:px-8"
                            }`}
                        >
                            <div className="font-display font-normal text-[2.5rem] leading-none tracking-hero text-page-ink mb-2">
                                {stat.number}
                            </div>
                            <div className="font-mono text-[0.81rem] tracking-kicker uppercase text-caption leading-kicker">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── PRODUCT SCREENSHOTS ── */}
                {/* Separated by 1px ink gap acting as divider */}
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-px bg-ink">
                    {/* Primary — 16:9 */}
                    <div className="bg-paper">
                        <img
                            src="/Dashboard.png"
                            alt="ShareVault dashboard interface"
                            loading="eager"
                            className="w-full aspect-video object-cover block rounded-none"
                        />
                        <div className="py-2 border-t border-ink">
                            <p className="font-body font-bold text-[0.80rem] leading-[2.2] tracking-[0.108px] text-caption">
                                ShareVault dashboard — files at a glance, always under control.
                            </p>
                        </div>
                    </div>

                    {/* Secondary — 4:3 */}
                    <div className="bg-paper">
                        <img
                            src="/MobileView.png"
                            alt="ShareVault mobile view"
                            loading="eager"
                            className="w-full aspect-[4/3] object-cover block rounded-none"
                        />
                        <div className="py-2 border-t border-ink">
                            <p className="font-body font-bold text-[0.80rem] leading-[2.2] tracking-[0.108px] text-caption">
                                Mobile interface. Full control anywhere.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;
