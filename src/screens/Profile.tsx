import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import {
  calcBMI, bmiCategory, calcBMR, calcTDEE, goalKcalFromObjective, suggestMacros,
  ATTIVITA_MULT, type Profile, type MetodoAllenamento,
} from '@/lib/types';
import { Save, Activity, Target, Flame, Calculator } from 'lucide-react';
import { describeGeminiError, generateMealPlan, type MealPlan } from '@/lib/gemini';

const GIORNI = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const ATTREZZATURA = ['bilanciere', 'manubri', 'sbarra', 'panca', 'kettlebell', 'elastici', 'corpo libero', 'macchine'];
const DURATE = [45, 60, 75, 90];

const ATTIVITA_LABEL: Record<string, string> = {
  sedentario: 'Sedentario (lavoro d\'ufficio, no sport)',
  leggero: 'Leggero (esercizio 1-3 volte/sett.)',
  moderato: 'Moderato (esercizio 3-5 volte/sett.)',
  attivo: 'Attivo (esercizio 6-7 volte/sett.)',
  intenso: 'Intenso (lavoro fisico + sport quotidiano)',
};

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [eta, setEta] = useState('');
  const [altezza, setAltezza] = useState('');
  const [peso, setPeso] = useState('');
  const [sesso, setSesso] = useState<'maschio' | 'femmina'>('maschio');
  const [livello, setLivello] = useState<string>('sedentario');
  const [esperienza, setEsperienza] = useState<'principiante' | 'intermedio' | 'avanzato'>('principiante');
  const [metodoAllenamento, setMetodoAllenamento] = useState<MetodoAllenamento>('standard');
  const [obiettivo, setObiettivo] = useState('Mantenimento');
  const [giorni, setGiorni] = useState<number[]>([1, 3, 5]);
  const [durata, setDurata] = useState(60);
  const [attrezzi, setAttrezzi] = useState<string[]>(['bilanciere', 'manubri', 'panca']);
  const [limitazioni, setLimitazioni] = useState('');
  const [allergie, setAllergie] = useState('');
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [mealPlanError, setMealPlanError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
      if (data) {
        setProfile(data as Profile);
        setEta(data.eta?.toString() ?? '');
        setAltezza(data.altezza_cm?.toString() ?? '');
        setPeso(data.peso_kg?.toString() ?? '');
        setSesso(data.sesso ?? 'maschio');
        setLivello(data.livello_attivita ?? 'sedentario');
        setEsperienza(data.esperienza ?? 'principiante');
        setMetodoAllenamento(data.metodo_allenamento ?? 'standard');
        setObiettivo(data.obiettivo ?? 'Mantenimento');
        setGiorni(data.giorni_settimana ?? [1, 3, 5]);
        setDurata(data.durata_allenamento_min ?? 60);
        setAttrezzi(data.attrezzatura ?? ['bilanciere', 'manubri', 'panca']);
        setLimitazioni(data.limitazioni ?? '');
        setAllergie(data.allergie_intolleranze ?? '');
      }
      setLoading(false);
    })();
  }, [user]);

  const imc = calcBMI(Number(peso), Number(altezza));
  const cat = bmiCategory(imc);

  // Calcolo calorie
  const hasCalcolo = eta && altezza && peso;
  const bmr = hasCalcolo ? calcBMR({ peso_kg: Number(peso), altezza_cm: Number(altezza), eta: Number(eta), sesso }) : 0;
  const tdee = hasCalcolo ? calcTDEE(bmr, livello) : 0;
  const goalKcal = hasCalcolo ? goalKcalFromObjective(tdee, obiettivo) : 0;
  const macros = hasCalcolo && peso ? suggestMacros(goalKcal, Number(peso), obiettivo) : null;

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    const payload = {
      user_id: user.id,
      eta: Number(eta) || null,
      altezza_cm: Number(altezza) || null,
      peso_kg: Number(peso) || null,
      sesso,
      livello_attivita: livello,
      esperienza,
      metodo_allenamento: metodoAllenamento,
      obiettivo,
      giorni_settimana: giorni,
      durata_allenamento_min: durata,
      attrezzatura: attrezzi,
      limitazioni,
      allergie_intolleranze: allergie,
      updated_at: new Date().toISOString(),
    };
    if (profile) {
      await supabase.from('profiles').update(payload).eq('user_id', user.id);
    } else {
      await supabase.from('profiles').insert(payload);
    }
    // aggiorna obiettivo calorico odierno
    if (goalKcal) {
      const today = new Date().toISOString().slice(0, 10);
      const { data: existing } = await supabase
        .from('daily_goals')
        .select('id')
        .eq('user_id', user.id)
        .eq('data', today)
        .maybeSingle();
      if (existing) {
        await supabase.from('daily_goals').update({
          kcal_obiettivo: goalKcal,
          proteine_obiettivo: macros?.p ?? null,
          carboidrati_obiettivo: macros?.c ?? null,
          grassi_obiettivo: macros?.g ?? null,
        }).eq('id', existing.id);
      } else {
        await supabase.from('daily_goals').insert({
          user_id: user.id,
          data: today,
          kcal_obiettivo: goalKcal,
          proteine_obiettivo: macros?.p ?? null,
          carboidrati_obiettivo: macros?.c ?? null,
          grassi_obiettivo: macros?.g ?? null,
        });
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <div className="text-center text-neutral-400 py-12">Caricamento profilo…</div>;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold mb-1 tracking-tight">Profilo</h2>
        <p className="text-neutral-400 text-sm">Configura i tuoi dati per schede e calorie personalizzate</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Età" value={eta || '—'} unit="anni" />
        <StatCard label="Altezza" value={altezza || '—'} unit="cm" />
        <StatCard label="Peso" value={peso || '—'} unit="kg" />
        <div className="b44-card p-4">
          <p className="text-xs text-neutral-400 mb-1">IMC</p>
          <p className={`text-2xl font-bold ${cat.color}`}>{imc || '—'}</p>
          <p className={`text-xs ${cat.color}`}>{cat.label}</p>
        </div>
      </div>

      {/* Calcolo calorico */}
      {hasCalcolo ? (
        <div className="b44-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-emerald-500" />
            <p className="font-semibold">Fabbisogno calorico calcolato</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <CalCard label="Metabolismo basale" value={bmr} unit="kcal" color="text-white" />
            <CalCard label="Fabbisogno totale (TDEE)" value={tdee} unit="kcal" color="text-white" />
            <CalCard label="Obiettivo giornaliero" value={goalKcal} unit="kcal" color="text-emerald-400" />
            <div className="bg-black/70 rounded-lg p-3 border border-white/10">
              <p className="text-xs text-neutral-400 mb-1">Attività</p>
              <p className="text-sm font-semibold text-white">{ATTIVITA_MULT[livello]}x</p>
              <p className="text-xs text-neutral-400 capitalize">{livello}</p>
            </div>
          </div>
          {macros && (
            <div className="grid grid-cols-3 gap-3 mb-3">
              <CalCard label="Proteine" value={macros.p} unit="g" color="text-red-400" />
              <CalCard label="Carboidrati" value={macros.c} unit="g" color="text-amber-400" />
              <CalCard label="Grassi" value={macros.g} unit="g" color="text-yellow-400" />
            </div>
          )}
          <p className="text-xs text-neutral-400 leading-relaxed">
            Formula Mifflin-St Jeor (validata). Il metabolismo basale si moltiplica per un coefficiente
            legato al tuo livello di attività giornaliera per ottenere il fabbisogno totale (TDEE).
            L'obiettivo calorico è adattato: −500 kcal per dimagrire, +300 per massa, +150 per resistenza,
            TDEE per mantenimento. L'IMC è solo un indicatore e non determina le calorie.
          </p>
        </div>
      ) : (
        <div className="bg-amber-950/40 border border-amber-900/50 rounded-xl p-4 text-amber-300 text-sm">
          Inserisci età, sesso, altezza e peso per calcolare automaticamente il fabbisogno calorico.
        </div>
      )}

      <div className="b44-card p-5 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Età">
            <input type="number" value={eta} onChange={(e) => setEta(e.target.value)} className={inputCls} placeholder="30" />
          </Field>
          <Field label="Altezza (cm)">
            <input type="number" value={altezza} onChange={(e) => setAltezza(e.target.value)} className={inputCls} placeholder="175" />
          </Field>
          <Field label="Peso (kg)">
            <input type="number" step="0.1" value={peso} onChange={(e) => setPeso(e.target.value)} className={inputCls} placeholder="75" />
          </Field>
        </div>

        <Field label="Sesso (per calcolo metabolismo)">
          <div className="flex gap-2">
            {(['maschio', 'femmina'] as const).map((s) => (
              <button key={s} onClick={() => setSesso(s)}
                className={`flex-1 py-2 rounded-lg text-sm capitalize transition-colors ${sesso === s ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/40' : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'}`}>
                {s}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Livello di attività quotidiana">
          <select value={livello} onChange={(e) => setLivello(e.target.value)} className={inputCls}>
            {Object.entries(ATTIVITA_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Esperienza di allenamento">
            <div className="flex gap-2">
              {(['principiante', 'intermedio', 'avanzato'] as const).map((e) => (
                <button key={e} onClick={() => setEsperienza(e)}
                  className={`flex-1 py-2 rounded-lg text-sm capitalize transition-colors ${esperienza === e ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/40' : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'}`}>
                  {e}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Metodo di allenamento">
            <div className="flex gap-2">
              {(['standard', 'hst'] as const).map((metodo) => (
                <button key={metodo} onClick={() => setMetodoAllenamento(metodo)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${metodoAllenamento === metodo ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/40' : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'}`}>
                  {metodo === 'hst' ? 'HST' : 'Standard'}
                </button>
              ))}
            </div>
            {metodoAllenamento === 'hst' && <p className="text-xs text-neutral-400 mt-2">Ciclo progressivo 15 → 10 → 5 ripetizioni, con sedute full body e recupero tra i giorni scelti.</p>}
          </Field>
          <Field label="Obiettivo">
            <select value={obiettivo} onChange={(e) => setObiettivo(e.target.value)} className={inputCls}>
              <option>Dimagrire</option>
              <option>Ricomposizione</option>
              <option>Massa muscolare</option>
              <option>Forza</option>
              <option>Mantenimento</option>
              <option>Resistenza</option>
            </select>
          </Field>
        </div>

        <Field label="Giorni di allenamento">
          <div className="flex gap-1.5 flex-wrap">
            {GIORNI.map((g, i) => {
              const on = giorni.includes(i);
              return (
                <button key={i} onClick={() => setGiorni(on ? giorni.filter((x) => x !== i) : [...giorni, i].sort())}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${on ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow shadow-emerald-900/40' : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'}`}>
                  {g}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Durata allenamento">
          <div className="flex gap-2">
            {DURATE.map((d) => (
              <button key={d} onClick={() => setDurata(d)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${durata === d ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/40' : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'}`}>
                {d} min
              </button>
            ))}
          </div>
        </Field>

        <Field label="Attrezzatura disponibile">
          <div className="flex gap-1.5 flex-wrap">
            {ATTREZZATURA.map((a) => {
              const on = attrezzi.includes(a);
              return (
                <button key={a} onClick={() => setAttrezzi(on ? attrezzi.filter((x) => x !== a) : [...attrezzi, a])}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${on ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow shadow-emerald-900/40' : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'}`}>
                  {a}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Limitazioni fisiche (infortuni, dolori, ecc.)">
          <textarea value={limitazioni} onChange={(e) => setLimitazioni(e.target.value)}
            className={inputCls + ' min-h-[70px] resize-y'} placeholder="Es. problemi al ginocchio, lombalgia…" />
        </Field>

        <Field label="Allergie / intolleranze alimentari">
          <input value={allergie} onChange={(e) => setAllergie(e.target.value)}
            className={inputCls} placeholder="Es. lattosio, glutine, frutta secca…" />
        </Field>

        <button onClick={save} disabled={saving}
          className="w-full py-2.5 b44-btn-green flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Salvataggio…' : saved ? 'Profilo salvato e calorie aggiornate!' : 'Salva profilo'}
        </button>
      </div>

      <div className="b44-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="font-semibold">Piano alimentare AI</p>
            <p className="text-xs text-neutral-400">Genera un piano personalizzato con Gemini in base ai tuoi dati.</p>
          </div>
        </div>
        <button
          type="button"
          disabled={mealPlanLoading}
          onClick={async () => {
            setMealPlanLoading(true);
            setMealPlanError(null);
            try {
              setMealPlan(await generateMealPlan(`obiettivo: ${obiettivo}; peso: ${peso || 'non indicato'} kg; calorie: ${goalKcal || 'da calcolare'}; proteine: ${macros?.p ?? 'da calcolare'} g; allergie: ${allergie || 'nessuna'}`));
            } catch (error) {
              setMealPlanError(describeGeminiError(error, 'Non è stato possibile generare il piano alimentare.'));
            } finally {
              setMealPlanLoading(false);
            }
          }}
          className="w-full py-2 b44-btn-green text-sm disabled:opacity-60"
        >
          {mealPlanLoading ? 'Gemini sta preparando il piano…' : 'Genera piano alimentare personalizzato'}
        </button>
        {mealPlanError && <p className="text-xs text-amber-400">{mealPlanError}</p>}
        {mealPlan && (
          <div className="bg-black/70 border border-white/10 rounded-xl p-3 space-y-2">
            {mealPlan.pasti.map((pasto, index) => (
              <div key={`${pasto.nome}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{pasto.nome}</span>
                <span className="text-xs text-neutral-400">{pasto.grammi}g · {pasto.kcal} kcal · P{pasto.proteine} C{pasto.carboidrati} G{pasto.grassi}</span>
              </div>
            ))}
            {mealPlan.note && <p className="text-xs text-neutral-400 pt-1">{mealPlan.note}</p>}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="b44-card p-4 flex items-center gap-3">
          <Target className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-sm font-medium">Obiettivo attuale</p>
            <p className="text-xs text-neutral-400">{obiettivo} · {metodoAllenamento === 'hst' ? 'HST' : 'Standard'}</p>
          </div>
        </div>
        <div className="b44-card p-4 flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-sm font-medium">Frequenza</p>
            <p className="text-xs text-neutral-400">{giorni.length} giorni/settimana · {durata} min</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/70 focus:ring-1 focus:ring-red-500/30 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-neutral-200 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="b44-card p-4">
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value}
        {value !== '—' && <span className="text-sm font-normal text-neutral-500 ml-1">{unit}</span>}
      </p>
    </div>
  );
}

function CalCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="bg-black/70 rounded-lg p-3 border border-white/10">
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}<span className="text-xs font-normal text-neutral-500 ml-1">{unit}</span></p>
    </div>
  );
}
