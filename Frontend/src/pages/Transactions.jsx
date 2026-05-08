import DashboardLayout from '../layout/DashboardLayout';
import { Receipt, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { apiEndpoints } from '../util/apiendpoints';

/* ─── helpers ─────────────────────────────────────── */

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

const formatAmount = (amountInPaise) =>
    `₹ ${(amountInPaise / 100).toFixed(2)}`;

/* ─── Skeleton row ───────────────────────────────── */
const SkeletonRow = () => (
    <tr>
        {[140, 80, 70, 200, 70].map((w, i) => (
            <td key={i} style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{
                    height: '12px',
                    width: `${w}px`,
                    maxWidth: '100%',
                    backgroundColor: '#e2e8f0',
                    animation: 'pulse 1.5s ease-in-out infinite',
                }} />
            </td>
        ))}
    </tr>
);

/* ─── Table header cell ──────────────────────────── */
const TH = ({ children }) => (
    <th
        className="font-mono uppercase"
        style={{
            padding: '10px 16px',
            textAlign: 'left',
            fontSize: '0.63rem',
            fontWeight: 700,
            letterSpacing: '1.2px',
            color: '#ffffff',
            lineHeight: 1,
            whiteSpace: 'nowrap',
        }}
    >
        {children}
    </th>
);

/* ─── Table body cell ────────────────────────────── */
const TD = ({ children, mono }) => (
    <td style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'middle' }}>
        {mono ? (
            <span className="font-mono uppercase" style={{ fontSize: '0.69rem', letterSpacing: '1.1px', color: '#757575', lineHeight: 1.33 }}>
                {children}
            </span>
        ) : (
            <span className="font-ui" style={{ fontSize: '0.875rem', color: '#1a1a1a', letterSpacing: '0.108px', lineHeight: 1.4 }}>
                {children}
            </span>
        )}
    </td>
);

