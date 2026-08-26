import json, re, sqlite3
from pathlib import Path
import apkg_to_json as a

base = Path('Rok 3 2025-2026')
sadowa_dir = next(d for d in base.iterdir() if d.is_dir() and 'sekcyjna' in d.name)
apkg = next((sadowa_dir / 'Anki').iterdir())
tmp = Path('tmp_sadowa_parse.db')
a.extract_collection_db(apkg, tmp)
con = sqlite3.connect(tmp)
cur = con.cursor()
cur.execute('select id, mid, flds from notes')
rows = cur.fetchall()
con.close()
tmp.unlink()

OPTMARK = re.compile(r'^([a-zA-Z])\1*[.)]\s+(.*)$', re.S)
NUMLABEL = re.compile(r'^\d+\.\s*')
SIMPSON_CIT = re.compile(r'\(Simpson[^)]*\)')
TAG_RE = re.compile(r'Tag\.\s*Medycyna s[aą]dowa 3 rok\s*-?\s*WL\s*-?\s*(.+)$', re.S)


def clean_topic(t):
    if not t:
        return t
    t = re.sub(r'^[\s‐-―-]+', '', t)
    t = re.sub(r'\s+\d+\.?\s*$', '', t)
    return t.strip()


def norm(s):
    return re.sub(r'\s+', ' ', (s or '')).strip().lower()


def strip_marker(line):
    m = OPTMARK.match(line.strip())
    if m:
        return m.group(2).strip()
    return line.strip()


def has_marker(line):
    return bool(OPTMARK.match(line.strip()))


def li_blocks(html):
    return [a.strip_html(m) for m in re.findall(r'<li>(.*?)</li>', html, re.S)]


results = []
fail_match = []

for nid, mid, flds in rows:
    vals = flds.split('\x1f')
    front = vals[0] if len(vals) > 0 else ''
    back = vals[1] if len(vals) > 1 else ''

    if '<li>' in front:
        preamble_html = front.split('<li>', 1)[0]
        preamble = NUMLABEL.sub('', a.strip_html(preamble_html)).strip()
        opts = li_blocks(front)
        if preamble:
            stem = preamble
            options = opts
        else:
            stem = NUMLABEL.sub('', opts[0] if opts else '').strip()
            options = opts[1:]
        back_opts = li_blocks(back)
        correct_raw = back_opts[0] if back_opts else a.strip_html(back)
        topic = None
    else:
        lines = [a.strip_html(l).strip() for l in re.split(r'<br\s*/?>', front)]
        lines = [l for l in lines if l != '']
        opt_idx = next((i for i, l in enumerate(lines) if has_marker(l)), None)
        if opt_idx is None:
            # open Q&A, no options
            stem_raw = ' '.join(lines)
            stem_raw = SIMPSON_CIT.sub('', stem_raw)
            tagm = TAG_RE.search(stem_raw)
            topic = clean_topic(tagm.group(1)) if tagm else None
            if tagm:
                stem_raw = stem_raw[:tagm.start()]
            stem = NUMLABEL.sub('', stem_raw).strip()
            options = None
            correct_raw = a.strip_html(back)
        else:
            preamble_raw = ' '.join(lines[:opt_idx])
            preamble_raw = SIMPSON_CIT.sub('', preamble_raw)
            tagm = TAG_RE.search(preamble_raw)
            topic = clean_topic(tagm.group(1)) if tagm else None
            if tagm:
                preamble_raw = preamble_raw[:tagm.start()]
            stem = NUMLABEL.sub('', preamble_raw).strip()
            options = [strip_marker(l) for l in lines[opt_idx:]]
            back_line = a.strip_html(back)
            correct_raw = strip_marker(back_line) if has_marker(back_line) else back_line

    if options is None:
        results.append({
            'nid': nid, 'type': 'typed', 'stem': stem, 'answer': correct_raw.strip(), 'topic': topic,
        })
    else:
        correct_idx = None
        cn = norm(correct_raw)
        for i, o in enumerate(options):
            if norm(o) == cn:
                correct_idx = i
                break
        if correct_idx is None:
            for i, o in enumerate(options):
                if cn and (cn in norm(o) or norm(o) in cn):
                    correct_idx = i
                    break
        if correct_idx is None:
            fail_match.append({'nid': nid, 'stem': stem, 'options': options, 'correct_raw': correct_raw})
        results.append({
            'nid': nid, 'type': 'abcde', 'stem': stem, 'options': options,
            'correct_idx': correct_idx, 'correct_raw': correct_raw, 'topic': topic,
        })

print('total', len(results))
print('typed', sum(1 for r in results if r['type'] == 'typed'))
print('abcde', sum(1 for r in results if r['type'] == 'abcde'))
print('match failures', len(fail_match))

topics = {}
for r in results:
    t = r.get('topic')
    topics[t] = topics.get(t, 0) + 1

with open('preview_sadowa_topics.txt', 'w', encoding='utf-8') as f:
    for t, n in sorted(topics.items(), key=lambda x: (x[0] is None, x[0] or '')):
        f.write(f'{n}\t{t}\n')

with open('preview_sadowa_fail.txt', 'w', encoding='utf-8') as f:
    for fm in fail_match:
        f.write(f"STEM: {fm['stem']}\n")
        f.write(f"OPTIONS: {fm['options']}\n")
        f.write(f"CORRECT_RAW: {fm['correct_raw']}\n\n")

with open('sadowa_parsed.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
