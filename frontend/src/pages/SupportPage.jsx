import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { RiHeadphoneLine, RiTicketLine } from 'react-icons/ri';
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

  const [subject,  setSubject]  = useState('');
  const [category, setCategory] = useState('');
  const [message,  setMessage]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubject  = useCallback(e => setSubject(e.target.value), []);
  const handleCategory = useCallback(e => setCategory(e.target.value), []);
  const handleMessage  = useCallback(e => setMessage(e.target.value), []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!subject.trim() || !category || !message.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const r = await supportAPI.createTicket({ subject: subject.trim(), category, message: message.trim() });
      toast.success('Ticket aberto! Você pode acompanhar em "Meus Tickets".');
      // Redireciona para o chat do ticket
      navigate(`/meus-tickets/${r.data.ticket.id}`);
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [subject, category, message, navigate]);

  return (
    <MainLayout>
      <Helmet><title>Suporte — ANIMES WORLD</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">

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
              className="flex items-center gap-1.5 text-sm text-aw-purple hover:text-aw-purple-light transition-colors">
              <RiTicketLine size={16} /> Meus tickets
            </Link>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="aw-card p-8 text-center">
            <p className="text-aw-muted mb-4">Faça login para abrir um ticket de suporte.</p>
            <Link to="/login" className="aw-btn-primary">Fazer login</Link>
          </div>
        ) : (
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
        )}
      </div>
    </MainLayout>
  );
}
