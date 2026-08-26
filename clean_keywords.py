# -*- coding: utf-8 -*-
import re, os, json

indir = r'C:\Users\Jakub\AppData\Local\Temp\claude\C--Users-Jakub-Desktop-Prod-projekt-w-budowie\5b271756-3497-41b2-84e6-8e1d1037c3aa\scratchpad\junqueira_chapters'

def clean_chapter(i):
    fname = os.path.join(indir, f'R_{i:02d}.txt')
    with open(fname, encoding='utf-8') as f:
        text = f.read()
    idx = text.find('SŁOWA KLUCZOWE')
    kwtext = text.split('=== SŁOWA KLUCZOWE')[-1]
    kwtext = kwtext.split('===')[-1].strip()
    raw_kws = [k.strip() for k in kwtext.split(',') if k.strip()]
    # rejoin hyphenated line-wraps: if a token ends with '-', join with next token (no space, drop hyphen)
    joined = []
    buf = ''
    for tok in raw_kws:
        if buf:
            tok = buf + tok
            buf = ''
        if tok.endswith('-') and not tok.endswith('--'):
            buf = tok[:-1]
            continue
        joined.append(tok)
    if buf:
        joined.append(buf)
    # dedupe case-insensitively, preserve first-seen casing
    seen = {}
    for tok in joined:
        key = tok.lower()
        if key not in seen and len(tok) > 1:
            seen[key] = tok
    return list(seen.values())

all_out = {}
for i in range(1, 24):
    kws = clean_chapter(i)
    all_out[f'R_{i:02d}'] = kws
    print(f'R_{i:02d}: {len(kws)} unique cleaned keywords')

with open(os.path.join(indir, 'keywords_cleaned.json'), 'w', encoding='utf-8') as f:
    json.dump(all_out, f, ensure_ascii=False, indent=2)
print('saved keywords_cleaned.json')
