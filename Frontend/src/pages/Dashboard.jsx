import { useEffect, useState, useContext } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../layout/DashboardLayout";
import { apiEndpoints } from "../util/apiendpoints";
import { 
    Files, 
    HardDrive, 
    Bookmark, 
    ArrowRight,
    Shield,
    FileText,
    Clock,
    TrendingUp,
    Image,
    Video,
    Music,
    FileIcon,
    GlobeIcon,
    LockIcon
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalFiles: 0,
        publicFiles: 0,
        protectedFiles: 0,
        privateFiles: 0
    });
    const [recentUploadedFiles, setRecentUploadedFiles] = useState([]);
    const [recentSavedFiles, setRecentSavedFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const formatFileSize = (bytes) => {
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

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        if(['jpg','jpeg','png','gif','bmp','svg','webp'].includes(extension)){
            return <Image size={20} className="text-purple-500 flex-shrink-0" />;
        }
        if(['mp4','mkv','webm','avi','mov'].includes(extension)){
            return <Video size={20} className="text-blue-500 flex-shrink-0" />;
        }
        if(['mp3','wav','flac','aac'].includes(extension)){
            return <Music size={20} className="text-green-500 flex-shrink-0" />;
        }
        if(['pdf','doc','docx','ppt','pptx','txt'].includes(extension)){
            return <FileText size={20} className="text-amber-500 flex-shrink-0" />;
        }
        return <FileIcon size={20} className="text-gray-400 flex-shrink-0" />;
    };

    const getVisibilityDisplay = (visibility) => {
        switch(visibility) {
            case 'public':
                return {
                    icon: <GlobeIcon size={14} className="text-green-500" />,
                    text: 'Public',
                    textColor: 'text-green-600',
                    bgColor: 'bg-green-50'
                };
            case 'protected':
                return {
                    icon: <Shield size={14} className="text-purple-500" />,
                    text: 'Protected',
                    textColor: 'text-purple-600',
                    bgColor: 'bg-purple-50'
                };
            default:
                return {
                    icon: <LockIcon size={14} className="text-red-500" />,
                    text: 'Private',
                    textColor: 'text-red-600',
                    bgColor: 'bg-red-50'
                };
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = await getToken();
                console.log(token);
                // Fetch user's files
                const filesResponse = await axios.get(apiEndpoints.FETCH_FILES, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Fetch saved files
                const savedResponse = await axios.get(apiEndpoints.FETCH_SAVED_FILES, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const files = filesResponse.data || [];
                const savedFiles = savedResponse.data || [];

                // Calculate stats
                setStats({
                    totalFiles: files.length,
                    publicFiles: files.filter(f => f.visibility === 'public').length,
                    protectedFiles: files.filter(f => f.visibility === 'protected').length,
                    privateFiles: files.filter(f => f.visibility === 'private').length
                });

                // Get recent 5 uploaded files
                const sortedFiles = files.sort((a, b) => 
                    new Date(b.uploadedAt) - new Date(a.uploadedAt)
                );
                setRecentUploadedFiles(sortedFiles.slice(0, 5));
                  
                // Get recent 5 saved files
                const sortedSavedFiles = savedFiles.sort((a, b) => 
                    new Date(b.savedAt) - new Date(a.savedAt)
                );
                setRecentSavedFiles(sortedSavedFiles.slice(0, 5));

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Error loading dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [getToken]);

    const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
        <div 
            onClick={onClick}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color} hover:shadow-lg transition-all duration-200 cursor-pointer`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.replace('border', 'bg').replace('500', '100')}`}>
                    <Icon className={color.replace('border', 'text')} size={24} />
                </div>
            </div>
        </div>
    );

    const SavedFileListItem = ({ file }) => {
        const formatSavedFileSize = (sizeString) => {
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

        return (
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0" style={{ maxWidth: '35%' }}>
                    {getFileIcon(file.fileName)}
                    <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0" style={{ width: '65%' }}>
                    <span className="text-xs text-gray-500" style={{ width: '20%' }}>{formatSavedFileSize(file.size)}</span>
                    <span className="text-xs text-gray-500 truncate" style={{ width: '30%' }}>{file.ownerName || 'Unknown'}</span>
                    <span className="text-xs text-gray-500" style={{ width: '25%' }}>
                        {new Date(file.savedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        );
    };

    const UploadedFileListItem = ({ file }) => {
        const visibilityDisplay = getVisibilityDisplay(file.visibility);
        
        return (
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0" style={{ maxWidth: '35%' }}>
                    {getFileIcon(file.name)}
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0" style={{ width: '65%' }}>
                    <span className="text-xs text-gray-500" style={{ width: '20%' }}>{formatFileSize(file.size)}</span>
                    <span className="text-xs text-gray-500" style={{ width: '25%' }}>
                        {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1.5" >
                        {visibilityDisplay.icon}
                        <span className={`text-xs font-medium ${visibilityDisplay.textColor}`}>
                            {visibilityDisplay.text}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <DashboardLayout activeMenu="Dashboard">
                <div className="p-6 space-y-6">
                    {/* Welcome Section Skeleton */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8">
                        <div className="h-8 bg-white/20 rounded w-64 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-white/20 rounded w-96 animate-pulse"></div>
                    </div>

                    {/* Stats Grid Skeleton */}
                    <div>
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                                            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Files Section Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[1, 2].map((section) => (
                            <div key={section} className="bg-white rounded-lg shadow-md">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 mb-2">
                                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                        <div className="flex gap-6">
                                            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                                            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                                            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-3 mb-1">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                                                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                                                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="p-6 space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
                    <p className="text-purple-100">
                        Manage your files, track your storage, and stay organized.
                    </p>
                </div>

                {/* Files Overview - Stats Grid */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Files Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            icon={Files}
                            label="Total Files"
                            value={stats.totalFiles}
                            color="border-purple-500"
                            onClick={() => navigate('/my-files')}
                        />
                        <StatCard 
                            icon={TrendingUp}
                            label="Public Files"
                            value={stats.publicFiles}
                            color="border-green-500"
                            onClick={() => navigate('/my-files')}
                        />
                        <StatCard 
                            icon={Shield}
                            label="Protected Files"
                            value={stats.protectedFiles}
                            color="border-yellow-500"
                            onClick={() => navigate('/my-files')}
                        />
                        <StatCard 
                            icon={HardDrive}
                            label="Private Files"
                            value={stats.privateFiles}
                            color="border-gray-500"
                            onClick={() => navigate('/my-files')}
                        />
                    </div>
                </div>

                {/* Recent Files Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Saved Files */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bookmark className="text-blue-600" size={20} />
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Saved Files</h3>
                                </div>
                                {recentSavedFiles.length > 0 && (
                                    <button 
                                        onClick={() => navigate('/saved-files')}
                                        className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm font-medium transition-colors"
                                    >
                                        View All <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-4">
                            {recentSavedFiles.length > 0 ? (
                                <div>
                                    {/* Table Header */}
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 mb-2">
                                        <div className="flex-1" style={{ maxWidth: '35%' }}>
                                            <span className="text-xs font-semibold text-gray-600">Name</span>
                                        </div>
                                        <div className="flex items-center gap-6" style={{ width: '65%' }}>
                                            <span className="text-xs font-semibold text-gray-600" style={{ width: '20%' }}>Size</span>
                                            <span className="text-xs font-semibold text-gray-600" style={{ width: '30%' }}>Owner Name</span>
                                            <span className="text-xs font-semibold text-gray-600" style={{ width: '25%' }}>Saved At</span>
                                        </div>
                                    </div>
                                    {/* File List */}
                                    <div className="space-y-1">
                                        {recentSavedFiles.map((file) => (
                                            <SavedFileListItem key={file.id} file={file} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Bookmark size={40} className="text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No saved files yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Uploaded Files */}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="text-purple-600" size={20} />
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Uploaded Files</h3>
                                </div>
                                {recentUploadedFiles.length > 0 && (
                                    <button 
                                        onClick={() => navigate('/my-files')}
                                        className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm font-medium transition-colors"
                                    >
                                        View All <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-4">
                            {recentUploadedFiles.length > 0 ? (
                                <div>
                                    {/* Table Header */}
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 mb-2">
                                        <div className="flex-1" style={{ maxWidth: '35%' }}>
                                            <span className="text-xs font-semibold text-gray-600">File Name</span>
                                        </div>
                                        <div className="flex items-center gap-6" style={{ width: '65%' }}>
                                            <span className="text-xs font-semibold text-gray-600" style={{ width: '20%' }}>Size</span>
                                            <span className="text-xs font-semibold text-gray-600" style={{ width: '25%' }}>Uploaded At</span>
                                            <span className="text-xs font-semibold text-gray-600" style={{ width: '20%', textAlign: 'center' }}>Visibility</span>
                                        </div>
                                    </div>
                                    {/* File List */}
                                    <div className="space-y-1">
                                        {recentUploadedFiles.map((file) => (
                                            <UploadedFileListItem key={file.id} file={file} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Files size={40} className="text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No files uploaded yet</p>
                                    <button 
                                        onClick={() => navigate('/upload')}
                                        className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                                    >
                                        Upload Your First File
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;