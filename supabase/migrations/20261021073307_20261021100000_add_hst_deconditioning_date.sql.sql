/*
# Persist HST strategic deconditioning

1. Modified Tables
- `profiles.hst_deconditioning_started_at`: stores when the HST week-7 total-rest period began, so the seven-day lock remains consistent across reloads and devices.

2. Behavior
- HST generation is blocked during the seven-day strategic deconditioning period.
- Once seven full days have elapsed, the application can restart the HST cycle from week 1 and 15 repetitions.

3. Security
- No new tables or policies are introduced.
- The new profile field is protected by the existing owner-scoped profile policies.

4. Data safety
- Existing rows are preserved.
- The new field is nullable and does not affect Standard training or existing workouts.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS hst_deconditioning_started_at timestamptz;