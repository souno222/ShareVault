import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { apiEndpoints } from '../util/apiendpoints';
import toast from 'react-hot-toast';
import {
    ListIcon, GridIcon, BookmarkIcon, BookmarkX,
    Eye, Image, Video, Music, FileText, FileIcon,
} from 'lucide-react';
import Modal from '../components/Modal';

/* ─── helpers ─────────────────────────────────────── */

const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const s = { color: '#1a1a1a' };
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext))
        return <Image size={28} strokeWidth={1.5} style={s} />;
    if (['mp4', 'mkv', 'webm', 'avi', 'mov'].includes(ext))
        return <Video size={28} strokeWidth={1.5} style={s} />;
    if (['mp3', 'wav', 'flac', 'aac'].includes(ext))
        return <Music size={28} strokeWidth={1.5} style={s} />;
    if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(ext))
        return <FileText size={28} strokeWidth={1.5} style={s} />;
    return <FileIcon size={28} strokeWidth={1.5} style={s} />;
};

const getSmallFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const s = { color: '#1a1a1a' };
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return <Image size={18} strokeWidth={1.5} style={s} />;
    if (['mp4', 'mkv', 'webm', 'avi', 'mov'].includes(ext)) return <Video size={18} strokeWidth={1.5} style={s} />;
    if (['mp3', 'wav', 'flac', 'aac'].includes(ext)) return <Music size={18} strokeWidth={1.5} style={s} />;
    if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(ext)) return <FileText size={18} strokeWidth={1.5} style={s} />;
    return <FileIcon size={18} strokeWidth={1.5} style={s} />;
};

const formatFileSize = (sizeString) => {
    if (typeof sizeString === 'string' && sizeString.includes(' ')) return sizeString;
    const bytes = parseFloat(sizeString);
    if (!bytes || bytes === 0) return '0 B';
    const kb = bytes / 1024, mb = kb / 1024, gb = mb / 1024;
    if (gb >= 1) return gb.toFixed(2) + ' GB';
    if (mb >= 1) return mb.toFixed(2) + ' MB';
    if (kb >= 1) return kb.toFixed(2) + ' KB';
    return bytes.toFixed(0) + ' B';
};

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/* ─── Skeleton helpers ───────────────────────────── */
const SkeletonRow = () => (
    <tr>
        {[220, 80, 100, 120, 80].map((w, i) => (
            <td key={i} style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ height: '12px', width: `${w}px`, maxWidth: '100%', backgroundColor: '#e2e8f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </td>
        ))}
    </tr>
);

const SkeletonCard = () => (
    <div style={{ border: '1px solid #000', backgroundColor: '#ffffff' }}>
        <div style={{ height: '112px', backgroundColor: '#f0f0f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ padding: '12px' }}>
            <div style={{ height: '12px', backgroundColor: '#e2e8f0', marginBottom: '8px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: '10px', width: '60%', backgroundColor: '#e2e8f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </div>
    </div>
);

/* ─── Round icon button ──────────────────────────── */
const RoundBtn = ({ children, onClick, title, href }) => {
    const [h, setH] = useState(false);
    const style = {
        background: 'transparent',
        border: `1px solid ${h ? '#000000' : '#757575'}`,
        borderRadius: '50%',
        width: '30px', height: '30px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: h ? '#000000' : '#757575',
        transition: 'color 120ms, border-color 120ms',
        flexShrink: 0,
        textDecoration: 'none',
    };
    if (href) {
        return (
            <a href={href} target="_blank" rel="noreferrer" title={title} style={style}
                onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
                {children}
            </a>
        );
    }
    return (
        <button onClick={onClick} title={title} style={style}
            onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
            {children}
        </button>
    );
};

/* ─── Table header cell ──────────────────────────── */
const TH = ({ children }) => (
    <th className="font-mono uppercase" style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '1.2px', color: '#ffffff', lineHeight: 1, whiteSpace: 'nowrap' }}>
        {children}
    </th>
);

const TD = ({ children, style }) => (
    <td style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'middle', ...style }}>
        {children}
    </td>
);

