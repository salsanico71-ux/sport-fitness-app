import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Mail, Lock, AlertCircle, Activity } from 'lucide-react';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fn = mode === 'login' ? signIn : signUp;
    const { error: authError } = await fn(email, password);
    if (authError) {
      setError(authError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full text-white relative overflow-hidden flex items-end justify-center md:justify-end p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-md bg-transparent border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-lg font-bold tracking-tight text-red-600">PalestraFitness</h1>
        </div>
        <h2 className="text-2xl font-bold mb-1 text-red-500">
          {mode === 'login' ? 'Bentornato' : 'Crea il tuo account'}
        </h2>
        <p className="text-red-500/80 text-sm mb-6">
          {mode === 'login' ? 'Accedi per continuare il tuo percorso.' : 'Inizia oggi il tuo percorso fitness.'}
        </p>

        <div className="flex gap-2 mb-6 p-1 bg-black/40 border border-white/10 rounded-xl">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-neutral-400 hover:text-white'}`}
          >
            Accedi
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-neutral-400 hover:text-white'}`}
          >
            Registrati
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1.5 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/70 focus:ring-1 focus:ring-red-500/30 transition-colors"
                placeholder="email@esempio.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1.5 font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/70 focus:ring-1 focus:ring-red-500/30 transition-colors"
                placeholder="min. 6 caratteri"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/40 ring-1 ring-red-400/10 disabled:opacity-60 disabled:cursor-not-allowed text-base"
          >
            {loading ? 'Attendi…' : mode === 'login' ? 'Accedi' : 'Crea account'}
          </button>
        </form>

        <p className="text-red-500/70 text-xs mt-5 text-center leading-relaxed">
          {mode === 'signup'
            ? 'Registrandoti accetti di usare l\'app per il tuo percorso fitness.'
            : 'Nuovo su PalestraFitness? Passa a Registrati per creare un account.'}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-red-500/70">
          <Activity className="w-3 h-3 text-emerald-500" />
          I tuoi dati sono salvati in modo sicuro e privato
        </div>
      </div>
    </div>
  );
}
