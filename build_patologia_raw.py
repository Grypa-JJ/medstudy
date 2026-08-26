import json, re

data = json.load(open('patologia_anki_raw.json', encoding='utf-8'))
assert len(data) == 68

ranges = [
    (0, 5,  "Jelito grube — uchyłkowatość esicy"),
    (5, 24, "Jelito grube — nieswoiste choroby zapalne jelit (NChZJ)"),
    (24, 56, "Jelito grube — polipy i zespoły polipowatości dziedzicznej"),
    (56, 64, "Jelito grube — gruczolakorak"),
    (64, 68, "Wyrostek robaczkowy"),
]

def clean(s):
    s = s.strip()
    s = re.sub(r'^-\s*', '', s)
    return s

out = []
for start, end, cat in ranges:
    for item in data[start:end]:
        q = clean(item['front'])
        a = clean(item['back'])
        out.append({
            "category": cat,
            "mode": "typed",
            "q": q,
            "answers": [a],
        })

assert len(out) == 68
with open('patologia_raw.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

by_cat = {}
for o in out:
    by_cat[o['category']] = by_cat.get(o['category'], 0) + 1
with open('preview_patologia_categories.txt', 'w', encoding='utf-8') as f:
    for c, n in by_cat.items():
        f.write(f"{n} {c}\n")
