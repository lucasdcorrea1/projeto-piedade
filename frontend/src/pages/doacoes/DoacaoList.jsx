import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Calendar, Package, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';

function DoacaoList() {
  const navigate = useNavigate();
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [origem, setOrigem] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoacao, setSelectedDoacao] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchDoacoes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 15 };
      if (dataInicio) params.dataInicio = dataInicio;
      if (dataFim) params.dataFim = dataFim;
      if (origem) params.origem = origem;
      const response = await api.get('/doacoes', { params });
      setDoacoes(response.data.content || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch {
      toast.error('Erro ao carregar doacoes');
    } finally {
      setLoading(false);
    }
  }, [page, dataInicio, dataFim, origem]);

  useEffect(() => {
    fetchDoacoes();
  }, [fetchDoacoes]);

  const handleRemover = async () => {
    if (!selectedDoacao) return;
    try {
      await api.delete(`/doacoes/${selectedDoacao.id}`);
      toast.success('Doacao removida com sucesso');
      fetchDoacoes();
    } catch {
      toast.error('Erro ao remover doacao');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const hasActiveFilters = dataInicio || dataFim || origem;

  const clearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setOrigem('');
    setPage(0);
  };

  const columns = [
    {
      key: 'data',
      label: 'Data',
      sortable: true,
      render: (row) => formatDate(row.data),
    },
    { key: 'origem', label: 'Origem' },
    {
      key: 'itens',
      label: 'Qtd Itens',
      render: (row) => row.itens?.length ?? row.quantidadeItens ?? '--',
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
              navigate(`/doacoes/${row.id}/editar`);
            }}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDoacao(row);
              setModalOpen(true);
            }}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Remover"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const mobileCardRender = (row) => (
    <div className="mobile-card">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
            <Calendar size={16} className="text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{formatDate(row.data)}</p>
            <p className="text-xs text-gray-500">{row.origem || 'Sem origem'}</p>
          </div>
        </div>
        <div className="badge-teal flex-shrink-0">
          <Package size={12} className="mr-1" />
          {row.itens?.length ?? row.quantidadeItens ?? 0} itens
        </div>
      </div>

      {(row.registradoPor?.nome || row.registradoPorNome) && (
        <p className="text-xs text-gray-400 mt-2">
          Por: {row.registradoPor?.nome || row.registradoPorNome}
        </p>
      )}

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => navigate(`/doacoes/${row.id}/editar`)}
          className="flex-1 btn-secondary text-xs py-2 min-h-[40px]"
        >
          <Pencil size={14} className="mr-1.5" />
          Editar
        </button>
        <button
          onClick={() => {
            setSelectedDoacao(row);
            setModalOpen(true);
          }}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Doacoes</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gerenciar doacoes recebidas</p>
        </div>
        <button
          onClick={() => navigate('/doacoes/novo')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Nova Doacao
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
              <div>
                <label htmlFor="origem" className="label-field">
                  Origem
                </label>
                <input
                  id="origem"
                  type="text"
                  value={origem}
                  onChange={(e) => {
                    setOrigem(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Filtrar por origem..."
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
        data={doacoes}
        loading={loading}
        mobileCardRender={mobileCardRender}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleRemover}
        title="Remover Doacao"
        message="Tem certeza que deseja remover esta doacao? Esta acao nao pode ser desfeita."
        confirmLabel="Remover"
        danger
      />
    </div>
  );
}

export default DoacaoList;
