import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { RiDashboardLine, RiUserLine, RiFilmLine, RiVideoLine, RiShieldLine, RiRefreshLine, RiCustomerService2Line, RiArrowLeftLine, RiMenuLine, RiCloseLine, RiDownloadLine } from 'react-icons/ri';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin',               label: 'Dashboard',       icon: RiDashboardLine,      end: true },
  { to: '/admin/usuarios',      label: 'Usuários',         icon: RiUserLine },
  { to: '/admin/animes',        label: 'Animes',           icon: RiFilmLine },
  { to: '/admin/episodios',     label: 'Episódios',        icon: RiVideoLine },
  { to: '/admin/seguranca',     label: 'Segurança / IPs',  icon: RiShieldLine },
  { to: '/admin/sincronizacao', label: 'Sincronização',    icon: RiRefreshLine },
  { to: '/admin/importador',    label: 'Importador AnFire',icon: RiDownloadLine },
  { to: '/admin/suporte',       label: 'Suporte',          icon: RiCustomerService2Line },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive ? 'bg-aw-purple/20 text-aw-purple' : 'text-aw-muted hover:text-aw-text hover:bg-white/5'
    }`;

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'w-full' : 'w-60'} flex-shrink-0`}>
      {!mobile && (
        <div className="p-5 border-b border-aw-border">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
              style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>AW</div>
            <span className="text-sm font-bold text-aw-text">Admin</span>
          </div>
          <p className="text-xs text-aw-dim">{user?.email}</p>
        </div>
      )}
      <nav className="p-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={navClass} onClick={() => setSidebarOpen(false)}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        <div className="pt-3 border-t border-aw-border mt-3">
          <button onClick={() => navigate('/home')}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-aw-muted hover:text-aw-text hover:bg-white/5 w-full transition-all">
            <RiArrowLeftLine size={18} /> Voltar ao site
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-aw-bg flex">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex flex-col w-60 bg-aw-surface border-r border-aw-border fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-aw-surface border-r border-aw-border p-4">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-aw-bg/90 backdrop-blur-sm border-b border-aw-border px-4 md:px-6 h-14 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden aw-btn-ghost p-2">
            <RiMenuLine size={20} />
          </button>
          <h1 className="text-sm font-bold text-aw-text">Painel Administrativo</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-aw-muted hidden sm:block">{user?.username}</span>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
