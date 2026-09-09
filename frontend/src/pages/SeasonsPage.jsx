import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '../components/layout/MainLayout';
import AnimeGrid from '../components/anime/AnimeGrid';
import { animeAPI } from '../services/api';

const SEASONS = [
  { value: 'WINTER', label: 'Inverno', icon: '❄️' },
  { value: 'SPRING', label: 'Primavera', icon: '🌸' },
  { value: 'SUMMER', label: 'Verão', icon: '☀️' },
  { value: 'FALL', label: 'Outono', icon: '🍂' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear - i);
const currentMonth = new Date().getMonth();
const defaultSeason = currentMonth < 3 ? 'WINTER' : currentMonth < 6 ? 'SPRING' : currentMonth < 9 ? 'SUMMER' : 'FALL';

export default function SeasonsPage() {
  const [year, setYear] = useState(currentYear);
  const [season, setSeason] = useState(defaultSeason);
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    animeAPI.getBySeason(year, season)
      .then(r => setAnimes(r.data.data || []))
      .finally(() => setLoading(false));
  }, [year, season]);

  const currentSeasonInfo = SEASONS.find(s => s.value === season);

  return (
    <MainLayout>
      <Helmet><title>Temporadas — ANIMES WORLD</title></Helmet>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-black text-white mb-6">📅 Temporadas</h1>

        {/* Seletor */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2">
            {SEASONS.map(s => (
              <button key={s.value} onClick={() => setSeason(s.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  s.value === season
                    ? 'text-white shadow-lg'
                    : 'aw-btn-secondary'
                }`}
                style={s.value === season ? { background:'linear-gradient(135deg,#a855f7,#ec4899)' } : {}}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <select value={year} onChange={e => setYear(parseInt(e.target.value))}
            className="aw-input w-28 py-2 text-sm">
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <h2 className="text-lg font-bold text-aw-text mb-6">
          {currentSeasonInfo?.icon} {currentSeasonInfo?.label} {year}
          {animes.length > 0 && <span className="text-sm text-aw-muted ml-2">({animes.length} animes)</span>}
        </h2>

        <AnimeGrid animes={animes} loading={loading}
          emptyMessage={`Nenhum anime encontrado para ${currentSeasonInfo?.label} ${year}.`} />
      </div>
    </MainLayout>
  );
}
