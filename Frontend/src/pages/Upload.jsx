import { useContext, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import { AlertCircle, CheckCircle } from "lucide-react";
import UploadBox from "../components/UploadBox";
import axios from "axios";
import { apiEndpoints } from "../util/apiendpoints";

const Upload = () => {

    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" | "error" | "info"
    const { getToken } = useAuth();
    const { credits, setCredits } = useContext(UserCreditsContext);
    const MAX_FILES = 5;
    const MAX_FILE_SIZE_KB = 5000; // 5 MB

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (files.length + selectedFiles.length > MAX_FILES) {
            setMessage(`You can upload a maximum of ${MAX_FILES} files at a time.`);
            setMessageType("error");
            return;
        }
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setMessage("");
        setMessageType("");
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setMessage("");
        setMessageType("");
    };

    const getSizeinKB = (sizeInBytes) => Math.ceil(sizeInBytes / 1000);

    const handleUpload = async () => {
        if (getSizeinKB(files.size) > MAX_FILE_SIZE_KB) {
            setMessage(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_KB} KB.`);
            setMessageType("error");
            return;
        }
        if (files.length === 0) {
            setMessage("Please select at least one file to upload.");
            setMessageType("error");
            return;
        }
        if (files.length > MAX_FILES) {
            setMessage(`You can upload a maximum of ${MAX_FILES} files at a time.`);
            setMessageType("error");
            return;
        }

        setUploading(true);
        setMessage("Uploading files…");
        setMessageType("info");

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        try {
            const token = await getToken();
            const response = await axios.post(
                apiEndpoints.UPLOAD_FILE,
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );
            if (response.data && response.data.remainingCredits !== undefined) {
                setCredits(response.data.remainingCredits);
            }
            setMessage("Files uploaded successfully.");
            setMessageType("success");
            setFiles([]);
        } catch (error) {
            console.error("Upload error:", error);
            setMessage(error.response?.data?.message || "Failed to upload files. Please try again.");
            setMessageType("error");
        } finally {
            setUploading(false);
        }
    };

    const isUploadDisabled =
        files.length === 0 ||
        files.length > MAX_FILES ||
        credits <= 0 ||
        files.length > credits;

    // ── Banner styles (DESIGN.md: no color outside grayscale + #057dbc) ──
    // Error   → 2px black border-left red label in mono caps
    // Success → 2px black border, black bg flash
    // Info    → 1px hairline, mono caps caption
    const bannerStyle = {
        error: {
            borderLeft: '4px solid #000000',
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            accentColor: '#000000',
        },
        success: {
            borderLeft: '4px solid #000000',
            backgroundColor: '#000000',
            color: '#ffffff',
            accentColor: '#ffffff',
        },
        info: {
            borderLeft: '4px solid #757575',
            backgroundColor: '#ffffff',
            color: '#757575',
            accentColor: '#757575',
        },
    };

    const currentBanner = bannerStyle[messageType] || bannerStyle.info;

    return (
        <DashboardLayout activeMenu="Upload">

            {/* ── Page wrapper ── */}
            {/* DESIGN.md: paper white canvas, editorial spacing */}
            <div
                style={{
                    maxWidth: '720px',
                    margin: '0 auto',
                    padding: '48px 32px',
                }}
            >

                {/* ── Page Header ── */}
                {/* DESIGN.md: WiredMono kicker → then Apercu bold heading */}
                <header style={{ marginBottom: '32px', borderBottom: '2px solid #000000', paddingBottom: '16px' }}>
                    {/* Eyebrow kicker */}
                    <p
                        className="font-mono uppercase"
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '1.2px',
                            color: '#757575',
                            lineHeight: 1.23,
                            marginBottom: '8px',
                        }}
                    >
                        ShareVault · File Upload
                    </p>

                    {/* Page title — display serif (WiredDisplay substitute = Playfair) */}
                    <h1
                        className="font-display"
                        style={{
                            fontSize: '2.5rem',
                            fontWeight: 400,
                            letterSpacing: '-0.5px',
                            color: '#1a1a1a',
                            lineHeight: 1.05,
                            margin: 0,
                        }}
                    >
                        Upload Files
                    </h1>

                    {/* Deck — body serif (BreveText substitute = Lora) */}
                    <p
                        className="font-body"
                        style={{
                            fontSize: '1.0rem',
                            fontWeight: 400,
                            letterSpacing: '0.09px',
                            color: '#757575',
                            lineHeight: 1.5,
                            marginTop: '8px',
                            marginBottom: 0,
                        }}
                    >
                        Drag and drop or browse to add files. Each upload consumes one credit per file.
                    </p>
                </header>

                {/* ── Status Banner ── */}
                {/* DESIGN.md: no rounded corners, no color outside palette */}
                {message && (
                    <div
                        role="alert"
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            marginBottom: '32px',
                            padding: '12px 16px',
                            borderLeft: currentBanner.borderLeft,
                            backgroundColor: currentBanner.backgroundColor,
                            borderRadius: 0,
                        }}
                    >
                        {/* Icon */}
                        <span style={{ flexShrink: 0, marginTop: '1px' }}>
                            {messageType === 'error' && (
                                <AlertCircle size={16} strokeWidth={2} style={{ color: currentBanner.accentColor }} />
                            )}
                            {messageType === 'success' && (
                                <CheckCircle size={16} strokeWidth={2} style={{ color: currentBanner.accentColor }} />
                            )}
                        </span>

                        {/* Message text */}
                        <div style={{ flex: 1 }}>
                            {/* Mono status label */}
                            <p
                                className="font-mono uppercase"
                                style={{
                                    fontSize: '0.69rem',
                                    fontWeight: 700,
                                    letterSpacing: '1.2px',
                                    color: currentBanner.color,
                                    lineHeight: 1,
                                    marginBottom: '3px',
                                }}
                            >
                                {messageType === 'error' ? 'Error' : messageType === 'success' ? 'Success' : 'Status'}
                            </p>
                            {/* Message body */}
                            <p
                                className="font-ui"
                                style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: currentBanner.color,
                                    lineHeight: 1.4,
                                    margin: 0,
                                    letterSpacing: '0.108px',
                                }}
                            >
                                {message}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Upload Box ── */}
                <UploadBox
                    files={files}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onRemoveFile={handleRemoveFile}
                    remainingCredits={credits}
                    isUploadDisabled={isUploadDisabled}
                />

                {/* ── Footer rules / guidance ── */}
                {/* DESIGN.md: hairline hr, mono meta for secondary info */}
                <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                    <p
                        className="font-mono uppercase"
                        style={{
                            fontSize: '0.69rem',
                            letterSpacing: '1.1px',
                            color: '#757575',
                            lineHeight: 1.6,
                            margin: 0,
                        }}
                    >
                        Max 5 files per batch · 5 MB per file · Supported: all common formats
                    </p>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Upload;
