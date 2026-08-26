-- supabase_schema_cycle_progress.sql
-- Synchronizacja postępu "tygodniowego cyklu nauki" (teoria -> fiszki -> test ->
-- trudne -> wpisywanie -> egzamin, patrz index.html: STUDY_CYCLE_STAGES,
-- peekCycleStage/commitCycleDay) MIĘDZY URZĄDZENIAMI usera. Wcześniej ten
-- postęp był trzymany WYŁĄCZNIE w localStorage przeglądarki - laptop, tablet
-- i telefon tego samego konta miały niezależny, rozjeżdżający się stan.
-- User zgłosił to 2026-07-27 (patrz pamięć: trigger_cross_device_cycle_sync).
--
-- Wzorzec identyczny jak przy flashcards (supabase_schema_flashcards_v2.sql):
-- jeden wiersz na (user, przedmiot, jednostka planu), ładowany raz przy
-- starcie appki do pamięci, zapisywany fire-and-forget przy każdej zmianie.
-- `days` to ta sama tablica dat (YYYY-MM-DD) co wcześniej w localStorage -
-- indeks w tej tablicy (+1) wyznacza numer dnia cyklu.

create table if not exists public.cycle_progress (
    user_id uuid not null references auth.users(id) on delete cascade,
    subject_key text not null,
    ordinal integer not null,
    days jsonb not null default '[]'::jsonb,
    updated_at timestamptz not null default now(),
    primary key (user_id, subject_key, ordinal)
);

alter table public.cycle_progress enable row level security;

drop policy if exists "cycle_progress_select_own" on public.cycle_progress;
create policy "cycle_progress_select_own" on public.cycle_progress
    for select using (auth.uid() = user_id);

drop policy if exists "cycle_progress_insert_own" on public.cycle_progress;
create policy "cycle_progress_insert_own" on public.cycle_progress
    for insert with check (auth.uid() = user_id);

drop policy if exists "cycle_progress_update_own" on public.cycle_progress;
create policy "cycle_progress_update_own" on public.cycle_progress
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cycle_progress_delete_own" on public.cycle_progress;
create policy "cycle_progress_delete_own" on public.cycle_progress
    for delete using (auth.uid() = user_id);
