import React, { useState, useEffect, useRef } from 'react';
import { autoReplies } from '../data/dummyContacts';
import './ChatWindow.css';

const ChatWindow = ({ contact, onUpdateContact, onBack }) => {
    const [messages, setMessages] = useState(contact.messages);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Sync messages when contact changes
    useEffect(() => {
        setMessages(contact.messages);
        setIsTyping(false);
    }, [contact.id]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = () => {
        const text = inputText.trim();
        if (!text) return;

        const newMsg = {
            id: Date.now(),
            text,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);
        setInputText('');

        // Show typing indicator after 700ms
        setTimeout(() => {
            setIsTyping(true);
        }, 700);

        // Auto reply after 1.8s
        setTimeout(() => {
            const reply = {
                id: Date.now() + 1,
                text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
                sender: 'them',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setIsTyping(false);
            const withReply = [...updatedMessages, reply];
            setMessages(withReply);
            onUpdateContact(contact.id, reply.text, reply.time);
        }, 1800);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-window">
            {/* Header */}
            <div className="chat-window-header">
                <button className="chat-back-btn" onClick={onBack} title="Back to contacts">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                </button>
                <div className="chat-header-avatar-wrap">
                    <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="chat-header-avatar"
                        onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/thumbs/svg?seed=${contact.id}`; }}
                    />
                    {contact.online && <span className="header-online-dot" />}
                </div>
                <div className="chat-header-info">
                    <span className="chat-header-name">{contact.name}</span>
                    <span className="chat-header-status">
                        {contact.online ? '● Online' : '○ Offline'}
                    </span>
                </div>
                <div className="chat-header-actions">
                    <button className="header-action-btn" title="Call">📞</button>
                    <button className="header-action-btn" title="Video">📹</button>
                    <button className="header-action-btn" title="More">⋮</button>
                </div>
            </div>

            {/* Messages */}
            <div className="messages-area">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`message-bubble-wrap ${msg.sender === 'me' ? 'sent' : 'received'}`}
                    >
                        <div className={`message-bubble ${msg.sender === 'me' ? 'bubble-sent' : 'bubble-received'}`}>
                            <span className="bubble-text">{msg.text}</span>
                            <span className="bubble-time">{msg.time}</span>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="message-bubble-wrap received">
                        <div className="message-bubble bubble-received typing-bubble">
                            <span className="typing-dots">
                                <span />
                                <span />
                                <span />
                            </span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className={`send-btn ${inputText.trim() ? 'active' : ''}`}
                    onClick={sendMessage}
                    disabled={!inputText.trim()}
                >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
