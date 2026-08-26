-- prototype_seed_histologia_weeks.sql
-- PROTOTYP: 22 jednostki tygodniowe dla histologii (Rok 1), oparte na
-- realnej kolejności dydaktycznej 22 tematów (HISTOLOGIA_TOPICS) i realnych
-- granicach semestrów (start zimowego 1.10, start letniego 23.02 - te same
-- daty co w faktycznym planie zajęć III roku 2025-2026). Cel: pełny, DZIAŁAJĄCY
-- pilotaż mechanizmu tygodniowego cyklu (kategoria = temat = jednostka), nie
-- tylko przykładowe bloki. Podmienić na realne daty Roku 1/2, gdy dostępne.

insert into public.subjects (key, label, year, unit_type) values ('histologia', 'Histologia', 1, 'week') on conflict (key) do nothing;

insert into public.study_units (subject_key, ordinal, title, starts_on, ends_on) values
    ('histologia', 1, '01. Wprowadzenie do technik histologicznych i mikroskopii', '2025-10-01', '2025-10-07'),
    ('histologia', 2, '02. Cytofizjologia cz. I — cytoplazma', '2025-10-08', '2025-10-14'),
    ('histologia', 3, '03. Cytofizjologia cz. II — jądro komórkowe', '2025-10-15', '2025-10-21'),
    ('histologia', 4, '04. Tkanka nabłonkowa', '2025-10-22', '2025-10-28'),
    ('histologia', 5, '05. Tkanka łączna i tłuszczowa', '2025-10-29', '2025-11-04'),
    ('histologia', 6, '06. Tkanki łączne oporowe — chrzęstna i kostna', '2025-11-05', '2025-11-11'),
    ('histologia', 7, '07. Tkanka mięśniowa', '2025-11-12', '2025-11-18'),
    ('histologia', 8, '08. Tkanka nerwowa i układ nerwowy', '2025-11-19', '2025-11-25'),
    ('histologia', 9, '09. Krew i hemopoeza', '2025-11-26', '2025-12-02'),
    ('histologia', 10, '10. Układ płciowy żeński', '2025-12-03', '2025-12-09'),
    ('histologia', 11, '11. Układ płciowy męski', '2025-12-10', '2025-12-16'),
    ('histologia', 12, '12. Embriologia ogólna', '2026-02-23', '2026-03-01'),
    ('histologia', 13, '13. Układ krwionośny i jego rozwój embriologiczny', '2026-03-02', '2026-03-08'),
    ('histologia', 14, '14. Układ limfatyczny i jego rozwój embriologiczny', '2026-03-09', '2026-03-15'),
    ('histologia', 15, '15. Narządy zmysłów, skóra i rozwój układu nerwowego', '2026-03-16', '2026-03-22'),
    ('histologia', 16, '16. Przewód pokarmowy cz. I — jama ustna', '2026-03-23', '2026-03-29'),
    ('histologia', 17, '17. Przewód pokarmowy cz. II — cewa pokarmowa', '2026-03-30', '2026-04-05'),
    ('histologia', 18, '18. Narządy związane z przewodem pokarmowym', '2026-04-06', '2026-04-12'),
    ('histologia', 19, '19. Układ oddechowy i jego rozwój embriologiczny', '2026-04-13', '2026-04-19'),
    ('histologia', 20, '20. Układ moczowy i płciowy — rozwój embriologiczny', '2026-04-20', '2026-04-26'),
    ('histologia', 21, '21. Układ dokrewny i jego rozwój embriologiczny', '2026-04-27', '2026-05-03'),
    ('histologia', 22, '22. Popłód, jego rozwój i teratologia', '2026-05-04', '2026-05-10')
on conflict (subject_key, ordinal) do nothing;
