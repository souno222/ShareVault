import DashboardLayout from "../layout/DashboardLayout";
import { Receipt, Clock, Sparkles, AlertCircle } from "lucide-react";
import {useState,useEffect} from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { apiEndpoints } from "../util/apiendpoints";
const Transactions = () => {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const {getToken} = useAuth();

    useEffect(() =>{ 
        const fetchTransactions = async() => {
            try {
                setLoading(true);
                const token = await getToken();
                const response = await axios.get(
                    apiEndpoints.GET_TRANSACTIONS,
                    {
                        headers:{
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTransactions(response.data);
                setError(null);

            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError(
                    "Failed to load your transaction history.Please try again later."
                );
            } finally{
                setLoading(false);
            }
        };
        fetchTransactions();
    },[getToken]);

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString(undefined,options);
    };

    const formatAmount = (amountInPaise) => {
        return `₹ ${(amountInPaise/100).toFixed(2)}`;
    };

    return (
        <DashboardLayout activeMenu="Transactions">
            <div className="p-6">
                <div className="flex items-center gap-6 mb-6">
                    <Receipt className="text-blue-600"/>
                    <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                      </div>
                )}

                {loading ? (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[1, 2, 3, 4].map((i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : !error && transactions.length === 0 ? (
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
                                No Transactions Yet
                            </h2>
                            
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Clock size={18} className="text-purple-600" />
                                <p className="text-lg text-purple-600 font-semibold">
                                    Transaction History
                                </p>
                            </div>
                            
                            <p className="text-gray-600 mb-6">
                                Your transaction history is empty. Buy a subscription to see your transactions here.
                            </p>
                            
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <p className="text-sm text-purple-700">
                                    <span className="font-semibold">What you'll see:</span> Transaction history, 
                                    activity logs, download tracking, and detailed analytics.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : !error && transactions.length > 0 ? (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(tx.transactionDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {tx.planId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatAmount(tx.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {tx.paymentId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                tx.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}

            </div>
        </DashboardLayout>
    );
};

export default Transactions;
