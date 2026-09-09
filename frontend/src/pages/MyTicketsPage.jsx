import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  RiTicketLine, RiAddLine, RiArrowRightLine,
  RiTimeLine, RiUserLine, RiCheckLine, RiCloseLine,
} from 'react-icons/ri';
import MainLayout from '../components/layout/MainLayout';
import { supportAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_CONFIG = {
  open:        { label: 'Aberto',          color: 'bg-yellow-500/20 text-yellow-400',  dot: 'bg-yellow-400' },
  in_progress: { label: 'Em atendimento',  color: 'bg-blue-500/20 text-blue-400',      dot: 'bg-blue-400'   },
  resolved:    { label: 'Resolvido',       color: 'bg-green-500/20 text-green-400',    dot: 'bg-green-400'  },
  closed:      { label: 'Fechado',         color: 'bg-gray-500/20 text-gray-400',      dot: 'bg-gray-400'   },
};

const TABS = [
  { value: '',            label: 'Todos' },
  { value: 'open',        label: 'Abertos' },
  { value: 'in_progress', label: 'Em atendimento' },
  { value: 'resolved',    label: 'Resolvidos' },
  { value: 'closed',      label: 'Fechados' },
];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    supportAPI.getMyTickets(activeTab ? { status: activeTab } : {})
      .then(r => setTickets(r.data.data || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  const formatNum = n => `#${String(n).padStart(5, '0')}`;

  return (
    <MainLayout>
      <Helmet><title>Meus Tickets — ANIMES WORLD</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <RiTicketLine className="text-aw-purple" />
              Meus Tickets
            </h1>
            <p className="text-sm text-aw-muted mt-1">Acompanhe suas solicitações de suporte.</p>
          </div>
          <Link to="/suporte" className="aw-btn-primary flex items-center gap-2 text-sm">
            <RiAddLine size={16} /> Novo Ticket
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-aw-border pb-4">
          {TABS.map(t => (
            <button key={t.value} onClick={() => setActiveTab(t.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                t.value === activeTab ? 'text-white' : 'text-aw-muted hover:text-aw-text hover:bg-white/5'
              }`}
              style={t.value === activeTab ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)' } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="aw-card p-5 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <RiTicketLine className="text-aw-dim text-5xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-aw-text">Nenhum ticket encontrado</h3>
            <p className="text-aw-muted text-sm mt-1 mb-6">
              {activeTab ? 'Nenhum ticket com esse status.' : 'Você ainda não abriu nenhum ticket de suporte.'}
            </p>
            <Link to="/suporte" className="aw-btn-primary text-sm">Abrir meu primeiro ticket</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map(ticket => {
              const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
              const hasUnread = parseInt(ticket.unread_count) > 0;
              return (
                <button
                  key={ticket.id}
                  onClick={() => navigate(`/meus-tickets/${ticket.id}`)}
                  className={`w-full text-left aw-card p-5 hover:border-aw-purple/40 transition-all duration-200 group ${
                    hasUnread ? 'border-aw-purple/30 bg-aw-purple/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Número */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(236,72,153,0.2))' }}>
                      <span className="text-aw-purple">{String(ticket.ticket_number).padStart(3,'0')}</span>
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-aw-text group-hover:text-aw-purple-light transition-colors">
                            {ticket.subject}
                          </span>
                          {hasUnread && (
                            <span className="w-2 h-2 rounded-full bg-aw-purple flex-shrink-0" />
                          )}
                        </div>
                        <StatusBadge status={ticket.status} />
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-aw-muted">
                        <span className="bg-aw-border px-2 py-0.5 rounded">{ticket.category}</span>
                        <span className="flex items-center gap-1">
                          <RiTimeLine size={12} />
                          {formatDistanceToNow(new Date(ticket.last_message_at || ticket.created_at), { addSuffix: true, locale: ptBR })}
                        </span>
                        {ticket.assigned_to_name && (
                          <span className="flex items-center gap-1">
                            <RiUserLine size={12} />
                            {ticket.assigned_to_name}
                          </span>
                        )}
                      </div>

                      {ticket.last_message && (
                        <p className="text-xs text-aw-dim mt-2 line-clamp-1">
                          {ticket.last_sender_type !== 'USER' ? '📩 ' : ''}
                          {ticket.last_message}
                        </p>
                      )}
                    </div>

                    <RiArrowRightLine className="text-aw-dim group-hover:text-aw-purple transition-colors flex-shrink-0 mt-1" size={18} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
