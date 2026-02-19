import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  Bell, LogIn, UserPlus, X,
  User, Settings, LogOut, Mail, Sun, Moon
} from 'lucide-react';
import LoginSignup from './LoginSignup';
import './Navbar.css';

const Navbar = ({ onConfessClick, searchQuery = '', onSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginMode, setLoginMode] = useState('login');

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Scroll listener to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      // ignore
    }
    setIsProfileOpen(false);
  };

  const openLogin = () => {
    setLoginMode('login');
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setLoginMode('signup');
    setIsLoginOpen(true);
  };

  const notifications = [
    { id: 1, text: 'Someone liked your confession', time: '2m ago', unread: true },
    { id: 2, text: 'New comment on your post', time: '15m ago', unread: true },
    { id: 3, text: 'Your confession trended today!', time: '1h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner">

          {/* ── Brand ── */}
          <div className="navbar-brand">
            <div className="brand-icon">
              <Mail size={20} />
            </div>
            <span className="brand-name">WhisperWall</span>
          </div>

          {/* ── Search Bar ── */}
          <div className="navbar-search">
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search secrets, hashtags…"
                value={searchQuery}
                onChange={(e) => onSearch && onSearch(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => onSearch && onSearch('')}>
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* ── Right Controls ── */}
          <div className="navbar-actions">

            {/* Notification Bell */}
            <div className="notif-wrapper" ref={notifRef}>
              <button
                className={`icon-btn ${isNotifOpen ? 'active' : ''}`}
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </button>

              {isNotifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <span>Notifications</span>
                    <button className="mark-read-btn">Mark all read</button>
                  </div>
                  <div className="notif-list">
                    {notifications.map(n => (
                      <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                        <div className="notif-dot" />
                        <div className="notif-content">
                          <p>{n.text}</p>
                          <span>{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="notif-footer">
                    <button className="view-all-btn">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons or User Menu */}
            {user ? (
              <div className="user-dropdown-wrapper" ref={profileRef}>
                <button
                  className={`user-avatar-btn ${isProfileOpen ? 'active' : ''}`}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.displayName} className="avatar-img" />
                  ) : (
                    <div className="avatar-initials">
                      {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="avatar-initials sm">
                        {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="user-name">{user.displayName}</p>
                        <p className="user-email">{user.email}</p>
                        <div className="user-status">
                          <span className="status-dot"></span>
                          <span className="status-text">Online</span>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-btns">
                <button className="btn-login" onClick={openLogin}>
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
                <button className="btn-signup" onClick={openSignup}>
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Login/Signup Modal */}
      <LoginSignup
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
};

export default Navbar;
