import { useState, useEffect } from "react";

const ImageViewer = ({ blob, fileName }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setImageUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [blob]);

    return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 min-h-[400px]">
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt={fileName}
                    className="max-w-full max-h-[600px] object-contain rounded-lg shadow-lg"
                />
            ) : (
                <div>Loading image...</div>
            )}
        </div>
    );
};

export default ImageViewer;