import React, { useContext } from 'react';
import { Home, User, BarChart2, Plus, LogOut, Settings, MessageCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ activeTab, onTabChange, onCreateClick }) => {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try { await logout(); } catch (e) { /* ignore */ }
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="sidebar-desktop">

                <nav className="nav-menu">
                    <button
                        className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
                        onClick={() => onTabChange('feed')}
                    >
                        <Home size={20} />
                        <span>Campus Feed</span>
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => onTabChange('profile')}
                    >
                        <User size={20} />
                        <span>My History</span>
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'trends' ? 'active' : ''}`}
                        onClick={() => onTabChange('trends')}
                    >
                        <BarChart2 size={20} />
                        <span>Trends</span>
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
                        onClick={() => onTabChange('chats')}
                    >
                        <MessageCircle size={20} />
                        <span>Chats</span>
                    </button>

                    <div className="divider"></div>
                </nav>

                <div className="sidebar-footer">
                    <button className="write-btn" onClick={onCreateClick}>
                        <Plus size={18} />
                        Write Secret
                    </button>

                    {/* User Card — shown when logged in */}
                    {user ? (
                        <div className="user-card">
                            <div className="user-avatar-container">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.displayName} className="user-card-avatar" />
                                ) : (
                                    <div className="user-card-initials">
                                        {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            {/* Name + Status */}
                            <div className="user-card-text">
                                <p className="user-card-name">{user.displayName || 'Anonymous'}</p>
                                <div className="user-status-sidebar">
                                    <span className="status-dot-mini"></span>
                                    <span className="status-text-mini">Online</span>
                                </div>
                            </div>
                            {/* Logout Icon Button */}
                            <button className="user-card-logout" onClick={handleLogout} title="Logout">
                                <LogOut size={17} />
                            </button>
                        </div>
                    ) : null /* nothing shown in footer when logged out */}
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-nav">
                <button
                    className={`mobile-item ${activeTab === 'feed' ? 'active' : ''}`}
                    onClick={() => onTabChange('feed')}
                >
                    <Home size={24} />
                    <span>Feed</span>
                </button>

                <button
                    className={`mobile-item ${activeTab === 'trends' ? 'active' : ''}`}
                    onClick={() => onTabChange('trends')}
                >
                    <BarChart2 size={24} />
                    <span>Trends</span>
                </button>

                <div className="mobile-fab-container">
                    <button className="mobile-fab" onClick={onCreateClick}>
                        <Plus size={28} />
                    </button>
                </div>

                <button
                    className={`mobile-item ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => onTabChange('profile')}
                >
                    <User size={24} />
                    <span>Profile</span>
                </button>

                <button
                    className={`mobile-item ${activeTab === 'chats' ? 'active' : ''}`}
                    onClick={() => onTabChange('chats')}
                >
                    <MessageCircle size={24} />
                    <span>Chats</span>
                </button>
            </nav>
        </>
    );
};

export default Sidebar;
