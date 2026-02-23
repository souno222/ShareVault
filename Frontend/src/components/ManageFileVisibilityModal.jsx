import { useState, useEffect } from 'react';
import Modal from './Modal';
import { Eye, EyeOff, Lock, Mail, X } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { apiEndpoints } from '../util/apiendpoints';
import toast from 'react-hot-toast';

const ManageFileVisibilityModal = ({ 
    isOpen, 
    onClose, 
    currentVisibility = 'private',
    currentAccessList = [],
    onSave,
    fileName = "File",
    fileId
}) => {
    const [visibility, setVisibility] = useState(currentVisibility);
    const [accessList, setAccessList] = useState(currentAccessList);
    const [emailInput, setEmailInput] = useState('');
    const [error, setError] = useState('');
    const [removedEmails, setRemovedEmails] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { getToken } = useAuth();

    useEffect(() => {
        if (isOpen) {
            setVisibility(currentVisibility);
            const emails = Array.isArray(currentAccessList) 
                ? currentAccessList 
                : [];
            setAccessList(emails);
            setEmailInput('');
            setError('');
            setRemovedEmails([]);
        }
    }, [isOpen, currentVisibility, currentAccessList]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            
            const trimmedEmail = emailInput.trim().toLowerCase();
            
            if (!trimmedEmail) {
                return;
            }

            if (!validateEmail(trimmedEmail)) {
                setError('Please enter a valid email address');
                return;
            }

            if (accessList.includes(trimmedEmail)) {
                setError('This email is already in the access list');
                return;
            }

            setAccessList(prev => [...prev, trimmedEmail]);
            setEmailInput('');
            setError('');
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        // Check if this email was in the original list
        if (currentAccessList.includes(emailToRemove)) {
            setRemovedEmails(prev => [...prev, emailToRemove]);
        }
        setAccessList(accessList.filter(email => email !== emailToRemove));
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = await getToken();
            await axios.delete(
                apiEndpoints.EDIT_FILE_ACCESS_LIST(fileId),
                {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { emails: removedEmails }
                }
            );
            toast.success('Emails removed from access list');
            setRemovedEmails([]);
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Error removing emails:', error);
            toast.error('Error removing emails from access list');
        }
    };

    const handleSave = () => {
        // If there are removed emails, show confirmation modal
        if (removedEmails.length > 0) {
            setShowDeleteConfirm(true);
        } else {
            // No emails removed, proceed with normal save
            onSave({
                visibility,
                accessList: visibility === 'protected' ? { emails: accessList } : { emails: [] }
            });
            onClose();
        }
    };

    const handleConfirmAndSave = async () => {
        // Delete removed emails first
        await handleDeleteConfirm();
        
        // Then save the new visibility settings
        onSave({
            visibility,
            accessList: visibility === 'protected' ? { emails: accessList } : { emails: [] }
        });
        onClose();
    };

    const visibilityOptions = [
        {
            value: 'public',
            label: 'Public',
            description: 'Anyone with the link can access this file',
            icon: Eye,
            color: 'blue'
        },
        {
            value: 'private',
            label: 'Private',
            description: 'Only you can access this file',
            icon: EyeOff,
            color: 'gray'
        },
        {
            value: 'protected',
            label: 'Protected',
            description: 'Only specific people can access this file',
            icon: Lock,
            color: 'purple'
        }
    ];

    return (
        <>
            <Modal 
                isOpen={isOpen}
                onClose={onClose}
                title="Manage File Visibility"
                size="sm"
            >
                <div className="space-y-2">
                    {/* File Name Display */}
                    <div className="bg-gray-50 rounded-lg p-2 border">
                        <p className="text-sm text-gray-600">File</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                    </div>

                    {/* Visibility Options */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Visibility Setting
                        </label>
                        
                        {visibilityOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = visibility === option.value;
                            
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => setVisibility(option.value)}
                                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                                        isSelected
                                            ? `border-${option.color}-500 bg-${option.color}-50`
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            isSelected
                                                ? `bg-${option.color}-100`
                                                : 'bg-gray-100'
                                        }`}>
                                            <Icon 
                                                size={20} 
                                                className={isSelected ? `text-${option.color}-600` : 'text-gray-600'} 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    {option.label}
                                                </h4>
                                                {isSelected && (
                                                    <div className={`w-2 h-2 rounded-full bg-${option.color}-500`}></div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {option.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Access List Section (shown only when protected is selected) */}
                    {visibility === 'protected' && (
                        <div className="space-y-1 pt-2 border-t">
                            <label className="block text-sm font-medium text-gray-700">
                                Access List
                            </label>
                            
                            {/* Email Input */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail 
                                        size={16} 
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                                    />
                                    <input
                                        type="email"
                                        value={emailInput}
                                        onChange={(e) => {
                                            setEmailInput(e.target.value);
                                            setError('');
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Enter email address and press Enter"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                                {error && (
                                    <p className="text-xs text-red-600">{error}</p>
                                )}
                            </div>

                            {/* Email Tags/Chips - Fixed height with scroll */}
                            {accessList.length > 0 ? (
                                <div className="h-[120px] overflow-y-auto p-3 bg-gray-50 rounded-lg border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    <div className="flex flex-wrap gap-2">
                                        {accessList.map((email, index) => (
                                            <div
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm"
                                            >
                                                <span>{email}</span>
                                                <button
                                                    onClick={() => handleRemoveEmail(email)}
                                                    className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[120px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                                    <Lock size={24} className="text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        No emails added yet
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Add email addresses to grant access to this file
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end pt-2 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Remove Access"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to remove access for the following {removedEmails.length === 1 ? 'email' : 'emails'}?
                    </p>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
                        {removedEmails.map((email, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-red-700">
                                <Mail size={14} />
                                <span>{email}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-gray-500">
                        These users will no longer be able to access this file.
                    </p>

                    <div className="flex gap-3 justify-end pt-2 border-t">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmAndSave}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Remove & Save
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ManageFileVisibilityModal;