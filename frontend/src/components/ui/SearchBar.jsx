import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

function SearchBar({ placeholder = 'Buscar...', onSearch, value = '' }) {
  const [term, setTerm] = useState(value);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setTerm(value);
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onSearch(term);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [term, onSearch]);

  const handleClear = () => {
    setTerm('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative transition-all duration-200 ${focused ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search size={18} className={`transition-colors duration-200 ${focused ? 'text-blue-500' : 'text-gray-400'}`} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="input-field pl-10 pr-10 focus:ring-0"
      />
      {term && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-2 flex items-center min-w-[44px] justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <div className="p-1 rounded-full hover:bg-gray-100">
            <X size={16} />
          </div>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
