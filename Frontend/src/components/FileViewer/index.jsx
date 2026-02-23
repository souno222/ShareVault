import { useEffect, useState } from "react";
import ImageViewer from "./ImageViewer";
import PDFViewer from "./PDFViewer";
import VideoViewer from "./VideoViewer";
import AudioViewer from "./AudioViewer";
import TextViewer from "./TextViewer";
import UnsupportedFileViewer from "./UnsupportedFileViewer";

const FileViewer = ({ file, blob, getFileType }) => {
    const [fileType, setFileType] = useState(null);

    useEffect(() => {
        if (file) {
            const type = getFileType(file.name);
            setFileType(type);
        }
    }, [file, getFileType]);

    const renderViewer = () => {
        switch (fileType) {
            case 'image':
                return <ImageViewer blob={blob} fileName={file.name} />;
            case 'pdf':
                return <PDFViewer blob={blob} fileName={file.name} />;
            case 'video':
                return <VideoViewer blob={blob} fileName={file.name} />;
            case 'audio':
                return <AudioViewer blob={blob} fileName={file.name} />;
            case 'text':
                return <TextViewer blob={blob} fileName={file.name} />;
            default:
                return <UnsupportedFileViewer fileName={file.name} />;
        }
    };

    return (
        <div className="w-full h-full">
            {renderViewer()}
        </div>
    );
};

export default FileViewer;