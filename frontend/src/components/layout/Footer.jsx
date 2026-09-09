import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-aw-surface border-t border-aw-border mt-16">
      <div className="max-w-[1600px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
                style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
                AW
              </div>
              <span className="text-sm font-bold text-aw-text tracking-wide">ANIMES WORLD</span>
            </div>
            <p className="text-xs text-aw-purple font-medium tracking-widest mb-3">YOUR ANIME. OUR WORLD.</p>
            <p className="text-xs text-aw-dim leading-relaxed">
              Sua plataforma completa para assistir animes online com qualidade e experiência premium.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="text-xs font-semibold text-aw-text uppercase tracking-wider mb-4">Navegação</h3>
            <ul className="space-y-2">
              {[
                { to: '/animes', label: 'Animes' },
                { to: '/generos', label: 'Gêneros' },
                { to: '/temporadas', label: 'Temporadas' },
                { to: '/populares', label: 'Popular' },
                { to: '/minha-lista', label: 'Minha Lista' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-aw-muted hover:text-aw-purple transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-xs font-semibold text-aw-text uppercase tracking-wider mb-4">Suporte</h3>
            <ul className="space-y-2">
              {[
                { to: '/faq', label: 'FAQ' },
                { to: '/suporte', label: 'Suporte' },
                { to: '/notificacoes', label: 'Notificações' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-aw-muted hover:text-aw-purple transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-aw-text uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              {[
                { to: '/termos-de-uso', label: 'Termos de Uso' },
                { to: '/privacidade', label: 'Privacidade' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-aw-muted hover:text-aw-purple transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-aw-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-aw-dim">
            © {year} ANIMES WORLD. Todos os direitos reservados.
          </p>
          <p className="text-xs text-aw-dim">
            Metadados fornecidos por{' '}
            <a href="https://anilist.co" target="_blank" rel="noopener noreferrer"
              className="text-aw-purple hover:text-aw-purple-light transition-colors">
              AniList
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
