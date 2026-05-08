import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { apiEndpoints } from "../util/apiendpoints";
import { Copy, Download, BookmarkCheck, Bookmark, AlertCircle } from "lucide-react";
import LinkShareModal from "../components/LinkShareModal";
import FileViewer from "../components/FileViewer";
import toast from "react-hot-toast";

/* ─── file type map ────────────────────────────────── */
const FILE_TYPE_MAP = {
    jpg: "image", jpeg: "image", png: "image", gif: "image",
    webp: "image", svg: "image", bmp: "image", ico: "image",
    pdf: "pdf",
    mp4: "video", webm: "video", ogg: "video", mov: "video", avi: "video", mkv: "video",
    mp3: "audio", wav: "audio", flac: "audio", m4a: "audio",
    txt: "text", md: "text", csv: "text", json: "text", xml: "text", log: "text",
    js: "text", jsx: "text", ts: "text", tsx: "text", html: "text", css: "text",
    py: "text", java: "text", cpp: "text", c: "text", yml: "text", yaml: "text",
};

const getFileType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    return FILE_TYPE_MAP[ext] || "unsupported";
};

const formatSize = (bytes) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return mb.toFixed(2) + " MB";
    if (kb >= 1) return kb.toFixed(2) + " KB";
    return bytes + " B";
};

/* ─── Inline WIRED header action button ─────────────── */
const HeaderBtn = ({ children, onClick, title }) => {
    const [h, setH] = useState(false);
    return (
        <button
            onClick={onClick}
            title={title}
            onMouseEnter={() => setH(true)}
            onMouseLeave={() => setH(false)}
            className="font-ui"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.3px",
                lineHeight: 1.25,
                border: "2px solid #000000",
                borderRadius: 0,
                backgroundColor: h ? "#000000" : "#ffffff",
                color: h ? "#ffffff" : "#000000",
                cursor: "pointer",
                transition: "background-color 150ms, color 150ms",
                whiteSpace: "nowrap",
            }}
        >
            {children}
        </button>
    );
};

