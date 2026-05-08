import { useState, useEffect } from 'react';
import Modal from './Modal';
import { WiredButton } from './Modal';
import { Eye, EyeOff, Lock, Mail, X } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { apiEndpoints } from '../util/apiendpoints';
import toast from 'react-hot-toast';

/**
 * ManageFileVisibilityModal — WIRED design system
 * ────────────────────────────────────────────────────────────────────
 * • No rounded containers — border-radius: 0 everywhere
 * • No box-shadow, no glassmorphism, no gradients
 * • Visibility options: selected = 2px solid #000 border (level-3)
 *   unselected = 1px solid #e2e8f0 hairline (level-1)
 * • Selected option marker: small ■ in black, not a colored dot
 * • Email tags: WiredMono text, 1px solid #000, 0 radius — no pill shapes
 * • Input: 2px solid #000, 0 radius, Apercu placeholder
 * • All section headers: WiredMono ALL-CAPS kicker
 * • Confirmation sub-modal also uses Modal shell (inherits all rules)
 */

const ManageFileVisibilityModal = ({
    isOpen,
    onClose,
    currentVisibility = 'private',
    currentAccessList = [],
    onSave,
    fileName = 'File',
    fileId,
}) => {
    const [visibility, setVisibility]         = useState(currentVisibility);
    const [accessList, setAccessList]         = useState(currentAccessList);
    const [emailInput, setEmailInput]         = useState('');
    const [error, setError]                   = useState('');
    const [removedEmails, setRemovedEmails]   = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [inputFocused, setInputFocused]     = useState(false);
    const { getToken }                         = useAuth();

    useEffect(() => {
        if (isOpen) {
            setVisibility(currentVisibility);
            setAccessList(Array.isArray(currentAccessList) ? currentAccessList : []);
            setEmailInput('');
            setError('');
            setRemovedEmails([]);
        }
    }, [isOpen, currentVisibility, currentAccessList]);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            const trimmed = emailInput.trim().toLowerCase();
            if (!trimmed) return;
            if (!validateEmail(trimmed)) { setError('Please enter a valid email address'); return; }
            if (accessList.includes(trimmed)) { setError('This email is already in the access list'); return; }
            setAccessList(prev => [...prev, trimmed]);
            setEmailInput('');
            setError('');
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        if (currentAccessList.includes(emailToRemove)) {
            setRemovedEmails(prev => [...prev, emailToRemove]);
        }
        setAccessList(prev => prev.filter(e => e !== emailToRemove));
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = await getToken();
            await axios.delete(apiEndpoints.EDIT_FILE_ACCESS_LIST(fileId), {
                headers: { Authorization: `Bearer ${token}` },
                data: { emails: removedEmails },
            });
            toast.success('Emails removed from access list');
            setRemovedEmails([]);
            setShowDeleteConfirm(false);
        } catch (err) {
            console.error('Error removing emails:', err);
            toast.error('Error removing emails from access list');
        }
    };

    const handleSave = () => {
        if (removedEmails.length > 0) {
            setShowDeleteConfirm(true);
        } else {
            onSave({
                visibility,
                accessList: visibility === 'protected' ? { emails: accessList } : { emails: [] },
            });
            onClose();
        }
    };

    const handleConfirmAndSave = async () => {
        await handleDeleteConfirm();
        onSave({
            visibility,
            accessList: visibility === 'protected' ? { emails: accessList } : { emails: [] },
        });
        onClose();
    };

    const visibilityOptions = [
        {
            value: 'public',
            label: 'Public',
            description: 'Anyone with the link can access this file',
            icon: Eye,
        },
        {
            value: 'private',
            label: 'Private',
            description: 'Only you can access this file',
            icon: EyeOff,
        },
        {
            value: 'protected',
            label: 'Protected',
            description: 'Only specific people can access this file',
            icon: Lock,
        },
    ];

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Manage File Visibility"
                size="md"
            >
                {/* ── File name strip ── */}
                <div
                    style={{
                        borderLeft: '2px solid #000000',
                        paddingLeft: '14px',
                        marginBottom: '20px',
                    }}
                >
                    <p
                        style={{
                            fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                            fontSize: '0.69rem',
                            fontWeight: 700,
                            letterSpacing: '0.9px',
                            textTransform: 'uppercase',
                            color: '#757575',
                            marginBottom: '2px',
                        }}
                    >
                        File
                    </p>
                    <p
                        style={{
                            fontFamily: 'Apercu, Inter, Work Sans, sans-serif',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: '#1a1a1a',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {fileName}
                    </p>
                </div>

                {/* ── Section kicker: Visibility Setting ── */}
                <p
                    style={{
                        fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.92px',
                        textTransform: 'uppercase',
                        color: '#757575',
                        marginBottom: '10px',
                    }}
                >
                    Visibility Setting
                </p>

                {/* ── Visibility option cards ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {visibilityOptions.map(option => {
                        const Icon     = option.icon;
                        const selected = visibility === option.value;

                        return (
                            <VisibilityOption
                                key={option.value}
                                option={option}
                                selected={selected}
                                Icon={Icon}
                                onClick={() => setVisibility(option.value)}
                            />
                        );
                    })}
                </div>

                {/* ── Access list (protected only) ── */}
                {visibility === 'protected' && (
                    <>
                        {/* Hairline rule */}
                        <div style={{ borderTop: '1px solid #000000', marginBottom: '16px' }} />

                        <p
                            style={{
                                fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                letterSpacing: '0.92px',
                                textTransform: 'uppercase',
                                color: '#757575',
                                marginBottom: '10px',
                            }}
                        >
                            Access List
                        </p>

                        {/* Email input */}
                        <div style={{ position: 'relative', marginBottom: error ? '4px' : '12px' }}>
                            <Mail
                                size={15}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: inputFocused ? '#000000' : '#757575',
                                    transition: 'color 120ms',
                                    pointerEvents: 'none',
                                }}
                            />
                            <input
                                type="email"
                                value={emailInput}
                                onChange={e => { setEmailInput(e.target.value); setError(''); }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                placeholder="Enter email and press Enter"
                                style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    paddingLeft: '36px',
                                    paddingRight: '12px',
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    fontFamily: 'Apercu, Inter, Work Sans, sans-serif',
                                    fontSize: '0.875rem',
                                    color: '#1a1a1a',
                                    backgroundColor: '#ffffff',
                                    border: `2px solid ${error ? '#000000' : inputFocused ? '#000000' : '#e2e8f0'}`,
                                    borderRadius: 0,
                                    outline: 'none',
                                    transition: 'border-color 120ms',
                                }}
                            />
                        </div>

                        {error && (
                            <p
                                style={{
                                    fontFamily: 'Apercu, Inter, Work Sans, sans-serif',
                                    fontSize: '0.75rem',
                                    color: '#000000',
                                    marginBottom: '8px',
                                    paddingLeft: '2px',
                                }}
                            >
                                {error}
                            </p>
                        )}

                        {/* Email tag list */}
                        {accessList.length > 0 ? (
                            <div
                                style={{
                                    height: '120px',
                                    overflowY: 'auto',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 0,
                                    backgroundColor: '#ffffff',
                                    padding: '8px',
                                    marginBottom: '20px',
                                }}
                            >
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {accessList.map((email, idx) => (
                                        <EmailTag
                                            key={idx}
                                            email={email}
                                            onRemove={() => handleRemoveEmail(email)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div
                                style={{
                                    height: '120px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 0,
                                    backgroundColor: '#ffffff',
                                    marginBottom: '20px',
                                }}
                            >
                                <Lock size={20} style={{ color: '#757575', marginBottom: '8px' }} />
                                <p
                                    style={{
                                        fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                                        fontSize: '0.69rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.9px',
                                        textTransform: 'uppercase',
                                        color: '#757575',
                                    }}
                                >
                                    No Emails Added
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* ── Hairline ── */}
                <div style={{ borderTop: '1px solid #e2e8f0', marginBottom: '16px' }} />

                {/* ── Action buttons ── */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <WiredButton variant="secondary" onClick={onClose}>
                        Cancel
                    </WiredButton>
                    <WiredButton variant="primary" onClick={handleSave}>
                        Save Changes
                    </WiredButton>
                </div>
            </Modal>

            {/* ── Delete confirmation sub-modal ── */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Remove Access"
                size="sm"
            >
                <p
                    style={{
                        fontFamily: 'Apercu, Inter, Work Sans, sans-serif',
                        fontSize: '0.875rem',
                        color: '#1a1a1a',
                        lineHeight: 1.5,
                        marginBottom: '16px',
                    }}
                >
                    Are you sure you want to remove access for the following{' '}
                    {removedEmails.length === 1 ? 'email' : `${removedEmails.length} emails`}?
                </p>

                {/* Removed email list — black column rule, monospaced */}
                <div
                    style={{
                        borderLeft: '2px solid #000000',
                        paddingLeft: '14px',
                        marginBottom: '16px',
                    }}
                >
                    {removedEmails.map((email, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '6px',
                            }}
                        >
                            <Mail size={13} style={{ color: '#757575', flexShrink: 0 }} />
                            <span
                                style={{
                                    fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.4px',
                                    color: '#1a1a1a',
                                }}
                            >
                                {email}
                            </span>
                        </div>
                    ))}
                </div>

                <p
                    style={{
                        fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                        fontSize: '0.69rem',
                        fontWeight: 700,
                        letterSpacing: '0.9px',
                        textTransform: 'uppercase',
                        color: '#757575',
                        marginBottom: '20px',
                    }}
                >
                    These users will lose access to this file.
                </p>

                <div style={{ borderTop: '1px solid #e2e8f0', marginBottom: '16px' }} />

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <WiredButton
                        variant="secondary"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        Cancel
                    </WiredButton>
                    <WiredButton variant="primary" onClick={handleConfirmAndSave}>
                        Remove &amp; Save
                    </WiredButton>
                </div>
            </Modal>
        </>
    );
};

/* ── Visibility option row ──────────────────────────────────────── */
const VisibilityOption = ({ option, selected, Icon, onClick }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            onClick={onClick}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                border: selected ? '2px solid #000000' : `1px solid ${hovered ? '#000000' : '#e2e8f0'}`,
                borderRadius: 0,
                padding: selected ? '11px 14px' : '12px 14px', // compensate 1px→2px border
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                transition: 'border-color 120ms',
                userSelect: 'none',
            }}
        >
            {/* Icon container — square, NOT round */}
            <div
                style={{
                    width: '36px',
                    height: '36px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: selected ? '#000000' : '#ffffff',
                    transition: 'background-color 120ms',
                }}
            >
                <Icon size={17} style={{ color: selected ? '#ffffff' : '#757575', transition: 'color 120ms' }} />
            </div>

            {/* Label + description */}
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span
                        style={{
                            fontFamily: 'Apercu, Inter, Work Sans, sans-serif',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: '#1a1a1a',
                        }}
                    >
                        {option.label}
                    </span>
                    {/* Selected marker — filled square, not a colored dot */}
                    {selected && (
                        <span
                            style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#000000',
                                display: 'inline-block',
                                flexShrink: 0,
                            }}
                        />
                    )}
                </div>
                <p
                    style={{
                        fontFamily: 'Apercu, Inter, Work Sans, sans-serif',
                        fontSize: '0.75rem',
                        color: '#757575',
                        lineHeight: 1.47,
                        margin: 0,
                    }}
                >
                    {option.description}
                </p>
            </div>
        </div>
    );
};

/* ── Email tag chip — square, WiredMono, no pill ────────────────── */
const EmailTag = ({ email, onRemove }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                border: '1px solid #000000',
                borderRadius: 0,
                backgroundColor: '#ffffff',
            }}
        >
            <span
                style={{
                    fontFamily: 'WiredMono, "Courier New", Courier, monospace',
                    fontSize: '0.69rem',
                    letterSpacing: '0.4px',
                    color: '#1a1a1a',
                }}
            >
                {email}
            </span>
            <button
                onClick={onRemove}
                aria-label={`Remove ${email}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    background: hovered ? '#000000' : 'transparent',
                    border: 'none',
                    borderRadius: 0,
                    padding: '1px',
                    cursor: 'pointer',
                    color: hovered ? '#ffffff' : '#757575',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 120ms, color 120ms',
                    lineHeight: 1,
                }}
            >
                <X size={11} strokeWidth={2.5} />
            </button>
        </div>
    );
};

export default ManageFileVisibilityModal;