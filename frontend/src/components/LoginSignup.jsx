import React, { useState, useContext, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './LoginSignup.css';

const LoginSignup = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, signup, error: authError } = useContext(AuthContext);

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });

  // Reset form whenever modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setIsSignup(initialMode === 'signup');
    } else {
      setTimeout(() => {
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setError(''); setSuccess('');
        setShowPassword(false); setShowConfirmPassword(false);
      }, 300);
    }
  }, [isOpen, initialMode]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    // Client-side validation
    if (!formData.email || !formData.password) {
      return setError('Email and password are required.');
    }
    if (isSignup) {
      if (!formData.name.trim()) return setError('Name is required.');
      if (formData.password.length < 6) return setError('Password must be at least 6 characters.');
      if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      if (isSignup) {
        await signup(formData.email, formData.password, formData.name.trim());
        setSuccess('Account created! Welcome to WhisperWall 🎉');
        setTimeout(onClose, 1200);
      } else {
        await login(formData.email, formData.password);
        setSuccess('Welcome back! 👋');
        setTimeout(onClose, 800);
      }
    } catch (err) {
      setError(err?.response?.data?.error || (isSignup ? 'Signup failed. Try again.' : 'Invalid email or password.'));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignup(v => !v);
    setError(''); setSuccess('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false); setShowConfirmPassword(false);
  };

  if (!isOpen) return null;

  return (
    <div className="ls-backdrop" onClick={onClose}>
      <div
        className={`ls-modal ${isOpen ? 'ls-modal-open' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Left decorative panel ── */}
        <div className="ls-left">
          <div className="ls-left-content">
            <div className="ls-logo">
              <Sparkles size={28} />
            </div>
            <h2>WhisperWall</h2>
            <p>Share your secrets anonymously with your campus community.</p>

            <div className="ls-features">
              <div className="ls-feature-item">
                <Shield size={16} />
                <span>100% Anonymous</span>
              </div>
              <div className="ls-feature-item">
                <Sparkles size={16} />
                <span>Campus-only community</span>
              </div>
            </div>
          </div>
          <div className="ls-blob ls-blob-1" />
          <div className="ls-blob ls-blob-2" />
        </div>

        {/* ── Right form panel ── */}
        <div className="ls-right">
          {/* Close button */}
          <button className="ls-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>

          {/* Header */}
          <div className="ls-form-header">
            <h3>{isSignup ? 'Create Account' : 'Welcome Back'}</h3>
            <p>{isSignup ? 'Join your campus community' : 'Sign in to your account'}</p>
          </div>

          {/* Form */}
          <form className="ls-form" onSubmit={handleSubmit} noValidate>

            {/* Name field (signup only) */}
            {isSignup && (
              <div className="ls-field">
                <label htmlFor="ls-name">Full Name</label>
                <div className="ls-input-wrap">
                  <User size={17} className="ls-input-icon" />
                  <input
                    id="ls-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="ls-field">
              <label htmlFor="ls-email">Email Address</label>
              <div className="ls-input-wrap">
                <Mail size={17} className="ls-input-icon" />
                <input
                  id="ls-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="ls-field">
              <label htmlFor="ls-password">Password</label>
              <div className="ls-input-wrap">
                <Lock size={17} className="ls-input-icon" />
                <input
                  id="ls-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  placeholder={isSignup ? 'Min. 6 characters' : 'Enter password'}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="ls-eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (signup only) */}
            {isSignup && (
              <div className="ls-field">
                <label htmlFor="ls-confirm">Confirm Password</label>
                <div className="ls-input-wrap">
                  <Lock size={17} className="ls-input-icon" />
                  <input
                    id="ls-confirm"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="ls-eye-btn"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Error message */}
            {(error || authError) && (
              <div className="ls-error">
                <span>⚠️ {error || authError}</span>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="ls-success">
                <span>✅ {success}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className={`ls-submit ${loading ? 'ls-loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="ls-spinner" />
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>

            {/* Mode toggle */}
            <p className="ls-toggle">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button type="button" className="ls-toggle-btn" onClick={switchMode} disabled={loading}>
                {isSignup ? ' Sign In' : ' Sign Up'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
