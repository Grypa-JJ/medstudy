-- prototype_seed_poprawki_1rok_2026.sql
-- Sesja poprawkowa Rok 1 (2025-26), ogłoszenie z maila starosty/COE (2026-08-21).
-- Cel: przetestować "Dzisiejszą sesję" + odznakę "zbliża się kolokwium"
-- (getUpcomingExam) na realnych, nadchodzących terminach - nie jest to
-- prawdziwy plan zajęć (te przedmioty mają już swoje jednostki tygodniowe,
-- patrz prototype_seed_histologia_weeks.sql), więc celowo używamy ordinali
-- 90+ (nigdy nieużywanych przez tematy 1-22), żeby NIE kolidować z
-- istniejącym dowiązaniem kategorii -> tydzień. Efekt uboczny tej decyzji:
-- kliknięcie takiej karty na "Dzisiejszej sesji" wpadnie w CAŁY przedmiot
-- (resolveTodaySessionTarget nie znajdzie dopasowania na poziomie
-- kategorii/tematu dla ordinali >22) - to i tak sensowne dla poprawki,
-- która obejmuje cały materiał, nie jeden tydzień.
--
-- Histologia ma DWIE równoległe pozycje (teoretyczna i "diagnostyczno-
-- obrazowa" = de facto egzamin praktyczny) pod tym samym subject_key,
-- każda z osobną datą - odpowiadają realnemu podziałowi na 2 osobne testy.
--
-- Uruchomienie: wklej w Supabase -> SQL Editor -> Run. Bezpieczne do
-- ponownego uruchomienia (on conflict do nothing).

-- "anatomia" i "biochemia" jeszcze nie miały wpisu w rejestrze przedmiotów
-- (dotąd tylko histologia/mikrobiologia/fizjopato itd. miały jednostki planu) -
-- bez tego insert do study_units wywala błąd klucza obcego (fkey).
insert into public.subjects (key, label, year, unit_type) values
    ('anatomia', 'Anatomia', 1, 'week'),
    ('biochemia', 'Biochemia', 1, 'week')
on conflict (key) do nothing;

insert into public.study_units (subject_key, ordinal, title, starts_on, ends_on, exam_on) values
    -- Anatomia prawidłowa
    ('anatomia',   90, 'Poprawka I termin — Anatomia prawidłowa',   '2026-08-21', '2026-09-08', '2026-09-08'),
    ('anatomia',   91, 'Poprawka II termin — Anatomia prawidłowa',  '2026-09-09', '2026-09-17', '2026-09-17'),

    -- Histologia, Cytologia i Embriologia — część diagnostyczno-obrazowa (egzamin praktyczny)
    ('histologia', 92, 'Poprawka I termin — Histologia (część diagnostyczno-obrazowa)',  '2026-08-21', '2026-09-07', '2026-09-07'),
    ('histologia', 93, 'Poprawka II termin — Histologia (część diagnostyczno-obrazowa)', '2026-09-08', '2026-09-16', '2026-09-16'),

    -- Histologia, Cytologia i Embriologia — część teoretyczna
    ('histologia', 94, 'Poprawka I termin — Histologia (część teoretyczna)',  '2026-08-21', '2026-09-10', '2026-09-10'),
    ('histologia', 95, 'Poprawka II termin — Histologia (część teoretyczna)', '2026-09-11', '2026-09-21', '2026-09-21'),

    -- Chemia z Biochemią i Biologią Molekularną II
    ('biochemia',  96, 'Poprawka I termin — Chemia z Biochemią i Biologią Molekularną II',  '2026-08-21', '2026-09-03', '2026-09-03'),
    ('biochemia',  97, 'Poprawka II termin — Chemia z Biochemią i Biologią Molekularną II', '2026-09-04', '2026-09-14', '2026-09-14')
on conflict (subject_key, ordinal, coalesce(group_number, 0)) do nothing;
