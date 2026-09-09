import { useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

const SOURCE_TYPES = ['embed', 'hls', 'mp4', 'iframe', 'custom'];
const QUALITIES = ['360p', '480p', '720p', '1080p', '1440p', '4K', 'auto'];
const LANGUAGES = ['legendado', 'dublado', 'original'];

export default function AdminEpisodes() {
  const [animeId, setAnimeId] = useState('');
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEp, setSelectedEp] = useState(null);
  const [sources, setSources] = useState([]);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showEpModal, setShowEpModal] = useState(false);
  const [newSource, setNewSource] = useState({ label:'', sourceType:'embed', url:'', quality:'1080p', language:'legendado', isDefault:false, providerName:'' });
  const [newEp, setNewEp] = useState({ episodeNumber:'', seasonNumber:'1', title:'', duration:'', thumbnailUrl:'' });

  const loadEpisodes = () => {
    if (!animeId.trim()) return;
    setLoading(true);
    adminAPI.getEpisodes({ animeId })
      .then(r => setEpisodes(r.data.data || []))
      .finally(() => setLoading(false));
  };

  const openSources = (ep) => {
    setSelectedEp(ep);
    adminAPI.getSources(ep.id).then(r => setSources(r.data.data || []));
    setShowSourceModal(true);
  };

  const addSource = async () => {
    if (!newSource.url) { toast.error('URL obrigatória.'); return; }
    try {
      await adminAPI.createSource(selectedEp.id, newSource);
      toast.success('Fonte adicionada!');
      adminAPI.getSources(selectedEp.id).then(r => setSources(r.data.data || []));
      setNewSource({ label:'', sourceType:'embed', url:'', quality:'1080p', language:'legendado', isDefault:false, providerName:'' });
      loadEpisodes();
    } catch (err) { toast.error(err.response?.data?.error || 'Erro.'); }
  };

  const deleteSource = async (sourceId) => {
    try {
      await adminAPI.deleteSource(selectedEp.id, sourceId);
      toast.success('Fonte removida.');
      setSources(s => s.filter(x => x.id !== sourceId));
      loadEpisodes();
    } catch { toast.error('Erro.'); }
  };

  const createEpisode = async () => {
    if (!newEp.episodeNumber) { toast.error('Número do episódio obrigatório.'); return; }
    try {
      await adminAPI.createEpisode({ animeId, ...newEp });
      toast.success('Episódio criado!');
      setShowEpModal(false);
      loadEpisodes();
    } catch (err) { toast.error(err.response?.data?.error || 'Erro.'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white">🎬 Episódios & Fontes de Vídeo</h2>
        <p className="text-sm text-aw-muted mt-1">Gerencie episódios e configure as URLs dos vídeos.</p>
      </div>

      {/* Busca por ID do anime */}
      <div className="aw-card p-4 flex gap-3 items-end">
        <div className="flex-1">
          <label className="aw-label text-xs">ID do Anime (UUID)</label>
          <input value={animeId} onChange={e => setAnimeId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadEpisodes()}
            placeholder="Cole o UUID do anime aqui..." className="aw-input py-2 text-sm" />
        </div>
        <button onClick={loadEpisodes} className="aw-btn-primary text-sm px-4 py-2.5">Carregar</button>
        {episodes.length > 0 && (
          <button onClick={() => setShowEpModal(true)} className="aw-btn-secondary text-sm px-4 py-2.5">
            + Episódio
          </button>
        )}
      </div>

      {/* Lista */}
      {episodes.length > 0 && (
        <div className="aw-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-aw-border">
                {['Temporada','Episódio','Título','Duração','Fontes','Visível','Ações'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-aw-dim uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:5}).map((_,i)=>(
                    <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="skeleton h-8 rounded" /></td></tr>
                  ))
                : episodes.map(ep=>(
                    <tr key={ep.id} className="border-b border-aw-border/50 hover:bg-white/2">
                      <td className="px-4 py-3 text-aw-muted text-xs">T{ep.season_number}</td>
                      <td className="px-4 py-3 font-semibold text-aw-text">Ep {ep.episode_number}</td>
                      <td className="px-4 py-3 text-aw-muted text-xs max-w-[160px] truncate">{ep.title || '—'}</td>
                      <td className="px-4 py-3 text-aw-dim text-xs">{ep.duration ? `${ep.duration}min` : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          ep.sources_count > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {ep.sources_count || 0} fonte{ep.sources_count !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${ep.is_hidden ? 'text-red-400' : 'text-green-400'}`}>
                          {ep.is_hidden ? 'Oculto' : 'Visível'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => openSources(ep)}
                          className="text-xs bg-aw-purple/20 text-aw-purple hover:bg-aw-purple/30 px-3 py-1 rounded transition-colors">
                          Gerenciar fontes
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Gerenciar Fontes */}
      <Modal open={showSourceModal} onClose={() => setShowSourceModal(false)}
        title={`Fontes — Ep ${selectedEp?.episode_number}`} size="lg">
        <div className="space-y-5">
          {/* Fontes existentes */}
          {sources.length === 0 ? (
            <p className="text-sm text-aw-muted text-center py-4">Nenhuma fonte cadastrada.</p>
          ) : (
            <div className="space-y-2">
              {sources.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-aw-surface rounded-lg border border-aw-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-aw-text">{s.label || s.source_type}</span>
                      <span className="text-xs bg-aw-purple/20 text-aw-purple px-1.5 rounded">{s.quality}</span>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 rounded">{s.language}</span>
                      {s.is_default && <span className="text-xs bg-green-500/20 text-green-400 px-1.5 rounded">Padrão</span>}
                    </div>
                    <p className="text-xs text-aw-muted truncate mt-1">{s.url}</p>
                  </div>
                  <button onClick={() => deleteSource(s.id)}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors flex-shrink-0">
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Adicionar fonte */}
          <div className="border-t border-aw-border pt-4 space-y-3">
            <h4 className="text-sm font-semibold text-aw-text">Adicionar nova fonte</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="aw-label text-xs">Label (ex: HD, Legendado)</label>
                <input value={newSource.label} onChange={e=>setNewSource({...newSource,label:e.target.value})}
                  className="aw-input py-2 text-sm" placeholder="HD Legendado" />
              </div>
              <div>
                <label className="aw-label text-xs">Tipo</label>
                <select value={newSource.sourceType} onChange={e=>setNewSource({...newSource,sourceType:e.target.value})}
                  className="aw-input py-2 text-sm">
                  {SOURCE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="aw-label text-xs">URL do vídeo / embed</label>
                <input value={newSource.url} onChange={e=>setNewSource({...newSource,url:e.target.value})}
                  className="aw-input py-2 text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="aw-label text-xs">Qualidade</label>
                <select value={newSource.quality} onChange={e=>setNewSource({...newSource,quality:e.target.value})}
                  className="aw-input py-2 text-sm">
                  {QUALITIES.map(q=><option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className="aw-label text-xs">Idioma</label>
                <select value={newSource.language} onChange={e=>setNewSource({...newSource,language:e.target.value})}
                  className="aw-input py-2 text-sm">
                  {LANGUAGES.map(l=><option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newSource.isDefault}
                onChange={e=>setNewSource({...newSource,isDefault:e.target.checked})}
                className="accent-purple-500" />
              <span className="text-sm text-aw-muted">Definir como fonte padrão</span>
            </label>
            <button onClick={addSource} className="aw-btn-primary text-sm w-full py-2.5">
              Adicionar fonte
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Criar Episódio */}
      <Modal open={showEpModal} onClose={() => setShowEpModal(false)} title="Criar Episódio">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="aw-label text-xs">Número do episódio *</label>
              <input type="number" value={newEp.episodeNumber} onChange={e=>setNewEp({...newEp,episodeNumber:e.target.value})}
                className="aw-input py-2 text-sm" placeholder="1" />
            </div>
            <div>
              <label className="aw-label text-xs">Temporada</label>
              <input type="number" value={newEp.seasonNumber} onChange={e=>setNewEp({...newEp,seasonNumber:e.target.value})}
                className="aw-input py-2 text-sm" placeholder="1" />
            </div>
          </div>
          <div>
            <label className="aw-label text-xs">Título do episódio</label>
            <input value={newEp.title} onChange={e=>setNewEp({...newEp,title:e.target.value})}
              className="aw-input py-2 text-sm" placeholder="Nome do episódio" />
          </div>
          <div>
            <label className="aw-label text-xs">Duração (minutos)</label>
            <input type="number" value={newEp.duration} onChange={e=>setNewEp({...newEp,duration:e.target.value})}
              className="aw-input py-2 text-sm" placeholder="24" />
          </div>
          <div>
            <label className="aw-label text-xs">URL da thumbnail</label>
            <input value={newEp.thumbnailUrl} onChange={e=>setNewEp({...newEp,thumbnailUrl:e.target.value})}
              className="aw-input py-2 text-sm" placeholder="https://..." />
          </div>
          <button onClick={createEpisode} className="aw-btn-primary w-full text-sm py-2.5">Criar episódio</button>
        </div>
      </Modal>
    </div>
  );
}
