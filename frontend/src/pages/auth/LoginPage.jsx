import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('login');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Preencha todos os campos.'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password, form.rememberMe);
      toast.success('Bem-vindo(a) de volta!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Entrar — ANIMES WORLD</title>
      </Helmet>

      {/* Background */}
      <div className="min-h-screen bg-aw-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* BG decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-20"
            style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-20"
            style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
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

          {/* Card */}
          <div className="aw-glass rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  tab === 'login' ? 'text-aw-purple border-b-2 border-aw-purple' : 'text-aw-muted hover:text-aw-text'
                }`}>
                ENTRAR
              </button>
              <Link to="/register"
                className="flex-1 py-4 text-sm font-semibold text-center text-aw-muted hover:text-aw-text transition-colors">
                CRIAR CONTA
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="p-7 space-y-5">
              {/* E-mail */}
              <div>
                <label className="aw-label">E-mail</label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-aw-dim text-lg" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="seuemail@exemplo.com"
                    className="aw-input pl-11"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="aw-label">Senha</label>
                <div className="relative">
                  <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-aw-dim text-lg" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="aw-input pl-11 pr-11"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-aw-dim hover:text-aw-muted transition-colors">
                    {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                  </button>
                </div>
              </div>

              {/* Lembrar + Esquecer */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.rememberMe}
                    onChange={e => setForm({ ...form, rememberMe: e.target.checked })}
                    className="w-4 h-4 rounded border-aw-border bg-aw-surface accent-purple-500" />
                  <span className="text-sm text-aw-muted">Lembrar de mim</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-aw-purple hover:text-aw-purple-light transition-colors">
                  Esqueci minha senha
                </Link>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="aw-btn-primary w-full py-3 text-sm">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : 'Entrar'}
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
