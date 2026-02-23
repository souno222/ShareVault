import { useState } from 'react';
import Modal from './Modal';
import { Copy, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const LinkShareModal = ({ 
    isOpen, 
    onClose, 
    link, 
    title = "Share File" 
}) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            
            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
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
            size="xl"
        >
            <div className="space-y-4">
                {/* Description */}
                <p className="text-gray-600 text-sm">
                    Share this link with others to give them access to your file.
                </p>

                {/* Link Display */}
                <div className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate font-mono">
                                {link}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className={`p-2 rounded-md transition-all duration-200 ${
                                    copied 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                                }`}
                                title="Copy link"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                            <button
                                onClick={openInNewTab}
                                className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-md transition-colors"
                                title="Open in new tab"
                            >
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mt-0.5 flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                        </div>
                        <div>
                            <p className="text-blue-900 text-sm font-medium">
                                Public Link
                            </p>
                            <p className="text-blue-700 text-xs mt-1">
                                Anyone with this link can view and download the file.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-2">
                    <button
                        onClick={copyToClipboard}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            copied
                                ? 'bg-green-600 text-white'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                    >
                        {copied ? (
                            <div className="flex items-center gap-2">
                                <Check size={16} />
                                Copied!
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Copy size={16} />
                                Copy Link
                            </div>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LinkShareModal;