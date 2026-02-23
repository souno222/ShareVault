import { useState, useEffect } from "react";
import { Music } from "lucide-react";

const AudioViewer = ({ blob, fileName }) => {
    const [audioUrl, setAudioUrl] = useState(null);

    useEffect(() => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [blob]);

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-8 min-h-[400px]">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Music size={48} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{fileName}</h3>
            {audioUrl ? (
                <audio 
                    controls 
                    className="w-full max-w-md"
                    src={audioUrl}
                >
                    Your browser does not support the audio tag.
                </audio>
            ) : (
                <div>Loading audio...</div>
            )}
        </div>
    );
};

export default AudioViewer;