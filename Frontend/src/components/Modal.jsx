import { useEffect } from 'react';
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

    if (!isOpen) return null;

    // Size classes
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl'
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div 
                className="fixed inset-0" 
                onClick={closeOnOverlayClick ? onClose : undefined}
            />
            <div 
                className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full transform transition-all`}
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
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${confirmationButtonClass}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;