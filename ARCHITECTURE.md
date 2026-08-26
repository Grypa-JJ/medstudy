# Architektura

Szczegółowy opis tego, jak elementy aplikacji się ze sobą łączą i dlaczego padły takie, a nie inne decyzje projektowe. Diagram wysokopoziomowy jest w [README.md](README.md#architektura); tu jest rozwinięcie.

## 1. Dwuwarstwowy model treści pytań

Pytania są rozbite na dwie części, z różnym poziomem ochrony:

- **`meta.json`** (jawny plik na Netlify) — metadane: `id`, `subject`, `category`, `tier`, oraz **obrazek** (`img`, base64, do ~700KB/pytanie). Zdjęcie samo w sobie nie jest kluczem odpowiedzi, więc nie musi być chronione.
- **Tabela `questions` w Supabase** (chroniona RLS, patrz `supabase_schema_questions.sql`) — właściwa treść: `q` (pytanie), `o` (opcje), `a` (indeks poprawnej), `rationale` (wytłumaczenie). Dostępna tylko dla zalogowanych użytkowników.

`content.js` dogrywa treść z Supabase leniwie — dopiero gdy użytkownik faktycznie otworzy dany zestaw pytań, nie przy starcie aplikacji. Frontend (`index.html`) startuje więc z "lekkimi" rekordami z `meta.json`, a `ensureContentLoaded()` uzupełnia je w miejscu.

Dodatkowa komplikacja: to samo `id` (hash `subject+q+o`) może wystąpić pod wieloma kategoriami jednocześnie (np. pytanie z giełdy pojawia się też w zestawie tematycznym). `content.js` buduje mapę `idToIndices` (id → wszystkie miejsca w tablicy `questions`, gdzie się pojawia), więc jedno zapytanie do bazy zasila każde wystąpienie naraz, zamiast pobierać tę samą treść wielokrotnie.

## 2. Autoryzacja

- `supabase-client.js` tworzy współdzielony klient (`sb`) na bazie publicznego klucza "anon" — bezpiecznego do trzymania w kodzie frontendowym, bo faktyczną ochronę danych daje Row Level Security w bazie, nie tajność klucza.
- `auth.js` obsługuje logowanie/rejestrację. Gdy w Supabase włączone jest potwierdzanie e-maila (`supabase_schema_email_confirm.sql`), `signUp()` nie tworzy od razu aktywnej sesji — dane profilu (`display_name`, `year`) idą jako metadane rejestracji, a trigger po stronie bazy (`security definer`, więc RLS go nie blokuje) zapisuje je do `profiles` w momencie utworzenia wiersza, zanim jeszcze e-mail zostanie potwierdzony.

## 3. Postęp użytkownika i synchronizacja między urządzeniami

Cztery niezależne, ale jednolicie zaprojektowane mechanizmy — każdy jako osobna tabela z RLS ograniczającym użytkownika wyłącznie do własnych wierszy:

| Mechanizm | Tabela | Co śledzi |
|---|---|---|
| Historia odpowiedzi | `progress` / `activity` | poprawność, wybór, znacznik czasu |
| Fiszki (Leitner) | `flashcards` (v2) | box/poziom powtórki per pytanie |
| Tryb "trudne pytania" | `hard_streak` | licznik kolejnych poprawnych odpowiedzi w tym trybie (przynależność do puli "trudnych" wynika z `progress.correct=false`, nie jest duplikowana) |
| Tygodniowy cykl nauki | `cycle_progress` | które dni cyklu (teoria→fiszki→test→trudne→wpisywanie→egzamin) są odhaczone, per przedmiot i jednostka planu |

Ten czwarty mechanizm zastąpił wcześniejszą wersję trzymaną wyłącznie w `localStorage` przeglądarki — laptop, tablet i telefon tego samego konta miały niezależny, rozjeżdżający się stan. Wzorzec zapisu jest identyczny w całym projekcie: jeden wiersz na `(user_id, klucz)`, ładowany raz przy starcie do pamięci, zapisywany fire-and-forget przy każdej zmianie.

`profiles` (rozbudowane w `supabase_schema_profile_v2.sql`) dodatkowo trzyma awatar/obwódkę/łączny czas nauki, oraz udostępnia dwie funkcje SQL (`security definer`) do zbiorczych, zanonimizowanych statystyk (np. rozkład lat studiów wśród wszystkich userów) — bez naruszania RLS, bo funkcje zwracają wyłącznie zagregowane liczby, nigdy pojedyncze wiersze cudzych danych.

## 4. Pipeline generowania treści

Materiały źródłowe (PDF-y skryptów, talie Anki `.apkg`, dumpy CSV/DOCX z sesji egzaminacyjnych) nie trafiają bezpośrednio do aplikacji. Przechodzą przez łańcuch:

```
źródło (PDF / .apkg / CSV)
  → skrypt ekstrakcji (np. apkg_to_json.py, extract_*.py) → *_raw.json
  → skrypt budujący per-przedmiot (np. build_questions.mjs, farmakologia_build.py)
       - id-utils.js/id_utils.py: deterministyczne ID (ten sam hash w Pythonie i JS,
         żeby ID liczone offline przy migracji i w przeglądarce się zgadzały)
       - validator.js: łapie duplikaty ID, złe indeksy odpowiedzi, literówki w
         kategoriach — uruchamiany przed każdą publikacją
  → questions.json / meta.json
  → eksport CSV → import ręczny w Supabase Dashboard (Table Editor)
```

`apkg_to_json.py` obsługuje oba formaty plików Anki (stary SQLite `.anki2`/`.anki21` i nowy skompresowany `.anki21b`), bo różne talie w tym projekcie pochodzą z różnych wersji Anki.

## 5. Atlas anatomiczny 3D — eksperymentalny

`atlas_pilot.html` (Three.js) renderuje siatki BodyParts3D i pozwala eksplorować struktury kostne w 3D, z automatycznie wykrywanymi punktami anatomicznymi (landmarkami) i retargetingiem animacji motion-capture (BVH) na model. To najmłodszy, wciąż rozwijany moduł projektu — dane wejściowe (mesh, landmarki) celowo nie są w tym repo (patrz `.gitignore`), bo to dane badawcze/wygenerowane, nie kod.
