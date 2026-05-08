import { useRef, useState } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';

const UploadBox = ({
    files,
    onFileChange,
    onUpload,
    uploading,
    onRemoveFile,
    remainingCredits,
    isUploadDisabled
}) => {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    // --- Event Handlers ---

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileChange({ target: { files: e.dataTransfer.files } });
        }
    };

    const onBrowseClick = () => {
        fileInputRef.current.click();
    };

    // --- Helper Functions ---

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    // --- Render ---

    return (
        /* DESIGN.md: no card, no shadow — outer container is structural only */
        <div className="w-full">

            {/* ── DROP ZONE ── */}
            {/* DESIGN.md: 2px dashed black border (structural emphasis), 0 radius, white bg */}
            <div
                style={{
                    border: dragActive ? '2px solid #000000' : '2px dashed #000000',
                    backgroundColor: dragActive ? '#f5f5f5' : '#ffffff',
                    borderRadius: 0,
                    padding: '48px 32px',
                    textAlign: 'center',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 120ms',
                    position: 'relative',
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={!uploading ? onBrowseClick : undefined}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={onFileChange}
                    className="hidden"
                    disabled={uploading}
                />

                {/* Upload icon */}
                <Upload
                    size={32}
                    strokeWidth={1.5}
                    style={{ color: '#000000', margin: '0 auto 16px' }}
                />

                {/* DESIGN.md: WiredMono ALL-CAPS kicker above the main prompt */}
                <p
                    className="font-mono uppercase"
                    style={{
                        fontSize: '0.75rem',
                        letterSpacing: '1.2px',
                        color: '#757575',
                        lineHeight: 1.23,
                        marginBottom: '8px',
                    }}
                >
                    Drop to upload
                </p>

                {/* DESIGN.md: main instruction in Apercu (UI font) */}
                <p
                    className="font-ui font-bold"
                    style={{
                        fontSize: '1.06rem',
                        letterSpacing: '-0.144px',
                        color: '#1a1a1a',
                        lineHeight: 1.29,
                        marginBottom: '8px',
                    }}
                >
                    Drag files here or{' '}
                    <span
                        style={{ color: '#057dbc', textDecoration: 'underline' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#034d75')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#057dbc')}
                    >
                        browse
                    </span>
                </p>

                {/* DESIGN.md: credits metadata uses Caption Gray + mono */}
                <p
                    className="font-mono uppercase"
                    style={{
                        fontSize: '0.75rem',
                        letterSpacing: '1.1px',
                        color: '#757575',
                        lineHeight: 1.33,
                    }}
                >
                    {remainingCredits} credit{remainingCredits !== 1 ? 's' : ''} remaining · max 5 files
                </p>
            </div>

            {/* ── SELECTED FILES LIST ── */}
            {/* DESIGN.md: hairline rules between rows, no rounded boxes, no shadows */}
            {files.length > 0 && (
                <div style={{ marginTop: '32px' }}>

                    {/* Section header — black ribbon bar */}
                    <div
                        className="font-mono uppercase"
                        style={{
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '1.2px',
                            lineHeight: 1,
                            padding: '10px 16px',
                        }}
                    >
                        Selected — {files.length} file{files.length !== 1 ? 's' : ''}
                    </div>

                    {/* File rows */}
                    {files.map((file, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 16px',
                                borderBottom: '1px solid #e2e8f0',
                                backgroundColor: '#ffffff',
                            }}
                        >
                            {/* Left: icon + name + size */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', flex: 1 }}>
                                <FileIcon
                                    size={16}
                                    strokeWidth={1.5}
                                    style={{ color: '#757575', flexShrink: 0 }}
                                />
                                <div style={{ overflow: 'hidden' }}>
                                    {/* DESIGN.md: UI font for file name */}
                                    <p
                                        className="font-ui"
                                        style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            color: '#1a1a1a',
                                            letterSpacing: '0.108px',
                                            lineHeight: 1.23,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            margin: 0,
                                        }}
                                    >
                                        {file.name}
                                    </p>
                                    {/* DESIGN.md: size as mono meta caption */}
                                    <p
                                        className="font-mono uppercase"
                                        style={{
                                            fontSize: '0.69rem',
                                            letterSpacing: '1.1px',
                                            color: '#757575',
                                            lineHeight: 1.33,
                                            margin: '2px 0 0',
                                        }}
                                    >
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>

                            {/* Right: remove button — round icon button (DESIGN.md: only circular shape) */}
                            <button
                                onClick={() => onRemoveFile(index)}
                                disabled={uploading}
                                aria-label={`Remove ${file.name}`}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #757575',
                                    borderRadius: '50%',
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    color: '#757575',
                                    transition: 'color 120ms, border-color 120ms',
                                    flexShrink: 0,
                                    opacity: uploading ? 0.5 : 1,
                                }}
                                onMouseEnter={e => {
                                    if (!uploading) {
                                        e.currentTarget.style.color = '#000000';
                                        e.currentTarget.style.borderColor = '#000000';
                                    }
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = '#757575';
                                    e.currentTarget.style.borderColor = '#757575';
                                }}
                            >
                                <X size={12} strokeWidth={2} />
                            </button>
                        </div>
                    ))}

                    {/* Bottom hairline closing the list */}
                    <div style={{ borderTop: '2px solid #000000' }} />
                </div>
            )}

            {/* ── UPLOAD BUTTON ── */}
            {/* DESIGN.md: primary button = 2px solid black, square, invert on hover, 150ms */}
            {files.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                    <button
                        id="upload-submit-btn"
                        onClick={onUpload}
                        disabled={isUploadDisabled}
                        style={{
                            width: '100%',
                            padding: '13px 24px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            letterSpacing: '0.3px',
                            lineHeight: 1.25,
                            border: isUploadDisabled ? '2px solid #999999' : '2px solid #000000',
                            borderRadius: 0,
                            backgroundColor: isUploadDisabled ? '#ffffff' : '#000000',
                            color: isUploadDisabled ? '#999999' : '#ffffff',
                            cursor: isUploadDisabled ? 'not-allowed' : 'pointer',
                            transition: 'background-color 150ms, color 150ms',
                            fontFamily: 'inherit',
                        }}
                        className="font-ui"
                        onMouseEnter={e => {
                            if (!isUploadDisabled) {
                                e.currentTarget.style.backgroundColor = '#1a1a1a';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isUploadDisabled) {
                                e.currentTarget.style.backgroundColor = '#000000';
                            }
                        }}
                    >
                        {uploading
                            ? 'Uploading…'
                            : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
                    </button>

                    {/* Disabled caption — mono meta */}
                    {isUploadDisabled && !uploading && (
                        <p
                            className="font-mono uppercase"
                            style={{
                                fontSize: '0.69rem',
                                letterSpacing: '1.1px',
                                color: '#757575',
                                lineHeight: 1.33,
                                marginTop: '8px',
                                textAlign: 'center',
                            }}
                        >
                            {remainingCredits <= 0
                                ? 'No credits remaining — upgrade to continue'
                                : files.length > remainingCredits
                                ? `${files.length} files selected · only ${remainingCredits} credit${remainingCredits !== 1 ? 's' : ''} available`
                                : 'Select files above to enable upload'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadBox;