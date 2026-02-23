import { useState, useEffect } from "react";

const PDFViewer = ({ blob, fileName }) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [blob]);

    return (
        <div className="w-full h-full min-h-[600px] bg-gray-100 rounded-lg">
            {pdfUrl ? (
                <iframe
                    src={pdfUrl}
                    title={fileName}
                    className="w-full h-[600px] rounded-lg border-0"
                />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <div>Loading PDF...</div>
                </div>
            )}
        </div>
    );
};

export default PDFViewer;