/* ═══════════════════════════════════════════════════
   SavedFiles page
═══════════════════════════════════════════════════ */
const SavedFiles = () => {
    const [savedFiles, setSavedFiles] = useState([]);
    const [viewMode, setViewMode] = useState('list');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [hoverCard, setHoverCard] = useState(null);
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const fetchSavedFiles = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const res = await axios.get(apiEndpoints.FETCH_SAVED_FILES, { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 200) {
                setSavedFiles(res.data.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)));
            }
        } catch (err) {
            console.error('Error fetching saved files:', err);
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
            const res = await axios.delete(apiEndpoints.REMOVE_FROM_SAVED(selectedFileId), { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 204) {
                toast.success('Removed from saved files');
                setIsModalOpen(false);
                fetchSavedFiles();
            }
        } catch (err) {
            console.error('Error removing saved file:', err);
            toast.error(err.response?.data?.error || 'Error removing from saved files');
            setIsModalOpen(false);
        }
    };

    useEffect(() => { fetchSavedFiles(); }, [getToken]);

    return (
        <DashboardLayout activeMenu="Saved Files">
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>

            <div style={{ padding: '40px 32px', maxWidth: '1280px' }}>

                {/* ── Page header ── */}
                <header style={{ marginBottom: '32px', borderBottom: '2px solid #000000', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <p className="font-mono uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', color: '#757575', lineHeight: 1.23, marginBottom: '6px' }}>
                                ShareVault · Saved Files
                            </p>
                            <h1 className="font-display" style={{ fontSize: '2.5rem', fontWeight: 400, letterSpacing: '-0.5px', color: '#1a1a1a', lineHeight: 1.05, margin: 0 }}>
                                Saved Files
                                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', color: '#757575', marginLeft: '12px', verticalAlign: 'middle' }}>
                                    {!loading && `${savedFiles.length}`}
                                </span>
                            </h1>
                        </div>

                        {/* View toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {[{ mode: 'list', Icon: ListIcon }, { mode: 'grid', Icon: GridIcon }].map(({ mode, Icon }) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    title={`${mode} view`}
                                    style={{
                                        background: 'transparent',
                                        border: viewMode === mode ? '2px solid #000000' : '1px solid #757575',
                                        borderRadius: '50%',
                                        width: '36px', height: '36px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: viewMode === mode ? '#000000' : '#757575',
                                        transition: 'color 120ms, border-color 120ms',
                                    }}
                                >
                                    <Icon size={16} strokeWidth={viewMode === mode ? 2 : 1.5} />
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* ── Loading skeleton ── */}
                {loading && viewMode === 'grid' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', backgroundColor: '#000000' }}>
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}
                {loading && viewMode === 'list' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
                        <thead style={{ backgroundColor: '#000000' }}>
                            <tr><TH>Name</TH><TH>Size</TH><TH>Saved At</TH><TH>Owner</TH><TH>Actions</TH></tr>
                        </thead>
                        <tbody>{[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}</tbody>
                    </table>
                )}

                {/* ── Empty state ── */}
                {!loading && savedFiles.length === 0 && (
                    <div style={{ padding: '64px 32px', textAlign: 'center', border: '1px solid #000000' }}>
                        <BookmarkIcon size={40} strokeWidth={1} style={{ color: '#757575', margin: '0 auto 16px' }} />
                        <p className="font-mono uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', color: '#757575', marginBottom: '8px' }}>
                            No saved files
                        </p>
                        <p className="font-body" style={{ fontSize: '1rem', color: '#757575', lineHeight: 1.5, margin: '0 auto 24px', maxWidth: '360px' }}>
                            Save files shared with you to access them quickly from this page.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="font-ui"
                            style={{
                                padding: '12px 24px', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.3px',
                                border: '2px solid #000000', borderRadius: 0,
                                backgroundColor: '#000000', color: '#ffffff',
                                cursor: 'pointer', transition: 'background-color 150ms',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000000'; }}
                        >
                            Browse Files
                        </button>
                    </div>
                )}

                {/* ── Grid view ── */}
                {!loading && savedFiles.length > 0 && viewMode === 'grid' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', backgroundColor: '#000000' }}>
                        {savedFiles.map((file) => (
                            /* DESIGN.md: no rounded corners, no shadow */
                            <div
                                key={file._id}
                                onMouseEnter={() => setHoverCard(file._id)}
                                onMouseLeave={() => setHoverCard(null)}
                                style={{ position: 'relative', backgroundColor: '#ffffff', overflow: 'hidden' }}
                            >
                                {/* Preview */}
                                <div style={{ height: '112px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e2e8f0' }}>
                                    {getFileIcon(file.fileName)}
                                </div>

                                {/* Details */}
                                <div style={{ padding: '12px' }}>
                                    <p className="font-ui" title={file.fileName} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a1a', letterSpacing: '0.108px', lineHeight: 1.23, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                                        {file.fileName}
                                    </p>
                                    <p className="font-mono uppercase" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#757575', lineHeight: 1.33, margin: '0 0 2px' }}>
                                        {file.size}
                                    </p>
                                    <p className="font-mono uppercase" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#757575', lineHeight: 1.33, margin: 0 }}>
                                        Saved {formatDate(file.savedAt)}
                                    </p>
                                </div>

                                {/* Hover action strip */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    backgroundColor: '#000000',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    padding: '8px',
                                    opacity: hoverCard === file._id ? 1 : 0,
                                    transition: 'opacity 120ms',
                                }}>
                                    <RoundBtn href={`/file/${file.fileId}`} title="View file">
                                        <Eye size={14} strokeWidth={2} style={{ color: '#ffffff' }} />
                                    </RoundBtn>
                                    <button
                                        onClick={() => handleRemoveClick(file.fileId, file.fileName)}
                                        title="Unsave"
                                        style={{ ...RoundBtnBaseStyle, color: '#ffffff' }}
                                    >
                                        <BookmarkX size={14} strokeWidth={2} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── List view ── */}
                {!loading && savedFiles.length > 0 && viewMode === 'list' && (
                    <>
                        {/* Desktop table */}
                        <div className="hidden lg:block" style={{ border: '1px solid #000000', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#000000' }}>
                                    <tr><TH>Name</TH><TH>Size</TH><TH>Saved At</TH><TH>Owner</TH><TH>Actions</TH></tr>
                                </thead>
                                <tbody>
                                    {savedFiles.map((file) => (
                                        <tr
                                            key={file._id}
                                            style={{ transition: 'background-color 120ms' }}
                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9f9f9'; }}
                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                        >
                                            <TD>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '320px' }}>
                                                    {getSmallFileIcon(file.fileName)}
                                                    <span className="font-ui" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {file.fileName}
                                                    </span>
                                                </div>
                                            </TD>
                                            <TD>
                                                <span className="font-mono uppercase" style={{ fontSize: '0.69rem', letterSpacing: '1.1px', color: '#757575' }}>
                                                    {formatFileSize(file.size)}
                                                </span>
                                            </TD>
                                            <TD>
                                                <span className="font-mono uppercase" style={{ fontSize: '0.69rem', letterSpacing: '1.1px', color: '#757575' }}>
                                                    {formatDate(file.savedAt)}
                                                </span>
                                            </TD>
                                            <TD>
                                                <span className="font-ui" style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                                                    {file.ownerName}
                                                </span>
                                            </TD>
                                            <TD>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <RoundBtn href={`/file/${file.fileId}`} title="View file">
                                                        <Eye size={13} strokeWidth={1.5} />
                                                    </RoundBtn>
                                                    <RoundBtn onClick={() => handleRemoveClick(file.fileId, file.fileName)} title="Unsave">
                                                        <BookmarkX size={13} strokeWidth={1.5} />
                                                    </RoundBtn>
                                                </div>
                                            </TD>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile stacked */}
                        <div className="flex flex-col lg:hidden" style={{ gap: '1px', backgroundColor: '#000000' }}>
                            {savedFiles.map((file) => (
                                <div key={file._id} style={{ backgroundColor: '#ffffff', padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        {getSmallFileIcon(file.fileName)}
                                        <span className="font-ui" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a1a', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {file.fileName}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', flexWrap: 'wrap' }}>
                                        <span className="font-mono uppercase" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#757575' }}>{formatFileSize(file.size)}</span>
                                        <span className="font-mono uppercase" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#757575' }}>Saved {formatDate(file.savedAt)}</span>
                                        <span className="font-ui" style={{ fontSize: '0.69rem', color: '#757575' }}>{file.ownerName}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <RoundBtn href={`/file/${file.fileId}`} title="View file"><Eye size={13} strokeWidth={1.5} /></RoundBtn>
                                        <RoundBtn onClick={() => handleRemoveClick(file.fileId, file.fileName)} title="Unsave"><BookmarkX size={13} strokeWidth={1.5} /></RoundBtn>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Footer rule */}
                {!loading && savedFiles.length > 0 && (
                    <div style={{ marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                        <p className="font-mono uppercase" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#757575' }}>
                            {savedFiles.length} saved file{savedFiles.length !== 1 ? 's' : ''} · sorted by save date
                        </p>
                    </div>
                )}
            </div>

            {/* ── Unsave confirmation modal ── */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Unsave File"
                confirmText="Unsave"
                cancelText="Cancel"
                onConfirm={removeFromSavedFiles}
                size="sm"
            >
                <p className="font-body" style={{ fontSize: '1rem', color: '#1a1a1a', lineHeight: 1.5 }}>
                    Remove{' '}
                    <span className="font-ui" style={{ fontWeight: 700 }}>"{selectedFileName}"</span>
                    {' '}from your saved files?
                </p>
            </Modal>
        </DashboardLayout>
    );
};

/* tiny constant needed for grid hover actions */
const RoundBtnBaseStyle = {
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.35)',
    borderRadius: '50%',
    width: '30px', height: '30px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0,
};

export default SavedFiles;