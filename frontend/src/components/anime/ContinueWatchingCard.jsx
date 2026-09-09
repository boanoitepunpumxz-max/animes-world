import { Link } from 'react-router-dom';
import { RiPlayCircleFill } from 'react-icons/ri';
import ProgressBar from '../ui/ProgressBar';

export default function ContinueWatchingCard({ item }) {
  const {
    slug, title, cover_url,
    episode_number, season_number, episode_title,
    percentage, episode_id,
  } = item;

  return (
    <Link to={`/watch/${slug}/${episode_id}`} className="group block flex-shrink-0 w-52 md:w-60">
      <div className="aw-card overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:border-aw-purple/40">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-aw-border">
          <img
            src={cover_url || ''}
            alt={title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => { e.target.onerror = null; e.target.style.opacity='0'; }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <RiPlayCircleFill className="text-white text-4xl drop-shadow-lg" />
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <ProgressBar percentage={percentage} height={3} />
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-aw-text line-clamp-1 group-hover:text-aw-purple-light transition-colors">
            {title}
          </h3>
          <p className="text-xs text-aw-muted mt-0.5">
            T{season_number} • Ep {episode_number}
            {episode_title && ` — ${episode_title}`}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-aw-purple font-medium">{Math.round(percentage)}%</span>
            <span className="text-xs text-aw-dim">Continuar</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
