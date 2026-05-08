const CreditsDisplay = ({ credits }) => {
    const formatCredits = (creditsInBytes) => {
        if (!creditsInBytes || creditsInBytes === 0) return { value: "0", unit: "Bytes" };
        const bytes = creditsInBytes;
        const kb = bytes / 1000;
        const mb = kb / 1000;
        const gb = mb / 1000;
        if (gb >= 1) return { value: gb.toFixed(2), unit: "GB" };
        if (mb >= 1) return { value: mb.toFixed(2), unit: "MB" };
        if (kb >= 1) return { value: kb.toFixed(2), unit: "KB" };
        return { value: bytes.toFixed(0), unit: "B" };
    };

    const { value, unit } = formatCredits(credits);

    return (
        /* DESIGN.md: no rounded pills on non-icon elements; use 2px border treatment */
        <div className="flex items-baseline gap-1.5 border border-ink px-3 py-1 cursor-default">
            {/* Value — display numerals in Playfair */}
            <span className="font-display font-normal text-base leading-none text-page-ink">
                {value}
            </span>
            {/* Unit — mono caps label */}
            <span className="font-mono font-bold text-[0.63rem] tracking-ribbon uppercase text-caption leading-none">
                {unit} left
            </span>
        </div>
    );
};

export default CreditsDisplay;