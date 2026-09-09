import { Link } from 'react-router-dom';
import { RiCheckLine, RiPlayFill, RiLockLine } from 'react-icons/ri';
import ProgressBar from '../ui/ProgressBar';

export default function EpisodeList({ episodes = [], animeSlug, currentEpisodeId }) {
  return (
    <div className="space-y-1">
      {episodes.map(ep => {
        const isCurrent = ep.id === currentEpisodeId;
        const isWatched = ep.progress?.completed;
        const hasProgress = ep.progress && !isWatched && ep.progress.percentage > 0;

        return (
          <Link
            key={ep.id}
            to={`/watch/${animeSlug}/${ep.id}`}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
              isCurrent
                ? 'bg-aw-purple/15 border border-aw-purple/40'
                : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            {/* Thumbnail ou número */}
            <div className="relative flex-shrink-0 w-28 aspect-video rounded overflow-hidden bg-aw-border">
              {ep.thumbnail_url ? (
                <img src={ep.thumbnail_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-lg font-bold ${
                  isCurrent ? 'text-aw-purple' : 'text-aw-dim'
                }`}>
                  {String(ep.episode_number).padStart(2, '0')}
                </div>
              )}
              {isCurrent && (
                <div className="absolute inset-0 bg-aw-purple/20 flex items-center justify-center">
                  <RiPlayFill className="text-white text-xl" />
                </div>
              )}
              {!ep.has_sources && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <RiLockLine className="text-aw-dim text-lg" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${isCurrent ? 'text-aw-purple' : 'text-aw-dim'}`}>
                  EP {String(ep.episode_number).padStart(2, '0')}
                </span>
                {ep.is_filler && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">Filler</span>
                )}
                {isWatched && <RiCheckLine className="text-green-400 text-sm ml-auto" />}
              </div>

              {ep.title && (
                <p className={`text-sm truncate mt-0.5 ${isCurrent ? 'text-aw-text font-medium' : 'text-aw-muted group-hover:text-aw-text'}`}>
                  {ep.title}
                </p>
              )}

              {ep.duration && (
                <span className="text-xs text-aw-dim">{Math.round(ep.duration)} min</span>
              )}

              {hasProgress && (
                <div className="mt-1.5">
                  <ProgressBar percentage={ep.progress.percentage} height={2} />
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
