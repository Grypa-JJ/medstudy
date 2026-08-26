# -*- coding: utf-8 -*-
import fitz, os, re, json

doc = fitz.open(r'histologia\Histologia🔬\Podręczniki\Histologia Junqueira 2020.pdf')
starts = [19,38,78,97,123,149,157,166,190,223,247,271,289,303,332,369,391,415,438,460,487,509,540]
ends = starts[1:] + [577]
outdir = r'C:\Users\Jakub\AppData\Local\Temp\claude\C--Users-Jakub-Desktop-Prod-projekt-w-budowie\5b271756-3497-41b2-84e6-8e1d1037c3aa\scratchpad\junqueira_chapters'

TRUE_KEYWORD_COLOR = 29372  # (0,114,188) - actual blue vocabulary terms only, not section headers (27025)

all_kw = {}
for i, (s, e) in enumerate(zip(starts, ends), start=1):
    raw_tokens = []
    for pno in range(s-1, e-1):
        if pno >= len(doc):
            break
        d = doc[pno].get_text('dict')
        for block in d['blocks']:
            for line in block.get('lines', []):
                for span in line.get('spans', []):
                    if span['color'] == TRUE_KEYWORD_COLOR and span['text'].strip():
                        raw_tokens.append(span['text'].strip())
    # rejoin hyphenated line-wraps
    joined = []
    buf = ''
    for tok in raw_tokens:
        if buf:
            tok = buf + tok
            buf = ''
        if tok.endswith('-') and not tok.endswith('--'):
            buf = tok[:-1]
            continue
        joined.append(tok)
    if buf:
        joined.append(buf)
    # filter pure numbers / page-number junk, and dedupe case-insensitively
    seen = {}
    for tok in joined:
        if re.fullmatch(r'[\d\s\.\,\-]+', tok):
            continue
        if len(tok) < 3:
            continue
        key = tok.lower()
        if key not in seen:
            seen[key] = tok
    all_kw[f'R_{i:02d}'] = list(seen.values())
    print(f'R_{i:02d}: {len(seen)} true blue keywords')

with open(os.path.join(outdir, 'keywords_true_blue.json'), 'w', encoding='utf-8') as f:
    json.dump(all_kw, f, ensure_ascii=False, indent=2)
print('saved keywords_true_blue.json')
