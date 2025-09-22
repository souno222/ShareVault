
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import DashboardLayout from "../layout/DashboardLayout";

const Dashboard= () => {
    const {getToken} = useAuth();
    useEffect(() => {
        const displayToken = async () => {
            const token = await getToken();
            console.log("User token:", token);
        }
        displayToken();
      },
      []);
    return(
      <DashboardLayout activeMenu="Dashboard">
        <div>
         Dashboard content
        </div>
      </DashboardLayout>
    )
}

export default Dashboard;