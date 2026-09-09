export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-aw-bg flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
          <span className="text-white font-black text-2xl">AW</span>
        </div>
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-aw-purple animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
