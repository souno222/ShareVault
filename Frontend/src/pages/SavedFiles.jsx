import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { apiEndpoints } from "../util/apiendpoints";
import toast from "react-hot-toast";
import { ListIcon, GridIcon, BookmarkIcon, Image, Video, Music, FileText, FileIcon, Eye, DownloadIcon, BookmarkX } from "lucide-react";
import Modal from "../components/Modal";

const SavedFiles = () => {
    const [savedFiles, setSavedFiles] = useState([]);
    const [viewMode, setViewMode] = useState("list");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const { getToken } = useAuth();
    const navigate = useNavigate();
    
    const fetchSavedFiles = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await axios.get(apiEndpoints.FETCH_SAVED_FILES, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                const sortedFiles = response.data.sort((a, b) => {
                    return new Date(b.savedAt) - new Date(a.savedAt);
                });
                setSavedFiles(sortedFiles);
            }
            else if(response.status === 429){
                toast.error(error)
            }
        } catch (error) {
            console.error('Error fetching saved files:', error);
            toast.error('Error fetching saved files');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveClick = (fileId, fileName) => {
        setSelectedFileId(fileId);
        setSelectedFileName(fileName);
        setIsModalOpen(true);
    };

    const removeFromSavedFiles = async () => {
        try {
            const token = await getToken();
            const response = await axios.delete(apiEndpoints.REMOVE_FROM_SAVED(selectedFileId), {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 204) {
                const successMessage = response.data?.message || 'File removed from saved files';
                toast.success(successMessage);
                setIsModalOpen(false); // Close modal after success
                fetchSavedFiles();
            }
        } catch (error) {
            console.error('Error removing from saved files:', error);
            const errorMessage = error.response?.data?.error || 'Error removing from saved files';
            toast.error(errorMessage);
            setIsModalOpen(false); // Close modal after error
        }
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        if(['jpg','jpeg','png','gif','bmp','svg','webp'].includes(extension)){
            return <Image size={24} className="text-purple-500" />;
        }
        if(['mp4','mkv','webm','avi','mov'].includes(extension)){
            return <Video size={24} className="text-blue-500" />;
        }
        if(['mp3','wav','flac','aac'].includes(extension)){
            return <Music size={24} className="text-green-500" />;
        }
        if(['pdf','doc','docx','ppt','pptx','txt'].includes(extension)){
            return <FileText size={24} className="text-amber-500" />;
        }
        return <FileIcon size={24} className="text-purple-500" />;
    };

    const formatFileSize = (sizeString) => {
        // If size is already formatted as string (e.g., "1.5 MB"), return as is
        if (typeof sizeString === 'string' && sizeString.includes(' ')) {
            return sizeString;
        }
        
        // If size is in bytes (number)
        const bytes = parseFloat(sizeString);
        if (!bytes || bytes === 0) return '0 Bytes';
        
        const kb = bytes / 1024;
        const mb = kb / 1024;
        const gb = mb / 1024;
        
        if (gb >= 1) {
            return gb.toFixed(2) + ' GB';
        } else if (mb >= 1) {
            return mb.toFixed(2) + ' MB';
        } else if (kb >= 1) {
            return kb.toFixed(2) + ' KB';
        } else {
            return bytes.toFixed(0) + ' Bytes';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    };

    useEffect(() => {
        fetchSavedFiles();
    }, [getToken]);

    return (
        <DashboardLayout activeMenu="Saved Files">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Saved Files {savedFiles.length}</h2>
                    <div className="flex items-center gap-3">
                        <ListIcon
                            onClick={() => setViewMode("list")}
                            size={24}
                            className={`cursor-pointer transition-colors ${viewMode === "list" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`} 
                        />
                        <GridIcon
                            size={24}
                            onClick={() => setViewMode("grid")}
                            className={`cursor-pointer transition-colors ${viewMode === "grid" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <>
                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div key={i} className="bg-white rounded-lg shadow p-6 border border-gray-100">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse"></div>
                                        <div className="space-y-2 mb-4">
                                            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                                            <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
                                        </div>
                                        <div className="flex gap-2 justify-center pt-3 border-t border-gray-100">
                                            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saved At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && savedFiles.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
                        <BookmarkIcon 
                            size={48} 
                            className="text-purple-300 mb-4" 
                        />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                            No saved files yet
                        </h3>
                        <p className="text-gray-500 text-center max-w-md mb-6">
                            Start saving files to access them quickly later. Click the "Browse Files" button to get started.
                        </p>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 hover:scale-105 transition-all duration-200"
                        >
                            Browse Files
                        </button>
                    </div>
                )}

                {/* Grid View */}
                {!loading && savedFiles.length > 0 && viewMode === "grid" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {savedFiles.map((file) => (
                            <div
                                key={file._id}
                                className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group"
                            >
                                {/* File Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 group-hover:scale-110 transition-transform duration-300">
                                        {getFileIcon(file.fileName)}
                                    </div>
                                </div>

                                {/* File Name */}
                                <h3 className="text-sm font-semibold text-gray-800 mb-3 text-center truncate" title={file.fileName}>
                                    {file.fileName}
                                </h3>

                                {/* File Info */}
                                <div className="text-xs text-gray-500 space-y-1 mb-4 text-center">
                                    <p className="font-medium">{file.size}</p>
                                    <p className="text-gray-400">Saved: {formatDate(file.savedAt)}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 justify-center pt-3 border-t border-gray-100">
                                    <a
                                        href={`/file/${file.fileId}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        title="View File"
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                    >
                                        <Eye size={18} />
                                    </a>
                                    <button
                                        onClick={() => handleRemoveClick(file.fileId, file.fileName)}
                                        title="Remove from Saved"
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                    >
                                        <BookmarkX size={18} />
                                    </button>
                                </div>
                                
                            </div>
                        ))}
                    </div>
                )}

                {/* List View */}
                {!loading && savedFiles.length > 0 && viewMode === "list" && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saved At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {savedFiles.map((file) => (
                                    <tr key={file._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                            <div className="flex items-center gap-2">
                                                {getFileIcon(file.fileName)}
                                                {file.fileName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatFileSize(file.size)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(file.savedAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {file.ownerName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <a
                                                    href={`/file/${file.fileId}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="View File"
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                >
                                                    <Eye size={18} />
                                                </a>
                                                <button
                                                    onClick={() => handleRemoveClick(file.fileId, file.fileName)}
                                                    title="Remove from Saved"
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                >
                                                    <BookmarkX size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Unsave File"
                confirmText="Unsave"
                cancelText="Cancel"
                onConfirm={removeFromSavedFiles}
                confirmationButtonClass="bg-red-600 hover:bg-red-700"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to unsave <span className="font-semibold text-gray-900">"{selectedFileName}"</span> from your saved files?
                    </p>x
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default SavedFiles;