/* ═══════════════════════════════════════════════════
   Transactions page
═══════════════════════════════════════════════════ */
const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const token = await getToken();
                const res = await axios.get(apiEndpoints.GET_TRANSACTIONS, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTransactions(res.data);
                setError(null);
            } catch {
                setError('Failed to load your transaction history. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [getToken]);

    return (
        <DashboardLayout activeMenu="Transactions">
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>

            <div style={{ padding: '40px 32px', maxWidth: '1100px' }}>

                {/* ── Page header ── */}
                <header style={{ marginBottom: '32px', borderBottom: '2px solid #000000', paddingBottom: '16px' }}>
                    <p className="font-mono uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', color: '#757575', lineHeight: 1.23, marginBottom: '6px' }}>
                        ShareVault · Billing
                    </p>
                    <h1 className="font-display" style={{ fontSize: '2.5rem', fontWeight: 400, letterSpacing: '-0.5px', color: '#1a1a1a', lineHeight: 1.05, margin: 0 }}>
                        Transaction History
                    </h1>
                    <p className="font-body" style={{ fontSize: '1rem', color: '#757575', lineHeight: 1.5, marginTop: '8px' }}>
                        A complete record of your storage purchases on ShareVault.
                    </p>
                </header>

                {/* ── Error banner ── */}
                {error && (
                    <div
                        role="alert"
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            marginBottom: '32px',
                            padding: '12px 16px',
                            borderLeft: '4px solid #000000',
                            backgroundColor: '#ffffff',
                            borderRadius: 0,
                        }}
                    >
                        <AlertCircle size={16} strokeWidth={2} style={{ color: '#1a1a1a', flexShrink: 0, marginTop: '1px' }} />
                        <div>
                            <p className="font-mono uppercase" style={{ fontSize: '0.69rem', fontWeight: 700, letterSpacing: '1.2px', color: '#1a1a1a', lineHeight: 1, marginBottom: '3px' }}>
                                Error
                            </p>
                            <p className="font-ui" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4, margin: 0 }}>
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Loading skeleton ── */}
                {loading && (
                    <div style={{ border: '1px solid #000000', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#000000' }}>
                                <tr>
                                    <TH>Date</TH>
                                    <TH>Plan</TH>
                                    <TH>Amount</TH>
                                    <TH>Payment ID</TH>
                                    <TH>Status</TH>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loading && !error && transactions.length === 0 && (
                    <div style={{ padding: '64px 32px', textAlign: 'center', border: '1px solid #000000' }}>
                        <Receipt size={40} strokeWidth={1} style={{ color: '#757575', margin: '0 auto 16px' }} />
                        <p className="font-mono uppercase" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', color: '#757575', marginBottom: '8px' }}>
                            No transactions yet
                        </p>
                        <p className="font-body" style={{ fontSize: '1rem', color: '#757575', lineHeight: 1.5, margin: '0 auto 24px', maxWidth: '360px' }}>
                            Your transaction history is empty. Purchase a subscription plan to see records here.
                        </p>

                        {/* Guide block — 1px hairline container instead of colored card */}
                        <div style={{ display: 'inline-block', textAlign: 'left', borderLeft: '4px solid #000000', padding: '12px 16px', maxWidth: '360px' }}>
                            <p className="font-mono uppercase" style={{ fontSize: '0.69rem', fontWeight: 700, letterSpacing: '1.2px', color: '#1a1a1a', lineHeight: 1, marginBottom: '8px' }}>
                                What you'll see
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {['Payment date & time', 'Plan purchased', 'Amount charged', 'Razorpay payment ID', 'Transaction status'].map((item, i) => (
                                    <li key={i} className="font-ui" style={{ fontSize: '0.875rem', color: '#757575', lineHeight: 1.6, letterSpacing: '0.108px' }}>
                                        — {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* ── Transaction table ── */}
                {!loading && !error && transactions.length > 0 && (
                    <>
                        {/* Desktop table */}
                        <div className="hidden lg:block" style={{ border: '1px solid #000000', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                {/* DESIGN.md: black ribbon header = level-4 elevation */}
                                <thead style={{ backgroundColor: '#000000' }}>
                                    <tr>
                                        <TH>Date</TH>
                                        <TH>Plan</TH>
                                        <TH>Amount</TH>
                                        <TH>Payment ID</TH>
                                        <TH>Status</TH>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr
                                            key={tx.id}
                                            style={{ transition: 'background-color 120ms' }}
                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9f9f9'; }}
                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                        >
                                            {/* Date */}
                                            <TD mono>{formatDate(tx.transactionDate)}</TD>

                                            {/* Plan — bold UI label */}
                                            <td style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'middle' }}>
                                                <span className="font-ui" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.108px' }}>
                                                    {tx.planId}
                                                </span>
                                            </td>

                                            {/* Amount — display numeral style */}
                                            <td style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'middle' }}>
                                                <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, color: '#1a1a1a', letterSpacing: '-0.144px', lineHeight: 1 }}>
                                                    {formatAmount(tx.amount)}
                                                </span>
                                            </td>

                                            {/* Payment ID — mono small */}
                                            <TD mono>{tx.paymentId}</TD>

                                            {/* Status — WIRED mono pill for SUCCESS/FAILED */}
                                            <td style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'middle' }}>
                                                {/* DESIGN.md: pill (1920px) only for inline text tags */}
                                                <span
                                                    className="font-mono uppercase"
                                                    style={{
                                                        fontSize: '0.63rem',
                                                        fontWeight: 700,
                                                        letterSpacing: '1.2px',
                                                        color: tx.status === 'SUCCESS' ? '#ffffff' : '#1a1a1a',
                                                        backgroundColor: tx.status === 'SUCCESS' ? '#000000' : '#ffffff',
                                                        border: '1px solid #000000',
                                                        borderRadius: '1920px',
                                                        padding: '3px 9px',
                                                        lineHeight: 1.6,
                                                        display: 'inline-block',
                                                    }}
                                                >
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile stacked rows */}
                        <div className="lg:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#000000' }}>
                            {transactions.map((tx) => (
                                <div key={tx.id} style={{ backgroundColor: '#ffffff', padding: '16px' }}>
                                    {/* Amount + Plan row */}
                                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 400, color: '#1a1a1a', letterSpacing: '-0.144px' }}>
                                            {formatAmount(tx.amount)}
                                        </span>
                                        <span className="font-ui" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a1a1a' }}>
                                            {tx.planId}
                                        </span>
                                    </div>

                                    {/* Meta row */}
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                                        <span className="font-mono uppercase" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#757575' }}>
                                            {formatDate(tx.transactionDate)}
                                        </span>
                                    </div>

                                    {/* Payment ID + status */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                        <span className="font-mono" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#757575', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                            {tx.paymentId}
                                        </span>
                                        <span
                                            className="font-mono uppercase"
                                            style={{
                                                fontSize: '0.63rem',
                                                fontWeight: 700,
                                                letterSpacing: '1.2px',
                                                color: tx.status === 'SUCCESS' ? '#ffffff' : '#1a1a1a',
                                                backgroundColor: tx.status === 'SUCCESS' ? '#000000' : '#ffffff',
                                                border: '1px solid #000000',
                                                borderRadius: '1920px',
                                                padding: '2px 8px',
                                                lineHeight: 1.6,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer rule */}
                        <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                            <p className="font-mono uppercase" style={{ fontSize: '0.63rem', letterSpacing: '1.1px', color: '#757575' }}>
                                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} · sorted by date
                            </p>
                        </div>
                    </>
                )}

            </div>
        </DashboardLayout>
    );
};

export default Transactions;
