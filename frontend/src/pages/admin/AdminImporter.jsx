/**
 * ANIMES WORLD — Painel Admin: Importador Multi-Fonte
 *
 * Suporta: AnFireAPI | Anibunker
 * Preserva todo o sistema AnFireAPI existente.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import {
  RiRefreshLine, RiPlayLine, RiPauseLine, RiStopLine,
  RiSearchLine, RiCheckLine, RiAlertLine, RiErrorWarningLine,
  RiInformationLine, RiDeleteBinLine, RiArrowGoBackLine,
  RiSettings3Line, RiListCheck2, RiExternalLinkLine,
} from 'react-icons/ri';

// ── Configuração de providers ────────────────────────────────
const PROVIDERS = {
  anfire: {
    name: 'AnFireAPI',
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    baseRoute: '/api/admin/importer',
    actions: ['analyze','dry_run','sync_covers','sync_episodes','sync_all'],
  },
  anibunker: {
    name: 'Anibunker',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    baseRoute: '/api/admin/importer/anibunker',
    actions: ['analyze','dry_run','sync_episodes','sync_all'],
  },
};

// ── api helper (funciona para ambos os providers) ─────────────
const _auth = () => ({ Authorization: `Bearer ${localStorage.getItem('aw_token')}` });
const _fetch = (url, opts={}) => fetch(url, { ...opts, headers: { ..._auth(), 'Content-Type': 'application/json', ...opts.headers } }).then(r => r.json());

function makeAPI(baseRoute) {
  return {
    stats:       ()      => _fetch(`${baseRoute}/stats`),
    jobs:        (p=1)   => _fetch(`${baseRoute}/jobs?page=${p}`),
    jobDetail:   (id)    => _fetch(`${baseRoute}/jobs/${id}`),
    startJob:    (body)  => _fetch(`${baseRoute}/jobs`, { method:'POST', body: JSON.stringify(body) }),
    cancelJob:   (id)    => _fetch(`${baseRoute}/jobs/${id}/cancel`, { method:'PATCH', body: '{}' }),
    rollback:    (id)    => _fetch(`${baseRoute}/rollback/${id}`, { method:'POST', body: '{}' }),
    mappings:    (p,s,q) => _fetch(`${baseRoute}/mappings?page=${p}&limit=25${s?`&status=${s}`:''}${q?`&q=${encodeURIComponent(q)}`:''}`),
    updateMap:   (id,b)  => _fetch(`${baseRoute}/mappings/${id}`, { method:'PATCH', body: JSON.stringify(b) }),
    deleteMap:   (id)    => _fetch(`${baseRoute}/mappings/${id}`, { method:'DELETE' }),
  };
}

// Mantém compatibilidade com código existente (AnFireAPI usa /api/admin/importer)
const importerAPI = {
  ...makeAPI('/api/admin/importer'),
  _auth,
  stats:      () => _fetch('/api/admin/importer/stats'),
  search:     (q) => _fetch('/api/admin/importer/search', { method:'POST', body: JSON.stringify({query:q}) }),
  match:      (b) => _fetch('/api/admin/importer/match', { method:'POST', body: JSON.stringify(b) }),
  jobs:       (p=1) => _fetch(`/api/admin/importer/jobs?page=${p}`),
  jobDetail:  (id) => _fetch(`/api/admin/importer/jobs/${id}`),
  startJob:   (b)  => _fetch('/api/admin/importer/jobs', { method:'POST', body: JSON.stringify(b) }),
  cancelJob:  (id) => _fetch(`/api/admin/importer/jobs/${id}/cancel`, { method:'PATCH', body: '{}' }),
  rollback:   (id) => _fetch(`/api/admin/importer/rollback/${id}`, { method:'POST', body: '{}' }),
  mappings:   (p,s,q) => _fetch(`/api/admin/importer/mappings?page=${p}&limit=25${s?`&status=${s}`:''}${q?`&q=${encodeURIComponent(q)}`:''}`),
  updateMapping: (id,b) => _fetch(`/api/admin/importer/mappings/${id}`, { method:'PATCH', body: JSON.stringify(b) }),
  deleteMapping: (id) => _fetch(`/api/admin/importer/mappings/${id}`, { method:'DELETE' }),
};
  jobDetail:        (id)         => fetch(`/api/admin/importer/jobs/${id}`,        { headers: importerAPI._auth() }).then(r => r.json()),
  startJob:         (body)       => fetch('/api/admin/importer/jobs',              { method:'POST', headers:{...importerAPI._auth(),'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r => r.json()),
  pauseJob:         (id)         => fetch(`/api/admin/importer/jobs/${id}/pause`,  { method:'PATCH', headers: importerAPI._auth() }).then(r => r.json()),
  cancelJob:        (id)         => fetch(`/api/admin/importer/jobs/${id}/cancel`, { method:'PATCH', headers: importerAPI._auth() }).then(r => r.json()),
  rollback:         (id)         => fetch(`/api/admin/importer/rollback/${id}`,    { method:'POST', headers: importerAPI._auth() }).then(r => r.json()),
  mappings:         (p,s,q)      => fetch(`/api/admin/importer/mappings?page=${p}&limit=25${s?`&status=${s}`:''}${q?`&q=${encodeURIComponent(q)}`:''}`, { headers: importerAPI._auth() }).then(r => r.json()),
  updateMapping:    (id, body)   => fetch(`/api/admin/importer/mappings/${id}`,    { method:'PATCH', headers:{...importerAPI._auth(),'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r => r.json()),
  deleteMapping:    (id)         => fetch(`/api/admin/importer/mappings/${id}`,    { method:'DELETE', headers: importerAPI._auth() }).then(r => r.json()),
  search:           (q)          => fetch('/api/admin/importer/search',            { method:'POST', headers:{...importerAPI._auth(),'Content-Type':'application/json'}, body: JSON.stringify({query:q}) }).then(r => r.json()),
};

// ── Configuração AnFireAPI ────────────────────────────────────
const ANFIRE_CONFIGURED = !!import.meta.env.VITE_ANFIRE_API_URL;

// ── Status badges ─────────────────────────────────────────────
const STATUS_CFG = {
  pending:          { label: 'Pendente',       cls: 'bg-yellow-500/20 text-yellow-400' },
  synced:           { label: 'Sincronizado',   cls: 'bg-green-500/20 text-green-400'  },
  partial:          { label: 'Parcial',        cls: 'bg-blue-500/20 text-blue-400'    },
  error:            { label: 'Erro',           cls: 'bg-red-500/20 text-red-400'      },
  review_required:  { label: 'Revisão',        cls: 'bg-orange-500/20 text-orange-400'},
  running:          { label: 'Executando',     cls: 'bg-blue-500/20 text-blue-400 animate-pulse' },
  completed:        { label: 'Concluído',      cls: 'bg-green-500/20 text-green-400'  },
  failed:           { label: 'Falhou',         cls: 'bg-red-500/20 text-red-400'      },
  paused:           { label: 'Pausado',        cls: 'bg-yellow-500/20 text-yellow-400'},
  cancelled:        { label: 'Cancelado',      cls: 'bg-gray-500/20 text-gray-400'    },
};
function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || { label: status, cls: 'bg-gray-500/20 text-gray-400' };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>{cfg.label}</span>;
}

// ── Log level colors ──────────────────────────────────────────
const LOG_CLR = { INFO:'text-aw-muted', MATCH:'text-green-400', WARN:'text-yellow-400', ERROR:'text-red-400', SKIP:'text-aw-dim', BLOCK:'text-red-500 font-bold' };

// ── Card de estatística ───────────────────────────────────────
function StatCard({ label, value, color = 'text-aw-purple', sub }) {
  return (
    <div className="aw-card p-4 text-center">
      <p className={`text-2xl font-black ${color}`}>{value ?? '—'}</p>
      <p className="text-xs text-aw-muted mt-0.5">{label}</p>
      {sub && <p className="text-xs text-aw-dim mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Barra de progresso com texto ──────────────────────────────
function JobProgress({ job }) {
  if (!job) return null;
  const pct = job.total > 0 ? Math.round((job.processed / job.total) * 100) : 0;
  return (
    <div className="aw-card p-4 space-y-2 border-aw-purple/30 bg-aw-purple/5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-aw-text flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-aw-purple animate-pulse" />
          {job.job_type} {job.is_dry_run && <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full">DRY RUN</span>}
        </span>
        <StatusBadge status={job.status} />
      </div>
      {job.current_anime && (
        <p className="text-xs text-aw-muted truncate">Processando: <span className="text-aw-purple">{job.current_anime}</span></p>
      )}
      <div className="w-full bg-white/10 rounded-full h-2">
        <div className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#a855f7,#ec4899)' }} />
      </div>
      <div className="flex items-center justify-between text-xs text-aw-dim">
        <span>{job.processed}/{job.total} ({pct}%)</span>
        <div className="flex gap-3">
          {job.episodes_added > 0 && <span className="text-green-400">+{job.episodes_added} eps</span>}
          {job.covers_added   > 0 && <span className="text-blue-400">+{job.covers_added} capas</span>}
          {job.errors > 0         && <span className="text-red-400">{job.errors} erros</span>}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ════════════════════════════════════════════════════════════
export default function AdminImporter() {
  const [provider,     setProvider]     = useState('anfire'); // 'anfire' | 'anibunker'
  const [stats,        setStats]        = useState(null);
  const [anibunkerStats, setAnibunkerStats] = useState(null);
  const [activeJob,    setActiveJob]    = useState(null);
  const [jobs,         setJobs]         = useState([]);
  const [selectedJob,  setSelectedJob]  = useState(null);
  const [jobLogs,      setJobLogs]      = useState([]);
  const [mappings,     setMappings]     = useState([]);
  const [mappingTotal, setMappingTotal] = useState(0);
  const [mappingPage,  setMappingPage]  = useState(1);
  const [mapStatus,    setMapStatus]    = useState('');
  const [mapSearch,    setMapSearch]    = useState('');
  const [tab,          setTab]          = useState('overview');
  const [loadingJobs,  setLoadingJobs]  = useState(false);
  const [loadingMap,   setLoadingMap]   = useState(false);
  const [starting,     setStarting]     = useState(false);
  const pollRef = useRef(null);

  // API do provider atual
  const activeAPI = provider === 'anibunker' ? makeAPI('/api/admin/importer/anibunker') : importerAPI;

  // ── Carrega stats ──────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      const d = await importerAPI.stats();
      setStats(d);
      const db = await _fetch('/api/admin/importer/anibunker/stats');
      setAnibunkerStats(db);
    } catch { /* silencioso */ }
  }, []);

  // ── Carrega jobs recentes ──────────────────────────────────
  const loadJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const d = await importerAPI.jobs(1);
      setJobs(d.data || []);
      // Verifica job ativo
      const running = (d.data || []).find(j => j.status === 'running' || j.status === 'pending');
      if (running) setActiveJob(running);
      else setActiveJob(null);
    } finally { setLoadingJobs(false); }
  }, []);

  // ── Carrega mapeamentos ────────────────────────────────────
  const loadMappings = useCallback(async () => {
    setLoadingMap(true);
    try {
      const d = await importerAPI.mappings(mappingPage, mapStatus, mapSearch);
      setMappings(d.data || []);
      setMappingTotal(d.total || 0);
    } finally { setLoadingMap(false); }
  }, [mappingPage, mapStatus, mapSearch]);

  // ── Carrega logs de um job ────────────────────────────────
  const loadJobLogs = useCallback(async (jobId) => {
    try {
      const d = await importerAPI.jobDetail(jobId);
      setSelectedJob(d.job);
      setJobLogs(d.logs || []);
    } catch { toast.error('Erro ao carregar logs.'); }
  }, []);

  // ── Polling enquanto job ativo ────────────────────────────
  useEffect(() => {
    loadStats();
    loadJobs();
    pollRef.current = setInterval(async () => {
      await loadStats();
      await loadJobs();
      if (selectedJob?.id) {
        const d = await importerAPI.jobDetail(selectedJob.id);
        setSelectedJob(d.job);
        setJobLogs(d.logs || []);
      }
    }, 4000);
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => { if (tab === 'mappings') loadMappings(); }, [tab, loadMappings]);
  useEffect(() => { if (tab === 'mappings') loadMappings(); }, [mappingPage, mapStatus, mapSearch]);

  // ── Inicia job ────────────────────────────────────────────
  const startJob = async (jobType, dryRun = false) => {
    if (activeJob) { toast.error('Já existe um job em execução.'); return; }
    setStarting(true);
    try {
      const api = provider === 'anibunker' ? makeAPI('/api/admin/importer/anibunker') : importerAPI;
      const r = await api.startJob({ job_type: jobType, dry_run: dryRun });
      if (r.error) { toast.error(r.error); return; }
      toast.success(r.message || 'Job iniciado!');
      await loadJobs();
      await loadStats();
    } catch { toast.error('Erro ao iniciar job.'); }
    finally { setStarting(false); }
  };

  const handlePause  = async (id) => { await activeAPI.cancelJob(id); toast.success('Cancelado.'); loadJobs(); };
  const handleCancel = async (id) => { if (!confirm('Cancelar job?')) return; await activeAPI.cancelJob(id); toast.success('Cancelado.'); loadJobs(); };
  const handleRollback = async (id) => {
    if (!confirm('Desfazer importação? As fontes criadas serão removidas.')) return;
    const r = await activeAPI.rollback(id);
    toast.success(`Rollback: ${r.sourcesRemoved ?? 0} fontes removidas.`);
    loadJobs(); loadStats();
  };

  const c = stats?.catalog;
  const ab = anibunkerStats?.catalog;

  // ════════════════════════════════════════════════════════
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <RiSettings3Line className="text-aw-purple" /> Importador Multi-Fonte
          </h2>
          <p className="text-sm text-aw-muted mt-0.5">
            Sincroniza episódios e capas de múltiplas fontes sem duplicar o catálogo existente.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Seletor de Provider */}
          <div className="flex items-center gap-1 bg-aw-surface border border-aw-border rounded-xl p-1">
            {Object.entries(PROVIDERS).map(([key, cfg]) => (
              <button key={key} onClick={() => { setProvider(key); setTab('overview'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  provider === key ? 'text-white' : `${cfg.color} hover:bg-white/5`
                }`}
                style={provider === key ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)' } : {}}>
                {cfg.name}
              </button>
            ))}
          </div>
          <button onClick={() => { loadStats(); loadJobs(); }} className="aw-btn-ghost flex items-center gap-1.5 text-sm">
            <RiRefreshLine size={15} /> Atualizar
          </button>
        </div>
      </div>
        <button onClick={() => { loadStats(); loadJobs(); }} className="aw-btn-ghost flex items-center gap-1.5 text-sm">
          <RiRefreshLine size={15} /> Atualizar
        </button>
      </div>

      {/* Aviso de configuração */}
      {!ANFIRE_CONFIGURED && (
        <div className="aw-card p-4 border-yellow-500/30 bg-yellow-500/5">
          <p className="text-sm text-yellow-400 font-semibold flex items-center gap-2">
            <RiAlertLine size={16} /> Configuração necessária
          </p>
          <p className="text-xs text-aw-muted mt-1">
            Defina <code className="text-aw-purple">ANFIRE_API_URL</code> e <code className="text-aw-purple">ANFIRE_API_KEY</code> no <code>.env</code> do backend
            apontando para a sua instância da AnFireAPI.
          </p>
          <a href="https://github.com/MestreTM/AnFireAPI-Anime-Player" target="_blank" rel="noopener noreferrer"
            className="text-xs text-aw-purple hover:underline flex items-center gap-1 mt-2">
            <RiExternalLinkLine size={12} /> AnFireAPI no GitHub
          </a>
        </div>
      )}

      {/* Job ativo */}
      {activeJob && <JobProgress job={activeJob} />}

      {/* Stats — mostra provider atual */}
      {provider === 'anfire' && c && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard label="Total animes"    value={c.total}        color="text-aw-purple"  />
          <StatCard label="Mapeados"        value={c.mapped}       color="text-blue-400"   />
          <StatCard label="Não mapeados"    value={c.unmapped}     color="text-aw-muted"   />
          <StatCard label="Sincronizados"   value={c.synced}       color="text-green-400"  />
          <StatCard label="Revisão"         value={c.review}       color="text-orange-400" />
          <StatCard label="Erros"           value={c.errors}       color="text-red-400"    />
          <StatCard label="Eps importados"  value={c.episodesAdded}color="text-aw-purple"  />
        </div>
      )}
      {provider === 'anibunker' && ab && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <StatCard label="Total animes"    value={ab.total}        color="text-aw-purple"  />
          <StatCard label="Mapeados"        value={ab.mapped}       color="text-blue-400"   />
          <StatCard label="Não mapeados"    value={ab.unmapped}     color="text-aw-muted"   />
          <StatCard label="Sincronizados"   value={ab.synced}       color="text-green-400"  />
          <StatCard label="Revisão"         value={ab.review}       color="text-orange-400" />
          <StatCard label="Eps importados"  value={ab.episodesImported} color="text-aw-purple" />
        </div>
      )}

      {/* Botões de ação */}
      <div className="aw-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-aw-text">
            Ações — <span className={PROVIDERS[provider]?.color}>{PROVIDERS[provider]?.name}</span>
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: '🔍 Analisar Catálogo',  type: 'analyze',       desc: 'Faz matching sem importar',   dry: false, providers: ['anfire','anibunker'] },
            { label: '🧪 Dry Run',             type: 'dry_run',       desc: 'Simula sem alterar banco',    dry: true,  providers: ['anfire','anibunker'] },
            { label: '🖼️ Completar Capas',     type: 'sync_covers',   desc: 'Preenche capas faltantes',    dry: false, providers: ['anfire'] },
            { label: '▶️ Importar Episódios',   type: 'sync_episodes', desc: 'Importa eps dos mapeados',    dry: false, providers: ['anfire','anibunker'] },
            { label: '🔄 Sincronizar Tudo',    type: 'sync_all',      desc: 'Análise + capas + episódios', dry: false, providers: ['anfire','anibunker'] },
          ].filter(btn => btn.providers.includes(provider)).map(btn => (
            <button key={btn.type}
              onClick={() => startJob(btn.type, btn.dry)}
              disabled={starting || !!activeJob}
              className={`flex flex-col items-start p-4 rounded-xl border transition-all text-left ${
                activeJob
                  ? 'border-aw-border opacity-40 cursor-not-allowed'
                  : 'border-aw-border hover:border-aw-purple/50 hover:bg-aw-purple/5 cursor-pointer'
              }`}>
              <span className="text-sm font-semibold text-aw-text">{btn.label}</span>
              <span className="text-xs text-aw-dim mt-1">{btn.desc}</span>
              {btn.dry && <span className="text-xs text-yellow-400 mt-1">Sem alterar banco</span>}
            </button>
          ))}
        </div>

        {activeJob && (
          <div className="flex gap-2 mt-4">
            <button onClick={() => handleCancel(activeJob.id)}
              className="flex items-center gap-1.5 text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-colors">
              <RiStopLine size={13}/> Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-aw-border pb-3">
        {[
          { v: 'overview',  l: 'Jobs' },
          { v: 'mappings',  l: `Mapeamentos${c?.review > 0 ? ` (${c.review} revisão)` : ''}` },
          { v: 'logs',      l: 'Logs' },
        ].map(t => (
          <button key={t.v} onClick={() => setTab(t.v)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.v ? 'text-white' : 'text-aw-muted hover:text-aw-text hover:bg-white/5'
            }`}
            style={tab === t.v ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)' } : {}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* ── TAB: Jobs ──────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="aw-card overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-aw-border">
                {['Tipo','Status','Dry Run','Total','Processados','Eps','Capas','Erros','Iniciado','Ações'].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-aw-dim uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingJobs
                ? Array.from({length:4}).map((_,i) => (
                    <tr key={i}><td colSpan={10} className="px-3 py-2"><div className="skeleton h-8 rounded"/></td></tr>
                  ))
                : jobs.map(j => (
                    <tr key={j.id} className="border-b border-aw-border/50 hover:bg-white/2">
                      <td className="px-3 py-3 text-xs font-mono text-aw-muted">{j.job_type}</td>
                      <td className="px-3 py-3"><StatusBadge status={j.status}/></td>
                      <td className="px-3 py-3 text-xs">{j.is_dry_run ? '✓' : '—'}</td>
                      <td className="px-3 py-3 text-xs text-aw-muted">{j.total || 0}</td>
                      <td className="px-3 py-3 text-xs text-aw-muted">{j.processed || 0}</td>
                      <td className="px-3 py-3 text-xs text-green-400">{j.episodes_added || 0}</td>
                      <td className="px-3 py-3 text-xs text-blue-400">{j.covers_added || 0}</td>
                      <td className="px-3 py-3 text-xs text-red-400">{j.errors || 0}</td>
                      <td className="px-3 py-3 text-xs text-aw-dim">
                        {formatDistanceToNow(new Date(j.started_at), { addSuffix: true, locale: ptBR })}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => { setTab('logs'); loadJobLogs(j.id); }}
                            className="text-xs bg-aw-purple/20 text-aw-purple hover:bg-aw-purple/30 px-2 py-1 rounded">
                            Logs
                          </button>
                          {j.status === 'completed' && !j.is_dry_run && (
                            <button onClick={() => handleRollback(j.id)}
                              className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2 py-1 rounded"
                              title="Desfazer importação">
                              <RiArrowGoBackLine size={12}/>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!loadingJobs && jobs.length === 0 && (
                <tr><td colSpan={10} className="text-center py-8 text-aw-muted text-sm">
                  Nenhum job executado ainda. Clique em "Analisar Catálogo" para começar.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB: Mapeamentos ──────────────────────────────── */}
      {tab === 'mappings' && (
        <div className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-aw-dim" size={14}/>
              <input value={mapSearch} onChange={e => { setMapSearch(e.target.value); setMappingPage(1); }}
                placeholder="Buscar anime..." className="aw-input pl-8 py-2 text-sm w-full"/>
            </div>
            <select value={mapStatus} onChange={e => { setMapStatus(e.target.value); setMappingPage(1); }}
              className="aw-input w-44 py-2 text-sm">
              <option value="">Todos os status</option>
              {Object.entries(STATUS_CFG).filter(([v]) => ['pending','synced','partial','error','review_required'].includes(v))
                .map(([v,c]) => <option key={v} value={v}>{c.label}</option>)}
            </select>
            <button onClick={loadMappings} className="aw-btn-primary text-sm px-4 py-2">Filtrar</button>
          </div>

          <div className="aw-card overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-aw-border">
                  {['Anime (Banco)','Correspondência AnFire','Score','Status','Eps','Ações'].map(h => (
                    <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-aw-dim uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingMap
                  ? Array.from({length:6}).map((_,i) => (
                      <tr key={i}><td colSpan={6} className="px-3 py-2"><div className="skeleton h-8 rounded"/></td></tr>
                    ))
                  : mappings.map(m => (
                      <tr key={m.id} className={`border-b border-aw-border/50 hover:bg-white/2 ${
                        m.status === 'review_required' ? 'bg-orange-500/5' : ''
                      }`}>
                        <td className="px-3 py-3">
                          <p className="text-sm font-medium text-aw-text truncate max-w-[180px]">{m.title_english || m.title}</p>
                          <p className="text-xs text-aw-muted">eps_db: {m.episodes_count || 0}</p>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-xs text-aw-muted truncate max-w-[160px]">{m.external_title || m.external_slug}</p>
                          <p className="text-xs text-aw-dim">{m.external_slug}</p>
                        </td>
                        <td className="px-3 py-3">
                          {m.match_score != null && (
                            <span className={`text-xs font-semibold ${
                              m.match_score >= 85 ? 'text-green-400' :
                              m.match_score >= 50 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {Math.round(m.match_score)}%
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3"><StatusBadge status={m.status}/></td>
                        <td className="px-3 py-3 text-xs text-aw-muted">{m.episode_count || 0}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1">
                            {m.status === 'review_required' && (
                              <button
                                onClick={async () => {
                                  const r = await importerAPI.updateMapping(m.id, { status: 'pending' });
                                  toast.success('Aprovado para sincronização.'); loadMappings();
                                }}
                                className="text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 px-2 py-1 rounded"
                                title="Aprovar mapeamento">
                                <RiCheckLine size={12}/>
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (!confirm('Remover mapeamento?')) return;
                                await importerAPI.deleteMapping(m.id);
                                toast.success('Mapeamento removido.'); loadMappings();
                              }}
                              className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2 py-1 rounded"
                              title="Remover mapeamento">
                              <RiDeleteBinLine size={12}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
                {!loadingMap && mappings.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-aw-muted text-sm">
                    {mapStatus || mapSearch ? 'Nenhum resultado.' : 'Execute "Analisar Catálogo" para gerar mapeamentos.'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {mappingTotal > 25 && (
            <div className="flex justify-center gap-2 mt-2">
              {Array.from({ length: Math.min(Math.ceil(mappingTotal/25), 8) }, (_, i) => i+1).map(p => (
                <button key={p} onClick={() => setMappingPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                    p === mappingPage ? 'text-white' : 'text-aw-muted hover:text-aw-text hover:bg-white/5'
                  }`}
                  style={p === mappingPage ? { background: 'linear-gradient(135deg,#a855f7,#ec4899)' } : {}}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Logs ─────────────────────────────────────── */}
      {tab === 'logs' && (
        <div className="space-y-4">
          {/* Selector de job */}
          <div className="flex gap-3 flex-wrap">
            <select
              className="aw-input flex-1 py-2 text-sm"
              onChange={e => e.target.value && loadJobLogs(e.target.value)}
              defaultValue="">
              <option value="">Selecione um job para ver os logs</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.job_type} — {format(new Date(j.started_at), 'dd/MM HH:mm', {locale:ptBR})} — {STATUS_CFG[j.status]?.label}
                </option>
              ))}
            </select>
          </div>

          {selectedJob && (
            <>
              {/* Info do job selecionado */}
              <div className="aw-card p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><p className="text-xs text-aw-dim">Tipo</p><p className="text-aw-text font-medium">{selectedJob.job_type}</p></div>
                <div><p className="text-xs text-aw-dim">Status</p><StatusBadge status={selectedJob.status}/></div>
                <div><p className="text-xs text-aw-dim">Processados</p><p className="text-aw-text">{selectedJob.processed}/{selectedJob.total}</p></div>
                <div><p className="text-xs text-aw-dim">Eps importados</p><p className="text-green-400">{selectedJob.episodes_added || 0}</p></div>
              </div>

              {/* Lista de logs */}
              <div className="aw-card p-0 overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto p-3 space-y-1 font-mono text-xs">
                  {jobLogs.length === 0 && (
                    <p className="text-aw-muted text-center py-4">Nenhum log disponível.</p>
                  )}
                  {jobLogs.map((l, i) => (
                    <div key={i} className={`flex gap-2 ${LOG_CLR[l.level] || 'text-aw-muted'}`}>
                      <span className="text-aw-dim flex-shrink-0">{format(new Date(l.created_at), 'HH:mm:ss')}</span>
                      <span className="flex-shrink-0 w-12">[{l.level}]</span>
                      <span className="flex-1">{l.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!selectedJob && (
            <div className="text-center py-16 text-aw-muted text-sm">
              Selecione um job acima para ver os logs detalhados.
            </div>
          )}
        </div>
      )}

      {/* Instruções de configuração */}
      <details className="aw-card p-4">
        <summary className="text-sm font-semibold text-aw-text cursor-pointer flex items-center gap-2">
          <RiInformationLine className="text-aw-purple" size={16}/> Como configurar a AnFireAPI
        </summary>
        <div className="mt-4 space-y-3 text-sm text-aw-muted">
          <p><strong className="text-aw-text">1. Clone a AnFireAPI:</strong></p>
          <pre className="bg-aw-bg rounded-lg p-3 text-xs overflow-x-auto text-aw-purple">
{`git clone https://github.com/MestreTM/AnFireAPI-Anime-Player
cd AnFireAPI-Anime-Player/NodeJS
npm install`}
          </pre>
          <p><strong className="text-aw-text">2. Configure o .env da AnFireAPI:</strong></p>
          <pre className="bg-aw-bg rounded-lg p-3 text-xs overflow-x-auto text-aw-purple">
{`API_KEY=sua_chave_aqui
PORT=4000
USE_CACHE=false`}
          </pre>
          <p><strong className="text-aw-text">3. Inicie a AnFireAPI:</strong></p>
          <pre className="bg-aw-bg rounded-lg p-3 text-xs overflow-x-auto text-aw-purple">
{`node app.js
# Rodando em http://localhost:4000`}
          </pre>
          <p><strong className="text-aw-text">4. Configure o backend do ANIMES WORLD (.env):</strong></p>
          <pre className="bg-aw-bg rounded-lg p-3 text-xs overflow-x-auto text-aw-purple">
{`ANFIRE_API_URL=http://localhost:4000
ANFIRE_API_KEY=sua_chave_aqui
ANFIRE_BASE_URL=https://animefire.plus
ANFIRE_RATE_LIMIT=1200`}
          </pre>
          <p><strong className="text-aw-text">5. Execute os passos na ordem:</strong></p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Clique em <strong className="text-aw-purple">🔍 Analisar Catálogo</strong> — faz o matching (sem alterar banco)</li>
            <li>Revise os mapeamentos na aba <strong className="text-aw-purple">Mapeamentos</strong></li>
            <li>Aprove mapeamentos marcados como "Revisão" se estiverem corretos</li>
            <li>Execute <strong className="text-aw-purple">🖼️ Completar Capas</strong> para preencher capas faltantes</li>
            <li>Execute <strong className="text-aw-purple">▶️ Importar Episódios</strong> para importar os episódios</li>
          </ol>
          <p className="text-yellow-400 flex items-center gap-1.5 mt-3">
            <RiAlertLine size={14}/> Use <strong>Dry Run</strong> antes para ver o que seria importado sem alterar nada.
          </p>
        </div>
      </details>
    </div>
  );
}
