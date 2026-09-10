/**
 * ANIMES WORLD — Painel Admin: Tickets de Suporte
 * Chat lateral em tempo real (polling 5s)
 * Botões: Assumir | Responder | Resolver | Fechar | Reabrir
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import {
  RiSendPlaneLine, RiUserLine, RiTimeLine, RiRefreshLine,
  RiCloseLine, RiCheckLine, RiLockLine, RiUserAddLine,
  RiSearchLine, RiArrowRightSLine,
} from 'react-icons/ri';

// ── Configuração de status ────────────────────────────────────
const S = {
  open:        { label: 'Aberto',         cls: 'text-yellow-400 bg-yellow-500/20' },
  in_progress: { label: 'Em atendimento', cls: 'text-blue-400 bg-blue-500/20'     },
  resolved:    { label: 'Resolvido',      cls: 'text-green-400 bg-green-500/20'   },
  closed:      { label: 'Fechado',        cls: 'text-gray-400 bg-gray-500/20'     },
};

const TABS = [
  { v: '',            l: 'Todos' },
  { v: 'open',        l: 'Abertos' },
  { v: 'in_progress', l: 'Em atendimento' },
  { v: 'resolved',    l: 'Resolvidos' },
  { v: 'closed',      l: 'Fechados' },
];

// ── Bubble de mensagem ────────────────────────────────────────
function Bubble({ msg }) {
  const isSystem = msg.sender_type === 'SYSTEM';
  const isAdmin  = msg.sender_type === 'ADMIN' || msg.sender_type === 'MODERATOR';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-aw-dim bg-aw-card px-3 py-1 rounded-full border border-aw-border">
          {msg.message}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 mb-3 ${isAdmin ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden"
        style={{ background: isAdmin
          ? 'linear-gradient(135deg,#a855f7,#ec4899)'
          : 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
        {msg.sender_avatar
          ? <img src={msg.sender_avatar} className="w-full h-full object-cover" alt="" />
          : (msg.sender_name || msg.sender_type || '?')[0].toUpperCase()
        }
      </div>

      {/* Balão */}
      <div className={`max-w-[75%] flex flex-col gap-0.5 ${isAdmin ? 'items-end' : 'items-start'}`}>
        <span className="text-xs text-aw-dim px-0.5">
          {msg.sender_type === 'ADMIN' ? 'Administrador'
            : msg.sender_type === 'MODERATOR' ? 'Moderador'
            : (msg.sender_name || 'Usuário')}
        </span>
        <div className={`px-3 py-2 text-sm rounded-2xl leading-relaxed ${
          isAdmin
            ? 'text-white rounded-tr-sm'
            : 'bg-aw-bg border border-aw-border text-aw-text rounded-tl-sm'
        }`}
          style={isAdmin ? { background: 'linear-gradient(135deg,#7c3aed,#be185d)' } : {}}>
          {msg.message}
        </div>
        <span className="text-xs text-aw-dim px-0.5">
          {format(new Date(msg.created_at), 'HH:mm dd/MM', { locale: ptBR })}
        </span>
      </div>
    </div>
  );
}

