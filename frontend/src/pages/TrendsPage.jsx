import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Heart, MessageCircle, Hash,
    Flame, BarChart2, Award, Zap, Clock, Users
} from 'lucide-react';
import { confessionService } from '../services/api';
import './TrendsPage.css';

/* ── Category palette ─────────────────────────────────── */
const CAT_COLORS = {
    Study: { bg: 'rgba(59, 130, 246, 0.15)', bar: '#3b82f6', text: '#3b82f6' },
    Crush: { bg: 'rgba(236, 72, 153, 0.15)', bar: '#ec4899', text: '#ec4899' },
    Funny: { bg: 'rgba(245, 158, 11, 0.15)', bar: '#f59e0b', text: '#f59e0b' },
    Rant: { bg: 'rgba(239, 68, 68, 0.15)', bar: '#ef4444', text: '#ef4444' },
    General: { bg: 'rgba(139, 92, 246, 0.15)', bar: '#8b5cf6', text: '#8b5cf6' },
};

const CAT_EMOJIS = { Study: '📚', Crush: '💘', Funny: '😂', Rant: '😤', General: '💬' };

const formatNum = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const timeAgo = (iso) => {
    const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

/* ── Mini bar component ─────────────────────────────────── */
const MiniBar = ({ value, max, color }) => (
    <div className="tr-bar-track">
        <div
            className="tr-bar-fill"
            style={{
                width: `${max > 0 ? (value / max) * 100 : 0}%`,
                background: color,
            }}
        />
    </div>
);

/* ===================================================
   TRENDS PAGE
   =================================================== */
const TrendsPage = () => {
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await confessionService.getAll();
                setConfessions(res.data.confessions || []);
            } catch (_) { }
            finally { setLoading(false); }
        };
        load();
    }, []);

    /* ── Derived stats ────────────────────────────────────── */
    const totalConfessions = confessions.length;
    const totalLikes = confessions.reduce((s, c) => s + (c.reactions?.like || 0) + (c.reactions?.love || 0), 0);
    const totalReactions = confessions.reduce((s, c) =>
        s + (c.reactions?.like || 0) + (c.reactions?.love || 0) + (c.reactions?.laugh || 0), 0);

    /* Category breakdown */
    const catMap = {};
    confessions.forEach(c => {
        const cat = c.category || 'General';
        catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const categories = Object.entries(catMap)
        .map(([name, count]) => ({ name, count, pct: Math.round((count / totalConfessions) * 100) || 0 }))
        .sort((a, b) => b.count - a.count);
    const maxCat = categories[0]?.count || 1;

    /* Top trending (most reactions) */
    const trending = [...confessions]
        .sort((a, b) => {
            const ra = (a.reactions?.like || 0) + (a.reactions?.love || 0) + (a.reactions?.laugh || 0);
            const rb = (b.reactions?.like || 0) + (b.reactions?.love || 0) + (b.reactions?.laugh || 0);
            return rb - ra;
        })
        .slice(0, 5);

    /* Trending hashtags */
    const tagMap = {};
    confessions.forEach(c => {
        (c.hashtags || []).forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; });
    });
    const topTags = Object.entries(tagMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12);
    const maxTag = topTags[0]?.[1] || 1;

    /* Activity hours (from createdAt) */
    const hourBuckets = Array(8).fill(0); // 8 3-hour buckets
    confessions.forEach(c => {
        const h = new Date(c.createdAt).getHours();
        hourBuckets[Math.floor(h / 3)]++;
    });
    const HOUR_LABELS = ['12–3am', '3–6am', '6–9am', '9–12pm', '12–3pm', '3–6pm', '6–9pm', '9–12am'];
    const maxHour = Math.max(...hourBuckets, 1);

    if (loading) {
        return (
            <div className="tr-root">
                <div className="tr-loading">
                    <div className="tr-spinner" />
                    <p>Loading campus pulse…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="tr-root">

            {/* ── Page header ── */}
            <div className="tr-header">
                <div className="tr-header-left">
                    <TrendingUp size={26} className="tr-header-icon" />
                    <div>
                        <h1>Campus Pulse</h1>
                        <p>Real-time trends from your anonymous community</p>
                    </div>
                </div>
                <span className="tr-live-badge">
                    <span className="tr-live-dot" />
                    Live
                </span>
            </div>

            {/* ── Stat cards ── */}
            <div className="tr-stat-grid">
                <div className="tr-stat-card tr-stat-purple">
                    <div className="tr-stat-icon"><MessageCircle size={22} /></div>
                    <div className="tr-stat-body">
                        <span className="tr-stat-num">{formatNum(totalConfessions)}</span>
                        <span className="tr-stat-label">Total Secrets</span>
                    </div>
                </div>
                <div className="tr-stat-card tr-stat-pink">
                    <div className="tr-stat-icon"><Heart size={22} /></div>
                    <div className="tr-stat-body">
                        <span className="tr-stat-num">{formatNum(totalLikes)}</span>
                        <span className="tr-stat-label">Hearts Given</span>
                    </div>
                </div>
                <div className="tr-stat-card tr-stat-orange">
                    <div className="tr-stat-icon"><Zap size={22} /></div>
                    <div className="tr-stat-body">
                        <span className="tr-stat-num">{formatNum(totalReactions)}</span>
                        <span className="tr-stat-label">Total Reactions</span>
                    </div>
                </div>
                <div className="tr-stat-card tr-stat-green">
                    <div className="tr-stat-icon"><Hash size={22} /></div>
                    <div className="tr-stat-body">
                        <span className="tr-stat-num">{topTags.length}</span>
                        <span className="tr-stat-label">Trending Tags</span>
                    </div>
                </div>
            </div>

            {/* ── Main grid ── */}
            <div className="tr-grid">

                {/* ── Top trending secrets ── */}
                <div className="tr-panel tr-panel-wide">
                    <div className="tr-panel-head">
                        <Flame size={18} className="tr-icon-orange" />
                        <h2>🔥 Hottest Secrets Right Now</h2>
                    </div>
                    {trending.length === 0 ? (
                        <p className="tr-empty">No confessions yet — be the first!</p>
                    ) : (
                        <div className="tr-trending-list">
                            {trending.map((c, i) => {
                                const totalR = (c.reactions?.like || 0) + (c.reactions?.love || 0) + (c.reactions?.laugh || 0);
                                const col = CAT_COLORS[c.category] || CAT_COLORS.General;
                                return (
                                    <div className="tr-trending-item" key={c._id}>
                                        <span className={`tr-rank tr-rank-${i < 3 ? i + 1 : 'rest'}`}>
                                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                        </span>
                                        <div className="tr-trending-body">
                                            <div className="tr-trending-meta">
                                                <span className="tr-cat-chip" style={{ background: col.bg, color: col.text }}>
                                                    {CAT_EMOJIS[c.category]} {c.category}
                                                </span>
                                                <span className="tr-time"><Clock size={11} /> {timeAgo(c.createdAt)}</span>
                                            </div>
                                            <p className="tr-trending-text">{c.text?.slice(0, 120)}{c.text?.length > 120 ? '…' : ''}</p>
                                        </div>
                                        <div className="tr-trending-reactions">
                                            <span className="tr-r-count">❤️ {c.reactions?.like || 0}</span>
                                            <span className="tr-r-count">😂 {c.reactions?.laugh || 0}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Category breakdown ── */}
                <div className="tr-panel">
                    <div className="tr-panel-head">
                        <BarChart2 size={18} className="tr-icon-purple" />
                        <h2>Category Breakdown</h2>
                    </div>
                    {categories.length === 0 ? (
                        <p className="tr-empty">No data yet</p>
                    ) : (
                        <div className="tr-cat-list">
                            {categories.map(({ name, count, pct }) => {
                                const col = CAT_COLORS[name] || CAT_COLORS.General;
                                return (
                                    <div className="tr-cat-row" key={name}>
                                        <span className="tr-cat-emoji">{CAT_EMOJIS[name]}</span>
                                        <div className="tr-cat-info">
                                            <div className="tr-cat-label-row">
                                                <span className="tr-cat-name">{name}</span>
                                                <span className="tr-cat-pct">{pct}%</span>
                                            </div>
                                            <MiniBar value={count} max={maxCat} color={col.bar} />
                                        </div>
                                        <span className="tr-cat-count">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Activity chart ── */}
                <div className="tr-panel">
                    <div className="tr-panel-head">
                        <Clock size={18} className="tr-icon-blue" />
                        <h2>Peak Activity Hours</h2>
                    </div>
                    <div className="tr-activity-chart">
                        {hourBuckets.map((val, i) => (
                            <div className="tr-hour-col" key={i}>
                                <div className="tr-hour-bar-wrap">
                                    <div
                                        className="tr-hour-bar"
                                        style={{ height: `${(val / maxHour) * 100}%` }}
                                        title={`${val} confessions`}
                                    />
                                </div>
                                <span className="tr-hour-label">{HOUR_LABELS[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Trending Hashtags ── */}
                <div className="tr-panel tr-panel-wide">
                    <div className="tr-panel-head">
                        <Hash size={18} className="tr-icon-green" />
                        <h2>Trending Hashtags</h2>
                    </div>
                    {topTags.length === 0 ? (
                        <p className="tr-empty">No hashtags used yet</p>
                    ) : (
                        <div className="tr-tag-cloud">
                            {topTags.map(([tag, count], i) => {
                                const size = 0.8 + ((count / maxTag) * 0.9);
                                const opacity = 0.5 + ((count / maxTag) * 0.5);
                                return (
                                    <span
                                        key={tag}
                                        className="tr-cloud-tag"
                                        style={{ fontSize: `${size}rem`, opacity }}
                                    >
                                        #{tag}
                                        <span className="tr-cloud-count">{count}</span>
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>{/* end tr-grid */}
        </div>
    );
};

export default TrendsPage;
