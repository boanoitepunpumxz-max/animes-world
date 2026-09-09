import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiDeleteBin6Line, RiPlayFill } from 'react-icons/ri';
import MainLayout from '../components/layout/MainLayout';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getHistory({ limit: 50 })
      .then(r => setHistory(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleClear = async () => {
    if (!confirm('Limpar todo o histórico? Esta ação não pode ser desfeita.')) return;
    try {
      await userAPI.clearHistory();
      setHistory([]);
      toast.success('Histórico limpo.');
    } catch { toast.error('Erro ao limpar histórico.'); }
  };

  return (
    <MainLayout>
      <Helmet><title>Histórico — ANIMES WORLD</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-white">🕓 Histórico</h1>
          {history.length > 0 && (
            <button onClick={handleClear} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
              <RiDeleteBin6Line size={16} /> Limpar tudo
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} className="aw-card p-4 flex gap-4 animate-pulse">
                <div className="w-24 h-14 skeleton rounded flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <EmptyState icon="🎬" title="Nenhum histórico" message="Comece a assistir para ver aqui."
            action={<Link to="/animes" className="aw-btn-primary">Explorar animes</Link>} />
        ) : (
          <div className="space-y-2">
            {history.map(item => (
              <div key={item.id} className="aw-card p-4 flex items-center gap-4 hover:border-aw-border/80 transition-colors">
                <div className="relative w-24 h-14 flex-shrink-0 rounded overflow-hidden bg-aw-border">
                  <img src={item.cover_url} alt="" className="w-full h-full object-cover" />
                  {item.percentage < 100 && item.percentage > 0 && (
                    <div className="absolute bottom-0 left-0 right-0">
                      <ProgressBar percentage={item.percentage} height={2} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-aw-text truncate">{item.title}</p>
                  <p className="text-xs text-aw-muted">
                    T{item.season_number} • Ep {item.episode_number}
                    {item.episode_title && ` — ${item.episode_title}`}
                  </p>
                  <p className="text-xs text-aw-dim mt-0.5">
                    {format(new Date(item.watched_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <Link to={`/watch/${item.slug}/${item.episode_id}`}
                  className="flex items-center gap-1.5 text-sm text-aw-purple hover:text-aw-purple-light transition-colors flex-shrink-0">
                  <RiPlayFill size={16} /> Continuar
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
