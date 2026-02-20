import React, { useState } from 'react';
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

const Feed = ({ confessions, onReact, categories, activeCategory, onCategoryChange, onSortChange, sortOption, searchQuery = '' }) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const q = searchQuery.trim();

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
            // Search in text or hashtags
            const textMatch = (c.text || '').toLowerCase().includes(query);
            const tagMatch = (c.hashtags || []).some(tag => tag.toLowerCase().includes(query));

            return textMatch || tagMatch;
        })
        .sort((a, b) => {
            const timeA = new Date(a.createdAt || a.timestamp);
            const timeB = new Date(b.createdAt || b.timestamp);
            if (sortOption === 'Newest') return timeB - timeA;
            return timeA - timeB;
        });

    const sortOptions = [
        { label: 'Newest First', value: 'Newest', icon: <ArrowDownCircle size={15} /> },
        { label: 'Oldest First', value: 'Oldest', icon: <ArrowUpCircle size={15} /> },
    ];

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

                    <div className="sort-container">
                        <button
                            className="sort-trigger"
                            onClick={() => setIsSortOpen(!isSortOpen)}
                        >
                            <Clock size={16} className="clock-icon" />
                            <span>{sortOption === 'Newest' ? 'Newest First' : 'Oldest First'}</span>
                            <ChevronDown size={16} className={`chevron ${isSortOpen ? 'open' : ''}`} />
                        </button>

                        {isSortOpen && (
                            <div className="sort-menu">
                                {sortOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        className={`sort-option ${sortOption === opt.value ? 'selected' : ''}`}
                                        onClick={() => {
                                            onSortChange(opt.value);
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        <span className="opt-icon">{opt.icon}</span>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
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
