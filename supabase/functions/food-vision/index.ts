const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EstimateItem {
  nome: string;
  grammi: number;
  kcal: number;
  proteine: number;
  carboidrati: number;
  grassi: number;
  incerto?: boolean;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image');
    if (!imageFile || !(imageFile instanceof File)) return jsonResponse({ error: 'Nessuna immagine fornita' }, 400);

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) return jsonResponse({ error: 'AI_NON_CONFIGURATA', message: 'Configura Gemini per usare l’analisi fotografica.' }, 503);

    const bytes = new Uint8Array(await imageFile.arrayBuffer());
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const base64 = btoa(binary);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { text: 'Sei un nutrizionista esperto. Analizza la foto del piatto e rispondi solo in JSON nel formato {"foods":[{"nome":"","grammi":0,"kcal":0,"proteine":0,"carboidrati":0,"grassi":0,"incerto":false}],"note":""}. Stima con prudenza e usa incerto=true quando necessario.' },
            { inline_data: { mime_type: imageFile.type || 'image/jpeg', data: base64 } },
          ],
        }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    const body = await response.json() as { error?: { message?: string }; candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    if (!response.ok) return jsonResponse({ error: body.error?.message || `Errore Gemini (${response.status})` }, 502);
    const text = body.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
    const parsed = JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()) as { foods?: EstimateItem[]; note?: string };
    return jsonResponse({ foods: parsed.foods ?? [], note: parsed.note ?? '' });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Errore inatteso del servizio Gemini' }, 500);
  }
});
