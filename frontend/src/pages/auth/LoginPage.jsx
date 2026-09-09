import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// NOTA: O bug de perda de foco era causado por:
// 1. O estado `tab` que causava re-render do formulário inteiro ao mudar
// 2. Componentes inline sendo recriados no render
// Solução: remover estado desnecessário, manter formulário estável

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Campos controlados de forma estável — sem estados que causem remount
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);

  // Handlers estáveis com useCallback — evita recriar funções no render
  const handleEmail    = useCallback(e => setEmail(e.target.value), []);
  const handlePassword = useCallback(e => setPassword(e.target.value), []);
  const handleRemember = useCallback(e => setRememberMe(e.target.checked), []);
  const togglePass     = useCallback(() => setShowPass(p => !p), []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Preencha todos os campos.'); return; }
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      toast.success('Bem-vindo(a) de volta!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  }, [email, password, rememberMe, login, navigate]);

  return (
    <>
      <Helmet><title>Entrar — ANIMES WORLD</title></Helmet>

      <div className="min-h-screen bg-aw-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* BG decorativo — estático, não causa re-render */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-20"
            style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-20"
            style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
        </div>

        <div className="w-full max-w-md relative z-10 animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center text-white font-black text-2xl mb-4 shadow-lg shadow-purple-900/40"
              style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
              AW
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">ANIMES WORLD</h1>
            <p className="text-xs text-aw-purple font-medium tracking-[0.3em] mt-1">YOUR ANIME. OUR WORLD.</p>
          </div>

          <div className="aw-glass rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Tabs — links simples, sem estado */}
            <div className="flex border-b border-white/10">
              <span className="flex-1 py-4 text-sm font-semibold text-center text-aw-purple border-b-2 border-aw-purple">
                ENTRAR
              </span>
              <Link to="/register"
                className="flex-1 py-4 text-sm font-semibold text-center text-aw-muted hover:text-aw-text transition-colors">
                CRIAR CONTA
              </Link>
            </div>

            {/* Formulário estável — não recria inputs */}
            <form onSubmit={handleSubmit} className="p-7 space-y-5" noValidate>
              <div>
                <label htmlFor="login-email" className="aw-label">E-mail</label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-aw-dim text-lg pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={handleEmail}
                    placeholder="seuemail@exemplo.com"
                    className="aw-input pl-11"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="aw-label">Senha</label>
                <div className="relative">
                  <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-aw-dim text-lg pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={handlePassword}
                    placeholder="••••••••"
                    className="aw-input pl-11 pr-11"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={togglePass}
                    tabIndex={-1}
                    aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-aw-dim hover:text-aw-muted transition-colors">
                    {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRemember}
                    className="w-4 h-4 rounded border-aw-border bg-aw-surface accent-purple-500"
                  />
                  <span className="text-sm text-aw-muted">Lembrar de mim</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-aw-purple hover:text-aw-purple-light transition-colors">
                  Esqueci minha senha
                </Link>
              </div>

              <button type="submit" disabled={loading} className="aw-btn-primary w-full py-3 text-sm">
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Entrando...
                    </span>
                  : 'Entrar'}
              </button>

              <p className="text-center text-sm text-aw-muted">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-aw-purple hover:text-aw-purple-light font-medium transition-colors">
                  Criar conta
                </Link>
              </p>
            </form>
          </div>

          <p className="text-center text-xs text-aw-dim mt-6">— ANIMES WORLD —</p>
        </div>
      </div>
    </>
  );
}
