# Wspólny schemat pytania (Anatomia / Histologia / Biochemia)

## Struktura jednego pytania

```json
{
  "id": "anat_a3f9c21e",
  "subject": "anatomia",
  "category": "Kończyna dolna",
  "tier": 1,
  "q": "Gdzie znajduje się jądro wierzchu (nucleus fastigii)?",
  "a": 2,
  "o": ["Wzgórze", "Most", "Móżdżek", "Śródmózgowie", "Rdzeń przedłużony"],
  "img": null
}
```

| Pole | Typ | Opis |
|---|---|---|
| `id` | string | Stały, deterministyczny identyfikator. Nigdy się nie zmienia, nawet gdy pytanie zmieni pozycję w tablicy. Format: `{skrót_przedmiotu}_{hash}` |
| `subject` | string | `anatomia` \| `histologia` \| `biochemia` |
| `category` | string \| null | Temat/rozdział (np. "Tkanka nerwowa", "Enzymy"). Dla histologii wyciągnięty z komentarzy `// ZESTAW X`. Dla biochemii na razie `null` — do uzupełnienia w kroku 2. |
| `tier` | int \| null | 1–4, tylko tam gdzie już ustaliliśmy (anatomia). `null` gdzie jeszcze nie przypisane. |
| `q` | string | Treść pytania, **bez numeru na początku** (numer był tylko artefaktem oryginalnej bazy, nie ma znaczenia semantycznego i psuł dedup w przeszłości) |
| `a` | int | Indeks poprawnej odpowiedzi w `o` (0–4). Zamiana z liter (a–e) na indeksy — jednoznaczne, mniej podatne na pomyłki niż litera, która myli się z polem `a` w JS |
| `o` | string[] | Lista 5 opcji odpowiedzi, w oryginalnej kolejności (przetasowanie robi UI przy renderze, tak jak dotychczas) |
| `img` | string \| null | Base64 obrazka (tylko tam gdzie występuje — anatomia `bimg_*`) |

## Dlaczego `id` jest stały

`id = subject_prefix + "_" + fnv1a_hex(q_znormalizowane + "|" + o.join("|"))`

- Liczony z **treści**, nie z pozycji w tablicy → przenoszenie/sortowanie/wstawianie pytań nigdzie indziej nie psuje historii odpowiedzi użytkownika.
- Identyczny algorytm w JS (runtime appki) i Pythonie (moje skrypty do przetwarzania) → mogę generować/weryfikować ID offline, a appka policzy to samo w przeglądarce.
- Human-readable prefiks (`anat_`, `hist_`, `bioch_`) — od razu widać skąd pytanie, przydatne przy debugowaniu.

## Progress (postęp użytkownika)

Jeden wspólny klucz w localStorage dla całej appki (koniec z `quizProgress` vs `histologia_progress`):

```json
// localStorage["medStudyProgress_v1"]
{
  "anat_a3f9c21e": { "correct": true,  "chosen": 2, "ts": 1719900000000 },
  "hist_77bb210f": { "correct": false, "chosen": 0, "ts": 1719900500000 }
}
```

Kluczowane przez `id`, nie przez indeks — usunięcie/dodanie/przesunięcie pytania gdziekolwiek w bazie nigdy nie przesunie czyjegoś postępu na inne pytanie.
