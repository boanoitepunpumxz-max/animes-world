import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiMailLine, RiArrowLeftLine, RiCheckLine } from 'react-icons/ri';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Informe o e-mail.'); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch {
      toast.error('Erro ao enviar e-mail. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Recuperar Senha — ANIMES WORLD</title></Helmet>
      <div className="min-h-screen bg-aw-bg flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10"
            style={{ background: 'radial-gradient(circle, #a855f7, #ec4899)' }} />
        </div>

        <div className="w-full max-w-md relative z-10 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center text-white font-black text-2xl mb-4"
              style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
              AW
            </div>
            <h1 className="text-2xl font-black text-white">ANIMES WORLD</h1>
          </div>

          <div className="aw-glass rounded-2xl p-7 shadow-2xl shadow-black/50">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <RiCheckLine className="text-green-400 text-3xl" />
                </div>
                <h2 className="text-lg font-bold text-aw-text">E-mail enviado!</h2>
                <p className="text-sm text-aw-muted">
                  Verifique sua caixa de entrada. Você receberá as instruções em breve.
                </p>
                <Link to="/login" className="aw-btn-primary block w-full text-center py-3 text-sm mt-4">
                  Voltar ao login
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-aw-text mb-1">Recuperar senha</h2>
                  <p className="text-sm text-aw-muted">
                    Informe seu e-mail e enviaremos um link para redefinir sua senha.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="aw-label">E-mail</label>
                    <div className="relative">
                      <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-aw-dim text-lg" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com" className="aw-input pl-11" autoComplete="email" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="aw-btn-primary w-full py-3 text-sm">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : 'Enviar instruções'}
                  </button>
                  <Link to="/login"
                    className="flex items-center justify-center gap-2 text-sm text-aw-muted hover:text-aw-text transition-colors">
                    <RiArrowLeftLine size={16} /> Voltar ao login
                  </Link>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
