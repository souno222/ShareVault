import { useContext, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import { AlertCircle } from "lucide-react";
import UploadBox from "../components/UploadBox";
import axios from "axios";
import { apiEndpoints } from "../util/apiendpoints";

const Upload = () => {

    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"
    const { getToken } = useAuth();
    const { credits, setCredits } = useContext(UserCreditsContext);
    const MAX_FILES=5;
    const MAX_FILE_SIZE_KB = 5000; // 5 MB

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        if(files.length + selectedFiles.length > MAX_FILES){
            setMessage(`You can upload a maximum of ${MAX_FILES} files at a time.`);
            setMessageType("error");
            return;
        }
        //add new files to existing files
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setMessage("");
        setMessageType("");
    }

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setMessage("");
        setMessageType("");
    }
    const getSizeinKB = (sizeInBytes) => {
        return Math.ceil(sizeInBytes / 1000);
    }
    const handleUpload = async () => {
        if(getSizeinKB(files.size) > MAX_FILE_SIZE_KB) {
            setMessage(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_KB} KB.`);
            setMessageType("error");
            return;
        }
        if(files.length === 0) {
            setMessage("Please select at least one file to upload.");
            setMessageType("error");
            return;
        }
        if(files.length > MAX_FILES){
            setMessage(`You can upload a maximum of ${MAX_FILES} files at a time.`);
            setMessageType("error");
            return;
        }
        setUploading(true);
        setMessage("Uploading files...");
        setMessageType("info");

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        try{
            const token = await getToken();
            const response = await axios.post(apiEndpoints.UPLOAD_FILE, formData, {headers: {Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data"}})
            if(response.data && response.data.remainingCredits !== undefined){
                setCredits(response.data.remainingCredits);
            }
            setMessage("Files uploaded successfully!");
            setMessageType("success");
            setFiles([]);
        }catch(error){
            console.error("Upload error:", error);
            setMessage(error.response?.data?.message || "Failed to upload files. Please try again.");
            setMessageType("error");
        }finally{
            setUploading(false);
        }
        
       
    }

    const isUploadDisabled = files.length === 0 || files.length > MAX_FILES || credits <=0 || files.length>credits;

    return(
        <DashboardLayout activeMenu="Upload">
            <div className="p-6">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageType === 'error'?'bg-red-50 text-red-700':messageType === 'success'?'bg-green-50 text-green-700':'bg-blue-50 text-blue-700'}`}>
                        {messageType === 'error' && <AlertCircle size={20} />}
                        {message}
                    </div>
                )}

                <UploadBox
                    files={files}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onRemoveFile={handleRemoveFile}
                    remainingCredits={credits}
                    isUploadDisabled={isUploadDisabled}
                />
            </div>
        </DashboardLayout>


    )
}

export default Upload;
