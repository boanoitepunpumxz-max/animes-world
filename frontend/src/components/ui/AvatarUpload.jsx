import { useState, useRef, useCallback } from 'react';
import { RiUploadLine, RiLinkLine, RiUser3Line, RiCloseLine, RiCheckLine } from 'react-icons/ri';
import { uploadAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AvatarUpload({ onSaved }) {
  const { user, updateUser } = useAuth();
  const fileRef = useRef(null);

  const [mode,     setMode]    = useState('url');   // 'url' | 'upload'
  const [preview,  setPreview] = useState(null);
  const [urlInput, setUrlInput] = useState(user?.avatar_url || '');
  const [saving,   setSaving]  = useState(false);
  const [file,     setFile]    = useState(null);

  const handleFileChange = useCallback(e => {
    const f = e.target.files?.[0];
    if (!f) return;

    const allowed = ['image/jpeg','image/jpg','image/png','image/webp','image/gif'];
    if (!allowed.includes(f.type)) {
      toast.error('Formato não permitido. Use JPG, PNG, WEBP ou GIF.');
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo: 2MB.');
      return;
    }

    setFile(f);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      if (mode === 'upload' && file) {
        const r = await uploadAPI.uploadAvatar(file);
        updateUser({ avatar_url: r.data.avatarUrl });
        toast.success('Avatar atualizado!');
        onSaved?.();
      } else if (mode === 'url' && urlInput.trim()) {
        await userAPI.updateProfile({ avatarUrl: urlInput.trim() });
        updateUser({ avatar_url: urlInput.trim() });
        toast.success('Avatar atualizado!');
        onSaved?.();
      } else {
        toast.error('Selecione uma imagem ou informe uma URL.');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar avatar.');
    } finally {
      setSaving(false);
    }
  }, [mode, file, urlInput, updateUser, onSaved]);

  const currentPreview = mode === 'upload' ? preview : (urlInput || user?.avatar_url);

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-aw-border bg-aw-surface flex items-center justify-center relative">
          {currentPreview ? (
            <img
              src={currentPreview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display='none'; }}
            />
          ) : (
            <RiUser3Line className="text-aw-dim text-3xl" />
          )}
        </div>
        {preview && mode === 'upload' && (
          <button onClick={() => { setPreview(null); setFile(null); if (fileRef.current) fileRef.current.value=''; }}
            className="text-xs text-aw-muted hover:text-red-400 transition-colors flex items-center gap-1">
            <RiCloseLine size={12} /> Remover preview
          </button>
        )}
      </div>

      {/* Modo */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all border ${
            mode === 'upload'
              ? 'border-aw-purple text-aw-purple bg-aw-purple/10'
              : 'border-aw-border text-aw-muted hover:border-aw-purple/40'
          }`}>
          <RiUploadLine size={16} /> Enviar imagem
        </button>
        <button
          onClick={() => setMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all border ${
            mode === 'url'
              ? 'border-aw-purple text-aw-purple bg-aw-purple/10'
              : 'border-aw-border text-aw-muted hover:border-aw-purple/40'
          }`}>
          <RiLinkLine size={16} /> Usar URL
        </button>
      </div>

      {/* Input conforme o modo */}
      {mode === 'upload' ? (
        <div>
          {/* Input file escondido — funciona em Android/iOS/Desktop */}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            id="avatar-file-input"
          />
          <label
            htmlFor="avatar-file-input"
            className="w-full flex items-center justify-center gap-2 py-8 border-2 border-dashed border-aw-border rounded-xl cursor-pointer hover:border-aw-purple/50 hover:bg-aw-purple/5 transition-all text-sm text-aw-muted hover:text-aw-purple">
            <RiUploadLine size={20} />
            {file ? (
              <span className="text-aw-purple font-medium">{file.name} ({(file.size/1024).toFixed(0)}KB)</span>
            ) : (
              <span>Clique ou arraste uma imagem aqui<br /><span className="text-xs">JPG, PNG, WEBP, GIF — máx. 2MB</span></span>
            )}
          </label>
        </div>
      ) : (
        <div>
          <label className="aw-label">URL da imagem</label>
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://exemplo.com/foto.jpg"
            className="aw-input"
            autoComplete="off"
          />
          <p className="text-xs text-aw-dim mt-1">Cole o link direto de uma imagem (termina em .jpg, .png, etc.)</p>
        </div>
      )}

      {/* Salvar */}
      <button
        onClick={handleSave}
        disabled={saving || (mode === 'upload' && !file) || (mode === 'url' && !urlInput.trim())}
        className="aw-btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2">
        {saving
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><RiCheckLine size={16} /> Salvar avatar</>
        }
      </button>
    </div>
  );
}
