import React, { useState, useEffect } from 'react';
import ConfessionCard from '../components/ConfessionCard';
import {
    ChevronDown,
    Clock,
    ArrowUpCircle,
    ArrowDownCircle,
    LayoutGrid,
    Globe,
    BookOpen,
    Heart,
    Laugh,
    Flame
} from 'lucide-react';
import './Feed.css';

const Feed = ({ confessions, onReact, categories, activeCategory, onCategoryChange, searchQuery = '' }) => {
    const q = searchQuery.trim();

    // ── Manage scrollbar visibility ──────────────────────────
    useEffect(() => {
        document.body.classList.add('hide-scrollbar');
        document.documentElement.classList.add('hide-scrollbar');
        return () => {
            document.body.classList.remove('hide-scrollbar');
            document.documentElement.classList.remove('hide-scrollbar');
        };
    }, []);

    const getCategoryIcon = (category, isActive) => {
        if (isActive) {
            switch (category) {
                case 'All': return <LayoutGrid size={16} color="#fff" />;
                case 'General': return <Globe size={16} color="#fff" />;
                case 'Study': return <BookOpen size={16} color="#fff" />;
                case 'Crush': return <Heart size={16} color="#fff" fill="#fff" />;
                case 'Funny': return <Laugh size={16} color="#fff" />;
                case 'Rant': return <Flame size={16} color="#fff" />;
                default: return <Globe size={16} color="#fff" />;
            }
        }

        switch (category) {
            case 'All': return <LayoutGrid size={16} color="#64748b" />;
            case 'General': return <Globe size={16} color="#6366f1" />;
            case 'Study': return <BookOpen size={16} color="#3b82f6" />;
            case 'Crush': return <Heart size={16} color="#ec4899" fill="#ec4899" />;
            case 'Funny': return <Laugh size={16} color="#f59e0b" />;
            case 'Rant': return <Flame size={16} color="#ef4444" />;
            default: return <Globe size={16} color="#6366f1" />;
        }
    };

    const filteredConfessions = confessions
        .filter(c => activeCategory === 'All' || c.category === activeCategory)
        .filter(c => {
            if (!q) return true;

            const query = q.toLowerCase();
            // Search specifically for categories starting with the query
            const category = (c.category || '').toLowerCase();
            return category.startsWith(query);
        })
        .sort((a, b) => {
            const timeA = new Date(a.createdAt || a.timestamp);
            const timeB = new Date(b.createdAt || b.timestamp);
            return timeB - timeA; // Default to newest first
        });



    return (
        <div className="feed-container">
            {/* Header — category tabs + sort */}
            <div className="feed-header card">
                <div className="filter-row">
                    <div className="tabs">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`citation ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => onCategoryChange(cat)}
                            >
                                <span className="cat-icon">{getCategoryIcon(cat, activeCategory === cat)}</span>
                                {cat}
                            </button>
                        ))}
                    </div>


                </div>
            </div>

            {/* Search result count indicator */}
            {q && (
                <div className="feed-search-info">
                    🔍 <strong>{filteredConfessions.length}</strong> result{filteredConfessions.length !== 1 ? 's' : ''} for <em>"{searchQuery}"</em>
                </div>
            )}

            {/* Feed List */}
            <div className="feed-list">
                {filteredConfessions.length > 0 ? (
                    filteredConfessions.map(confession => (
                        <ConfessionCard
                            key={confession.id || confession._id}
                            data={confession}
                            onReact={onReact}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <h3>No secrets found 🕵️‍♂️</h3>
                        <p>
                            {q
                                ? `No results for "${searchQuery}". Try different keywords.`
                                : 'Try adjusting your filters.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
