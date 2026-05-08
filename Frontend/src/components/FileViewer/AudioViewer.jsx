import { useState, useEffect } from "react";
import { Music } from "lucide-react";

/**
 * WIRED-system AudioViewer
 * - Paper white (#fff) surface, no gradient, no shadow
 * - Square corners throughout
 * - Large Music icon in page-ink (#1a1a1a) — no color
 * - Filename as UI-font label above the player
 * - Native <audio> controls styled via the WIRED wrapper
 */
const AudioViewer = ({ blob, fileName }) => {
    const [audioUrl, setAudioUrl] = useState(null);

    useEffect(() => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [blob]);

    return (
        /* DESIGN.md: paper white, no gradient, no rounded corners */
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 0,
                padding: "48px 32px",
                minHeight: "320px",
                gap: "24px",
            }}
        >
            {/* Icon — page-ink, no color accent, no circle background */}
            <Music
                size={48}
                strokeWidth={1}
                style={{ color: "#1a1a1a" }}
            />

            {/* File name — UI font heading */}
            <div style={{ textAlign: "center" }}>
                {/* DESIGN.md: WiredMono kicker above the name */}
                <p
                    className="font-mono uppercase"
                    style={{
                        fontSize: "0.69rem",
                        fontWeight: 700,
                        letterSpacing: "1.2px",
                        color: "#757575",
                        lineHeight: 1,
                        marginBottom: "6px",
                    }}
                >
                    Audio File
                </p>
                <p
                    className="font-ui"
                    style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#1a1a1a",
                        letterSpacing: "0.108px",
                        lineHeight: 1.4,
                    }}
                >
                    {fileName}
                </p>
            </div>

            {/* Hairline rule */}
            <div style={{ width: "100%", maxWidth: "480px", borderTop: "1px solid #e2e8f0" }} />

            {/* Native audio player */}
            {audioUrl ? (
                <audio
                    controls
                    src={audioUrl}
                    style={{ width: "100%", maxWidth: "480px" }}
                >
                    Your browser does not support the audio element.
                </audio>
            ) : (
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
                    Loading audio…
                </p>
            )}
        </div>
    );
};

export default AudioViewer;