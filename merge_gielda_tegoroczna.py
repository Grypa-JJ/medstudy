import json
import patologia_gielda_tegoroczna as pg
import sadowa_gielda_tegoroczna as sg


def merge(raw_path, new_items):
    with open(raw_path, encoding='utf-8') as f:
        existing = json.load(f)
    before = len(existing)
    existing.extend(new_items)
    with open(raw_path, 'w', encoding='utf-8') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    print(f"{raw_path}: {before} -> {len(existing)} (+{len(new_items)})")


merge('patologia_raw.json', pg.ITEMS)
merge('medycyna_sadowa_raw.json', sg.ITEMS)
