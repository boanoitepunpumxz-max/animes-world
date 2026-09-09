import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { RiBellLine, RiCheckDoubleLine, RiTicketLine, RiArrowRightLine } from 'react-icons/ri';
import MainLayout from '../components/layout/MainLayout';
import EmptyState from '../components/ui/EmptyState';
import { notificationsAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    notificationsAPI.getAll()
      .then(r => setNotifications(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await notificationsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Todas marcadas como lidas.');
  };

  const markRead = async (id) => {
    await notificationsAPI.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClick = async (n) => {
    if (!n.read) await markRead(n.id);
    if (n.action_url) navigate(n.action_url);
  };

  return (
    <MainLayout>
      <Helmet><title>Notificações — ANIMES WORLD</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <RiBellLine className="text-aw-purple" /> Notificações
          </h1>
          {notifications.some(n => !n.read) && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm text-aw-purple hover:text-aw-purple-light transition-colors">
              <RiCheckDoubleLine size={16} /> Marcar todas como lidas
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({length:5}).map((_,i)=>(
              <div key={i} className="aw-card p-4 flex gap-3 animate-pulse">
                <div className="w-10 h-10 skeleton rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState icon="🔔" title="Nenhuma notificação" message="Você está em dia!" />
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <button key={n.id} onClick={() => handleClick(n)}
                className={`w-full text-left aw-card p-4 flex items-start gap-3 transition-all ${
                  !n.read ? 'border-aw-purple/30 bg-aw-purple/5' : 'opacity-70 hover:opacity-100'
                }`}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-aw-purple' : 'bg-transparent'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-aw-text">{n.title}</p>
                  {n.message && <p className="text-xs text-aw-muted mt-0.5">{n.message}</p>}
                  <p className="text-xs text-aw-dim mt-1">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
                {n.action_url && <RiArrowRightLine className="text-aw-dim flex-shrink-0 mt-1" size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
