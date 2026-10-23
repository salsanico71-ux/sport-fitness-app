import { useAuth } from '@/lib/auth';
import { Dumbbell, LogOut, User, Apple, TrendingUp } from 'lucide-react';

export type Tab = 'workout' | 'nutrition' | 'progress' | 'profile';

interface Props {
  active: Tab;
  onTab: (t: Tab) => void;
  children: React.ReactNode;
}

export default function Layout({ active, onTab, children }: Props) {
  const { user, signOut } = useAuth();

  const navItems: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'workout', label: 'Allenamento', icon: Dumbbell },
    { id: 'nutrition', label: 'Alimentazione', icon: Apple },
    { id: 'progress', label: 'Progressi', icon: TrendingUp },
    { id: 'profile', label: 'Profilo', icon: User },
  ];

  return (
    <div className="min-h-screen text-white flex flex-col relative">
      <header className="sticky top-0 z-30 bg-neutral-900/95 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/50 ring-1 ring-white/10">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">PalestraFitness</h1>
              <p className="text-[11px] text-emerald-400/70 leading-none mt-0.5">Fitness complete</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-300 hidden sm:block truncate max-w-[160px]">{user?.email}</span>
            <button
              onClick={signOut}
              className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
              aria-label="Esci"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-28 sm:pb-8 relative z-10">{children}</main>

      <nav className="fixed bottom-0 inset-x-0 z-30 bg-neutral-900/95 border-t border-white/10 sm:hidden">
        <div className="grid grid-cols-4">
          {navItems.map((n) => {
            const Icon = n.icon;
            const isActive = active === n.id;
            return (
              <button
                key={n.id}
                onClick={() => onTab(n.id)}
                className={`flex flex-col items-center gap-1 py-2.5 transition-colors relative ${
                  isActive ? 'text-red-500' : 'text-neutral-400'
                }`}
              >
                {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-500 rounded-full" />}
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <nav className="hidden sm:block fixed bottom-0 inset-x-0 z-30 bg-neutral-900/95 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2">
          {navItems.map((n) => {
            const Icon = n.icon;
            const isActive = active === n.id;
            return (
              <button
                key={n.id}
                onClick={() => onTab(n.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/40 ring-1 ring-red-400/20'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {n.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
