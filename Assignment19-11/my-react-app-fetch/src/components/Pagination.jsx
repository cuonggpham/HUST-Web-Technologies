import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Trước
      </button>
      
      {currentPage > 3 && (
        <>
          <button className="pagination-btn" onClick={() => onPageChange(1)}>
            1
          </button>
          {currentPage > 4 && <span className="pagination-dots">...</span>}
        </>
      )}
      
      {getPageNumbers().map(page => (
        <button
          key={page}
          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <span className="pagination-dots">...</span>}
          <button className="pagination-btn" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}
      
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Sau
      </button>
    </div>
  );
};

export default Pagination;
