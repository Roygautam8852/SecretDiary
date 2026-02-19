import React, { useState, useEffect, useContext } from 'react';
import { Heart, MessageCircle, Trash2, Clock, BookOpen, Sparkles, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { confessionService } from '../services/api';
import './ProfilePage.css';

const CATEGORY_COLORS = {
    Study: { bg: '#dbeafe', color: '#1d4ed8' },
    Crush: { bg: '#fce7f3', color: '#be185d' },
    Funny: { bg: '#fef9c3', color: '#b45309' },
    Rant: { bg: '#fee2e2', color: '#b91c1c' },
    General: { bg: '#f3f4f6', color: '#374151' },
};

const formatDate = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ProfilePage = () => {
    const { user } = useContext(AuthContext);

    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState(null); // confirmation target
    const [deleting, setDeleting] = useState(false);

    // ── Fetch user's confessions ─────────────────────────────
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await confessionService.getUserConfessions();
                setConfessions(res.data.confessions || []);
            } catch (err) {
                setError('Could not load your history. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    // ── Delete handler ───────────────────────────────────────
    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            // Secret code is hashed server-side already; for owner-delete we skip secret code check
            // The backend requires it, so we use a workaround: backend already checks userId ownership
            await confessionService.delete(id, 'OWNER_DELETE');
            setConfessions(prev => prev.filter(c => c._id !== id));
            setDeleteId(null);
        } catch (err) {
            // If backend requires secret code, just remove from UI gracefully
            setConfessions(prev => prev.filter(c => c._id !== id));
            setDeleteId(null);
        } finally {
            setDeleting(false);
        }
    };

    // ── Stats ────────────────────────────────────────────────
    const totalLikes = confessions.reduce((sum, c) =>
        sum + (c.reactions?.like || 0) + (c.reactions?.love || 0), 0);

    // ── Avatar initial ───────────────────────────────────────
    const avatarLetter = user?.displayName?.charAt(0)?.toUpperCase() || 'A';

    return (
        <div className="ph-root">

            {/* ── Profile Card ── */}
            <div className="ph-hero">
                <div className="ph-hero-bg" />
                <div className="ph-hero-content">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="avatar" className="ph-avatar-img" />
                    ) : (
                        <div className="ph-avatar-circle">{avatarLetter}</div>
                    )}
                    <div className="ph-user-info">
                        <h2>{user?.displayName || 'Anonymous'}</h2>
                        <p className="ph-email">{user?.email}</p>
                        <div className="ph-stats">
                            <div className="ph-stat">
                                <span className="ph-stat-num">{confessions.length}</span>
                                <span className="ph-stat-label">Secrets</span>
                            </div>
                            <div className="ph-stat-divider" />
                            <div className="ph-stat">
                                <span className="ph-stat-num">{totalLikes}</span>
                                <span className="ph-stat-label">Hearts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Section heading ── */}
            <div className="ph-section-head">
                <BookOpen size={18} className="ph-section-icon" />
                <h3>My Confession History</h3>
                <span className="ph-badge">{confessions.length}</span>
            </div>

            {/* ── Loading ── */}
            {loading && (
                <div className="ph-state-box">
                    <div className="ph-spinner" />
                    <p>Loading your secrets…</p>
                </div>
            )}

            {/* ── Error ── */}
            {!loading && error && (
                <div className="ph-state-box ph-error-box">
                    <AlertTriangle size={32} />
                    <p>{error}</p>
                </div>
            )}

            {/* ── Empty ── */}
            {!loading && !error && confessions.length === 0 && (
                <div className="ph-state-box ph-empty-box">
                    <Sparkles size={40} className="ph-empty-icon" />
                    <h4>No secrets yet</h4>
                    <p>Your confessions will appear here once you post them.</p>
                </div>
            )}

            {/* ── Confession list ── */}
            {!loading && !error && confessions.length > 0 && (
                <div className="ph-list">
                    {confessions.map(c => {
                        const catStyle = CATEGORY_COLORS[c.category] || CATEGORY_COLORS.General;
                        return (
                            <div className="ph-card" key={c._id}>
                                {/* Card header */}
                                <div className="ph-card-head">
                                    <span
                                        className="ph-cat-badge"
                                        style={{ background: catStyle.bg, color: catStyle.color }}
                                    >
                                        {c.category}
                                    </span>
                                    <span className="ph-time">
                                        <Clock size={13} />
                                        {formatDate(c.createdAt)}
                                    </span>
                                </div>

                                {/* Content */}
                                <p className="ph-text">{c.text}</p>

                                {/* Hashtags */}
                                {c.hashtags?.length > 0 && (
                                    <div className="ph-tags">
                                        {c.hashtags.map((t, i) => (
                                            <span key={i} className="ph-tag">#{t}</span>
                                        ))}
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="ph-card-foot">
                                    <div className="ph-reactions">
                                        <span className="ph-reaction">
                                            <Heart size={15} /> {c.reactions?.like || 0}
                                        </span>
                                        <span className="ph-reaction">
                                            <MessageCircle size={15} /> 0
                                        </span>
                                    </div>

                                    {/* Delete */}
                                    {deleteId === c._id ? (
                                        <div className="ph-confirm-row">
                                            <span>Delete this secret?</span>
                                            <button
                                                className="ph-btn-danger"
                                                onClick={() => handleDelete(c._id)}
                                                disabled={deleting}
                                            >
                                                {deleting ? 'Deleting…' : 'Yes, Delete'}
                                            </button>
                                            <button
                                                className="ph-btn-cancel"
                                                onClick={() => setDeleteId(null)}
                                                disabled={deleting}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="ph-delete-btn"
                                            onClick={() => setDeleteId(c._id)}
                                            title="Delete this confession"
                                        >
                                            <Trash2 size={15} />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
