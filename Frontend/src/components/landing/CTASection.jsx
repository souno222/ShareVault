const CTASection = ({ isSignedIn, navigate }) => {
    const handleCTA = () => {
        if (isSignedIn) {
            navigate("/dashboard");
        } else {
            navigate("/sign-up");
        }
    };

    return (
        <section id="cta" className="bg-ink border-b border-ink">
            <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-16">
                <div className="py-16 flex flex-wrap items-start justify-between gap-10">

                    {/* Left: headline */}
                    <div className="flex-1 min-w-[300px]">
                        <p className="font-mono text-[0.81rem] tracking-kicker uppercase text-white/50 leading-kicker mb-4">
                            Get Started Today
                        </p>
                        <h2 className="font-display font-normal text-[3rem] sm:text-[4rem] leading-hero tracking-hero text-paper max-w-lg">
                            Ready to vault your files?
                        </h2>
                    </div>

                    {/* Right: deck + buttons */}
                    <div className="flex-1 min-w-[260px] flex flex-col justify-end self-end gap-6">
                        <p className="font-body text-[1.19rem] leading-deck text-white/70">
                            Create your account in seconds. No credit card required for the
                            free tier. Start sharing files that are actually secure.
                        </p>

                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Inverted secondary button on dark surface */}
                            <button
                                id="cta-final-signup"
                                onClick={handleCTA}
                                className="font-ui font-bold text-base tracking-btn text-ink bg-paper border-2 border-paper px-6 py-3 rounded-none cursor-pointer hover:bg-transparent hover:text-paper transition-colors duration-150"
                            >
                                {isSignedIn ? "Go to Dashboard" : "Create Free Account"}
                            </button>

                            {!isSignedIn && (
                                <a
                                    href="#pricing"
                                    className="font-ui font-bold text-base tracking-btn text-white/70 underline hover:text-link-blue transition-colors duration-[120ms] py-3"
                                >
                                    View Pricing Plans
                                </a>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CTASection;
