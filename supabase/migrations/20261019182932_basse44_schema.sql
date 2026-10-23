/*
# Basse44 - Schema completo fitness app

## Tabelle
- profiles, workouts, workout_exercises, workout_logs, foods, weight_logs, daily_goals

## Sicurezza
- RLS attivo, politiche owner-scoped, DEFAULT auth.uid() su user_id
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  eta int,
  altezza_cm numeric,
  peso_kg numeric,
  esperienza text CHECK (esperienza IN ('principiante','intermedio','avanzato')),
  obiettivo text,
  giorni_settimana int[],
  durata_allenamento_min int CHECK (durata_allenamento_min IN (45,60,75,90)),
  attrezzatura text[],
  limitazioni text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  descrizione text,
  durata_min int,
  giorno_settimana text,
  settimana int DEFAULT 1,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_workouts" ON workouts;
CREATE POLICY "select_own_workouts" ON workouts FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_workouts" ON workouts;
CREATE POLICY "insert_own_workouts" ON workouts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_workouts" ON workouts;
CREATE POLICY "update_own_workouts" ON workouts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_workouts" ON workouts;
CREATE POLICY "delete_own_workouts" ON workouts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  muscolo text,
  serie int,
  ripetizioni text,
  recupero_sec int,
  rir int,
  immagine_url text,
  youtube_url text,
  note text,
  ordine int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_workout_exercises" ON workout_exercises;
CREATE POLICY "select_own_workout_exercises" ON workout_exercises FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_workout_exercises" ON workout_exercises;
CREATE POLICY "insert_own_workout_exercises" ON workout_exercises FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_workout_exercises" ON workout_exercises;
CREATE POLICY "update_own_workout_exercises" ON workout_exercises FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_workout_exercises" ON workout_exercises;
CREATE POLICY "delete_own_workout_exercises" ON workout_exercises FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id uuid REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES workout_exercises(id) ON DELETE CASCADE,
  exercise_name text,
  data date NOT NULL DEFAULT CURRENT_DATE,
  serie_completate int,
  ripetizioni_fatte text,
  peso_usato text,
  note text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_workout_logs" ON workout_logs;
CREATE POLICY "select_own_workout_logs" ON workout_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_workout_logs" ON workout_logs;
CREATE POLICY "insert_own_workout_logs" ON workout_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_workout_logs" ON workout_logs;
CREATE POLICY "update_own_workout_logs" ON workout_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_workout_logs" ON workout_logs;
CREATE POLICY "delete_own_workout_logs" ON workout_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  grammi numeric NOT NULL,
  kcal numeric,
  proteine numeric,
  carboidrati numeric,
  grassi numeric,
  pasto text CHECK (pasto IN ('colazione','pranzo','cena','spuntino')),
  data date NOT NULL DEFAULT CURRENT_DATE,
  note text,
  foto_url text,
  ai_stimato boolean DEFAULT false,
  ai_dati jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_foods" ON foods;
CREATE POLICY "select_own_foods" ON foods FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_foods" ON foods;
CREATE POLICY "insert_own_foods" ON foods FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_foods" ON foods;
CREATE POLICY "update_own_foods" ON foods FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_foods" ON foods;
CREATE POLICY "delete_own_foods" ON foods FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  peso_kg numeric NOT NULL,
  altezza_cm numeric,
  imc numeric,
  data date NOT NULL DEFAULT CURRENT_DATE,
  note text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_weight_logs" ON weight_logs;
CREATE POLICY "select_own_weight_logs" ON weight_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_weight_logs" ON weight_logs;
CREATE POLICY "insert_own_weight_logs" ON weight_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_weight_logs" ON weight_logs;
CREATE POLICY "update_own_weight_logs" ON weight_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_weight_logs" ON weight_logs;
CREATE POLICY "delete_own_weight_logs" ON weight_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  data date NOT NULL DEFAULT CURRENT_DATE,
  kcal_obiettivo int NOT NULL DEFAULT 2000,
  proteine_obiettivo numeric,
  carboidrati_obiettivo numeric,
  grassi_obiettivo numeric,
  note text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, data)
);
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_daily_goals" ON daily_goals;
CREATE POLICY "select_own_daily_goals" ON daily_goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_daily_goals" ON daily_goals;
CREATE POLICY "insert_own_daily_goals" ON daily_goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_daily_goals" ON daily_goals;
CREATE POLICY "update_own_daily_goals" ON daily_goals FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_daily_goals" ON daily_goals;
CREATE POLICY "delete_own_daily_goals" ON daily_goals FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_workouts_user ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_user ON workout_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_foods_user_date ON foods(user_id, data);
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON weight_logs(user_id, data);
CREATE INDEX IF NOT EXISTS idx_daily_goals_user_date ON daily_goals(user_id, data);

INSERT INTO storage.buckets (id, name, public) VALUES ('food-photos','food-photos', true) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "select_food_photos" ON storage.objects;
CREATE POLICY "select_food_photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'food-photos' AND owner = auth.uid());
DROP POLICY IF EXISTS "insert_food_photos" ON storage.objects;
CREATE POLICY "insert_food_photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'food-photos' AND owner = auth.uid());
DROP POLICY IF EXISTS "update_food_photos" ON storage.objects;
CREATE POLICY "update_food_photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'food-photos' AND owner = auth.uid()) WITH CHECK (bucket_id = 'food-photos' AND owner = auth.uid());
DROP POLICY IF EXISTS "delete_food_photos" ON storage.objects;
CREATE POLICY "delete_food_photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'food-photos' AND owner = auth.uid());
