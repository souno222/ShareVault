import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate,Link } from "react-router-dom";
import { ListIcon,GridIcon,GlobeIcon, LockIcon ,CopyIcon,DownloadIcon, TrashIcon,Eye,Image,Video,Music,FileText,FileIcon,Edit,Shield} from "lucide-react";
import FileCard from "../components/FileCard";
import { apiEndpoints } from "../util/apiendpoints";
import ConfirmationDialog from "../components/ConfirmationDialog";
import LinkShareModal from "../components/LinkShareModal";
import RenameModal from "../components/RenameModal";
import ManageFileVisibilityModal from "../components/ManageFileVisibilityModal";
//fetch files from backend and display them in grid or list view for a logged in user
const MyFiles = () => {
    const [files,setFiles]= useState([]);
    const [viewMode,setViewMode]= useState("list");
    const [loading, setLoading] = useState(true);
    const {getToken} = useAuth();
    const navigate = useNavigate();
    const [deleteConfirmationOpen,setDeleteConfirmation] = useState({
        isOpen: false,
        fileId: null,   
    });
    const [shareModal,setShareModal] = useState({
        isOpen: false,
        fileId: null,
        link: ""
    });
     const [renameModal, setRenameModal] = useState({
        isOpen: false,
        fileId: null,
        currentFileName: ""
    });
    const [visibilityModal, setVisibilityModal] = useState({
        isOpen: false,
        fileId: null,
        fileName: "",
        currentVisibility: "private",
        currentAccessList: []
    });

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await axios.get(apiEndpoints.FETCH_FILES,{headers: {Authorization: `Bearer ${token}`}});
            if(response.status === 200){
                const sortedFiles = response.data.sort((a, b) => {
                return new Date(b.uploadedAt) - new Date(a.uploadedAt);
            });
            setFiles(sortedFiles);
            }    
            }catch (error) {
            console.error('Error fetching the files from server:',error);
            toast.error('Error fetching files from server',error.message);
        } finally {
            setLoading(false);
        }
    }

    //Open visibility modal and fetch current access list
    const openVisibilityModal = async (file) => {
        try {
            const token = await getToken();
            let accessList = [];
            
            // Fetch access list if file is protected
            if (file.visibility === 'protected') {
                const response = await axios.get(
                    apiEndpoints.GET_FILE_ACCESS_LIST(file.id),
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                accessList = response.data?.accessList || [];
            }

            // Set modal state once with all data
            setVisibilityModal({
                isOpen: true,
                fileId: file.id,
                fileName: file.name,
                currentVisibility: file.visibility,
                currentAccessList: accessList
            });
        } catch (error) {
            console.error('Error fetching access list:', error);
            toast.error('Error loading file settings');
        }
    };

    //Close visibility modal
    const closeVisibilityModal = () => {
        setVisibilityModal({
            isOpen: false,
            fileId: null,
            fileName: "",
            currentVisibility: "private",
            currentAccessList: []
        });
    };

    //Handle visibility and access list changes
    const handleVisibilityChange = async ({ visibility, accessList }) => {
        try {
            const token = await getToken();
            const fileId = visibilityModal.fileId;

            // Change file visibility
            await axios.patch(
                apiEndpoints.CHANGE_FILE_VISIBILITY(fileId, visibility),
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update access list if visibility is protected
            if (visibility === 'protected') {
                await axios.post(
                    apiEndpoints.EDIT_FILE_ACCESS_LIST(fileId),
                    accessList,  // Now this is already in format { emails: [...] }
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            // Update local state
            setFiles(files.map(file => 
                file.id === fileId 
                    ? { ...file, visibility: visibility }
                    : file
            ));

            toast.success('File visibility updated successfully');
            closeVisibilityModal();
        } catch (error) {
            console.error('Error updating file visibility:', error);
            const errorMessage = error.response?.data?.error || 'Error updating file visibility';
            toast.error(errorMessage);
        }
    };

    //Handle file download

    const handleDownload = async (file) => {
        try{
            const token = await getToken();
            const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(file.id),{headers: {Authorization: `Bearer ${token}`},responseType: 'blob'});
            //create a blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download',file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); //clean up the URL object
        }catch(error){
            console.error('Error downloading file:',error);
            if (error.response?.status === 404) {
                toast.error('File not found');
            } else if (error.response?.status === 403) {
                toast.error('Access denied');
            } else {
                toast.error('Error downloading file');
            }
        }
    }

    //opens the rename modal
    const openRenameModal = (fileId, currentFileName) => {
        setRenameModal({
            isOpen: true,
            fileId,
            currentFileName
        });
    };

    //closes the rename modal
    const closeRenameModal = () => {
        setRenameModal({
            isOpen: false,
            fileId: null,
            currentFileName: ""
        });
    };

    //Handle file rename
    const handleRenameFile = async (newName) => {
        try {
            const token = await getToken();
            await axios.patch(
                apiEndpoints.RENAME_FILE(renameModal.fileId, newName),
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFiles(files.map((file) => 
                file.id === renameModal.fileId ? { ...file, name: newName } : file
            ));
            toast.success('File renamed successfully');
            closeRenameModal();
        } catch (error) {
            console.error('Error renaming file:', error);
            toast.error('Error renaming file');
        }
    };

    //Close delete confirmation dialog
    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            isOpen: false,
            fileId: null
        })
    }

    //Open delete confirmation dialog
    const openDeleteConfirmation = (fileId) => {
        setDeleteConfirmation({
            isOpen: true,
            fileId: fileId
        })
    }

    //Handle file deletion
    const handleDeleteFile = async () => {
        try{
            const token = await getToken();     
            await axios.delete(apiEndpoints.DELETE_FILE(deleteConfirmationOpen.fileId),{headers: {Authorization: `Bearer ${token}`}});
            setFiles(files.filter((file) => file.id !== deleteConfirmationOpen.fileId));
            toast.success('File deleted successfully');
        }catch(error){
            console.error('Error deleting file:',error);
            toast.error('Error deleting file',error.message);
        }
    }

    //opens the share link modal

    const openShareModal = (fileId) => {
        const link = `${window.location.origin}/file/${fileId}`;
        setShareModal({
            isOpen: true,
            fileId,
            link
        });
    }

    //closes the share link modal
    const closeShareModal = () => {
        setShareModal({
            isOpen: false,
            fileId: null,
            link: ""
        });
    }

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

    useEffect(() => {
        fetchFiles();
    },[getToken]);

    const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
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
    }

    const getVisibilityDisplay = (visibility) => {
        switch(visibility) {
            case 'public':
                return {
                    icon: <GlobeIcon size={16} className="text-green-500" />,
                    text: 'Public',
                    textColor: 'text-green-600',
                    hoverColor: 'group-hover:bg-green-600'
                };
            case 'protected':
                return {
                    icon: <Shield size={16} className="text-purple-500" />,
                    text: 'Protected',
                    textColor: 'text-purple-600',
                    hoverColor: 'group-hover:bg-purple-600'
                };
            default:
                return {
                    icon: <LockIcon size={16} className="text-red-500" />,
                    text: 'Private',
                    textColor: 'text-red-600',
                    hoverColor: 'group-hover:bg-red-600'
                };
        }
    };

    return(
        <DashboardLayout activeMenu="My Files">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold"> My Files {files.length}</h2>
                    <div className="flex items-center gap-3">
                        <ListIcon
                            onClick={() => setViewMode("list")}
                            size={24}
                            className={`cursor-pointer transition-colors ${viewMode === "list" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`} />
                        <GridIcon
                            size={24}
                            onClick={() => setViewMode("grid")}
                            className={`cursor-pointer transition-colors ${viewMode === "grid" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}/>
                    </div>
                </div>
                {loading ? (
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
                                            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto bg-white rounded-lg shadow">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharing</th>
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
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex gap-3">
                                                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                                                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                                                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                                                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : files.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
                        <FileIcon 
                            size={48} 
                            className="text-purple-300 mb-4" 
                        />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                            No files found yet
                        </h3>
                        <p className="text-gray-500 text-center max-w-md mb-6">
                            Start uploading your files to see them listed here. Click the "Go to Upload" button to get started.
                        </p>
                        <button 
                            onClick={() => navigate('/upload')}
                            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 hover:scale-105 transition-all duration-200">
                            Go to Upload
                        </button>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {files.map((file) => (
                            <FileCard 
                                key={file.id} 
                                file={file}
                                onDownload={handleDownload}
                                onDelete={openDeleteConfirmation}
                                onManageVisibility={() => openVisibilityModal(file)}
                                onShareLink={openShareModal} />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharing</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {files.map((file) => {
                                        const visibilityDisplay = getVisibilityDisplay(file.visibility);
                                        return (
                                            <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                    <div className="flex items-center gap-2">
                                                        {getFileIcon(file)}
                                                        {file.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {formatFileSize(file.size)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <div className="flex items-center gap-4">
                                                        <button 
                                                            onClick={() => openVisibilityModal(file)}
                                                            className="flex items-center gap-2 cursor-pointer group"
                                                        >
                                                            {visibilityDisplay.icon}
                                                            <span className={`${visibilityDisplay.textColor} group-hover:text-white ${visibilityDisplay.hoverColor} transition-all duration-200 px-1 rounded`}>
                                                                {visibilityDisplay.text}
                                                            </span>
                                                        </button>
                                                        {file.visibility === "public" && (
                                                            <button
                                                                onClick={() => openShareModal(file.id)} 
                                                                className="flex items-center gap-2 cursor-pointer text-blue-600 group">
                                                                <CopyIcon size={16} />
                                                                <span className="group-hover:underline">
                                                                    Share
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-3">
                                                        <button 
                                                            onClick ={() => handleDownload(file)}   
                                                            title="Download"
                                                            className="text-gray-500 hover:text-green-600 transition-colors">
                                                            <DownloadIcon size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => openRenameModal(file.id, file.name)} 
                                                            title="Rename"
                                                            className="text-gray-500 hover:text-blue-600 transition-colors">
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteConfirmation(file.id)} 
                                                            title="Delete"
                                                            className="text-gray-500  hover:bg-red-600 hover:text-white p-1 rounded-full transition-all duration-200">
                                                                <TrashIcon size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => window.open(`/file/${file.id}`, '_blank')}
                                                            title="View File"
                                                            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-full transition-all duration-200">
                                                            <Eye size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile/Tablet Card View */}
                        <div className="lg:hidden space-y-4">
                            {files.map((file) => {
                                const visibilityDisplay = getVisibilityDisplay(file.visibility);
                                return (
                                    <div key={file.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
                                        {/* File Name and Icon */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="flex-shrink-0">
                                                {getFileIcon(file)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-800 truncate">
                                                    {file.name}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                                    <span>{formatFileSize(file.size)}</span>
                                                    <span>•</span>
                                                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Visibility Status */}
                                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                                            <button 
                                                onClick={() => openVisibilityModal(file)}
                                                className="flex items-center gap-2 cursor-pointer group"
                                            >
                                                {visibilityDisplay.icon}
                                                <span className={`text-sm ${visibilityDisplay.textColor} group-hover:text-white ${visibilityDisplay.hoverColor} transition-all duration-200 px-2 py-1 rounded`}>
                                                    {visibilityDisplay.text}
                                                </span>
                                            </button>
                                            {file.visibility === "public" && (
                                                <button
                                                    onClick={() => openShareModal(file.id)} 
                                                    className="flex items-center gap-2 cursor-pointer text-blue-600 group text-sm">
                                                    <CopyIcon size={14} />
                                                    <span className="group-hover:underline">
                                                        Share Link
                                                    </span>
                                                </button>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-4 gap-2">
                                            <button 
                                                onClick={() => handleDownload(file)}   
                                                className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                                                <DownloadIcon size={18} />
                                                <span className="text-xs">Download</span>
                                            </button>
                                            <button
                                                onClick={() => openRenameModal(file.id, file.name)} 
                                                className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                <Edit size={18} />
                                                <span className="text-xs">Rename</span>
                                            </button>
                                            <button
                                                onClick={() => openDeleteConfirmation(file.id)} 
                                                className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                <TrashIcon size={18} />
                                                <span className="text-xs">Delete</span>
                                            </button>
                                            <a 
                                                href={`/file/${file.id}`} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                                                <Eye size={18} />
                                                <span className="text-xs">View</span>
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
                {/* Delete Confirmation Dialog */}
                <ConfirmationDialog
                    isOpen={deleteConfirmationOpen.isOpen}
                    onClose={closeDeleteConfirmation}
                    title="Delete File"
                    message="Are you sure you want to delete this file? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDeleteFile}
                    confirmationButtonClass="bg-red-600 hover:bg-red-700"
                />
                
                {/* Rename Modal */}
                <RenameModal
                    isOpen={renameModal.isOpen}
                    onClose={closeRenameModal}
                    onRename={handleRenameFile}
                    currentFileName={renameModal.currentFileName}
                />
                
                {/* Share Link Modal */}
                <LinkShareModal
                    isOpen={shareModal.isOpen}
                    onClose={closeShareModal}
                    link={shareModal.link}
                    title="Share File Link"
                />

                {/* Manage File Visibility Modal */}
                <ManageFileVisibilityModal
                    key={visibilityModal.fileId}
                    isOpen={visibilityModal.isOpen}
                    onClose={closeVisibilityModal}
                    currentVisibility={visibilityModal.currentVisibility}
                    currentAccessList={visibilityModal.currentAccessList}
                    fileName={visibilityModal.fileName}
                    fileId={visibilityModal.fileId}  // Add this prop
                    onSave={handleVisibilityChange}
                />
            </div>
        </DashboardLayout>
    )
}

export default MyFiles;
