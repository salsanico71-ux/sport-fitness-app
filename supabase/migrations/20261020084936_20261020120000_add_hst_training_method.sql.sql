/*
# Add optional HST training method

1. Modified Tables
- `profiles.metodo_allenamento`: stores the user's selected training method. Existing users keep the standard method through the default value.
- `workout_exercises.peso_target_kg`: stores the suggested working weight for newly generated workouts. Existing exercises remain unchanged and nullable.

2. HST behavior enabled by these fields
- The standard method remains available and unchanged.
- HST workouts use progressive 15, 10, and 5 repetition phases, with rest days determined by the user's selected training days.
- Target weights are personalized from experience and prior logged results when available.

3. Security
- No new tables are introduced.
- Existing owner-scoped RLS policies remain in place.
- The new profile field is protected by the existing profile policies.
- The new exercise field is protected by the existing workout exercise policies.

4. Data safety
- No rows are deleted.
- Existing rows receive only the non-destructive default for the new profile field; the new exercise field stays nullable.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS metodo_allenamento text NOT NULL DEFAULT 'standard';

ALTER TABLE workout_exercises
  ADD COLUMN IF NOT EXISTS peso_target_kg numeric;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_metodo_allenamento_check'
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT profiles_metodo_allenamento_check
      CHECK (metodo_allenamento IN ('standard', 'hst'));
  END IF;
END $$;