import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { RiEditLine, RiHeartLine, RiHistoryLine, RiBookmarkLine, RiTimeLine } from 'react-icons/ri';
import MainLayout from '../components/layout/MainLayout';
import { ProfileSkeleton } from '../components/ui/Skeleton';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getProfile()
      .then(r => setProfile(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const hoursWatched = profile ? Math.round((profile.minutes_watched || 0) / 60) : 0;

  return (
    <MainLayout>
      <Helmet><title>Perfil — ANIMES WORLD</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {loading ? <ProfileSkeleton /> : (
          <>
            {/* Header do perfil */}
            <div className="aw-card p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-aw-border flex-shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white"
                    style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
                    {profile?.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-white">{profile?.username}</h1>
                <p className="text-sm text-aw-muted">{profile?.email}</p>
                {profile?.bio && <p className="text-sm text-aw-muted mt-1">{profile.bio}</p>}
                <p className="text-xs text-aw-dim mt-1">
                  Membro há{' '}
                  {formatDistanceToNow(new Date(profile?.created_at), { addSuffix: false, locale: ptBR })}
                </p>
              </div>
              <Link to="/configuracoes" className="aw-btn-secondary flex items-center gap-2 text-sm flex-shrink-0">
                <RiEditLine size={14} /> Editar
              </Link>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: RiHistoryLine, label: 'Episódios assistidos', value: (profile?.episodes_watched || 0).toLocaleString(), color: 'text-aw-purple' },
                { icon: RiTimeLine, label: 'Horas assistidas', value: `${hoursWatched}h`, color: 'text-blue-400' },
                { icon: RiBookmarkLine, label: 'Animes na lista', value: (profile?.animes_watched || 0).toLocaleString(), color: 'text-green-400' },
                { icon: RiHeartLine, label: 'Favoritos', value: (profile?.favorites_count || 0).toLocaleString(), color: 'text-red-400' },
              ].map(stat => (
                <div key={stat.label} className="aw-card p-5 text-center">
                  <stat.icon className={`${stat.color} text-2xl mx-auto mb-2`} />
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-aw-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Ações rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { to: '/historico', icon: RiHistoryLine, label: 'Histórico', desc: 'Veja o que assistiu' },
                { to: '/minha-lista', icon: RiBookmarkLine, label: 'Minha Lista', desc: 'Animes salvos' },
                { to: '/configuracoes', icon: RiEditLine, label: 'Configurações', desc: 'Personalize sua conta' },
              ].map(item => (
                <Link key={item.to} to={item.to}
                  className="aw-card p-5 flex items-center gap-3 hover:border-aw-purple/40 hover:-translate-y-0.5 transition-all">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(168,85,247,0.15)' }}>
                    <item.icon className="text-aw-purple text-lg" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-aw-text">{item.label}</p>
                    <p className="text-xs text-aw-muted">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
