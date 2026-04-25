import DashboardLayout from "../layout/DashboardLayout";
import { CreditCard, Clock, Sparkles, Zap, AlertCircle, Check, Loader2 } from "lucide-react";
import { useState,useEffect,useRef,useContext } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import { apiEndpoints } from "../util/apiendpoints";
import { features } from "../assets/data";
import axios from "axios";

const Subscription = () => {
    const [processingPayment, setProcessingPayment] = useState(false);
    const [message,setMessage] = useState("");
    const [messageType,setMessageType] = useState("");
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const {getToken} = useAuth();
    const razorpayScriptRef = useRef(null);
    const {credits,setCredits,fetchCredits} = useContext(UserCreditsContext);

    const {user} = useUser();
    const formatCredits = ( creditsInBytes) => {
    if (!creditsInBytes || creditsInBytes === 0) return { value: 0, unit: "Bytes" };

    const bytes = creditsInBytes;
    const kb = bytes / 1000;
    const mb = kb / 1000;
    const gb = mb / 1000;

    if (gb >= 1) {
      return { value: gb.toFixed(2), unit: "GB" };
    } else if (mb >= 1) {
      return { value: mb.toFixed(2), unit: "MB" };
    } else if (kb >= 1) {
      return { value: kb.toFixed(2), unit: "KB" };
    } else {
      return { value: bytes.toFixed(0), unit: "Bytes" };
    }
    };
    const { value, unit } = formatCredits(credits);
    //plan details

    const plans = [
        {
            id: "PREMIUM",
            name: "Premium",
            storage: "50000000", // 50 MB in bytes    
            currency: "INR",
            price: 50,
            features: [
                "25 MB additional storage",
                "Priority support",
                "Access to premium features"
            ],
            recommended: false
        },
        {
            id: "ULTIMATE",
            name: "Ultimate",
            storage: "100000000", // 100 MB in bytes
            currency: "INR",
            price: 75,
            features: [
                "75 MB additional storage",
                "24/7 dedicated support",
                "Access to all features"
            ],
            recommended: true
        }
    ]

    //Load Razorpay Script
    useEffect(() => {
    if(!window.Razorpay){
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
            console.log("Razorpay script loaded successfully");
            setRazorpayLoaded(true);
        };
        script.onerror = () => {
            console.error("Failed to load Razorpay script");
            setRazorpayLoaded(false);
        };
        document.body.appendChild(script);
        razorpayScriptRef.current = script;
    } else {
        setRazorpayLoaded(true);
    }
    return () => {
            if(razorpayScriptRef.current && document.body.contains(razorpayScriptRef.current)){
                document.body.removeChild(razorpayScriptRef.current);
            }
        };
    }, []);

    // Fetch user Storage on component mount
    useEffect(() => {
        const fetchUserCredits = async () => {
            try {
                const token = await getToken();
                const response = await axios.get(apiEndpoints.GET_CREDITS,{
                        headers: {
                            'Authorization': `Bearer ${token}`
                    }
                });
                setCredits(response.data.credits);
            } catch (error){
                console.error("Error fetching user credits:", error);
                setMessage("Failed to load current storage. Please try again later.");
                setMessageType("error");
            }
        };
        fetchUserCredits();
    }, [getToken]);

    // Handle subscription purchase
    const handlePurchase = async (plan) => {
        if(!razorpayLoaded){
            setMessage("Payment gateway is still loading. Please wait a moment and try again.");
            setMessageType("error");
            return;
        }

        setProcessingPayment(true);
        setMessage("");
        try {
            const token = await getToken();
            const response = await axios.post(apiEndpoints.CREATE_ORDER,{
                planId: plan.id,
                amount: plan.price * 100, // Convert to paise
                currency: "INR",
                storage: plan.storage 
            },{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: plan.price * 100,
                currency: "INR",
                name: "ShareVault",
                description: `${plan.name} Subscription`,
                order_id: response.data.orderId,
                
                handler: async (paymentResponse) => {
                    try{
                        const freshToken = await getToken();
                        console.log("Using fresh token for verification:", freshToken);
                        const verifyResponse = await axios.post(apiEndpoints.VERIFY_PAYMENT,{
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                            planId: plan.id
                        },{
                            headers: {
                                'Authorization': `Bearer ${freshToken}`
                            }
                        });

                        if(verifyResponse.data.success){
                            if(verifyResponse.data.storage) {
                                console.log("Updating storage with:", verifyResponse.data.storage);
                                setCredits(verifyResponse.data.storage);
                            }
                            else{
                                console.log("No storage info in response, refetching credits");
                                await fetchCredits();
                            }
                            
                            setMessage("Payment successful! Your subscription has been activated.");
                            setMessageType("success");
                        }
                        else{
                            setMessage("Payment verification failed. Please contact support if you were charged.");
                            setMessageType("error");
                        }
                    } catch (error) {
                        console.error("Error verifying payment:", error);
                        setMessage("Failed to verify payment. Please try again.");
                        setMessageType("error");
                    }
            },
            prefill: {
                //Use clerk to prefill details
                name: user?.fullName || "ShareVault User",
                email: user?.primaryEmailAddress?.emailAddress || "user@example.com"
            },
            theme: {
                color: "#0A192F"

            }
        };
        if(window.Razorpay){
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        }
        else{
            throw new Error("Razorpay SDK not loaded");
        }
        } catch (error) {
            console.error("Error processing payment:", error);
            setMessage("An error occurred while processing your payment. Please try again.");
            setMessageType("error");
        }
        finally{
            setProcessingPayment(false);
        }
    };

    return (
        <DashboardLayout activeMenu="Subscription">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">Subscription Plans</h1>
                <p className="text-gray-600 mb-6">
                    Choose a subscription plan that suits your needs and enjoy enhanced features and storage.
                </p>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                        messageType === "error" ? "bg-red-100 text-red-700" : 
                        messageType === "success" ? "bg-green-100 text-green-700" :
                        "bg-blue-100 text-blue-700"
                    }`}>
                        {messageType === 'error' && <AlertCircle size={20} />}
                        {message}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="text-purple-500"/>
                            <h2 className="font-medium text-purple-500">
                                Current Storage: <span className="text-lg font-bold">{value} </span>
                                <span className="text-md">{unit}</span>
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            You can upload {value} {unit} of files with your current plan.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`border rounded-xl p-6 ${
                                plan.recommended
                                    ? 'border-purple-300 bg-purple-50 shadow-md'
                                    : 'border-gray-300 bg-white'
                            }`}
                        >
                            {plan.recommended && (
                                <div className="inline-block rounded-md px-2 py-1 bg-purple-500 text-white text-xs font-semibold">
                                     RECOMMENDED 
                                </div>
                            )}
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                            <div className="mt-2 mb-4">
                                <span className="text-3xl font-bold"> ₹{plan.price}</span>
                                <span className="text-gray-500"> for {formatCredits(Number(plan.storage)).value} {formatCredits(Number(plan.storage)).unit} </span>
                            </div>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="text-green-500 flex-shrink" size={20} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handlePurchase(plan)}
                                disabled={processingPayment}
                                className={`w-full py-3 rounded-md font-medium transition-colors ${
                                    plan.recommended
                                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                                        : 'bg-white border border-purple-500 text-purple-500 hover:bg-purple-100'
                                    } disabled:opacity-50 flex items-center justify-center gap-2`}
                            >
                                {processingPayment ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                    <span>Purchase plan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-2">
                        How plans work
                    </h3>
                    <p className="text-sm text-gray-600">
                        when you purchase a subscription plan, the additonal storage will be added to your account immediately.
                    </p>
                </div>
            </div>
            {/* <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
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
            </div> */}
        </DashboardLayout>
    );
};

export default Subscription;
