import { useState, useEffect } from "react";

/**
 * WIRED-system PDFViewer
 * - Square iframe, no rounded container
 * - 2px black border on the iframe (structural emphasis)
 * - Minimal chrome — the PDF IS the content
 * - Loading state = mono kicker
 */
const PDFViewer = ({ blob, fileName }) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [blob]);

    return (
        /* DESIGN.md: no rounded container, #f5f5f5 neutral bg while loading */
        <div
            style={{
                width: "100%",
                minHeight: "600px",
                backgroundColor: "#f5f5f5",
                borderRadius: 0,
            }}
        >
            {pdfUrl ? (
                <iframe
                    src={pdfUrl}
                    title={fileName}
                    style={{
                        width: "100%",
                        height: "700px",
                        /* DESIGN.md: 1px black hairline on embedded elements */
                        border: "1px solid #000000",
                        borderRadius: 0,
                        display: "block",
                    }}
                />
            ) : (
                /* Loading state aligned to top-left — editorial rhythm */
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "600px",
                    }}
                >
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
                        Loading PDF…
                    </p>
                </div>
            )}
        </div>
    );
};

export default PDFViewer;