import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RiPlayFill, RiAddLine, RiCheckLine, RiStarFill, RiArrowLeftSLine, RiArrowRightSLine, RiInformationLine } from 'react-icons/ri';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '';

// Resolve a URL da imagem do hero — usa proxy com MAL ID quando disponível
function heroImg(anime, type = 'cover') {
  if (!anime) return '';
  // Se tem external_id (MAL), usa proxy Kitsu
  if (anime.external_id && API_URL) {
    if (type === 'banner') {
      return `${API_URL}/api/proxy/image?mal_id=${anime.external_id}&type=banner`;
    }
    return `${API_URL}/api/proxy/image?mal_id=${anime.external_id}`;
  }
  // Fallback direto
  return anime.banner_url || anime.background_url || anime.cover_url || '';
}
import toast from 'react-hot-toast';

export default function HeroBanner({ animes = [] }) {
  const [current, setCurrent] = useState(0);
  const [inList, setInList] = useState(false);
  const { isAuthenticated } = useAuth();

  const anime = animes[current];

  const next = useCallback(() => setCurrent(i => (i + 1) % animes.length), [animes.length]);
  const prev = () => setCurrent(i => (i - 1 + animes.length) % animes.length);

  // Auto-rotate a cada 8s
  useEffect(() => {
    if (animes.length <= 1) return;
    const t = setInterval(next, 8000);
    return () => clearInterval(t);
  }, [next, animes.length]);

  const handleWatchlist = async () => {
    if (!isAuthenticated) { toast.error('Faça login primeiro.'); return; }
    try {
      await userAPI.updateWatchlist(anime.id, inList ? 'dropped' : 'want_to_watch');
      setInList(!inList);
      toast.success(inList ? 'Removido da lista.' : 'Adicionado à sua lista!');
    } catch {
      toast.error('Erro ao atualizar lista.');
    }
  };

  if (!anime) return null;

  const genres = anime.genres?.slice(0, 4) || [];

  return (
    <div className="relative w-full h-[500px] md:h-[560px] lg:h-[620px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImg(anime, 'banner')}
          alt=""
          onError={(e) => {
            e.target.onerror = null;
            // Se banner falhou, tenta a capa
            const coverUrl = heroImg(anime, 'cover');
            if (e.target.src !== coverUrl) e.target.src = coverUrl;
            else e.target.style.display = 'none';
          }}
          className="w-full h-full object-cover object-top transition-opacity duration-700"
          key={anime.id}
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-t from-aw-bg via-aw-bg/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-[1600px] mx-auto px-4 md:px-8 flex items-end pb-16 md:pb-20">
        <div className="max-w-2xl animate-fade-in" key={anime.id}>

          {/* Gêneros */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {genres.map(g => (
                <span key={g.slug || g.name}
                  className="text-xs px-2.5 py-1 rounded-full border border-aw-purple/40 text-aw-purple-light bg-aw-purple/10">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Título */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 drop-shadow-lg">
            {anime.title_english || anime.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center flex-wrap gap-3 mb-4 text-sm text-aw-muted">
            {anime.score && (
              <span className="flex items-center gap-1 text-yellow-400">
                <RiStarFill size={14} />
                <span className="font-semibold">{parseFloat(anime.score).toFixed(1)}</span>
              </span>
            )}
            {anime.year && <span>{anime.year}</span>}
            {anime.type && <span className="px-2 py-0.5 bg-white/10 rounded text-xs">{anime.type}</span>}
            {anime.episodes_count > 0 && <span>{anime.episodes_count}+ episódios</span>}
          </div>

          {/* Sinopse */}
          {anime.description && (
            <p className="text-sm md:text-base text-aw-muted leading-relaxed mb-6 line-clamp-3 max-w-xl">
              {anime.description}
            </p>
          )}

          {/* Botões */}
          <div className="flex flex-wrap gap-3">
            <Link to={`/anime/${anime.slug}`}
              className="aw-btn-primary flex items-center gap-2 text-sm">
              <RiPlayFill size={18} /> Assistir Agora
            </Link>
            <button onClick={handleWatchlist}
              className="aw-btn-secondary flex items-center gap-2 text-sm">
              {inList ? <RiCheckLine size={18} /> : <RiAddLine size={18} />}
              {inList ? 'Na Lista' : 'Minha Lista'}
            </button>
            <Link to={`/anime/${anime.slug}`}
              className="aw-btn-ghost flex items-center gap-1.5 text-sm">
              <RiInformationLine size={16} /> Mais Detalhes
            </Link>
          </div>
        </div>
      </div>

      {/* Controles do carrossel */}
      {animes.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <RiArrowLeftSLine size={22} />
          </button>
          <button onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <RiArrowRightSLine size={22} />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            {animes.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 h-2 bg-aw-purple' : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                }`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
