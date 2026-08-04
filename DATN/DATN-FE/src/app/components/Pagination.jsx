import React from 'react';

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 8;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center pt-4 border-t border-gray-100 mt-6 w-full">
      <div className="flex items-center space-x-1.5 text-sm font-semibold">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
        >
          Trước
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition ${
              currentPage === page
                ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow"
                : "border border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
