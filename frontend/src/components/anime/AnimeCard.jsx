import { Link } from 'react-router-dom';
import { RiStarFill, RiPlayCircleFill } from 'react-icons/ri';
import ProgressBar from '../ui/ProgressBar';

// Fallback SVG inline quando a imagem falha
const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%2316161f'/%3E%3Ctext x='100' y='155' font-family='sans-serif' font-size='14' fill='%23475569' text-anchor='middle'%3EAW%3C/text%3E%3C/svg%3E";

export default function AnimeCard({ anime, progress, showProgress = false, size = 'md' }) {
  const { slug, title, title_english, cover_url, year, type, score, status, episodes_count, genres } = anime;

  const statusColors = {
    RELEASING: 'bg-green-500',
    FINISHED:  'bg-blue-500',
    HIATUS:    'bg-yellow-500',
    CANCELLED: 'bg-red-500',
  };

  const statusLabels = {
    RELEASING: 'Em andamento',
    FINISHED:  'Finalizado',
    HIATUS:    'Hiato',
    CANCELLED: 'Cancelado',
  };

  return (
    <Link to={`/anime/${slug}`} className="group block">
      <div className="aw-card transition-all duration-300 group-hover:border-aw-purple/50 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-purple-900/20">
        {/* Capa */}
        <div className="relative aspect-[2/3] overflow-hidden bg-aw-border">
          <img
            src={cover_url || PLACEHOLDER}
            alt={title}
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <RiPlayCircleFill className="text-white text-5xl drop-shadow-lg" />
          </div>

          {/* Status badge */}
          {status && (
            <div className="absolute top-2 left-2">
              <span className={`${statusColors[status] || 'bg-gray-500'} text-white text-xs px-2 py-0.5 rounded-md font-medium`}>
                {statusLabels[status] || status}
              </span>
            </div>
          )}

          {/* Nota */}
          {score && (
            <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
              <RiStarFill className="text-yellow-400 text-xs" />
              <span className="text-white text-xs font-semibold">{parseFloat(score).toFixed(1)}</span>
            </div>
          )}

          {/* Progress bar no hover se tiver progresso */}
          {showProgress && progress && (
            <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
              <ProgressBar percentage={progress.percentage} height={3} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-aw-text line-clamp-2 leading-tight group-hover:text-aw-purple-light transition-colors">
            {title_english || title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {year && <span className="text-xs text-aw-dim">{year}</span>}
            {type && <span className="text-xs text-aw-dim">• {type}</span>}
            {episodes_count > 0 && (
              <span className="text-xs text-aw-dim">• {episodes_count} ep</span>
            )}
          </div>
          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {genres.slice(0, 2).map(g => (
                <span key={g.slug || g.name} className="text-xs bg-aw-border text-aw-muted px-1.5 py-0.5 rounded">
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
