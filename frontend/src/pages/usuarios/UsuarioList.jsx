import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, UserX, Shield, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';

const PERFIL_BADGE = {
  ADMIN: 'badge-blue',
  DIACONO: 'badge-green',
  COOPERADOR: 'badge-gray',
};

const PERFIL_LABEL = {
  ADMIN: 'Administrador',
  DIACONO: 'Diacono',
  COOPERADOR: 'Cooperador',
};

function UsuarioList() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      let data = Array.isArray(response.data) ? response.data : response.data?.content || [];
      if (search) {
        data = data.filter(u => u.nome?.toLowerCase().includes(search.toLowerCase()));
      }
      setTotalPages(Math.ceil(data.length / 15) || 1);
      setUsuarios(data.slice(page * 15, (page + 1) * 15));
    } catch {
      toast.error('Erro ao carregar usuarios');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleSearch = useCallback((term) => {
    setSearch(term);
    setPage(0);
  }, []);

  const handleInativar = async () => {
    if (!selectedUsuario) return;
    try {
      await api.delete(`/usuarios/${selectedUsuario.id}`);
      toast.success('Usuario inativado com sucesso');
      fetchUsuarios();
    } catch {
      toast.error('Erro ao inativar usuario');
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'email', label: 'Email' },
    {
      key: 'perfil',
      label: 'Perfil',
      render: (row) => {
        const perfil = row.perfil || '';
        return (
          <span className={PERFIL_BADGE[perfil] || 'badge-gray'}>
            {PERFIL_LABEL[perfil] || perfil}
          </span>
        );
      },
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
              navigate(`/usuarios/novo?id=${row.id}`);
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
                setSelectedUsuario(row);
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

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const mobileCardRender = (row) => {
    const perfil = row.perfil || '';
    return (
      <div className="mobile-card">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-slate-600">{getInitials(row.nome)}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{row.nome}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <Mail size={11} />
                <span className="truncate">{row.email}</span>
              </div>
            </div>
          </div>
          <span className={row.ativo !== false ? 'badge-green' : 'badge-red'}>
            {row.ativo !== false ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className={PERFIL_BADGE[perfil] || 'badge-gray'}>
            <Shield size={11} className="mr-1" />
            {PERFIL_LABEL[perfil] || perfil}
          </span>
          {row.congregacao && (
            <span className="text-xs text-gray-500">{row.congregacao}</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => navigate(`/usuarios/novo?id=${row.id}`)}
            className="flex-1 btn-secondary text-xs py-2 min-h-[40px]"
          >
            <Pencil size={14} className="mr-1.5" />
            Editar
          </button>
          {row.ativo !== false && (
            <button
              onClick={() => {
                setSelectedUsuario(row);
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
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Gerenciar usuarios do sistema
          </p>
        </div>
        <button
          onClick={() => navigate('/usuarios/novo')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Novo Usuario
        </button>
      </div>

      <SearchBar
        placeholder="Buscar por nome..."
        onSearch={handleSearch}
        value={search}
      />

      <Table
        columns={columns}
        data={usuarios}
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
        title="Inativar Usuario"
        message={`Tem certeza que deseja inativar o usuario "${selectedUsuario?.nome}"?`}
        confirmLabel="Inativar"
        danger
      />
    </div>
  );
}

export default UsuarioList;
