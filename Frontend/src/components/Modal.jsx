import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/**
 * WIRED-system Modal
 * ─────────────────────────────────────────────────────────────────
 * Rules applied (DESIGN.md §4, §6):
 *  • border-radius: 0 on panel, inputs, and buttons — square is law
 *  • No box-shadow — depth = 2px solid #000 border (level-3 elevation)
 *  • Header = full black ribbon (level-4 elevation) with WiredMono ALL-CAPS label
 *  • Backdrop = solid rgba(0,0,0,0.55), no blur, no gradient
 *  • Primary button: white bg + 2px #000 border → inverts on hover (150ms)
 *  • Secondary button: black bg + 2px #000 border → white text always
 *  • Close button: round 50% — the ONLY circular shape on a WIRED panel
 *  • Colors: only #000, #1a1a1a, #757575, #e2e8f0, #fff, #057dbc
 */

/* ─── Reusable WIRED button ──────────────────────────────────────── */
export const WiredButton = ({
    children,
    onClick,
    disabled = false,
    variant = 'primary',   // 'primary' | 'secondary' | 'danger'
    type = 'button',
    fullWidth = false,
}) => {
    const [hovered, setHovered] = useState(false);

    const styles = {
        primary: {
            base:  { bg: '#ffffff', color: '#000000', border: '#000000' },
            hover: { bg: '#000000', color: '#ffffff' },
        },
        secondary: {
            base:  { bg: '#ffffff', color: '#1a1a1a', border: '#000000' },
            hover: { bg: '#1a1a1a', color: '#ffffff' },
        },
        danger: {
            base:  { bg: '#ffffff', color: '#000000', border: '#000000' },
            hover: { bg: '#1a1a1a', color: '#ffffff' },
        },
    };

    const { base, hover } = styles[variant] || styles.primary;
    const active = hovered && !disabled;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: '10px 20px',
                fontSize: '0.875rem',        // Apercu UI label
                fontFamily: 'Apercu, Inter, Work Sans, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.3px',
                lineHeight: 1.25,
                border: `2px solid ${base.border}`,
                borderRadius: 0,             // square is law
                backgroundColor: active ? hover.bg : base.bg,
                color: active ? hover.color : base.color,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.45 : 1,
                transition: 'background-color 150ms, color 150ms',
                width: fullWidth ? '100%' : undefined,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
            }}
        >
            {children}
        </button>
    );
};

/* ─── Modal shell ────────────────────────────────────────────────── */
const Modal = ({
    isOpen,
    onClose,
    children,
    title,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
}) => {
    const [isConfirming, setIsConfirming] = useState(false);

    /* Escape key */
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    /* Body scroll lock */
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    /* Reset confirming state on re-open */
    useEffect(() => {
        if (isOpen) setIsConfirming(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const maxWidths = {
        sm: '420px',
        md: '520px',
        lg: '640px',
        xl: '760px',
        '2xl': '920px',
    };

    const handleConfirm = async () => {
        if (onConfirm && !isConfirming) {
            setIsConfirming(true);
            try {
                await onConfirm();
                onClose();
            } catch {
                setIsConfirming(false);
            }
        }
    };

    return (
        /* DESIGN.md: no blur, no gradient — solid translucent overlay only */
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px',
            }}
        >
            {/* ── Backdrop ── */}
            <div
                style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.55)',
                }}
                onClick={closeOnOverlayClick ? onClose : undefined}
            />

            {/* ── Panel — 2px black border, 0 radius, no shadow ── */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    zIndex: 10,
                    backgroundColor: '#ffffff',
                    border: '2px solid #000000',
                    borderRadius: 0,
                    width: '100%',
                    maxWidth: maxWidths[size] || maxWidths.md,
                    maxHeight: 'calc(100vh - 32px)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                }}
            >
                {/* ── Header ribbon — level-4 elevation, WiredMono ALL-CAPS ── */}
                {(title || showCloseButton) && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 16px',
                            backgroundColor: '#000000',
                            flexShrink: 0,
                        }}
                    >
                        {title && (
                            <span
                                style={{
                                    fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    letterSpacing: '1.2px',
                                    textTransform: 'uppercase',
                                    color: '#ffffff',
                                    lineHeight: 1,
                                }}
                            >
                                {title}
                            </span>
                        )}

                        {showCloseButton && (
                            /* DESIGN.md: round icon button — the ONLY circular shape */
                            <button
                                onClick={onClose}
                                disabled={isConfirming}
                                aria-label="Close"
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    borderRadius: '50%',
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: isConfirming ? 'not-allowed' : 'pointer',
                                    color: '#ffffff',
                                    opacity: isConfirming ? 0.4 : 1,
                                    transition: 'border-color 120ms',
                                    flexShrink: 0,
                                    marginLeft: '12px',
                                    padding: 0,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                            >
                                <X size={13} strokeWidth={2} />
                            </button>
                        )}
                    </div>
                )}

                {/* ── Body ── */}
                <div style={{ padding: '24px', flex: 1 }}>
                    {children}
                </div>

                {/* ── Footer buttons — hard hairline above, right-aligned ── */}
                {onConfirm && (
                    <>
                        {/* Hairline separator — level-1 elevation */}
                        <div style={{ borderTop: '1px solid #e2e8f0', flexShrink: 0 }} />
                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end',
                                padding: '16px 24px',
                                flexShrink: 0,
                            }}
                        >
                            <WiredButton
                                onClick={onClose}
                                disabled={isConfirming}
                                variant="secondary"
                            >
                                {cancelText}
                            </WiredButton>
                            <WiredButton
                                onClick={handleConfirm}
                                disabled={isConfirming}
                                variant="primary"
                            >
                                {isConfirming ? 'Working…' : confirmText}
                            </WiredButton>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;