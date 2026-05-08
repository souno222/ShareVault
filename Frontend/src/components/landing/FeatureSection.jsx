import { ArrowUpCircle, Shield, Share2, FileText, Clock, FolderOpen } from "lucide-react";

const ICON_MAP = { ArrowUpCircle, Shield, Share2, FileText, Clock, FolderOpen };

const FeatureSection = ({ features }) => {
    const renderIcon = (iconName) => {
        const Icon = ICON_MAP[iconName] || FileText;
        return <Icon size={22} strokeWidth={1.5} className="text-page-ink" />;
    };

    return (
        <section id="features" className="bg-paper border-b border-ink">
            {/* ── Section Ribbon ── */}
            <div className="bg-ink">
                <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-16 py-2.5">
                    <span className="font-mono font-bold text-[0.75rem] tracking-ribbon uppercase text-paper leading-none">
                        Platform Features
                    </span>
                </div>
            </div>

            <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-16">
                {/* Section header */}
                <div className="pt-12 pb-8 border-b border-ink max-w-xl">
                    <p className="font-mono text-[0.81rem] tracking-kicker uppercase text-caption leading-kicker mb-3">
                        Everything You Need
                    </p>
                    <h2 className="font-display font-normal text-[1.63rem] leading-grid tracking-[0px] text-page-ink">
                        Built for speed. Designed for security. Engineered for trust.
                    </h2>
                </div>

                {/* Feature grid — editorial columns separated by hairline rules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const col = index % 3;
                        const totalCols = 3;
                        const isLastInRow = col === totalCols - 1;
                        const isInLastRow = index >= features.length - (features.length % totalCols || totalCols);

                        return (
                            <article
                                key={index}
                                id={`feature-${index}`}
                                className={[
                                    "py-8",
                                    col > 0 ? "lg:pl-8" : "",
                                    !isLastInRow ? "lg:pr-8 lg:border-r lg:border-ink" : "",
                                    !isInLastRow ? "border-b border-ink" : "",
                                ].join(" ")}
                            >
                                {/* Icon — no colored bg, no rounded container */}
                                <div className="mb-4">{renderIcon(feature.iconName)}</div>

                                {/* Kicker — feature title as mono label */}
                                <p className="font-mono text-[0.81rem] tracking-kicker uppercase text-caption leading-kicker mb-2">
                                    {feature.title}
                                </p>

                                {/* Body text */}
                                <p className="font-body text-base leading-[1.5] tracking-[0.09px] text-page-ink">
                                    {feature.description}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;