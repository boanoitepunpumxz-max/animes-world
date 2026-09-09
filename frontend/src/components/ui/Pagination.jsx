import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const range = [];

  for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
    range.push(i);
  }

  if (page - delta > 2) range.unshift('...');
  if (page + delta < totalPages - 1) range.push('...');

  range.unshift(1);
  if (totalPages > 1) range.push(totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="aw-btn-ghost p-2 disabled:opacity-30"
      >
        <RiArrowLeftLine size={18} />
      </button>

      {range.map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="px-3 text-aw-dim">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
              p === page
                ? 'text-white'
                : 'text-aw-muted hover:text-aw-text hover:bg-white/5'
            }`}
            style={p === page ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)' } : {}}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="aw-btn-ghost p-2 disabled:opacity-30"
      >
        <RiArrowRightLine size={18} />
      </button>
    </div>
  );
}
