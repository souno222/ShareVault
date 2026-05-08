import { useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
    ListIcon, GridIcon, GlobeIcon, LockIcon, Shield,
    CopyIcon, DownloadIcon, TrashIcon, Eye, FileIcon, Edit,
    Image, Video, Music, FileText,
} from 'lucide-react';
import FileCard from '../components/FileCard';
import { apiEndpoints } from '../util/apiendpoints';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LinkShareModal from '../components/LinkShareModal';
import RenameModal from '../components/RenameModal';
import ManageFileVisibilityModal from '../components/ManageFileVisibilityModal';

/* ─── helpers ─────────────────────────────────────── */

const getFileIcon = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const s = { color: '#1a1a1a' };
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext))
        return <Image size={18} strokeWidth={1.5} style={s} />;
    if (['mp4', 'mkv', 'webm', 'avi', 'mov'].includes(ext))
        return <Video size={18} strokeWidth={1.5} style={s} />;
    if (['mp3', 'wav', 'flac', 'aac'].includes(ext))
        return <Music size={18} strokeWidth={1.5} style={s} />;
    if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(ext))
        return <FileText size={18} strokeWidth={1.5} style={s} />;
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

/* Visibility config — DESIGN.md: mono uppercase, no color outside palette */
const VISIBILITY = {
    public:    { Icon: GlobeIcon,  label: 'Public',    mono: 'PUBLIC' },
    protected: { Icon: Shield,     label: 'Protected', mono: 'PROTECTED' },
    private:   { Icon: LockIcon,   label: 'Private',   mono: 'PRIVATE' },
};

/* ─── Skeleton rows / cards ───────────────────────── */

