import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, Search, Package, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const STATUS_LABELS = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em Andamento',
  ENTREGUE: 'Entregue',
  CANCELADA: 'Cancelada',
};

const STATUS_BADGE = {
  PENDENTE: 'badge-yellow',
  EM_ANDAMENTO: 'badge-blue',
  ENTREGUE: 'badge-green',
  CANCELADA: 'badge-red',
};

function EntregaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    fielId: '',
    data: new Date().toISOString().split('T')[0],
    observacoes: '',
  });

  const [status, setStatus] = useState('PENDENTE');
  const [itensEntrega, setItensEntrega] = useState([
    { itemId: '', quantidade: '' },
  ]);

  const [fieis, setFieis] = useState([]);
  const [fieisSearch, setFieisSearch] = useState('');
  const [fieisLoading, setFieisLoading] = useState(false);
  const [showFieisDropdown, setShowFieisDropdown] = useState(false);
  const [itensDisponiveis, setItensDisponiveis] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    fetchItens();
    if (isEdit) {
      fetchEntrega();
    }
  }, [id]);

  const searchFieis = useCallback(async (term) => {
    if (!term || term.length < 2) {
      setFieis([]);
      return;
    }
    setFieisLoading(true);
    try {
      const response = await api.get('/fieis', {
        params: { nome: term, size: 20, ativo: true },
      });
      setFieis(response.data.content || response.data);
    } catch {
      // silent
    } finally {
      setFieisLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchFieis(fieisSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [fieisSearch, searchFieis]);

  const fetchItens = async () => {
    try {
      const response = await api.get('/itens', { params: { size: 500, ativo: true } });
      setItensDisponiveis(response.data.content || response.data);
    } catch {
      toast.error('Erro ao carregar itens');
    }
  };

  const fetchEntrega = async () => {
    setFetching(true);
    try {
      const response = await api.get(`/entregas/${id}`);
      const data = response.data;
      setForm({
        fielId: data.fielId || data.fiel?.id || '',
        data: data.data ? data.data.split('T')[0] : '',
        observacoes: data.observacoes || '',
      });
      setStatus(data.status || 'PENDENTE');

      if (data.fiel) {
        setFieis([data.fiel]);
        setFieisSearch(data.fiel.nome || '');
      }

      if (data.itens && data.itens.length > 0) {
        setItensEntrega(
          data.itens.map((item) => ({
            itemId: item.itemId || item.item?.id || '',
            quantidade: item.quantidade || '',
          }))
        );
      }
    } catch {
      toast.error('Erro ao carregar entrega');
      navigate('/entregas');
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

  const handleItemChange = (index, field, value) => {
    setItensEntrega((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addItemRow = () => {
    setItensEntrega((prev) => [...prev, { itemId: '', quantidade: '' }]);
  };

  const removeItemRow = (index) => {
    if (itensEntrega.length <= 1) {
      toast.error('A entrega deve ter pelo menos 1 item');
      return;
    }
    setItensEntrega((prev) => prev.filter((_, i) => i !== index));
  };

  const selectFiel = (fiel) => {
    setForm((prev) => ({ ...prev, fielId: fiel.id }));
    setFieisSearch(fiel.nome);
    setShowFieisDropdown(false);
    setFieis([]);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fielId) newErrors.fielId = 'Selecione um fiel';
    if (!form.data) newErrors.data = 'Data e obrigatoria';

    const hasValidItem = itensEntrega.some(
      (item) => item.itemId && item.quantidade
    );
    if (!hasValidItem) {
      newErrors.itens = 'Adicione pelo menos 1 item com quantidade';
    }

    for (let i = 0; i < itensEntrega.length; i++) {
      const item = itensEntrega[i];
      if (item.itemId && !item.quantidade) {
        newErrors[`item_${i}_quantidade`] = 'Quantidade obrigatoria';
      }
      if (item.quantidade && !item.itemId) {
        newErrors[`item_${i}_itemId`] = 'Selecione um item';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Corrija os erros do formulario');
      return;
    }

    const payload = {
      ...form,
      fielId: Number(form.fielId),
      itens: itensEntrega
        .filter((item) => item.itemId && item.quantidade)
        .map((item) => ({
          itemId: Number(item.itemId),
          quantidade: Number(item.quantidade),
        })),
    };

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/entregas/${id}`, payload);
        toast.success('Entrega atualizada com sucesso');
      } else {
        await api.post('/entregas', payload);
        toast.success('Entrega registrada com sucesso');
      }
      navigate('/entregas');
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data?.erro || 'Erro ao salvar entrega';
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
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/entregas')}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Entrega' : 'Nova Entrega'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEdit ? 'Alterar dados da entrega' : 'Registrar nova entrega'}
          </p>
        </div>
        {isEdit && (
          <span className={STATUS_BADGE[status] || 'badge-gray'}>
            {STATUS_LABELS[status] || status}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dados da Entrega */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            Dados da Entrega
          </h3>
          <div className="space-y-4">
            {/* Fiel search */}
            <div className="relative">
              <label className="label-field">Fiel *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={fieisSearch}
                  onChange={(e) => {
                    setFieisSearch(e.target.value);
                    setShowFieisDropdown(true);
                    if (form.fielId) {
                      setForm((prev) => ({ ...prev, fielId: '' }));
                    }
                  }}
                  onFocus={() => setShowFieisDropdown(true)}
                  className={`input-field pl-10 ${errors.fielId ? 'border-red-500' : ''}`}
                  placeholder="Buscar fiel por nome..."
                />
                {form.fielId && (
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                    <CheckCircle size={16} className="text-emerald-500" />
                  </div>
                )}
              </div>
              {errors.fielId && (
                <p className="text-red-500 text-xs mt-1">{errors.fielId}</p>
              )}
              {form.fielId && (
                <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1">
                  <CheckCircle size={12} />
                  Fiel selecionado
                </p>
              )}

              {showFieisDropdown && fieis.length > 0 && !form.fielId && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {fieisLoading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Buscando...
                    </div>
                  ) : (
                    fieis.map((fiel) => (
                      <button
                        key={fiel.id}
                        type="button"
                        onClick={() => selectFiel(fiel)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 active:bg-gray-100 text-sm transition-colors border-b border-gray-50 last:border-b-0 min-h-[48px]"
                      >
                        <p className="font-medium text-gray-900">{fiel.nome}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {fiel.endereco?.bairro || fiel.bairro || ''} - {fiel.endereco?.cidade || fiel.cidade || ''}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="data" className="label-field">
                Data *
              </label>
              <input
                id="data"
                name="data"
                type="date"
                value={form.data}
                onChange={handleChange}
                className={`input-field ${errors.data ? 'border-red-500' : ''}`}
              />
              {errors.data && (
                <p className="text-red-500 text-xs mt-1">{errors.data}</p>
              )}
            </div>

            <div>
              <label htmlFor="observacoes" className="label-field">
                Observacoes
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                rows={2}
                className="input-field"
                placeholder="Observacoes adicionais..."
              />
            </div>
          </div>
        </div>

        {/* Itens da Entrega */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Itens da Entrega
            </h3>
            <button
              type="button"
              onClick={addItemRow}
              className="btn-secondary flex items-center gap-1 text-xs py-2 px-3 min-h-[40px]"
            >
              <Plus size={15} />
              Adicionar
            </button>
          </div>

          {errors.itens && (
            <p className="text-red-500 text-sm mb-3">{errors.itens}</p>
          )}

          <div className="space-y-3">
            {itensEntrega.map((itemRow, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Package size={14} className="text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center -mr-1"
                      title="Remover item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="label-field">Item</label>
                    <select
                      value={itemRow.itemId}
                      onChange={(e) =>
                        handleItemChange(index, 'itemId', e.target.value)
                      }
                      className={`input-field ${
                        errors[`item_${index}_itemId`] ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">Selecione um item...</option>
                      {itensDisponiveis.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nome} ({item.unidadeMedida})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label-field">Quantidade</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemRow.quantidade}
                      onChange={(e) =>
                        handleItemChange(index, 'quantidade', e.target.value)
                      }
                      className={`input-field ${
                        errors[`item_${index}_quantidade`] ? 'border-red-500' : ''
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/entregas')}
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
            {isEdit ? 'Atualizar' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EntregaForm;
