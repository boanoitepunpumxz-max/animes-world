export default function EmptyState({ icon = '📭', title = 'Nada por aqui', message = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="text-5xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-aw-text">{title}</h3>
        {message && <p className="text-aw-muted text-sm mt-1">{message}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
