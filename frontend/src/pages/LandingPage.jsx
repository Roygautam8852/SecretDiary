import React from 'react';
import { Sparkles, Shield, Users, TrendingUp, MessageCircle, Lock } from 'lucide-react';
import { authService } from '../services/api';
import './LandingPage.css';

/* Official Google 'G' SVG ——————————————————————————————— */
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285F4" d="M46.145 24.5c0-1.555-.14-3.05-.4-4.5H24v8.51h12.44c-.536 2.89-2.168 5.34-4.618 6.98v5.8h7.478c4.38-4.03 6.845-9.97 6.845-16.79z" />
        <path fill="#34A853" d="M24 47c6.24 0 11.47-2.07 15.3-5.61l-7.478-5.8c-2.07 1.39-4.72 2.21-7.822 2.21-6.015 0-11.11-4.06-12.93-9.52H3.39v5.99C7.21 42.54 15.02 47 24 47z" />
        <path fill="#FBBC05" d="M11.07 28.28A14.85 14.85 0 0 1 10.5 24c0-1.49.258-2.94.57-4.28v-5.99H3.39A23.94 23.94 0 0 0 0 24c0 3.87.928 7.53 2.572 10.77l8.498-6.49z" />
        <path fill="#EA4335" d="M24 9.5c3.39 0 6.43 1.166 8.82 3.455l6.61-6.61C35.46 2.49 30.24 0 24 0 15.02 0 7.21 4.46 3.39 10.27l8.68 6.45C13.89 11.56 18.985 9.5 24 9.5z" />
    </svg>
);

const handleGoogleLogin = () => {
    authService.googleLogin(); // redirects to /auth/google on the backend
};

const LandingPage = () => {
    const features = [
        { icon: <Shield size={22} />, title: 'Fully Anonymous', desc: 'Your identity is always protected. No real names, ever.' },
        { icon: <Users size={22} />, title: 'Campus Community', desc: 'Connect with real students from your campus effortlessly.' },
        { icon: <TrendingUp size={22} />, title: 'Trending Secrets', desc: "Discover what's buzzing around your campus right now." },
        { icon: <MessageCircle size={22} />, title: 'Real Reactions', desc: 'Like, comment and share secrets that resonate with you.' },
    ];

    return (
        <div className="landing-root">

            {/* ── Navbar ── */}
            <header className="landing-nav">
                <div className="landing-nav-brand">
                    <div className="landing-brand-icon"><Sparkles size={18} /></div>
                    <span>WhisperWall</span>
                </div>
                {/* Single Google sign-in in the navbar */}
                <button className="google-btn google-btn-sm" onClick={handleGoogleLogin}>
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                </button>
            </header>

            {/* ── Hero ── */}
            <section className="landing-hero">
                <div className="land-blob land-blob-a" />
                <div className="land-blob land-blob-b" />
                <div className="land-blob land-blob-c" />

                <div className="hero-content">
                    <div className="hero-badge">
                        <Lock size={13} />
                        <span>100% Anonymous · Campus Only</span>
                    </div>

                    <h1 className="hero-title">
                        Your Campus.<br />
                        <span className="hero-gradient">Your Secrets.</span><br />
                        Your Safe Space.
                    </h1>

                    <p className="hero-subtitle">
                        Share confessions, crushes, rants, and laughs anonymously
                        with your campus community — completely safe and judgment-free.
                    </p>

                    {/* Primary Google CTA */}
                    <div className="hero-ctas">
                        <button className="google-btn google-btn-lg" onClick={handleGoogleLogin}>
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </button>
                        <p className="hero-cta-note">
                            🔒 Your Google identity stays private — we only use it to verify you're real.
                        </p>
                    </div>

                    {/* Floating preview cards */}
                    <div className="hero-preview">
                        <div className="preview-card">
                            <div className="preview-card-header">
                                <div className="preview-avatar">A</div>
                                <div>
                                    <p className="preview-name">Anon #4291</p>
                                    <p className="preview-time">Just now</p>
                                </div>
                                <span className="preview-tag crush">Crush</span>
                            </div>
                            <p className="preview-text">
                                To the person who always saves me a seat in the 9 AM lecture —
                                I look forward to it every single day 🥺
                            </p>
                            <div className="preview-footer">
                                <span>❤️ 128</span>
                                <span>💬 34</span>
                                <span>#crush #campus</span>
                            </div>
                        </div>

                        <div className="preview-card preview-card-2">
                            <div className="preview-card-header">
                                <div className="preview-avatar study">S</div>
                                <div>
                                    <p className="preview-name">Anon #7823</p>
                                    <p className="preview-time">5m ago</p>
                                </div>
                                <span className="preview-tag study">Study</span>
                            </div>
                            <p className="preview-text">
                                I've been studying the wrong syllabus for 3 weeks 😭 finals are next week
                            </p>
                            <div className="preview-footer">
                                <span>❤️ 94</span>
                                <span>💬 21</span>
                                <span>#fail #help</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="landing-features">
                <h2 className="features-title">Why WhisperWall?</h2>
                <p className="features-subtitle">Everything you need to share freely and safely.</p>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div className="feature-card" key={i}>
                            <div className="feature-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="landing-cta-banner">
                <div className="land-blob land-blob-d" />
                <h2>Ready to whisper your secret?</h2>
                <p>Join thousands of students sharing anonymously. No sign of your real identity — ever.</p>
                <button className="google-btn google-btn-white" onClick={handleGoogleLogin}>
                    <GoogleIcon />
                    <span>Sign in with Google — It's Free</span>
                </button>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <span>© 2024 WhisperWall · Anonymous Campus Confessions</span>
            </footer>
        </div>
    );
};

export default LandingPage;
