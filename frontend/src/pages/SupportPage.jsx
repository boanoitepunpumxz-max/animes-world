import { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiHeadphoneLine, RiTicketLine, RiCheckLine,
  RiArrowRightLine, RiAddLine,
} from 'react-icons/ri';
import MainLayout from '../components/layout/MainLayout';
import { supportAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Problema no player',
  'Problema na conta',
  'Anime não encontrado',
  'Episódio com erro',
  'Bug no site',
  'Sugestão',
  'Outro',
];

export default function SupportPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [subject,    setSubject]    = useState('');
  const [category,   setCategory]   = useState('');
  const [message,    setMessage]    = useState('');
  const [loading,    setLoading]    = useState(false);
  const [createdId,  setCreatedId]  = useState(null);
  const [createdNum, setCreatedNum] = useState(null);

  const handleSubject  = useCallback(e => setSubject(e.target.value),  []);
  const handleCategory = useCallback(e => setCategory(e.target.value), []);
  const handleMessage  = useCallback(e => setMessage(e.target.value),  []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!subject.trim() || !category || !message.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const r = await supportAPI.createTicket({
        subject: subject.trim(),
        category,
        message: message.trim(),
      });
      setCreatedId(r.data.ticket.id);
      setCreatedNum(r.data.ticket.ticket_number);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [subject, category, message]);

  const handleNewTicket = useCallback(() => {
    setCreatedId(null);
    setCreatedNum(null);
    setSubject('');
    setCategory('');
    setMessage('');
  }, []);

  return (
    <MainLayout>
      <Helmet><title>Suporte — ANIMES WORLD</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <RiHeadphoneLine className="text-aw-purple" />
              Suporte
            </h1>
            <p className="text-aw-muted text-sm mt-1">
              Encontrou um problema ou tem uma dúvida?{' '}
              <span className="text-aw-purple">Fale conosco.</span>
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/meus-tickets"
              className="flex items-center gap-1.5 text-sm text-aw-purple hover:text-aw-purple-light transition-colors flex-shrink-0">
              <RiTicketLine size={16} /> Meus tickets
            </Link>
          )}
        </div>

        {/* Não logado */}
        {!isAuthenticated && (
          <div className="aw-card p-8 text-center">
            <p className="text-aw-muted mb-4">Faça login para abrir um ticket de suporte.</p>
            <Link to="/login" className="aw-btn-primary">Fazer login</Link>
          </div>
        )}

        {/* Sucesso após criar ticket */}
        {isAuthenticated && createdId && (
          <div className="aw-card p-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <RiCheckLine className="text-green-400 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-aw-text">Ticket enviado!</h2>
            <p className="text-aw-muted text-sm">
              Nossa equipe vai analisar e responder em breve.
              <br />
              <span className="text-aw-purple font-semibold">
                #{String(createdNum).padStart(5, '0')}
              </span>
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate(`/meus-tickets/${createdId}`)}
                className="aw-btn-primary flex items-center gap-2 text-sm">
                <RiArrowRightLine size={16} /> Ver meu ticket
              </button>
              <button
                onClick={handleNewTicket}
                className="aw-btn-secondary flex items-center gap-2 text-sm">
                <RiAddLine size={16} /> Enviar outro ticket
              </button>
            </div>
          </div>
        )}

        {/* Formulário */}
        {isAuthenticated && !createdId && (
          <>
            <form onSubmit={handleSubmit} className="aw-card p-6 space-y-5" noValidate>
              <div>
                <label htmlFor="sup-subject" className="aw-label">Assunto</label>
                <input
                  id="sup-subject"
                  type="text"
                  value={subject}
                  onChange={handleSubject}
                  placeholder="Resumo do problema"
                  className="aw-input"
                  maxLength={200}
                />
              </div>

              <div>
                <label htmlFor="sup-category" className="aw-label">Categoria</label>
                <select
                  id="sup-category"
                  value={category}
                  onChange={handleCategory}
                  className="aw-input">
                  <option value="">Selecione...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="sup-message" className="aw-label">Mensagem</label>
                <textarea
                  id="sup-message"
                  value={message}
                  onChange={handleMessage}
                  rows={6}
                  className="aw-input resize-none"
                  placeholder="Descreva o problema em detalhes..."
                  maxLength={3000}
                />
                <p className="text-xs text-aw-dim mt-1 text-right">{message.length}/3000</p>
              </div>

              <button type="submit" disabled={loading} className="aw-btn-primary w-full py-3 text-sm">
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </span>
                  : 'Enviar mensagem'}
              </button>
            </form>

            {/* Mini painel de tickets do usuário */}
            <MiniTicketsSummary />
          </>
        )}
      </div>
    </MainLayout>
  );
}

// ── Mini resumo dos tickets abaixo do formulário ─────────────
function MiniTicketsSummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    supportAPI.getMyTickets()
      .then(r => setData(r.data.data || []))
      .catch(() => {});
  }, []);

  if (!data || data.length === 0) return null;

  const counts = {
    open:        data.filter(t => t.status === 'open').length,
    in_progress: data.filter(t => t.status === 'in_progress').length,
    resolved:    data.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="aw-card p-5 mt-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RiTicketLine className="text-aw-purple" size={18} />
          <span className="text-sm font-semibold text-aw-text">Meus tickets</span>
          <span className="text-xs text-aw-muted">Você possui {data.length} ticket{data.length !== 1 ? 's' : ''}</span>
        </div>
        <Link to="/meus-tickets" className="text-xs text-aw-purple hover:text-aw-purple-light transition-colors flex items-center gap-1">
          Ver todos <RiArrowRightLine size={12} />
        </Link>
      </div>

      <div className="flex gap-3 flex-wrap">
        {counts.open > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-xs text-yellow-400 font-semibold">{counts.open} Aberto{counts.open !== 1 ? 's' : ''}</span>
          </div>
        )}
        {counts.in_progress > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-xs text-blue-400 font-semibold">{counts.in_progress} Em atendimento</span>
          </div>
        )}
        {counts.resolved > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-green-400 font-semibold">{counts.resolved} Resolvido{counts.resolved !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <Link to="/meus-tickets"
        className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-aw-border text-sm text-aw-muted hover:border-aw-purple hover:text-aw-purple transition-all">
        <RiTicketLine size={15} /> Ver meus tickets
      </Link>
    </div>
  );
}
