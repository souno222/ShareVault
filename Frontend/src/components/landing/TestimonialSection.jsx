const TestimonialSection = ({ testimonials }) => {
    return (
        <section id="testimonials" className="bg-paper border-b border-ink">
            {/* ── Section Ribbon ── */}
            <div className="bg-ink">
                <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-16 py-2.5">
                    <span className="font-mono font-bold text-[0.75rem] tracking-ribbon uppercase text-paper leading-none">
                        Trusted By Professionals
                    </span>
                </div>
            </div>

            <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-16">
                {/* Section header */}
                <div className="pt-12 pb-8 border-b border-ink max-w-xl">
                    <p className="font-mono text-[0.81rem] tracking-kicker uppercase text-caption leading-kicker mb-3">
                        User Stories
                    </p>
                    <h2 className="font-display font-normal text-[1.63rem] leading-grid text-page-ink">
                        What people are saying about ShareVault.
                    </h2>
                </div>

                {/* Testimonial columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-ink">
                    {testimonials.map((testimonial, index) => {
                        const isLast = index === testimonials.length - 1;

                        return (
                            <article
                                key={testimonial.id || index}
                                id={`testimonial-${index}`}
                                className={[
                                    "py-10",
                                    index === 0 ? "pr-0 md:pr-10" : "pl-0 md:pl-10",
                                    index > 0 && !isLast ? "md:pr-10" : "",
                                    !isLast ? "border-b md:border-b-0 md:border-r border-ink" : "",
                                ].join(" ")}
                            >
                                {/* Star rating in mono characters */}
                                <p className="font-mono text-[0.81rem] tracking-[2px] text-caption mb-4 leading-none">
                                    {"★".repeat(testimonial.rating)}
                                    {"☆".repeat(5 - testimonial.rating)}
                                </p>

                                {/* Quote — italic Lora */}
                                <blockquote className="font-body italic text-[1.19rem] leading-deck tracking-[0.108px] text-page-ink mb-6">
                                    "{testimonial.feedback}"
                                </blockquote>

                                {/* Attribution */}
                                <div className="border-t border-ink pt-4 flex items-center gap-3">
                                    {/* Avatar — the only circle permitted per DESIGN.md */}
                                    {testimonial.image ? (
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-10 h-10 rounded-full object-cover border border-hairline shrink-0"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full border border-ink flex items-center justify-center font-mono text-[0.69rem] tracking-[0.5px] text-page-ink shrink-0">
                                            {testimonial.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .slice(0, 2)
                                                .join("")
                                                .toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-ui font-bold text-sm tracking-btn text-page-ink mb-0.5">
                                            {testimonial.name}
                                        </p>
                                        <p className="font-mono text-[0.75rem] tracking-meta uppercase text-caption leading-none">
                                            {testimonial.designation}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
