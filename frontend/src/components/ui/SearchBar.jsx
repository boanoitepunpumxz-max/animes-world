import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';
import { searchAPI } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchBar({ autoFocus = false, placeholder = 'Pesquisar animes, gêneros...' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setSuggestions([]); return; }
    setLoading(true);
    searchAPI.suggestions(debouncedQuery)
      .then(r => setSuggestions(r.data.data || []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    function close(e) {
      if (!containerRef.current?.contains(e.target)) setSuggestions([]);
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length < 2) return;
    navigate(`/busca?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-aw-dim text-lg pointer-events-none" />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-aw-surface border border-aw-border rounded-xl pl-11 pr-10 py-3 text-sm text-aw-text placeholder:text-aw-dim focus:outline-none focus:border-aw-purple transition-all"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(''); setSuggestions([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-aw-dim hover:text-aw-muted">
            <RiCloseLine size={18} />
          </button>
        )}
      </form>

      {suggestions.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 aw-card shadow-2xl shadow-black/50 z-50 overflow-hidden animate-slide-down">
          {suggestions.map(anime => (
            <Link
              key={anime.slug}
              to={`/anime/${anime.slug}`}
              onClick={() => { setSuggestions([]); setQuery(''); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <img src={anime.cover_url} alt="" className="w-8 h-11 object-cover rounded flex-shrink-0 bg-aw-border" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-aw-text truncate">{anime.title_english || anime.title}</p>
                <p className="text-xs text-aw-muted">{anime.year} • {anime.type}</p>
              </div>
            </Link>
          ))}
          {query.length >= 2 && (
            <button onClick={handleSubmit}
              className="w-full text-left px-4 py-2.5 text-xs text-aw-purple border-t border-aw-border hover:bg-white/5 transition-colors">
              Ver todos os resultados para "{query}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
