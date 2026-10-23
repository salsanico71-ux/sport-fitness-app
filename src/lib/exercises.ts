export interface ExerciseTemplate {
  nome: string;
  muscolo: string;
  youtubeUrl: string;
  imageUrl: string;
  baseSerie: number;
  baseRip: string;
  baseRecupero: number; // secondi
  baseRir: number;
  attrezzatura: string[]; // required equipment
}

const ILLUSTRATION_BY_EXERCISE: Record<string, string> = {
  'Panca piana con bilanciere': '/assets/exercises/panca-bilanciere.jpg',
  'Panca inclinata manubri': '/assets/exercises/panca-inclinata-manubri.jpg',
  'Push-up': '/assets/exercises/push-up.jpg',
  'Stacco con bilanciere': '/assets/exercises/stacco-bilanciere.jpg',
  'Trazioni alla sbarra': '/assets/exercises/trazioni.jpg',
  'Rematore con manubrio': '/assets/exercises/rematore-manubrio.jpg',
  'Squat con bilanciere': '/assets/exercises/squat-bilanciere.jpg',
  'Affondi con manubri': '/assets/exercises/affondi-manubri.jpg',
  'Military press': '/assets/exercises/military-press.jpg',
  'Alzate laterali manubri': '/assets/exercises/alzate-laterali.jpg',
  'Curl con bilanciere': '/assets/exercises/curl-bilanciere.jpg',
  'French press': '/assets/exercises/french-press.jpg',
  'Dip su panca': '/assets/exercises/dip-panca.jpg',
  'Plank': '/assets/exercises/plank.jpg',
  'Crunch': '/assets/exercises/crunch.jpg',
  'Leg curl': '/assets/exercises/leg-curl.jpg',
  'Hip thrust': '/assets/exercises/hip-thrust.jpg',
  'Lat machine': '/assets/exercises/lat-machine.jpg',
  'Curl panca inclinata': '/assets/exercises/curl-panca-inclinata.jpg',
  'Kickback tricipiti': '/assets/exercises/kickback.jpg',
  'Russian twist': '/assets/exercises/russian-twist.jpg',
  'Mountain climber': '/assets/exercises/mountain-climber.jpg',
  'Kettlebell swing': '/assets/exercises/kettlebell-swing.jpg',
  'Panca piana manubri': '/assets/exercises/panca-manubri.jpg',
};

const ILLUSTRATION_END_BY_EXERCISE: Record<string, string> = {
  'Panca piana con bilanciere': '/assets/exercises/end/panca-bilanciere-end.jpg',
  'Panca inclinata manubri': '/assets/exercises/end/panca-inclinata-manubri-end.jpg',
  'Push-up': '/assets/exercises/end/push-up-end.jpg',
  'Stacco con bilanciere': '/assets/exercises/end/stacco-bilanciere-end.jpg',
  'Trazioni alla sbarra': '/assets/exercises/end/trazioni-end.jpg',
  'Rematore con manubrio': '/assets/exercises/end/rematore-manubrio-end.jpg',
  'Squat con bilanciere': '/assets/exercises/end/squat-bilanciere-end.jpg',
  'Affondi con manubri': '/assets/exercises/end/affondi-manubri-end.jpg',
  'Squat libero (bodyweight)': '/assets/exercises/end/squat-libero-end.jpg',
  'Military press': '/assets/exercises/end/military-press-end.jpg',
  'Alzate laterali manubri': '/assets/exercises/end/alzate-laterali-end.jpg',
  'Curl con bilanciere': '/assets/exercises/end/curl-bilanciere-end.jpg',
  'French press': '/assets/exercises/end/french-press-end.jpg',
  'Dip su panca': '/assets/exercises/end/dip-panca-end.jpg',
  'Plank': '/assets/exercises/end/plank-end.jpg',
  'Crunch': '/assets/exercises/end/crunch-end.jpg',
  'Leg curl': '/assets/exercises/end/leg-curl-end.jpg',
  'Hip thrust': '/assets/exercises/end/hip-thrust-end.jpg',
  'Lat machine': '/assets/exercises/end/lat-machine-end.jpg',
  'Pulldown elastici': '/assets/exercises/end/pulldown-elastici-end.jpg',
  'Curl panca inclinata': '/assets/exercises/end/curl-panca-inclinata-end.jpg',
  'Kickback tricipiti': '/assets/exercises/end/kickback-end.jpg',
  'Russian twist': '/assets/exercises/end/russian-twist-end.jpg',
  'Mountain climber': '/assets/exercises/end/mountain-climber-end.jpg',
  'Kettlebell swing': '/assets/exercises/end/kettlebell-swing-end.jpg',
  'Panca piana manubri': '/assets/exercises/end/panca-manubri-end.jpg',
};