const SkeletonRow = () => (
    <tr>
        {[220, 80, 100, 90, 80].map((w, i) => (
            <td key={i} style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{
                    height: '12px', width: `${w}px`, maxWidth: '100%',
                    backgroundColor: '#e2e8f0', animation: 'pulse 1.5s ease-in-out infinite',
                }} />
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

/* ─── Reusable round icon btn for table rows ─────── */
const RoundBtn = ({ children, onClick, title }) => {
    const [h, setH] = useState(false);
    return (
        <button
            onClick={onClick}
            title={title}
            onMouseEnter={() => setH(true)}
            onMouseLeave={() => setH(false)}
            style={{
                background: 'transparent',
                border: `1px solid ${h ? '#000000' : '#757575'}`,
                borderRadius: '50%',
                width: '30px', height: '30px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: h ? '#000000' : '#757575',
                transition: 'color 120ms, border-color 120ms',
                flexShrink: 0,
            }}
        >
            {children}
        </button>
    );
};

/* ─── Table header cell ──────────────────────────── */
const TH = ({ children }) => (
    <th
        className="font-mono uppercase"
        style={{
            padding: '10px 16px',
            textAlign: 'left',
            fontSize: '0.63rem',
            fontWeight: 700,
            letterSpacing: '1.2px',
            color: '#ffffff',
            lineHeight: 1,
            whiteSpace: 'nowrap',
        }}
    >
        {children}
    </th>
);

/* ─── Table body cell ────────────────────────────── */
const TD = ({ children, style }) => (
    <td
        style={{
            padding: '14px 16px',
            borderBottom: '1px solid #e2e8f0',
            verticalAlign: 'middle',
            ...style,
        }}
    >
        {children}
    </td>
);

/* ═══════════════════════════════════════════════════
   MyFiles page
═══════════════════════════════════════════════════ */
const MyFiles = () => {
    const [files, setFiles] = useState([]);
    const [viewMode, setViewMode] = useState('list');
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [deleteConfirmationOpen, setDeleteConfirmation] = useState({ isOpen: false, fileId: null });
    const [shareModal, setShareModal] = useState({ isOpen: false, fileId: null, link: '' });
    const [renameModal, setRenameModal] = useState({ isOpen: false, fileId: null, currentFileName: '' });
    const [visibilityModal, setVisibilityModal] = useState({
        isOpen: false, fileId: null, fileName: '',
        currentVisibility: 'private', currentAccessList: [],
    });

    /* ── API calls ── */

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const res = await axios.get(apiEndpoints.FETCH_FILES, { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 200) {
                setFiles(res.data.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)));
            }
        } catch (err) {
            console.error('Error fetching files:', err);
            toast.error('Error fetching files');
        } finally {
            setLoading(false);
        }
    };

    const openVisibilityModal = async (file) => {
        try {
            const token = await getToken();
            let accessList = [];
            if (file.visibility === 'protected') {
                const res = await axios.get(apiEndpoints.GET_FILE_ACCESS_LIST(file.id), { headers: { Authorization: `Bearer ${token}` } });
                accessList = res.data?.accessList || [];
            }
            setVisibilityModal({ isOpen: true, fileId: file.id, fileName: file.name, currentVisibility: file.visibility, currentAccessList: accessList });
        } catch {
            toast.error('Error loading file settings');
        }
    };

    const closeVisibilityModal = () =>
        setVisibilityModal({ isOpen: false, fileId: null, fileName: '', currentVisibility: 'private', currentAccessList: [] });

    const handleVisibilityChange = async ({ visibility, accessList }) => {
        try {
            const token = await getToken();
            const fileId = visibilityModal.fileId;
            await axios.patch(apiEndpoints.CHANGE_FILE_VISIBILITY(fileId, visibility), {}, { headers: { Authorization: `Bearer ${token}` } });
            if (visibility === 'protected') {
                await axios.post(apiEndpoints.EDIT_FILE_ACCESS_LIST(fileId), accessList, { headers: { Authorization: `Bearer ${token}` } });
            }
            setFiles(files.map(f => f.id === fileId ? { ...f, visibility } : f));
            toast.success('Visibility updated');
            closeVisibilityModal();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error updating visibility');
        }
    };

    const handleDownload = async (file) => {
        try {
            const token = await getToken();
            const res = await axios.get(apiEndpoints.DOWNLOAD_FILE(file.id), { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url; a.setAttribute('download', file.name);
            document.body.appendChild(a); a.click(); a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            if (err.response?.status === 404) toast.error('File not found');
            else if (err.response?.status === 403) toast.error('Access denied');
            else toast.error('Error downloading file');
        }
    };

    const openRenameModal = (fileId, currentFileName) =>
        setRenameModal({ isOpen: true, fileId, currentFileName });
    const closeRenameModal = () =>
        setRenameModal({ isOpen: false, fileId: null, currentFileName: '' });

    const handleRenameFile = async (newName) => {
        try {
            const token = await getToken();
            await axios.patch(apiEndpoints.RENAME_FILE(renameModal.fileId, newName), {}, { headers: { Authorization: `Bearer ${token}` } });
            setFiles(files.map(f => f.id === renameModal.fileId ? { ...f, name: newName } : f));
            toast.success('File renamed');
            closeRenameModal();
        } catch {
            toast.error('Error renaming file');
        }
    };

    const closeDeleteConfirmation = () => setDeleteConfirmation({ isOpen: false, fileId: null });
    const openDeleteConfirmation = (fileId) => setDeleteConfirmation({ isOpen: true, fileId });

    const handleDeleteFile = async () => {
        try {
            const token = await getToken();
            await axios.delete(apiEndpoints.DELETE_FILE(deleteConfirmationOpen.fileId), { headers: { Authorization: `Bearer ${token}` } });
            setFiles(files.filter(f => f.id !== deleteConfirmationOpen.fileId));
            toast.success('File deleted');
        } catch {
            toast.error('Error deleting file');
        }
    };

    const openShareModal = (fileId) => {
        const link = `${window.location.origin}/file/${fileId}`;
        setShareModal({ isOpen: true, fileId, link });
    };
    const closeShareModal = () => setShareModal({ isOpen: false, fileId: null, link: '' });

    useEffect(() => { fetchFiles(); }, [getToken]);

    /* ── Render ── */

    return (
        <DashboardLayout activeMenu="My Files">
            {/* pulse keyframe injected once */}
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>

            <div style={{ padding: '40px 32px', maxWidth: '1280px' }}>

                {/* ── Page header ── */}
                <header style={{ marginBottom: '32px', borderBottom: '2px solid #000000', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            {/* Eyebrow kicker */}
                            <p className="font-mono uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', color: '#757575', lineHeight: 1.23, marginBottom: '6px' }}>
                                ShareVault · My Files
                            </p>
                            {/* Display heading */}
                            <h1 className="font-display" style={{ fontSize: '2.5rem', fontWeight: 400, letterSpacing: '-0.5px', color: '#1a1a1a', lineHeight: 1.05, margin: 0 }}>
                                My Files
                                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', color: '#757575', marginLeft: '12px', verticalAlign: 'middle' }}>
                                    {!loading && `${files.length}`}
                                </span>
                            </h1>
                        </div>

                        {/* View mode toggle */}
                        {/* DESIGN.md: round icon buttons only */}
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

                {/* ── Loading ── */}
                {loading && viewMode === 'grid' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', backgroundColor: '#000000' }}>
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}
                {loading && viewMode === 'list' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
                        <thead style={{ backgroundColor: '#000000' }}>
                            <tr>{['Name', 'Size', 'Uploaded', 'Visibility', 'Actions'].map(h => <TH key={h}>{h}</TH>)}</tr>
                        </thead>
                        <tbody>{[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}</tbody>
                    </table>
                )}

                {/* ── Empty state ── */}
                {!loading && files.length === 0 && (
                    <div style={{ padding: '64px 32px', textAlign: 'center', border: '1px solid #000000' }}>
                        <FileIcon size={40} strokeWidth={1} style={{ color: '#757575', margin: '0 auto 16px' }} />
                        <p className="font-mono uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', color: '#757575', marginBottom: '8px' }}>
                            No files yet
                        </p>
                        <p className="font-body" style={{ fontSize: '1rem', color: '#757575', lineHeight: 1.5, marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
                            Upload your first file to see it listed here.
                        </p>
                        {/* DESIGN.md: primary CTA — 2px solid black, square, invert on hover */}
                        <button
                            onClick={() => navigate('/upload')}
                            className="font-ui"
                            style={{
                                padding: '12px 24px',
                                fontSize: '1rem', fontWeight: 700, letterSpacing: '0.3px',
                                border: '2px solid #000000', borderRadius: 0,
                                backgroundColor: '#000000', color: '#ffffff',
                                cursor: 'pointer', transition: 'background-color 150ms',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000000'; }}
                        >
                            Go to Upload
                        </button>
                    </div>
                )}

                {/* ── Grid view ── */}
                {!loading && files.length > 0 && viewMode === 'grid' && (
                    /* Hairline 1px #000 gutters between cards */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', backgroundColor: '#000000' }}>
                        {files.map((file) => (
                            <FileCard
                                key={file.id}
                                file={file}
                                onDownload={handleDownload}
                                onDelete={openDeleteConfirmation}
                                onManageVisibility={() => openVisibilityModal(file)}
                                onShareLink={openShareModal}
                            />
                        ))}
                    </div>
                )}

                {/* ── List view (desktop table + mobile cards) ── */}
                {!loading && files.length > 0 && viewMode === 'list' && (
                    <>
                        {/* Desktop table */}
                        <div className="hidden lg:block" style={{ border: '1px solid #000000', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                {/* DESIGN.md: black ribbon header */}
                                <thead style={{ backgroundColor: '#000000' }}>
                                    <tr>
                                        <TH>Name</TH>
                                        <TH>Size</TH>
                                        <TH>Uploaded</TH>
                                        <TH>Visibility</TH>
                                        <TH>Actions</TH>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file) => {
                                        const vis = VISIBILITY[file.visibility] || VISIBILITY.private;
                                        return (
                                            <tr
                                                key={file.id}
                                                style={{ transition: 'background-color 120ms' }}
                                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9f9f9'; }}
                                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                            >
                                                {/* Name */}
                                                <TD>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '320px' }}>
                                                        {getFileIcon(file)}
                                                        <span
                                                            className="font-ui"
                                                            style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                        >
                                                            {file.name}
                                                        </span>
                                                    </div>
                                                </TD>
                                                {/* Size */}
                                                <TD>
                                                    <span className="font-mono uppercase" style={{ fontSize: '0.69rem', letterSpacing: '1.1px', color: '#757575' }}>
                                                        {formatFileSize(file.size)}
                                                    </span>
                                                </TD>
                                                {/* Date */}
                                                <TD>
                                                    <span className="font-mono uppercase" style={{ fontSize: '0.69rem', letterSpacing: '1.1px', color: '#757575' }}>
                                                        {new Date(file.uploadedAt).toLocaleDateString()}
                                                    </span>
                                                </TD>
                                                {/* Visibility */}
                                                <TD>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <button
                                                            onClick={() => openVisibilityModal(file)}
                                                            title="Manage visibility"
                                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                        >
                                                            <vis.Icon size={14} strokeWidth={1.5} style={{ color: '#1a1a1a' }} />
                                                            <span className="font-mono uppercase" style={{ fontSize: '0.69rem', letterSpacing: '1.1px', color: '#1a1a1a' }}>
                                                                {vis.mono}
                                                            </span>
                                                        </button>
                                                        {file.visibility === 'public' && (
                                                            <button
                                                                onClick={() => openShareModal(file.id)}
                                                                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                            >
                                                                <CopyIcon size={12} style={{ color: '#057dbc' }} />
                                                                <span className="font-ui" style={{ fontSize: '0.75rem', color: '#057dbc', textDecoration: 'underline' }}>
                                                                    Share
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </TD>
                                                {/* Actions */}
                                                <TD>
                                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                        <RoundBtn onClick={() => handleDownload(file)} title="Download"><DownloadIcon size={13} strokeWidth={1.5} /></RoundBtn>
                                                        <RoundBtn onClick={() => openRenameModal(file.id, file.name)} title="Rename"><Edit size={13} strokeWidth={1.5} /></RoundBtn>
                                                        <RoundBtn onClick={() => openDeleteConfirmation(file.id)} title="Delete"><TrashIcon size={13} strokeWidth={1.5} /></RoundBtn>
                                                        <RoundBtn onClick={() => window.open(`/file/${file.id}`, '_blank')} title="View"><Eye size={13} strokeWidth={1.5} /></RoundBtn>
                                                    </div>
                                                </TD>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile stacked rows */}
                        <div className="flex flex-col lg:hidden" style={{ gap: '1px', backgroundColor: '#000000' }}>
                            {files.map((file) => {
                                const vis = VISIBILITY[file.visibility] || VISIBILITY.private;
                                return (
                                    <div key={file.id} style={{ backgroundColor: '#ffffff', padding: '16px' }}>
                                        {/* Name row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            {getFileIcon(file)}
                                            <span className="font-ui" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a1a', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {file.name}
                                            </span>
                                        </div>

                                        {/* Meta row */}
                                        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                                            <span className="font-mono uppercase" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#757575' }}>{formatFileSize(file.size)}</span>
                                            <span className="font-mono uppercase" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#757575' }}>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                                            <button onClick={() => openVisibilityModal(file)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                                <vis.Icon size={11} style={{ color: '#1a1a1a' }} />
                                                <span className="font-mono uppercase" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#1a1a1a' }}>{vis.mono}</span>
                                            </button>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <RoundBtn onClick={() => handleDownload(file)} title="Download"><DownloadIcon size={13} strokeWidth={1.5} /></RoundBtn>
                                            <RoundBtn onClick={() => openRenameModal(file.id, file.name)} title="Rename"><Edit size={13} strokeWidth={1.5} /></RoundBtn>
                                            <RoundBtn onClick={() => openDeleteConfirmation(file.id)} title="Delete"><TrashIcon size={13} strokeWidth={1.5} /></RoundBtn>
                                            <RoundBtn onClick={() => window.open(`/file/${file.id}`, '_blank')} title="View"><Eye size={13} strokeWidth={1.5} /></RoundBtn>
                                            {file.visibility === 'public' && (
                                                <RoundBtn onClick={() => openShareModal(file.id)} title="Share"><CopyIcon size={13} strokeWidth={1.5} /></RoundBtn>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* ── Footer guide ── */}
                {!loading && files.length > 0 && (
                    <div style={{ marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                        <p className="font-mono uppercase" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#757575' }}>
                            {files.length} file{files.length !== 1 ? 's' : ''} · sorted by upload date
                        </p>
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            <ConfirmationDialog
                isOpen={deleteConfirmationOpen.isOpen}
                onClose={closeDeleteConfirmation}
                title="Delete File"
                message="Are you sure you want to delete this file? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteFile}
            />
            <RenameModal
                isOpen={renameModal.isOpen}
                onClose={closeRenameModal}
                onRename={handleRenameFile}
                currentFileName={renameModal.currentFileName}
            />
            <LinkShareModal
                isOpen={shareModal.isOpen}
                onClose={closeShareModal}
                link={shareModal.link}
                title="Share File Link"
            />
            <ManageFileVisibilityModal
                key={visibilityModal.fileId}
                isOpen={visibilityModal.isOpen}
                onClose={closeVisibilityModal}
                currentVisibility={visibilityModal.currentVisibility}
                currentAccessList={visibilityModal.currentAccessList}
                fileName={visibilityModal.fileName}
                fileId={visibilityModal.fileId}
                onSave={handleVisibilityChange}
            />
        </DashboardLayout>
    );
};

export default MyFiles;
