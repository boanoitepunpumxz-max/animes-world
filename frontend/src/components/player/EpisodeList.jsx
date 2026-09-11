/**
 * EpisodeList — Grid de cards na página do anime + lista compacta no player
 *
 * Props:
 *   episodes        — array de episódios
 *   animeSlug       — slug do anime para montar o link
 *   currentEpisodeId — id do episódio atual (destaque no player)
 *   animeCover      — capa do anime como fallback de thumbnail
 *   variant         — 'grid' (página do anime) | 'list' (painel lateral do player)
 */
import { Link } from 'react-router-dom';
import { RiPlayFill, RiCheckLine, RiLockLine, RiTimeLine } from 'react-icons/ri';
import ProgressBar from '../ui/ProgressBar';

// ── Placeholder quando não há thumbnail ──────────────────────
function EpThumbnail({ ep, animeCover, isCurrent, size = 'grid' }) {
  const src = ep.thumbnail_url || animeCover || null;

  return (
    <div className={`relative overflow-hidden bg-aw-surface flex-shrink-0 ${
      size === 'grid' ? 'w-full aspect-video rounded-t-xl' : 'w-28 aspect-video rounded-lg'
    }`}>
      {src ? (
        <img
          src={src}
          alt={ep.title || `Episódio ${ep.episode_number}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-aw-surface to-aw-card">
          <span className={`font-black text-aw-dim ${size === 'grid' ? 'text-4xl' : 'text-xl'}`}>
            {String(Math.floor(ep.episode_number)).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Overlay escuro ao hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

      {/* Ícone de play no hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-10 h-10 bg-aw-purple/90 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/50">
          <RiPlayFill className="text-white text-lg ml-0.5" />
        </div>
      </div>

      {/* Badge EP número (canto superior esquerdo) */}
      <div className="absolute top-2 left-2">
        <span className="bg-aw-purple text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-md">
          EP {String(Math.floor(ep.episode_number)).padStart(2, '0')}
        </span>
      </div>

      {/* Duração (canto superior direito) */}
      {ep.duration && (
        <div className="absolute top-2 right-2">
          <span className="bg-black/70 text-white/90 text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <RiTimeLine size={10} />
            {Math.round(ep.duration)} min
          </span>
        </div>
      )}

      {/* Overlay de episódio atual */}
      {isCurrent && (
        <div className="absolute inset-0 bg-aw-purple/20 border-2 border-aw-purple flex items-center justify-center">
          <div className="w-10 h-10 bg-aw-purple rounded-full flex items-center justify-center shadow-lg">
            <RiPlayFill className="text-white text-lg ml-0.5" />
          </div>
        </div>
      )}

      {/* Bloqueado */}
      {!ep.has_sources && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <RiLockLine className="text-aw-dim text-2xl" />
        </div>
      )}

      {/* Progresso assistido */}
      {ep.progress && !ep.progress.completed && ep.progress.percentage > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <div
            className="h-full bg-aw-purple"
            style={{ width: `${ep.progress.percentage}%` }}
          />
        </div>
      )}

      {/* Check se assistido */}
      {ep.progress?.completed && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <RiCheckLine className="text-white text-xs" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Card de episódio (modo grid — página do anime) ────────────
function EpisodeCard({ ep, animeSlug, animeCover }) {
  return (
    <Link
      to={`/watch/${animeSlug}/${ep.id}`}
      className="group aw-card flex flex-col overflow-hidden hover:border-aw-purple/50 hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300"
    >
      <EpThumbnail ep={ep} animeCover={animeCover} isCurrent={false} size="grid" />

      <div className="p-3 flex flex-col flex-1 gap-1.5">
        {/* Nome do episódio */}
        <p className="text-sm font-semibold text-aw-text leading-snug line-clamp-2 group-hover:text-aw-purple transition-colors">
          {ep.title || `Episódio ${Math.floor(ep.episode_number)}`}
        </p>

        {/* Descrição */}
        {ep.description && (
          <p className="text-xs text-aw-muted line-clamp-2 leading-relaxed">
            {ep.description}
          </p>
        )}

        {/* Barra de progresso */}
        {ep.progress && !ep.progress.completed && ep.progress.percentage > 0 && (
          <div className="mt-1">
            <ProgressBar percentage={ep.progress.percentage} height={2} />
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Botão assistir */}
        <div className="mt-2 flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg flex-1 justify-center transition-all ${
              ep.has_sources !== false
                ? 'aw-btn-primary'
                : 'bg-aw-surface text-aw-dim border border-aw-border cursor-not-allowed'
            }`}
          >
            {ep.progress?.completed ? (
              <><RiCheckLine size={13} /> Assistido</>
            ) : ep.has_sources !== false ? (
              <><RiPlayFill size={13} /> Assistir</>
            ) : (
              <><RiLockLine size={13} /> Indisponível</>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Item de episódio (modo lista — painel lateral do player) ──
function EpisodeListItem({ ep, animeSlug, animeCover, currentEpisodeId }) {
  const isCurrent = ep.id === currentEpisodeId;

  return (
    <Link
      key={ep.id}
      to={`/watch/${animeSlug}/${ep.id}`}
      className={`group flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${
        isCurrent
          ? 'bg-aw-purple/15 border border-aw-purple/40'
          : 'hover:bg-white/5 border border-transparent hover:border-aw-border'
      }`}
    >
      <EpThumbnail ep={ep} animeCover={animeCover} isCurrent={isCurrent} size="list" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-xs font-bold ${isCurrent ? 'text-aw-purple' : 'text-aw-dim'}`}>
            EP {String(Math.floor(ep.episode_number)).padStart(2, '0')}
          </span>
          {ep.is_filler && (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1 py-0.5 rounded">Filler</span>
          )}
          {ep.progress?.completed && (
            <RiCheckLine className="text-green-400 text-xs ml-auto" />
          )}
        </div>

        <p className={`text-sm leading-snug line-clamp-2 ${
          isCurrent ? 'text-aw-text font-medium' : 'text-aw-muted group-hover:text-aw-text'
        }`}>
          {ep.title || `Episódio ${Math.floor(ep.episode_number)}`}
        </p>

        {ep.duration && (
          <span className="text-xs text-aw-dim flex items-center gap-0.5 mt-0.5">
            <RiTimeLine size={10} /> {Math.round(ep.duration)} min
          </span>
        )}

        {ep.progress && !ep.progress.completed && ep.progress.percentage > 0 && (
          <div className="mt-1.5">
            <ProgressBar percentage={ep.progress.percentage} height={2} />
          </div>
        )}
      </div>
    </Link>
  );
}

// ── Componente principal ──────────────────────────────────────
export default function EpisodeList({
  episodes = [],
  animeSlug,
  animeCover,
  currentEpisodeId,
  variant = 'list',  // 'grid' na página do anime, 'list' no player
}) {
  // Ordena numericamente
  const sorted = [...episodes].sort((a, b) => a.episode_number - b.episode_number);

  if (sorted.length === 0) return null;

  // Grid (página do anime) — cards visuais
  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sorted.map(ep => (
          <EpisodeCard
            key={ep.id}
            ep={ep}
            animeSlug={animeSlug}
            animeCover={animeCover}
          />
        ))}
      </div>
    );
  }

  // Lista compacta (painel lateral do player)
  return (
    <div className="space-y-1">
      {sorted.map(ep => (
        <EpisodeListItem
          key={ep.id}
          ep={ep}
          animeSlug={animeSlug}
          animeCover={animeCover}
          currentEpisodeId={currentEpisodeId}
        />
      ))}
    </div>
  );
}
