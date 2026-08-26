# -*- coding: utf-8 -*-
import json, re, html

notes = json.load(open("_teams_notes_full.json", encoding="utf-8"))
by_nid = {n['nid']: n for n in notes}

IMG_TAG_RE = re.compile(r'<img[^>]*src="([^"]+)"[^>]*>')
TAG_RE = re.compile(r'<[^>]+>')
CATEGORY = "Egzamin praktyczny — Preparaty TEAMS"

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

def get_front(n):
    return n.get('front') or n.get('fronttext') or ''

def get_back(n):
    return n.get('back') or n.get('backtext') or ''

def cap(s):
    return s[0].upper() + s[1:] if s else s

MEGA_LEGEND_NIDS = {
    1768588819924, 1768588895814, 1768589030480, 1768589068053, 1768589126867,
    1768589238695, 1768589275160, 1768589429372, 1768589465073, 1768590292936,
    1768590359046, 1768647432480, 1768647887021, 1768647929973,
    1768589095822, 1768589163780, 1768589310864, 1768589506263, 1768647966440,
}
EXCLUDE_NIDS = {1780577241109, 1780578234064}
# manual overrides: nid -> list of {q, answers, rationale?} (img filled in automatically)
MANUAL_OVERRIDE = {
    1768648013045: [{"answers": ["Neutrofil"]}],
    1780577980326: [
        {"q": "Jaki narząd przedstawia preparat?", "answers": ["Migdałek podniebienny"]},
        {"q": "Co wskazuje strzałka na zdjęciu?", "answers": ["Nabłonek wielowarstwowy płaski nierogowaciejący"]},
    ],
    1780576855494: [{
        "q": "Jakie komórki (produkujące zębinę) znajdują się w zaznaczonym miejscu preparatu?",
        "answers": ["Odontoblasty"],
        "rationale": "Odontoblasty wyściełają ścianę komory zęba wypełnionej przez miazgę zęba.",
    }],
    1780576991338: [{
        "q": "Jaka struktura komórki mięśnia sercowego (widoczna na preparacie) uczestniczy w apoptozie?",
        "answers": ["Wstawka"],
        "rationale": "We wstawce (discus intercalatus) skupione są mitochondria.",
    }],
}

CELL_KEYWORDS = ["neutrofil", "eozynofil", "bazofil", "limfocyt", "monocyt", "erytrocyt",
                  "trombocyt", "płytk", "plazmocyt", "fibroblast", "fibrocyt", "adipocyt",
                  "mastocyt", "makrofag", "megakariocyt", "granulocyt", "leukocyt"]
TISSUE_KEYWORDS = ["nabłonek", "tkanka", "chrząstka", "kość", "kostna", "mięśn", "chrzęstna"]
PHASE_KEYWORDS = ["profaza", "metafaza", "anafaza", "telofaza", "interfaza"]

def guess_question_from_answer(primary_answer, is_sem2):
    low = primary_answer.lower()
    if any(k in low for k in PHASE_KEYWORDS):
        return "Jaka faza cyklu komórkowego jest widoczna na preparacie?"
    if any(k in low for k in CELL_KEYWORDS):
        return "Jaką komórkę przedstawia preparat?"
    if any(k in low for k in TISSUE_KEYWORDS):
        return "Jaką tkankę przedstawia preparat?"
    return "Co przedstawia preparat?" if is_sem2 else "Jaką tkankę przedstawia preparat?"

out = []

