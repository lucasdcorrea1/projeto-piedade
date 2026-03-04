import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

function DoacaoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    data: new Date().toISOString().split('T')[0],
    origem: '',
    observacoes: '',
  });

  const [itensDoacao, setItensDoacao] = useState([
    { itemId: '', quantidade: '', validade: '' },
  ]);

  const [itensDisponiveis, setItensDisponiveis] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    fetchItens();
    if (isEdit) {
      fetchDoacao();
    }
  }, [id]);

  const fetchItens = async () => {
    try {
      const response = await api.get('/itens', { params: { size: 500, ativo: true } });
      setItensDisponiveis(response.data.content || response.data);
    } catch {
      toast.error('Erro ao carregar itens');
    }
  };

  const fetchDoacao = async () => {
    setFetching(true);
    try {
      const response = await api.get(`/doacoes/${id}`);
      const data = response.data;
      setForm({
        data: data.data ? data.data.split('T')[0] : '',
        origem: data.origem || '',
        observacoes: data.observacoes || '',
      });
      if (data.itens && data.itens.length > 0) {
        setItensDoacao(
          data.itens.map((item) => ({
            itemId: item.itemId || item.item?.id || '',
            quantidade: item.quantidade || '',
            validade: item.validade ? item.validade.split('T')[0] : '',
          }))
        );
      }
    } catch {
      toast.error('Erro ao carregar doacao');
      navigate('/doacoes');
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
    setItensDoacao((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addItemRow = () => {
    setItensDoacao((prev) => [...prev, { itemId: '', quantidade: '', validade: '' }]);
  };

  const removeItemRow = (index) => {
    if (itensDoacao.length <= 1) {
      toast.error('A doacao deve ter pelo menos 1 item');
      return;
    }
    setItensDoacao((prev) => prev.filter((_, i) => i !== index));
  };

  const getItemInfo = (itemId) => {
    return itensDisponiveis.find((i) => String(i.id) === String(itemId));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.data) newErrors.data = 'Data e obrigatoria';

    const hasValidItem = itensDoacao.some(
      (item) => item.itemId && item.quantidade
    );
    if (!hasValidItem) {
      newErrors.itens = 'Adicione pelo menos 1 item com quantidade';
    }

    for (let i = 0; i < itensDoacao.length; i++) {
      const item = itensDoacao[i];
      if (item.itemId && !item.quantidade) {
        newErrors[`item_${i}_quantidade`] = 'Quantidade obrigatoria';
      }
      if (item.quantidade && !item.itemId) {
        newErrors[`item_${i}_itemId`] = 'Selecione um item';
      }
      if (item.itemId && Number(item.quantidade) <= 0) {
        newErrors[`item_${i}_quantidade`] = 'Quantidade deve ser maior que zero';
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
      itens: itensDoacao
        .filter((item) => item.itemId && item.quantidade)
        .map((item) => ({
          itemId: Number(item.itemId),
          quantidade: Number(item.quantidade),
          validade: item.validade || null,
        })),
    };

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/doacoes/${id}`, payload);
        toast.success('Doacao atualizada com sucesso');
      } else {
        await api.post('/doacoes', payload);
        toast.success('Doacao registrada com sucesso');
      }
      navigate('/doacoes');
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data?.erro || 'Erro ao salvar doacao';
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
          onClick={() => navigate('/doacoes')}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Doacao' : 'Nova Doacao'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEdit ? 'Alterar dados da doacao' : 'Registrar nova doacao'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dados da Doacao */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            Dados da Doacao
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label htmlFor="origem" className="label-field">
                Origem
              </label>
              <input
                id="origem"
                name="origem"
                value={form.origem}
                onChange={handleChange}
                className="input-field"
                placeholder="Origem da doacao"
              />
            </div>
            <div className="sm:col-span-2">
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

        {/* Itens da Doacao */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Itens da Doacao
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
            {itensDoacao.map((itemRow, index) => {
              const itemInfo = getItemInfo(itemRow.itemId);
              return (
                <div
                  key={index}
                  className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100"
                >
                  {/* Mobile: stacked layout */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Package size={14} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                        {itemInfo?.categoria === 'PERECIVEL' && (
                          <span className="badge-yellow text-[10px]">Perecivel</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItemRow(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center -mr-1 -mt-1"
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

                    <div className="grid grid-cols-2 gap-3">
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
                      <div>
                        <label className="label-field">Validade</label>
                        <input
                          type="date"
                          value={itemRow.validade}
                          onChange={(e) =>
                            handleItemChange(index, 'validade', e.target.value)
                          }
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/doacoes')}
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

export default DoacaoForm;
