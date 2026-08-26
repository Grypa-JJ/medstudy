# -*- coding: utf-8 -*-
import json, re, html

notes = json.load(open("_sem2_notes_full.json", encoding="utf-8"))
CATEGORY = "Egzamin praktyczny — Semestr II (barwienia i preparaty)"

IMG_TAG_RE = re.compile(r'<img[^>]*src="([^"]+)"[^>]*>')
NUM_LINE_RE = re.compile(r'^(\d+)[.\-]\s*(.+)$')

def strip_html(s):
    if not s:
        return ""
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.IGNORECASE)
    s = re.sub(r'</div>', '\n', s, flags=re.IGNORECASE)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s)
    s = s.replace('\xa0', ' ')
    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r'\n\s*\n+', '\n', s)
    return s.strip()

def cap(s):
    return s[0].upper() + s[1:] if s else s

out = []

# ── 1. "egzamin praktyczny" (230, model quizlet -> odpowiedz w polu "image") ──
prakt = [n for n in notes if n['deck'].endswith('egzamin praktyczny')]
skipped = []
for n in prakt:
    front_raw = n.get('fronttext', '')
    m = IMG_TAG_RE.search(front_raw)
    img_file = m.group(1) if m else None
    answer_field = strip_html(n.get('image', ''))
    if not answer_field:
        skipped.append(n)
        continue

    lines = [l.strip() for l in answer_field.split('\n') if l.strip()]
    numbered = {}
    plain_lines = []
    for l in lines:
        mm = NUM_LINE_RE.match(l)
        if mm:
            numbered[mm.group(1)] = mm.group(2).strip()
        else:
            plain_lines.append(l)

    label = plain_lines[0] if plain_lines else None
    extra = plain_lines[1:] if len(plain_lines) > 1 else []

    if label:
        out.append({
            "q": "Co przedstawia preparat?",
            "answers": [cap(label)],
            "img": img_file,
            "category": CATEGORY,
            **({"rationale": cap('; '.join(extra))} if extra and not numbered else {}),
        })
    if numbered:
        topic_ctx = f" ({label})" if label else ""
        for num, ans in numbered.items():
            out.append({
                "q": f"Co oznaczono jako nr {num}{topic_ctx}?",
                "answers": [cap(ans)],
                "img": img_file,
                "category": CATEGORY,
            })

print("egzamin praktyczny ->", len(out), "| pominiete (brak tresci):", len(skipped))

# ── 2. "egzamin praktycznybarwienie" (9, barwienia histologiczne) ──
barw = [n for n in notes if n['deck'].endswith('barwienie')]
for n in barw:
    m = IMG_TAG_RE.search(n.get('front', ''))
    img_file = m.group(1) if m else None
    back_text = strip_html(n.get('back', ''))
    lines = [l.strip(' -') for l in back_text.split('\n') if l.strip(' -')]
    if not lines:
        continue
    label = lines[0]
    rest = lines[1:]
    out.append({
        "q": "Jaką metodą barwienia wykonano ten preparat?",
        "answers": [cap(label)],
        "img": img_file,
        "category": CATEGORY,
        **({"rationale": cap('; '.join(rest))} if rest else {}),
    })

print("total ->", len(out))
json.dump(out, open("_sem2_praktyczny_raw.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
