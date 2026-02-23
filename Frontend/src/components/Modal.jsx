import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
    isOpen, 
    onClose, 
    children, 
    title,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    confirmationButtonClass = "bg-red-600 hover:bg-red-700",
    size = "md",
    showCloseButton = true,
    closeOnOverlayClick = true
}) => {
    const [isConfirming, setIsConfirming] = useState(false);

    // Close modal on Escape key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Reset confirming state when modal is reopened
    useEffect(() => {
        if (isOpen) {
            setIsConfirming(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Size classes
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl'
    };

    const handleConfirm = async () => {
        if (onConfirm && !isConfirming) {
            setIsConfirming(true);
            try {
                await onConfirm();
                onClose();
            } catch (error) {
                setIsConfirming(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop/Overlay */}
            <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
                onClick={closeOnOverlayClick ? onClose : undefined}
            />
            
            {/* Modal Content */}
            <div 
                className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full transform transition-all z-10`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        {title && (
                            <h3 className="text-lg font-medium text-gray-900">
                                {title}
                            </h3>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={isConfirming}
                            >
                                <X size={24} />
                            </button>
                        )}
                    </div>
                )}

                {/* Modal Content */}
                <div className={title || showCloseButton ? "p-6 pt-4" : "p-6"}>
                    {children}
                </div>

                {/* Modal Actions (for confirmation dialogs) */}
                {onConfirm && (
                    <div className="flex gap-3 justify-end p-6 pt-0">
                        <button
                            onClick={onClose}
                            disabled={isConfirming}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isConfirming}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmationButtonClass}`}
                        >
                            {isConfirming ? 'Processing...' : confirmText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;