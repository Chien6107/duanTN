import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Pagination } from './Pagination';

export function DataTable({
  columns = [],
  data = [],
  searchPlaceholder = 'Tìm kiếm...',
  searchKeys = [], // keys to search by
  actions = null,  // extra header actions, e.g., "Add" button
  itemsPerPage = 5
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filter data based on search term
  const filteredData = data.filter((row) => {
    if (!searchTerm.trim() || searchKeys.length === 0) return true;
    
    return searchKeys.some(key => {
      const val = row[key];
      if (val === undefined || val === null) return false;
      return val.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // 2. Paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset page if filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      {/* Top Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {searchKeys.length > 0 ? (
          <div className="relative flex-1 max-w-md w-full">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm shadow-sm"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        ) : (
          <div></div>
        )}
        
        {actions && <div className="self-end sm:self-auto">{actions}</div>}
      </div>

      {/* Table grid */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                    Không tìm thấy dữ liệu.
                  </td>
                </tr>
              ) : (
                currentItems.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50/50 transition">
                    {columns.map((col, colIdx) => {
                      const value = row[col.accessor];
                      return (
                        <td key={colIdx} className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                          {col.render ? col.render(value, row) : value}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination control */}
      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