export function getExerciseIllustration(nome: string): string {
  return ILLUSTRATION_BY_EXERCISE[nome] ?? '';
}

export function getExerciseIllustrationEnd(nome: string): string {
  return ILLUSTRATION_END_BY_EXERCISE[nome] ?? '';
}

export const EXERCISES: ExerciseTemplate[] = [
  // Petto
  { nome: 'Panca piana con bilanciere', muscolo: 'Petto', youtubeUrl: 'https://www.youtube.com/results?search_query=panca+piana+bilanciere+tecnica', imageUrl: 'https://images.pexels.com/photos/3837743/pexels-photo-3837743.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 4, baseRip: '6-8', baseRecupero: 120, baseRir: 2, attrezzatura: ['bilanciere'] },
  { nome: 'Panca inclinata manubri', muscolo: 'Petto', youtubeUrl: 'https://www.youtube.com/watch?v=FnAYj-tj-NE', imageUrl: 'https://images.pexels.com/photos/3837781/pexels-photo-3837781.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '8-10', baseRecupero: 90, baseRir: 2, attrezzatura: ['manubri'] },
  { nome: 'Push-up', muscolo: 'Petto', youtubeUrl: 'https://www.youtube.com/watch?v=LvQwAFb_jOs', imageUrl: 'https://images.pexels.com/photos/4920478/pexels-photo-4920478.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '10-15', baseRecupero: 60, baseRir: 2, attrezzatura: ['corpo libero'] },
  // Schiena
  { nome: 'Stacco con bilanciere', muscolo: 'Schiena', youtubeUrl: 'https://www.youtube.com/watch?v=xPs2VFWDWTI', imageUrl: 'https://images.pexels.com/photos/4853280/pexels-photo-4853280.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 4, baseRip: '5-6', baseRecupero: 150, baseRir: 2, attrezzatura: ['bilanciere'] },
  { nome: 'Trazioni alla sbarra', muscolo: 'Schiena', youtubeUrl: 'https://www.youtube.com/watch?v=oN7zZJd4KnI', imageUrl: 'https://images.pexels.com/photos/9644816/pexels-photo-9644816.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 4, baseRip: '6-10', baseRecupero: 120, baseRir: 2, attrezzatura: ['sbarra'] },
  { nome: 'Rematore con manubrio', muscolo: 'Schiena', youtubeUrl: 'https://www.youtube.com/watch?v=-ebafKeAmXs', imageUrl: 'https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '8-12', baseRecupero: 90, baseRir: 2, attrezzatura: ['manubri'] },
  // Gambe
  { nome: 'Squat con bilanciere', muscolo: 'Gambe', youtubeUrl: 'https://www.youtube.com/watch?v=n_ShzNtvino', imageUrl: 'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 4, baseRip: '6-8', baseRecupero: 150, baseRir: 2, attrezzatura: ['bilanciere'] },
  { nome: 'Affondi con manubri', muscolo: 'Gambe', youtubeUrl: 'https://www.youtube.com/watch?v=Jezpb-6fuQ0', imageUrl: 'https://images.pexels.com/photos/6339695/pexels-photo-6339695.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '10-12', baseRecupero: 90, baseRir: 2, attrezzatura: ['manubri'] },
  { nome: 'Squat libero (bodyweight)', muscolo: 'Gambe', youtubeUrl: 'https://www.youtube.com/results?search_query=bodyweight+squat+tecnica', imageUrl: 'https://images.pexels.com/photos/4807549/pexels-photo-4807549.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '15-20', baseRecupero: 60, baseRir: 2, attrezzatura: ['corpo libero'] },
  // Spalle
  { nome: 'Military press', muscolo: 'Spalle', youtubeUrl: 'https://www.youtube.com/watch?v=mywEUpC1oyM', imageUrl: 'https://images.pexels.com/photos/7289370/pexels-photo-7289370.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 4, baseRip: '6-8', baseRecupero: 120, baseRir: 2, attrezzatura: ['bilanciere'] },
  { nome: 'Alzate laterali manubri', muscolo: 'Spalle', youtubeUrl: 'https://www.youtube.com/watch?v=qNfpbkdw6S0', imageUrl: 'https://images.pexels.com/photos/6339688/pexels-photo-6339688.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '10-12', baseRecupero: 60, baseRir: 2, attrezzatura: ['manubri'] },
  // Braccia
  { nome: 'Curl con bilanciere', muscolo: 'Bicipiti', youtubeUrl: 'https://www.youtube.com/results?search_query=curl+bicipiti+bilanciere+tecnica', imageUrl: 'https://images.pexels.com/photos/5327466/pexels-photo-5327466.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '8-10', baseRecupero: 60, baseRir: 2, attrezzatura: ['bilanciere'] },
  { nome: 'French press', muscolo: 'Tricipiti', youtubeUrl: 'https://www.youtube.com/watch?v=QKT-JOlhWGg', imageUrl: 'https://images.pexels.com/photos/6388359/pexels-photo-6388359.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '10-12', baseRecupero: 60, baseRir: 2, attrezzatura: ['manubri', 'bilanciere'] },
  { nome: 'Dip su panca', muscolo: 'Tricipiti', youtubeUrl: 'https://www.youtube.com/results?search_query=bench+dip+tricipiti+tecnica', imageUrl: 'https://images.pexels.com/photos/4803875/pexels-photo-4803875.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '10-15', baseRecupero: 60, baseRir: 2, attrezzatura: ['corpo libero'] },
  // Addome
  { nome: 'Plank', muscolo: 'Addome', youtubeUrl: 'https://www.youtube.com/results?search_query=plank+tecnica+corretta', imageUrl: 'https://images.pexels.com/photos/4047105/pexels-photo-4047105.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '30-60s', baseRecupero: 45, baseRir: 2, attrezzatura: ['corpo libero'] },
  { nome: 'Crunch', muscolo: 'Addome', youtubeUrl: 'https://www.youtube.com/results?search_query=crunch+addome+tecnica', imageUrl: 'https://images.pexels.com/photos/7721988/pexels-photo-7721988.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '15-20', baseRecupero: 45, baseRir: 2, attrezzatura: ['corpo libero'] },
  // Extra
  { nome: 'Leg curl', muscolo: 'Gambe', youtubeUrl: 'https://www.youtube.com/results?search_query=leg+curl+femorali+tecnica', imageUrl: 'https://images.pexels.com/photos/31028213/pexels-photo-31028213.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '10-12', baseRecupero: 90, baseRir: 2, attrezzatura: ['macchine'] },
  { nome: 'Hip thrust', muscolo: 'Gambe', youtubeUrl: 'https://www.youtube.com/results?search_query=hip+thrust+tecnica+glutei', imageUrl: 'https://images.pexels.com/photos/4853331/pexels-photo-4853331.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 4, baseRip: '8-10', baseRecupero: 120, baseRir: 2, attrezzatura: ['bilanciere'] },
  { nome: 'Lat machine', muscolo: 'Schiena', youtubeUrl: 'https://www.youtube.com/results?search_query=lat+machine+tecnica', imageUrl: 'https://images.pexels.com/photos/17210044/pexels-photo-17210044.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 4, baseRip: '8-10', baseRecupero: 90, baseRir: 2, attrezzatura: ['macchine'] },
  { nome: 'Pulldown elastici', muscolo: 'Schiena', youtubeUrl: 'https://www.youtube.com/results?search_query=pulldown+elastici+schiena', imageUrl: 'https://images.pexels.com/photos/36400032/pexels-photo-36400032.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '10-12', baseRecupero: 60, baseRir: 2, attrezzatura: ['elastici'] },
  { nome: 'Curl panca inclinata', muscolo: 'Bicipiti', youtubeUrl: 'https://www.youtube.com/results?search_query=curl+manubri+panca+inclinata+bicipiti', imageUrl: 'https://images.pexels.com/photos/3926644/pexels-photo-3926644.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '10-12', baseRecupero: 60, baseRir: 2, attrezzatura: ['manubri'] },
  { nome: 'Kickback tricipiti', muscolo: 'Tricipiti', youtubeUrl: 'https://www.youtube.com/results?search_query=kickback+tricipiti+manubrio', imageUrl: 'https://images.pexels.com/photos/12314077/pexels-photo-12314077.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '12-15', baseRecupero: 60, baseRir: 2, attrezzatura: ['manubri'] },
  { nome: 'Russian twist', muscolo: 'Addome', youtubeUrl: 'https://www.youtube.com/results?search_query=russian+twist+addome', imageUrl: 'https://images.pexels.com/photos/6516225/pexels-photo-6516225.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '15-20', baseRecupero: 45, baseRir: 2, attrezzatura: ['corpo libero'] },
  { nome: 'Mountain climber', muscolo: 'Addome', youtubeUrl: 'https://www.youtube.com/results?search_query=mountain+climber+tecnica', imageUrl: 'https://images.pexels.com/photos/5149167/pexels-photo-5149167.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 3, baseRip: '30-40s', baseRecupero: 45, baseRir: 2, attrezzatura: ['corpo libero'] },
  { nome: 'Kettlebell swing', muscolo: 'Gambe', youtubeUrl: 'https://www.youtube.com/results?search_query=kettlebell+swing+tecnica', imageUrl: 'https://images.pexels.com/photos/622297/pexels-photo-622297.jpeg?auto=compress&cs=tinysrgb&w=400', baseSerie: 4, baseRip: '12-15', baseRecupero: 60, baseRir: 2, attrezzatura: ['kettlebell'] },
  { nome: 'Panca piana manubri', muscolo: 'Petto', youtubeUrl: 'https://www.youtube.com/results?search_query=panca+piana+manubri+tecnica', imageUrl: 'https://images.pexels.com/photos/12752465/pexels-photo-12752465.png?auto=compress&cs=tinysrgb&w=400', baseSerie: 4, baseRip: '8-10', baseRecupero: 90, baseRir: 2, attrezzatura: ['manubri'] },
];

export interface GeneratedWorkout {
  nome: string;
  descrizione: string;
  durata_min: number;
  giorno_settimana: string;
  exercises: Array<{
    nome: string;
    muscolo: string;
    serie: number;
    ripetizioni: string;
    recupero_sec: number;
    rir: number;
    peso_target_kg: number | null;
    youtube_url: string;
    immagine_url: string;
    note: string;
    ordine: number;
  }>;
}

interface GenParams {
  obiettivo: string;
  esperienza: string;
  durata_min: number;
  giorni: number[];
  attrezzatura: string[];
  limitazioni: string;
  settimana: number;
  metodoAllenamento?: 'standard' | 'hst';
  carichiPrecedenti?: Record<string, number>;
}

const GIORNI_NOMI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
const HST_MUSCOLI = ['Petto', 'Schiena', 'Gambe', 'Spalle', 'Bicipiti', 'Tricipiti', 'Addome'];

function getSplit(giorni: number): string[][] {
  if (giorni <= 2) return [['Petto', 'Tricipiti'], ['Schiena', 'Bicipiti']];
  if (giorni === 3) return [['Petto', 'Tricipiti'], ['Schiena', 'Bicipiti'], ['Gambe', 'Addome']];
  if (giorni === 4) return [['Petto', 'Tricipiti'], ['Schiena', 'Bicipiti'], ['Gambe'], ['Spalle', 'Addome']];
  return [['Petto'], ['Schiena'], ['Gambe'], ['Spalle'], ['Braccia', 'Addome']];
}

function getHstPhase(week: number): { repetitions: string; series: number; recovery: number; label: string } {
  const phase = ((Math.max(1, week) - 1) % 6) + 1;
  if (phase <= 2) return { repetitions: '15', series: 2, recovery: 75, label: '15 ripetizioni' };
  if (phase <= 4) return { repetitions: '10', series: 2, recovery: 90, label: '10 ripetizioni' };
  return { repetitions: '5', series: 2, recovery: 150, label: '5 ripetizioni' };
}

function roundLoad(value: number): number {
  return Math.max(0.5, Math.round(value * 2) / 2);
}

export function generateWorkouts(params: GenParams): GeneratedWorkout[] {
  const isHst = params.metodoAllenamento === 'hst';
  const split = isHst ? params.giorni.map(() => HST_MUSCOLI) : getSplit(params.giorni.length);
  const workouts: GeneratedWorkout[] = [];
  const expMult = params.esperienza === 'principiante' ? 0.85 : params.esperienza === 'avanzato' ? 1.15 : 1;
  const setBonus = Math.floor((params.settimana - 1) / 2);
  const hstPhase = getHstPhase(params.settimana);
  const loadProgression = params.esperienza === 'principiante' ? 0.025 : params.esperienza === 'avanzato' ? 0.075 : 0.05;

  split.forEach((gruppi, idx) => {
    const giornoIdx = params.giorni[idx] ?? idx;
    const candidates = EXERCISES.filter(
      (e) => gruppi.includes(e.muscolo) && e.attrezzatura.every((a) => params.attrezzatura.includes(a))
    );
    if (candidates.length === 0) {
      candidates.push(...EXERCISES.filter((e) => gruppi.includes(e.muscolo) && e.attrezzatura.includes('corpo libero')));
    }

    const selected = isHst
      ? HST_MUSCOLI.map((muscolo) => candidates.find((e) => e.muscolo === muscolo)).filter(Boolean)
      : candidates.slice(0, 5);
    const exercises = selected.map((e, i) => {
      const exercise = e!;
      const serie = isHst ? hstPhase.series : Math.max(2, Math.round(exercise.baseSerie * expMult) + setBonus);
      const recupero = isHst ? hstPhase.recovery : exercise.baseRecupero;
      const rir = isHst ? (params.esperienza === 'principiante' ? 2 : 1) : Math.max(0, exercise.baseRir - Math.floor((params.settimana - 1) / 3));
      const previousLoad = params.carichiPrecedenti?.[exercise.nome];
      const pesoTarget = isHst && previousLoad ? roundLoad(previousLoad * (1 + loadProgression)) : null;
      const loadText = isHst
        ? pesoTarget ? `Carico target: ${pesoTarget} kg, aumentato in base all'ultimo risultato.` : 'Registra il primo risultato per calcolare il prossimo carico target.'
        : '';
      const limitationText = params.limitazioni ? `Adatta il movimento alle tue limitazioni: ${params.limitazioni}.` : '';
      return {
        nome: exercise.nome,
        muscolo: exercise.muscolo,
        serie,
        ripetizioni: isHst ? hstPhase.repetitions : exercise.baseRip,
        recupero_sec: recupero,
        rir,
        peso_target_kg: pesoTarget,
        youtube_url: exercise.youtubeUrl,
        immagine_url: getExerciseIllustration(exercise.nome),
        note: [isHst ? `HST fase ${hstPhase.label}. ${loadText}` : '', limitationText].filter(Boolean).join(' '),
        ordine: i,
      };
    });

    const durataStimata = exercises.reduce((acc, e) => acc + e.serie * (e.recupero_sec + 45), 0) / 60;
    workouts.push({
      nome: isHst ? `HST ${GIORNI_NOMI[giornoIdx] ?? 'Giorno ' + (idx + 1)}` : `Scheda ${GIORNI_NOMI[giornoIdx] ?? 'Giorno ' + (idx + 1)} - ${gruppi.join(' + ')}`,
      descrizione: isHst
        ? `HST full body · fase ${hstPhase.label} · recupero fino alla prossima seduta: almeno 1 giorno`
        : `Allenamento ${gruppi.join(' + ')} - Settimana ${params.settimana}`,
      durata_min: Math.min(params.durata_min, Math.round(durataStimata) || params.durata_min),
      giorno_settimana: GIORNI_NOMI[giornoIdx] ?? `Giorno ${idx + 1}`,
      exercises,
    });
  });

  return workouts;
}
