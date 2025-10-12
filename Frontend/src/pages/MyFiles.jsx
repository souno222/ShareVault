import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate,Link } from "react-router-dom";
import { ListIcon,GridIcon,GlobeIcon, LockIcon ,CopyIcon,DownloadIcon, TrashIcon,Eye,Image,Video,Music,FileText,FileIcon} from "lucide-react";
import FileCard from "../components/FileCard";
import { apiEndpoints } from "../util/apiendpoints";

//fetch files from backend and display them in grid or list view for a logged in user
const MyFiles = () => {
    const [files,setFiles]= useState([]);
    const [viewMode,setViewMode]= useState("list");
    const {getToken} = useAuth();
    const navigate = useNavigate();

    const fetchFiles = async () => {
        try {
            const token = await getToken();
            const response = await axios.get('http://localhost:8080/api/v1.0/files/my',{headers: {Authorization: `Bearer ${token}`}});
            if(response.status === 200){
                setFiles(response.data);
            }
        }catch (error) {
            console.log('Error fetching the files from server:',error);
            toast.error('Error fetching files from server',error.message);

        }
    }

    //Toggles the status of file between public and private

    const togglePublic = async (filetoUpdate) => {
        try{
            const token = await getToken();
            await axios.patch(apiEndpoints.TOGGLE_FILE(filetoUpdate.id),{},{headers: {Authorization: `Bearer ${token}`}});
            setFiles(files.map((file) => file.id === filetoUpdate.id ? {...file, public: !file.public} : file));
        }catch(error){
            console.error('Error toggling file status:',error);
            toast.error('Error toggling file status',error.message);
        }
    }
    
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

    useEffect(() => {
        fetchFiles();
    },[getToken]);
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
                {files.length === 0 ? (
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
                ):viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {files.map((file) => (
                            <FileCard 
                                key={file.id} 
                                file={file} />
                        ))}
                    </div>
                ):(
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
                                {files.map((file) => (
                                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                            <div className="flex items-center gap-2">
                                                {getFileIcon(file)}
                                                {file.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {(file.size / 1024 ).toFixed(1)} KB
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(file.uploadedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center gap-4">
                                                <button 
                                                    onClick={() => togglePublic(file)}
                                                    className="flex items-center gap-2 cursor-pointer group">
                                                    {file.public ? (
                                                        <>
                                                            <GlobeIcon size={16} className="text-green-500" />
                                                            <span className="text-green-600 group-hover:text-white group-hover:bg-green-600 transition-all duration-200 px-1 rounded">
                                                                Public
                                                            </span>
                                                        </>
                                                    ):(
                                                        <>
                                                            <LockIcon size={16} className="text-red-500" />
                                                            <span className="text-red-600 group-hover:text-white group-hover:bg-red-600 transition-all duration-200 px-1 rounded">
                                                                Private
                                                            </span>
                                                        </>
                                                    )} 
                                                </button>
                                                {file.public && (
                                                    <button 
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
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="flex justify-center">
                                                    <button 
                                                        onClick ={() => handleDownload(file)}   
                                                        title="Download"
                                                        className="text-gray-500 hover:text-green-600 transition-colors">
                                                        <DownloadIcon size={18} />
                                                    </button>
                                                </div>
                                            
                                            <div className="flex justify-center">   
                                                <button 
                                                    title="Delete"
                                                    className="text-gray-500 hover:text-red-600 hover:bg-red-600 hover:text-white p-1 rounded-full transition-all duration-200">
                                                        <TrashIcon size={18} />
                                                </button>                                        
                                            </div>
                                            <div className="flex justify-center translate-y-1">
                                                {file.public ? (
                                                    <a href={`/file/${file.id}`} title="View File" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-600">
                                                        <Eye size={18} />
                                                    </a>
                                                ):(
                                                    <span className="w-[18px]"></span>
                                                )}
                                            </div>
                                        </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default MyFiles;
