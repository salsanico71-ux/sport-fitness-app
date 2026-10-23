import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { searchFoods, calcFoodValues, FOOD_DB } from '@/lib/foodDb';
import { analyzeFoodImage, describeGeminiError } from '@/lib/gemini';
import type { Food, DailyGoal } from '@/lib/types';
import {
  Plus, Search, Trash2, Camera, Sparkles, Save, X, Flame, Beef, Wheat, Droplet,
} from 'lucide-react';

const PASTI = ['colazione', 'pranzo', 'cena', 'spuntino'] as const;

export default function NutritionScreen() {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [foods, setFoods] = useState<Food[]>([]);
  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [loading, setLoading] = useState(true);

  // form
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<typeof FOOD_DB[0] | null>(null);
  const [grammi, setGrammi] = useState('100');
  const [pasto, setPasto] = useState<typeof PASTI[number]>('pranzo');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // AI modal
  const [aiOpen, setAiOpen] = useState(false);
  const [aiFile, setAiFile] = useState<File | null>(null);
  const [aiPreview, setAiPreview] = useState('');
  const [aiEstimate, setAiEstimate] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      await loadDay();
      setLoading(false);
    })();
  }, [user, date]);

  const loadDay = async () => {
    if (!user) return;
    const { data: f } = await supabase
      .from('foods')
      .select('*')
      .eq('user_id', user.id)
      .eq('data', date)
      .order('created_at', { ascending: true });
    setFoods((f as Food[]) ?? []);

    const { data: g } = await supabase
      .from('daily_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('data', date)
      .maybeSingle();
    setGoal(g as DailyGoal);
  };

  const results = useMemo(() => (query ? searchFoods(query) : []), [query]);
  const computed = useMemo(() => {
    if (!selected) return null;
    return calcFoodValues(selected, Number(grammi) || 0);
  }, [selected, grammi]);

  const totals = useMemo(() => {
    return foods.reduce(
      (acc, f) => ({
        kcal: acc.kcal + (f.kcal ?? 0),
        proteine: acc.proteine + (f.proteine ?? 0),
        carboidrati: acc.carboidrati + (f.carboidrati ?? 0),
        grassi: acc.grassi + (f.grassi ?? 0),
      }),
      { kcal: 0, proteine: 0, carboidrati: 0, grassi: 0 }
    );
  }, [foods]);

  const goalKcal = goal?.kcal_obiettivo ?? 2000;
  const remaining = Math.max(0, goalKcal - totals.kcal);

  const saveFood = async () => {
    if (!user || !selected || !computed) return;
    setSaving(true);
    await supabase.from('foods').insert({
      user_id: user.id,
      nome: selected.nome,
      grammi: Number(grammi),
      kcal: computed.kcal,
      proteine: computed.proteine,
      carboidrati: computed.carboidrati,
      grassi: computed.grassi,
      pasto,
      data: date,
      note,
      ai_stimato: false,
    });
    setQuery('');
    setSelected(null);
    setNote('');
    setGrammi('100');
    setSaving(false);
    await loadDay();
  };

  const deleteFood = async (id: string) => {
    await supabase.from('foods').delete().eq('id', id);
    await loadDay();
  };

  const saveGoal = async () => {
    if (!user) return;
    const v = Number(prompt('Obiettivo calorie giornaliere:', String(goalKcal)));
    if (!v) return;
    if (goal) {
      await supabase.from('daily_goals').update({ kcal_obiettivo: v }).eq('id', goal.id);
    } else {
      await supabase.from('daily_goals').insert({ user_id: user.id, data: date, kcal_obiettivo: v });
    }
    await loadDay();
  };

  const onPickFile = (f: File | null) => {
    setAiFile(f);
    if (f) {
      const r = new FileReader();
      r.onload = () => setAiPreview(r.result as string);
      r.readAsDataURL(f);
    } else {
      setAiPreview('');
    }
    setAiEstimate(null);
    setAiError(null);
  };

  const runAI = async () => {
    if (!aiFile) return;
    setAiLoading(true);
    setAiError(null);
    setAiEstimate(null);
    try {
      setAiEstimate(await analyzeFoodImage(aiFile));
    } catch (error) {
      setAiError(describeGeminiError(error, 'Analisi Gemini non riuscita. Riprova o usa l\'inserimento manuale.'));
    } finally {
      setAiLoading(false);
    }
  };

  const saveAIFood = async (item: any) => {
    if (!user) return;
    // upload foto
    let fotoUrl = '';
    if (aiFile) {
      const ext = aiFile.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('food-photos').upload(path, aiFile);
      if (!error) {
        const { data } = supabase.storage.from('food-photos').getPublicUrl(path);
        fotoUrl = data.publicUrl;
      }
    }
    await supabase.from('foods').insert({
      user_id: user.id,
      nome: item.nome,
      grammi: item.grammi,
      kcal: item.kcal,
      proteine: item.proteine,
      carboidrati: item.carboidrati,
      grassi: item.grassi,
      pasto,
      data: date,
      foto_url: fotoUrl,
      ai_stimato: true,
      ai_dati: item,
    });
    setAiOpen(false);
    setAiFile(null);
    setAiPreview('');
    setAiEstimate(null);
    await loadDay();
  };

  if (loading) return <div className="text-center text-neutral-400 py-12">Caricamento…</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1 tracking-tight">Alimentazione</h2>
          <p className="text-neutral-400 text-sm">Calorie e macronutrienti giornalieri</p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/70"
        />
      </div>

      {/* Riepilogo */}
      <div className="b44-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-neutral-400">Calorie consumate</p>
            <p className="text-3xl font-bold">
              {Math.round(totals.kcal)}
              <span className="text-sm text-neutral-500 font-normal"> / {goalKcal} kcal</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-400">Rimanenti</p>
            <p className="text-2xl font-bold text-emerald-400">{Math.round(remaining)}</p>
          </div>
        </div>
        <div className="h-2 bg-black/50 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-red-500 transition-all"
            style={{ width: `${Math.min(100, (totals.kcal / goalKcal) * 100)}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Macro icon={Beef} label="Proteine" value={totals.proteine} color="text-red-400" />
          <Macro icon={Wheat} label="Carbo" value={totals.carboidrati} color="text-amber-400" />
          <Macro icon={Droplet} label="Grassi" value={totals.grassi} color="text-yellow-400" />
        </div>
        <button
          onClick={saveGoal}
          className="mt-3 text-xs text-emerald-400/80 hover:text-emerald-300 transition-colors flex items-center gap-1"
        >
          <Flame className="w-3 h-3" /> Modifica obiettivo giornaliero
        </button>
      </div>

      {/* Aggiungi */}
      <div className="b44-card p-4 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => { setAiOpen(true); setAiError(null); }}
            className="flex-1 py-2.5 b44-btn-green text-sm flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" /> Stima con foto (AI)
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <div className="flex-1 h-px bg-white/10" /> oppure manuale <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
            placeholder="Cerca alimento…"
            className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/70 transition-colors"
          />
          {query && !selected && results.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-neutral-900/95 border border-white/10 rounded-lg overflow-hidden shadow-xl max-h-64 overflow-y-auto">
              {results.map((f) => (
                <button
                  key={f.nome}
                  onClick={() => { setSelected(f); setQuery(f.nome); }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 transition-colors text-sm flex justify-between"
                >
                  <span>{f.nome}</span>
                  <span className="text-neutral-400 text-xs">{f.kcal} kcal/100g</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="bg-black/70 border border-white/10 rounded-lg p-3 space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">{selected.nome}</p>
              <button onClick={() => { setSelected(null); setQuery(''); }} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Grammi</label>
                <input
                  type="number"
                  value={grammi}
                  onChange={(e) => setGrammi(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/70"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Pasto</label>
                <select
                  value={pasto}
                  onChange={(e) => setPasto(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/70"
                >
                  {PASTI.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
                </select>
              </div>
            </div>
            {computed && (
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-black/70 border border-white/10 rounded-lg py-1.5"><p className="text-neutral-400">kcal</p><p className="font-semibold text-white">{computed.kcal}</p></div>
                <div className="bg-black/70 border border-white/10 rounded-lg py-1.5"><p className="text-neutral-400">P</p><p className="font-semibold text-red-400">{computed.proteine}g</p></div>
                <div className="bg-black/70 border border-white/10 rounded-lg py-1.5"><p className="text-neutral-400">C</p><p className="font-semibold text-amber-400">{computed.carboidrati}g</p></div>
                <div className="bg-black/70 border border-white/10 rounded-lg py-1.5"><p className="text-neutral-400">G</p><p className="font-semibold text-yellow-400">{computed.grassi}g</p></div>
              </div>
            )}
            <button
              onClick={saveFood}
              disabled={saving}
              className="w-full py-2 b44-btn-green text-sm flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'Salvo…' : 'Aggiungi al pasto'}
            </button>
          </div>
        )}
      </div>

      {/* Lista per pasto */}
      {PASTI.map((p) => {
        const items = foods.filter((f) => f.pasto === p);
        if (!items.length) return null;
        const kcalP = items.reduce((a, f) => a + (f.kcal ?? 0), 0);
        return (
          <div key={p} className="b44-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/70 border-b border-white/10">
              <p className="font-semibold capitalize">{p}</p>
              <span className="text-xs text-emerald-400/80">{Math.round(kcalP)} kcal</span>
            </div>
            <div className="divide-y divide-white/5">
              {items.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-3">
                  {f.foto_url && (
                    <img src={f.foto_url} alt={f.nome} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-sm truncate">{f.nome}</p>
                      {f.ai_stimato && <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-neutral-400">
                      {f.grammi}g · {Math.round(f.kcal ?? 0)} kcal · P{f.proteine ?? 0} C{f.carboidrati ?? 0} G{f.grassi ?? 0}
                    </p>
                  </div>
                  <button onClick={() => deleteFood(f.id)} className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {foods.length === 0 && (
        <div className="text-center py-10 text-neutral-400 text-sm b44-card">
          Nessun alimento registrato per questa giornata.
        </div>
      )}

      {/* AI Modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setAiOpen(false)}>
          <div className="b44-card max-w-md w-full p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-400" /> Stima AI del piatto</h3>
              <button onClick={() => setAiOpen(false)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Foto del piatto</label>
              <label className="block border-2 border-dashed border-white/15 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500/60 transition-colors">
                {aiPreview ? (
                  <img src={aiPreview} alt="anteprima" className="max-h-48 mx-auto rounded-lg" />
                ) : (
                  <div className="py-6 text-neutral-400 text-sm">
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    Tocca per scattare o caricare una foto
                  </div>
                )}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Pasto</label>
              <select value={pasto} onChange={(e) => setPasto(e.target.value as any)} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/70">
                {PASTI.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
              </select>
            </div>

            {aiError && <p className="text-xs text-amber-400 bg-amber-950/40 border border-amber-900/50 rounded-lg p-2.5">{aiError}</p>}

            <button
              onClick={runAI}
              disabled={!aiFile || aiLoading}
              className="w-full py-2.5 b44-btn-green flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> {aiLoading ? 'Analisi in corso…' : 'Stima alimenti'}
            </button>

            {aiEstimate?.note && (
              <p className="text-xs text-neutral-300 bg-black/70 border border-white/10 rounded-lg p-2.5">{aiEstimate.note}</p>
            )}

            {aiEstimate?.foods?.map((item: any, i: number) => (
              <div key={i} className="bg-black/70 border border-white/10 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{item.nome}</p>
                  {item.incerto && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-900/50">Stima incerta — verifica</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="number"
                    defaultValue={item.grammi}
                    onChange={(e) => (item.grammi = Number(e.target.value))}
                    className="px-2 py-1.5 bg-black/50 border border-white/10 rounded text-white"
                  />
                  <input
                    defaultValue={item.nome}
                    onChange={(e) => (item.nome = e.target.value)}
                    className="px-2 py-1.5 bg-black/50 border border-white/10 rounded text-white col-span-2"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <NumInput label="kcal" value={item.kcal} onChange={(v) => (item.kcal = v)} />
                  <NumInput label="P" value={item.proteine} onChange={(v) => (item.proteine = v)} />
                  <NumInput label="C" value={item.carboidrati} onChange={(v) => (item.carboidrati = v)} />
                  <NumInput label="G" value={item.grassi} onChange={(v) => (item.grassi = v)} />
                </div>
                <button
                  onClick={() => saveAIFood(item)}
                  className="w-full py-2 b44-btn-green text-sm flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Salva
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Macro({ icon: Icon, label, value, color }: { icon: typeof Beef; label: string; value: number; color: string }) {
  return (
    <div className="bg-black/70 border border-white/10 rounded-lg p-2.5">
      <Icon className={`w-4 h-4 ${color} mb-1`} />
      <p className="text-xs text-neutral-400">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>{Math.round(value * 10) / 10}g</p>
    </div>
  );
}

function NumInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-[10px] text-neutral-400 mb-0.5">{label}</label>
      <input
        type="number"
        defaultValue={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-2 py-1.5 bg-black/50 border border-white/10 rounded text-white text-xs"
      />
    </div>
  );
}
