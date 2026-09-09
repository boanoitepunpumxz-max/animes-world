import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '../components/layout/MainLayout';
import AnimeGrid from '../components/anime/AnimeGrid';
import { animeAPI } from '../services/api';

export default function PopularPage() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    animeAPI.getAll({ sort: 'popularity', limit: 48 })
      .then(r => setAnimes(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <Helmet><title>Populares — ANIMES WORLD</title></Helmet>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2">🔥 Populares</h1>
        <p className="text-sm text-aw-muted mb-8">Os animes mais assistidos da plataforma.</p>
        <AnimeGrid animes={animes} loading={loading} skeletonCount={48} />
      </div>
    </MainLayout>
  );
}
