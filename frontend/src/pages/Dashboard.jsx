import { useState, useEffect } from 'react';
import { Users, Heart, Truck, AlertTriangle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function StatCard({ icon: Icon, label, value, bgColor, iconColor, alert }) {
  return (
    <div className={`card relative overflow-hidden ${alert ? 'border-amber-200' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${bgColor}`}>
          <Icon size={21} className={iconColor} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 truncate">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value ?? '--'}</p>
        </div>
      </div>
      {alert && (
        <div className="absolute top-2 right-2">
          <span className="flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFieis: null,
    doacoesMes: null,
    entregasMes: null,
    itensVencimento: null,
  });
  const [doacoesPeriodo, setDoacoesPeriodo] = useState([]);
  const [entregasBairro, setEntregasBairro] = useState([]);
  const [itensMaisDoados, setItensMaisDoados] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const hoje = new Date();
      const seisMesesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 6, 1);
      const inicio = seisMesesAtras.toISOString().split('T')[0];
      const fim = hoje.toISOString().split('T')[0];

      const [statsRes, doacoesRes, entregasRes, itensRes, estoqueRes] =
        await Promise.allSettled([
          api.get('/dashboard/resumo'),
          api.get('/dashboard/doacoes-por-periodo', { params: { inicio, fim } }),
          api.get('/dashboard/entregas-por-bairro'),
          api.get('/dashboard/itens-mais-doados'),
          api.get('/dashboard/estoque'),
        ]);

      if (statsRes.status === 'fulfilled') {
        const resumo = statsRes.value.data;
        setStats({
          totalFieis: resumo.totalFieis,
          doacoesMes: resumo.totalDoacoesMes,
          entregasMes: resumo.totalEntregasMes,
          itensVencimento: resumo.itensProximosVencimento,
        });
      }
      if (doacoesRes.status === 'fulfilled') {
        const raw = doacoesRes.value.data;
        const arr = raw && typeof raw === 'object' && !Array.isArray(raw)
          ? Object.entries(raw).map(([periodo, quantidade]) => ({ periodo, quantidade }))
          : Array.isArray(raw) ? raw : [];
        setDoacoesPeriodo(arr);
      }
      if (entregasRes.status === 'fulfilled') {
        const raw = entregasRes.value.data;
        const arr = raw && typeof raw === 'object' && !Array.isArray(raw)
          ? Object.entries(raw).map(([bairro, quantidade]) => ({ bairro, quantidade }))
          : Array.isArray(raw) ? raw : [];
        setEntregasBairro(arr);
      }
      if (itensRes.status === 'fulfilled') {
        setItensMaisDoados(Array.isArray(itensRes.value.data) ? itensRes.value.data : []);
      }
      if (estoqueRes.status === 'fulfilled') {
        setEstoque(Array.isArray(estoqueRes.value.data) ? estoqueRes.value.data : []);
      }
    } catch {
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatGreetingDate = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getStockColor = (saldo) => {
    if (saldo < 5) return 'text-red-600 bg-red-50 border-red-200';
    if (saldo < 15) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  const getStockBadge = (saldo) => {
    if (saldo < 5) return 'badge-red';
    if (saldo < 15) return 'badge-yellow';
    return 'badge-green';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const maxDoado = itensMaisDoados.length > 0
    ? Math.max(...itensMaisDoados.map((i) => i.quantidade || 0))
    : 1;

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.nome?.split(' ')[0] || 'Usuario'}
        </h1>
        <p className="text-gray-500 text-sm mt-0.5 capitalize">
          {formatGreetingDate()}
        </p>
      </div>

      {/* Stat Cards - 2x2 grid on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Users}
          label="Total de Fieis"
          value={stats.totalFieis}
          bgColor="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          icon={Heart}
          label="Doacoes do Mes"
          value={stats.doacoesMes}
          bgColor="bg-teal-100"
          iconColor="text-teal-700"
        />
        <StatCard
          icon={Truck}
          label="Entregas do Mes"
          value={stats.entregasMes}
          bgColor="bg-emerald-100"
          iconColor="text-emerald-700"
        />
        <StatCard
          icon={AlertTriangle}
          label="Prox. Vencimento"
          value={stats.itensVencimento}
          bgColor="bg-amber-100"
          iconColor="text-amber-700"
          alert={stats.itensVencimento > 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Doacoes por Periodo */}
        <div className="card">
          <h3 className="section-title">Doacoes por Periodo</h3>
          {doacoesPeriodo.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={doacoesPeriodo} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="periodo"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '13px',
                  }}
                />
                <Bar
                  dataKey="quantidade"
                  fill="#1e40af"
                  radius={[6, 6, 0, 0]}
                  name="Doacoes"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-gray-400 text-sm">
              Sem dados disponiveis
            </div>
          )}
        </div>

        {/* Entregas por Regiao - horizontal bar chart */}
        <div className="card">
          <h3 className="section-title">Entregas por Regiao</h3>
          {entregasBairro.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={entregasBairro}
                layout="vertical"
                margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="bairro"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  width={90}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '13px',
                  }}
                />
                <Bar
                  dataKey="quantidade"
                  fill="#0d9488"
                  radius={[0, 6, 6, 0]}
                  name="Entregas"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-gray-400 text-sm">
              Sem dados disponiveis
            </div>
          )}
        </div>
      </div>

      {/* Top 5 Itens Doados */}
      <div className="card">
        <h3 className="section-title">Top 5 Itens Doados</h3>
        {itensMaisDoados.length > 0 ? (
          <div className="space-y-3">
            {itensMaisDoados.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.nome}</p>
                    <span className="text-sm font-semibold text-gray-600 ml-2 flex-shrink-0">
                      {item.quantidade}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.quantidade / maxDoado) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
            Sem dados disponiveis
          </div>
        )}
      </div>

      {/* Estoque Atual */}
      <div className="card">
        <h3 className="section-title">Estoque Atual</h3>
        {estoque.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {estoque.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${getStockColor(item.saldo)}`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.nome}</p>
                  <p className="text-[11px] opacity-70">{item.unidadeMedida}</p>
                </div>
                <span className={`${getStockBadge(item.saldo)} ml-2 flex-shrink-0`}>
                  {item.saldo}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
            Sem dados disponiveis
          </div>
        )}
      </div>

      {/* Regioes Atendidas */}
      {entregasBairro.length > 0 && (
        <div className="card">
          <h3 className="section-title">Regioes Atendidas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {entregasBairro
              .sort((a, b) => (b.quantidade || 0) - (a.quantidade || 0))
              .slice(0, 8)
              .map((item, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-lg font-bold text-gray-900">{item.quantidade}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{item.bairro}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
