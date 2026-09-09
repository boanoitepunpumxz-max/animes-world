import { useEffect, useState } from 'react';
import { RiUserLine, RiFilmLine, RiVideoLine, RiCustomerService2Line } from 'react-icons/ri';
import { adminAPI } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Usuários', value: data?.stats?.totalUsers, icon: RiUserLine, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Animes', value: data?.stats?.totalAnimes, icon: RiFilmLine, color: 'text-aw-purple', bg: 'bg-aw-purple/10' },
    { label: 'Episódios', value: data?.stats?.totalEpisodes, icon: RiVideoLine, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Tickets abertos', value: data?.stats?.openTickets, icon: RiCustomerService2Line, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Dashboard</h2>
        <p className="text-sm text-aw-muted mt-1">Visão geral da plataforma ANIMES WORLD.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="aw-card p-5">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`${s.color} text-xl`} />
            </div>
            <p className="text-2xl font-black text-white">
              {loading ? '—' : (s.value?.toLocaleString() || '0')}
            </p>
            <p className="text-xs text-aw-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Logins recentes */}
      <div className="aw-card">
        <div className="p-5 border-b border-aw-border">
          <h3 className="font-semibold text-aw-text">🔐 Logins Recentes</h3>
          <p className="text-xs text-aw-muted mt-0.5">Últimos acessos registrados na plataforma</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({length:5}).map((_,i)=>(
                <div key={i} className="skeleton h-10 rounded" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-aw-border">
                  {['Usuário', 'E-mail', 'IP', 'User Agent', 'Quando'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-aw-dim uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.recentLogins || []).map((log, i) => (
                  <tr key={i} className="border-b border-aw-border/50 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3 font-medium text-aw-text">{log.username}</td>
                    <td className="px-5 py-3 text-aw-muted">{log.email}</td>
                    <td className="px-5 py-3 font-mono text-xs text-aw-purple">{String(log.ip_address)}</td>
                    <td className="px-5 py-3 text-aw-dim text-xs max-w-[200px] truncate">{log.user_agent}</td>
                    <td className="px-5 py-3 text-aw-dim text-xs">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: ptBR })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
