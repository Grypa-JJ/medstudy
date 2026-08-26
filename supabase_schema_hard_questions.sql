-- supabase_schema_hard_questions.sql
-- Dodatek do supabase_schema.sql - stan "Trybu: trudne pytania". Śledzi tylko
-- licznik kolejnych poprawnych odpowiedzi (streak) w tym trybie, kluczowany
-- id pytania (ten sam wzorzec co progress/flashcards). Sama przynależność do
-- puli "trudnych" NIE jest tu przechowywana - wynika z progress.correct=false
-- (tabela progress, już istniejąca).
-- Wklej i uruchom w Supabase Dashboard -> SQL Editor -> Run (po wcześniejszym
-- uruchomieniu supabase_schema.sql).

create table if not exists public.hard_streak (
    user_id     uuid not null references auth.users(id) on delete cascade,
    question_id text not null,
    streak      int not null default 0,
    updated_at  timestamptz not null default now(),
    primary key (user_id, question_id)
);

alter table public.hard_streak enable row level security;

create policy "hard_streak_select_own" on public.hard_streak
    for select using (auth.uid() = user_id);

create policy "hard_streak_insert_own" on public.hard_streak
    for insert with check (auth.uid() = user_id);

create policy "hard_streak_update_own" on public.hard_streak
    for update using (auth.uid() = user_id);

create policy "hard_streak_delete_own" on public.hard_streak
    for delete using (auth.uid() = user_id);
