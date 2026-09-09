import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    adminAPI.getTickets({ limit: 50 }).then(r => setTickets(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openTicket = (t) => {
    setSelected(t);
    setReply(t.admin_reply || '');
    setStatus(t.status);
  };

  const handleReply = async () => {
    setSaving(true);
    try {
      await adminAPI.replyTicket(selected.id, { reply, status });
      toast.success('Resposta enviada!');
      setSelected(null);
      load();
    } catch { toast.error('Erro ao responder.'); }
    finally { setSaving(false); }
  };

  const statusColor = { open: 'text-yellow-400', in_progress: 'text-blue-400', resolved: 'text-green-400', closed: 'text-aw-dim' };
  const statusLabel = { open: 'Aberto', in_progress: 'Em atendimento', resolved: 'Resolvido', closed: 'Fechado' };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-white">🎧 Suporte</h2>

      <div className="aw-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-aw-border">
              {['Usuário','Assunto','Categoria','Status','Data','Ações'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-aw-dim uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({length:5}).map((_,i)=>(
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-8 rounded" /></td></tr>
                ))
              : tickets.map(t=>(
                  <tr key={t.id} className="border-b border-aw-border/50 hover:bg-white/2">
                    <td className="px-4 py-3">
                      <p className="font-medium text-aw-text text-sm">{t.username || '—'}</p>
                      <p className="text-xs text-aw-muted">{t.email}</p>
                    </td>
                    <td className="px-4 py-3 text-aw-muted text-xs max-w-[160px] truncate">{t.subject}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-aw-border px-2 py-0.5 rounded text-aw-muted">{t.category}</span></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${statusColor[t.status]}`}>{statusLabel[t.status]}</span>
                    </td>
                    <td className="px-4 py-3 text-aw-dim text-xs">
                      {format(new Date(t.created_at), 'dd/MM/yy', {locale:ptBR})}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openTicket(t)}
                        className="text-xs bg-aw-purple/20 text-aw-purple hover:bg-aw-purple/30 px-3 py-1 rounded">
                        Responder
                      </button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Responder Ticket" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="aw-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-aw-text">{selected.subject}</span>
                <span className="text-xs bg-aw-border px-2 py-0.5 rounded text-aw-muted">{selected.category}</span>
              </div>
              <p className="text-xs text-aw-muted">De: {selected.username} ({selected.email})</p>
              <p className="text-sm text-aw-muted leading-relaxed border-t border-aw-border pt-3">{selected.message}</p>
            </div>
            <div>
              <label className="aw-label text-xs">Sua resposta</label>
              <textarea value={reply} onChange={e=>setReply(e.target.value)} rows={5}
                className="aw-input resize-none" placeholder="Digite sua resposta..." />
            </div>
            <div>
              <label className="aw-label text-xs">Status</label>
              <select value={status} onChange={e=>setStatus(e.target.value)} className="aw-input text-sm">
                <option value="open">Aberto</option>
                <option value="in_progress">Em atendimento</option>
                <option value="resolved">Resolvido</option>
                <option value="closed">Fechado</option>
              </select>
            </div>
            <button onClick={handleReply} disabled={saving} className="aw-btn-primary w-full text-sm py-2.5">
              {saving ? 'Enviando...' : 'Enviar resposta'}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
