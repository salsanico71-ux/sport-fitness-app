export type MetodoAllenamento = 'standard' | 'hst';

export interface Profile {
  id: string;
  user_id: string;
  eta: number | null;
  altezza_cm: number | null;
  peso_kg: number | null;
  sesso: 'maschio' | 'femmina' | null;
  livello_attivita: 'sedentario' | 'leggero' | 'moderato' | 'attivo' | 'intenso' | null;
  esperienza: 'principiante' | 'intermedio' | 'avanzato' | null;
  metodo_allenamento: MetodoAllenamento;
  hst_deconditioning_started_at: string | null;
  obiettivo: string | null;
  giorni_settimana: number[] | null;
  durata_allenamento_min: 45 | 60 | 75 | 90 | null;
  attrezzatura: string[] | null;
  limitazioni: string | null;
  allergie_intolleranze: string | null;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  nome: string;
  descrizione: string | null;
  durata_min: number | null;
  giorno_settimana: string | null;
  settimana: number;
  created_at: string;
  exercises?: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  user_id: string;
  nome: string;
  muscolo: string | null;
  serie: number | null;
  ripetizioni: string | null;
  recupero_sec: number | null;
  rir: number | null;
  peso_target_kg: number | null;
  immagine_url: string | null;
  youtube_url: string | null;
  note: string | null;
  ordine: number;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_id: string | null;
  exercise_id: string | null;
  exercise_name: string | null;
  data: string;
  serie_completate: number | null;
  ripetizioni_fatte: string | null;
  peso_usato: string | null;
  note: string | null;
  created_at: string;
}

export interface Food {
  id: string;
  user_id: string;
  nome: string;
  grammi: number;
  kcal: number | null;
  proteine: number | null;
  carboidrati: number | null;
  grassi: number | null;
  pasto: 'colazione' | 'pranzo' | 'cena' | 'spuntino' | null;
  data: string;
  note: string | null;
  foto_url: string | null;
  ai_stimato: boolean;
  ai_dati: any;
  created_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  peso_kg: number;
  altezza_cm: number | null;
  imc: number | null;
  data: string;
  note: string | null;
  created_at: string;
}

export interface DailyGoal {
  id: string;
  user_id: string;
  data: string;
  kcal_obiettivo: number;
  proteine_obiettivo: number | null;
  carboidrati_obiettivo: number | null;
  grassi_obiettivo: number | null;
  note: string | null;
}

export function calcBMI(pesoKg: number, altezzaCm: number): number {
  if (!pesoKg || !altezzaCm) return 0;
  const m = altezzaCm / 100;
  return Number((pesoKg / (m * m)).toFixed(1));
}

export function bmiCategory(imc: number): { label: string; color: string } {
  if (imc < 18.5) return { label: 'Sottopeso', color: 'text-yellow-400' };
  if (imc < 25) return { label: 'Normale', color: 'text-emerald-400' };
  if (imc < 30) return { label: 'Sovrappeso', color: 'text-orange-400' };
  return { label: 'Obesità', color: 'text-red-400' };
}

// Moltiplicatori attività (TDEE) - lineari
export const ATTIVITA_MULT: Record<string, number> = {
  sedentario: 1.2,
  leggero: 1.375,
  moderato: 1.55,
  attivo: 1.725,
  intenso: 1.9,
};

// Metabolismo basale - Mifflin-St Jeor (validato)
export function calcBMR(p: {
  peso_kg: number;
  altezza_cm: number;
  eta: number;
  sesso: 'maschio' | 'femmina' | null;
}): number {
  const base = 10 * p.peso_kg + 6.25 * p.altezza_cm - 5 * p.eta;
  return Math.round(p.sesso === 'femmina' ? base - 161 : base + 5);
}

// TDEE = BMR * moltiplicatore attività
export function calcTDEE(bmr: number, livello: string): number {
  return Math.round(bmr * (ATTIVITA_MULT[livello] ?? 1.2));
}

// Obiettivo calorico in base a goal
export function goalKcalFromObjective(tdee: number, obiettivo: string): number {
  const o = obiettivo.toLowerCase();
  if (o.includes('dimag')) return Math.round(tdee - 500); // -0.5kg/sett
  if (o.includes('massa') || o.includes('forza')) return Math.round(tdee + 300);
  if (o.includes('resistenza')) return Math.round(tdee + 150);
  return tdee; // mantenimento/ricomposizione
}

// Macro suggeriti in base a obiettivo
export function suggestMacros(kcal: number, pesoKg: number, obiettivo: string): { p: number; c: number; g: number } {
  const o = obiettivo.toLowerCase();
  const proteinePerKg = o.includes('massa') || o.includes('forza') ? 2.0 : o.includes('dimag') ? 2.2 : 1.6;
  const p = Math.round(pesoKg * proteinePerKg);
  const pKcal = p * 4;
  const gKcal = Math.round(kcal * 0.25);
  const g = Math.round(gKcal / 9);
  const cKcal = Math.max(0, kcal - pKcal - gKcal);
  const c = Math.round(cKcal / 4);
  return { p, c, g };
}
