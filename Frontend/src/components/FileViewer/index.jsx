import { useEffect, useState } from "react";
import ImageViewer from "./ImageViewer";
import PDFViewer from "./PDFViewer";
import VideoViewer from "./VideoViewer";
import AudioViewer from "./AudioViewer";
import TextViewer from "./TextViewer";
import UnsupportedFileViewer from "./UnsupportedFileViewer";

/**
 * FileViewer — router component
 * Passes onDownload through to UnsupportedFileViewer so the
 * "Download File" CTA is wired up from the parent.
 */
const FileViewer = ({ file, blob, getFileType, onDownload }) => {
    const [fileType, setFileType] = useState(null);

    useEffect(() => {
        if (file) {
            setFileType(getFileType(file.name));
        }
    }, [file, getFileType]);

    const renderViewer = () => {
        switch (fileType) {
            case "image":
                return <ImageViewer blob={blob} fileName={file.name} />;
            case "pdf":
                return <PDFViewer blob={blob} fileName={file.name} />;
            case "video":
                return <VideoViewer blob={blob} fileName={file.name} />;
            case "audio":
                return <AudioViewer blob={blob} fileName={file.name} />;
            case "text":
                return <TextViewer blob={blob} fileName={file.name} />;
            default:
                return <UnsupportedFileViewer fileName={file.name} onDownload={onDownload} />;
        }
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {renderViewer()}
        </div>
    );
};

export default FileViewer;