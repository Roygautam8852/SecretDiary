import React, { useState, useContext } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './ConfessionCard.css';

const ConfessionCard = ({ data, onReact }) => {
  const { user } = useContext(AuthContext);

  // Normalize data from API or static JSON
  let content = data.text || data.content || '';
  const category = data.category || 'General';
  const hashtags = data.hashtags || [];

  // Clean content: Remove trailing hashtags that are already being shown as badges
  // This prevents the "redundancy" the user complained about
  const cleanContent = content.replace(/(#\w+\s*)+$/, '').trim();

  const timestamp = data.createdAt || data.timestamp;
  const authorName = data.userId?.displayName || data.author || 'Anonymous';
  const authorAvatar = data.userId?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;

  // Reactions logic
  const likesCount = data.reactions?.like || data.likes || 0;
  const commentsCount = data.comments || 0;

  // Check if current user liked this (for real API data)
  const isInitiallyLiked = data.userReactions?.some(r => r.userId === user?._id && r.reactionType === 'like') || data.isLiked || false;

  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [localLikes, setLocalLikes] = useState(likesCount);

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLocalLikes(newLiked ? localLikes + 1 : localLikes - 1);
    onReact(data._id || data.id, newLiked ? 'like' : 'unlike');
  };

  const timeString = timestamp ? new Date(timestamp).toLocaleDateString() + ' • ' + new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';

  return (
    <div className="confession-card">
      <div className="card-header">
        <div className="user-info">
          <div className="avatar-circle">
            <img src={authorAvatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          </div>
          <div className="meta-info">
            <h4>{authorName}</h4>
            <span className="timestamp">{timeString}</span>
          </div>
        </div>
        <span className={`tag ${category.toLowerCase()}`}>
          {category}
        </span>
      </div>

      <div className="card-body">
        <p>{cleanContent}</p>
        <div className="hashtags">
          {hashtags.map((tag, idx) => (
            <span key={idx} className="hashtag">{tag.startsWith('#') ? tag : `#${tag}`}</span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <div className="actions">
          <button
            className={`action-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            <span>{localLikes}</span>
          </button>

          <button className="action-btn">
            <MessageCircle size={18} />
            <span>{commentsCount}</span>
          </button>
        </div>

        <button className="share-btn">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConfessionCard;

