import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { RiPlayCircleLine, RiArrowRightLine } from 'react-icons/ri';
import MainLayout from '../components/layout/MainLayout';
import HeroBanner from '../components/anime/HeroBanner';
import AnimeRow from '../components/anime/AnimeRow';
import ContinueWatchingCard from '../components/anime/ContinueWatchingCard';
import { animeAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HeroSkeleton } from '../components/ui/Skeleton';

export default function HomePage() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [recent, setRecent] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingContinue, setLoadingContinue] = useState(true);

  useEffect(() => {
    animeAPI.getFeatured()
      .then(r => setFeatured(r.data.data || []))
      .finally(() => setLoadingHero(false));

    animeAPI.getPopular(18)
      .then(r => setPopular(r.data.data || []))
      .finally(() => setLoadingPopular(false));

    animeAPI.getRecentEpisodes(18)
      .then(r => setRecent(r.data.data || []))
      .finally(() => setLoadingRecent(false));

    userAPI.getContinueWatching(10)
      .then(r => setContinueWatching(r.data.data || []))
      .finally(() => setLoadingContinue(false));
  }, []);

  // Transforma recent episodes em formato de card
  const recentAnimes = recent.map(ep => ({
    id: ep.anime_id,
    slug: ep.slug,
    title: ep.title,
    cover_url: ep.cover_url,
    type: ep.type,
    year: null,
    score: null,
    episodes_count: null,
    status: null,
    genres: [],
  }));

  return (
    <MainLayout>
      <Helmet>
        <title>ANIMES WORLD — Your Anime. Our World.</title>
        <meta name="description" content="Assista aos melhores animes online. Catálogo completo com legendas e dublagem em HD." />
      </Helmet>

      {/* Hero */}
      {loadingHero ? <HeroSkeleton /> : <HeroBanner animes={featured} />}

      {/* Conteúdo */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">

        {/* Continue Assistindo */}
        {(loadingContinue || continueWatching.length > 0) && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-aw-text flex items-center gap-2">
                <RiPlayCircleLine className="text-aw-purple" size={22} />
                Continue Assistindo
              </h2>
              <Link to="/historico" className="flex items-center gap-1 text-sm text-aw-purple hover:text-aw-purple-light transition-colors">
                Ver histórico <RiArrowRightLine size={16} />
              </Link>
            </div>
            {loadingContinue ? (
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-52 md:w-60 aw-card animate-pulse">
                    <div className="aspect-video skeleton" />
                    <div className="p-3 space-y-2">
                      <div className="skeleton h-4 w-3/4 rounded" />
                      <div className="skeleton h-3 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {continueWatching.map(item => (
                  <ContinueWatchingCard key={item.episode_id} item={item} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Animes Populares */}
        <AnimeRow
          title="Animes Populares"
          icon="🔥"
          animes={popular}
          loading={loadingPopular}
          viewAllLink="/populares"
          skeletonCount={8}
        />

        {/* Episódios Recentes */}
        <AnimeRow
          title="Episódios Recentes"
          icon="🆕"
          animes={recentAnimes}
          loading={loadingRecent}
          skeletonCount={8}
        />

        {/* Banner CTA */}
        <div className="my-10 rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(190,24,93,0.2) 100%)', border: '1px solid rgba(168,85,247,0.2)' }}>
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #a855f7 0, #a855f7 1px, transparent 0, transparent 50%)' ,backgroundSize: '12px 12px' }} />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                Explore o catálogo completo
              </h3>
              <p className="text-aw-muted text-sm max-w-lg">
                Milhares de animes organizados por gênero, temporada e muito mais. Encontre seu próximo favorito.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link to="/animes" className="aw-btn-primary flex items-center gap-2 text-sm">
                Ver todos os animes <RiArrowRightLine size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Gêneros rápidos */}
        <section>
          <h2 className="text-lg font-bold text-aw-text mb-4 flex items-center gap-2">
            🎌 Explorar por gênero
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Ação', slug: 'acao' }, { label: 'Aventura', slug: 'aventura' },
              { label: 'Comédia', slug: 'comedia' }, { label: 'Fantasia', slug: 'fantasia' },
              { label: 'Romance', slug: 'romance' }, { label: 'Shounen', slug: 'shounen' },
              { label: 'Isekai', slug: 'isekai' }, { label: 'Sobrenatural', slug: 'sobrenatural' },
              { label: 'Psicológico', slug: 'psicologico' }, { label: 'Seinen', slug: 'seinen' },
            ].map(g => (
              <Link key={g.slug} to={`/generos/${g.slug}`}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-aw-border text-aw-muted hover:border-aw-purple hover:text-aw-purple transition-all duration-200 bg-aw-card hover:bg-aw-purple/5">
                {g.label}
              </Link>
            ))}
            <Link to="/generos" className="px-4 py-2 rounded-lg text-sm font-medium text-aw-purple hover:text-aw-purple-light transition-colors">
              Ver todos →
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
