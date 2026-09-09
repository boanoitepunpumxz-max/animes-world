import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MainLayout from '../components/layout/MainLayout';
import { genresAPI } from '../services/api';

export default function GenresPage() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    genresAPI.getAll().then(r => setGenres(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <Helmet><title>Gêneros — ANIMES WORLD</title></Helmet>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2">Gêneros</h1>
        <p className="text-aw-muted text-sm mb-8">Explore o catálogo por categoria.</p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({length:20}).map((_,i)=>(
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {genres.map(g => (
              <Link key={g.slug} to={`/generos/${g.slug}`}
                className="aw-card p-5 flex flex-col items-center gap-2 text-center hover:border-aw-purple/40 hover:-translate-y-1 transition-all duration-200 group">
                <span className="text-3xl">{g.icon || '🎌'}</span>
                <p className="text-sm font-semibold text-aw-text group-hover:text-aw-purple-light transition-colors">{g.name}</p>
                {g.anime_count > 0 && (
                  <p className="text-xs text-aw-dim">{g.anime_count} animes</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
