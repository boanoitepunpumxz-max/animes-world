import { useState, useRef, useEffect, useCallback } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  RiSearchLine, RiBellLine, RiMenuLine, RiCloseLine,
  RiUserLine, RiSettings3Line, RiHistoryLine, RiHeartLine,
  RiLogoutBoxLine, RiShieldLine, RiArrowDownSLine,
  RiHomeLine, RiFilmLine, RiCompassLine, RiStarLine, RiBookmarkLine,
  RiTicketLine,
} from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { searchAPI, notificationsAPI } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/home', label: 'Início', icon: RiHomeLine },
  { to: '/animes', label: 'Animes', icon: RiFilmLine },
  { to: '/generos', label: 'Gêneros', icon: RiCompassLine },
  { to: '/temporadas', label: 'Temporadas', icon: null },
  { to: '/populares', label: 'Popular', icon: RiStarLine },
  { to: '/minha-lista', label: 'Minha Lista', icon: RiBookmarkLine },
];

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Autocomplete
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) { setSuggestions([]); return; }
    setLoadingSuggestions(true);
    searchAPI.suggestions(debouncedSearch)
      .then(r => setSuggestions(r.data.data || []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoadingSuggestions(false));
  }, [debouncedSearch]);

  // Notificações não lidas
  useEffect(() => {
    if (!user) return;
    notificationsAPI.getUnreadCount()
      .then(r => setUnreadCount(r.data.count || 0))
      .catch(() => {});
    const interval = setInterval(() => {
      notificationsAPI.getUnreadCount()
        .then(r => setUnreadCount(r.data.count || 0))
        .catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;
    navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setSuggestions([]);
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Até logo!');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors px-1 py-1 rounded ${
      isActive ? 'text-aw-purple' : 'text-aw-muted hover:text-aw-text'
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-aw-bg/90 backdrop-blur-lg border-b border-aw-border">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center gap-4">

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 flex-shrink-0 mr-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
              style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
              AW
            </div>
            <span className="hidden sm:block text-sm font-bold text-aw-text tracking-wide">
              ANIMES WORLD
            </span>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} className={navLinkClass}>{label}</NavLink>
            ))}
          </nav>

          {/* Ações à direita */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Search Desktop */}
            <div ref={searchRef} className="relative hidden md:block">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar animes..."
                    className="w-64 lg:w-80 bg-aw-surface border border-aw-border rounded-lg px-4 py-2 text-sm text-aw-text placeholder:text-aw-dim focus:outline-none focus:border-aw-purple transition-all"
                  />
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSuggestions([]); }}
                    className="ml-1 aw-btn-ghost p-2">
                    <RiCloseLine size={18} />
                  </button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="aw-btn-ghost p-2.5">
                  <RiSearchLine size={20} />
                </button>
              )}

              {/* Sugestões */}
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 right-0 w-80 aw-card shadow-xl shadow-black/50 z-50 overflow-hidden animate-slide-down">
                  {suggestions.map(anime => (
                    <Link
                      key={anime.slug}
                      to={`/anime/${anime.slug}`}
                      onClick={() => { setSuggestions([]); setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                    >
                      <img src={anime.cover_url} alt="" className="w-8 h-11 object-cover rounded flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-aw-text truncate">{anime.title_english || anime.title}</p>
                        <p className="text-xs text-aw-muted">{anime.year} • {anime.type}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-aw-border px-4 py-2">
                    <button onClick={handleSearch} className="text-xs text-aw-purple hover:text-aw-purple-light w-full text-left">
                      Ver todos os resultados para "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Mobile */}
            <Link to="/busca" className="aw-btn-ghost p-2.5 md:hidden">
              <RiSearchLine size={20} />
            </Link>

            {/* Notificações */}
            <Link to="/notificacoes" className="aw-btn-ghost p-2.5 relative">
              <RiBellLine size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 text-xs font-bold text-white rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', fontSize: '9px' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Perfil Desktop */}
            <div ref={profileRef} className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden border border-aw-border flex-shrink-0">
                  {user?.avatar_url
                    ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff' }}>
                        {user?.username?.[0]?.toUpperCase()}
                      </div>
                  }
                </div>
                <span className="text-sm text-aw-text font-medium hidden lg:block max-w-[100px] truncate">
                  {user?.username}
                </span>
                <RiArrowDownSLine size={16} className={`text-aw-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 aw-card shadow-xl shadow-black/50 z-50 overflow-hidden animate-slide-down">
                  <div className="px-4 py-3 border-b border-aw-border">
                    <p className="text-sm font-semibold text-aw-text">{user?.username}</p>
                    <p className="text-xs text-aw-muted truncate">{user?.email}</p>
                  </div>
                  {[
                    { to: '/perfil',       icon: RiUserLine,     label: 'Meu Perfil' },
                    { to: '/historico',    icon: RiHistoryLine,  label: 'Histórico' },
                    { to: '/minha-lista',  icon: RiBookmarkLine, label: 'Minha Lista' },
                    { to: '/meus-tickets', icon: RiTicketLine,   label: 'Meus Tickets' },
                    { to: '/configuracoes',icon: RiSettings3Line,label: 'Configurações' },
                    ...(isAdmin ? [{ to: '/admin', icon: RiShieldLine, label: 'Painel Admin' }] : []),
                  ].map(({ to, icon: Icon, label }) => (
                    <Link key={to} to={to} onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-sm text-aw-muted hover:text-aw-text">
                      <Icon size={16} /> {label}
                    </Link>
                  ))}
                  <div className="border-t border-aw-border">
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-red-500/10 transition-colors text-sm text-red-400">
                      <RiLogoutBoxLine size={16} /> Sair
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Hamburguer Mobile */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="aw-btn-ghost p-2.5 lg:hidden">
              {menuOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-aw-surface border-b border-aw-border animate-slide-down">
            <div className="px-4 py-3 border-b border-aw-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-aw-border flex-shrink-0">
                {user?.avatar_url
                  ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center font-bold"
                      style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff' }}>
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-aw-text">{user?.username}</p>
                <p className="text-xs text-aw-muted">{user?.email}</p>
              </div>
            </div>

            <nav className="p-4 space-y-1">
              {[
                ...NAV_LINKS,
                { to: '/perfil',        label: 'Perfil' },
                { to: '/historico',     label: 'Histórico' },
                { to: '/meus-tickets',  label: '🎫 Meus Tickets' },
                { to: '/configuracoes', label: 'Configurações' },
                { to: '/suporte',       label: 'Suporte' },
                ...(isAdmin ? [{ to: '/admin', label: '⚙️ Painel Admin' }] : []),
              ].map(({ to, label }) => (
                <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-aw-purple/20 text-aw-purple' : 'text-aw-muted hover:text-aw-text hover:bg-white/5'
                    }`
                  }>
                  {label}
                </NavLink>
              ))}
              <button onClick={handleLogout}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-2">
                Sair
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
