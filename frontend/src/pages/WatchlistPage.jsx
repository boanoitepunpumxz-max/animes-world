import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '../components/layout/MainLayout';
import AnimeGrid from '../components/anime/AnimeGrid';
import EmptyState from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';

const TABS = [
  { value: '', label: 'Todos' },
  { value: 'watching', label: '▶ Assistindo' },
  { value: 'want_to_watch', label: '🔖 Quero assistir' },
  { value: 'completed', label: '✅ Concluído' },
  { value: 'paused', label: '⏸ Pausado' },
  { value: 'dropped', label: '❌ Abandonado' },
];

export default function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    setLoading(true);
    userAPI.getWatchlist(activeTab ? { status: activeTab } : {})
      .then(r => setItems(r.data.data || []))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const animes = items.map(i => ({
    id: i.id, slug: i.slug, title: i.title, cover_url: i.cover_url,
    year: i.year, type: i.type, score: i.score, status: i.anime_status, genres: [],
  }));

  return (
    <MainLayout>
      <Helmet><title>Minha Lista — ANIMES WORLD</title></Helmet>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-black text-white mb-6">📚 Minha Lista</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-aw-border pb-4">
          {TABS.map(t => (
            <button key={t.value} onClick={() => setActiveTab(t.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                t.value === activeTab ? 'text-white' : 'text-aw-muted hover:text-aw-text hover:bg-white/5'
              }`}
              style={t.value === activeTab ? { background:'linear-gradient(135deg,#a855f7,#ec4899)' } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        {!loading && animes.length === 0 ? (
          <EmptyState icon="📚" title="Lista vazia"
            message="Adicione animes à sua lista nas páginas de cada anime."
            action={<Link to="/animes" className="aw-btn-primary">Explorar animes</Link>} />
        ) : (
          <AnimeGrid animes={animes} loading={loading} />
        )}
      </div>
    </MainLayout>
  );
}
