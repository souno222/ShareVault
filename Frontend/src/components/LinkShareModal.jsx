import { useState } from 'react';
import Modal from './Modal';
import { WiredButton } from './Modal';
import { Copy, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * LinkShareModal — WIRED design system
 * ──────────────────────────────────────────────────────────────────
 * • Black ribbon header via Modal (WiredMono caps label)
 * • Link display: 2px solid #000 border, 0 radius, WiredMono text
 * • Action buttons: WiredButton (2px border, inversion on hover)
 * • No color outside #000 / #1a1a1a / #757575 / #e2e8f0 / #fff / #057dbc
 * • No shadows, no rounded containers, no glassmorphism
 * • Info notice: 1px solid #000 left bar (editorial column rule), not blue
 */
const LinkShareModal = ({
    isOpen,
    onClose,
    link,
    file,
    title = 'Share File',
}) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
            toast.error('Failed to copy link');
        }
    };

    const openInNewTab = () => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="lg"
        >
            {/* ── Section kicker ── */}
            <p
                style={{
                    fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.92px',
                    textTransform: 'uppercase',
                    color: '#757575',
                    marginBottom: '12px',
                }}
            >
                Share Link
            </p>

            {/* ── Deck copy ── */}
            <p
                style={{
                    fontFamily: 'Apercu, Inter, Work Sans, sans-serif',
                    fontSize: '0.875rem',
                    color: '#1a1a1a',
                    lineHeight: 1.5,
                    marginBottom: '20px',
                }}
            >
                Share this link with others to give them access to your file.
            </p>

            {/* ── Link display — 2px solid #000, 0 radius, WiredMono URL ── */}
            <div
                style={{
                    border: '2px solid #000000',
                    borderRadius: 0,
                    backgroundColor: '#ffffff',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                }}
            >
                {/* URL text */}
                <span
                    style={{
                        flex: 1,
                        minWidth: 0,
                        fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                        fontSize: '0.75rem',
                        letterSpacing: '0.4px',
                        color: '#1a1a1a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.5,
                    }}
                >
                    {link}
                </span>

                {/* Icon actions */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {/* Copy icon button */}
                    <IconAction
                        onClick={copyToClipboard}
                        title="Copy link"
                        active={copied}
                    >
                        {copied ? <Check size={15} strokeWidth={2.5} /> : <Copy size={15} strokeWidth={2} />}
                    </IconAction>

                    {/* Open in new tab */}
                    <IconAction onClick={openInNewTab} title="Open in new tab">
                        <ExternalLink size={15} strokeWidth={2} />
                    </IconAction>
                </div>
            </div>

            {/* ── Editorial notice — 2px left black column rule (level-2 depth) ── */}
            <div
                style={{
                    borderLeft: '2px solid #000000',
                    paddingLeft: '14px',
                    marginBottom: '28px',
                }}
            >
                <p
                    style={{
                        fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                        fontSize: '0.69rem',
                        fontWeight: 700,
                        letterSpacing: '0.92px',
                        textTransform: 'uppercase',
                        color: '#1a1a1a',
                        marginBottom: '4px',
                    }}
                >
                    {file?.visibility === 'public' ? 'Public Link' : 'Protected Link'}
                </p>
                <p
                    style={{
                        fontFamily: 'Apercu, Inter, Work Sans, sans-serif',
                        fontSize: '0.8125rem',
                        color: '#757575',
                        lineHeight: 1.47,
                    }}
                >
                    {file?.visibility === 'public' ? 'Anyone with this link can view and download the file.' : 'Only users added to the access list can view and download the file.'}
                </p>
            </div>

            {/* ── Hairline divider ── */}
            <div style={{ borderTop: '1px solid #e2e8f0', marginBottom: '16px' }} />

            {/* ── Action buttons ── */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <WiredButton variant="secondary" onClick={onClose}>
                    Close
                </WiredButton>
                <WiredButton variant="primary" onClick={copyToClipboard}>
                    {copied ? (
                        <><Check size={14} strokeWidth={2.5} /> Copied!</>
                    ) : (
                        <><Copy size={14} strokeWidth={2} /> Copy Link</>
                    )}
                </WiredButton>
            </div>
        </Modal>
    );
};

/* ── Inline icon action button ──────────────────────────────────── */
const IconAction = ({ children, onClick, title, active = false }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            onClick={onClick}
            title={title}
            aria-label={title}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #000000',
                borderRadius: 0,
                backgroundColor: active
                    ? '#000000'
                    : hovered
                        ? '#000000'
                        : '#ffffff',
                color: active || hovered ? '#ffffff' : '#1a1a1a',
                cursor: 'pointer',
                transition: 'background-color 120ms, color 120ms',
                padding: 0,
                flexShrink: 0,
            }}
        >
            {children}
        </button>
    );
};

export default LinkShareModal;