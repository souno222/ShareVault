import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { apiEndpoints } from "../util/apiendpoints";
import { Copy, ShareIcon, Download, BookmarkCheck, Bookmark } from "lucide-react";
import LinkShareModal from "../components/LinkShareModal";
import FileViewer from "../components/FileViewer";
import toast from "react-hot-toast";

const PublicFileView = () => {
    const [file, setFile] = useState(null);
    const [fileBlob, setFileBlob] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [shareModal, setShareModal] = useState({
        isOpen: false,
        link: ""
    });
    const { getToken } = useAuth();
    const { fileId } = useParams();
    const navigate = useNavigate();

    const checkIfFileSaved = async (id) => {
        try {
            const token = await getToken();
            const response = await axios.get(apiEndpoints.IS_FILE_SAVED(id), {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsSaved(response.data.isSaved);
        } catch (error) {
            console.error("Error checking if file is saved:", error);
            setIsSaved(false);
        }
    };

    const handleFileSave = async () => {
        try {
            const token = await getToken();
            const response = await axios.post(
                apiEndpoints.ADD_TO_SAVED(file.id),
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 201 || response.status === 200) {
                toast.success("File saved successfully");
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Error saving file:", error);
            const errorMessage = error.response?.data?.error || "Error saving file";
            toast.error(errorMessage);
        }
    };

    const handleFileUnsave = async () => {
        try {
            const token = await getToken();
            const response = await axios.delete(
                apiEndpoints.REMOVE_FROM_SAVED(file.id),
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 201 || response.status === 200 || response.status === 204) {
                toast.success("File removed from saved");
                setIsSaved(false);
            }
        } catch (error) {
            console.error("Error unsaving file:", error);
            const errorMessage = error.response?.data?.error || "Error removing file";
            toast.error(errorMessage);
        }
    };

    const getFileType = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        
        const fileTypeMap = {
            // Images
            'jpg': 'image',
            'jpeg': 'image',
            'png': 'image',
            'gif': 'image',
            'webp': 'image',
            'svg': 'image',
            'bmp': 'image',
            'ico': 'image',
            
            // PDFs
            'pdf': 'pdf',

            // Videos
            'mp4': 'video',
            'webm': 'video',
            'ogg': 'video',
            'mov': 'video',
            'avi': 'video',
            'mkv': 'video',
            
            // Audio
            'mp3': 'audio',
            'wav': 'audio',
            'flac': 'audio',
            'm4a': 'audio',
            
            // Text
            'txt': 'text',
            'md': 'text',
            'csv': 'text',
            'json': 'text',
            'xml': 'text',
            'log': 'text',
            'js': 'text',
            'jsx': 'text',
            'ts': 'text',
            'tsx': 'text',
            'html': 'text',
            'css': 'text',
            'py': 'text',
            'java': 'text',
            'cpp': 'text',
            'c': 'text',
            'yml': 'text',
            'yaml': 'text',
        };
        return fileTypeMap[extension] || 'unsupported';
    };

    useEffect(() => {
        const getFileAndDownload = async () => {
            try {
                const token = await getToken();
                
                // Get file metadata
                const fileResponse = await axios.get(apiEndpoints.PUBLIC_FILE_VIEW(fileId), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFile(fileResponse.data);

                // Check if file is saved
                await checkIfFileSaved(fileResponse.data.id);

                // Download file blob
                const blobResponse = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileResponse.data.id), {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                });
                setFileBlob(blobResponse.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching file:", error);
                setError("Failed to load file. The link may be invalid or the file may have been removed.");
            } finally {
                setIsLoading(false);
            }
        };
        getFileAndDownload();
    }, [fileId, getToken]);

    const handleDownload = () => {
        if (!fileBlob || !file) return;
        
        const url = window.URL.createObjectURL(new Blob([fileBlob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const openShareModal = () => {
        setShareModal({
            isOpen: true,
            link: window.location.href,
        });
    };

    const closeShareModal = () => {
        setShareModal({
            isOpen: false,
            link: "",
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 text-lg">{error}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!file) return null;

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="p-4 border-b bg-white">
                <div className="container mx-auto flex justify-between items-center">
                    <div 
                        onClick={() => navigate("/")}
                        style={{cursor: "pointer"}}
                        className="flex items-center gap-2">
                        <ShareIcon className="text-blue-600" />
                        <span className="font-bold text-xl text-gray-800">
                            ShareVault
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {isSaved ? (
                            <button 
                                onClick={handleFileUnsave}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                                <BookmarkCheck size={18} />
                                Unsave
                            </button>
                        ) : (
                            <button
                                onClick={handleFileSave}
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition">
                                <Bookmark size={18} />
                                Save
                            </button>
                        )}
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                        >
                            <Download size={18} />
                            Download
                        </button>
                        <button
                            onClick={openShareModal}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                        >
                            <Copy size={18} />
                            Share Link
                        </button>
                    </div>
                </div>
                <LinkShareModal
                    isOpen={shareModal.isOpen}
                    onClose={closeShareModal}
                    link={shareModal.link}
                    title="Share File Link"
                />
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">{file.name}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Size: {(file.size / 1024).toFixed(2)} KB
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {fileBlob && <FileViewer file={file} blob={fileBlob} getFileType={getFileType} />}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PublicFileView;
