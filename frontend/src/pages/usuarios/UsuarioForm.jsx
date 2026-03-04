import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const PERFIS = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'DIACONO', label: 'Diacono' },
  { value: 'COOPERADOR', label: 'Cooperador' },
];

function UsuarioForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const isEdit = !!editId;

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil: '',
    congregacao: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchUsuario();
    }
  }, [editId]);

  const fetchUsuario = async () => {
    setFetching(true);
    try {
      const response = await api.get(`/usuarios/${editId}`);
      const data = response.data;
      setForm({
        nome: data.nome || '',
        email: data.email || '',
        senha: '',
        perfil: data.perfil || '',
        congregacao: data.congregacao || '',
      });
    } catch {
      toast.error('Erro ao carregar usuario');
      navigate('/usuarios');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = 'Nome e obrigatorio';
    if (!form.email.trim()) newErrors.email = 'Email e obrigatorio';
    if (!isEdit && !form.senha.trim()) newErrors.senha = 'Senha e obrigatoria';
    if (form.senha && form.senha.length < 6)
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    if (!form.perfil) newErrors.perfil = 'Perfil e obrigatorio';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      newErrors.email = 'Email invalido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Preencha os campos obrigatorios');
      return;
    }

    const payload = { ...form };
    if (isEdit && !payload.senha) {
      delete payload.senha;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/usuarios/${editId}`, payload);
        toast.success('Usuario atualizado com sucesso');
      } else {
        await api.post('/usuarios', payload);
        toast.success('Usuario cadastrado com sucesso');
      }
      navigate('/usuarios');
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data?.erro || 'Erro ao salvar usuario';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/usuarios')}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Usuario' : 'Novo Usuario'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEdit ? 'Alterar dados do usuario' : 'Cadastrar novo usuario'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label htmlFor="nome" className="label-field">
            Nome *
          </label>
          <input
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className={`input-field ${errors.nome ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Nome completo"
          />
          {errors.nome && (
            <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="label-field">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="email@exemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="senha" className="label-field">
            Senha {isEdit ? '(deixe em branco para manter)' : '*'}
          </label>
          <div className="relative">
            <input
              id="senha"
              name="senha"
              type={showPassword ? 'text' : 'password'}
              value={form.senha}
              onChange={handleChange}
              className={`input-field pr-11 ${errors.senha ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder={isEdit ? 'Nova senha (opcional)' : 'Senha'}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors min-w-[44px] justify-center"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.senha && (
            <p className="text-red-500 text-xs mt-1">{errors.senha}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="perfil" className="label-field">
              Perfil *
            </label>
            <select
              id="perfil"
              name="perfil"
              value={form.perfil}
              onChange={handleChange}
              className={`input-field ${errors.perfil ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Selecione...</option>
              {PERFIS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {errors.perfil && (
              <p className="text-red-500 text-xs mt-1">{errors.perfil}</p>
            )}
          </div>

          <div>
            <label htmlFor="congregacao" className="label-field">
              Congregacao
            </label>
            <input
              id="congregacao"
              name="congregacao"
              value={form.congregacao}
              onChange={handleChange}
              className="input-field"
              placeholder="Nome da congregacao"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/usuarios')}
            className="btn-secondary w-full sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isEdit ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UsuarioForm;
