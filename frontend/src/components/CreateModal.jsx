import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Hash, Lock, ChevronDown } from 'lucide-react';
import './CreateModal.css';

const Modal = ({ isOpen, onClose, onPost }) => {
    if (!isOpen) return null;

    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');
    const [secretCode, setSecretCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVibeOpen, setIsVibeOpen] = useState(false);

    const vibes = [
        { id: 'General', label: 'General', icon: '💬' },
        { id: 'Study', label: 'Study', icon: '📚' },
        { id: 'Crush', label: 'Crush', icon: '💘' },
        { id: 'Funny', label: 'Funny', icon: '😂' },
        { id: 'Rant', label: 'Rant', icon: '😤' }
    ];

    const currentVibe = vibes.find(v => v.id === category) || vibes[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Strict validation matching backend requirements
        if (content.trim().length < 10) {
            setError('Your confession must be at least 10 characters.');
            return;
        }
        if (secretCode.trim().length < 4) {
            setError('Secret code must be at least 4 digits.');
            return;
        }

        setIsSubmitting(true);

        // Extract hashtags from content
        const extractedTags = content.match(/#\w+/g) || [];
        const cleanTags = extractedTags.map(t => t.replace('#', ''));

        try {
            await onPost({
                content,
                category,
                secretCode,
                hashtags: cleanTags.length > 0 ? cleanTags : ['secret']
            });

            // Clean up on success
            setContent('');
            setSecretCode('');
            setCategory('General');
            onClose();
        } catch (err) {
            const apiError = err.response?.data?.error || 'Failed to post. Please try again.';
            setError(apiError);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="modal-header">
                    <div className="modal-title-group">
                        <div className="modal-icon-bg">
                            <Sparkles size={20} className="modal-icon" />
                        </div>
                        <div>
                            <h2>Whisper Your Secret</h2>
                            <p>Anonymously share what's on your mind.</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">

                    {error && (
                        <div className="modal-error-msg">
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Textarea */}
                    <div className={`textarea-wrapper ${content.length > 0 && content.length < 10 ? 'error' : ''}`}>
                        <textarea
                            placeholder="Example: I've been secretly watering my roommate's plant with coffee #roommateprobs (Min 10 chars)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={1000}
                            required
                        />
                        <div className="textarea-footer">
                            <span className="hashtag-hint">
                                <Hash size={14} /> Type # to add tags
                            </span>
                            <span className={`char-count ${content.length > 0 && content.length < 10 ? 'warning' : ''}`}>
                                {content.length}/1000
                            </span>
                        </div>
                    </div>

                    {/* Quick Emojis */}
                    <div className="emoji-bar">
                        {[
                            '😂', '🤣', '🤫', '😤', '😭', '💀',
                            '🔥', '✨', '💘', '😍', '🍿', '🌈',
                            '🙌', '📚', '💬', '🥺', '🫠', '🫡',
                            '🫣', '🥵', '🥳', '🤯', '🍕', '🎉'
                        ].map(emoji => (
                            <button
                                key={emoji}
                                type="button"
                                className="emoji-btn"
                                onClick={() => setContent(prev => prev + emoji)}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Category Vibe</label>
                            <div className="custom-dropdown">
                                <div
                                    className={`dropdown-trigger ${isVibeOpen ? 'active' : ''}`}
                                    onClick={() => setIsVibeOpen(!isVibeOpen)}
                                >
                                    <span className="vibe-preview">
                                        <span className="vibe-icon">{currentVibe.icon}</span>
                                        <span className="vibe-label">{currentVibe.label}</span>
                                    </span>
                                    <ChevronDown size={14} className={`chevron ${isVibeOpen ? 'up' : ''}`} />
                                </div>

                                {isVibeOpen && (
                                    <div className="dropdown-menu">
                                        {vibes.map((v) => (
                                            <div
                                                key={v.id}
                                                className={`dropdown-option ${category === v.id ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setCategory(v.id);
                                                    setIsVibeOpen(false);
                                                }}
                                            >
                                                <span className="option-icon">{v.icon}</span>
                                                <span className="option-label">{v.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Secret Code (Required by Backend) */}
                        <div className="form-group">
                            <label>Secret Code</label>
                            <div className={`input-with-icon ${secretCode.length > 0 && secretCode.length < 4 ? 'error' : ''}`}>
                                <Lock size={16} className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Min 4 digits"
                                    value={secretCode}
                                    onChange={(e) => setSecretCode(e.target.value)}
                                    maxLength={8}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Privacy Note */}
                    <div className="privacy-pill">
                        <ShieldCheck size={16} />
                        <span>Your identity remains 100% anonymous.</span>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="modal-submit-btn"
                        disabled={isSubmitting || content.trim().length < 10 || secretCode.trim().length < 4}
                    >
                        {isSubmitting ? 'Publishing...' : 'Post Anonymously'}
                    </button>
                </form>
            </div>
        </div>
    );
};


export default Modal;
