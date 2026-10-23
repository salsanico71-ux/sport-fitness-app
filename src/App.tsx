import { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import AuthScreen from '@/screens/Auth';
import Layout, { Tab } from '@/components/Layout';
import ProfileScreen from '@/screens/Profile';
import WorkoutScreen from '@/screens/Workout';
import NutritionScreen from '@/screens/Nutrition';
import ProgressScreen from '@/screens/Progress';
import { Dumbbell } from 'lucide-react';

function Shell() {
  const { session, loading } = useAuth();
  const [tab, setTab] = useState<Tab>('workout');

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center animate-pulse shadow-xl shadow-red-900/50">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  return (
    <Layout active={tab} onTab={setTab}>
      {tab === 'workout' && <WorkoutScreen />}
      {tab === 'nutrition' && <NutritionScreen />}
      {tab === 'progress' && <ProgressScreen />}
      {tab === 'profile' && <ProfileScreen />}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
