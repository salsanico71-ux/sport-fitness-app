import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { generateWorkouts, getExerciseIllustration, getExerciseIllustrationEnd } from '@/lib/exercises';
import type { Profile, Workout, WorkoutExercise, WorkoutLog } from '@/lib/types';
import {
  Sparkles, Play, Youtube, ChevronDown, ChevronRight, Save, FileText,
  Trash2, Dumbbell, Calendar, Plus,
} from 'lucide-react';

const HST_DECONDITIONING_MS = 7 * 24 * 60 * 60 * 1000;

export default function WorkoutScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [week, setWeek] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, WorkoutLog[]>>({});

  const isHst = profile?.metodo_allenamento === 'hst';
  const hstDeconditioningStartedAt = profile?.hst_deconditioning_started_at ? new Date(profile.hst_deconditioning_started_at).getTime() : null;
  const hstDeconditioningElapsed = hstDeconditioningStartedAt ? Date.now() - hstDeconditioningStartedAt : 0;
  const hstDeconditioningActive = isHst && hstDeconditioningStartedAt !== null && hstDeconditioningElapsed < HST_DECONDITIONING_MS;
  const hstDeconditioningComplete = isHst && week === 7 && hstDeconditioningStartedAt !== null && hstDeconditioningElapsed >= HST_DECONDITIONING_MS;

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data: p } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
      setProfile(p);
      await loadWorkouts();
      setLoading(false);
    })();
  }, [user]);

  const loadWorkouts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('workouts')
      .select('*, exercises:workout_exercises(*)')
      .eq('user_id', user.id)
      .order('settimana', { ascending: true })
      .order('created_at', { ascending: true });
    if (data) setWorkouts(data as unknown as Workout[]);
  };

  const generate = async () => {
    if (!profile || !user) return;
    setGenerating(true);

    if (profile.metodo_allenamento === 'hst' && (week === 7 || hstDeconditioningActive)) {
      if (!profile.hst_deconditioning_started_at && week === 7) {
        const startedAt = new Date().toISOString();
        const { error } = await supabase.from('profiles').update({ hst_deconditioning_started_at: startedAt }).eq('user_id', user.id);
        if (!error) setProfile({ ...profile, hst_deconditioning_started_at: startedAt });
        setGenerating(false);
        return;
      }
      if (hstDeconditioningActive || week !== 7) {
        setGenerating(false);
        return;
      }
      const { error } = await supabase.from('profiles').update({ hst_deconditioning_started_at: null }).eq('user_id', user.id);
      if (!error) {
        setProfile({ ...profile, hst_deconditioning_started_at: null });
        setWeek(1);
      }
      setGenerating(false);
      return;
    }

    const { data: previousLogs } = await supabase
      .from('workout_logs')
      .select('exercise_name, peso_usato, created_at')
      .eq('user_id', user.id)
      .not('peso_usato', 'is', null)
      .order('created_at', { ascending: false });
    const carichiPrecedenti: Record<string, number> = {};
    for (const log of previousLogs ?? []) {
      const weight = Number.parseFloat(log.peso_usato ?? '');
      if (log.exercise_name && Number.isFinite(weight) && weight > 0 && carichiPrecedenti[log.exercise_name] === undefined) {
        carichiPrecedenti[log.exercise_name] = weight;
      }
    }

    const generated = generateWorkouts({
      obiettivo: profile.obiettivo ?? 'Mantenimento',
      esperienza: profile.esperienza ?? 'principiante',
      durata_min: profile.durata_allenamento_min ?? 60,
      giorni: profile.giorni_settimana ?? [1, 3, 5],
      attrezzatura: profile.attrezzatura ?? ['corpo libero'],
      limitazioni: profile.limitazioni ?? '',
      settimana: week,
      metodoAllenamento: profile.metodo_allenamento ?? 'standard',
      carichiPrecedenti,
    });

    // elimina vecchie schede della stessa settimana se presenti
    await supabase.from('workouts').delete().eq('user_id', user.id).eq('settimana', week);

    for (const w of generated) {
      const { data: wo } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          nome: w.nome,
          descrizione: w.descrizione,
          durata_min: w.durata_min,
          giorno_settimana: w.giorno_settimana,
          settimana: week,
        })
        .select()
        .single();
      if (wo && w.exercises.length) {
        await supabase.from('workout_exercises').insert(
          w.exercises.map((e) => ({
            workout_id: wo.id,
            user_id: user.id,
            nome: e.nome,
            muscolo: e.muscolo,
            serie: e.serie,
            ripetizioni: e.ripetizioni,
            recupero_sec: e.recupero_sec,
            rir: e.rir,
            peso_target_kg: e.peso_target_kg,
            immagine_url: e.immagine_url,
            youtube_url: e.youtube_url,
            note: e.note,
            ordine: e.ordine,
          }))
        );
      }
    }
    await loadWorkouts();
    setGenerating(false);
  };

  const deleteWorkout = async (id: string) => {
    if (!confirm('Eliminare questa scheda?')) return;
    await supabase.from('workouts').delete().eq('id', id);
    await loadWorkouts();
  };

  const loadLogs = async (workoutId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('workout_id', workoutId)
      .order('data', { ascending: false });
    setLogs((l) => ({ ...l, [workoutId]: (data as WorkoutLog[]) ?? [] }));
  };

  const toggle = (id: string) => {
    const next = expanded === id ? null : id;
    setExpanded(next);
    if (next) loadLogs(id);
  };

  const logExercise = async (workout: Workout, ex: WorkoutExercise) => {
    const serie = prompt('Serie completate:', String(ex.serie ?? 3));
    if (serie === null) return;
    const rip = prompt('Ripetizioni fatte:', ex.ripetizioni ?? '8');
    if (rip === null) return;
    const peso = prompt('Peso usato (kg):', '');
    if (!user) return;
    await supabase.from('workout_logs').insert({
      user_id: user.id,
      workout_id: workout.id,
      exercise_id: ex.id,
      exercise_name: ex.nome,
      serie_completate: Number(serie) || null,
      ripetizioni_fatte: rip,
      peso_usato: peso,
    });
    loadLogs(workout.id);
  };

  const exportPDF = (workout: Workout) => {
    const w = window.open('', '_blank');
    if (!w) return;
    const exercises = workout.exercises ?? [];
    const rows = exercises
      .map(
        (e) => `
      <tr>
        <td class="name">${e.nome}</td>
        <td>${e.muscolo ?? ''}</td>
        <td>${e.serie}</td>
        <td>${e.ripetizioni}</td>
        <td>${e.recupero_sec ?? '-'}s</td>
        <td>${e.rir ?? '-'}</td>
        <td>${
          (getExerciseIllustration(e.nome) || getExerciseIllustrationEnd(e.nome))
            ? `<div class="imgs"><div class="img-wrap"><img src="${getExerciseIllustration(e.nome)}" /><span>Inizio</span></div>${
                getExerciseIllustrationEnd(e.nome)
                  ? `<div class="img-wrap"><img src="${getExerciseIllustrationEnd(e.nome)}" /><span>Fine</span></div>`
                  : ''
              }</div>`
            : 'Segnaposto anatomico'
        }</td>
      </tr>`
      )
      .join('');

    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${workout.nome}</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: -apple-system, system-ui, sans-serif; color: #111; padding: 24px; }
      h1 { font-size: 22px; margin: 0 0 4px; }
      .sub { color: #555; font-size: 13px; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #ddd; font-size: 12px; vertical-align: top; }
      th { background: #f4f4f4; font-size: 11px; text-transform: uppercase; }
      td.name { font-weight: 600; width: 28%; }
      td img { width: 80px; height: 55px; object-fit: cover; border-radius: 4px; display: block; }
      .imgs { display: flex; gap: 8px; }
      .img-wrap { display: flex; flex-direction: column; gap: 2px; }
      .img-wrap span { font-size: 9px; color: #666; text-transform: uppercase; }
      @media print { body { padding: 12px; } }
    </style></head><body>
    <h1>${workout.nome}</h1>
    <div class="sub">${workout.descrizione ?? ''} · ${workout.durata_min ?? '-'} min · Settimana ${workout.settimana}</div>
    <table><thead><tr>
      <th>Esercizio</th><th>Muscolo</th><th>Serie</th><th>Rip</th><th>Recupero</th><th>RIR</th><th>Posizioni</th>
    </tr></thead><tbody>${rows}</tbody></table>
    <script>window.print()</script>
    </body></html>`);
    w.document.close();
  };

  if (loading) return <div className="text-center text-neutral-400 py-12">Caricamento…</div>;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold mb-1 tracking-tight">Allenamento</h2>
        <p className="text-neutral-400 text-sm">Schede personalizzate con progressione settimanale</p>
      </div>

      {!profile?.peso_kg && (
        <div className="bg-amber-950/40 border border-amber-900/50 rounded-xl p-4 text-amber-300 text-sm">
          Completa il profilo (peso, altezza, obiettivo, attrezzatura) per generare schede su misura.
        </div>
      )}

      {isHst && (week === 7 || hstDeconditioningActive) && (
        <div className="bg-amber-950/50 border border-amber-700/50 rounded-xl p-4 text-amber-200 text-sm leading-relaxed">
          Settimana di Decondizionamento Strategico: Riposo TOTALE per 7 giorni per azzerare la tolleranza muscolare e preparare il corpo al nuovo ciclo.
          {hstDeconditioningComplete && <span className="block text-emerald-300 mt-2">I 7 giorni sono trascorsi. Puoi ripartire dalla settimana 1 con 15 ripetizioni.</span>}
          {!hstDeconditioningStartedAt && <span className="block text-amber-300/80 mt-2">Premi il pulsante per iniziare il periodo di riposo.</span>}
        </div>
      )}

      <div className="b44-card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Settimana</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setWeek(Math.max(1, week - 1))} className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">−</button>
              <span className="w-10 text-center font-semibold text-white">{week}</span>
              <button onClick={() => setWeek(Math.min(isHst ? 7 : 12, week + 1))} className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">+</button>
            </div>
          </div>
          <button
            onClick={generate}
            disabled={generating || !profile || hstDeconditioningActive}
            className="flex-1 min-w-[180px] py-2.5 b44-btn-red flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? 'Generazione…' : isHst && week === 7 && !hstDeconditioningStartedAt ? 'Avvia decondizionamento' : isHst && week === 7 && hstDeconditioningComplete ? 'Riparti dal ciclo HST' : 'Genera scheda settimana ' + week}
          </button>
        </div>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12 text-neutral-400 b44-card">
          <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Nessuna scheda. Genera la tua prima scheda personalizzata.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => {
            const isOpen = expanded === w.id;
            const exs = w.exercises ?? [];
            return (
              <div key={w.id} className="b44-card overflow-hidden">
                <button
                  onClick={() => toggle(w.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-neutral-300" /> : <ChevronRight className="w-4 h-4 text-neutral-300" />}
                    <div>
                      <p className="font-semibold">{w.nome}</p>
                      <p className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3 h-3" /> Sett. {w.settimana} · {w.durata_min ?? '-'} min · {exs.length} esercizi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); exportPDF(w); }}
                      className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                      title="Esporta PDF"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteWorkout(w.id); }}
                      className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-red-400 transition-colors"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/10 divide-y divide-white/5">
                    {exs.sort((a, b) => a.ordine - b.ordine).map((e) => (
                      <div key={e.id} className="p-4 flex gap-4">
                        <div className="flex gap-2 shrink-0">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-20 h-20 rounded-lg bg-neutral-800/80 border border-white/10 overflow-hidden flex items-center justify-center">
                              {getExerciseIllustration(e.nome) ? (
                                <img
                                  src={getExerciseIllustration(e.nome)}
                                  alt={`Posizione iniziale: ${e.nome}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-1 text-center px-1">
                                  <Dumbbell className="w-5 h-5 text-red-400/80" />
                                  <span className="text-[9px] leading-tight text-neutral-400">N/D</span>
                                </div>
                              )}
                            </div>
                            <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wide">Inizio</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-20 h-20 rounded-lg bg-neutral-800/80 border border-white/10 overflow-hidden flex items-center justify-center">
                              {getExerciseIllustrationEnd(e.nome) ? (
                                <img
                                  src={getExerciseIllustrationEnd(e.nome)}
                                  alt={`Posizione finale: ${e.nome}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-1 text-center px-1">
                                  <Dumbbell className="w-5 h-5 text-red-400/80" />
                                  <span className="text-[9px] leading-tight text-neutral-400">N/D</span>
                                </div>
                              )}
                            </div>
                            <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wide">Fine</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium">{e.nome}</p>
                            <a
                              href={e.youtube_url ?? '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 shrink-0"
                            >
                              <Youtube className="w-4 h-4" /> Video
                            </a>
                          </div>
                          <p className="text-xs text-emerald-400/80 mb-2">{e.muscolo}</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <Badge label="Serie" value={String(e.serie)} />
                            <Badge label="Rip" value={e.ripetizioni ?? '-'} />
                            <Badge label="Recupero" value={`${e.recupero_sec ?? '-'}s`} />
                            <Badge label="RIR" value={String(e.rir ?? '-')} />
                            {e.peso_target_kg && <Badge label="Target" value={`${e.peso_target_kg} kg`} />}
                          </div>
                          {e.note && <p className="text-xs text-amber-400/80 mt-2">{e.note}</p>}
                          <button
                            onClick={() => logExercise(w, e)}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 b44-btn-green"
                          >
                            <Plus className="w-3 h-3" /> Registra risultato
                          </button>
                        </div>
                      </div>
                    ))}

                    {logs[w.id] && logs[w.id].length > 0 && (
                      <div className="p-4 bg-black/70">
                        <p className="text-xs font-semibold text-emerald-400/80 mb-2 uppercase tracking-wide">Risultati registrati</p>
                        <div className="space-y-1.5">
                          {logs[w.id].map((l) => (
                            <div key={l.id} className="flex justify-between text-xs bg-black/70 border border-white/10 rounded-lg px-3 py-2">
                              <span className="text-neutral-200">{l.exercise_name}</span>
                              <span className="text-neutral-400">
                                {l.data} · {l.serie_completate}x{l.ripetizioni_fatte} {l.peso_usato ? `@ ${l.peso_usato}kg` : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <span className="b44-badge">
      <span className="text-neutral-400">{label}: </span>
      <span className="text-white font-medium">{value}</span>
    </span>
  );
}
