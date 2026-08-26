-- ======================================================================
-- PROTOTYP: dane z realnego planu zajęć III roku 2025-2026 (grupa 1),
-- NIE finalny plan Roku 2 2026-2027 (jeszcze nieopublikowany).
-- Cel: przetestować cały pipeline (tabele -> filtrowanie -> UI) na
-- prawdziwych, realistycznych datach, zamiast czekać na oficjalny
-- plan. Podmienić na docelowe dane, gdy uczelnia opublikuje plan
-- Roku 2 (zwykle wrzesień/październik).
-- ======================================================================

insert into public.subjects (key, label, year, unit_type) values
    ('diagnostyka_lab', 'Diagnostyka laboratoryjna', 3, 'block'),
    ('genetyka', 'Genetyka kliniczna', 3, 'block'),
    ('medycyna_sadowa', 'Medycyna sądowa', 3, 'block'),
    ('patologia', 'Patologia', 3, 'block'),
    ('propedeutyka_chir', 'Propedeutyka chirurgii', 3, 'block'),
    ('propedeutyka_cw', 'Propedeutyka chorób wewnętrznych', 3, 'block'),
    ('propedeutyka_onko', 'Propedeutyka onkologii', 3, 'block'),
    ('propedeutyka_ped', 'Propedeutyka pediatrii', 3, 'block'),
    ('propedeutyka_psych', 'Propedeutyka psychiatrii', 3, 'block'),
    ('radiologia', 'Radiologia z medycyną nuklearną', 3, 'block')
on conflict (key) do nothing;

insert into public.study_units (subject_key, ordinal, title, starts_on, ends_on) values
    ('propedeutyka_ped', 1, 'propedeutyka pediatrii — blok 1', '2025-10-01', '2025-10-20'),
    ('diagnostyka_lab', 1, 'diagnostyka laboratoryjna — blok 1', '2025-10-21', '2025-10-28'),
    ('propedeutyka_onko', 1, 'propedeutyka onkologii — blok 1', '2025-11-12', '2025-11-20'),
    ('genetyka', 1, 'genetyka kliniczna — blok 1', '2025-11-24', '2025-12-03'),
    ('patologia', 1, 'patologia- sekcyjna — blok 1', '2025-12-22', '2025-12-23'),
    ('patologia', 2, 'patologia- sekcyjna — blok 2', '2026-01-07', '2026-01-08'),
    ('medycyna_sadowa', 1, 'medycyna sądowa — blok 1', '2026-01-09', '2026-01-12'),
    ('propedeutyka_chir', 1, 'propedeutyka chirurgii — blok 1', '2026-02-23', '2026-03-04'),
    ('radiologia', 1, 'radiologia z medycyna nuklearna — blok 1', '2026-03-10', '2026-03-18'),
    ('patologia', 3, 'patologia- sekcyjna — blok 3', '2026-03-31', '2026-04-01'),
    ('patologia', 4, 'patologia- sekcyjna — blok 4', '2026-04-07', '2026-04-08'),
    ('propedeutyka_cw', 1, 'propedeutyka chorób wewnetrznych — blok 1', '2026-04-14', '2026-04-23'),
    ('propedeutyka_psych', 1, 'propedeutyka psychiatrii — blok 1', '2026-06-01', '2026-06-03'),
    ('propedeutyka_psych', 2, 'propedeutyka psychiatrii — blok 2', '2026-06-08', '2026-06-09')
on conflict (subject_key, ordinal) do nothing;
