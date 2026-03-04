import { ChevronUp, ChevronDown } from 'lucide-react';

function Table({ columns, data, sortField, sortDirection, onSort, onRowClick, loading, mobileCardRender }) {
  const handleSort = (field) => {
    if (onSort && field) {
      onSort(field);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-gray-400 text-sm">Nenhum registro encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      {mobileCardRender && (
        <div className="md:hidden space-y-3">
          {data.map((row, rowIndex) => (
            <div
              key={row.id || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {mobileCardRender(row)}
            </div>
          ))}
        </div>
      )}

      {/* Desktop table view (or fallback if no mobileCardRender) */}
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${mobileCardRender ? 'hidden md:block' : ''}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key || col.label}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                      col.sortable ? 'cursor-pointer select-none hover:bg-gray-100 transition-colors' : ''
                    } ${col.className || ''}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && sortField === col.key && (
                        sortDirection === 'asc' ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={`hover:bg-gray-50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key || col.label}
                      className={`px-4 py-3 text-sm text-gray-700 whitespace-nowrap ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Table;
