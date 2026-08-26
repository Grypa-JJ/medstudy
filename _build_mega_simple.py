# -*- coding: utf-8 -*-
import json, re, html

notes = json.load(open("_mega_notes_full.json", encoding="utf-8"))
notes = [n for n in notes if 'Krew i hemopoeza' not in n['deck'] and 'przód' in n]

IMG_TAG_RE = re.compile(r'<img[^>]*src="([^"]+)"[^>]*>')
TAG_RE = re.compile(r'<[^>]+>')
numbered_re = re.compile(r'\d+[a-z]?[.\-]\s*[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż]')

def strip_html(s):
    if not s:
        return ""
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.IGNORECASE)
    s = re.sub(r'</div>\s*<div>', '\n', s, flags=re.IGNORECASE)
    s = TAG_RE.sub('', s)
    s = html.unescape(s)
    s = s.replace('\xa0', ' ')
    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r'\n\s*\n+', '\n', s)
    return s.strip()

def cap(s):
    return s[0].upper() + s[1:] if s else s

def topic_from_deck(deck):
    # "...HISTOLOGIA - PREPARATY ZIMA ❄️02. Cytoplazma" -> "02. Cytoplazma"
    m = re.search(r'(ZIMA|LATO)[^\d]*(\d\d\..*)', deck)
    if m:
        season = 'ZIMA' if m.group(1) == 'ZIMA' else 'LATO'
        topic = m.group(2).strip()
        # LATO decks have suffix "a] preparaty" / "b] elektronogramy"
        sub = None
        mm = re.match(r'^(.*?)(a\]\s*preparaty|b\]\s*elektronogramy)$', topic)
        if mm:
            topic = mm.group(1).strip()
            sub = 'elektronogramy' if 'elektronogramy' in mm.group(2) else 'preparaty'
        return season, topic, sub
    return None, deck, None

simple_out = []
numbered_candidates = []

for n in notes:
    front_raw = n.get('przód', '')
    back_raw = n.get('tył', '')
    m = IMG_TAG_RE.search(front_raw)
    img_file = m.group(1) if m else None
    front_no_img = IMG_TAG_RE.sub('', front_raw).strip()

    back_plain = re.sub(r'<[^>]+>', '', html.unescape(back_raw))
    if len(numbered_re.findall(back_plain)) >= 3:
        numbered_candidates.append(n)
        continue

    q_raw = strip_html(front_no_img)

    # "PYTANIE NIE DO ZDJECIA" - pytanie teoretyczne niepowiazane z obrazkiem -> usun prefiks, nie pokazuj img
    no_photo = False
    mm_np = re.match(r'^PYTANIE\s+NIE\s+DO\s+ZDJ[EĘ]CIA\W*\n?', q_raw, flags=re.IGNORECASE)
    if mm_np:
        no_photo = True
        q_raw = q_raw[mm_np.end():].strip()
        img_file = None

    # front = goly numer/litera (ew. + dalszy realny tekst pytania) -> "Co oznaczono jako nr X? <reszta>"
    mm_num = re.match(r'^([0-9]+[a-zA-Z]?|[A-Z]{1,4})\s*(?:[\+\-]\s*(.*))?$', q_raw.strip())
    if mm_num and (mm_num.group(2) or len(q_raw.strip()) <= 4):
        label = mm_num.group(1)
        rest = (mm_num.group(2) or '').strip(' ?')
        prefix = "nr " if label[0].isdigit() else ""
        q = f"Co oznaczono jako {prefix}{label}?"
        if rest:
            q += " " + cap(rest) + "?"
    else:
        q = q_raw.strip(' ?')
        q = (cap(q) + ("?" if q and not q.endswith(('?', '.', ':')) else "")) if q else None

    if q is None:
        q = "Co przedstawia preparat?"

    back_clean = strip_html(back_raw)
    if not back_clean:
        continue

    # listy wypunktowane strzalkami/myslnikami na poczatku linii -> traktuj jako jedna zlozona odpowiedz (bez rationale-split)
    is_bullet_list = bool(re.search(r'\n\s*(->|-|•)\s', back_clean))

    rationale = None
    primary = back_clean
    if not is_bullet_list:
        mm = re.match(r'^([^(]+?)\s*\(([^)]+)\)\s*$', back_clean)
        if mm and len(mm.group(1)) > 2:
            primary, rationale = mm.group(1).strip(), mm.group(2).strip()
        elif ' - ' in back_clean and back_clean.index(' - ') < 60:
            primary, rationale = back_clean.split(' - ', 1)
            primary, rationale = primary.strip(), rationale.strip()
    if is_bullet_list:
        # scal linie w jedna czytelna liste rozdzielona przecinkami
        parts = [p.strip(' ->•\t') for p in back_clean.split('\n') if p.strip(' ->•\t')]
        primary = ', '.join(parts)

    primary = primary.strip(' ,;')
    if not primary:
        continue
    primary = re.sub(r'\n+', '; ', primary).strip(' ,;')
    primary = cap(primary)
    if rationale:
        rationale = re.sub(r'\n+', ' ', rationale).strip()

    season, topic, sub = topic_from_deck(n['deck'])
    category = f"Egzamin praktyczny — {topic}" if topic else "Egzamin praktyczny — Preparaty (mega)"

    item = {
        "q": q or "Co przedstawia preparat?",
        "answers": [primary],
        "img": img_file,
        "category": category,
        "season": season,
        "sub": sub,
        "nid": n['nid'],
    }
    if rationale:
        item["rationale"] = cap(rationale.strip(' ,;'))
    simple_out.append(item)

print("simple ->", len(simple_out))
print("numbered candidates (do recznej obrobki) ->", len(numbered_candidates))

json.dump(simple_out, open("_mega_simple_raw.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump([{"nid": n['nid'], "deck": n['deck'], "front": n.get('przód',''), "back": n.get('tył','')} for n in numbered_candidates],
          open("_mega_numbered_candidates.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# podsumowanie kategorii
from collections import Counter
cats = Counter(it['category'] for it in simple_out)
for c, cnt in sorted(cats.items()):
    print(f"  {cnt:4d}  {c}")