# ── 1. Proste notatki (obraz -> nazwa) ──
for n in notes:
    nid = n['nid']
    if nid in MEGA_LEGEND_NIDS or nid in EXCLUDE_NIDS:
        continue

    front_raw = get_front(n)
    back_raw = get_back(n)
    m = IMG_TAG_RE.search(front_raw)
    img_file = m.group(1) if m else None
    front_no_img = IMG_TAG_RE.sub('', front_raw)
    deck = n['deck']
    is_sem2 = '\x1f2 semestr' in deck

    if nid in MANUAL_OVERRIDE:
        for ov in MANUAL_OVERRIDE[nid]:
            item = {"q": ov.get("q") or ("Jaką komórkę przedstawia preparat?" if not is_sem2 else "Co przedstawia preparat?"),
                     "answers": ov["answers"], "img": img_file}
            if ov.get("rationale"):
                item["rationale"] = ov["rationale"]
            out.append(item)
        continue

    t = front_no_img.strip().lower()
    is_short_prompt = len(t.split()) <= 3
    if is_short_prompt and 'narząd' in t:
        q = "Jaki narząd przedstawia preparat?"
    elif is_short_prompt and 'tkank' in t:
        q = "Jaką tkankę przedstawia preparat?"
    elif is_short_prompt and 'komórk' in t:
        q = "Jaką komórkę przedstawia preparat?"
    elif is_short_prompt and 'struktur' in t:
        q = "Jaką strukturę histologiczną przedstawia preparat?"
    elif t:
        # front to pełne, dłuższe pytanie napisane przez studenta - zostaw jak jest (nie zgaduj po słowach kluczowych)
        cleaned = strip_html(front_no_img).strip(' ?')
        q = cap(cleaned) + "?" if cleaned else None
    else:
        q = None  # brak wskazówki z front - dobierzemy pytanie na podstawie treści odpowiedzi

    back_clean = strip_html(back_raw)
    back_clean = re.sub(r'\b(xd+|XD+)\b', '', back_clean, flags=re.IGNORECASE).strip()
    # drop bare uncertainty asides
    back_clean = re.sub(r',?\s*nie wiem jak[^,.-]*', '', back_clean, flags=re.IGNORECASE)
    back_clean = back_clean.replace('chyba ', '').strip()

    rationale = None
    # split off trailing parenthetical or " - " explanatory tail
    mm = re.match(r'^([^(]+?)\s*\(([^)]+)\)\s*$', back_clean)
    if mm:
        primary, rationale = mm.group(1).strip(), mm.group(2).strip()
    elif ' - ' in back_clean:
        primary, rationale = back_clean.split(' - ', 1)
        primary, rationale = primary.strip(), rationale.strip()
    else:
        primary = back_clean

    # dodatkowy split po przecinku, gdy dalsza część to opis/kontekst, nie część nazwy
    if rationale is None and ',' in primary:
        head, tail = primary.split(',', 1)
        if re.match(r'^\s*(widoczne|widać|barwienie|oprócz tego|poza tym)\b', tail, re.IGNORECASE):
            primary, rationale = head.strip(), tail.strip()

    primary = primary.strip(' ,')
    if not primary:
        continue
    primary = cap(primary)

    if q is None:
        q = guess_question_from_answer(primary, is_sem2)

    item = {"q": q, "answers": [primary], "img": img_file}
    if rationale:
        item["rationale"] = cap(rationale.strip(' ,'))
    out.append(item)

print("simple notes ->", len(out))

# ── 2. Rozbite legendy numerowane (elektronogramy/preparaty z wieloma strzałkami) ──
def split_note(nid, topic, items, q_template="Co wskazuje numer {n} na preparacie ({topic})?"):
    n = by_nid[nid]
    front_raw = get_front(n)
    m = IMG_TAG_RE.search(front_raw)
    img_file = m.group(1) if m else None
    added = 0
    for label, answer in items:
        out.append({
            "q": q_template.format(n=label, topic=topic),
            "answers": [answer] if isinstance(answer, str) else answer,
            "img": img_file,
        })
        added += 1
    return added

split_note(1768588819924, "kanalik plemnikotwórczy jądra", [
    ("1", "Spermatocyty I rzędu (w profazie)"),
    ("2", "Komórki Sertoliego"),
    ("3", "Spermatogonia"),
    ("4", "Tkanka łączna, błona podstawna nabłonka plemnikotwórczego, komórki mioidalne"),
    ("5", "Spermatydy (wczesne)"),
    ("6", "Komórki Leydiga"),
    ("7", "Światło kanalika krętego jądra"),
])

split_note(1768588895814, "fazy mitozy", [
    ("9.1", "Profaza"), ("9.2", "Interfaza"), ("9.3", "Metafaza"), ("9.4", "Metafaza"),
], q_template="Jaka faza cyklu komórkowego jest oznaczona numerem {n} na preparacie ({topic})?")

split_note(1768589030480, "fazy mitozy", [
    ("1.1", "Metafaza"), ("1.2", "Profaza"), ("1.3", "Anafaza"), ("1.4", "Telofaza"),
], q_template="Jaka faza mitozy jest oznaczona numerem {n} na preparacie ({topic})?")

split_note(1768589068053, "jądro komórkowe, elektronogram", [
    ("1", "Heterochromatyna"), ("2", "Euchromatyna"), ("3", "Jąderko"),
    ("4", "Szorstka siateczka śródplazmatyczna (RER)"), ("5", "Mitochondria"),
])

split_note(1768589126867, "lizosomy, elektronogram", [
    ("1", "Lizosom pierwotny"), ("2", "Lizosom wtórny"), ("3", "Mitochondrium"),
    ("4", "Szorstka siateczka śródplazmatyczna (RER) — widoczne rybosomy"),
])

split_note(1768589275160, "mitochondria i glikogen, elektronogram", [
    ("1", "Mitochondrium"), ("2", "Ziarna glikogenu"), ("3", "Szorstka siateczka śródplazmatyczna (RER)"),
])

split_note(1768589429372, "peroksysomy, elektronogram", [
    ("1", "Peroksysomy"), ("1a", "Rdzeń krystaliczny peroksysomu"),
    ("2", "Mitochondria"), ("3", "Szorstka siateczka śródplazmatyczna (RER)"),
])

