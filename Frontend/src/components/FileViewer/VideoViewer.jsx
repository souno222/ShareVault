import { useState, useEffect } from "react";

/**
 * WIRED-system VideoViewer
 * - Pure black (#000) stage — the only acceptable non-white background
 *   for a video container (it IS the medium)
 * - Square corners, no shadow, no rounded wrapper
 */
const VideoViewer = ({ blob, fileName }) => {
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [blob]);

    return (
        /* DESIGN.md: black (#000) only for video stage — printerly, not atmospheric */
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000000",
                minHeight: "400px",
                borderRadius: 0,
            }}
        >
            {videoUrl ? (
                <video
                    controls
                    src={videoUrl}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "600px",
                        borderRadius: 0,
                        display: "block",
                    }}
                >
                    Your browser does not support the video tag.
                </video>
            ) : (
                /* DESIGN.md: mono kicker for status labels */
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
                    Loading video…
                </p>
            )}
        </div>
    );
};

export default VideoViewer;