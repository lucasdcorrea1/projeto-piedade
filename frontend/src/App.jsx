import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FielList from './pages/fieis/FielList';
import FielForm from './pages/fieis/FielForm';
import DoacaoList from './pages/doacoes/DoacaoList';
import DoacaoForm from './pages/doacoes/DoacaoForm';
import EntregaList from './pages/entregas/EntregaList';
import EntregaForm from './pages/entregas/EntregaForm';
import ItemList from './pages/itens/ItemList';
import ItemForm from './pages/itens/ItemForm';
import UsuarioList from './pages/usuarios/UsuarioList';
import UsuarioForm from './pages/usuarios/UsuarioForm';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/fieis" element={<FielList />} />
        <Route path="/fieis/novo" element={<FielForm />} />
        <Route path="/fieis/:id/editar" element={<FielForm />} />

        <Route path="/doacoes" element={<DoacaoList />} />
        <Route path="/doacoes/novo" element={<DoacaoForm />} />
        <Route path="/doacoes/:id/editar" element={<DoacaoForm />} />

        <Route path="/entregas" element={<EntregaList />} />
        <Route path="/entregas/novo" element={<EntregaForm />} />
        <Route path="/entregas/:id/editar" element={<EntregaForm />} />

        <Route path="/itens" element={<ItemList />} />
        <Route path="/itens/novo" element={<ItemForm />} />
        <Route path="/itens/:id/editar" element={<ItemForm />} />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <UsuarioList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/novo"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <UsuarioForm />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
