import { FileQuestion, Download } from "lucide-react";

const UnsupportedFileViewer = ({ fileName }) => {
    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 min-h-[400px]">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <FileQuestion size={48} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Preview Not Available</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
                This file type cannot be previewed in the browser. You can download it to view on your device.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">
                <Download size={18} className="text-gray-600" />
                <span className="text-sm text-gray-700">{fileName}</span>
            </div>
        </div>
    );
};

export default UnsupportedFileViewer;