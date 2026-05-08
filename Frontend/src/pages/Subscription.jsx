import DashboardLayout from '../layout/DashboardLayout';
import { CreditCard, Check, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef, useContext } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { UserCreditsContext } from '../context/UserCreditsContext';
import { apiEndpoints } from '../util/apiendpoints';
import axios from 'axios';

/* ─── helpers ─────────────────────────────────────── */

const formatCredits = (creditsInBytes) => {
    if (!creditsInBytes || creditsInBytes === 0) return { value: '0', unit: 'Bytes' };
    const kb = creditsInBytes / 1000;
    const mb = kb / 1000;
    const gb = mb / 1000;
    if (gb >= 1) return { value: gb.toFixed(2), unit: 'GB' };
    if (mb >= 1) return { value: mb.toFixed(2), unit: 'MB' };
    if (kb >= 1) return { value: kb.toFixed(2), unit: 'KB' };
    return { value: String(creditsInBytes), unit: 'Bytes' };
};

/* ─── Plan data ─────────────────────────────────── */

const PLANS = [
    {
        id: 'PREMIUM',
        name: 'Premium',
        storage: '50000000', // 50 MB
        currency: 'INR',
        price: 50,
        features: [
            '25 MB additional storage',
            'Priority support',
            'Access to premium features',
        ],
        recommended: false,
    },
    {
        id: 'ULTIMATE',
        name: 'Ultimate',
        storage: '100000000', // 100 MB
        currency: 'INR',
        price: 75,
        features: [
            '75 MB additional storage',
            '24/7 dedicated support',
            'Access to all features',
        ],
        recommended: true,
    },
];

/* ─── Inline WIRED CTA button ────────────────────── */
const WiredBtn = ({ children, onClick, disabled, fullWidth }) => {
    const [h, setH] = useState(false);
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setH(true)}
            onMouseLeave={() => setH(false)}
            className="font-ui"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: fullWidth ? '100%' : 'auto',
                padding: '13px 24px',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.3px',
                lineHeight: 1.25,
                border: '2px solid #000000',
                borderRadius: 0,
                backgroundColor: h && !disabled ? '#1a1a1a' : '#000000',
                color: '#ffffff',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                transition: 'background-color 150ms',
            }}
        >
            {children}
        </button>
    );
};

