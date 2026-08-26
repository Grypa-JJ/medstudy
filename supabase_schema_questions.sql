-- supabase_schema_questions.sql
-- Wklej całość w Supabase Dashboard -> SQL Editor -> Run.
-- Tworzy tabelę questions (treść pytań: q/o/a/rationale/img) chronioną RLS -
-- tylko zalogowani użytkownicy mogą ją odczytać. Zastępuje dotychczasowy model,
-- w którym cała treść pytań leżała w publicznym, statycznym pliku questions.json
-- na Netlify (dostępnym pod bezpośrednim URL bez logowania).
--
-- Metadane (subject/category/id/tier, bez treści) zostają nadal jawnym plikiem
-- meta.json na Netlify - to nie zdradza treści pytań, tylko strukturę/liczniki.
--
-- Import danych: po uruchomieniu tego pliku zaimportuj CSV-y wygenerowane przez
-- export_questions_csv.mjs przez Dashboard -> Table Editor -> questions -> Insert -> Import data from CSV.

-- UWAGA: `id` w tym projekcie NIE jest unikalne per (subject,category) - to samo
-- pytanie (ten sam hash subject+q+o) celowo powtarza się pod wieloma kategoriami
-- (np. giełda x2, T4/T5 w anatomii - 6287 z 20768 unikalnych id ma >1 wystąpienie
-- w questions.json, do 9 wystąpień jednego id). Metadane (subject/category/tier
-- DLA KAŻDEGO wystąpienia) zostają w jawnym meta.json - ta tabela trzyma TREŚĆ
-- TYLKO RAZ na unikalne id (deduplikowane), więc `id` tu jest prawdziwym kluczem
-- głównym. Aplikacja łączy dane sama: meta.json mówi "id X należy do kategorii Y",
-- ta tabela mówi "id X ma taką treść".
create table if not exists public.questions (
    id        text primary key,
    q         text not null,
    o         jsonb not null,
    a         int not null,
    -- UWAGA: `img` (zdjęcia do rozpoznawania struktur, do ~700KB/pytanie w
    -- anatomii) celowo NIE jest tu przechowywane - próba importu takich dużych
    -- pojedynczych komórek przez CSV-importer Supabase Table Editor zawieszała
    -- import. Zdjęcie samo w sobie nie jest kluczem odpowiedzi, więc zostaje
    -- jawne w meta.json (statyczny plik na Netlify) - chronione jest tylko to,
    -- co faktycznie stanowi treść/odpowiedź pytania.
    rationale text,
    -- Część pytań (np. "wpisywana odpowiedź" w angielskim) to nie klasyczne
    -- ABCDE: mode="typed" + answers = lista akceptowanych odpowiedzi tekstowych,
    -- a `o` bywa wtedy krótsze niż 5 elementów. Oba pola nullable - puste dla
    -- zwykłych pytań ABCDE.
    mode      text,
    answers   jsonb
);

alter table public.questions enable row level security;

-- Każdy zalogowany użytkownik może odczytać dowolne pytanie (treść nie jest
-- prywatna per-user jak progress/activity - chodzi tylko o to, żeby wymagać
-- ważnej sesji, a nie o odrębne uprawnienia per osoba).
create policy "questions_select_authenticated" on public.questions
    for select using (auth.role() = 'authenticated');

-- Brak polityk insert/update/delete dla zwykłych userów - treść pytań
-- zarządzana wyłącznie z poziomu Dashboardu (Table Editor / SQL Editor jako
-- właściciel projektu), nie przez appkę we froncie.
