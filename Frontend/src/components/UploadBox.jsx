import { useRef, useState } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';

const UploadBox = ({
    files,
    onFileChange,
    onUpload,
    uploading,
    onRemoveFile,
    remainingCredits,
    isUploadDisabled
}) => {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    // --- Event Handlers ---

    // Handles drag events to provide visual feedback
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handles dropped files and passes them to the parent
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Pass the event-like object to the parent's handler
            onFileChange({ target: { files: e.dataTransfer.files } });
        }
    };

    // Triggers the hidden file input when the user clicks the browse button
    const onBrowseClick = () => {
        fileInputRef.current.click();
    };

    // --- Helper Functions ---

    // Formats file size for display
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    // --- Render ---

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
            {/* 1. File Drop Zone & Browse Button */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-200 cursor-pointer ${
                    dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onBrowseClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={onFileChange}
                    className="hidden"
                    disabled={uploading}
                />
                <div className="flex flex-col items-center gap-3 pointer-events-none">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-800">
                        Drop files here or <span className="text-purple-600">click to browse</span>
                    </h3>
                    <p className="text-sm text-gray-500">
                        You have {remainingCredits} credits remaining.
                    </p>
                </div>
            </div>

            {/* 2. Selected Files List */}
            {files.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">
                        Selected Files
                    </h4>
                    <div className="space-y-3">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRemoveFile(index)}
                                    className="p-1 text-gray-500 hover:text-red-600 rounded-full transition-colors disabled:opacity-50"
                                    disabled={uploading}
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Upload Action Button */}
            {files.length > 0 && (
                <div className="mt-8">
                    <button
                        onClick={onUpload}
                        disabled={isUploadDisabled}
                        className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadBox;