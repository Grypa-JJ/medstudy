# -*- coding: utf-8 -*-
import json, re, html

notes = json.load(open("_mega_numbered_candidates.json", encoding="utf-8"))
IMG_TAG_RE = re.compile(r'<img[^>]*src="([^"]+)"[^>]*>')
TAG_RE = re.compile(r'<[^>]+>')

def strip_html(s):
    if not s:
        return ""
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.IGNORECASE)
    s = TAG_RE.sub('', s)
    s = html.unescape(s)
    s = s.replace('\xa0', ' ')
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()

def topic_from_deck(deck):
    m = re.search(r'(ZIMA|LATO)[^\d]*(\d\d\..*)', deck)
    if m:
        topic = m.group(2).strip()
        mm = re.match(r'^(.*?)(a\]\s*preparaty|b\]\s*elektronogramy)$', topic)
        if mm:
            topic = mm.group(1).strip()
        return topic
    return "Preparaty (mega, nieprzypisane)"

# nid-y, ktore JUZ zostaly obsluzone przez _build_mega_numbered.py (majacy "Nazwij:" wzorzec)
handled = set(json.load(open("_mega_numbered_raw.json", encoding="utf-8"))[0].keys()) if False else None
already_ids_file = "_mega_numbered_candidates.json"

NUM_RE = re.compile(r'^\d+[.\-]\s*')

out = []
skipped_final = []
for n in notes:
    front_raw = n['front']
    back_raw = n['back']
    if 'Nazwij' in front_raw or re.match(r'^\s*\d+\s*[-–]', strip_html(IMG_TAG_RE.sub('', front_raw))):
        continue  # obsluzone juz przez parser legend

    m = IMG_TAG_RE.search(front_raw)
    img_file = m.group(1) if m else None
    front_text = strip_html(IMG_TAG_RE.sub('', front_raw)).strip()
    if not front_text or not front_text.endswith('?'):
        front_text = (front_text.rstrip('.') + '?') if front_text else "Co przedstawia preparat?"

    back_text = strip_html(back_raw)
    lines = [NUM_RE.sub('', l).strip(' :;') for l in back_text.split('\n') if l.strip()]
    if not lines:
        skipped_final.append(n)
        continue
    primary = '; '.join(lines)
    primary = primary[0].upper() + primary[1:]

    category = f"Egzamin praktyczny — {topic_from_deck(n['deck'])}"
    out.append({"q": front_text, "answers": [primary], "img": img_file, "category": category})

print("lista-typu pytan:", len(out))
print("nieobsluzone:", len(skipped_final))
for s in skipped_final:
    print(' nid', s['nid'], s['front'][:100])

json.dump(out, open("_mega_lists_raw.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
