import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Heart,
  Truck,
  MoreHorizontal,
  Package,
  Shield,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const mainNavItems = [
  { to: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { to: '/fieis', label: 'Fieis', icon: Users },
  { to: '/doacoes', label: 'Doacoes', icon: Heart },
  { to: '/entregas', label: 'Entregas', icon: Truck },
];

function BottomNav() {
  const { hasRole, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleMenuNav = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <>
      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-up menu sheet */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-slide-up lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
        >
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <h3 className="text-base font-semibold text-gray-900">Menu</h3>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-3 pb-4 space-y-1">
            <button
              onClick={() => handleMenuNav('/itens')}
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[48px]"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Package size={18} className="text-amber-700" />
              </div>
              Itens
            </button>

            {hasRole('ADMIN') && (
              <button
                onClick={() => handleMenuNav('/usuarios')}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[48px]"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Shield size={18} className="text-blue-700" />
                </div>
                Usuarios
              </button>
            )}

            <div className="border-t border-gray-100 my-2" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors min-h-[48px]"
            >
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <LogOut size={18} className="text-red-600" />
              </div>
              Sair do Sistema
            </button>
          </div>
        </div>
      )}

      {/* Bottom navigation bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around px-1 h-16">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg min-w-[56px] min-h-[44px] transition-colors duration-150 ${
                  isActive
                    ? 'text-blue-800'
                    : 'text-gray-500 active:text-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[10px] leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-800 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <button
            onClick={() => setMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg min-w-[56px] min-h-[44px] transition-colors duration-150 ${
              menuOpen ? 'text-blue-800' : 'text-gray-500 active:text-gray-700'
            }`}
          >
            <MoreHorizontal size={22} strokeWidth={menuOpen ? 2.5 : 2} />
            <span className={`text-[10px] leading-tight ${menuOpen ? 'font-semibold' : 'font-medium'}`}>
              Mais
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default BottomNav;
