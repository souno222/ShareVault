import { FileQuestion, Download } from "lucide-react";
import { useState } from "react";

/**
 * WIRED-system UnsupportedFileViewer
 * - Paper white surface, 2px dashed black border (structural emphasis)
 * - Square corners
 * - FileQuestion icon in page-ink, no color
 * - Mono ALL-CAPS eyebrow kicker
 * - WIRED primary CTA button for download (2px solid black, inversion hover)
 * - No rounded container, no shadow, no background color
 */
const UnsupportedFileViewer = ({ fileName, onDownload }) => {
    const [hovered, setHovered] = useState(false);

    return (
        /* DESIGN.md: 2px dashed = structural emphasis for "drop zone" state */
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                border: "2px dashed #000000",
                borderRadius: 0,
                padding: "64px 32px",
                minHeight: "400px",
                textAlign: "center",
            }}
        >
            {/* Icon — page-ink, no background circle */}
            <FileQuestion
                size={40}
                strokeWidth={1}
                style={{ color: "#1a1a1a", marginBottom: "16px" }}
            />

            {/* DESIGN.md: WiredMono ALL-CAPS kicker above headline */}
            <p
                className="font-mono uppercase"
                style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "1.2px",
                    color: "#757575",
                    lineHeight: 1.23,
                    marginBottom: "8px",
                }}
            >
                Preview not available
            </p>

            {/* DESIGN.md: Apercu subheading for the main message */}
            <p
                className="font-ui"
                style={{
                    fontSize: "1.06rem",
                    fontWeight: 700,
                    letterSpacing: "-0.144px",
                    color: "#1a1a1a",
                    lineHeight: 1.29,
                    marginBottom: "8px",
                }}
            >
                {fileName}
            </p>

            {/* DESIGN.md: body copy in BreveText (Lora) */}
            <p
                className="font-body"
                style={{
                    fontSize: "1rem",
                    color: "#757575",
                    lineHeight: 1.5,
                    letterSpacing: "0.09px",
                    maxWidth: "360px",
                    marginBottom: "32px",
                }}
            >
                This file type cannot be previewed in the browser.
                Download it to view the contents on your device.
            </p>

            {/* Hairline divider before CTA */}
            <div style={{ width: "100%", maxWidth: "360px", borderTop: "1px solid #e2e8f0", marginBottom: "24px" }} />

            {/* DESIGN.md: primary CTA — 2px solid black, 0 radius, inversion on hover 150ms */}
            {onDownload ? (
                <button
                    onClick={onDownload}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="font-ui"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 24px",
                        fontSize: "1rem",
                        fontWeight: 700,
                        letterSpacing: "0.3px",
                        lineHeight: 1.25,
                        border: "2px solid #000000",
                        borderRadius: 0,
                        backgroundColor: hovered ? "#1a1a1a" : "#000000",
                        color: "#ffffff",
                        cursor: "pointer",
                        transition: "background-color 150ms",
                    }}
                >
                    <Download size={16} strokeWidth={2} />
                    Download File
                </button>
            ) : (
                /* Fallback static display when no handler provided */
                <div
                    className="font-ui"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#757575",
                        border: "1px solid #e2e8f0",
                        borderRadius: 0,
                        letterSpacing: "0.108px",
                    }}
                >
                    <Download size={14} strokeWidth={1.5} />
                    {fileName}
                </div>
            )}
        </div>
    );
};

export default UnsupportedFileViewer;