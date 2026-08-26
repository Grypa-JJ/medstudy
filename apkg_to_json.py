"""
apkg_to_json.py
Wyciąga fiszki (przód/tył + talia) z plików Anki (.apkg) i zapisuje je jako
*_raw.json - płaską listę {"front", "back", "category"} do dalszej obróbki
przez build_questions.mjs (buildAngielski() / buildAngielski2()).

Obsługuje oba formaty Anki:
- nowy: collection.anki21b (skompresowany zstd), decks w osobnej tabeli
- stary: collection.anki2 / collection.anki21 (zwykły SQLite), decks w kolumnie col.decks (JSON)

Uruchomienie: python apkg_to_json.py
Wymaga: pip install zstandard
"""
import json
import re
import sqlite3
import zipfile
from pathlib import Path

DIR = Path(__file__).parent

# Grupy plików -> plik wyjściowy (jedna grupa = jeden przedmiot/rocznik).
GROUPS = {
    "angielski_raw.json": ["angielski_s1_desktop.apkg", "angielski_s1_nowy4.apkg"],
    "angielski2_anki_raw.json": [r"ang dokumenty\2gi rok\_extracted\anki\1.EMERGENCY MEDICINE.apkg"],
    "mikrobiologia_anki_raw.json": [
        r"Mikrobiologia\Anki 🃏\leczenie bakteryjek.apkg",
        r"Mikrobiologia\Anki 🃏\mikro kolos2 giełda.apkg",
        r"Mikrobiologia\Anki 🃏\mikro plus.apkg",
    ],
    "patologia_anki_raw.json": [
        r"Rok 3 2025-2026\Patologia 🩸\Anki\Leśniowski Korn_ reszta z przewodu pokarmowego robbins.apkg",
    ],
    "medycyna_sadowa_anki_raw.json": [
        r"Rok 3 2025-2026\Medycyna sądowa i patologia sekcyjna ⚖️\Anki\3-ROK__Medycyna-Sądowa.apkg",
    ],
}


def strip_html(s):
    if not s:
        return ""
    s = re.sub(r"<br\s*/?>", " ", s, flags=re.IGNORECASE)
    s = re.sub(r"<[^>]+>", "", s)
    s = s.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def extract_collection_db(apkg_path, tmp_db_path):
    with zipfile.ZipFile(apkg_path) as z:
        names = z.namelist()
        if "collection.anki21b" in names:
            import zstandard as zstd
            comp = z.read("collection.anki21b")
            data = zstd.ZstdDecompressor().decompress(comp, max_output_size=500 * 1024 * 1024)
            tmp_db_path.write_bytes(data)
        elif "collection.anki21" in names:
            tmp_db_path.write_bytes(z.read("collection.anki21"))
        else:
            tmp_db_path.write_bytes(z.read("collection.anki2"))


def get_decks(cur):
    """Zwraca {deck_id: deck_name}, niezależnie od wersji schematu Anki."""
    try:
        return dict(cur.execute("select id, name from decks"))
    except sqlite3.OperationalError:
        cur.execute("select decks from col")
        decks_json = cur.fetchone()[0]
        decks = json.loads(decks_json)
        return {int(k): v["name"] for k, v in decks.items()}


def cloze_to_front_back(text):
    # "{{c1::at}}" (ew. "{{c1::at::podpowiedź}}") -> front z "___", back = "at"
    m = re.search(r"\{\{c\d+::(.*?)(?:::.*?)?\}\}", text)
    if not m:
        return None, None
    answer = strip_html(m.group(1))
    front = strip_html(re.sub(r"\{\{c\d+::.*?\}\}", "___", text))
    return front, answer


def notes_from_apkg(apkg_path):
    tmp_db_path = DIR / (Path(apkg_path).stem + "_tmp.db")
    extract_collection_db(apkg_path, tmp_db_path)

    con = sqlite3.connect(tmp_db_path)
    con.create_collation("unicase", lambda a, b: (a > b) - (a < b))
    cur = con.cursor()

    fields_by_model = {}
    try:
        # Nowy schemat: tabela `fields`.
        for ntid, ord_, name in cur.execute("select ntid, ord, name from fields order by ntid, ord"):
            fields_by_model.setdefault(ntid, []).append(name.lower())
    except sqlite3.OperationalError:
        # Stary schemat: definicje pól w col.models (JSON).
        cur.execute("select models from col")
        models = json.loads(cur.fetchone()[0])
        for mid, m in models.items():
            fields_by_model[int(mid)] = [f["name"].lower() for f in m["flds"]]

    decks = get_decks(cur)
    note_to_deck = dict(cur.execute("select nid, did from cards"))

    out = []
    for nid, mid, flds in cur.execute("select id, mid, flds from notes"):
        field_names = fields_by_model.get(mid, [])
        values = flds.split("\x1f")
        deck_name = decks.get(note_to_deck.get(nid), "")
        category = deck_name.split("\x1f", 1)[1] if "\x1f" in deck_name else deck_name

        is_cloze = any(f in ("tekst", "text") for f in field_names)
        if is_cloze:
            text = values[0] if len(values) > 0 else ""
            front, back = cloze_to_front_back(text)
        else:
            front = strip_html(values[0]) if len(values) > 0 else ""
            back = strip_html(values[1]) if len(values) > 1 else ""

        if not front or not back or not category:
            continue  # pomija śmieciowe/niekompletne wpisy (np. karty-etykiety talii)

        out.append({"front": front, "back": back, "category": category})

    con.close()
    tmp_db_path.unlink(missing_ok=True)
    return out


def process_group(out_name, file_list):
    all_notes = []
    for fname in file_list:
        path = DIR / fname
        if not path.exists():
            print(f"Pomiń (brak pliku): {fname}")
            continue
        notes = notes_from_apkg(path)
        print(f"{fname}: {len(notes)} fiszek")
        all_notes.extend(notes)

    seen = set()
    deduped = []
    for n in all_notes:
        key = (n["front"], n["back"])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(n)

    print(f"-> {out_name}: {len(deduped)} fiszek po deduplikacji")
    by_cat = {}
    for n in deduped:
        by_cat[n["category"]] = by_cat.get(n["category"], 0) + 1
    for cat, count in sorted(by_cat.items()):
        print(f"  {cat}: {count}")

    with open(DIR / out_name, "w", encoding="utf-8") as f:
        json.dump(deduped, f, ensure_ascii=False)


def main():
    for out_name, file_list in GROUPS.items():
        process_group(out_name, file_list)


if __name__ == "__main__":
    main()