/* ═══════════════════════════════════════════════════
   PublicFileView page
═══════════════════════════════════════════════════ */
const PublicFileView = () => {
    const [file, setFile] = useState(null);
    const [fileBlob, setFileBlob] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [shareModal, setShareModal] = useState({ isOpen: false, link: "" });
    const { getToken } = useAuth();
    const { fileId } = useParams();
    const navigate = useNavigate();

    /* ── check saved state ── */
    const checkIfFileSaved = async (id) => {
        try {
            const token = await getToken();
            const res = await axios.get(apiEndpoints.IS_FILE_SAVED(id), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsSaved(res.data.isSaved);
        } catch {
            setIsSaved(false);
        }
    };

    /* ── save / unsave ── */
    const handleFileSave = async () => {
        try {
            const token = await getToken();
            const res = await axios.post(
                apiEndpoints.ADD_TO_SAVED(file.id),
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.status === 201 || res.status === 200) {
                toast.success("File saved");
                setIsSaved(true);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Error saving file");
        }
    };

    const handleFileUnsave = async () => {
        try {
            const token = await getToken();
            const res = await axios.delete(
                apiEndpoints.REMOVE_FROM_SAVED(file.id),
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if ([200, 201, 204].includes(res.status)) {
                toast.success("File removed from saved");
                setIsSaved(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Error removing file");
        }
    };

    /* ── download ── */
    const handleDownload = () => {
        if (!fileBlob || !file) return;
        const url = window.URL.createObjectURL(new Blob([fileBlob]));
        const a = document.createElement("a");
        a.href = url;
        a.setAttribute("download", file.name);
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    /* ── fetch file ── */
    useEffect(() => {
        const load = async () => {
            try {
                const token = await getToken();
                const fileRes = await axios.get(apiEndpoints.PUBLIC_FILE_VIEW(fileId), {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFile(fileRes.data);
                await checkIfFileSaved(fileRes.data.id);

                const blobRes = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileRes.data.id), {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob",
                });
                setFileBlob(blobRes.data);
                setError(null);
            } catch {
                setError("Failed to load file. The link may be invalid or the file may have been removed.");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [fileId, getToken]);

    /* ── loading ── */
    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    backgroundColor: "#ffffff",
                }}
            >
                <p
                    className="font-mono uppercase"
                    style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1.2px", color: "#757575", lineHeight: 1 }}
                >
                    Loading file…
                </p>
            </div>
        );
    }

    /* ── error ── */
    if (error) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    backgroundColor: "#ffffff",
                    padding: "32px",
                }}
            >
                <div style={{ maxWidth: "480px", width: "100%" }}>
                    {/* Error banner */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            padding: "12px 16px",
                            borderLeft: "4px solid #000000",
                            backgroundColor: "#ffffff",
                            marginBottom: "24px",
                        }}
                    >
                        <AlertCircle size={16} strokeWidth={2} style={{ color: "#1a1a1a", flexShrink: 0, marginTop: "1px" }} />
                        <div>
                            <p className="font-mono uppercase" style={{ fontSize: "0.69rem", fontWeight: 700, letterSpacing: "1.2px", color: "#1a1a1a", lineHeight: 1, marginBottom: "3px" }}>
                                Error
                            </p>
                            <p className="font-ui" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4, margin: 0 }}>
                                {error}
                            </p>
                        </div>
                    </div>
                    <HeaderBtn onClick={() => navigate("/")}>Go to Home</HeaderBtn>
                </div>
            </div>
        );
    }

    if (!file) return null;

    return (
        /* DESIGN.md: paper white canvas, no tint */
        <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>

            {/* ── Navbar ── */}
            {/* DESIGN.md: white nav, 2px black border-bottom, no shadow */}
            <header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 30,
                    backgroundColor: "#ffffff",
                    borderBottom: "2px solid #000000",
                    padding: "0 24px",
                    height: "61px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                }}
            >
                {/* Wordmark */}
                <div
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                >
                    <span
                        className="font-display"
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            letterSpacing: "-0.5px",
                            color: "#000000",
                            lineHeight: 1,
                        }}
                    >
                        ShareVault
                    </span>
                </div>

                {/* Action buttons — all WIRED primary CTA style */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    {/* Save / Unsave toggle */}
                    <HeaderBtn
                        onClick={isSaved ? handleFileUnsave : handleFileSave}
                        title={isSaved ? "Unsave file" : "Save file"}
                    >
                        {isSaved
                            ? <><BookmarkCheck size={15} strokeWidth={2} /> Unsave</>
                            : <><Bookmark size={15} strokeWidth={1.5} /> Save</>
                        }
                    </HeaderBtn>

                    {/* Download */}
                    <HeaderBtn onClick={handleDownload} title="Download file">
                        <Download size={15} strokeWidth={2} />
                        Download
                    </HeaderBtn>

                    {/* Share link */}
                    <HeaderBtn onClick={() => setShareModal({ isOpen: true, link: window.location.href })} title="Copy share link">
                        <Copy size={15} strokeWidth={2} />
                        Share
                    </HeaderBtn>
                </div>
            </header>

            {/* ── Main ── */}
            <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>

                {/* ── File metadata block ── */}
                {/* DESIGN.md: no card/shadow — hairline left-strip + editorial spacing */}
                <div
                    style={{
                        marginBottom: "32px",
                        borderBottom: "2px solid #000000",
                        paddingBottom: "16px",
                    }}
                >
                    {/* Kicker */}
                    <p
                        className="font-mono uppercase"
                        style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            letterSpacing: "1.2px",
                            color: "#757575",
                            lineHeight: 1.23,
                            marginBottom: "6px",
                        }}
                    >
                        ShareVault · File Preview
                    </p>

                    {/* File name as display heading */}
                    <h1
                        className="font-display"
                        style={{
                            fontSize: "2rem",
                            fontWeight: 400,
                            letterSpacing: "-0.5px",
                            color: "#1a1a1a",
                            lineHeight: 1.08,
                            margin: "0 0 8px",
                            wordBreak: "break-all",
                        }}
                    >
                        {file.name}
                    </h1>

                    {/* Meta row */}
                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                        <span
                            className="font-mono uppercase"
                            style={{ fontSize: "0.69rem", letterSpacing: "1.1px", color: "#757575", lineHeight: 1.33 }}
                        >
                            Size: {formatSize(file.size)}
                        </span>
                        {file.uploadedAt && (
                            <span
                                className="font-mono uppercase"
                                style={{ fontSize: "0.69rem", letterSpacing: "1.1px", color: "#757575", lineHeight: 1.33 }}
                            >
                                Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── File viewer ── */}
                {fileBlob && (
                    <FileViewer
                        file={file}
                        blob={fileBlob}
                        getFileType={getFileType}
                        onDownload={handleDownload}
                    />
                )}

                {/* ── Footer rule ── */}
                <div style={{ marginTop: "40px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
                    <p
                        className="font-mono uppercase"
                        style={{ fontSize: "0.63rem", letterSpacing: "1.1px", color: "#757575" }}
                    >
                        Shared via ShareVault · {getFileType(file.name).toUpperCase()} file
                    </p>
                </div>
            </main>

            {/* Share modal */}
            <LinkShareModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ isOpen: false, link: "" })}
                link={shareModal.link}
                title="Share File Link"
            />
        </div>
    );
};

export default PublicFileView;
