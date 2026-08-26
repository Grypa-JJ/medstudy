-- supabase_schema.sql
-- Wklej całość w Supabase Dashboard -> SQL Editor -> Run.
-- Tworzy tabele profiles/progress/activity + RLS (każdy widzi/zapisuje tylko swoje wiersze)
-- + trigger, który przy rejestracji automatycznie zakłada pusty wiersz w profiles.

-- ============== PROFILES ==============
create table if not exists public.profiles (
    id           uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    year         int,
    created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
    for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
    for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
    for update using (auth.uid() = id);

-- Auto-tworzenie profilu przy rejestracji nowego usera w auth.users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id) values (new.id);
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ============== PROGRESS (odpowiedzi na pytania, klucz = id pytania) ==============
create table if not exists public.progress (
    user_id     uuid not null references auth.users(id) on delete cascade,
    question_id text not null,
    correct     boolean not null,
    chosen      int not null,
    ts          timestamptz not null default now(),
    primary key (user_id, question_id)
);

alter table public.progress enable row level security;

create policy "progress_select_own" on public.progress
    for select using (auth.uid() = user_id);

create policy "progress_insert_own" on public.progress
    for insert with check (auth.uid() = user_id);

create policy "progress_update_own" on public.progress
    for update using (auth.uid() = user_id);

create policy "progress_delete_own" on public.progress
    for delete using (auth.uid() = user_id);

-- ============== ACTIVITY (dzienna liczba przejrzanych kart, do heatmapy/streaka) ==============
create table if not exists public.activity (
    user_id uuid not null references auth.users(id) on delete cascade,
    date    date not null,
    count   int not null default 0,
    primary key (user_id, date)
);

alter table public.activity enable row level security;

create policy "activity_select_own" on public.activity
    for select using (auth.uid() = user_id);

create policy "activity_insert_own" on public.activity
    for insert with check (auth.uid() = user_id);

create policy "activity_update_own" on public.activity
    for update using (auth.uid() = user_id);
