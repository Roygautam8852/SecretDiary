import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './Filters.css';

const Filters = ({ selectedCategory, selectedSort, onCategoryChange, onSortChange }) => {
  const categories = ['All', 'General', 'Crush', 'Study', 'Funny', 'Rant'];
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'trending', label: 'Trending' },
    { value: 'oldest', label: 'Oldest' },
  ];

  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSortSelect = (value) => {
    onSortChange(value);
    setIsSortOpen(false);
  };

  const currentSortLabel = sortOptions.find(opt => opt.value === selectedSort)?.label || 'Sort By';

  return (
    <div className="filters-container">
      <div className="filters-row">
        <div className="category-scroll">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="sort-wrapper" ref={dropdownRef}>
          <button
            className={`custom-select-trigger ${isSortOpen ? 'open' : ''}`}
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            <span>{currentSortLabel}</span>
            <ChevronDown size={16} className={`chevron ${isSortOpen ? 'rotate' : ''}`} />
          </button>

          {isSortOpen && (
            <div className="custom-options">
              {sortOptions.map((option) => (
                <div
                  key={option.value}
                  className={`custom-option ${selectedSort === option.value ? 'selected' : ''}`}
                  onClick={() => handleSortSelect(option.value)}
                >
                  {option.label}
                  {selectedSort === option.value && <Check size={14} className="check-icon" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
