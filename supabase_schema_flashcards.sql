-- supabase_schema_flashcards.sql
-- Dodatek do supabase_schema.sql - stan fiszek (tryb nauki SM-2-like), kluczowany
-- id pytania (nie pozycją w tablicy questions - ta sama poprawka co w tabeli progress).
-- Wklej i uruchom w Supabase Dashboard -> SQL Editor -> Run (po wcześniejszym
-- uruchomieniu supabase_schema.sql).

create table if not exists public.flashcards (
    user_id     uuid not null references auth.users(id) on delete cascade,
    question_id text not null,
    interval    numeric not null default 0,   -- minuty do następnej powtórki
    ease        numeric not null default 2.5, -- współczynnik SM-2
    reps        int not null default 0,
    due         bigint not null default 0,    -- epoch ms (Date.now()), jak w JS
    lapses      int not null default 0,
    deleted     boolean not null default false, -- karta usunięta z talii na stałe
    updated_at  timestamptz not null default now(),
    primary key (user_id, question_id)
);

alter table public.flashcards enable row level security;

create policy "flashcards_select_own" on public.flashcards
    for select using (auth.uid() = user_id);

create policy "flashcards_insert_own" on public.flashcards
    for insert with check (auth.uid() = user_id);

create policy "flashcards_update_own" on public.flashcards
    for update using (auth.uid() = user_id);

create policy "flashcards_delete_own" on public.flashcards
    for delete using (auth.uid() = user_id);
