import { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import {
  RiPlayFill, RiPauseFill, RiVolumeUpLine, RiVolumeMuteLine,
  RiFullscreenLine, RiFullscreenExitLine, RiSettings3Line,
  RiSkipForwardFill, RiSkipBackFill, RiSpeedLine,
  RiCloseLine, RiLoader4Line,
} from 'react-icons/ri';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}

export default function VideoPlayer({
  sources = [],
  onProgress,
  onEnded,
  initialProgress = 0,
  onPrevEpisode,
  onNextEpisode,
  hasPrev = false,
  hasNext = false,
}) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const hideControlsTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSource, setSelectedSource] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const currentSource = sources[selectedSource] || sources[0];
  const isEmbed = currentSource?.source_type === 'embed' || currentSource?.source_type === 'iframe';

  // Seek para o progresso inicial
  useEffect(() => {
    if (initialProgress > 0 && playerRef.current && hasStarted) {
      playerRef.current.seekTo(initialProgress, 'seconds');
    }
  }, [hasStarted]); // eslint-disable-line

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
    if (playing) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideControlsTimer.current);
  }, [playing, resetHideTimer]);

  useEffect(() => {
    const handleFullscreenChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!fullscreen) containerRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const handleProgress = ({ playedSeconds, played: playedFraction }) => {
    if (!seeking) {
      setPlayed(playedFraction);
      if (onProgress && duration > 0) {
        onProgress({ progressSeconds: Math.round(playedSeconds), durationSeconds: Math.round(duration) });
      }
    }
  };

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const time = x * duration;
    setPlayed(x);
    playerRef.current?.seekTo(x, 'fraction');
  };

  const handleKeyDown = useCallback((e) => {
    const focused = document.activeElement.tagName;
    if (['INPUT', 'TEXTAREA'].includes(focused)) return;
    switch (e.key) {
      case ' ': case 'k': e.preventDefault(); setPlaying(p => !p); break;
      case 'ArrowRight': playerRef.current?.seekTo(Math.min(played * duration + 10, duration), 'seconds'); break;
      case 'ArrowLeft': playerRef.current?.seekTo(Math.max(played * duration - 10, 0), 'seconds'); break;
      case 'ArrowUp': setVolume(v => Math.min(1, v + 0.1)); break;
      case 'ArrowDown': setVolume(v => Math.max(0, v - 0.1)); break;
      case 'm': setMuted(m => !m); break;
      case 'f': toggleFullscreen(); break;
    }
  }, [played, duration]); // eslint-disable-line

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!sources || sources.length === 0) {
    return (
      <div className="aspect-video bg-aw-surface flex items-center justify-center rounded-xl border border-aw-border">
        <div className="text-center space-y-2">
          <p className="text-aw-muted text-sm">Nenhuma fonte de vídeo disponível.</p>
          <p className="text-xs text-aw-dim">Configure os episódios no painel admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black aspect-video rounded-xl overflow-hidden group"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Player */}
      {isEmbed ? (
        <div className="w-full h-full relative bg-black">
          <iframe
            src={currentSource?.url}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="no-referrer-when-downgrade"
            title="Player"
          />
        </div>
      ) : (
        <ReactPlayer
          ref={playerRef}
          url={currentSource?.url}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onReady={() => setHasStarted(true)}
          onStart={() => setPlaying(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); onEnded?.(); }}
          onBuffer={() => setBuffering(true)}
          onBufferEnd={() => setBuffering(false)}
          onProgress={handleProgress}
          onDuration={setDuration}
          config={{
            file: { attributes: { crossOrigin: 'anonymous' }, forceHLS: currentSource?.source_type === 'hls' },
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}

      {/* Buffering */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <RiLoader4Line className="text-white text-4xl animate-spin" />
        </div>
      )}

      {/* Play/Pause center click */}
      {!isEmbed && (
        <div className="absolute inset-0" onClick={() => setPlaying(p => !p)} />
      )}

      {/* Controles — ocultados quando não hover */}
      {!isEmbed && (
        <div className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 space-y-3">

            {/* Progress bar */}
            <div
              className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group/bar"
              onClick={handleSeekClick}
            >
              {/* Buffer */}
              <div className="absolute top-0 left-0 h-full bg-white/30 rounded-full" />
              {/* Played */}
              <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ width: `${played * 100}%`, background: 'linear-gradient(90deg,#a855f7,#ec4899)' }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity"
                style={{ left: `calc(${played * 100}% - 6px)` }}
              />
            </div>

            {/* Controles */}
            <div className="flex items-center gap-3">
              {/* Ep anterior */}
              {hasPrev && (
                <button onClick={onPrevEpisode} className="text-white/70 hover:text-white transition-colors">
                  <RiSkipBackFill size={20} />
                </button>
              )}

              {/* Play/Pause */}
              <button onClick={() => setPlaying(p => !p)} className="text-white hover:text-aw-purple-light transition-colors">
                {playing ? <RiPauseFill size={26} /> : <RiPlayFill size={26} />}
              </button>

              {/* Próximo ep */}
              {hasNext && (
                <button onClick={onNextEpisode} className="text-white/70 hover:text-white transition-colors">
                  <RiSkipForwardFill size={20} />
                </button>
              )}

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={() => setMuted(m => !m)} className="text-white/70 hover:text-white transition-colors">
                  {muted || volume === 0 ? <RiVolumeMuteLine size={20} /> : <RiVolumeUpLine size={20} />}
                </button>
                <input
                  type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
                  onChange={e => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                  className="w-16 md:w-24 h-1 accent-purple-500"
                />
              </div>

              {/* Tempo */}
              <span className="text-white/70 text-xs ml-1 hidden sm:block">
                {formatTime(played * duration)} / {formatTime(duration)}
              </span>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Fontes */}
              {sources.length > 1 && (
                <div className="flex items-center gap-1">
                  {sources.map((s, i) => (
                    <button key={i} onClick={() => setSelectedSource(i)}
                      className={`text-xs px-2 py-0.5 rounded transition-colors ${
                        i === selectedSource ? 'bg-aw-purple text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}>
                      {s.quality || s.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Velocidade */}
              <div className="relative">
                <button onClick={() => setShowSettings(s => !s)} className="text-white/70 hover:text-white transition-colors">
                  <RiSettings3Line size={18} />
                </button>
                {showSettings && (
                  <div className="absolute bottom-8 right-0 w-48 aw-card shadow-xl p-2 z-50">
                    <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                      <span className="text-xs font-semibold text-aw-muted">Velocidade</span>
                      <button onClick={() => setShowSettings(false)}>
                        <RiCloseLine size={14} className="text-aw-muted" />
                      </button>
                    </div>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(r => (
                      <button key={r} onClick={() => { setPlaybackRate(r); setShowSettings(false); }}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded transition-colors ${
                          r === playbackRate ? 'text-aw-purple bg-aw-purple/10' : 'text-aw-muted hover:text-aw-text hover:bg-white/5'
                        }`}>
                        {r === 1 ? 'Normal' : `${r}x`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors">
                {fullscreen ? <RiFullscreenExitLine size={20} /> : <RiFullscreenLine size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
