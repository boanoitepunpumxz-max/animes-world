import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiUserLine, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 3) e.username = 'Username deve ter pelo menos 3 caracteres.';
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Só letras, números e _.';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido.';
    if (!form.password || form.password.length < 8) e.password = 'Senha deve ter pelo menos 8 caracteres.';
    if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) e.password = 'Senha precisa de letras e números.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'As senhas não coincidem.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ username: form.username, email: form.email, password: form.password });
      toast.success('Conta criada! Bem-vindo(a)!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', icon: Icon, placeholder, autoComplete, extra }) => (
    <div>
      <label className="aw-label">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-aw-dim text-lg" />
        <input
          type={type} value={form[name]}
          onChange={e => { setForm({ ...form, [name]: e.target.value }); setErrors({ ...errors, [name]: '' }); }}
          placeholder={placeholder} autoComplete={autoComplete}
          className={`aw-input pl-11 ${extra || ''} ${errors[name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
        />
        {extra && (
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-aw-dim hover:text-aw-muted">
            {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
          </button>
        )}
      </div>
      {errors[name] && <p className="text-xs text-red-400 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      <Helmet><title>Criar Conta — ANIMES WORLD</title></Helmet>

      <div className="min-h-screen bg-aw-bg flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-20"
            style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-20"
            style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
        </div>

        <div className="w-full max-w-md relative z-10 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center text-white font-black text-2xl mb-4 shadow-lg shadow-purple-900/40"
              style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
              AW
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">ANIMES WORLD</h1>
            <p className="text-xs text-aw-purple font-medium tracking-[0.3em] mt-1">YOUR ANIME. OUR WORLD.</p>
          </div>

          <div className="aw-glass rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="flex border-b border-white/10">
              <Link to="/login"
                className="flex-1 py-4 text-sm font-semibold text-center text-aw-muted hover:text-aw-text transition-colors">
                ENTRAR
              </Link>
              <button className="flex-1 py-4 text-sm font-semibold text-aw-purple border-b-2 border-aw-purple">
                CRIAR CONTA
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-7 space-y-4">
              <Field label="Nome de usuário" name="username" icon={RiUserLine}
                placeholder="seunome" autoComplete="username" />
              <Field label="E-mail" name="email" type="email" icon={RiMailLine}
                placeholder="seuemail@exemplo.com" autoComplete="email" />
              <Field label="Senha" name="password" type={showPass ? 'text' : 'password'} icon={RiLockLine}
                placeholder="Mínimo 8 caracteres" autoComplete="new-password" extra="pr-11" />
              <div>
                <label className="aw-label">Confirmar senha</label>
                <div className="relative">
                  <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-aw-dim text-lg" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    className={`aw-input pl-11 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={loading} className="aw-btn-primary w-full py-3 text-sm mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Criando conta...
                  </span>
                ) : 'Criar minha conta'}
              </button>

              <p className="text-center text-xs text-aw-dim">
                Ao criar uma conta, você concorda com nossos{' '}
                <Link to="/termos-de-uso" className="text-aw-purple hover:underline">Termos de Uso</Link>
                {' '}e{' '}
                <Link to="/privacidade" className="text-aw-purple hover:underline">Política de Privacidade</Link>.
              </p>

              <p className="text-center text-sm text-aw-muted">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-aw-purple hover:text-aw-purple-light font-medium transition-colors">
                  Entrar
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
