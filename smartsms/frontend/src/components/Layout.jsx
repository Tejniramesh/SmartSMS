import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Send, MessageSquare, Users,
  LogOut, Zap, Bell, ChevronRight, Sparkles
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/send', label: 'Send SMS', icon: Send },
  { path: '/messages', label: 'Messages', icon: MessageSquare },
  { path: '/contacts', label: 'Contacts', icon: Users },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 flex flex-col"
        style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1a1040 60%, #24243e 100%)' }}>
        
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #a855f7)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">SmartSMS</h1>
              <p className="text-indigo-300/60 text-xs mt-0.5">v2.0 Pro</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="text-indigo-300/40 text-xs font-semibold uppercase tracking-widest px-4 mb-3">
            Main Menu
          </p>
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`sidebar-item w-full text-left ${active ? 'active' : ''}`}
              >
                <Icon size={18} className={active ? 'text-indigo-300' : ''} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={14} className="text-indigo-400" />}
              </button>
            );
          })}
        </nav>

        {/* Credits pill */}
        <div className="mx-4 mb-3 p-3 rounded-xl border border-indigo-500/30"
          style={{ background: 'rgba(99,102,241,0.15)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-indigo-300 text-xs font-medium">Credits Balance</span>
            <Sparkles size={12} className="text-yellow-400" />
          </div>
          <div className="flex items-end gap-1">
            <span className="text-white text-2xl font-bold">{user?.credits || 0}</span>
            <span className="text-indigo-300/60 text-sm mb-0.5">credits</span>
          </div>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full"
              style={{
                width: `${Math.min(100, ((user?.credits || 0) / 500) * 100)}%`,
                background: 'linear-gradient(to right, #4f46e5, #a855f7)'
              }} />
          </div>
        </div>

        {/* User profile */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #a855f7)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-indigo-300/50 text-xs truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-indigo-300/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <p className="text-gray-400 text-xs">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Credits badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(168,85,247,0.1))' }}>
              <Zap size={14} className="text-indigo-500" />
              <span className="text-indigo-700 font-bold text-sm">{user?.credits || 0}</span>
              <span className="text-indigo-500/60 text-xs">credits</span>
            </div>

            {/* Notification */}
            <button className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-indigo-50 transition-colors">
              <Bell size={16} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #a855f7)' }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto mesh-bg">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
