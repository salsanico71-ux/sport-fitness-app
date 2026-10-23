import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { calcBMI, bmiCategory, type WeightLog } from '@/lib/types';
import { Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react';

export default function ProgressScreen() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [peso, setPeso] = useState('');
  const [altezza, setAltezza] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('data', { ascending: true });
      const arr = (data as WeightLog[]) ?? [];
      setLogs(arr);
      if (arr.length) setAltezza(arr[arr.length - 1].altezza_cm?.toString() ?? '');
      setLoading(false);
    })();
  }, [user]);

  const addLog = async () => {
    if (!user || !peso) return;
    setSaving(true);
    const p = Number(peso);
    const a = Number(altezza);
    const imc = a ? calcBMI(p, a) : null;
    await supabase.from('weight_logs').insert({
      user_id: user.id,
      peso_kg: p,
      altezza_cm: a || null,
      imc,
      data: new Date().toISOString().slice(0, 10),
      note,
    });
    setPeso('');
    setNote('');
    const { data } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('data', { ascending: true });
    setLogs((data as WeightLog[]) ?? []);
    setSaving(false);
  };

  const del = async (id: string) => {
    await supabase.from('weight_logs').delete().eq('id', id);
    setLogs(logs.filter((l) => l.id !== id));
  };

  if (loading) return <div className="text-center text-neutral-400 py-12">Caricamento…</div>;

  const current = logs[logs.length - 1];
  const first = logs[0];
  const delta = current && first ? Number(current.peso_kg) - Number(first.peso_kg) : 0;
  const curCat = current?.imc ? bmiCategory(current.imc) : null;

  // SVG chart
  const W = 600;
  const H = 200;
  const padX = 40;
  const padY = 20;
  const weights = logs.map((l) => Number(l.peso_kg));
  const imcs = logs.map((l) => Number(l.imc ?? 0));
  const minW = weights.length ? Math.min(...weights) - 1 : 0;
  const maxW = weights.length ? Math.max(...weights) + 1 : 1;
  const minI = imcs.length ? Math.min(...imcs) - 1 : 0;
  const maxI = imcs.length ? Math.max(...imcs) + 1 : 1;

  const xScale = (i: number) => padX + (i / Math.max(1, logs.length - 1)) * (W - padX * 2);
  const yW = (v: number) => H - padY - ((v - minW) / (maxW - minW || 1)) * (H - padY * 2);
  const yI = (v: number) => H - padY - ((v - minI) / (maxI - minI || 1)) * (H - padY * 2);

  const weightPath = logs.map((l, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yW(Number(l.peso_kg))}`).join(' ');
  const imcPath = logs.map((l, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yI(Number(l.imc ?? 0))}`).join(' ');

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold mb-1 tracking-tight">Progressi</h2>
        <p className="text-neutral-400 text-sm">Storico peso e IMC nel tempo</p>
      </div>

      {current && (
        <div className="grid grid-cols-3 gap-3">
          <div className="b44-card p-4">
            <p className="text-xs text-neutral-400 mb-1">Peso attuale</p>
            <p className="text-2xl font-bold">{current.peso_kg} kg</p>
          </div>
          <div className="b44-card p-4">
            <p className="text-xs text-neutral-400 mb-1">IMC</p>
            <p className={`text-2xl font-bold ${curCat?.color ?? ''}`}>{current.imc ?? '—'}</p>
            <p className={`text-xs ${curCat?.color ?? ''}`}>{curCat?.label ?? ''}</p>
          </div>
          <div className="b44-card p-4">
            <p className="text-xs text-neutral-400 mb-1">Variazione</p>
            <p className={`text-2xl font-bold flex items-center gap-1 ${delta < 0 ? 'text-emerald-400' : delta > 0 ? 'text-red-400' : ''}`}>
              {delta > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {delta > 0 ? '+' : ''}{delta.toFixed(1)} kg
            </p>
          </div>
        </div>
      )}

      {/* Form inserimento */}
      <div className="b44-card p-4">
        <p className="text-sm font-semibold mb-3">Registra nuovo peso</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Peso (kg)</label>
            <input type="number" step="0.1" value={peso} onChange={(e) => setPeso(e.target.value)} className={inp} placeholder="75.0" />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Altezza (cm)</label>
            <input type="number" value={altezza} onChange={(e) => setAltezza(e.target.value)} className={inp} placeholder="175" />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Note</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} className={inp} placeholder="opzionale" />
          </div>
        </div>
        <button
          onClick={addLog}
          disabled={saving || !peso}
          className="mt-3 w-full py-2.5 b44-btn-green flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> {saving ? 'Salvo…' : 'Aggiungi misurazione'}
        </button>
      </div>

      {/* Grafico */}
      {logs.length > 1 ? (
        <div className="b44-card p-4">
          <p className="text-sm font-semibold mb-3">Andamento</p>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {/* grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <line key={t} x1={padX} x2={W - padX} y1={padY + t * (H - padY * 2)} y2={padY + t * (H - padY * 2)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            ))}
            {/* peso line */}
            <path d={weightPath} fill="none" stroke="#ef4444" strokeWidth="2.5" />
            {logs.map((l, i) => (
              <circle key={l.id} cx={xScale(i)} cy={yW(Number(l.peso_kg))} r="3.5" fill="#ef4444" />
            ))}
            {/* imc line */}
            <path d={imcPath} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5 3" />
            {logs.map((l, i) => (
              <circle key={'i' + l.id} cx={xScale(i)} cy={yI(Number(l.imc ?? 0))} r="3" fill="#10b981" />
            ))}
            {/* labels */}
            <text x={padX} y={14} fill="#ef4444" fontSize="11">Peso (kg)</text>
            <text x={W - padX - 60} y={14} fill="#10b981" fontSize="11">IMC</text>
          </svg>
          <div className="flex justify-between mt-2 text-xs text-neutral-400">
            <span>{logs[0].data}</span>
            <span>{logs[logs.length - 1].data}</span>
          </div>
        </div>
      ) : (
        <div className="b44-card p-8 text-center text-neutral-400 text-sm">
          Aggiungi almeno 2 misurazioni per visualizzare il grafico.
        </div>
      )}

      {/* Storico */}
      {logs.length > 0 && (
        <div className="b44-card overflow-hidden">
          <div className="px-4 py-2.5 bg-black/70 border-b border-white/10 font-semibold text-sm">Storico misurazioni</div>
          <div className="divide-y divide-white/10">
            {[...logs].reverse().map((l) => (
              <div key={l.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium text-sm">{l.peso_kg} kg · IMC {l.imc ?? '—'}</p>
                  <p className="text-xs text-neutral-400">{l.data} {l.note ? `· ${l.note}` : ''}</p>
                </div>
                <button onClick={() => del(l.id)} className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const inp = 'w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30 transition-colors';
