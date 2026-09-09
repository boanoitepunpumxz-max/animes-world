import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '../components/layout/MainLayout';
import AnimeGrid from '../components/anime/AnimeGrid';
import Pagination from '../components/ui/Pagination';
import { genresAPI } from '../services/api';

export default function GenreDetailPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const [genre, setGenre] = useState(null);
  const [animes, setAnimes] = useState([]);
  const [pagination, setPagination] = useState({ page:1, totalPages:1, total:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    genresAPI.getBySlug(slug, { page, limit: 24 })
      .then(r => {
        setGenre(r.data.genre);
        setAnimes(r.data.data || []);
        setPagination(r.data.pagination || { page:1, totalPages:1, total:0 });
      })
      .finally(() => setLoading(false));
  }, [slug, page]);

  return (
    <MainLayout>
      <Helmet><title>{genre?.name || 'Gênero'} — ANIMES WORLD</title></Helmet>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{genre?.icon || '🎌'}</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">{genre?.name}</h1>
            {pagination.total > 0 && (
              <p className="text-sm text-aw-muted">{pagination.total} animes</p>
            )}
          </div>
        </div>
        <AnimeGrid animes={animes} loading={loading} />
        <Pagination page={page} totalPages={pagination.totalPages}
          onChange={p => { setSearchParams({ page: p }); window.scrollTo({ top:0, behavior:'smooth' }); }} />
      </div>
    </MainLayout>
  );
}
