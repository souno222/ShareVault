import { useState, useEffect } from "react";

const VideoViewer = ({ blob, fileName }) => {
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [blob]);

    return (
        <div className="flex items-center justify-center bg-black rounded-lg p-4 min-h-[400px]">
            {videoUrl ? (
                <video 
                    controls 
                    className="max-w-full max-h-[600px] rounded-lg"
                    src={videoUrl}
                >
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div className="text-white">Loading video...</div>
            )}
        </div>
    );
};

export default VideoViewer;