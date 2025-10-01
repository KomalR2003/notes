// components/SearchBar.jsx - Responsive
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = 'Search notes...' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ml-2 sm:ml-3 flex-shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2 px-2 sm:px-3 focus:outline-none text-xs sm:text-sm"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="p-2 hover:bg-gray-100 transition-colors flex-shrink-0"
            title="Clear search"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="absolute top-full mt-1 text-xs text-gray-500 ml-1">
          Searching for: "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;