// ── Painel lateral de chat ────────────────────────────────────
function TicketPanel({ ticketId, onClose, onUpdated }) {
  const { user }   = useAuth();
  const bottomRef  = useRef(null);
  const pollRef    = useRef(null);
  const lastRef    = useRef(null);

  const [ticket,  setTicket]  = useState(null);
  const [msgs,    setMsgs]    = useState([]);
  const [text,    setText]    = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carrega ticket + mensagens
  const loadTicket = useCallback(async () => {
    try {
      const r = await adminAPI.getTicket(ticketId);
      const t = r.data.data;
      setTicket(t);
      setMsgs(t.messages || []);
      if ((t.messages || []).length > 0) {
        lastRef.current = t.messages.at(-1).created_at;
      }
    } catch { toast.error('Erro ao abrir ticket.'); }
    finally { setLoading(false); }
  }, [ticketId]);

  // Polling de novas mensagens (5s)
  const poll = useCallback(async () => {
    if (!lastRef.current) return;
    try {
      const r = await adminAPI.getMessages(ticketId, lastRef.current);
      const newM = r.data.data || [];
      if (newM.length > 0) {
        setMsgs(prev => {
          const ids = new Set(prev.map(m => m.id));
          const fresh = newM.filter(m => !ids.has(m.id));
          if (!fresh.length) return prev;
          lastRef.current = fresh.at(-1).created_at;
          return [...prev, ...fresh];
        });
      }
    } catch (_) {}
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
    pollRef.current = setInterval(poll, 5000);
    return () => clearInterval(pollRef.current);
  }, [loadTicket, poll]);

  // Scroll automático
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  // Envia mensagem
  const handleSend = useCallback(async (e) => {
    e?.preventDefault();
    const txt = text.trim();
    if (!txt || sending || !ticket) return;
    if (ticket.status === 'closed') { toast.error('Ticket encerrado.'); return; }

    setSending(true);
    const optimistic = {
      id: `opt-${Date.now()}`, sender_type: 'ADMIN',
      sender_id: user?.id, sender_name: user?.username,
      sender_avatar: user?.avatar_url,
      message: txt, created_at: new Date().toISOString(),
    };
    setMsgs(p => [...p, optimistic]);
    setText('');

    try {
      // Usa sendMessage (POST /messages) que é mais robusto que adminReplyTicket
      const r = await adminAPI.sendMessage(ticketId, txt);
      const real = r.data.data;
      real.sender_name   = user?.username;
      real.sender_avatar = user?.avatar_url;
      setMsgs(p => p.map(m => m.id === optimistic.id ? real : m));
      lastRef.current = real.created_at;
      toast.success('Mensagem enviada!');
    } catch (err) {
      setMsgs(p => p.filter(m => m.id !== optimistic.id));
      setText(txt);
      toast.error(err.response?.data?.error || 'Erro ao enviar mensagem.');
    } finally {
      setSending(false);
    }
  }, [text, sending, ticket, ticketId, user]);

  // Assume o ticket
  const handleAssign = async () => {
    try {
      await adminAPI.assignTicket(ticketId);
      toast.success('Ticket assumido!');
      loadTicket();
      onUpdated?.();
    } catch (err) { toast.error(err.response?.data?.error || 'Erro.'); }
  };

  // Muda status
  const handleStatus = async (newStatus) => {
    try {
      await adminAPI.updateStatus(ticketId, newStatus);
      toast.success(`Ticket marcado como ${S[newStatus]?.label || newStatus}.`);
      loadTicket();
      onUpdated?.();
    } catch (err) { toast.error(err.response?.data?.error || 'Erro.'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-aw-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!ticket) return null;

  const cfg      = S[ticket.status] || S.open;
  const isClosed = ticket.status === 'closed';
  const num      = `#${String(ticket.ticket_number).padStart(5,'0')}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header do chat */}
      <div className="p-4 border-b border-aw-border flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-aw-dim">{num}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>{cfg.label}</span>
            </div>
            <p className="text-sm font-bold text-aw-text truncate mt-0.5">{ticket.subject}</p>
            <div className="text-xs text-aw-muted mt-0.5 flex flex-wrap gap-2">
              <span className="flex items-center gap-1">
                <RiUserLine size={11}/>{ticket.user_name}
              </span>
              {ticket.assigned_to_name && (
                <span className="text-aw-dim">Atendente: {ticket.assigned_to_name}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="aw-btn-ghost p-1.5 flex-shrink-0">
            <RiCloseLine size={18}/>
          </button>
        </div>

        {/* Botões de ação */}
        {!isClosed && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {!ticket.assigned_to && (
              <button onClick={handleAssign}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                <RiUserAddLine size={13}/> Assumir
              </button>
            )}
            {ticket.status !== 'resolved' && (
              <button onClick={() => handleStatus('resolved')}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                <RiCheckLine size={13}/> Resolver
              </button>
            )}
            <button onClick={() => handleStatus('closed')}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
              <RiLockLine size={13}/> Fechar
            </button>
          </div>
        )}
        {isClosed && (
          <div className="mt-3">
            <button onClick={() => handleStatus('open')}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors">
              🔓 Reabrir ticket
            </button>
          </div>
        )}
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-0.5" style={{ minHeight: 0 }}>
        {msgs.length === 0 && (
          <p className="text-center text-sm text-aw-muted py-6">Nenhuma mensagem ainda.</p>
        )}
        {msgs.map(m => <Bubble key={m.id} msg={m} />)}
        <div ref={bottomRef} />
      </div>

      {/* Campo de envio */}
      <div className="border-t border-aw-border p-3 flex-shrink-0">
        {isClosed ? (
          <p className="text-center text-sm text-aw-muted py-1">Ticket encerrado — sem novas mensagens.</p>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2 items-end">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Digite sua resposta... (Enter para enviar)"
              rows={2}
              className="flex-1 bg-aw-bg border border-aw-border rounded-xl px-3 py-2 text-sm text-aw-text placeholder:text-aw-dim focus:outline-none focus:border-aw-purple resize-none transition-all"
            />
            <button type="submit" disabled={sending || !text.trim()}
              className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
              {sending
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <RiSendPlaneLine className="text-white" size={18}/>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function AdminTickets() {
  const [tickets,      setTickets]      = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState('');
  const [search,       setSearch]       = useState('');
  const [pagination,   setPagination]   = useState({ total: 0, totalPages: 1, page: 1 });
  const [selectedId,   setSelectedId]   = useState(null);

  const load = useCallback((page = 1) => {
    setLoading(true);
    adminAPI.getTickets({ status: tab || undefined, page, limit: 20, q: search || undefined })
      .then(r => {
        setTickets(r.data.data || []);
        setPagination(r.data.pagination || {});
        setStatusCounts(r.data.statusCounts || {});
      })
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [tab, search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            🎧 Tickets de Suporte
          </h2>
          <p className="text-sm text-aw-muted mt-0.5">{pagination.total} tickets no sistema</p>
        </div>
        <button onClick={() => load()} className="aw-btn-ghost flex items-center gap-1.5 text-sm">
          <RiRefreshLine size={16}/> Atualizar
        </button>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-shrink-0">
        {[
          { label: 'Total', v: (statusCounts.open||0)+(statusCounts.in_progress||0)+(statusCounts.resolved||0)+(statusCounts.closed||0), color: 'text-aw-purple' },
          { label: 'Abertos', v: statusCounts.open || 0, color: 'text-yellow-400' },
          { label: 'Em atend.', v: statusCounts.in_progress || 0, color: 'text-blue-400' },
          { label: 'Resolvidos', v: statusCounts.resolved || 0, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="aw-card p-3 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.v}</p>
            <p className="text-xs text-aw-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Layout principal: lista + chat */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* Lista de tickets */}
        <div className={`flex flex-col min-h-0 ${selectedId ? 'hidden lg:flex lg:w-1/2' : 'w-full'}`}>
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-3 flex-shrink-0">
            {TABS.map(t => (
              <button key={t.v} onClick={() => setTab(t.v)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  t.v === tab ? 'text-white' : 'text-aw-muted hover:text-aw-text hover:bg-white/5'
                }`}
                style={t.v === tab ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)' } : {}}>
                {t.l}
                {t.v && statusCounts[t.v] > 0 && (
                  <span className="ml-1 opacity-70">({statusCounts[t.v]})</span>
                )}
              </button>
            ))}
          </div>

          {/* Busca */}
          <div className="flex gap-2 mb-3 flex-shrink-0">
            <div className="relative flex-1">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-aw-dim" size={15}/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && load(1)}
                placeholder="Buscar tickets..."
                className="aw-input pl-9 py-2 text-sm w-full" />
            </div>
            <button onClick={() => load(1)} className="aw-btn-primary text-sm px-3 py-2">Buscar</button>
          </div>

          {/* Tabela */}
          <div className="aw-card overflow-auto flex-1">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-aw-border">
                  {['#','Usuário','Assunto','Categoria','Status','Atualização','Ações'].map(h => (
                    <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-aw-dim uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({length:5}).map((_,i) => (
                      <tr key={i}><td colSpan={7} className="px-3 py-2"><div className="skeleton h-8 rounded" /></td></tr>
                    ))
                  : tickets.length === 0
                  ? <tr><td colSpan={7} className="text-center py-8 text-aw-muted text-sm">Nenhum ticket encontrado.</td></tr>
                  : tickets.map(t => {
                      const cfg = S[t.status] || S.open;
                      const hasUnread = parseInt(t.unread_count) > 0;
                      return (
                        <tr key={t.id}
                          className={`border-b border-aw-border/50 transition-colors cursor-pointer ${
                            selectedId === t.id
                              ? 'bg-aw-purple/15'
                              : hasUnread ? 'bg-aw-purple/5 hover:bg-aw-purple/10' : 'hover:bg-white/2'
                          }`}
                          onClick={() => setSelectedId(t.id)}>
                          <td className="px-3 py-3 font-mono text-xs text-aw-dim">
                            #{String(t.ticket_number).padStart(5,'0')}
                            {hasUnread && <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-aw-purple" />}
                          </td>
                          <td className="px-3 py-3">
                            <p className="font-medium text-aw-text text-xs">{t.user_name || '—'}</p>
                            <p className="text-aw-dim text-xs truncate max-w-[100px]">{t.user_email}</p>
                          </td>
                          <td className="px-3 py-3 text-xs text-aw-muted max-w-[130px] truncate">{t.subject}</td>
                          <td className="px-3 py-3"><span className="text-xs bg-aw-border px-2 py-0.5 rounded text-aw-muted">{t.category}</span></td>
                          <td className="px-3 py-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>{cfg.label}</span>
                          </td>
                          <td className="px-3 py-3 text-xs text-aw-dim">
                            {formatDistanceToNow(new Date(t.last_message_at || t.updated_at), { addSuffix: true, locale: ptBR })}
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={e => { e.stopPropagation(); setSelectedId(t.id); }}
                              className="flex items-center gap-1 text-xs bg-aw-purple/20 text-aw-purple hover:bg-aw-purple/30 px-2 py-1 rounded transition-colors">
                              Abrir <RiArrowRightSLine size={13}/>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-3 flex-shrink-0">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => load(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                    p === pagination.page ? 'text-white' : 'text-aw-muted hover:text-aw-text hover:bg-white/5'
                  }`}
                  style={p === pagination.page ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)' } : {}}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Painel do chat (lateral no desktop, tela cheia no mobile) */}
        {selectedId && (
          <div className={`aw-card flex-1 min-h-0 flex flex-col lg:flex ${selectedId ? 'flex' : 'hidden'}`}
            style={{ height: 'calc(100vh - 12rem)' }}>
            <TicketPanel
              ticketId={selectedId}
              onClose={() => setSelectedId(null)}
              onUpdated={load}
            />
          </div>
        )}
      </div>
    </div>
  );
}
