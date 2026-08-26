-- prototype_seed_immunologia_weeks.sql
-- PROTOTYP (jawnie oznaczony, DO POPRAWY gdy poznamy realny plan Roku 2
-- 2026/2027): 21 jednostek tygodniowych dla immunologii, oparte na
-- kategoriach, które już istnieją w bazie (po naprawie duplikatu z myślnikami
-- — patrz IMMUNOLOGIA_TOPIC_ORDER w build_questions.mjs). Kolejność to
-- standardowa sekwencja dydaktyczna kursu immunologii (mechanizmy
-- podstawowe -> tematy kliniczne), MOJE założenie, nie potwierdzony sylabus.
-- Rozstawienie w czasie zgadywane (od 1.10, semestr zimowy) - do poprawy.

insert into public.subjects (key, label, year, unit_type) values ('immunologia', 'Immunologia', 2, 'week') on conflict (key) do nothing;

insert into public.study_units (subject_key, ordinal, title, starts_on, ends_on) values
    ('immunologia', 1, 'Odporność wrodzona — receptory i mediatory', '2025-10-01', '2025-10-07'),
    ('immunologia', 2, 'Dopełniacz', '2025-10-08', '2025-10-14'),
    ('immunologia', 3, 'Rozwój i selekcja limfocytów', '2025-10-15', '2025-10-21'),
    ('immunologia', 4, 'MHC i prezentacja antygenu', '2025-10-22', '2025-10-28'),
    ('immunologia', 5, 'Przeciwciała i receptory limfocytów (BCR/TCR)', '2025-10-29', '2025-11-04'),
    ('immunologia', 6, 'Przeciwciała — budowa i różnorodność', '2025-11-05', '2025-11-11'),
    ('immunologia', 7, 'Aktywacja limfocytów T', '2025-11-12', '2025-11-18'),
    ('immunologia', 8, 'Subpopulacje limfocytów i komórki NK', '2025-11-19', '2025-11-25'),
    ('immunologia', 9, 'Komórki układu odpornościowego i markery CD', '2025-11-26', '2025-12-02'),
    ('immunologia', 10, 'Cytokiny', '2025-12-03', '2025-12-09'),
    ('immunologia', 11, 'Cytotoksyczność komórkowa i mechanizmy efektorowe', '2025-12-10', '2025-12-16'),
    ('immunologia', 12, 'Odporność przeciwzakaźna i szczepionki', '2025-12-17', '2025-12-23'),
    ('immunologia', 13, 'Pamięć immunologiczna i autoimmunizacja', '2025-12-24', '2025-12-30'),
    ('immunologia', 14, 'Reakcje nadwrażliwości', '2025-12-31', '2026-01-06'),
    ('immunologia', 15, 'Alergologia', '2026-01-07', '2026-01-13'),
    ('immunologia', 16, 'Pierwotne niedobory odporności', '2026-01-14', '2026-01-20'),
    ('immunologia', 17, 'Transplantologia', '2026-01-21', '2026-01-27'),
    ('immunologia', 18, 'Immunologia nowotworów', '2026-01-28', '2026-02-03'),
    ('immunologia', 19, 'Immunologia ciąży', '2026-02-04', '2026-02-10'),
    ('immunologia', 20, 'Transfuzjologia i konflikt serologiczny', '2026-02-11', '2026-02-17'),
    ('immunologia', 21, 'Leki biologiczne i immunosupresyjne', '2026-02-18', '2026-02-24')
on conflict (subject_key, ordinal) do nothing;
