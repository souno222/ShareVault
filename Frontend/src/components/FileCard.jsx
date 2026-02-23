import { useState } from 'react';
import { Image,Video ,Music,FileText,FileIcon,GlobeIcon,LockIcon,Copy,EyeIcon,DownloadIcon,TrashIcon,} from 'lucide-react';

const FileCard = ({file,onDelete,onTogglePublic,onDownload,onShareLink}) => {
    const [showActions,setShowActions]= useState(false);

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

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + 'B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + 'KB';
        else return (bytes / 1048576).toFixed(1) + 'MB';
    }

    const formatDate = (dateString) => {
       const date = new Date(dateString);
       return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return (
        <div 
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            className="relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 ">
            {/* file preview area */}
            <div className="h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
                {getFileIcon(file)}
            </div>
            {/* file visibility badge */}
            <div className="absolute top-2 right-2">
                <div className={`rounded-full p-1.5 ${file.public ? 'bg-green-100' : 'bg-gray-100'}`} title={file.public ? "Public" : "Private"}>
                    {file.public ? (
                            <GlobeIcon size={14} className="text-green-600" /> 
                        ):(
                             <LockIcon size={14} className="text-gray-600" />
                        )}
                </div>
            </div>
            {/* file details */}
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div className="overflow-hidden">
                        <h3 
                            title={file.name}
                            className="font-medium text-gray-900 truncate">{file.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                            {formatFileSize(file.size)} | {formatDate(file.uploadedAt)}
                        </p>
                    </div>
                </div>
            </div>
            {/* action buttons */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex gap-3 w-full justify-center">
                        {file.visibility === "public" && (
                            <button 
                                onClick={() => onShareLink(file.id)}
                                title="Share"    
                                className="p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-purple-500 hover:text-purple-600">
                                <Copy size={18} />
                            </button>
                        )}
                        {file.visibility === "public" && (
                            <a href={`/file/${file.id}`} title="View File" target="_blank" rel="norefferer" className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-gray-700 hover:text-gray-900">
                                <EyeIcon size={18} />
                            </a>
                        )}

                        <button 
                            onClick={() => onDownload(file)}
                            title="Download"
                            className="p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-green-600 hover:text-green-700">
                            <DownloadIcon size={18} />
                        </button>
                        <button
                            onClick={() => onTogglePublic(file)}
                            title={file.public ? "Make Private" : "Make Public"}
                            className="p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-amber-600 hover:text-amber-700"   
                        >
                            {file.public ? <LockIcon size={18} /> : <GlobeIcon size={18} />}
                        </button>
                        <button
                            onClick={() => onDelete(file.id)}
                            title="Delete" 
                            className="p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-red-600 hover:text-red-700">
                            <TrashIcon size={18} />
                        </button>
                    </div>
            </div>
        </div>
    )
}

export default FileCard;