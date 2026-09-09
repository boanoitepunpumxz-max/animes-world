import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MainLayout from '../components/layout/MainLayout';
import AnimeGrid from '../components/anime/AnimeGrid';
import SearchBar from '../components/ui/SearchBar';
import { searchAPI } from '../services/api';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    searchAPI.search(q, { limit: 48 })
      .then(r => setResults(r.data.data || []))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <MainLayout>
      <Helmet><title>{q ? `"${q}" — Busca` : 'Buscar'} — ANIMES WORLD</title></Helmet>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-black text-white mb-6">🔍 Buscar Animes</h1>
        <div className="mb-8">
          <SearchBar autoFocus={!q} placeholder="Digite o nome do anime..." />
        </div>
        {q && (
          <>
            <p className="text-sm text-aw-muted mb-4">
              {loading ? 'Buscando...' : `${results.length} resultados para "${q}"`}
            </p>
            <AnimeGrid animes={results} loading={loading}
              emptyMessage={`Nenhum anime encontrado para "${q}".`} />
          </>
        )}
      </div>
    </MainLayout>
  );
}
