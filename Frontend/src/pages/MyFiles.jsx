import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { ListIcon } from "lucide-react";
import { GridIcon } from "lucide-react";
import { useAuth } from "../../node_modules/@clerk/clerk-react/dist/index";
import axios from "axios";
const MyFiles = () => {
    const [files,setFiles]= useState([]);
    const [viewMode,setViewMode]= useState("list");
    const {getToken} = useAuth();
    const fetchFiles = async () => {
        try {
            const token = await getToken();
            axios.get('http://localhost:8080/api/v1.0/files/my',{)
        }catch (error) {
        }
    }

    return(
        <DashboardLayout activeMenu="My Files">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold"> My Files {files.length}</h2>
                    <div className="flex items-center gap-3">
                        <ListIcon
                            onClick={() => setViewMode("list")}
                            size={24}
                            className={`cursor-pointer transition-colors ${viewMode === "list" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`} />
                        <GridIcon
                            size={24}
                            onClick={() => setViewMode("grid")}
                            className={`cursor-pointer transition-colors ${viewMode === "grid" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}/>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default MyFiles;
