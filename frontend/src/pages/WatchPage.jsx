import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  RiArrowLeftLine, RiSkipBackFill, RiSkipForwardFill,
  RiMenuLine, RiCloseLine, RiStarFill,
} from 'react-icons/ri';
import VideoPlayer from '../components/player/VideoPlayer';
import EpisodeList from '../components/player/EpisodeList';
import SeasonSelector from '../components/anime/SeasonSelector';
import { episodesAPI, animeAPI } from '../services/api';
import toast from 'react-hot-toast';

const PROGRESS_INTERVAL = 10000; // salva progresso a cada 10s

export default function WatchPage() {
  const { animeSlug, episodeId } = useParams();
  const navigate = useNavigate();

  const [episode, setEpisode] = useState(null);
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [loadingEpisode, setLoadingEpisode] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [nextCountdown, setNextCountdown] = useState(5);

  const progressRef = useRef({ progressSeconds: 0, durationSeconds: 0 });
  const saveProgressTimer = useRef(null);
  const countdownTimer = useRef(null);

  // Carrega detalhes do episódio
  useEffect(() => {
    setLoadingEpisode(true);
    setShowNextOverlay(false);
    setNextCountdown(5);

    episodesAPI.getDetail(episodeId)
      .then(r => {
        const ep = r.data.data;
        setEpisode(ep);
        setCurrentSeason(ep.season_number);
        // Carrega anime separado para ter seasons
        return animeAPI.getBySlug(animeSlug).then(ar => setAnime(ar.data.data));
      })
      .catch(() => toast.error('Episódio não encontrado.'))
      .finally(() => setLoadingEpisode(false));
  }, [episodeId, animeSlug]);

  // Carrega lista de episódios da temporada atual
  useEffect(() => {
    if (!episode) return;
    episodesAPI.getBySeason(episode.anime_id, currentSeason)
      .then(r => setEpisodes(r.data.data || []))
      .catch(() => setEpisodes([]));
  }, [episode?.anime_id, currentSeason]);

  // Salva progresso periodicamente
  const saveProgress = useCallback(() => {
    const { progressSeconds, durationSeconds } = progressRef.current;
    if (progressSeconds < 5 || !durationSeconds) return;
    episodesAPI.saveProgress(episodeId, {
      progressSeconds, durationSeconds, animeId: episode?.anime_id,
    }).catch(() => {});
  }, [episodeId, episode?.anime_id]);

  useEffect(() => {
    saveProgressTimer.current = setInterval(saveProgress, PROGRESS_INTERVAL);
    return () => {
      clearInterval(saveProgressTimer.current);
      saveProgress();
    };
  }, [saveProgress]);

  const handleProgress = ({ progressSeconds, durationSeconds }) => {
    progressRef.current = { progressSeconds, durationSeconds };
  };

  const handleEnded = () => {
    saveProgress();
    if (episode?.next_episode) {
      setShowNextOverlay(true);
      setNextCountdown(5);
      countdownTimer.current = setInterval(() => {
        setNextCountdown(n => {
          if (n <= 1) {
            clearInterval(countdownTimer.current);
            goToNext();
            return 0;
          }
          return n - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => () => clearInterval(countdownTimer.current), []);

  const goToNext = useCallback(() => {
    clearInterval(countdownTimer.current);
    setShowNextOverlay(false);
    if (episode?.next_episode) {
      navigate(`/watch/${animeSlug}/${episode.next_episode.id}`);
    }
  }, [episode, animeSlug, navigate]);

  const goToPrev = () => {
    if (episode?.prev_episode) {
      navigate(`/watch/${animeSlug}/${episode.prev_episode.id}`);
    }
  };

  if (loadingEpisode) {
    return (
      <div className="min-h-screen bg-aw-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-aw-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-aw-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-aw-muted">Episódio não encontrado.</p>
          <Link to={`/anime/${animeSlug}`} className="aw-btn-primary">Voltar ao anime</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{episode.anime_title} — Episódio {episode.episode_number} — ANIMES WORLD</title>
      </Helmet>

      <div className="min-h-screen bg-aw-bg">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-aw-bg/95 backdrop-blur-sm border-b border-aw-border">
          <div className="max-w-[1800px] mx-auto px-4 h-14 flex items-center gap-3">
            <Link to={`/anime/${animeSlug}`} className="aw-btn-ghost flex items-center gap-1.5 text-sm flex-shrink-0">
              <RiArrowLeftLine size={16} /> Voltar
            </Link>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-aw-text truncate">{episode.anime_title}</p>
              <p className="text-xs text-aw-muted">
                T{episode.season_number} • EP {String(episode.episode_number).padStart(2,'0')}
                {episode.title && ` — ${episode.title}`}
              </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={goToPrev}
                disabled={!episode.prev_episode}
                className="aw-btn-ghost p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Episódio anterior">
                <RiSkipBackFill size={18} />
              </button>
              <button
                onClick={goToNext}
                disabled={!episode.next_episode}
                className="aw-btn-ghost p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Próximo episódio">
                <RiSkipForwardFill size={18} />
              </button>
              <button
                onClick={() => setShowEpisodes(!showEpisodes)}
                className={`aw-btn-ghost p-2 ${showEpisodes ? 'text-aw-purple' : ''}`}
                title="Lista de episódios">
                {showEpisodes ? <RiCloseLine size={18} /> : <RiMenuLine size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Layout principal */}
        <div className="max-w-[1800px] mx-auto px-4 py-4 flex gap-4">

          {/* Player */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <VideoPlayer
                sources={episode.sources || []}
                onProgress={handleProgress}
                onEnded={handleEnded}
                initialProgress={episode.user_progress?.progress_seconds || 0}
                onPrevEpisode={goToPrev}
                onNextEpisode={goToNext}
                hasPrev={!!episode.prev_episode}
                hasNext={!!episode.next_episode}
              />

              {/* Overlay próximo episódio */}
              {showNextOverlay && episode.next_episode && (
                <div className="absolute inset-0 bg-black/70 flex items-end justify-end p-6 rounded-xl">
                  <div className="aw-glass rounded-xl p-5 max-w-xs">
                    <p className="text-xs text-aw-muted mb-1">A seguir</p>
                    <p className="text-sm font-semibold text-aw-text mb-3">
                      EP {String(episode.next_episode.episode_number).padStart(2,'0')}
                      {episode.next_episode.title && ` — ${episode.next_episode.title}`}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={goToNext} className="aw-btn-primary flex-1 text-sm py-2">
                        Assistir agora ({nextCountdown}s)
                      </button>
                      <button onClick={() => { clearInterval(countdownTimer.current); setShowNextOverlay(false); }}
                        className="aw-btn-secondary text-sm py-2 px-3">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info abaixo do player */}
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  {episode.anime_cover && (
                    <img src={episode.anime_cover} alt="" className="w-16 h-20 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-aw-text">{episode.anime_title}</h2>
                    <p className="text-sm text-aw-muted">
                      Temporada {episode.season_number} • Episódio {episode.episode_number}
                      {episode.title && ` — ${episode.title}`}
                    </p>
                    {episode.description && (
                      <p className="text-sm text-aw-muted mt-2 line-clamp-3">{episode.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navegação rápida */}
              <div className="flex gap-2 md:flex-col md:w-48">
                <Link
                  to={episode.prev_episode ? `/watch/${animeSlug}/${episode.prev_episode.id}` : '#'}
                  className={`aw-btn-secondary flex items-center gap-2 text-sm py-2 flex-1 justify-center ${!episode.prev_episode ? 'opacity-30 pointer-events-none' : ''}`}>
                  <RiSkipBackFill size={16} /> Anterior
                </Link>
                <Link
                  to={episode.next_episode ? `/watch/${animeSlug}/${episode.next_episode.id}` : '#'}
                  className={`aw-btn-primary flex items-center gap-2 text-sm py-2 flex-1 justify-center ${!episode.next_episode ? 'opacity-30 pointer-events-none' : ''}`}
                  style={episode.next_episode ? {} : { background: 'none' }}>
                  Próximo <RiSkipForwardFill size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Painel de episódios */}
          {showEpisodes && (
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <div className="aw-card h-[calc(100vh-8rem)] flex flex-col sticky top-20">
                <div className="p-4 border-b border-aw-border">
                  <h3 className="font-semibold text-aw-text text-sm">Episódios</h3>
                  {anime?.seasons && (
                    <div className="mt-3">
                      <SeasonSelector
                        seasons={anime.seasons}
                        currentSeason={currentSeason}
                        onChange={setCurrentSeason}
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  <EpisodeList
                    episodes={episodes}
                    animeSlug={animeSlug}
                    currentEpisodeId={episodeId}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile: lista de episódios colapsável */}
        {showEpisodes && (
          <div className="lg:hidden px-4 pb-8">
            <div className="aw-card">
              <div className="p-4 border-b border-aw-border">
                {anime?.seasons && (
                  <SeasonSelector seasons={anime.seasons} currentSeason={currentSeason} onChange={setCurrentSeason} />
                )}
              </div>
              <div className="p-2 max-h-96 overflow-y-auto">
                <EpisodeList episodes={episodes} animeSlug={animeSlug} currentEpisodeId={episodeId} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
