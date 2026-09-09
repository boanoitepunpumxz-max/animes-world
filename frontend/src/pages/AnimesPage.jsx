import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiFilterLine, RiCloseLine } from 'react-icons/ri';
import MainLayout from '../components/layout/MainLayout';
import AnimeGrid from '../components/anime/AnimeGrid';
import Pagination from '../components/ui/Pagination';
import { animeAPI, genresAPI } from '../services/api';

const TYPES = ['TV','Movie','OVA','ONA','Special','Music'];
const STATUSES = [
  { value: 'RELEASING', label: 'Em andamento' },
  { value: 'FINISHED', label: 'Finalizado' },
  { value: 'HIATUS', label: 'Hiato' },
  { value: 'CANCELLED', label: 'Cancelado' },
];
const SORTS = [
  { value: 'popularity', label: 'Mais populares' },
  { value: 'score', label: 'Melhor avaliados' },
  { value: 'updated', label: 'Atualizados recentemente' },
  { value: 'year', label: 'Mais recentes' },
  { value: 'title', label: 'A-Z' },
  { value: 'episodes', label: 'Mais episódios' },
];
const YEARS = Array.from({ length: new Date().getFullYear() - 1960 + 1 }, (_, i) => new Date().getFullYear() - i);
const SEASONS = [
  { value: 'WINTER', label: '❄️ Inverno' },
  { value: 'SPRING', label: '🌸 Primavera' },
  { value: 'SUMMER', label: '☀️ Verão' },
  { value: 'FALL', label: '🍂 Outono' },
];

export default function AnimesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [genres, setGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filters = {
    page: parseInt(searchParams.get('page') || '1'),
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    season: searchParams.get('season') || '',
    status: searchParams.get('status') || '',
    type: searchParams.get('type') || '',
    sort: searchParams.get('sort') || 'popularity',
  };

  const setFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.set('page', '1');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({ page: '1', sort: 'popularity' });

  const hasActiveFilters = filters.genre || filters.year || filters.season || filters.status || filters.type;

  useEffect(() => {
    genresAPI.getAll().then(r => setGenres(r.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 24, ...filters };
    animeAPI.getAll(params)
      .then(r => {
        setAnimes(r.data.data || []);
        setPagination(r.data.pagination || { page: 1, totalPages: 1, total: 0 });
      })
      .catch(() => setAnimes([]))
      .finally(() => setLoading(false));
  }, [searchParams.toString()]);

  const Select = ({ label, value, onChange, options, placeholder }) => (
    <div>
      <label className="aw-label text-xs">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="aw-input text-sm py-2">
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
        ))}
      </select>
    </div>
  );

  return (
    <MainLayout>
      <Helmet>
        <title>Animes — ANIMES WORLD</title>
        <meta name="description" content="Catálogo completo de animes. Filtre por gênero, ano, temporada e tipo." />
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">Catálogo de Animes</h1>
            {pagination.total > 0 && (
              <p className="text-sm text-aw-muted mt-1">{pagination.total.toLocaleString()} animes encontrados</p>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`aw-btn-secondary flex items-center gap-2 text-sm ${hasActiveFilters ? 'border-aw-purple text-aw-purple' : ''}`}>
            <RiFilterLine size={16} />
            Filtros
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-aw-purple" />}
          </button>
        </div>

        {/* Painel de filtros */}
        {showFilters && (
          <div className="aw-card p-5 mb-6 animate-slide-down">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <Select label="Gênero" value={filters.genre} onChange={v => setFilter('genre', v)}
                options={genres.map(g => ({ value: g.slug, label: g.name }))} placeholder="Todos" />
              <Select label="Ano" value={filters.year} onChange={v => setFilter('year', v)}
                options={YEARS.map(y => ({ value: String(y), label: String(y) }))} placeholder="Todos" />
              <Select label="Temporada" value={filters.season} onChange={v => setFilter('season', v)}
                options={SEASONS} placeholder="Todas" />
              <Select label="Status" value={filters.status} onChange={v => setFilter('status', v)}
                options={STATUSES} placeholder="Todos" />
              <Select label="Tipo" value={filters.type} onChange={v => setFilter('type', v)}
                options={TYPES.map(t => ({ value: t, label: t }))} placeholder="Todos" />
              <Select label="Ordenar por" value={filters.sort} onChange={v => setFilter('sort', v)}
                options={SORTS} placeholder="Popularidade" />
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-4 transition-colors">
                <RiCloseLine size={14} /> Limpar filtros
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        <AnimeGrid animes={animes} loading={loading} />
        <Pagination
          page={filters.page}
          totalPages={pagination.totalPages}
          onChange={p => { const sp = new URLSearchParams(searchParams); sp.set('page', p); setSearchParams(sp); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      </div>
    </MainLayout>
  );
}
