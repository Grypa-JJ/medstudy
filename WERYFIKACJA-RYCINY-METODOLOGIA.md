# Metodologia weryfikacji punktów względem rycin półmiska rozmaitości

Cel: każdy już naniesiony punkt orientacyjny (landmark) i każda bryła (mesh) w
atlasie ma mieć potwierdzenie **obrazkowe** — porównanie z ryciną w
`_polmisek_atlas.pdf` (618 stron, 492 z obrazem) — nie tylko tekstowe/numeryczne.
Tekst z PDF-a wolno używać jako pomoc do orientacji (który rozdział, która
strona), ale ROZSTRZYGA rycina, nie opis.

## Zakres realnie porównywalny z ryciną

`bone_landmarks.json` ma 6816 wpisów, ale większość to auto-generowane
znaczniki nawigacyjne bez własnej "poprawnej odpowiedzi" w atlasie (środek
struktury/narządu/zęba, koniec bliższy/daleki długiej kości, przyczep:
kość X — to pochodne geometrii bryły, nie niezależnie wybrana pozycja).
Realnie do sprawdzenia rycina-po-rycinie jest:

1. **~2832 unikalnych nazwanych punktów** (po zdjęciu L/P z nazwy) — to są
   punkty z konkretną, kimś wybraną pozycją (`pos`), które MOGĄ się mylić.
2. **2147 brył (mesh)** — pozycja/kształt całej struktury; weryfikowane przez
   porównanie sylwetki/relacji do sąsiadów na rycinie z bbox/kształtem w scenie
   (tak jak dziś przy naczyniach), NIE przez pojedynczy punkt.

Auto-generowane znaczniki (środek/koniec/przyczep) są pośrednio zweryfikowane,
gdy zweryfikowana jest sama bryła, do której należą — nie wymagają osobnego
wpisu w logu.

## Kolejność przechodzenia

Strona po stronie, od strony 1, PDF podzielony jest na rozdziały (I, II, III...
widoczne w tekście jako "Rozdział <rzymska> – <nazwa>"). Idziemy w kolejności
naturalnej książki:
1. Kończyny (górna/dolna) — kości, stawy, mięśnie, naczynia, nerwy.
2. Tułów — kręgosłup, klatka piersiowa, brzuch, miednica.
3. Głowa i szyja.
4. Mózg i układ nerwowy centralny.

## Krok po kroku dla KAŻDEJ strony z obrazem

1. Renderuj stronę do PNG (`fitz`, dpi=200) jeśli jeszcze nie ma w
   `_atlas_pages/p<N>.png`.
2. Przeczytaj rycinę (Read na PNG) — zidentyfikuj WSZYSTKIE nazwane struktury
   opisane na rycinie (etykiety na obrazku + tekst strony jako pomoc).
3. Dla każdej zidentyfikowanej struktury sprawdź, czy istnieje w naszych
   danych (mesh po `pl`/`en`, landmark po `pl`).
   - Jeśli NIE istnieje → pomiń (poza zakresem tego przebiegu, ewentualnie
     dopisz do osobnej listy "do dodania" — to inne zadanie niż weryfikacja).
   - Jeśli istnieje → przejdź do kroku 4.
4. Pobierz aktualną pozycję/bbox z żywej sceny (`javascript_tool` +
   `window.__dbgDance`) — dla brył: `Box3().setFromObject`; dla punktów:
   `mesh.position` (lokalne, world = position + group.position).
5. Porównaj UKŁAD na rycinie (co jest wyżej/niżej/przyśrodkowo/bocznie/
   przednio/tylnie względem sąsiadów NA RYCINIE) z układem w scenie. Rycina
   rzadko daje bezwzględne współrzędne — daje RELACJE (nad/pod, przyśrodkowo
   od, styka się z) — to jest właściwy test, nie dopasowanie pikseli.
6. Werdykt:
   - **OK** — relacje się zgadzają, zapisz do logu ze stroną i datą.
   - **BŁĄD** — nie zgadzają się → policz potrzebną poprawkę (translate/shear,
     ten sam warsztat co dziś), zastosuj w `atlas_pilot.html`, zweryfikuj
     ponownie, dopiero potem zapisz jako OK z adnotacją co poprawiono.
   - **NIEROZSTRZYGNIĘTE** — rycina zbyt schematyczna/nie pokazuje wystarczająco
     precyzyjnie → zapisz jako "rycina niewystarczająca", nie zgaduj.
7. Zapisz wynik do `_rycina_verification_log.json` (klucz: mesh id LUB
   `boneId|pl` dla landmarków) z polami `{status, page, checkedAt, note}`.
8. Zaraportuj w czacie: strona, lista sprawdzonych struktur z tej strony i
   werdykt każdej (nie zbiorcze "sprawdzono N" — user chce widzieć przyrost
   punkt po punkcie).

## Log postępu

`_rycina_verification_log.json` — mapa `id -> {status, page, checkedAt, note}`.
Wstępnie zasilona pozycjami już potwierdzonymi wcześniej (str. 115, 290,
316-326, 324, 485, 501-502, 525, 532-534, 546 — patrz komentarze w
`atlas_pilot.html` i `bone_landmarks.json`).

Ten plik NIE jest częścią danych produkcyjnych — to log roboczy tej kampanii,
podobnie jak `szpilki_map.json`/`szpilki_todo.json` dla poprzedniej kampanii.
