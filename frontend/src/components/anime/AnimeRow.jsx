import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { RiArrowRightLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import AnimeCard from './AnimeCard';
import { AnimeCardSkeleton } from '../ui/Skeleton';

export default function AnimeRow({ title, icon, animes = [], loading = false, viewAllLink, skeletonCount = 6 }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-4 md:px-0">
        <h2 className="text-lg md:text-xl font-bold text-aw-text flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} className="aw-btn-ghost p-1.5 rounded-lg hidden md:flex">
            <RiArrowLeftSLine size={20} />
          </button>
          <button onClick={() => scroll(1)} className="aw-btn-ghost p-1.5 rounded-lg hidden md:flex">
            <RiArrowRightSLine size={20} />
          </button>
          {viewAllLink && (
            <Link to={viewAllLink} className="flex items-center gap-1 text-sm text-aw-purple hover:text-aw-purple-light transition-colors">
              Ver todos <RiArrowRightLine size={16} />
            </Link>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar px-4 md:px-0 pb-2"
      >
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-40 md:w-44"><AnimeCardSkeleton /></div>
            ))
          : animes.map(anime => (
              <div key={anime.id} className="flex-shrink-0 w-40 md:w-44">
                <AnimeCard anime={anime} />
              </div>
            ))
        }
      </div>
    </section>
  );
}
