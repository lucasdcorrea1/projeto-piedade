import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, RefreshCw, Calendar, User, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
  { value: 'ENTREGUE', label: 'Entregue' },
  { value: 'CANCELADA', label: 'Cancelada' },
];

const STATUS_BADGE = {
  PENDENTE: 'badge-yellow',
  EM_ANDAMENTO: 'badge-blue',
  ENTREGUE: 'badge-green',
  CANCELADA: 'badge-red',
};

const STATUS_LABELS = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em Andamento',
  ENTREGUE: 'Entregue',
  CANCELADA: 'Cancelada',
};

function EntregaList() {
  const navigate = useNavigate();
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedEntrega, setSelectedEntrega] = useState(null);
  const [novoStatus, setNovoStatus] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchEntregas = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 15 };
      if (statusFilter) params.status = statusFilter;
      if (dataInicio) params.dataInicio = dataInicio;
      if (dataFim) params.dataFim = dataFim;
      const response = await api.get('/entregas', { params });
      setEntregas(response.data.content || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch {
      toast.error('Erro ao carregar entregas');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, dataInicio, dataFim]);

  useEffect(() => {
    fetchEntregas();
  }, [fetchEntregas]);

  const handleAlterarStatus = async () => {
    if (!selectedEntrega || !novoStatus) return;
    try {
      await api.patch(`/entregas/${selectedEntrega.id}/status`, {
        status: novoStatus,
      });
      toast.success('Status atualizado com sucesso');
      fetchEntregas();
    } catch {
      toast.error('Erro ao alterar status');
    }
  };

  const openStatusPicker = (entrega) => {
    setSelectedEntrega(entrega);
    setNovoStatus(entrega.status || 'PENDENTE');
    setStatusModalOpen(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const hasActiveFilters = statusFilter || dataInicio || dataFim;

  const clearFilters = () => {
    setStatusFilter('');
    setDataInicio('');
    setDataFim('');
    setPage(0);
  };

  const columns = [
    {
      key: 'data',
      label: 'Data',
      sortable: true,
      render: (row) => formatDate(row.data),
    },
    {
      key: 'fiel',
      label: 'Fiel',
      render: (row) => row.fiel?.nome || row.fielNome || '--',
    },
    {
      key: 'itens',
      label: 'Qtd Itens',
      render: (row) => row.itens?.length ?? row.quantidadeItens ?? '--',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const status = row.status || 'PENDENTE';
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openStatusPicker(row);
            }}
            className={`${STATUS_BADGE[status] || 'badge-gray'} cursor-pointer hover:opacity-80 transition-opacity`}
          >
            {STATUS_LABELS[status] || status}
          </button>
        );
      },
    },
    {
      key: 'registradoPor',
      label: 'Registrado Por',
      render: (row) => row.registradoPor?.nome || row.registradoPorNome || '--',
    },
    {
      key: 'acoes',
      label: 'Acoes',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/entregas/${row.id}/editar`);
            }}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openStatusPicker(row);
            }}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Alterar Status"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      ),
    },
  ];

  const mobileCardRender = (row) => {
    const status = row.status || 'PENDENTE';
    return (
      <div className="mobile-card">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Calendar size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{formatDate(row.data)}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <User size={11} />
                <span className="truncate">{row.fiel?.nome || row.fielNome || '--'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => openStatusPicker(row)}
            className={`${STATUS_BADGE[status] || 'badge-gray'} cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0`}
          >
            {STATUS_LABELS[status] || status}
          </button>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {row.itens?.length ?? row.quantidadeItens ?? 0} itens
            {(row.registradoPor?.nome || row.registradoPorNome) && (
              <span> &middot; {row.registradoPor?.nome || row.registradoPorNome}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(`/entregas/${row.id}/editar`)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => openStatusPicker(row)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Entregas</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gerenciar entregas realizadas</p>
        </div>
        <button
          onClick={() => navigate('/entregas/novo')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Nova Entrega
        </button>
      </div>

      {/* Filters */}
      <div className="card !p-0 overflow-hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center justify-between w-full px-4 py-3 min-h-[48px]"
        >
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Filtros</span>
            {hasActiveFilters && (
              <span className="badge-blue text-[10px]">Ativo</span>
            )}
          </div>
          {filtersOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>

        {filtersOpen && (
          <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="statusFilter" className="label-field">
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                  className="input-field"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dataInicio" className="label-field">
                  Data Inicio
                </label>
                <input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => {
                    setDataInicio(e.target.value);
                    setPage(0);
                  }}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="dataFim" className="label-field">
                  Data Fim
                </label>
                <input
                  id="dataFim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => {
                    setDataFim(e.target.value);
                    setPage(0);
                  }}
                  className="input-field"
                />
              </div>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      <Table
        columns={columns}
        data={entregas}
        loading={loading}
        mobileCardRender={mobileCardRender}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Status Change Modal */}
      <Modal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleAlterarStatus}
        title="Alterar Status da Entrega"
        confirmLabel="Alterar"
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Selecione o novo status para a entrega:
          </p>
          <div className="space-y-2">
            {STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setNovoStatus(opt.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all min-h-[48px] ${
                  novoStatus === opt.value
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className={STATUS_BADGE[opt.value]}>{opt.label}</span>
                {novoStatus === opt.value && (
                  <span className="ml-auto text-blue-600 text-xs font-medium">Selecionado</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EntregaList;
