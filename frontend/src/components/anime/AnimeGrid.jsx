import AnimeCard from './AnimeCard';
import { AnimeCardSkeleton } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

export default function AnimeGrid({ animes = [], loading = false, skeletonCount = 24, emptyMessage = 'Nenhum anime encontrado.' }) {
  if (!loading && animes.length === 0) {
    return <EmptyState icon="🎌" title="Nenhum anime encontrado" message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => <AnimeCardSkeleton key={i} />)
        : animes.map(anime => <AnimeCard key={anime.id} anime={anime} />)
      }
    </div>
  );
}
