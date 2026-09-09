import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminSecurity() {
  const [tab, setTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ ip: '', email: '', success: '' });

  const loadLogs = () => {
    setLoading(true);
    if (tab === 'logs') {
      adminAPI.getSecurityLogs({ limit: 100, ip: filters.ip || undefined })
        .then(r => setLogs(r.data.data || []))
        .finally(() => setLoading(false));
    } else {
      adminAPI.getLoginAttempts({ limit: 100, ip: filters.ip || undefined, email: filters.email || undefined, success: filters.success || undefined })
        .then(r => setAttempts(r.data.data || []))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => { loadLogs(); }, [tab]);

  const Table = ({ headers, rows }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-aw-border">
            {headers.map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-aw-dim uppercase tracking-wider">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-aw-border/50 hover:bg-white/2 transition-colors">
              {row.map((cell, j) => <td key={j} className="px-4 py-3 text-aw-muted">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && !loading && (
        <p className="text-center text-aw-muted text-sm py-8">Nenhum registro encontrado.</p>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white">🛡️ Segurança e IPs</h2>
        <p className="text-sm text-aw-muted mt-1">Monitoramento de acessos, logins e tentativas suspeitas.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-aw-border pb-4">
        {[{v:'logs',l:'Logs de Acesso'},{v:'attempts',l:'Tentativas de Login'}].map(t=>(
          <button key={t.v} onClick={()=>setTab(t.v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t.v?'text-white':'text-aw-muted hover:text-aw-text'}`}
            style={tab===t.v?{background:'linear-gradient(135deg,#a855f7,#ec4899)'}:{}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="aw-card p-4 flex flex-wrap gap-3">
        <input value={filters.ip} onChange={e=>setFilters({...filters,ip:e.target.value})}
          placeholder="Filtrar por IP" className="aw-input w-44 py-2 text-sm" />
        {tab === 'attempts' && (
          <>
            <input value={filters.email} onChange={e=>setFilters({...filters,email:e.target.value})}
              placeholder="Filtrar por e-mail" className="aw-input w-52 py-2 text-sm" />
            <select value={filters.success} onChange={e=>setFilters({...filters,success:e.target.value})}
              className="aw-input w-36 py-2 text-sm">
              <option value="">Todos</option>
              <option value="true">Sucesso</option>
              <option value="false">Falha</option>
            </select>
          </>
        )}
        <button onClick={loadLogs} className="aw-btn-primary text-sm px-4 py-2">Filtrar</button>
      </div>

      {/* Tabela */}
      <div className="aw-card">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({length:8}).map((_,i)=><div key={i} className="skeleton h-10 rounded" />)}
          </div>
        ) : tab === 'logs' ? (
          <Table
            headers={['Usuário','Ação','IP','Método','Rota','Status','Quando']}
            rows={logs.map(l=>[
              l.username || '—',
              <span className="font-mono text-xs text-aw-purple">{l.action}</span>,
              <span className="font-mono text-xs">{String(l.ip_address)}</span>,
              l.method,
              <span className="text-xs truncate max-w-[140px] block">{l.path}</span>,
              <span className={`text-xs font-semibold ${l.status_code < 400 ? 'text-green-400' : 'text-red-400'}`}>{l.status_code}</span>,
              <span className="text-xs">{format(new Date(l.created_at), 'dd/MM/yy HH:mm', {locale:ptBR})}</span>,
            ])}
          />
        ) : (
          <Table
            headers={['E-mail','IP','Resultado','User Agent','Quando']}
            rows={attempts.map(a=>[
              a.email || '—',
              <span className="font-mono text-xs text-aw-purple">{String(a.ip_address)}</span>,
              <span className={`text-xs font-semibold ${a.success ? 'text-green-400' : 'text-red-400'}`}>
                {a.success ? '✓ Sucesso' : '✗ Falha'}
              </span>,
              <span className="text-xs truncate max-w-[160px] block">{a.user_agent}</span>,
              <span className="text-xs">{format(new Date(a.created_at), 'dd/MM/yy HH:mm', {locale:ptBR})}</span>,
            ])}
          />
        )}
      </div>
    </div>
  );
}
