import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, History, UserX, Phone, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';

function FielList() {
  const navigate = useNavigate();
  const [fieis, setFieis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFiel, setSelectedFiel] = useState(null);

  // Historico state
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [historicoFiel, setHistoricoFiel] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [historicoLoading, setHistoricoLoading] = useState(false);

  // Filters
  const [filterCidade, setFilterCidade] = useState('');
  const [filterBairro, setFilterBairro] = useState('');

  const fetchFieis = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 15 };
      if (search) params.nome = search;
      if (filterCidade) params.cidade = filterCidade;
      if (filterBairro) params.bairro = filterBairro;
      const response = await api.get('/fieis', { params });
      setFieis(response.data.content || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch {
      toast.error('Erro ao carregar fieis');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCidade, filterBairro]);

  useEffect(() => {
    fetchFieis();
  }, [fetchFieis]);

  const handleSearch = useCallback((term) => {
    setSearch(term);
    setPage(0);
  }, []);

  const handleInativar = async () => {
    if (!selectedFiel) return;
    try {
      await api.delete(`/fieis/${selectedFiel.id}`);
      toast.success('Fiel inativado com sucesso');
      fetchFieis();
    } catch {
      toast.error('Erro ao inativar fiel');
    }
  };

  const openHistorico = async (fiel) => {
    setHistoricoFiel(fiel);
    setHistoricoOpen(true);
    setHistoricoLoading(true);
    try {
      const response = await api.get(`/fieis/${fiel.id}/historico`);
      setHistorico(Array.isArray(response.data) ? response.data : response.data?.content || []);
    } catch {
      toast.error('Erro ao carregar historico');
      setHistorico([]);
    } finally {
      setHistoricoLoading(false);
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

  const getBairro = (row) => row.endereco?.bairro || row.bairro || '--';
  const getCidade = (row) => row.endereco?.cidade || row.cidade || '--';

  const columns = [
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'telefone', label: 'Telefone' },
    {
      key: 'bairro',
      label: 'Bairro',
      render: (row) => getBairro(row),
    },
    {
      key: 'cidade',
      label: 'Cidade',
      render: (row) => getCidade(row),
    },
    { key: 'congregacao', label: 'Congregacao' },
    {
      key: 'ativo',
      label: 'Status',
      render: (row) => (
        <span className={row.ativo !== false ? 'badge-green' : 'badge-red'}>
          {row.ativo !== false ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      key: 'acoes',
      label: 'Acoes',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/fieis/${row.id}/editar`);
            }}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openHistorico(row);
            }}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Historico"
          >
            <History size={16} />
          </button>
          {row.ativo !== false && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFiel(row);
                setModalOpen(true);
              }}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Inativar"
            >
              <UserX size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const mobileCardRender = (row) => (
    <div className="mobile-card">
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{row.nome}</p>
          {row.congregacao && (
            <p className="text-xs text-gray-500 mt-0.5">{row.congregacao}</p>
          )}
        </div>
        <span className={`${row.ativo !== false ? 'badge-green' : 'badge-red'} ml-2 flex-shrink-0`}>
          {row.ativo !== false ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div className="space-y-1.5 mt-3">
        {row.telefone && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone size={13} className="text-gray-400 flex-shrink-0" />
            <span>{row.telefone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <MapPin size={13} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{getBairro(row)} - {getCidade(row)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => navigate(`/fieis/${row.id}/editar`)}
          className="flex-1 btn-secondary text-xs py-2 min-h-[40px]"
        >
          <Pencil size={14} className="mr-1.5" />
          Editar
        </button>
        <button
          onClick={() => openHistorico(row)}
          className="flex-1 btn-secondary text-xs py-2 min-h-[40px]"
        >
          <History size={14} className="mr-1.5" />
          Historico
        </button>
        {row.ativo !== false && (
          <button
            onClick={() => {
              setSelectedFiel(row);
              setModalOpen(true);
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <UserX size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Fieis</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Gerenciar cadastro de fieis
          </p>
        </div>
        <button
          onClick={() => navigate('/fieis/novo')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Novo Fiel
        </button>
      </div>

      {/* Search and filters */}
      <div className="space-y-3">
        <SearchBar
          placeholder="Buscar por nome..."
          onSearch={handleSearch}
          value={search}
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={filterCidade}
            onChange={(e) => { setFilterCidade(e.target.value); setPage(0); }}
            placeholder="Filtrar cidade..."
            className="input-field text-xs flex-1"
          />
          <input
            type="text"
            value={filterBairro}
            onChange={(e) => { setFilterBairro(e.target.value); setPage(0); }}
            placeholder="Filtrar bairro..."
            className="input-field text-xs flex-1"
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={fieis}
        loading={loading}
        mobileCardRender={mobileCardRender}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Inativar Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleInativar}
        title="Inativar Fiel"
        message={`Tem certeza que deseja inativar o fiel "${selectedFiel?.nome}"? Esta acao pode ser revertida.`}
        confirmLabel="Inativar"
        danger
      />

      {/* Historico Slide-over */}
      {historicoOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setHistoricoOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white shadow-2xl animate-slide-up sm:animate-fade-in overflow-y-auto z-10">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Historico de Entregas</h3>
                <p className="text-sm text-gray-500">{historicoFiel?.nome}</p>
              </div>
              <button
                onClick={() => setHistoricoOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              {historicoLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : historico.length > 0 ? (
                <div className="space-y-3">
                  {historico.map((entrega, index) => (
                    <div key={entrega.id || index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(entrega.data)}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          entrega.status === 'ENTREGUE' ? 'bg-emerald-100 text-emerald-800' :
                          entrega.status === 'PENDENTE' ? 'bg-amber-100 text-amber-800' :
                          entrega.status === 'EM_ANDAMENTO' ? 'bg-blue-100 text-blue-800' :
                          entrega.status === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {entrega.status === 'EM_ANDAMENTO' ? 'Em Andamento' :
                           entrega.status === 'ENTREGUE' ? 'Entregue' :
                           entrega.status === 'PENDENTE' ? 'Pendente' :
                           entrega.status === 'CANCELADA' ? 'Cancelada' :
                           entrega.status || 'N/A'}
                        </span>
                      </div>
                      {entrega.itens && entrega.itens.length > 0 && (
                        <div className="space-y-1 mt-2">
                          {entrega.itens.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center justify-between text-xs text-gray-600">
                              <span>{item.item?.nome || item.nomeItem || 'Item'}</span>
                              <span className="font-medium">{item.quantidade}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {entrega.observacoes && (
                        <p className="text-xs text-gray-500 mt-2 italic">{entrega.observacoes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 text-sm">Nenhuma entrega registrada</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FielList;
