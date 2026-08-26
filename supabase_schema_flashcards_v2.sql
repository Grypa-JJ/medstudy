-- supabase_schema_flashcards_v2.sql
-- Migracja tabeli `flashcards` z algorytmu SM-2-like (interval/ease/reps) na
-- własny, prostszy system pudełek Leitnera (box). NIE usuwa starych kolumn
-- (interval/ease/reps zostają w tabeli nietknięte, tylko nieużywane przez kod
-- appki od teraz) - zero ryzyka utraty danych.
-- Wklej i uruchom w Supabase Dashboard -> SQL Editor -> Run (po wcześniejszym
-- uruchomieniu supabase_schema_flashcards.sql).

alter table public.flashcards add column if not exists box int not null default 0;

-- Rozsądne przybliżenie migracji istniejącego postępu: `reps` (liczba udanych
-- powtórek w SM-2) najbliżej odpowiada głębokości "boxa" w Leitnerze. Karty z
-- reps=0 (nowe/właśnie niepowodzenie) zostają w box=0 (wartość domyślna).
update public.flashcards set box = least(reps, 9) where box = 0 and reps > 0;
