export default function SeasonSelector({ seasons = [], currentSeason, onChange }) {
  if (!seasons || seasons.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {seasons.map(s => (
        <button
          key={s.number}
          onClick={() => onChange(s.number)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            s.number === currentSeason
              ? 'text-white shadow-lg shadow-purple-900/30'
              : 'bg-aw-card border border-aw-border text-aw-muted hover:border-aw-purple/40 hover:text-aw-text'
          }`}
          style={s.number === currentSeason ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)' } : {}}
        >
          {s.title || `Temporada ${s.number}`}
          {s.episodes_count > 0 && (
            <span className={`ml-1.5 text-xs ${s.number === currentSeason ? 'text-white/80' : 'text-aw-dim'}`}>
              ({s.episodes_count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
