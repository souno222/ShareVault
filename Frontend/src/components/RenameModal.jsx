import { useState, useEffect, useRef } from "react";
import { X, Edit } from "lucide-react";

const RenameModal = ({ isOpen, onClose, onRename, currentFileName }) => {
    const [newName, setNewName] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && currentFileName) {
            // Extract name without extension
            const lastDotIndex = currentFileName.lastIndexOf('.');
            const nameWithoutExt = lastDotIndex !== -1 
                ? currentFileName.substring(0, lastDotIndex)
                : currentFileName;
            
            setNewName(currentFileName);
            
            // Focus and select the name part (without extension)
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.setSelectionRange(0, nameWithoutExt.length);
                }
            }, 100);
        }
    }, [isOpen, currentFileName]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName.trim() && newName !== currentFileName) {
            onRename(newName.trim());
        }
    };

    const handleClose = () => {
        setNewName("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Edit size={20} className="text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Rename File</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New File Name
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Enter new file name"
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!newName.trim() || newName === currentFileName}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Rename
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RenameModal;