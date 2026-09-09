import { useState, useEffect, useRef, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import {
  RiSendPlaneLine, RiUserLine, RiTimeLine,
  RiCheckLine, RiCloseLine, RiRefreshLine,
} from 'react-icons/ri';

const STATUS_CFG = {
  open:        { label: 'Aberto',         color: 'text-yellow-400 bg-yellow-500/20' },
  in_progress: { label: 'Em atendimento', color: 'text-blue-400 bg-blue-500/20'     },
  resolved:    { label: 'Resolvido',      color: 'text-green-400 bg-green-500/20'   },
  closed:      { label: 'Fechado',        color: 'text-gray-400 bg-gray-500/20'     },
};

const TABS = [
  { v: '',            l: 'Todos' },
  { v: 'open',        l: 'Abertos' },
  { v: 'in_progress', l: 'Em atendimento' },
  { v: 'resolved',    l: 'Resolvidos' },
  { v: 'closed',      l: 'Fechados' },
];

// ── Componente de Chat dentro do painel ──────────────────────
function TicketChat({ ticket, onClose, onUpdated }) {
  const { user }    = useAuth();
  const bottomRef   = useRef(null);
  const pollingRef  = useRef(null);
  const lastRef     = useRef(null);

  const [messages, setMessages] = useState(ticket.messages || []);
  const [text,     setText]     = useState('');
  const [status,   setStatus]   = useState(ticket.status);
  const [sending,  setSending]  = useState(false);

  useEffect(() => {
    if (messages.length > 0) lastRef.current = messages.at(-1).created_at;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Polling
  useEffect(() => {
    pollingRef.current = setInterval(async () => {
      if (!lastRef.current) return;
      try {
        const r = await adminAPI.getMessages(ticket.id, lastRef.current);
        const newMsgs = r.data.data || [];
        if (newMsgs.length > 0) {
          setMessages(prev => {
            const ids = new Set(prev.map(m => m.id));
            const fresh = newMsgs.filter(m => !ids.has(m.id));
            if (fresh.length === 0) return prev;
            lastRef.current = fresh.at(-1).created_at;
            return [...prev, ...fresh];
          });
        }
      } catch (_) {}
    }, 5000);
    return () => clearInterval(pollingRef.current);
  }, [ticket.id]);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const r = await adminAPI.replyTicket(ticket.id, { message: text.trim(), status: status !== ticket.status ? status : undefined });
      const msg = r.data.data;
      msg.sender_name   = user?.username;
      msg.sender_avatar = user?.avatar_url;
      setMessages(prev => [...prev, msg]);
      lastRef.current = msg.created_at;
      setText('');
      if (status !== ticket.status) onUpdated();
      toast.success('Resposta enviada!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao enviar.');
    } finally {
      setSending(false);
    }
  }, [text, sending, ticket, status, user, onUpdated]);

  const handleAssign = async () => {
    try {
      await adminAPI.assignTicket(ticket.id);
      toast.success('Ticket assumido!');
      onUpdated();
    } catch { toast.error('Erro.'); }
  };

  const isClosed = status === 'closed';
  const senderLabel = { USER:'Usuário', ADMIN:'Admin', MODERATOR:'Mod', SYSTEM:'Sistema' };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-aw-surface border border-aw-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '90vh', height: '90vh' }}>

        {/* Header */}
        <div className="p-4 border-b border-aw-border flex items-start justify-between gap-3 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-aw-dim">
                #{String(ticket.ticket_number).padStart(5,'0')}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CFG[status]?.color || ''}`}>
                {STATUS_CFG[status]?.label}
              </span>
            </div>
            <p className="text-sm font-bold text-aw-text mt-0.5 truncate">{ticket.subject}</p>
            <div className="flex items-center gap-2 text-xs text-aw-muted mt-0.5 flex-wrap">
              <span className="flex items-center gap-1"><RiUserLine size={11}/>{ticket.user_name}</span>
              <span>{ticket.user_email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!ticket.assigned_to_name && !isClosed && (
              <button onClick={handleAssign}
                className="text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg transition-colors">
                Assumir
              </button>
            )}
            <button onClick={onClose} className="aw-btn-ghost p-1.5">
              <RiCloseLine size={18} />
            </button>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {messages.map(msg => {
            const isAdmin = msg.sender_type === 'ADMIN' || msg.sender_type === 'MODERATOR';
            const isSystem = msg.sender_type === 'SYSTEM';

            if (isSystem) return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="text-xs text-aw-dim bg-aw-card px-3 py-1 rounded-full border border-aw-border">
                  {msg.message}
                </span>
              </div>
            );

            return (
              <div key={msg.id} className={`flex gap-2 mb-3 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold`}
                  style={{ background: isAdmin ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
                  {(msg.sender_name || msg.sender_type)[0]?.toUpperCase()}
                </div>
                <div className={`max-w-[70%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                  <span className="text-xs text-aw-dim">
                    {senderLabel[msg.sender_type] || msg.sender_name}
                  </span>
                  <div className={`rounded-2xl px-3 py-2 text-sm ${
                    isAdmin
                      ? 'text-white rounded-tr-sm'
                      : 'bg-aw-card border border-aw-border text-aw-text rounded-tl-sm'
                  }`}
                    style={isAdmin ? { background: 'linear-gradient(135deg,#7c3aed,#be185d)' } : {}}>
                    {msg.message}
                  </div>
                  <span className="text-xs text-aw-dim px-1">
                    {format(new Date(msg.created_at), 'HH:mm dd/MM')}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Resposta */}
        <div className="border-t border-aw-border p-3 flex-shrink-0">
          {isClosed ? (
            <p className="text-center text-sm text-aw-muted py-2">Ticket encerrado.</p>
          ) : (
            <form onSubmit={handleSend} className="space-y-2">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleSend(e);} }}
                placeholder="Digite sua resposta..."
                rows={2}
                className="w-full bg-aw-bg border border-aw-border rounded-xl px-3 py-2 text-sm text-aw-text placeholder:text-aw-dim focus:outline-none focus:border-aw-purple resize-none"
              />
              <div className="flex items-center gap-2">
                <select value={status} onChange={e => setStatus(e.target.value)}
                  className="aw-input text-xs py-1.5 flex-1">
                  <option value="open">Manter: Aberto</option>
                  <option value="in_progress">Manter: Em atendimento</option>
                  <option value="resolved">Marcar como Resolvido</option>
                  <option value="closed">Encerrar ticket</option>
                </select>
                <button type="submit" disabled={sending || !text.trim()}
                  className="flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg disabled:opacity-40 transition-all"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff' }}>
                  {sending
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><RiSendPlaneLine size={14} /> Enviar</>
                  }
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Página principal de Tickets Admin ────────────────────────
export default function AdminTickets() {
  const [tickets,      setTickets]      = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState('');
  const [search,       setSearch]       = useState('');
  const [pagination,   setPagination]   = useState({ total: 0, page: 1 });
  const [selected,     setSelected]     = useState(null);

  const load = useCallback((page = 1) => {
    setLoading(true);
    adminAPI.getTickets({ status: tab || undefined, page, limit: 20, q: search || undefined })
      .then(r => {
        setTickets(r.data.data || []);
        setPagination(r.data.pagination || {});
        setStatusCounts(r.data.statusCounts || {});
      })
      .finally(() => setLoading(false));
  }, [tab, search]);

  useEffect(() => { load(); }, [load]);

  const openTicket = async (t) => {
    try {
      const r = await adminAPI.getTicket(t.id);
      setSelected(r.data.data);
    } catch { toast.error('Erro ao abrir ticket.'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">🎫 Suporte / Tickets</h2>
          <p className="text-sm text-aw-muted mt-1">{pagination.total} tickets no sistema</p>
        </div>
        <button onClick={() => load()} className="aw-btn-ghost flex items-center gap-1.5 text-sm">
          <RiRefreshLine size={16} /> Atualizar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button key={t.v} onClick={() => setTab(t.v)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
              t.v === tab ? 'text-white' : 'text-aw-muted hover:text-aw-text hover:bg-white/5'
            }`}
            style={t.v === tab ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)' } : {}}>
            {t.l}
            {t.v && statusCounts[t.v] > 0 && (
              <span className="ml-1.5 text-xs opacity-80">({statusCounts[t.v]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Busca */}
      <div className="flex gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(1)}
          placeholder="Buscar por assunto, usuário ou e-mail..."
          className="aw-input flex-1 py-2 text-sm" />
        <button onClick={() => load(1)} className="aw-btn-primary text-sm px-4">Buscar</button>
      </div>

      {/* Tabela */}
      <div className="aw-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-aw-border">
              {['#','Usuário','Assunto','Categoria','Status','Responsável','Atualização','Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-aw-dim uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:5}).map((_,i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="skeleton h-8 rounded" /></td></tr>
              ))
            ) : tickets.map(t => {
              const cfg = STATUS_CFG[t.status] || STATUS_CFG.open;
              const hasUnread = parseInt(t.unread_count) > 0;
              return (
                <tr key={t.id} className={`border-b border-aw-border/50 hover:bg-white/2 transition-colors ${hasUnread ? 'bg-aw-purple/5' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs text-aw-dim">
                    #{String(t.ticket_number).padStart(5,'0')}
                    {hasUnread && <span className="ml-1.5 w-2 h-2 rounded-full bg-aw-purple inline-block" />}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-aw-text text-sm">{t.user_name}</p>
                    <p className="text-xs text-aw-muted">{t.user_email}</p>
                  </td>
                  <td className="px-4 py-3 text-aw-muted text-xs max-w-[160px] truncate">{t.subject}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-aw-border px-2 py-0.5 rounded text-aw-muted">{t.category}</span></td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-aw-muted">{t.assigned_to_name || '—'}</td>
                  <td className="px-4 py-3 text-xs text-aw-dim">
                    {formatDistanceToNow(new Date(t.last_message_at || t.updated_at), { addSuffix: true, locale: ptBR })}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openTicket(t)}
                      className="text-xs bg-aw-purple/20 text-aw-purple hover:bg-aw-purple/30 px-3 py-1.5 rounded-lg transition-colors">
                      Abrir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && tickets.length === 0 && (
          <p className="text-center py-8 text-aw-muted text-sm">Nenhum ticket encontrado.</p>
        )}
      </div>

      {/* Modal de chat */}
      {selected && (
        <TicketChat
          ticket={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => { load(); setSelected(null); }}
        />
      )}
    </div>
  );
}
