import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, ChevronDown, ChevronUp, User, MapPin, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-left min-h-[48px]"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-gray-500" />}
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</span>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

function FielForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    congregacao: '',
    observacoes: '',
    latitude: '',
    longitude: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchFiel();
    }
  }, [id]);

  const fetchFiel = async () => {
    setFetching(true);
    try {
      const response = await api.get(`/fieis/${id}`);
      const data = response.data;
      setForm({
        nome: data.nome || '',
        telefone: data.telefone || '',
        cpf: data.cpf || '',
        logradouro: data.logradouro || data.endereco?.logradouro || '',
        numero: data.numero || data.endereco?.numero || '',
        complemento: data.complemento || data.endereco?.complemento || '',
        bairro: data.bairro || data.endereco?.bairro || '',
        cidade: data.cidade || data.endereco?.cidade || '',
        estado: data.estado || data.endereco?.estado || '',
        cep: data.cep || data.endereco?.cep || '',
        congregacao: data.congregacao || '',
        observacoes: data.observacoes || '',
        latitude: data.latitude || data.endereco?.latitude || '',
        longitude: data.longitude || data.endereco?.longitude || '',
      });
    } catch {
      toast.error('Erro ao carregar dados do fiel');
      navigate('/fieis');
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
    if (!form.bairro.trim()) newErrors.bairro = 'Bairro e obrigatorio';
    if (!form.cidade.trim()) newErrors.cidade = 'Cidade e obrigatoria';
    if (!form.estado.trim()) newErrors.estado = 'Estado e obrigatorio';
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
      const payload = { ...form };
      if (!payload.latitude) delete payload.latitude;
      if (!payload.longitude) delete payload.longitude;

      if (isEdit) {
        await api.put(`/fieis/${id}`, payload);
        toast.success('Fiel atualizado com sucesso');
      } else {
        await api.post('/fieis', payload);
        toast.success('Fiel cadastrado com sucesso');
      }
      navigate('/fieis');
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data?.erro || 'Erro ao salvar fiel';
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
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/fieis')}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Fiel' : 'Novo Fiel'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEdit ? 'Alterar dados do fiel' : 'Cadastrar novo fiel'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dados Pessoais */}
        <CollapsibleSection title="Dados Pessoais" icon={User} defaultOpen={true}>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefone" className="label-field">
                Telefone
              </label>
              <input
                id="telefone"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                className="input-field"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label htmlFor="cpf" className="label-field">
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                className="input-field"
                placeholder="000.000.000-00"
              />
            </div>
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
        </CollapsibleSection>

        {/* Endereco */}
        <CollapsibleSection title="Endereco" icon={MapPin} defaultOpen={true}>
          <div>
            <label htmlFor="cep" className="label-field">
              CEP
            </label>
            <input
              id="cep"
              name="cep"
              value={form.cep}
              onChange={handleChange}
              className="input-field"
              placeholder="00000-000"
            />
          </div>

          <div>
            <label htmlFor="logradouro" className="label-field">
              Logradouro
            </label>
            <input
              id="logradouro"
              name="logradouro"
              value={form.logradouro}
              onChange={handleChange}
              className="input-field"
              placeholder="Rua, Avenida, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="numero" className="label-field">
                Numero
              </label>
              <input
                id="numero"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                className="input-field"
                placeholder="N."
              />
            </div>

            <div>
              <label htmlFor="complemento" className="label-field">
                Complemento
              </label>
              <input
                id="complemento"
                name="complemento"
                value={form.complemento}
                onChange={handleChange}
                className="input-field"
                placeholder="Apto, Bloco, etc."
              />
            </div>
          </div>

          <div>
            <label htmlFor="bairro" className="label-field">
              Bairro *
            </label>
            <input
              id="bairro"
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              className={`input-field ${errors.bairro ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Bairro"
            />
            {errors.bairro && (
              <p className="text-red-500 text-xs mt-1">{errors.bairro}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cidade" className="label-field">
                Cidade *
              </label>
              <input
                id="cidade"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                className={`input-field ${errors.cidade ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Cidade"
              />
              {errors.cidade && (
                <p className="text-red-500 text-xs mt-1">{errors.cidade}</p>
              )}
            </div>

            <div>
              <label htmlFor="estado" className="label-field">
                Estado *
              </label>
              <select
                id="estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className={`input-field ${errors.estado ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">UF</option>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
              {errors.estado && (
                <p className="text-red-500 text-xs mt-1">{errors.estado}</p>
              )}
            </div>
          </div>

          {/* Localizacao opcional */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="label-field">
                Latitude <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="latitude"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                className="input-field"
                placeholder="-23.550520"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="label-field">
                Longitude <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="longitude"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                className="input-field"
                placeholder="-46.633308"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Observacoes */}
        <CollapsibleSection title="Observacoes" icon={MessageSquare} defaultOpen={!!form.observacoes}>
          <div>
            <label htmlFor="observacoes" className="label-field">
              Observacoes
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Observacoes adicionais..."
            />
          </div>
        </CollapsibleSection>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/fieis')}
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

export default FielForm;
