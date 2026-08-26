-- supabase_schema_study_plan.sql
-- Wklej całość w Supabase Dashboard -> SQL Editor -> Run.
--
-- Fundament pod "tygodniowy cykl nauki" (patrz Plan rozbudowy apki.md) - kalendarz
-- semestralny, jednostki tygodniowe/blokowe per przedmiot, i materiały źródłowe
-- powiązane z tymi jednostkami. NIE rusza żadnej istniejącej tabeli (progress,
-- flashcards, hard_streak, badges, questions) - to czysty dodatek, w tej samej
-- konwencji RLS co reszta projektu (auth.role() = 'authenticated' dla treści
-- niebędącej prywatnymi danymi użytkownika, analogicznie do public.questions).
--
-- Świadomie pominięte na tym etapie (patrz Plan rozbudowy apki.md, sekcja
-- "Rozszerzenie modelu danych"): `unit_progress` - sprawdzić najpierw, czy da
-- się wywnioskować "ukończony tydzień" z istniejących progress/activity, zanim
-- doda się kolejną tabelę.

-- ============== SUBJECTS (rejestr przedmiotów z jednostką rozliczeniową) ==============
-- `key` odpowiada polu `subject` używanemu już w questions.json/meta.json (np.
-- "histologia", "mikrobiologia") - to jest ten sam identyfikator, nie nowy.
create table if not exists public.subjects (
    key         text primary key,
    label       text not null,
    year        int not null,
    -- 'week'  = naturalny rytm tygodniowy wykładów (np. Fizjologia)
    -- 'block' = rozliczenie kolokwiami/blokami tematycznymi, nie tygodniami
    --           kalendarzowymi (np. Mikrobiologia - 2 kolokwia)
    unit_type   text not null check (unit_type in ('week', 'block')),
    created_at  timestamptz not null default now()
);

alter table public.subjects enable row level security;

create policy "subjects_select_authenticated" on public.subjects
    for select using (auth.role() = 'authenticated');

-- Brak polityk insert/update/delete dla zwykłych userów - zarządzane wyłącznie
-- z poziomu Dashboardu, tak jak treść w public.questions.

-- ============== STUDY_UNITS (tygodnie albo bloki tematyczne per przedmiot) ==============
create table if not exists public.study_units (
    id           uuid primary key default gen_random_uuid(),
    subject_key  text not null references public.subjects(key) on delete cascade,
    -- Numer porządkowy w obrębie przedmiotu (tydzień 1, 2, 3... albo blok 1, 2...).
    ordinal      int not null,
    title        text not null,
    -- Zakres dat opcjonalny - dogrywany dopiero po publikacji oficjalnego planu
    -- zajęć/sylabusów (zwykle wrzesień/październik). Bez dat jednostka nadal
    -- istnieje i da się do niej przypisywać pytania/materiały.
    starts_on    date,
    ends_on      date,
    -- Dla jednostek typu 'block' rozliczanych kolokwium - data kolokwium, używana
    -- później do podkręcania priorytetu powtórek w ostatnim tygodniu przed nim.
    exam_on      date,
    created_at   timestamptz not null default now(),
    unique (subject_key, ordinal)
);

alter table public.study_units enable row level security;

create policy "study_units_select_authenticated" on public.study_units
    for select using (auth.role() = 'authenticated');

-- ============== MATERIALS (odniesienia do plików źródłowych per jednostka) ==============
create table if not exists public.materials (
    id            uuid primary key default gen_random_uuid(),
    study_unit_id uuid not null references public.study_units(id) on delete cascade,
    -- 'teoria' | 'praktyka' | 'ogolne' - typ materiału, do ewentualnego
    -- filtrowania/sortowania w UI.
    kind          text not null check (kind in ('teoria', 'praktyka', 'ogolne')),
    title         text not null,
    -- Odniesienie do pliku - na razie ścieżka/nazwa w lokalnym folderze
    -- użytkownika (patrz "Otwarte pytania" w Plan rozbudowy apki.md - jeszcze
    -- nierozstrzygnięte, czy docelowo linkować do dysku współdzielonego).
    reference     text,
    created_at    timestamptz not null default now()
);

alter table public.materials enable row level security;

create policy "materials_select_authenticated" on public.materials
    for select using (auth.role() = 'authenticated');
