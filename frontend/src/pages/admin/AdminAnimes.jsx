import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminAnimes() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0 });

  const load = (page = 1) => {
    setLoading(true);
    adminAPI.getAnimes({ page, limit: 20, q: search || undefined })
      .then(r => { setAnimes(r.data.data || []); setPagination(r.data.pagination || {}); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleHide = async (id, currentHidden) => {
    try {
      await adminAPI.updateAnime(id, { isHidden: !currentHidden });
      toast.success(currentHidden ? 'Anime visível.' : 'Anime ocultado.');
      load();
    } catch { toast.error('Erro ao atualizar.'); }
  };

  const statusLabel = { RELEASING: 'Em andamento', FINISHED: 'Finalizado', HIATUS: 'Hiato' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">🎌 Animes</h2>
          <p className="text-sm text-aw-muted mt-1">{pagination.total?.toLocaleString()} animes no banco</p>
        </div>
      </div>

      <div className="flex gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(1)}
          placeholder="Buscar anime..." className="aw-input flex-1 py-2 text-sm" />
        <button onClick={() => load(1)} className="aw-btn-primary text-sm px-4">Buscar</button>
      </div>

      <div className="aw-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-aw-border">
              {['Capa','Título','Ano','Tipo','Status','Eps BD','Visível','Ações'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-aw-dim uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({length:8}).map((_,i)=>(
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="skeleton h-12 rounded" /></td></tr>
                ))
              : animes.map(a=>(
                  <tr key={a.id} className="border-b border-aw-border/50 hover:bg-white/2">
                    <td className="px-4 py-2">
                      <img src={a.cover_url} alt="" className="w-8 h-10 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-aw-text text-sm max-w-[200px] truncate">{a.title}</p>
                    </td>
                    <td className="px-4 py-3 text-aw-muted text-xs">{a.year || '—'}</td>
                    <td className="px-4 py-3 text-xs"><span className="bg-aw-purple/20 text-aw-purple px-2 py-0.5 rounded">{a.type}</span></td>
                    <td className="px-4 py-3 text-xs text-aw-muted">{statusLabel[a.status] || a.status}</td>
                    <td className="px-4 py-3 text-xs text-aw-muted">{a.ep_count_real || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${a.is_hidden ? 'text-red-400' : 'text-green-400'}`}>
                        {a.is_hidden ? 'Oculto' : 'Visível'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleHide(a.id, a.is_hidden)}
                        className={`text-xs px-3 py-1 rounded transition-colors ${
                          a.is_hidden ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}>
                        {a.is_hidden ? 'Mostrar' : 'Ocultar'}
                      </button>
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
