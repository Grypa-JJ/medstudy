import json, re

data = json.load(open('sadowa_parsed.json', encoding='utf-8'))

TOPIC_FIX = {
    'Traumatologia': 'Traumatologia ogólna',
    'Traumatologia: Tanatologia': 'Tanatologia',
    'postrzały i wybuchy': 'Traumatologia: postrzały i wybuchy',
}


def fix_topic(t):
    if not t:
        return t
    t = re.sub(r'\s*\(teoretycznie antropologia.*$', '', t).strip()
    return TOPIC_FIX.get(t, t)


# Manual category assignment for the 64 items with no Tag metadata
# (58 HTML-list-based cards + 6 tagless plain cards), in the order they
# appear in sadowa_parsed.json (same order as the source Anki deck).
NOTOPIC_CATEGORIES = [
    "Toksykologia", "Toksykologia", "Toksykologia", "Toksykologia", "Toksykologia",
    "Toksykologia", "Toksykologia", "Toksykologia", "Toksykologia", "Toksykologia",
    "Toksykologia",
    "Traumatologia: urazy inne",
    "Traumatologia: postrzały i wybuchy", "Traumatologia: postrzały i wybuchy",
    "Traumatologia: postrzały i wybuchy",
    "Toksykologia",
    "Traumatologia ogólna",
    "Traumatologia: postrzały i wybuchy",
    "Traumatologia: uraz mechaniczny",
    "Tanatologia",
    "Toksykologia",
    "Traumatologia: przemoc",
    "Tanatologia",
    "Traumatologia: postrzały i wybuchy",
    "Toksykologia",
    "Tanatologia", "Tanatologia", "Tanatologia", "Tanatologia",
    "Traumatologia: uraz mechaniczny",
    "Tanatologia", "Tanatologia", "Tanatologia",
    "Traumatologia: uraz mechaniczny",
    "Traumatologia ogólna",
    "Toksykologia",
    "Tanatologia", "Tanatologia",
    "Genetyka",
    "Toksykologia",
    "Genetyka",
    "Tanatologia", "Tanatologia",
    "Toksykologia",
    "Traumatologia: uraz mechaniczny",
    "Tanatologia", "Tanatologia", "Tanatologia", "Tanatologia", "Tanatologia",
    "Tanatologia", "Tanatologia", "Tanatologia", "Tanatologia",
    "Traumatologia: uraz mechaniczny",
    "Tanatologia",
    "Traumatologia: uduszenia",
    "Traumatologia: postrzały i wybuchy",
    "Toksykologia",
    "Traumatologia: uduszenia",
    "Traumatologia: urazy inne",
    "Traumatologia: przemoc",
    "Genetyka",
    "Toksykologia",
]

notopic_i = 0
out = []
for r in data:
    topic = fix_topic(r.get('topic'))
    if not topic:
        topic = NOTOPIC_CATEGORIES[notopic_i]
        notopic_i += 1

    if r['type'] == 'typed':
        out.append({
            "category": topic,
            "mode": "typed",
            "q": r['stem'],
            "answers": [r['answer']],
        })
    else:
        options = r['options']
        idx = r['correct_idx']
        out.append({
            "category": topic,
            "q": r['stem'],
            "o": options,
            "a": idx,
        })

assert notopic_i == len(NOTOPIC_CATEGORIES), f"{notopic_i} vs {len(NOTOPIC_CATEGORIES)}"
assert len(out) == 281

with open('medycyna_sadowa_raw.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

by_cat = {}
for o in out:
    by_cat[o['category']] = by_cat.get(o['category'], 0) + 1
with open('preview_sadowa_final_categories.txt', 'w', encoding='utf-8') as f:
    for c, n in sorted(by_cat.items()):
        f.write(f"{n}\t{c}\n")
