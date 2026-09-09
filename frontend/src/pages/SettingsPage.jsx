import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '../components/layout/MainLayout';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Section({ title, children }) {
  return (
    <div className="aw-card p-6 mb-5">
      <h2 className="text-base font-bold text-aw-text mb-5 pb-3 border-b border-aw-border">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-aw-text">{label}</p>
        {desc && <p className="text-xs text-aw-muted mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-aw-purple' : 'bg-aw-border'}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ username: '', bio: '', avatarUrl: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [settings, setSettings] = useState({ autoplay: true, continueWatching: true, defaultQuality: '1080p', defaultLanguage: 'legendado', subtitlesEnabled: true, emailNotifications: true });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);

  useEffect(() => {
    if (user) setProfile({ username: user.username || '', bio: user.bio || '', avatarUrl: user.avatar_url || '' });
    userAPI.getSettings().then(r => {
      const s = r.data.data;
      if (s) setSettings(prev => ({ ...prev, ...s }));
    }).catch(() => {});
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const r = await userAPI.updateProfile({ username: profile.username, bio: profile.bio, avatarUrl: profile.avatarUrl });
      updateUser(r.data.data);
      toast.success('Perfil atualizado!');
    } catch (err) { toast.error(err.response?.data?.error || 'Erro ao salvar.'); }
    finally { setLoadingProfile(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('As senhas não coincidem.'); return; }
    if (passwords.newPassword.length < 8) { toast.error('Nova senha deve ter 8+ caracteres.'); return; }
    setLoadingPass(true);
    try {
      await userAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Senha alterada!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.error || 'Erro ao alterar senha.'); }
    finally { setLoadingPass(false); }
  };

  const saveSettings = async () => {
    setLoadingSettings(true);
    try {
      await userAPI.updateSettings(settings);
      toast.success('Configurações salvas!');
    } catch { toast.error('Erro ao salvar configurações.'); }
    finally { setLoadingSettings(false); }
  };

  return (
    <MainLayout>
      <Helmet><title>Configurações — ANIMES WORLD</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-black text-white mb-6">⚙️ Configurações</h1>

        {/* Conta */}
        <Section title="Conta">
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="aw-label">Nome de usuário</label>
              <input value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})}
                className="aw-input" placeholder="Seu username" />
            </div>
            <div>
              <label className="aw-label">Bio</label>
              <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})}
                rows={3} className="aw-input resize-none" placeholder="Fale um pouco sobre você..." />
            </div>
            <div>
              <label className="aw-label">URL do avatar</label>
              <input value={profile.avatarUrl} onChange={e => setProfile({...profile, avatarUrl: e.target.value})}
                className="aw-input" placeholder="https://..." />
            </div>
            <button type="submit" disabled={loadingProfile} className="aw-btn-primary text-sm">
              {loadingProfile ? 'Salvando...' : 'Salvar perfil'}
            </button>
          </form>
        </Section>

        {/* Senha */}
        <Section title="Alterar Senha">
          <form onSubmit={savePassword} className="space-y-4">
            {[
              { key: 'currentPassword', label: 'Senha atual' },
              { key: 'newPassword', label: 'Nova senha' },
              { key: 'confirmPassword', label: 'Confirmar nova senha' },
            ].map(f => (
              <div key={f.key}>
                <label className="aw-label">{f.label}</label>
                <input type="password" value={passwords[f.key]}
                  onChange={e => setPasswords({...passwords, [f.key]: e.target.value})}
                  className="aw-input" placeholder="••••••••" />
              </div>
            ))}
            <button type="submit" disabled={loadingPass} className="aw-btn-primary text-sm">
              {loadingPass ? 'Alterando...' : 'Alterar senha'}
            </button>
          </form>
        </Section>

        {/* Reprodução */}
        <Section title="Reprodução">
          <Toggle label="Reprodução automática" desc="Ir automaticamente para o próximo episódio"
            checked={settings.autoplay} onChange={v => setSettings({...settings, autoplay: v})} />
          <Toggle label="Continuar de onde parou" desc="Retomar progresso ao abrir um episódio"
            checked={settings.continueWatching} onChange={v => setSettings({...settings, continueWatching: v})} />
          <Toggle label="Legendas ativadas" desc="Exibir legendas por padrão"
            checked={settings.subtitlesEnabled} onChange={v => setSettings({...settings, subtitlesEnabled: v})} />
          <div>
            <label className="aw-label">Qualidade padrão</label>
            <select value={settings.defaultQuality} onChange={e => setSettings({...settings, defaultQuality: e.target.value})} className="aw-input text-sm">
              {['360p','480p','720p','1080p'].map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          <div>
            <label className="aw-label">Idioma padrão</label>
            <select value={settings.defaultLanguage} onChange={e => setSettings({...settings, defaultLanguage: e.target.value})} className="aw-input text-sm">
              <option value="legendado">Legendado (PT-BR)</option>
              <option value="dublado">Dublado (PT-BR)</option>
              <option value="original">Original</option>
            </select>
          </div>
        </Section>

        {/* Notificações */}
        <Section title="Notificações">
          <Toggle label="Notificações por e-mail" desc="Receber alertas de novos episódios"
            checked={settings.emailNotifications} onChange={v => setSettings({...settings, emailNotifications: v})} />
        </Section>

        <button onClick={saveSettings} disabled={loadingSettings} className="aw-btn-primary w-full text-sm py-3">
          {loadingSettings ? 'Salvando...' : 'Salvar todas as configurações'}
        </button>
      </div>
    </MainLayout>
  );
}
