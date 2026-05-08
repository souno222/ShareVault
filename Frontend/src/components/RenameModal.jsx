import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { WiredButton } from './Modal';
import { Edit3 } from 'lucide-react';

/**
 * RenameModal — WIRED design system
 * ─────────────────────────────────
 * • Uses shared Modal shell (black ribbon header, 2px border, 0 radius)
 * • Input: 2px solid #000, no radius, Apercu 16px placeholder
 * • Buttons: WiredButton (2px border, inversion on hover)
 * • No color outside #000 / #1a1a1a / #757575 / #e2e8f0 / #fff / #057dbc
 */
const RenameModal = ({ isOpen, onClose, onRename, currentFileName }) => {
    const [newName, setNewName]   = useState('');
    const [focused, setFocused]   = useState(false);
    const inputRef                = useRef(null);

    useEffect(() => {
        if (isOpen && currentFileName) {
            setNewName(currentFileName);
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    const lastDot = currentFileName.lastIndexOf('.');
                    const selectEnd = lastDot > 0 ? lastDot : currentFileName.length;
                    inputRef.current.setSelectionRange(0, selectEnd);
                }
            }, 80);
        }
    }, [isOpen, currentFileName]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = newName.trim();
        if (trimmed && trimmed !== currentFileName) {
            onRename(trimmed);
        }
    };

    const handleClose = () => {
        setNewName('');
        onClose();
    };

    const canSubmit = newName.trim() && newName.trim() !== currentFileName;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Rename File"
            size="sm"
        >
            <form onSubmit={handleSubmit}>
                {/* ── Field label — WiredMono kicker style ── */}
                <label
                    htmlFor="rename-input"
                    style={{
                        display: 'block',
                        fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.92px',
                        textTransform: 'uppercase',
                        color: '#757575',
                        marginBottom: '8px',
                    }}
                >
                    New File Name
                </label>

                {/* ── Input — 2px solid #000, 0 radius, no glow ── */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                    <Edit3
                        size={15}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: focused ? '#000000' : '#757575',
                            transition: 'color 120ms',
                            pointerEvents: 'none',
                        }}
                    />
                    <input
                        id="rename-input"
                        ref={inputRef}
                        type="text"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="Enter new file name"
                        style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            paddingLeft: '36px',
                            paddingRight: '12px',
                            paddingTop: '11px',
                            paddingBottom: '11px',
                            fontFamily: 'Apercu, Inter, Work Sans, sans-serif',
                            fontSize: '0.875rem',
                            color: '#1a1a1a',
                            backgroundColor: '#ffffff',
                            border: `2px solid ${focused ? '#000000' : '#e2e8f0'}`,
                            borderRadius: 0,          // square is law
                            outline: 'none',
                            transition: 'border-color 120ms',
                        }}
                    />
                </div>

                {/* Current name hint */}
                {currentFileName && (
                    <p
                        style={{
                            fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                            fontSize: '0.69rem',
                            letterSpacing: '0.6px',
                            textTransform: 'uppercase',
                            color: '#757575',
                            marginBottom: '24px',
                            marginTop: '4px',
                        }}
                    >
                        Current: {currentFileName}
                    </p>
                )}

                {/* ── Hairline divider ── */}
                <div style={{ borderTop: '1px solid #e2e8f0', marginBottom: '16px' }} />

                {/* ── Action buttons — right-aligned, WiredButton ── */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <WiredButton
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </WiredButton>
                    <WiredButton
                        type="submit"
                        variant="primary"
                        disabled={!canSubmit}
                    >
                        Rename
                    </WiredButton>
                </div>
            </form>
        </Modal>
    );
};

export default RenameModal;