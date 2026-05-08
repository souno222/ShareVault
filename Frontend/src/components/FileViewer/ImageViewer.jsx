import { useState, useEffect } from "react";

/**
 * WIRED-system ImageViewer
 * - Full-bleed image, square corners (border-radius: 0)
 * - No rounded container, no shadow
 * - Checkerboard bg (neutral #f5f5f5) to show transparent images
 * - Loading state = mono kicker, no spinner animation
 */
const ImageViewer = ({ blob, fileName }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [blob]);

    return (
        /* DESIGN.md: flat #f5f5f5 surface, 0 radius, no shadow */
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                minHeight: "400px",
                borderRadius: 0,
                /* subtle checkerboard for transparent images */
                backgroundImage: imageUrl
                    ? "repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%)"
                    : "none",
                backgroundSize: "24px 24px",
            }}
        >
            {imageUrl ? (
                /* DESIGN.md: square corners, full-bleed within column */
                <img
                    src={imageUrl}
                    alt={fileName}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "600px",
                        objectFit: "contain",
                        borderRadius: 0,
                        display: "block",
                    }}
                />
            ) : (
                <LoadingKicker label="Loading image" />
            )}
        </div>
    );
};

export default ImageViewer;

/* shared within this file only */
export const LoadingKicker = ({ label }) => (
    <p
        className="font-mono uppercase"
        style={{
            fontSize: "0.69rem",
            fontWeight: 700,
            letterSpacing: "1.2px",
            color: "#757575",
            lineHeight: 1,
        }}
    >
        {label}…
    </p>
);