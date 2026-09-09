import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  RiPlayFill, RiAddLine, RiCheckLine, RiHeartLine, RiHeartFill,
  RiStarFill, RiTimeLine, RiCalendarLine, RiTeamLine, RiArrowLeftLine,
  RiShareLine, RiFilmLine,
} from 'react-icons/ri';
import MainLayout from '../components/layout/MainLayout';
import SeasonSelector from '../components/anime/SeasonSelector';
import EpisodeList from '../components/player/EpisodeList';
import Badge from '../components/ui/Badge';
import { EpisodeListSkeleton } from '../components/ui/Skeleton';
import { animeAPI, episodesAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AnimeDetailPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEps, setLoadingEps] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [watchlistStatus, setWatchlistStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('episodes');

  useEffect(() => {
    setLoading(true);
    animeAPI.getBySlug(slug)
      .then(r => {
        const a = r.data.data;
        setAnime(a);
        const firstSeason = a.seasons?.[0]?.number || 1;
        setCurrentSeason(firstSeason);
      })
      .catch(() => toast.error('Anime não encontrado.'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!anime) return;
    setLoadingEps(true);
    episodesAPI.getBySeason(anime.id, currentSeason)
      .then(r => setEpisodes(r.data.data || []))
      .catch(() => setEpisodes([]))
      .finally(() => setLoadingEps(false));
  }, [anime?.id, currentSeason]);

  useEffect(() => {
    if (!isAuthenticated || !anime) return;
    userAPI.getFavorites()
      .then(r => {
        const favs = r.data.data || [];
        setFavorited(favs.some(f => f.id === anime.id));
      }).catch(() => {});
    userAPI.getWatchlist()
      .then(r => {
        const list = r.data.data || [];
        const entry = list.find(w => w.id === anime.id);
        setWatchlistStatus(entry?.status || null);
      }).catch(() => {});
  }, [isAuthenticated, anime?.id]);

  const handleFavorite = async () => {
    if (!isAuthenticated) { toast.error('Faça login primeiro.'); return; }
    try {
      const r = await userAPI.toggleFavorite(anime.id);
      setFavorited(r.data.favorited);
      toast.success(r.data.message);
    } catch { toast.error('Erro ao atualizar favoritos.'); }
  };

  const handleWatchlist = async (status) => {
    if (!isAuthenticated) { toast.error('Faça login primeiro.'); return; }
    try {
      await userAPI.updateWatchlist(anime.id, status);
      setWatchlistStatus(status);
      toast.success('Lista atualizada!');
    } catch { toast.error('Erro ao atualizar lista.'); }
  };

  const firstEpisode = episodes[0];

  const statusLabel = { RELEASING: 'Em andamento', FINISHED: 'Finalizado', HIATUS: 'Hiato', CANCELLED: 'Cancelado' };
  const statusVariant = { RELEASING: 'releasing', FINISHED: 'finished', HIATUS: 'yellow', CANCELLED: 'red' };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen">
          <div className="w-full h-72 skeleton" />
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-4">
            <div className="skeleton h-8 w-64 rounded" />
            <div className="skeleton h-4 w-full max-w-2xl rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!anime) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-aw-muted mb-4">Anime não encontrado.</p>
            <Link to="/animes" className="aw-btn-primary">Ver catálogo</Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>{(anime.title_english || anime.title)} — ANIMES WORLD</title>
        <meta name="description" content={anime.description?.substring(0, 160)} />
        <meta property="og:image" content={anime.cover_url} />
      </Helmet>

      {/* Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <img src={anime.banner_url || anime.background_url || anime.cover_url} alt=""
          className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-aw-bg via-aw-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-aw-bg/80 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link to="/animes" className="aw-btn-ghost flex items-center gap-1.5 text-sm bg-black/30 backdrop-blur-sm">
            <RiArrowLeftLine size={16} /> Catálogo
          </Link>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 -mt-24 relative z-10 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Capa + ações */}
          <div className="flex-shrink-0">
            <div className="w-36 md:w-48 rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-aw-border">
              <img src={anime.cover_url} alt={anime.title} className="w-full aspect-[2/3] object-cover" />
            </div>

            <div className="mt-4 space-y-2 w-36 md:w-48">
              {firstEpisode && (
                <Link to={`/watch/${anime.slug}/${firstEpisode.id}`}
                  className="aw-btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5">
                  <RiPlayFill size={18} /> Assistir
                </Link>
              )}
              <button onClick={handleFavorite}
                className={`aw-btn-secondary w-full flex items-center justify-center gap-2 text-sm py-2.5 ${favorited ? 'text-red-400 border-red-400/40' : ''}`}>
                {favorited ? <RiHeartFill size={16} className="text-red-400" /> : <RiHeartLine size={16} />}
                {favorited ? 'Favoritado' : 'Favoritar'}
              </button>

              {/* Watchlist */}
              <select value={watchlistStatus || ''}
                onChange={e => handleWatchlist(e.target.value)}
                className="aw-input text-xs py-2 w-full">
                <option value="">+ Minha Lista</option>
                <option value="watching">Assistindo</option>
                <option value="want_to_watch">Quero assistir</option>
                <option value="completed">Concluído</option>
                <option value="paused">Pausado</option>
                <option value="dropped">Abandonado</option>
              </select>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 mt-4 lg:mt-16">
            <div className="flex flex-wrap items-start gap-3 mb-3">
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                {anime.title_english || anime.title}
              </h1>
              {anime.status && (
                <Badge variant={statusVariant[anime.status] || 'default'} className="mt-1.5">
                  {statusLabel[anime.status] || anime.status}
                </Badge>
              )}
            </div>

            {anime.title !== (anime.title_english || anime.title) && (
              <p className="text-sm text-aw-muted mb-3">{anime.title}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-aw-muted">
              {anime.score && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <RiStarFill size={14} />
                  <strong className="text-yellow-300">{parseFloat(anime.score).toFixed(1)}</strong>
                </span>
              )}
              {anime.year && <span className="flex items-center gap-1"><RiCalendarLine size={14} />{anime.year}</span>}
              {anime.type && (
                <span className="flex items-center gap-1">
                  <RiFilmLine size={14} />
                  <Badge variant="purple">{anime.type}</Badge>
                </span>
              )}
              {anime.episodes_count > 0 && <span className="flex items-center gap-1"><RiTimeLine size={14} />{anime.episodes_count} episódios</span>}
              {anime.studio && <span className="flex items-center gap-1"><RiTeamLine size={14} />{anime.studio}</span>}
            </div>

            {/* Gêneros */}
            {anime.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {anime.genres.map(g => (
                  <Link key={g.slug} to={`/generos/${g.slug}`}
                    className="text-xs px-3 py-1 rounded-full border border-aw-border text-aw-muted hover:border-aw-purple hover:text-aw-purple transition-colors">
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Sinopse */}
            {anime.description && (
              <p className="text-sm text-aw-muted leading-relaxed max-w-3xl mb-6 line-clamp-4 md:line-clamp-none">
                {anime.description}
              </p>
            )}

            {/* Tabs */}
            <div className="border-b border-aw-border mb-6">
              <div className="flex gap-6">
                {['episodes', 'info'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                      activeTab === tab ? 'text-aw-purple border-aw-purple' : 'text-aw-muted border-transparent hover:text-aw-text'
                    }`}>
                    {tab === 'episodes' ? 'Episódios' : 'Informações'}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'episodes' && (
              <>
                {/* Seletor de temporada */}
                {anime.seasons?.length > 0 && (
                  <div className="mb-5">
                    <SeasonSelector seasons={anime.seasons} currentSeason={currentSeason} onChange={setCurrentSeason} />
                  </div>
                )}

                {/* Lista de episódios */}
                {loadingEps ? (
                  <EpisodeListSkeleton count={8} />
                ) : episodes.length === 0 ? (
                  <div className="text-center py-10 text-aw-muted text-sm">
                    Nenhum episódio cadastrado ainda.
                  </div>
                ) : (
                  <EpisodeList episodes={episodes} animeSlug={anime.slug} />
                )}
              </>
            )}

            {activeTab === 'info' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Status', value: statusLabel[anime.status] || anime.status },
                  { label: 'Tipo', value: anime.type },
                  { label: 'Episódios', value: anime.episodes_count },
                  { label: 'Duração', value: anime.duration ? `${anime.duration} min` : null },
                  { label: 'Estúdio', value: anime.studio },
                  { label: 'Temporada', value: anime.season ? `${anime.season} ${anime.year}` : null },
                  { label: 'Nota', value: anime.score ? `${parseFloat(anime.score).toFixed(1)} / 10` : null },
                ].filter(i => i.value).map(item => (
                  <div key={item.label} className="aw-card p-4">
                    <p className="text-xs text-aw-dim mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-aw-text">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