/* ═══════════════════════════════════════════════════
   Subscription page
═══════════════════════════════════════════════════ */
const Subscription = () => {
    const [processingPayment, setProcessingPayment] = useState(false);
    const [processingPlanId, setProcessingPlanId] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const { getToken } = useAuth();
    const { user } = useUser();
    const razorpayScriptRef = useRef(null);
    const { credits, setCredits, fetchCredits } = useContext(UserCreditsContext);

    const { value, unit } = formatCredits(credits);

    /* ── Load Razorpay script ── */
    useEffect(() => {
        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setRazorpayLoaded(true);
            script.onerror = () => setRazorpayLoaded(false);
            document.body.appendChild(script);
            razorpayScriptRef.current = script;
        } else {
            setRazorpayLoaded(true);
        }
        return () => {
            if (razorpayScriptRef.current && document.body.contains(razorpayScriptRef.current)) {
                document.body.removeChild(razorpayScriptRef.current);
            }
        };
    }, []);

    /* ── Fetch credits ── */
    useEffect(() => {
        const fetchUserCredits = async () => {
            try {
                const token = await getToken();
                const res = await axios.get(apiEndpoints.GET_CREDITS, { headers: { Authorization: `Bearer ${token}` } });
                setCredits(res.data.credits);
            } catch {
                setMessage('Failed to load current storage. Please try again.');
                setMessageType('error');
            }
        };
        fetchUserCredits();
    }, [getToken]);

    /* ── Handle purchase ── */
    const handlePurchase = async (plan) => {
        if (!razorpayLoaded) {
            setMessage('Payment gateway is still loading. Please wait a moment.');
            setMessageType('error');
            return;
        }
        setProcessingPayment(true);
        setProcessingPlanId(plan.id);
        setMessage('');
        try {
            const token = await getToken();
            const res = await axios.post(
                apiEndpoints.CREATE_ORDER,
                { planId: plan.id, amount: plan.price * 100, currency: 'INR', storage: plan.storage },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: plan.price * 100,
                currency: 'INR',
                name: 'ShareVault',
                description: `${plan.name} Subscription`,
                order_id: res.data.orderId,
                handler: async (paymentResponse) => {
                    try {
                        const freshToken = await getToken();
                        const verifyRes = await axios.post(
                            apiEndpoints.VERIFY_PAYMENT,
                            {
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature,
                                planId: plan.id,
                            },
                            { headers: { Authorization: `Bearer ${freshToken}` } }
                        );
                        if (verifyRes.data.success) {
                            if (verifyRes.data.storage) setCredits(verifyRes.data.storage);
                            else await fetchCredits();
                            setMessage('Payment successful! Your storage has been activated.');
                            setMessageType('success');
                        } else {
                            setMessage('Payment verification failed. Contact support if charged.');
                            setMessageType('error');
                        }
                    } catch {
                        setMessage('Failed to verify payment. Please try again.');
                        setMessageType('error');
                    }
                },
                prefill: {
                    name: user?.fullName || 'ShareVault User',
                    email: user?.primaryEmailAddress?.emailAddress || 'user@example.com',
                },
                theme: { color: '#000000' },
            };

            if (window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                throw new Error('Razorpay SDK not loaded');
            }
        } catch {
            setMessage('An error occurred while processing your payment. Please try again.');
            setMessageType('error');
        } finally {
            setProcessingPayment(false);
            setProcessingPlanId(null);
        }
    };

    /* ── Banner config — no color outside WIRED palette ── */
    const bannerBg = messageType === 'success' ? '#000000' : '#ffffff';
    const bannerColor = messageType === 'success' ? '#ffffff' : '#1a1a1a';
    const bannerBorder = messageType === 'success' ? '4px solid #000000' : '4px solid #000000';

    return (
        <DashboardLayout activeMenu="Subscription">
            <div style={{ padding: '40px 32px', maxWidth: '900px' }}>

                {/* ── Page header ── */}
                <header style={{ marginBottom: '32px', borderBottom: '2px solid #000000', paddingBottom: '16px' }}>
                    <p className="font-mono uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', color: '#757575', lineHeight: 1.23, marginBottom: '6px' }}>
                        ShareVault · Storage Plans
                    </p>
                    <h1 className="font-display" style={{ fontSize: '2.5rem', fontWeight: 400, letterSpacing: '-0.5px', color: '#1a1a1a', lineHeight: 1.05, margin: 0 }}>
                        Subscription Plans
                    </h1>
                    <p className="font-body" style={{ fontSize: '1rem', color: '#757575', lineHeight: 1.5, marginTop: '8px' }}>
                        Purchase additional storage to keep uploading and sharing files.
                    </p>
                </header>

                {/* ── Status banner ── */}
                {message && (
                    <div
                        role="alert"
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            marginBottom: '32px',
                            padding: '12px 16px',
                            borderLeft: bannerBorder,
                            backgroundColor: bannerBg,
                            borderRadius: 0,
                        }}
                    >
                        <span style={{ flexShrink: 0, marginTop: '1px' }}>
                            {messageType === 'error'
                                ? <AlertCircle size={16} strokeWidth={2} style={{ color: bannerColor }} />
                                : <CheckCircle size={16} strokeWidth={2} style={{ color: bannerColor }} />
                            }
                        </span>
                        <div style={{ flex: 1 }}>
                            <p className="font-mono uppercase" style={{ fontSize: '0.69rem', fontWeight: 700, letterSpacing: '1.2px', color: bannerColor, lineHeight: 1, marginBottom: '3px' }}>
                                {messageType === 'success' ? 'Success' : 'Error'}
                            </p>
                            <p className="font-ui" style={{ fontSize: '0.875rem', fontWeight: 600, color: bannerColor, lineHeight: 1.4, margin: 0, letterSpacing: '0.108px' }}>
                                {message}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Current storage widget ── */}
                {/* DESIGN.md: no card/shadow — 1px hairline rule container */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderLeft: '4px solid #000000', marginBottom: '40px' }}>
                    <CreditCard size={20} strokeWidth={1.5} style={{ color: '#1a1a1a', flexShrink: 0 }} />
                    <div>
                        <p className="font-mono uppercase" style={{ fontSize: '0.69rem', fontWeight: 700, letterSpacing: '1.2px', color: '#757575', lineHeight: 1, marginBottom: '4px' }}>
                            Current Storage Remaining
                        </p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            {/* Display numerals in Playfair */}
                            <span className="font-display" style={{ fontSize: '2rem', fontWeight: 400, color: '#1a1a1a', letterSpacing: '-0.5px', lineHeight: 1 }}>
                                {value}
                            </span>
                            <span className="font-mono uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', color: '#757575' }}>
                                {unit}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Plan tiles ── */}
                {/* DESIGN.md: no rounded cards — 2px solid black border, no shadow */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                    {PLANS.map((plan) => {
                        const storageDisplay = formatCredits(Number(plan.storage));
                        const isProcessing = processingPayment && processingPlanId === plan.id;
                        return (
                            <div
                                key={plan.id}
                                style={{
                                    border: plan.recommended ? '2px solid #000000' : '1px solid #000000',
                                    borderRadius: 0,
                                    backgroundColor: '#ffffff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {/* Plan header ribbon — black for recommended, hairline for standard */}
                                <div
                                    style={{
                                        backgroundColor: plan.recommended ? '#000000' : '#f5f5f5',
                                        padding: '10px 16px',
                                        borderBottom: '1px solid #000000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {/* Plan name kicker */}
                                    <span
                                        className="font-mono uppercase"
                                        style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            letterSpacing: '1.2px',
                                            color: plan.recommended ? '#ffffff' : '#1a1a1a',
                                            lineHeight: 1,
                                        }}
                                    >
                                        {plan.name}
                                    </span>
                                    {/* DESIGN.md: pill (1920px) ONLY for inline text tags like "RECOMMENDED" */}
                                    {plan.recommended && (
                                        <span
                                            className="font-mono uppercase"
                                            style={{
                                                fontSize: '0.63rem',
                                                fontWeight: 700,
                                                letterSpacing: '1.2px',
                                                color: '#000000',
                                                backgroundColor: '#ffffff',
                                                borderRadius: '1920px',
                                                padding: '2px 8px',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            Recommended
                                        </span>
                                    )}
                                </div>

                                {/* Plan body */}
                                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    {/* Price block */}
                                    <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                            {/* Large display numerals */}
                                            <span className="font-display" style={{ fontSize: '3rem', fontWeight: 400, color: '#1a1a1a', letterSpacing: '-0.5px', lineHeight: 1 }}>
                                                ₹{plan.price}
                                            </span>
                                        </div>
                                        <p className="font-mono uppercase" style={{ fontSize: '0.69rem', letterSpacing: '1.1px', color: '#757575', marginTop: '6px', lineHeight: 1.33 }}>
                                            For {storageDisplay.value} {storageDisplay.unit} additional storage
                                        </p>
                                    </div>

                                    {/* Feature list */}
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                                        {plan.features.map((feature, i) => (
                                            <li
                                                key={i}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '10px',
                                                    padding: '8px 0',
                                                    borderBottom: i < plan.features.length - 1 ? '1px solid #e2e8f0' : 'none',
                                                }}
                                            >
                                                {/* DESIGN.md: check mark in page-ink, no color */}
                                                <Check size={14} strokeWidth={2.5} style={{ color: '#1a1a1a', flexShrink: 0, marginTop: '2px' }} />
                                                <span className="font-ui" style={{ fontSize: '0.875rem', color: '#1a1a1a', letterSpacing: '0.108px', lineHeight: 1.4 }}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA button */}
                                    <WiredBtn
                                        onClick={() => handlePurchase(plan)}
                                        disabled={processingPayment}
                                        fullWidth
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                                                <span>Processing…</span>
                                            </>
                                        ) : (
                                            <span>Purchase Plan</span>
                                        )}
                                    </WiredBtn>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── How plans work ── */}
                {/* DESIGN.md: hairline hr + mono kicker label above editorial body copy */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                    {/* Black ribbon section marker */}
                    <div
                        className="font-mono uppercase"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '1.2px',
                            padding: '5px 12px',
                            lineHeight: 1,
                            marginBottom: '16px',
                        }}
                    >
                        How plans work
                    </div>
                    <p className="font-body" style={{ fontSize: '1rem', color: '#757575', lineHeight: 1.5, margin: 0, maxWidth: '560px' }}>
                        When you purchase a plan, the additional storage is added to your account immediately.
                        Storage is measured in bytes and each uploaded file consumes one credit from your balance.
                    </p>
                </div>

            </div>

            {/* Spin keyframe */}
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </DashboardLayout>
    );
};

export default Subscription;
