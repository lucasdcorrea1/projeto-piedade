import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const triggerShake = () => {
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Informe o e-mail');
      triggerShake();
      return;
    }
    if (!senha.trim()) {
      toast.error('Informe a senha');
      triggerShake();
      return;
    }

    setSubmitting(true);
    try {
      await login(email, senha);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.erro ||
        'Credenciais invalidas. Tente novamente.';
      toast.error(message);
      triggerShake();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-5 shadow-lg shadow-black/20">
            <span className="text-3xl font-bold text-white tracking-tight">CCB</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            Congregacao Crista no Brasil
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-8 bg-slate-600" />
            <p className="text-slate-400 text-sm font-medium">
              Sistema de Piedade
            </p>
            <div className="h-px w-8 bg-slate-600" />
          </div>
        </div>

        {/* Login card */}
        <div
          className={`bg-white rounded-2xl shadow-2xl p-7 ${
            shakeError ? 'animate-shake' : ''
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Entrar no Sistema
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label-field">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={17} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="label-field">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={17} className="text-gray-400" />
                </div>
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="input-field pl-10 pr-11"
                  placeholder="Sua senha"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors min-w-[44px] justify-center"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Entrar
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          v1.0
        </p>
      </div>
    </div>
  );
}

export default Login;
