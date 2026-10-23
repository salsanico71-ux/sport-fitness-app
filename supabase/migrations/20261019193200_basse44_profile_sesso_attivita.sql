/*
# Aggiungi sesso e livello_attivita al profilo

## Modifiche
- `profiles.sesso`: text, 'maschio'/'femmina', nullable (per calcolo metabolismo basale Mifflin-St Jeor)
- `profiles.livello_attivita`: text, 'sedentario'/'leggero'/'moderato'/'attivo'/'intenso', nullable (moltiplicatore TDEE)
- `profiles.allergie_intolleranze`: text, per filtri alimentari

## Note
- Nessun dato esistente viene perso; coloni nullable, no DROP.
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sesso text CHECK (sesso IN ('maschio','femmina'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS livello_attivita text CHECK (livello_attivita IN ('sedentario','leggero','moderato','attivo','intenso'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS allergie_intolleranze text;
