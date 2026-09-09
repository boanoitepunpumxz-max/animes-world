import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '../components/layout/MainLayout';
import { supportAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Problema no player','Problema na conta','Anime não encontrado','Episódio com erro','Bug no site','Sugestão','Outro'];

export default function SupportPage() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ subject: '', category: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.category || !form.message) { toast.error('Preencha todos os campos.'); return; }
    setLoading(true);
    try {
      await supportAPI.createTicket(form);
      setSent(true);
      toast.success('Ticket enviado! Responderemos em breve.');
    } catch { toast.error('Erro ao enviar. Tente novamente.'); }
    finally { setLoading(false); }
  };

  return (
    <MainLayout>
      <Helmet><title>Suporte — ANIMES WORLD</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-black text-white mb-2">🎧 Suporte</h1>
        <p className="text-aw-muted text-sm mb-8">Encontrou um problema ou tem uma dúvida? Fale conosco.</p>

        {!isAuthenticated ? (
          <div className="aw-card p-8 text-center">
            <p className="text-aw-muted mb-4">Faça login para enviar uma mensagem de suporte.</p>
            <Link to="/login" className="aw-btn-primary">Fazer login</Link>
          </div>
        ) : sent ? (
          <div className="aw-card p-8 text-center space-y-4">
            <div className="text-4xl">✅</div>
            <h2 className="text-lg font-bold text-aw-text">Ticket enviado!</h2>
            <p className="text-aw-muted text-sm">Nossa equipe vai analisar e responder em breve.</p>
            <button onClick={() => { setSent(false); setForm({ subject:'', category:'', message:'' }); }}
              className="aw-btn-primary text-sm">Enviar outro ticket</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="aw-card p-6 space-y-5">
            <div>
              <label className="aw-label">Assunto</label>
              <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}
                className="aw-input" placeholder="Resumo do problema" />
            </div>
            <div>
              <label className="aw-label">Categoria</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="aw-input">
                <option value="">Selecione...</option>
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="aw-label">Mensagem</label>
              <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                rows={6} className="aw-input resize-none" placeholder="Descreva o problema em detalhes..." />
            </div>
            <button type="submit" disabled={loading} className="aw-btn-primary w-full py-3 text-sm">
              {loading ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </form>
        )}
      </div>
    </MainLayout>
  );
}
