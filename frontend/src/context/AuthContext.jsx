import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token } = response.data;
    localStorage.setItem('token', token);

    const userResponse = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(userResponse.data));
    setUser(userResponse.data);
    navigate('/dashboard');
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const isAuthenticated = !!user;

  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      return user.perfil === role;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export default AuthContext;
