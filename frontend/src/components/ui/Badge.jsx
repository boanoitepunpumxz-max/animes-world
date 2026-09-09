export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:   'bg-white/10 text-aw-muted',
    purple:    'bg-aw-purple/20 text-aw-purple-light',
    green:     'bg-green-500/20 text-green-400',
    red:       'bg-red-500/20 text-red-400',
    yellow:    'bg-yellow-500/20 text-yellow-400',
    blue:      'bg-blue-500/20 text-blue-400',
    releasing: 'bg-green-500/20 text-green-400',
    finished:  'bg-blue-500/20 text-blue-400',
    hiatus:    'bg-yellow-500/20 text-yellow-400',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
