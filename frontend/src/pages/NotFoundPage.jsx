import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  return (
    <>
      <Helmet><title>404 — ANIMES WORLD</title></Helmet>
      <div className="min-h-screen bg-aw-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* BG decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-10"
            style={{ background: 'radial-gradient(circle, #a855f7, #ec4899)' }} />
        </div>

        <div className="text-center relative z-10 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
              style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
              AW
            </div>
          </div>

          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text mb-4"
            style={{ backgroundImage: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
            404
          </h1>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Esse episódio se perdeu no mundo dos animes
          </h2>

          <p className="text-aw-muted text-sm mb-8 max-w-md mx-auto">
            A página que você está procurando não existe ou foi movida para outra dimensão.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/home" className="aw-btn-primary text-sm">
              Voltar para Home
            </Link>
            <Link to="/animes" className="aw-btn-secondary text-sm">
              Ver catálogo
            </Link>
          </div>

          <p className="mt-10 text-xs text-aw-dim tracking-widest">ANIMES WORLD — YOUR ANIME. OUR WORLD.</p>
        </div>
      </div>
    </>
  );
}
