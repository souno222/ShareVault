const PricingSection = ({ pricingPlans, navigate }) => {
    const tierLabels = ["Entry Tier", "Most Popular", "Enterprise"];

    return (
        <section id="pricing" className="bg-paper border-b border-ink">
            {/* ── Section Ribbon ── */}
            <div className="bg-ink">
                <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-16 py-2.5">
                    <span className="font-mono font-bold text-[0.75rem] tracking-ribbon uppercase text-paper leading-none">
                        Pricing
                    </span>
                </div>
            </div>

            <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-16">
                {/* Section header */}
                <div className="pt-12 pb-8 border-b border-ink max-w-xl">
                    <p className="font-mono text-[0.81rem] tracking-kicker uppercase text-caption leading-kicker mb-3">
                        Simple, Transparent Pricing
                    </p>
                    <h2 className="font-display font-normal text-[1.63rem] leading-grid text-page-ink">
                        No hidden fees. No dark patterns. Just the plan you need.
                    </h2>
                </div>

                {/* Pricing columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-ink">
                    {pricingPlans.map((plan, index) => {
                        const highlighted = plan.highlighted;
                        const isLast = index === pricingPlans.length - 1;

                        return (
                            <article
                                key={index}
                                id={`plan-${plan.name.toLowerCase()}`}
                                className={[
                                    "flex flex-col p-10",
                                    index === 0 ? "pl-0" : "",
                                    isLast ? "pr-0" : "border-r border-ink",
                                    highlighted ? "bg-ink" : "bg-paper",
                                ].join(" ")}
                            >
                                {/* Tier kicker */}
                                <p className={`font-mono text-[0.81rem] tracking-kicker uppercase leading-kicker mb-2 ${highlighted ? "text-white/50" : "text-caption"}`}>
                                    {tierLabels[index]}
                                </p>

                                {/* Plan name */}
                                <h3 className={`font-display font-normal text-[1.63rem] leading-grid mb-4 ${highlighted ? "text-paper" : "text-page-ink"}`}>
                                    {plan.name}
                                </h3>

                                {/* Price */}
                                <div className={`border-y py-5 mb-6 ${highlighted ? "border-white/25" : "border-ink"}`}>
                                    <span className={`font-display font-normal text-[2.5rem] leading-none tracking-hero ${highlighted ? "text-paper" : "text-page-ink"}`}>
                                        ₹{plan.price}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className={`font-body text-base leading-[1.5] mb-6 ${highlighted ? "text-white/75" : "text-caption"}`}>
                                    {plan.description}
                                </p>

                                {/* Feature list */}
                                <ul className="flex-1 flex flex-col mb-8">
                                    {plan.features.map((feat, fi) => (
                                        <li
                                            key={fi}
                                            className={`flex items-start gap-2.5 py-2.5 border-b text-base font-body leading-[1.5] ${highlighted ? "border-white/10 text-paper" : "border-hairline text-page-ink"}`}
                                        >
                                            <span className={`font-mono text-xs shrink-0 mt-0.5 ${highlighted ? "text-white/50" : "text-caption"}`}>
                                                —
                                            </span>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA button */}
                                {highlighted ? (
                                    <button
                                        id={`cta-plan-${plan.name.toLowerCase()}`}
                                        onClick={() => navigate('/sign-up')}
                                        className="w-full font-ui font-bold text-base tracking-btn text-ink bg-paper border-2 border-paper py-3 rounded-none cursor-pointer hover:bg-transparent hover:text-paper transition-colors duration-150"
                                    >
                                        {plan.cta}
                                    </button>
                                ) : (
                                    <button
                                        id={`cta-plan-${plan.name.toLowerCase()}`}
                                        onClick={() => navigate('/sign-up')}
                                        className="w-full font-ui font-bold text-base tracking-btn text-ink bg-paper border-2 border-ink py-3 rounded-none cursor-pointer hover:bg-ink hover:text-paper transition-colors duration-150"
                                    >
                                        {plan.cta}
                                    </button>
                                )}
                            </article>
                        );
                    })}
                </div>

                {/* Fine print */}
                <p className="font-mono text-[0.75rem] tracking-kicker uppercase text-caption py-5">
                    Pay once. Use for life.
                </p>
            </div>
        </section>
    );
};

export default PricingSection;
