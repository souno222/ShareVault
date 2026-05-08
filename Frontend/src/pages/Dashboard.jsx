import { useEffect, useState } from "react";
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
    Image as ImageIcon,
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
        if (!bytes || bytes === 0) return '0 B';

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
            return bytes.toFixed(0) + ' B';
        }
    };

    // DESIGN.md: Monochrome icons, strict styling
    const getFileIcon = (fileName, isHovered = false) => {
        const extension = fileName.split('.').pop().toLowerCase();
        const className = `shrink-0 transition-colors ${isHovered ? 'text-paper' : 'text-ink'}`;

        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
            return <ImageIcon size={18} strokeWidth={1.5} className={className} />;
        }
        if (['mp4', 'mkv', 'webm', 'avi', 'mov'].includes(extension)) {
            return <Video size={18} strokeWidth={1.5} className={className} />;
        }
        if (['mp3', 'wav', 'flac', 'aac'].includes(extension)) {
            return <Music size={18} strokeWidth={1.5} className={className} />;
        }
        if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(extension)) {
            return <FileText size={18} strokeWidth={1.5} className={className} />;
        }
        return <FileIcon size={18} strokeWidth={1.5} className={className} />;
    };

    // DESIGN.md: No colored pills. Using mono tags.
    const getVisibilityTag = (visibility) => {
        switch (visibility) {
            case 'public': return 'PUBLIC';
            case 'protected': return 'PROTCECTED';
            case 'private': return 'PRIVATE';
            default: return 'PRIVATE';
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = await getToken();
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

    // DESIGN.md: Flat stats cards with hairline dividers and hover inversion
    const StatCard = ({ icon: Icon, label, value, onClick }) => (
        <div
            onClick={onClick}
            className="group flex flex-col justify-between p-6 bg-paper border-b md:border-b-0 md:border-r border-ink cursor-pointer hover:bg-ink transition-colors duration-150 min-h-[10px] last:border-b-0 last:md:border-r-0"
        >
            <div className="flex justify-between items-start mb-4">
                <Icon className="text-caption group-hover:text-paper/70 transition-colors" size={20} strokeWidth={1.5} />
            </div>
            <div>
                <p className="font-display font-normal text-[2.5rem] leading-none mb-2 text-ink group-hover:text-paper transition-colors">
                    {value}
                </p>
                <p className="font-mono text-[0.69rem] tracking-kicker uppercase text-caption group-hover:text-paper/70 transition-colors leading-none">
                    {label}
                </p>
            </div>
        </div>
    );

    const SavedFileListItem = ({ file }) => {
        const [isHovered, setIsHovered] = useState(false);

        const formatSavedFileSize = (sizeString) => {
            if (typeof sizeString === 'string' && sizeString.includes(' ')) return sizeString;
            return formatFileSize(parseFloat(sizeString));
        };

        return (
            <div
                className="group flex items-center justify-between p-4 border-b border-hairline hover:bg-ink transition-colors duration-150 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                    {getFileIcon(file.fileName, isHovered)}
                    <p className="font-ui font-semibold text-sm tracking-btn text-ink group-hover:text-paper truncate transition-colors">
                        {file.fileName}
                    </p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                    <span className="w-16 font-mono text-[0.69rem] text-caption group-hover:text-paper/70 text-right transition-colors">
                        {formatSavedFileSize(file.size)}
                    </span>
                    <span className="w-24 font-ui text-xs text-caption group-hover:text-paper/70 truncate transition-colors">
                        {file.ownerName || 'Unknown'}
                    </span>
                    <span className="w-20 font-mono text-[0.69rem] text-caption group-hover:text-paper/70 text-right transition-colors hidden sm:block">
                        {new Date(file.savedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        );
    };

    const UploadedFileListItem = ({ file }) => {
        const [isHovered, setIsHovered] = useState(false);
        const tag = getVisibilityTag(file.visibility);

        return (
            <div
                className="group flex items-center justify-between p-4 border-b border-hairline hover:bg-ink transition-colors duration-150 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                    {getFileIcon(file.name, isHovered)}
                    <p className="font-ui font-semibold text-sm tracking-btn text-ink group-hover:text-paper truncate transition-colors">
                        {file.name}
                    </p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                    <span className="w-16 font-mono text-[0.69rem] text-caption group-hover:text-paper/70 text-right transition-colors">
                        {formatFileSize(file.size)}
                    </span>
                    <span className="w-20 font-mono text-[0.69rem] text-caption group-hover:text-paper/70 text-right transition-colors hidden sm:block">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                    <span className="w-14 font-mono text-[0.63rem] tracking-kicker uppercase text-ink group-hover:text-paper text-right transition-colors">
                        [{tag}]
                    </span>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <DashboardLayout activeMenu="Dashboard">
                <div className="p-0 sm:p-6 lg:p-10 space-y-10">
                    {/* Welcome Skeleton */}
                    <div className="pb-8 border-b border-ink">
                        <div className="h-10 bg-hairline w-64 mb-4 rounded-none animate-pulse"></div>
                        <div className="h-5 bg-hairline w-96 rounded-none animate-pulse"></div>
                    </div>

                    {/* Stats Grid Skeleton */}
                    <div className="border border-ink">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="p-6 border-b md:border-b-0 md:border-r border-ink last:md:border-r-0 min-h-[140px] flex flex-col justify-between">
                                    <div className="w-6 h-6 bg-hairline rounded-none animate-pulse"></div>
                                    <div>
                                        <div className="h-8 bg-hairline w-16 mb-2 rounded-none animate-pulse"></div>
                                        <div className="h-3 bg-hairline w-24 rounded-none animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeMenu="Dashboard">
            {/* DESIGN.md: no shadow wrappers, use borders and spacing */}
            <div className="p-4 sm:p-6 lg:p-10 space-y-12">

                {/* ── Welcome Section ── */}
                <div className="pb-8 border-b border-ink">
                    <h1 className="font-display font-bold text-[2.5rem] tracking-hero leading-hero text-ink mb-3">
                        Welcome back.
                    </h1>
                    <p className="font-body text-base tracking-[0.09px] leading-deck text-caption max-w-2xl">
                        Manage your files, track your storage, and maintain strict control over your distribution network.
                    </p>
                </div>

                {/* ── Files Overview - Stats Grid ── */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-mono text-[0.81rem] tracking-kicker uppercase text-caption">
                            Network Status
                        </h2>
                    </div>
                    {/* Grid wrapper with outer border */}
                    <div className="border border-ink flex flex-col md:flex-row">
                        <div className="flex-1">
                            <StatCard
                                icon={Files}
                                label="Total Files"
                                value={stats.totalFiles}
                                onClick={() => navigate('/my-files')}
                            />
                        </div>
                        <div className="flex-1">
                            <StatCard
                                icon={GlobeIcon}
                                label="Public Files"
                                value={stats.publicFiles}
                                onClick={() => navigate('/my-files')}
                            />
                        </div>
                        <div className="flex-1">
                            <StatCard
                                icon={Shield}
                                label="Protected"
                                value={stats.protectedFiles}
                                onClick={() => navigate('/my-files')}
                            />
                        </div>
                        <div className="flex-1 border-b md:border-b-0 border-ink md:border-r-0">
                            <StatCard
                                icon={LockIcon}
                                label="Private"
                                value={stats.privateFiles}
                                onClick={() => navigate('/my-files')}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Recent Files Section ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Recent Saved Files */}
                    <div>
                        <div className="flex items-center justify-between border-b-2 border-ink pb-3 mb-4">
                            <div className="flex items-center gap-2">
                                <Bookmark className="text-ink" size={18} strokeWidth={1.5} />
                                <h3 className="font-display font-normal text-xl leading-none text-ink tracking-grid">
                                    Saved Files
                                </h3>
                            </div>
                            {recentSavedFiles.length > 0 && (
                                <button
                                    onClick={() => navigate('/saved-files')}
                                    className="font-mono text-[0.69rem] tracking-kicker uppercase text-ink hover:text-link-blue transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
                                >
                                    View All <ArrowRight size={14} />
                                </button>
                            )}
                        </div>

                        <div className="border border-ink bg-paper">
                            {recentSavedFiles.length > 0 ? (
                                <div>
                                    {/* Table Header */}
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-ink bg-ink text-paper">
                                        <div className="flex-1">
                                            <span className="font-mono text-[0.63rem] tracking-ribbon uppercase">Name</span>
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0">
                                            <span className="w-16 font-mono text-[0.63rem] tracking-ribbon uppercase text-right">Size</span>
                                            <span className="w-24 font-mono text-[0.63rem] tracking-ribbon uppercase">Owner</span>
                                            <span className="w-20 font-mono text-[0.63rem] tracking-ribbon uppercase text-right hidden sm:block">Date</span>
                                        </div>
                                    </div>
                                    {/* File List */}
                                    <div className="flex flex-col">
                                        {recentSavedFiles.map((file) => (
                                            <SavedFileListItem key={file.id} file={file} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 px-4">
                                    <Bookmark size={32} strokeWidth={1} className="text-hairline mx-auto mb-4" />
                                    <p className="font-mono text-sm tracking-meta text-caption">No saved files yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Uploaded Files */}
                    <div>
                        <div className="flex items-center justify-between border-b-2 border-ink pb-3 mb-4">
                            <div className="flex items-center gap-2">
                                <Clock className="text-ink" size={18} strokeWidth={1.5} />
                                <h3 className="font-display font-normal text-xl leading-none text-ink tracking-grid">
                                    Recent Uploads
                                </h3>
                            </div>
                            {recentUploadedFiles.length > 0 && (
                                <button
                                    onClick={() => navigate('/my-files')}
                                    className="font-mono text-[0.69rem] tracking-kicker uppercase text-ink hover:text-link-blue transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
                                >
                                    View All <ArrowRight size={14} />
                                </button>
                            )}
                        </div>

                        <div className="border border-ink bg-paper">
                            {recentUploadedFiles.length > 0 ? (
                                <div>
                                    {/* Table Header */}
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-ink bg-ink text-paper">
                                        <div className="flex-1">
                                            <span className="font-mono text-[0.63rem] tracking-ribbon uppercase">File Name</span>
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0">
                                            <span className="w-16 font-mono text-[0.63rem] tracking-ribbon uppercase text-right">Size</span>
                                            <span className="w-20 font-mono text-[0.63rem] tracking-ribbon uppercase text-right hidden sm:block">Date</span>
                                            <span className="w-14 font-mono text-[0.63rem] tracking-ribbon uppercase text-right">Access</span>
                                        </div>
                                    </div>
                                    {/* File List */}
                                    <div className="flex flex-col">
                                        {recentUploadedFiles.map((file) => (
                                            <UploadedFileListItem key={file.id} file={file} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 px-4">
                                    <Files size={32} strokeWidth={1} className="text-hairline mx-auto mb-4" />
                                    <p className="font-mono text-sm tracking-meta text-caption mb-5">No files uploaded yet</p>
                                    <button
                                        onClick={() => navigate('/upload')}
                                        className="font-ui font-bold text-xs tracking-btn text-paper bg-ink border-2 border-ink px-5 py-2.5 rounded-none cursor-pointer hover:bg-paper hover:text-ink transition-colors duration-150"
                                    >
                                        Upload First File
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