export default function ProgressBar({ percentage = 0, className = '', showLabel = false, height = 2 }) {
  const pct = Math.min(100, Math.max(0, percentage));
  return (
    <div className={`w-full bg-white/10 rounded-full overflow-hidden ${className}`} style={{ height }}>
      <div
        className="progress-bar h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
      {showLabel && (
        <span className="text-xs text-aw-muted mt-0.5 block">{Math.round(pct)}%</span>
      )}
    </div>
  );
}
