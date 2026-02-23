import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

const TextViewer = ({ blob, fileName }) => {
    const [textContent, setTextContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTextContent(e.target.result);
                setIsLoading(false);
            };
            reader.onerror = () => {
                setTextContent("Error reading file content.");
                setIsLoading(false);
            };
            reader.readAsText(blob);
        }
    }, [blob]);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[400px]">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <FileText className="text-blue-600" size={24} />
                <h3 className="text-lg font-semibold text-gray-800">{fileName}</h3>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div>Loading content...</div>
                </div>
            ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 overflow-auto max-h-[500px]">
                    {textContent}
                </pre>
            )}
        </div>
    );
};

export default TextViewer;