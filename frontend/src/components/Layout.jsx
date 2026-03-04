import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

function Layout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar - hidden on mobile */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center">
              <span className="text-xs font-bold text-white">SP</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">Sistema Piedade</h1>
              <p className="text-[10px] text-slate-500 leading-tight">CCB</p>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}

export default Layout;
