-- supabase_schema_study_plan_groups.sql
-- Wklej i uruchom w Supabase Dashboard -> SQL Editor -> Run (po wcześniejszym
-- uruchomieniu supabase_schema_study_plan.sql).
--
-- Rozszerza plan nauki o GRUPY - konieczne, bo przy części przedmiotów (rotacje
-- kliniczne) różne grupy tego samego rocznika mają RÓŻNE zajęcia tego samego
-- dnia (potwierdzone w realnym planie III roku 2025-2026: ~51-60 grup, każda
-- z osobną ścieżką). Jeden `study_units` na przedmiot (bez rozróżnienia grupy)
-- wystarcza tylko dla przedmiotów wykładowych, gdzie cały rocznik ma to samo.
--
-- `group_number` jest NULLABLE w obu tabelach - `null` = "dotyczy wszystkich
-- grup" (np. wykład), konkretna liczba = "dotyczy tylko tej grupy" (np. blok
-- rotacyjny). Dzięki temu nie trzeba duplikować jednostek dla przedmiotów,
-- które i tak są wspólne dla całego rocznika.

alter table public.profiles add column if not exists group_number int;

alter table public.study_units add column if not exists group_number int;

-- Dotychczasowy unique(subject_key, ordinal) nie pozwoliłby wielu grupom mieć
-- różnych jednostek o tym samym numerze porządkowym - trzeba go zastąpić
-- wersją uwzględniającą grupę (NULL w unique constraincie w Postgresie liczy
-- się jako "różne od każdej innej wartości", więc wiele wierszy z
-- group_number=null i tym samym ordinal nadal by kolidowało - stąd COALESCE
-- do wartości wartowniczej 0, która nie jest prawdziwym numerem grupy).
alter table public.study_units drop constraint if exists study_units_subject_key_ordinal_key;
create unique index if not exists study_units_subject_ordinal_group_key
    on public.study_units (subject_key, ordinal, coalesce(group_number, 0));
