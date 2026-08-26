# Wskazówki dla Claude Code w tym projekcie

## Dobór modelu wg typu zadania

- **Tworzenie/rozbudowa pytań egzaminacyjnych, dystraktorów, treści merytorycznych (rationale)** — preferuj `/model opus`. Opus lepiej radzi sobie z subtelnymi, wiarygodnymi dystraktorami na poziomie akademickim i trzyma się ściślej materiału źródłowego.
- **Pisanie/refaktoryzacja kodu (JS/Python/HTML, atlas 3D, buildy, SQL)** — preferuj `/model sonnet`. Wystarczająca jakość przy niższym koszcie/szybszym throughput.
- **Drobne, mechaniczne zadania (formatowanie, proste poprawki CSS/JSON)** — rozważ `/model haiku`.

To wymaga ręcznego przełączenia komendą `/model` na początku sesji danego typu — model nie przełącza się sam w trakcie rozmowy. Nie zakładaj domyślnie, że bieżący model jest właściwy dla zadania — jeśli sesja zaczyna się od dużego zadania generowania pytań, zasugeruj użytkownikowi `/model opus`.

## Duże pliki binarne / dumpy danych

Ten katalog zawiera duże pliki (PDF-y skryptów, .apkg, .mp3, .zip, bazy .db, surowe dumpy *_raw.json rzędu megabajtów) które nie powinny być czytane w całości bez wyraźnej potrzeby — patrz `.claudeignore`. Jeśli potrzebujesz zajrzeć w konkretny fragment dużego pliku, czytaj wycinkiem (offset/limit), nie całość.

## Inne

Zobacz też `WSKAZOWKI-TECHNICZNE-WSPOLNE.md` — gotchas techniczne dot. `atlas_pilot.html` (Three.js/BVH/kamery/serwer podglądu).
