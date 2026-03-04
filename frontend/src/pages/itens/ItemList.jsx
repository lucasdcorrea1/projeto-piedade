import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, XCircle, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';

const CATEGORIA_BADGE = {
  PERECIVEL: 'badge-yellow',
  NAO_PERECIVEL: 'badge-blue',
};

const CATEGORIA_LABEL = {
  PERECIVEL: 'Perecivel',
  NAO_PERECIVEL: 'Nao Perecivel',
};

function ItemList() {
  const navigate = useNavigate();
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItens = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 15 };
      if (search) params.nome = search;
      const response = await api.get('/itens', { params });
      setItens(response.data.content || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch {
      toast.error('Erro ao carregar itens');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchItens();
  }, [fetchItens]);

  const handleSearch = useCallback((term) => {
    setSearch(term);
    setPage(0);
  }, []);

  const handleInativar = async () => {
    if (!selectedItem) return;
    try {
      await api.delete(`/itens/${selectedItem.id}`);
      toast.success('Item inativado com sucesso');
      fetchItens();
    } catch {
      toast.error('Erro ao inativar item');
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome', sortable: true },
    {
      key: 'categoria',
      label: 'Categoria',
      render: (row) => {
        const cat = row.categoria || '';
        return (
          <span className={CATEGORIA_BADGE[cat] || 'badge-gray'}>
            {CATEGORIA_LABEL[cat] || cat}
          </span>
        );
      },
    },
    { key: 'unidadeMedida', label: 'Unidade' },
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
              navigate(`/itens/${row.id}/editar`);
            }}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          {row.ativo !== false && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(row);
                setModalOpen(true);
              }}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Inativar"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const mobileCardRender = (row) => {
    const cat = row.categoria || '';
    return (
      <div className="mobile-card">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
              cat === 'PERECIVEL' ? 'bg-amber-50' : 'bg-blue-50'
            }`}>
              <Package size={16} className={cat === 'PERECIVEL' ? 'text-amber-600' : 'text-blue-600'} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{row.nome}</p>
              <p className="text-xs text-gray-500 mt-0.5">{row.unidadeMedida}</p>
            </div>
          </div>
          <span className={row.ativo !== false ? 'badge-green' : 'badge-red'}>
            {row.ativo !== false ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        <div className="mt-2">
          <span className={CATEGORIA_BADGE[cat] || 'badge-gray'}>
            {CATEGORIA_LABEL[cat] || cat || 'Sem categoria'}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => navigate(`/itens/${row.id}/editar`)}
            className="flex-1 btn-secondary text-xs py-2 min-h-[40px]"
          >
            <Pencil size={14} className="mr-1.5" />
            Editar
          </button>
          {row.ativo !== false && (
            <button
              onClick={() => {
                setSelectedItem(row);
                setModalOpen(true);
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Itens</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gerenciar cadastro de itens</p>
        </div>
        <button
          onClick={() => navigate('/itens/novo')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Novo Item
        </button>
      </div>

      <SearchBar
        placeholder="Buscar por nome..."
        onSearch={handleSearch}
        value={search}
      />

      <Table
        columns={columns}
        data={itens}
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
        onConfirm={handleInativar}
        title="Inativar Item"
        message={`Tem certeza que deseja inativar o item "${selectedItem?.nome}"?`}
        confirmLabel="Inativar"
        danger
      />
    </div>
  );
}

export default ItemList;
