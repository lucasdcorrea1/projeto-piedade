import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Heart,
  Truck,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/fieis', label: 'Fieis', icon: Users },
  { to: '/itens', label: 'Itens', icon: Package },
  { to: '/doacoes', label: 'Doacoes', icon: Heart },
  { to: '/entregas', label: 'Entregas', icon: Truck },
];

const adminItems = [
  { to: '/usuarios', label: 'Usuarios', icon: Shield },
];

function Sidebar() {
  const { hasRole, logout, user } = useAuth();

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-slate-800 to-slate-900 min-h-screen">
      <div className="flex flex-col h-full">
        {/* Logo area */}
        <div className="px-6 py-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Heart size={20} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">
                Sistema Piedade
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Gestao de Doacoes
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Principal
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border-l-[3px] border-blue-400 ml-0 pl-[13px]'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                }`
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          ))}

          {hasRole('ADMIN') && (
            <>
              <div className="pt-3" />
              <p className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Administracao
              </p>
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-300 border-l-[3px] border-blue-400 ml-0 pl-[13px]'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                    }`
                  }
                >
                  <item.icon size={19} />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="border-t border-slate-700/50 px-3 py-4">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {getInitials(user.nome)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.nome}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-150"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
