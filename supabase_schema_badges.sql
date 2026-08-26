-- supabase_schema_badges.sql
-- Dodatek do supabase_schema.sql / supabase_schema_flashcards.sql - odznaki/osiągnięcia.
-- Wklej i uruchom w Supabase Dashboard -> SQL Editor -> Run.

create table if not exists public.badges (
    user_id     uuid not null references auth.users(id) on delete cascade,
    badge_key   text not null,
    unlocked_at timestamptz not null default now(),
    primary key (user_id, badge_key)
);

alter table public.badges enable row level security;

create policy "badges_select_own" on public.badges
    for select using (auth.uid() = user_id);

create policy "badges_insert_own" on public.badges
    for insert with check (auth.uid() = user_id);
