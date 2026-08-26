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
    if 'achromatyzm' in deck.lower() or 'skibidi' in deck.lower():
        return "02. Cytoplazma (elektronogramy)"
    return "Preparaty (mega, nieprzypisane)"

NUM_LINE_RE = re.compile(r'^(\d+)\s*[-–]\s*(.+)$')
LETTER_LINE_RE = re.compile(r'^([A-Z])\.\s*(.+)$')

def parse_legend(text):
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    numbered = {}
    lettered = {}
    label_lines = []
    for line in lines:
        m = NUM_LINE_RE.match(line)
        if m:
            numbered[m.group(1)] = m.group(2).strip()
            continue
        m = LETTER_LINE_RE.match(line)
        if m:
            lettered[m.group(1)] = m.group(2).strip()
            continue
        if not numbered:  # tekst przed pierwszym "N-" to ogolna etykieta calego zdjecia
            label_lines.append(line)
    label = ' '.join(label_lines).strip(' :;-')
    return numbered, lettered, label

out = []
skipped = []

for n in notes:
    front_raw = n['front']
    back_raw = n['back']
    m = IMG_TAG_RE.search(front_raw)
    img_file = m.group(1) if m else None
    front_text = strip_html(IMG_TAG_RE.sub('', front_raw))
    back_text = strip_html(back_raw)

    front_numbered, front_lettered, _ = parse_legend(front_text)
    back_numbered, back_lettered, back_label = parse_legend(back_text)

    if not back_numbered:
        skipped.append(n)
        continue

    topic = topic_from_deck(n['deck'])
    category = f"Egzamin praktyczny — {topic}"

    added_here = 0
    if back_label:
        out.append({"q": "Co przedstawia elektronogram/preparat?", "answers": [back_label[0].upper()+back_label[1:]],
                     "img": img_file, "category": category})
        added_here += 1

    for num, ans in back_numbered.items():
        q = f"Co oznaczono jako nr {num}" + (f" (na obrazie: {back_label})?" if back_label else "?")
        out.append({"q": q, "answers": [ans[0].upper()+ans[1:]], "img": img_file, "category": category})
        added_here += 1

    for letter, subq in front_lettered.items():
        suba = back_lettered.get(letter)
        if not suba:
            continue
        q = subq if subq.endswith('?') else subq + '?'
        out.append({"q": q, "answers": [suba[0].upper()+suba[1:]], "img": img_file, "category": category})
        added_here += 1

    if added_here == 0:
        skipped.append(n)

print("wygenerowano pytan:", len(out))
print("pominiete notatki (nie dopasowano wzorca):", len(skipped))
for s in skipped:
    print(" nid", s['nid'], '| front:', s['front'][:100])

json.dump(out, open("_mega_numbered_raw.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
