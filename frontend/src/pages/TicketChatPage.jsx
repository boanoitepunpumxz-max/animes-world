import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  RiArrowLeftLine, RiSendPlaneLine, RiTicketLine,
  RiTimeLine, RiUserLine, RiCheckDoubleLine,
  RiLockLine, RiRefreshLine,
} from 'react-icons/ri';
import MainLayout from '../components/layout/MainLayout';
import { supportAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_CONFIG = {
  open:        { label: 'Aberto',         color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  in_progress: { label: 'Em atendimento', color: 'text-blue-400',   bg: 'bg-blue-500/20'   },
  resolved:    { label: 'Resolvido',      color: 'text-green-400',  bg: 'bg-green-500/20'  },
  closed:      { label: 'Fechado',        color: 'text-gray-400',   bg: 'bg-gray-500/20'   },
};

// Componente de mensagem individual
function Message({ msg, isOwn }) {
  const senderLabel = {
    USER:      'Você',
    ADMIN:     'Administrador',
    MODERATOR: 'Moderador',
    SYSTEM:    'Sistema',
  }[msg.sender_type] || msg.sender_name || 'Desconhecido';

  const isSystem = msg.sender_type === 'SYSTEM';

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs text-aw-dim bg-aw-surface px-3 py-1 rounded-full border border-aw-border">
          {msg.message}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden`}
        style={{ background: isOwn ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
        {msg.sender_avatar
          ? <img src={msg.sender_avatar} alt="" className="w-full h-full object-cover" />
          : (msg.sender_name || senderLabel)[0]?.toUpperCase()
        }
      </div>

      {/* Balão */}
      <div className={`max-w-[75%] sm:max-w-[65%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <span className="text-xs text-aw-dim px-1">
          {isOwn ? 'Você' : (msg.sender_name || senderLabel)}
        </span>
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isOwn
            ? 'rounded-tr-sm text-white'
            : 'rounded-tl-sm bg-aw-surface border border-aw-border text-aw-text'
        }`}
          style={isOwn ? { background: 'linear-gradient(135deg,#7c3aed,#be185d)' } : {}}>
          {msg.message}
        </div>
        <div className={`flex items-center gap-1 text-xs text-aw-dim px-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span>{format(new Date(msg.created_at), 'HH:mm')}</span>
          {isOwn && msg.read_at && <RiCheckDoubleLine size={12} className="text-aw-purple" />}
        </div>
      </div>
    </div>
  );
}

export default function TicketChatPage() {
  const { id }      = useParams();
  const { user }    = useAuth();
  const bottomRef   = useRef(null);
  const pollingRef  = useRef(null);
  const lastMsgRef  = useRef(null);

  const [ticket,   setTicket]   = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [text,     setText]     = useState('');
  const [sending,  setSending]  = useState(false);

  // Carrega o ticket completo
  const loadTicket = useCallback(async () => {
    try {
      const r = await supportAPI.getTicket(id);
      setTicket(r.data.data);
      setMessages(r.data.data.messages || []);
      if (r.data.data.messages?.length > 0) {
        lastMsgRef.current = r.data.data.messages.at(-1).created_at;
      }
    } catch (e) {
      toast.error('Ticket não encontrado.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Polling de novas mensagens a cada 5s
  const pollMessages = useCallback(async () => {
    if (!lastMsgRef.current) return;
    try {
      const r = await supportAPI.getMessages(id, lastMsgRef.current);
      const newMsgs = r.data.data || [];
      if (newMsgs.length > 0) {
        setMessages(prev => {
          const existing = new Set(prev.map(m => m.id));
          const fresh = newMsgs.filter(m => !existing.has(m.id));
          if (fresh.length === 0) return prev;
          lastMsgRef.current = fresh.at(-1).created_at;
          return [...prev, ...fresh];
        });
      }
    } catch (_) {}
  }, [id]);

  useEffect(() => {
    loadTicket();
    pollingRef.current = setInterval(pollMessages, 5000);
    return () => clearInterval(pollingRef.current);
  }, [loadTicket, pollMessages]);

  // Scroll para baixo quando novas mensagens chegam
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    if (ticket?.status === 'closed') {
      toast.error('Ticket encerrado. Não é possível enviar mensagens.');
      return;
    }

    setSending(true);
    const optimistic = {
      id: `opt-${Date.now()}`,
      sender_type: 'USER',
      sender_id: user?.id,
      sender_name: user?.username,
      sender_avatar: user?.avatar_url,
      message: text.trim(),
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages(prev => [...prev, optimistic]);
    setText('');

    try {
      const r = await supportAPI.sendMessage(id, optimistic.message);
      const real = r.data.data;
      setMessages(prev => prev.map(m => m.id === optimistic.id ? { ...real, sender_name: user?.username, sender_avatar: user?.avatar_url } : m));
      lastMsgRef.current = real.created_at;
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      toast.error(err.response?.data?.error || 'Erro ao enviar mensagem.');
      setText(optimistic.message);
    } finally {
      setSending(false);
    }
  }, [text, sending, ticket, id, user]);

  const handleCloseTicket = async () => {
    if (!confirm('Deseja encerrar este ticket?')) return;
    try {
      await supportAPI.updateStatus(id, 'closed');
      setTicket(prev => ({ ...prev, status: 'closed' }));
      setMessages(prev => [...prev, {
        id: `sys-${Date.now()}`, sender_type: 'SYSTEM',
        message: 'Ticket encerrado pelo usuário.',
        created_at: new Date().toISOString(),
      }]);
      toast.success('Ticket encerrado.');
    } catch { toast.error('Erro ao encerrar ticket.'); }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4 animate-pulse">
          <div className="skeleton h-8 w-64 rounded" />
          <div className="skeleton h-96 rounded-xl" />
        </div>
      </MainLayout>
    );
  }

  if (!ticket) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
          <p className="text-aw-muted">Ticket não encontrado.</p>
          <Link to="/meus-tickets" className="aw-btn-primary text-sm">Voltar</Link>
        </div>
      </MainLayout>
    );
  }

  const cfg     = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
  const isClosed = ticket.status === 'closed';
  const ticketNum = `#${String(ticket.ticket_number).padStart(5,'0')}`;

  return (
    <MainLayout>
      <Helmet><title>Ticket {ticketNum} — ANIMES WORLD</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 flex flex-col" style={{ minHeight: 'calc(100vh - 4rem)' }}>

        {/* Header do ticket */}
        <div className="aw-card p-5 mb-4">
          <div className="flex items-start gap-3">
            <Link to="/meus-tickets" className="aw-btn-ghost p-2 flex-shrink-0">
              <RiArrowLeftLine size={18} />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-aw-dim">{ticketNum}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
              <h1 className="text-base font-bold text-aw-text mt-1">{ticket.subject}</h1>
              <div className="flex items-center gap-3 mt-1 text-xs text-aw-muted flex-wrap">
                <span className="bg-aw-border px-2 py-0.5 rounded">{ticket.category}</span>
                <span className="flex items-center gap-1">
                  <RiTimeLine size={11} />
                  {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: ptBR })}
                </span>
                {ticket.assigned_to_name && (
                  <span className="flex items-center gap-1">
                    <RiUserLine size={11} />
                    Atendente: <strong>{ticket.assigned_to_name}</strong>
                  </span>
                )}
              </div>
            </div>
            {!isClosed && (
              <button onClick={handleCloseTicket}
                className="flex-shrink-0 text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors border border-red-500/20">
                <RiLockLine size={14} className="inline mr-1" />
                Encerrar
              </button>
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="aw-card flex flex-col flex-1" style={{ minHeight: '400px' }}>
          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1" style={{ maxHeight: '60vh' }}>
            {messages.length === 0 && (
              <div className="text-center py-8 text-aw-muted text-sm">
                Nenhuma mensagem ainda.
              </div>
            )}
            {messages.map(msg => (
              <Message
                key={msg.id}
                msg={msg}
                isOwn={msg.sender_id === user?.id || (msg.sender_type === 'USER' && !msg.sender_id)}
              />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Divider */}
          <div className="border-t border-aw-border" />

          {/* Campo de envio */}
          {isClosed ? (
            <div className="p-4 flex items-center justify-center gap-2 text-sm text-aw-muted">
              <RiLockLine size={16} />
              Ticket encerrado. Abra um novo ticket se precisar de mais ajuda.
            </div>
          ) : (
            <form onSubmit={handleSend} className="p-3 flex items-end gap-2">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }
                }}
                placeholder="Digite sua mensagem... (Enter para enviar)"
                rows={2}
                className="flex-1 bg-aw-surface border border-aw-border rounded-xl px-4 py-2.5 text-sm text-aw-text placeholder:text-aw-dim focus:outline-none focus:border-aw-purple resize-none transition-all"
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}
              >
                {sending
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <RiSendPlaneLine className="text-white" size={18} />
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
