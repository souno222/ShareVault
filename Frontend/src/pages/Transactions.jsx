import DashboardLayout from "../layout/DashboardLayout";
import { Receipt, Clock, Sparkles } from "lucide-react";

const Transactions = () => {
    return (
        <DashboardLayout activeMenu="Transactions">
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="relative inline-block mb-6">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                            <Receipt size={48} className="text-purple-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
                            <Sparkles size={20} className="text-yellow-600" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Coming Soon
                    </h2>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Clock size={18} className="text-purple-600" />
                        <p className="text-lg text-purple-600 font-semibold">
                            Transactions Feature
                        </p>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                        We're working hard to bring you a comprehensive transaction history feature. 
                        You'll soon be able to track all your file activities, downloads, and more.
                    </p>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm text-purple-700">
                            <span className="font-semibold">Coming features:</span> Transaction history, 
                            activity logs, download tracking, and detailed analytics.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Transactions;
