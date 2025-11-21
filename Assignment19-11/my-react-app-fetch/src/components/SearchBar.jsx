import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm theo name"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      {searchTerm && (
        <button 
          className="btn-clear-search"
          onClick={() => onSearchChange('')}
        >
          Xóa
        </button>
      )}
    </div>
  );
};

export default SearchBar;
