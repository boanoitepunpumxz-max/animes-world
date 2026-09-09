import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-aw-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-aw-muted mb-4">Link inválido ou expirado.</p>
          <Link to="/forgot-password" className="aw-btn-primary">Solicitar novo link</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Senha deve ter ao menos 8 caracteres.'); return; }
    if (form.password !== form.confirm) { toast.error('As senhas não coincidem.'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, form.password);
      toast.success('Senha redefinida! Faça login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Token inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Nova Senha — ANIMES WORLD</title></Helmet>
      <div className="min-h-screen bg-aw-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center text-white font-black text-2xl mb-4"
              style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
              AW
            </div>
            <h1 className="text-2xl font-black text-white">ANIMES WORLD</h1>
          </div>
          <div className="aw-glass rounded-2xl p-7 shadow-2xl shadow-black/50 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-aw-text">Nova senha</h2>
              <p className="text-sm text-aw-muted mt-1">Digite sua nova senha abaixo.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['password', 'confirm'].map((name) => (
                <div key={name}>
                  <label className="aw-label">{name === 'password' ? 'Nova senha' : 'Confirmar senha'}</label>
                  <div className="relative">
                    <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-aw-dim text-lg" />
                    <input type={showPass ? 'text' : 'password'} value={form[name]}
                      onChange={e => setForm({ ...form, [name]: e.target.value })}
                      placeholder="••••••••" className="aw-input pl-11 pr-11" />
                    {name === 'password' && (
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-aw-dim hover:text-aw-muted">
                        {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="submit" disabled={loading} className="aw-btn-primary w-full py-3 text-sm">
                {loading ? 'Redefinindo...' : 'Redefinir senha'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