split_note(1768589465073, "komórka wydzielnicza, elektronogram", [
    ("1", "Szorstka siateczka śródplazmatyczna (RER)"), ("2", "Aparat Golgiego"),
    ("3", "Jądro komórkowe"), ("4", "Mitochondrium"), ("5", "Błona komórkowa"),
])

split_note(1768590292936, "desmosom, elektronogram", [
    ("1", "Obwódka zamykająca"), ("2", "Obwódka zwierająca"), ("3", "Desmosom"),
    ("4", "Fragment mikrokosmka"), ("5", "Filamenty aktynowe"), ("6", "Siateczka graniczna"),
    ("7", "Płytka desmosomalna (desmoplakina, plakoglobina)"), ("8", "Filamenty pośrednie"),
    ("9", "Kadheryny łączące w desmosomie (desmokoliny i desmogleiny)"),
])

split_note(1768590359046, "nabłonek jelita, elektronogram", [
    ("1", "Rzęska"), ("2", "Mikrokosmki"), ("3", "Błona podstawna"),
    ("4", "Blaszka właściwa (tkanka łączna)"), ("5", "Aksonema"),
])

split_note(1768647432480, "triada w mięśniu szkieletowym, elektronogram", [
    ("1", "Ziarna glikogenu"), ("2", "Linia Z"), ("3", "Prążek H"), ("4", "Linia Z"),
    ("5", "Mitochondrium"), ("6", "Mitochondrium"), ("7", "Prążek I"), ("8", "Prążek A"),
    ("9", "Prążek I"), ("10", "Kanalik T"), ("11", "Triada"), ("12", "Mitochondrium"),
    ("13", "Triada"), ("14", "Gładka siateczka śródplazmatyczna (SER)"), ("15", "Triada"),
    ("16", "Cysterna końcowa"), ("17", "Kanalik T"), ("18", "Cysterna końcowa"),
    ("19", "Ziarna glikogenu"), ("20", "Triada"), ("21", "Gładka siateczka śródplazmatyczna (SER)"),
    ("22", "Szorstka siateczka śródplazmatyczna (RER)"), ("23", "Linia M"),
    ("24", "Mitochondrium"), ("25", "Prążek H"),
])

split_note(1768647887021, "preparat krwi", [
    ("1", "Neutrofil"), ("2", "Monocyt"), ("3", "Monocyt"),
], q_template="Co przedstawia komórka wskazana strzałką nr {n} na preparacie?")

split_note(1768589095822, "RER, elektronogram", [
    ("1", "Światło RER"), ("2", "Cytoplazma wokół RER"),
])

split_note(1768589163780, "RER/mitochondrium/lizosom, elektronogram", [
    ("1", "Szorstka siateczka śródplazmatyczna (RER)"), ("2", "Mitochondrium"), ("3", "Lizosom wtórny"),
])

split_note(1768589310864, "lizosom wtórny, elektronogram", [
    ("1", "Lizosom wtórny"), ("1a", "Enzymy trawienne"), ("1b", "Trawiona zawartość (np. bakteria)"),
])

split_note(1768589506263, "chrząstka szklista", [
    ("1", "Ochrzęstna"), ("2", "Tkanka chrzęstna szklista"),
])

split_note(1768647966440, "preparat krwi", [
    ("1", "Monocyt"), ("2", "Limfocyt"),
], q_template="Co przedstawia komórka wskazana strzałką nr {n} na preparacie?")

split_note(1768647929973, "preparat krwi", [
    ("1", "Eozynofil"), ("2", "Neutrofil"), ("3", "Neutrofil"),
], q_template="Co przedstawia komórka wskazana strzałką nr {n} na preparacie?")

# ── 3. Elektronogram komórki wydzielniczej - niepewne numery -> jedna zbiorcza karta ──
n = by_nid[1768589238695]
img_file = IMG_TAG_RE.search(get_front(n)).group(1)
out.append({
    "q": "Jakie struktury rozpoznajesz na elektronogramie tej komórki wydzielniczej (RER, ziarnistości wydzielnicze, pęcherzyki transportujące, polisomy cytozolowe, błona komórkowa, mitochondrium)?",
    "answers": ["RER, ziarnistości wydzielnicze, pęcherzyki transportujące, polisomy cytozolowe, błona komórkowa, mitochondrium"],
    "rationale": "Szorstka siateczka śródplazmatyczna (RER) produkuje białka, które są pakowane w ziarnistości wydzielnicze i transportowane pęcherzykami transportującymi do błony komórkowej (egzocytoza). Polisomy cytozolowe to wolne rybosomy w cytoplazmie, mitochondria dostarczają energii dla tego procesu.",
    "img": img_file,
})

print("total after split-legend ->", len(out))

for item in out:
    item["category"] = CATEGORY
    item.setdefault("mode", "typed")

json.dump(out, open("histologia_teams_raw.json", "w", encoding="utf-8"), ensure_ascii=False)
print("zapisano histologia_teams_raw.json:", len(out), "pytan")
