import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function AdminSync() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadLogs = () => {
    adminAPI.getSyncLogs().then(r => setLogs(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { loadLogs(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await adminAPI.triggerSync();
      toast.success('Sincronização iniciada! Verifique os logs em alguns minutos.');
      setTimeout(loadLogs, 5000);
    } catch { toast.error('Erro ao iniciar sincronização.'); }
    finally { setSyncing(false); }
  };

  const statusColor = { completed: 'text-green-400', running: 'text-yellow-400', failed: 'text-red-400' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">🔄 Sincronização</h2>
          <p className="text-sm text-aw-muted mt-1">Sincronize o catálogo com a AniList API.</p>
        </div>
        <button onClick={handleSync} disabled={syncing}
          className="aw-btn-primary flex items-center gap-2 text-sm">
          {syncing ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sincronizando...
            </>
          ) : '🔄 Sincronizar Agora'}
        </button>
      </div>

      {/* Info */}
      <div className="aw-card p-5 bg-aw-purple/5 border-aw-purple/20">
        <h3 className="text-sm font-semibold text-aw-text mb-2">Como funciona</h3>
        <ul className="text-sm text-aw-muted space-y-1 list-disc pl-4">
          <li>Os metadados (título, capa, sinopse, gêneros) são buscados da <strong className="text-aw-purple">AniList API</strong></li>
          <li>A sincronização roda automaticamente toda noite às 03:00</li>
          <li>Você pode acionar manualmente pelo botão acima</li>
          <li>Os <strong>vídeos/episódios</strong> devem ser cadastrados manualmente na aba "Episódios"</li>
        </ul>
      </div>

      {/* Logs */}
      <div className="aw-card">
        <div className="p-4 border-b border-aw-border flex items-center justify-between">
          <h3 className="font-semibold text-aw-text text-sm">Histórico de Sincronizações</h3>
          <button onClick={loadLogs} className="text-xs text-aw-purple hover:text-aw-purple-light">Atualizar</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-aw-border">
                {['Status','Adicionados','Atualizados','Erros','Duração','Iniciado em'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-aw-dim uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:5}).map((_,i)=>(
                    <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-8 rounded" /></td></tr>
                  ))
                : logs.map(log=>(
                    <tr key={log.id} className="border-b border-aw-border/50">
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${statusColor[log.status] || 'text-aw-muted'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-green-400 text-xs font-semibold">+{log.animes_added || 0}</td>
                      <td className="px-4 py-3 text-blue-400 text-xs font-semibold">~{log.animes_updated || 0}</td>
                      <td className="px-4 py-3 text-xs font-semibold">
                        <span className={log.errors > 0 ? 'text-red-400' : 'text-aw-dim'}>{log.errors || 0}</span>
                      </td>
                      <td className="px-4 py-3 text-aw-dim text-xs">
                        {log.duration_ms ? `${(log.duration_ms/1000).toFixed(1)}s` : '—'}
                      </td>
                      <td className="px-4 py-3 text-aw-dim text-xs">
                        {format(new Date(log.started_at), "dd/MM/yy 'às' HH:mm", {locale:ptBR})}
                      </td>
                    </tr>
                  ))
              }
              {!loading && logs.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-aw-muted text-sm">Nenhuma sincronização registrada ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
