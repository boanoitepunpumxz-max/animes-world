import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1 });

  const loadUsers = (page = 1) => {
    setLoading(true);
    adminAPI.getUsers({ page, limit: 20, q: search || undefined })
      .then(r => { setUsers(r.data.data || []); setPagination(r.data.pagination || {}); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleUpdate = async (id, data) => {
    try {
      await adminAPI.updateUser(id, data);
      toast.success('Usuário atualizado.');
      loadUsers();
    } catch (err) { toast.error(err.response?.data?.error || 'Erro.'); }
  };

  const statusColor = { active: 'text-green-400', banned: 'text-red-400', suspended: 'text-yellow-400' };
  const roleColor = { admin: 'text-aw-purple', moderator: 'text-blue-400', user: 'text-aw-muted' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">👥 Usuários</h2>
          <p className="text-sm text-aw-muted mt-1">{pagination.total?.toLocaleString()} usuários registrados</p>
        </div>
      </div>

      {/* Busca */}
      <div className="flex gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && loadUsers(1)}
          placeholder="Buscar por nome ou e-mail..." className="aw-input flex-1 py-2 text-sm" />
        <button onClick={() => loadUsers(1)} className="aw-btn-primary text-sm px-4">Buscar</button>
      </div>

      {/* Tabela */}
      <div className="aw-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-aw-border">
              {['Usuário','E-mail','Role','Status','Episódios','Cadastro','Último login','Ações'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-aw-dim uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({length:8}).map((_,i)=>(
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="skeleton h-8 rounded" /></td></tr>
                ))
              : users.map(u => (
                  <tr key={u.id} className="border-b border-aw-border/50 hover:bg-white/2">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
                          {u.username?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-aw-text">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-aw-muted text-xs">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${roleColor[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${statusColor[u.status]}`}>{u.status}</span>
                    </td>
                    <td className="px-4 py-3 text-aw-muted text-xs">{u.episodes_watched || 0}</td>
                    <td className="px-4 py-3 text-aw-dim text-xs">
                      {format(new Date(u.created_at), 'dd/MM/yy', {locale:ptBR})}
                    </td>
                    <td className="px-4 py-3 text-aw-dim text-xs">
                      {u.last_login_at ? format(new Date(u.last_login_at), 'dd/MM/yy HH:mm', {locale:ptBR}) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <select value={u.status} onChange={e => handleUpdate(u.id, { status: e.target.value })}
                          className="text-xs bg-aw-surface border border-aw-border rounded px-2 py-1 text-aw-muted">
                          <option value="active">Ativo</option>
                          <option value="banned">Banido</option>
                          <option value="suspended">Suspenso</option>
                        </select>
                        <select value={u.role} onChange={e => handleUpdate(u.id, { role: e.target.value })}
                          className="text-xs bg-aw-surface border border-aw-border rounded px-2 py-1 text-aw-muted">
                          <option value="user">User</option>
                          <option value="moderator">Mod</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
