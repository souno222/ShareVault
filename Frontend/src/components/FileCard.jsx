import { useState } from 'react';
import { Image, Video, Music, FileText, FileIcon, GlobeIcon, LockIcon, Shield, Copy, EyeIcon, DownloadIcon, TrashIcon } from 'lucide-react';

/**
 * WIRED-system FileCard (grid view tile)
 * - No rounded corners, no shadow, no gradient fills
 * - File preview area = plain #f5f5f5 surface, no gradient
 * - Visibility badge = mono ALL-CAPS kicker tag (text pill with border-radius 1920px per DESIGN.md)
 * - Hover actions = inverted black overlay strip at bottom, not a gradient scrim
 * - Action buttons = round icon buttons (the ONLY circular shape allowed)
 */
const FileCard = ({ file, onDelete, onManageVisibility, onDownload, onShareLink }) => {
    const [showActions, setShowActions] = useState(false);

    const getFileIcon = (file) => {
        const ext = file.name.split('.').pop().toLowerCase();
        // DESIGN.md: no color outside grayscale + #057dbc — icons use page-ink only
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext))
            return <Image size={28} strokeWidth={1.5} style={{ color: '#1a1a1a' }} />;
        if (['mp4', 'mkv', 'webm', 'avi', 'mov'].includes(ext))
            return <Video size={28} strokeWidth={1.5} style={{ color: '#1a1a1a' }} />;
        if (['mp3', 'wav', 'flac', 'aac'].includes(ext))
            return <Music size={28} strokeWidth={1.5} style={{ color: '#1a1a1a' }} />;
        if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(ext))
            return <FileText size={28} strokeWidth={1.5} style={{ color: '#1a1a1a' }} />;
        return <FileIcon size={28} strokeWidth={1.5} style={{ color: '#1a1a1a' }} />;
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    const getVisibilityLabel = (v) => {
        if (v === 'public') return 'Public';
        if (v === 'protected') return 'Protected';
        return 'Private';
    };

    return (
        /* DESIGN.md: no rounded corners, no shadow, 1px black hairline border */
        <div
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            style={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid #000000',
                borderRadius: 0,
            }}
        >
            {/* ── Preview area ── */}
            {/* DESIGN.md: no gradient fills, flat #f5f5f5 surface */}
            <div
                style={{
                    height: '112px',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid #e2e8f0',
                }}
            >
                {getFileIcon(file)}
            </div>

            {/* ── Visibility badge ── */}
            {/* DESIGN.md: pill (border-radius 1920px) only for inline text tags */}
            <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                <span
                    className="font-mono uppercase"
                    style={{
                        fontSize: '0.63rem',
                        fontWeight: 700,
                        letterSpacing: '1.2px',
                        color: '#000000',
                        backgroundColor: '#ffffffff',
                        borderRadius: '1920px',
                        padding: '2px 7px',
                        lineHeight: 1.6,
                    }}
                >
                    {getVisibilityLabel(file.visibility)}
                </span>
            </div>

            {/* ── File details ── */}
            <div style={{ padding: '12px 12px 10px' }}>
                {/* File name — UI font */}
                <p
                    className="font-ui"
                    title={file.name}
                    style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        letterSpacing: '0.108px',
                        lineHeight: 1.23,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '4px',
                    }}
                >
                    {file.name}
                </p>

                {/* Size + date — mono meta */}
                <p
                    className="font-mono uppercase"
                    style={{
                        fontSize: '0.63rem',
                        letterSpacing: '1.1px',
                        color: '#757575',
                        lineHeight: 1.33,
                        margin: 0,
                    }}
                >
                    {formatFileSize(file.size)} · {formatDate(file.uploadedAt)}
                </p>
            </div>

            {/* ── Hover action strip ── */}
            {/* DESIGN.md: depth via solid black bar at bottom, not gradient scrim */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px',
                    opacity: showActions ? 1 : 0,
                    transition: 'opacity 120ms',
                }}
            >
                {/* Round icon buttons — DESIGN.md: 50% radius ONLY for icon controls */}
                {file.visibility === 'public' || file.visibility === 'protected' && (
                    <IconBtn onClick={() => onShareLink(file.id)} title="Share link">
                        <Copy size={14} strokeWidth={2} />
                    </IconBtn>
                )}
                {file.visibility === 'public' || file.visibility === 'protected' && (
                    <a
                        href={`/file/${file.id}`}
                        target="_blank"
                        rel="noreferrer"
                        title="View file"
                        style={roundBtnStyle}
                    >
                        <EyeIcon size={14} strokeWidth={2} />
                    </a>
                )}
                <IconBtn onClick={() => onDownload(file)} title="Download">
                    <DownloadIcon size={14} strokeWidth={2} />
                </IconBtn>
                {onManageVisibility && (
                    <IconBtn onClick={() => onManageVisibility(file)} title="Manage visibility">
                        <Shield size={14} strokeWidth={2} />
                    </IconBtn>
                )}
                <IconBtn onClick={() => onDelete(file.id)} title="Delete" danger>
                    <TrashIcon size={14} strokeWidth={2} />
                </IconBtn>
            </div>
        </div>
    );
};

/** Round icon button — DESIGN.md: 50% radius for icon controls only */
const roundBtnStyle = {
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.35)',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    cursor: 'pointer',
    flexShrink: 0,
    textDecoration: 'none',
};

const IconBtn = ({ children, onClick, title, danger }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            onClick={onClick}
            title={title}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                ...roundBtnStyle,
                backgroundColor: hovered
                    ? (danger ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.25)')
                    : 'rgba(255,255,255,0.12)',
                transition: 'background-color 120ms',
            }}
        >
            {children}
        </button>
    );
};

export default FileCard;