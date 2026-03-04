import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const CATEGORIAS = [
  { value: 'PERECIVEL', label: 'Perecivel' },
  { value: 'NAO_PERECIVEL', label: 'Nao Perecivel' },
];

const UNIDADES = [
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'un', label: 'Unidade (un)' },
  { value: 'L', label: 'Litro (L)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'pct', label: 'Pacote (pct)' },
  { value: 'cx', label: 'Caixa (cx)' },
  { value: 'dz', label: 'Duzia (dz)' },
  { value: 'lata', label: 'Lata' },
  { value: 'saco', label: 'Saco' },
];

function ItemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    unidadeMedida: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    setFetching(true);
    try {
      const response = await api.get(`/itens/${id}`);
      const data = response.data;
      setForm({
        nome: data.nome || '',
        descricao: data.descricao || '',
        categoria: data.categoria || '',
        unidadeMedida: data.unidadeMedida || '',
      });
    } catch {
      toast.error('Erro ao carregar item');
      navigate('/itens');
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
    if (!form.categoria) newErrors.categoria = 'Categoria e obrigatoria';
    if (!form.unidadeMedida) newErrors.unidadeMedida = 'Unidade de medida e obrigatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Preencha os campos obrigatorios');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/itens/${id}`, form);
        toast.success('Item atualizado com sucesso');
      } else {
        await api.post('/itens', form);
        toast.success('Item cadastrado com sucesso');
      }
      navigate('/itens');
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data?.erro || 'Erro ao salvar item';
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
          onClick={() => navigate('/itens')}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Item' : 'Novo Item'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEdit ? 'Alterar dados do item' : 'Cadastrar novo item'}
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
            placeholder="Nome do item"
          />
          {errors.nome && (
            <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
          )}
        </div>

        <div>
          <label htmlFor="descricao" className="label-field">
            Descricao
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={3}
            className="input-field"
            placeholder="Descricao do item..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoria" className="label-field">
              Categoria *
            </label>
            <select
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className={`input-field ${errors.categoria ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Selecione...</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>
            )}
          </div>

          <div>
            <label htmlFor="unidadeMedida" className="label-field">
              Unidade de Medida *
            </label>
            <select
              id="unidadeMedida"
              name="unidadeMedida"
              value={form.unidadeMedida}
              onChange={handleChange}
              className={`input-field ${errors.unidadeMedida ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Selecione...</option>
              {UNIDADES.map((un) => (
                <option key={un.value} value={un.value}>
                  {un.label}
                </option>
              ))}
            </select>
            {errors.unidadeMedida && (
              <p className="text-red-500 text-xs mt-1">{errors.unidadeMedida}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/itens')}
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

export default ItemForm;
