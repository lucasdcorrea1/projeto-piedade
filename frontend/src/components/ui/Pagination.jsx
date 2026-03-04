import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible);

    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-sm text-gray-500">
        <span className="hidden sm:inline">Pagina </span>
        {currentPage + 1} de {totalPages}
      </p>

      {/* Mobile: simplified prev/next */}
      <div className="flex items-center gap-2 sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]"
        >
          <ChevronLeft size={18} className="mr-1" />
          Anterior
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]"
        >
          Proximo
          <ChevronRight size={18} className="ml-1" />
        </button>
      </div>

      {/* Desktop: full pagination */}
      <div className="hidden sm:flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronLeft size={18} />
        </button>

        {pages[0] > 0 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors min-h-[36px]"
            >
              1
            </button>
            {pages[0] > 1 && (
              <span className="px-1 text-gray-400 select-none">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-h-[36px] ${
              page === currentPage
                ? 'bg-blue-800 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page + 1}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages - 1 && (
          <>
            {pages[pages.length - 1] < totalPages - 2 && (
              <span className="px-1 text-gray-400 select-none">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors min-h-[36px]"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
