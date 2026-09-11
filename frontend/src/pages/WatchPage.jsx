import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  RiArrowLeftLine, RiSkipBackFill, RiSkipForwardFill,
  RiMenuLine, RiCloseLine, RiTimeLine, RiCalendarLine,
  RiPlayFill,
} from 'react-icons/ri';
import VideoPlayer from '../components/player/VideoPlayer';
import EpisodeList from '../components/player/EpisodeList';
import SeasonSelector from '../components/anime/SeasonSelector';
import { episodesAPI, animeAPI } from '../services/api';
import toast from 'react-hot-toast';

const PROGRESS_INTERVAL = 10000;

export default function WatchPage() {
  const { animeSlug, episodeId } = useParams();
  const navigate = useNavigate();

  const [episode, setEpisode]           = useState(null);
  const [anime, setAnime]               = useState(null);
  const [episodes, setEpisodes]         = useState([]);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [loadingEpisode, setLoadingEpisode] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(false); // mobile toggle
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [nextCountdown, setNextCountdown] = useState(5);

  const progressRef     = useRef({ progressSeconds: 0, durationSeconds: 0 });
  const saveProgressTimer = useRef(null);
  const countdownTimer  = useRef(null);

  // ── Carrega episódio ────────────────────────────────────────
  useEffect(() => {
    setLoadingEpisode(true);
    setShowNextOverlay(false);
    setNextCountdown(5);
    clearInterval(countdownTimer.current);

    episodesAPI.getDetail(episodeId)
      .then(r => {
        const ep = r.data.data;
        setEpisode(ep);
        setCurrentSeason(ep.season_number);
        return animeAPI.getBySlug(animeSlug).then(ar => setAnime(ar.data.data));
      })
      .catch(() => toast.error('Episódio não encontrado.'))
      .finally(() => setLoadingEpisode(false));
  }, [episodeId, animeSlug]);

  // ── Carrega lista da temporada ──────────────────────────────
  useEffect(() => {
    if (!episode) return;
    episodesAPI.getBySeason(episode.anime_id, currentSeason)
      .then(r => setEpisodes(r.data.data || []))
      .catch(() => setEpisodes([]));
  }, [episode?.anime_id, currentSeason]);

  // ── Salva progresso ─────────────────────────────────────────
  const saveProgress = useCallback(() => {
    const { progressSeconds, durationSeconds } = progressRef.current;
    if (progressSeconds < 5 || !durationSeconds) return;
    episodesAPI.saveProgress(episodeId, {
      progressSeconds, durationSeconds, animeId: episode?.anime_id,
    }).catch(() => {});
  }, [episodeId, episode?.anime_id]);

  useEffect(() => {
    saveProgressTimer.current = setInterval(saveProgress, PROGRESS_INTERVAL);
    return () => { clearInterval(saveProgressTimer.current); saveProgress(); };
  }, [saveProgress]);

  const handleProgress = ({ progressSeconds, durationSeconds }) => {
    progressRef.current = { progressSeconds, durationSeconds };
  };

  const goToNext = useCallback(() => {
    clearInterval(countdownTimer.current);
    setShowNextOverlay(false);
    if (episode?.next_episode) {
      navigate(`/watch/${animeSlug}/${episode.next_episode.id}`);
    }
  }, [episode, animeSlug, navigate]);

  const goToPrev = useCallback(() => {
    if (episode?.prev_episode) {
      navigate(`/watch/${animeSlug}/${episode.prev_episode.id}`);
    }
  }, [episode, animeSlug, navigate]);

  const handleEnded = useCallback(() => {
    saveProgress();
    if (episode?.next_episode) {
      setShowNextOverlay(true);
      setNextCountdown(5);
      countdownTimer.current = setInterval(() => {
        setNextCountdown(n => {
          if (n <= 1) { clearInterval(countdownTimer.current); goToNext(); return 0; }
          return n - 1;
        });
      }, 1000);
    }
  }, [episode, saveProgress, goToNext]);

  useEffect(() => () => clearInterval(countdownTimer.current), []);

  // ── Loading ─────────────────────────────────────────────────
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

  const epNumStr = String(Math.floor(episode.episode_number)).padStart(2, '0');
  const epLabel  = `T${episode.season_number} EP${epNumStr}${episode.title ? ` — ${episode.title}` : ''}`;

  return (
    <>
      <Helmet>
        <title>{episode.anime_title} • {epLabel} — ANIMES WORLD</title>
      </Helmet>

      <div className="min-h-screen bg-aw-bg flex flex-col">

        {/* ── Top bar ──────────────────────────────────────── */}
        <div className="sticky top-0 z-40 bg-aw-bg/95 backdrop-blur-sm border-b border-aw-border">
          <div className="max-w-[1800px] mx-auto px-3 sm:px-4 h-14 flex items-center gap-2 sm:gap-3">
            <Link
              to={`/anime/${animeSlug}`}
              className="aw-btn-ghost flex items-center gap-1.5 text-sm flex-shrink-0 px-2 sm:px-3"
            >
              <RiArrowLeftLine size={16} />
              <span className="hidden sm:inline">Voltar</span>
            </Link>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-aw-text truncate leading-tight">
                {episode.anime_title}
              </p>
              <p className="text-xs text-aw-muted truncate leading-tight">
                {epLabel}
              </p>
            </div>

            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                onClick={goToPrev}
                disabled={!episode.prev_episode}
                className="aw-btn-ghost p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Episódio anterior"
              >
                <RiSkipBackFill size={17} />
              </button>
              <button
                onClick={goToNext}
                disabled={!episode.next_episode}
                className="aw-btn-ghost p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Próximo episódio"
              >
                <RiSkipForwardFill size={17} />
              </button>
              {/* Botão toggle lista — mobile/tablet */}
              <button
                onClick={() => setShowEpisodes(s => !s)}
                className={`aw-btn-ghost p-2 lg:hidden ${showEpisodes ? 'text-aw-purple' : ''}`}
                title="Lista de episódios"
              >
                {showEpisodes ? <RiCloseLine size={18} /> : <RiMenuLine size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Layout principal ─────────────────────────────── */}
        <div className="flex-1 max-w-[1800px] w-full mx-auto px-3 sm:px-4 py-4 flex gap-4">

          {/* ── Coluna esquerda: player + info ─────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Player */}
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
                <div className="absolute inset-0 bg-black/75 flex items-end justify-end p-4 sm:p-6 rounded-xl z-20">
                  <div className="aw-glass rounded-xl p-4 sm:p-5 w-full max-w-sm">
                    <p className="text-xs text-aw-muted mb-1 uppercase tracking-wider">A seguir</p>
                    <p className="text-sm font-bold text-aw-text mb-3 line-clamp-2">
                      EP {String(Math.floor(episode.next_episode.episode_number)).padStart(2,'0')}
                      {episode.next_episode.title && ` — ${episode.next_episode.title}`}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={goToNext}
                        className="aw-btn-primary flex-1 text-sm py-2.5 flex items-center justify-center gap-1.5"
                      >
                        <RiPlayFill size={14} /> Assistir ({nextCountdown}s)
                      </button>
                      <button
                        onClick={() => { clearInterval(countdownTimer.current); setShowNextOverlay(false); }}
                        className="aw-btn-secondary text-sm py-2.5 px-4"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Info do episódio ──────────────────────────── */}
            <div className="aw-card p-4 sm:p-5">
              <div className="flex gap-4">
                {/* Capa do anime */}
                {episode.anime_cover && (
                  <Link to={`/anime/${animeSlug}`} className="flex-shrink-0 hidden sm:block">
                    <img
                      src={episode.anime_cover}
                      alt={episode.anime_title}
                      className="w-16 h-22 object-cover rounded-lg border border-aw-border hover:border-aw-purple/50 transition-colors"
                      style={{ height: '5.5rem' }}
                    />
                  </Link>
                )}

                <div className="flex-1 min-w-0">
                  {/* Título do anime */}
                  <Link
                    to={`/anime/${animeSlug}`}
                    className="text-xs text-aw-purple hover:text-aw-purple-light font-semibold uppercase tracking-wider transition-colors"
                  >
                    {episode.anime_title}
                  </Link>

                  {/* Badge temporada + ep */}
                  <div className="flex items-center flex-wrap gap-2 mt-1 mb-2">
                    <span className="text-xs bg-aw-purple/20 text-aw-purple px-2 py-0.5 rounded-full font-semibold">
                      Temporada {episode.season_number}
                    </span>
                    <span className="text-xs bg-aw-surface border border-aw-border text-aw-muted px-2 py-0.5 rounded-full">
                      Episódio {epNumStr}
                    </span>
                    {episode.duration && (
                      <span className="text-xs text-aw-dim flex items-center gap-1">
                        <RiTimeLine size={11} /> {Math.round(episode.duration)} min
                      </span>
                    )}
                    {episode.air_date && (
                      <span className="text-xs text-aw-dim flex items-center gap-1">
                        <RiCalendarLine size={11} />
                        {new Date(episode.air_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>

                  {/* Nome do episódio */}
                  {episode.title && (
                    <h1 className="text-base sm:text-lg font-bold text-aw-text leading-snug mb-2">
                      {episode.title}
                    </h1>
                  )}

                  {/* Descrição */}
                  {episode.description && (
                    <p className="text-sm text-aw-muted leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {episode.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Navegação prev/next ───────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              {episode.prev_episode ? (
                <Link
                  to={`/watch/${animeSlug}/${episode.prev_episode.id}`}
                  className="aw-card p-3 flex items-center gap-3 hover:border-aw-purple/40 transition-colors group"
                >
                  <RiSkipBackFill className="text-aw-dim group-hover:text-aw-purple transition-colors flex-shrink-0" size={18} />
                  <div className="min-w-0">
                    <p className="text-xs text-aw-dim">Anterior</p>
                    <p className="text-sm text-aw-muted group-hover:text-aw-text transition-colors truncate">
                      EP {String(Math.floor(episode.prev_episode.episode_number)).padStart(2,'0')}
                      {episode.prev_episode.title && ` — ${episode.prev_episode.title}`}
                    </p>
                  </div>
                </Link>
              ) : <div />}

              {episode.next_episode ? (
                <Link
                  to={`/watch/${animeSlug}/${episode.next_episode.id}`}
                  className="aw-card p-3 flex items-center gap-3 justify-end text-right hover:border-aw-purple/40 transition-colors group"
                  style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.05), rgba(236,72,153,0.05))' }}
                >
                  <div className="min-w-0">
                    <p className="text-xs text-aw-purple">Próximo</p>
                    <p className="text-sm text-aw-muted group-hover:text-aw-text transition-colors truncate">
                      EP {String(Math.floor(episode.next_episode.episode_number)).padStart(2,'0')}
                      {episode.next_episode.title && ` — ${episode.next_episode.title}`}
                    </p>
                  </div>
                  <RiSkipForwardFill className="text-aw-purple flex-shrink-0" size={18} />
                </Link>
              ) : <div />}
            </div>

            {/* ── Lista de episódios (mobile collapse) ─────── */}
            {showEpisodes && (
              <div className="lg:hidden aw-card overflow-hidden">
                <div className="p-3 border-b border-aw-border">
                  <p className="text-sm font-semibold text-aw-text mb-3">Episódios</p>
                  {anime?.seasons && anime.seasons.length > 1 && (
                    <SeasonSelector
                      seasons={anime.seasons}
                      currentSeason={currentSeason}
                      onChange={setCurrentSeason}
                    />
                  )}
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  <EpisodeList
                    episodes={episodes}
                    animeSlug={animeSlug}
                    animeCover={episode.anime_cover}
                    currentEpisodeId={episodeId}
                    variant="list"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Coluna direita: painel de episódios (desktop) ─ */}
          <div className="w-80 flex-shrink-0 hidden lg:flex flex-col gap-0">
            <div className="aw-card flex flex-col sticky top-[4.5rem]" style={{ maxHeight: 'calc(100vh - 5.5rem)' }}>
              {/* Header do painel */}
              <div className="p-4 border-b border-aw-border flex-shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-aw-text text-sm">Episódios</h3>
                  {episodes.length > 0 && (
                    <span className="text-xs text-aw-dim">{episodes.length} ep</span>
                  )}
                </div>
                {anime?.seasons && anime.seasons.length > 1 && (
                  <div className="mt-3">
                    <SeasonSelector
                      seasons={anime.seasons}
                      currentSeason={currentSeason}
                      onChange={setCurrentSeason}
                    />
                  </div>
                )}
              </div>

              {/* Lista scrollável */}
              <div className="flex-1 overflow-y-auto p-2 hide-scrollbar">
                <EpisodeList
                  episodes={episodes}
                  animeSlug={animeSlug}
                  animeCover={episode.anime_cover}
                  currentEpisodeId={episodeId}
                  variant="list"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
