-- prototype_seed_wdnk_msn_weeks.sql
-- PROTOTYP (jawnie oznaczony, DO POPRAWY gdy poznamy realny plan Roku 2
-- 2026/2027): jednostki tygodniowe dla WdNK i MSN, oparte na kategoriach
-- (stacjach), które już istnieją w bazie pytań - 1 kategoria = 1 tydzień,
-- dokładnie jak przy histologii (patrz WDNK_TOPIC_ORDER / MSN_TOPIC_ORDER
-- w build_questions.mjs).
--
-- Kolejność WdNK jest MOIM założeniem dydaktycznym (nie potwierdzonym
-- sylabusem). Kolejność MSN jest lepiej uzasadniona - odpowiada progresji
-- złożoności resuscytacji (BLS -> ALS -> PALS -> NLS).
--
-- Rozstawienie w czasie jest ZGADYWANE (WdNK od 1.10 zimowy, MSN od 23.02
-- letni) - w folderze Rok 2 2024-2025 brak dowodu sesji dla żadnego z tych
-- przedmiotów (patrz kalendarz_szkielet_rok2.md). Poprawić, gdy przyjdzie
-- realny plan.

insert into public.subjects (key, label, year, unit_type) values
    ('wdnk', 'Wstęp do nauk klinicznych', 2, 'week'),
    ('msn', 'Medycyna stanów nagłych', 2, 'week')
on conflict (key) do nothing;

insert into public.study_units (subject_key, ordinal, title, starts_on, ends_on) values
    ('wdnk', 1, 'Wywiad lekarski', '2025-10-01', '2025-10-07'),
    ('wdnk', 2, 'Badanie klatki piersiowej', '2025-10-08', '2025-10-14'),
    ('wdnk', 3, 'Badanie brzucha', '2025-10-15', '2025-10-21'),
    ('wdnk', 4, 'Badanie narządu ruchu', '2025-10-22', '2025-10-28'),
    ('wdnk', 5, 'Badanie neurologiczne', '2025-10-29', '2025-11-04'),
    ('wdnk', 6, 'Badanie dna oka', '2025-11-05', '2025-11-11'),
    ('wdnk', 7, 'Laryngologia', '2025-11-12', '2025-11-18'),
    ('wdnk', 8, 'Dermatologia', '2025-11-19', '2025-11-25'),
    ('wdnk', 9, 'Badanie ginekologiczne', '2025-11-26', '2025-12-02'),
    ('wdnk', 10, 'EKG i mierzenie ciśnienia', '2025-12-03', '2025-12-09'),
    ('wdnk', 11, 'Kaniulacja naczyń, iniekcje i desmurgia', '2025-12-10', '2025-12-16'),
    ('wdnk', 12, 'Cewnikowanie i per rectum', '2025-12-17', '2025-12-23'),
    ('wdnk', 13, 'Szycie chirurgiczne', '2025-12-24', '2025-12-30'),
    ('wdnk', 14, 'Myślenie kliniczne', '2025-12-31', '2026-01-06'),
    ('msn', 1, 'Udrażnianie dróg oddechowych i tlenoterapia', '2026-02-23', '2026-03-01'),
    ('msn', 2, 'Postępowanie urazowe', '2026-03-02', '2026-03-08'),
    ('msn', 3, 'BLS — Podstawowe zabiegi resuscytacyjne', '2026-03-09', '2026-03-15'),
    ('msn', 4, 'ALS — Zaawansowane zabiegi resuscytacyjne', '2026-03-16', '2026-03-22'),
    ('msn', 5, 'PALS — Zabiegi resuscytacyjne u dzieci', '2026-03-23', '2026-03-29'),
    ('msn', 6, 'NLS — Resuscytacja noworodka', '2026-03-30', '2026-04-05'),
    ('msn', 7, 'Opieka poresuscytacyjna', '2026-04-06', '2026-04-12'),
    ('msn', 8, 'Pierwsza pomoc', '2026-04-13', '2026-04-19'),
    ('msn', 9, 'Sytuacje szczególne w resuscytacji', '2026-04-20', '2026-04-26')
on conflict (subject_key, ordinal) do nothing;
