const GEMINI_KEY_STORAGE = 'palestrafitness_gemini_api_key';
const GEMINI_MODEL = 'gemini-2.0-flash';

export interface FoodVisionItem {
  nome: string;
  grammi: number;
  kcal: number;
  proteine: number;
  carboidrati: number;
  grassi: number;
  incerto?: boolean;
}

export interface FoodVisionResult {
  foods: FoodVisionItem[];
  note: string;
}

export class GeminiError extends Error {
  readonly kind: 'KEY_MISSING' | 'KEY_INVALID' | 'RATE_LIMIT' | 'NETWORK' | 'PARSE' | 'UNKNOWN';
  constructor(kind: GeminiError['kind'], message: string) {
    super(message);
    this.kind = kind;
    this.name = 'GeminiError';
  }
}

function getEnvironmentKey(): string {
  return (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim() ?? '';
}

export function getGeminiApiKey(): string {
  const env = getEnvironmentKey();
  if (env && env !== 'INCOLLA_QUI_LA_TUA_CHIAVE_API') return env;
  return localStorage.getItem(GEMINI_KEY_STORAGE)?.trim() ?? '';
}

export function saveGeminiApiKey(key: string): void {
  const normalized = key.trim();
  if (normalized) localStorage.setItem(GEMINI_KEY_STORAGE, normalized);
  else localStorage.removeItem(GEMINI_KEY_STORAGE);
}

export function hasEnvironmentGeminiKey(): boolean {
  const env = getEnvironmentKey();
  return Boolean(env) && env !== 'INCOLLA_QUI_LA_TUA_CHIAVE_API';
}

function friendlyKeyError(status: number, detail: string): GeminiError {
  if (status === 400 || status === 401 || status === 403) {
    return new GeminiError('KEY_INVALID', 'Crediti esauriti o chiave API non valida. Controlla la configurazione o i limiti del piano.');
  }
  if (status === 429) {
    return new GeminiError('RATE_LIMIT', 'Crediti esauriti o chiave API non valida. Controlla la configurazione o i limiti del piano.');
  }
  return new GeminiError('UNKNOWN', `Errore Gemini (${status}): ${detail}`);
}

async function generateText(prompt: string, inlineData?: { mimeType: string; data: string }): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new GeminiError('KEY_MISSING', 'Chiave Gemini non configurata. Inseriscila nel Profilo o imposta VITE_GEMINI_API_KEY.');

  const parts: Array<Record<string, unknown>> = [{ text: prompt }];
  if (inlineData) parts.push({ inline_data: inlineData });

  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json' } }),
      }
    );
  } catch {
    throw new GeminiError('NETWORK', 'Connessione al servizio Gemini non riuscita. Verifica la rete e riprova.');
  }

  const body = await response.json() as { error?: { message?: string }; candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  if (!response.ok) throw friendlyKeyError(response.status, body.error?.message ?? '');
  const text = body.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
  if (!text) throw new GeminiError('PARSE', 'Gemini non ha restituito una risposta interpretabile.');
  return text;
}

function parseJson<T>(text: string): T {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new GeminiError('PARSE', 'Risposta Gemini non interpretabile come JSON.');
  }
}

function fileToInlineData(file: File): Promise<{ mimeType: string; data: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const [, data = ''] = result.split(',', 2);
      resolve({ mimeType: file.type || 'image/jpeg', data });
    };
    reader.onerror = () => reject(new GeminiError('PARSE', 'Impossibile leggere la foto.'));
    reader.readAsDataURL(file);
  });
}

export async function analyzeFoodImage(file: File): Promise<FoodVisionResult> {
  const image = await fileToInlineData(file);
  const text = await generateText(
    'Sei un nutrizionista esperto. Analizza la foto del piatto, identifica gli ingredienti visibili e stima grammi, kcal, proteine, carboidrati e grassi. Rispondi solo con JSON nel formato {"foods":[{"nome":"","grammi":0,"kcal":0,"proteine":0,"carboidrati":0,"grassi":0,"incerto":false}],"note":""}. Usa numeri realistici e segnala con incerto=true le stime poco affidabili.',
    image
  );
  const parsed = parseJson<Partial<FoodVisionResult>>(text);
  if (!Array.isArray(parsed.foods)) throw new GeminiError('PARSE', 'La risposta Gemini non contiene alimenti validi.');
  return { foods: parsed.foods, note: parsed.note ?? '' };
}

export interface WorkoutPlanRequest {
  obiettivo: string;
  esperienza: string;
  giorni: number[];
  attrezzatura: string[];
  limitazioni: string;
  settimana: number;
  metodoAllenamento: string;
}

export async function generatePersonalizedWorkoutPlan(request: WorkoutPlanRequest): Promise<string> {
  return generateText(
    `Crea un piano di allenamento personalizzato in italiano per: ${JSON.stringify(request)}. Rispondi solo in JSON con {"consiglio":"","priorita":[""],"avvertenze":[""]}. Non modificare serie, ripetizioni o fase del metodo richiesto: il piano operativo viene applicato dall'app.`
  );
}

export interface MealPlan {
  pasti: Array<{ nome: string; grammi: number; kcal: number; proteine: number; carboidrati: number; grassi: number }>;
  note: string;
}

export async function generateMealPlan(prompt: string): Promise<MealPlan> {
  const text = await generateText(`Crea un piano alimentare personalizzato in italiano basato su questi dati: ${prompt}. Rispondi solo in JSON con {"pasti":[{"nome":"","grammi":0,"kcal":0,"proteine":0,"carboidrati":0,"grassi":0}],"note":""}.`);
  const plan = parseJson<Partial<MealPlan>>(text);
  if (!Array.isArray(plan.pasti)) throw new GeminiError('PARSE', 'Il piano Gemini non contiene pasti validi.');
  return { pasti: plan.pasti, note: plan.note ?? '' };
}

export function describeGeminiError(error: unknown, fallback: string): string {
  if (error instanceof GeminiError) {
    if (error.kind === 'KEY_MISSING') return 'Chiave Gemini non configurata. Inseriscila nella sezione Profilo.';
    if (error.kind === 'KEY_INVALID' || error.kind === 'RATE_LIMIT') return error.message;
    return error.message;
  }
  return fallback;
}
