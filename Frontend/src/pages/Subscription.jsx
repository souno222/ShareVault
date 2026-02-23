import DashboardLayout from "../layout/DashboardLayout";
import { CreditCard, Clock, Sparkles, Zap } from "lucide-react";

const Subscription = () => {
    return (
        <DashboardLayout activeMenu="Subscription">
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="relative inline-block mb-6">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <CreditCard size={48} className="text-blue-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
                            <Sparkles size={20} className="text-yellow-600" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Coming Soon
                    </h2>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Clock size={18} className="text-blue-600" />
                        <p className="text-lg text-blue-600 font-semibold">
                            Subscription Plans
                        </p>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                        We're crafting amazing subscription plans that will give you access to 
                        premium features, increased storage, and priority support.
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Zap size={16} className="text-blue-600" />
                            <p className="text-sm font-semibold text-blue-700">
                                Upcoming Premium Features:
                            </p>
                        </div>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Increased storage capacity</li>
                            <li>• Advanced file sharing options</li>
                            <li>• Priority customer support</li>
                            <li>• Enhanced security features</li>
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Subscription;
