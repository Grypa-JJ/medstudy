# -*- coding: utf-8 -*-
import json, re, html

notes = json.load(open("_probne_notes_full.json", encoding="utf-8"))
by_nid = {n['nid']: n for n in notes}
CATEGORY = "Egzamin praktyczny — Próbne egzaminy (autorskie)"

IMG_TAG_RE = re.compile(r'<img[^>]*src="([^"]+)"[^>]*>')
TAG_RE = re.compile(r'<[^>]+>')

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
    return n.get('przód') or n.get('front') or ''

def get_back(n):
    return n.get('tył') or n.get('back') or ''

def cap(s):
    return s[0].upper() + s[1:] if s else s

def img_of(nid):
    m = IMG_TAG_RE.search(get_front(by_nid[nid]))
    return m.group(1) if m else None

out = []

# ── 1. Ręcznie: karty z kolorowym markupem (VI Bonus) ──
out += [
    {"q": "Co to za narząd (węzeł chłonny)?", "answers": ["Węzeł chłonny"], "img": img_of(1779892668631)},
    {"q": "Wskaż numer/y na preparacie węzła chłonnego, w których można znaleźć limfę.",
     "answers": ["1 i 2"],
     "rationale": "1 - zatoka podtorebkowa, 2 - zatoka rdzenna. Dodatkowo na preparacie: 3 - żyłka o wysokim śródbłonku, 4 - centrum rozmnażania grudki chłonnej wtórnej.",
     "img": img_of(1779892668631)},

    {"q": "Pogrupuj numery na preparacie tchawicy względem wspólnego pochodzenia z listków zarodkowych.",
     "answers": ["Endoderma: 4; listek trzewny mezodermy bocznej: 1, 2, 3, 5"],
     "rationale": "1 - mięsień tchawiczy, 2 - chrząstka szklista, 3 - blaszka właściwa błony śluzowej, 4 - nabłonek wielorzędowy walcowaty urzęsiony dróg oddechowych, 5 - błona podśluzowa.",
     "img": img_of(1779895278084)},
    {"q": "Wymień 2 inne miejsca występowania dokładnie takiej samej tkanki, jak ta oznaczona numerem 4 na preparacie tchawicy (nabłonek wielorzędowy walcowaty urzęsiony).",
     "answers": ["Część oddechowa jamy nosowej i fałdy przedsionkowe krtani"],
     "img": img_of(1779895278084)},

    {"q": "Wskaż numer/y na preparacie nerki modyfikujące skład moczu pierwotnego.",
     "answers": ["2 i 3"],
     "rationale": "2 - kanalik proksymalny, 3 - kanalik dystalny. Legenda: 1 - przestrzeń moczowa, 4 - plamka gęsta, 5 - kłębuszek nerkowy.",
     "img": img_of(1779896908588)},
    {"q": "Wskaż miejsce występowania i nazwę komórek fagocytujących kompleksy antygen-przeciwciało w kłębuszku nerkowym.",
     "answers": ["Komórki mezangialne"],
     "rationale": "Numer 5 na preparacie - kłębuszek nerkowy, w którym znajdują się komórki mezangialne.",
     "img": img_of(1779896908588)},

    {"q": "Którym numerem oznaczono błonę Bowmana na preparacie rogówki?", "answers": ["2"],
     "rationale": "1 - nabłonek przedni rogówki, 3 - zrąb rogówki, 4 - nabłonek tylny rogówki.",
     "img": img_of(1779897998245)},

    {"q": "Jaką komórkę oznaczono numerem 3 na preparacie płuca?", "answers": ["Pneumocyt typu I"],
     "img": img_of(1780423078191)},
    {"q": "Jaka jest najliczniejsza stała komórka budująca nabłonek pęcherzykowy płuc?",
     "answers": ["Pneumocyt typu II"],
     "rationale": "Pneumocyt typu II (numer 2 na preparacie) jest najliczniejszą stałą komórką nabłonka pęcherzykowego, mimo że pneumocyty typu I (numer 3) pokrywają większą powierzchnię pęcherzyków. Legenda: 1 - komórka śródbłonka naczyń, 4 - erytrocyt.",
     "img": img_of(1780423078191)},
]

# ── 2. Ręcznie: karty z listą numerowaną w odpowiedzi (rozbite na pytania per numer) ──
def split(nid, items, q_template):
    img = img_of(nid)
    for label, answer in items:
        out.append({"q": q_template.format(n=label), "answers": [answer] if isinstance(answer, str) else answer, "img": img})

split(1779908889928, [("5", "Wczesna spermatyda"), ("6", "Późna spermatyda"), ("7", "Spermatocyt I rzędu")],
      "Jaka komórka przedziału adluminalnego jest oznaczona numerem {n}?")

split(1779909957925, [("1", "Pneumocyt I rzędu"), ("2", "Chondrocyt"), ("3", "Pneumocyt II rzędu"), ("4", "Miocyt gładki")],
      "Jak nazywa się komórka oznaczona numerem {n}?")

split(1779963761135, [("1", "Syncytiotrofoblast"), ("2", "Mezenchyma pozazarodkowa"), ("3", "Komórka cytotrofoblastu")],
      "Jak nazywa się struktura oznaczona numerem {n}?")

split(1779966660125, [("1", "Metafaza"), ("2", "Metafaza"), ("3", "Anafaza"), ("4", "Telofaza"), ("5", "Interfaza")],
      "W jakiej fazie cyklu komórkowego/mitozy jest komórka oznaczona numerem {n}?")

split(1779987442473, [("1", "Metafaza"), ("2", "Profaza"), ("3", "Interfaza")],
      "W jakiej fazie cyklu komórkowego jest komórka oznaczona numerem {n}?")

split(1779999958389, [("1", "Żyła wrotna międzypłacikowa"), ("2", "Przewód żółciowy międzypłacikowy"), ("3", "Tętnica wrotna międzypłacikowa")],
      "Jak nazywa się struktura oznaczona numerem {n} w przestrzeni wrotnej wątroby?")

split(1779999096373, [("1", "Żyła środkowa"), ("2", "Naczynia włosowate typu zatokowego (sinusoidy)")],
      "Jak nazywa się struktura oznaczona numerem {n} na preparacie wątroby?")

_img_zwoj = img_of(1779959885553)
out.append({"q": "Co to za struktura?", "answers": ["Zwój nerwowy autonomiczny"], "img": _img_zwoj})
out.append({"q": "Jak nazywa się komórka oznaczona numerem 1 (zwój nerwowy)?", "answers": ["Neuron wielobiegunowy"], "img": _img_zwoj})
out.append({"q": "Jak nazywa się komórka oznaczona numerem 2 (zwój nerwowy)?", "answers": ["Komórki satelitarne zwojów (amficyty)"], "img": _img_zwoj})

split(1779963002023, [("3", "Komórka okładzinowa (wydziela HCl)"), ("4", "Komórka główna (wydziela pepsynogen)")],
      "Która komórka (numer {n}) uczestniczy w trawieniu białek?")

SPECIAL_NIDS = {1779892668631, 1779895278084, 1779896908588, 1779897998245, 1780423078191,
                 1779908889928, 1779909957925, 1779963761135, 1779966660125, 1779987442473,
                 1779999958389, 1779999096373, 1779959885553, 1779963002023}

print("po krokach 1-2 ->", len(out))

# ── 3. Proste notatki (front=pytanie, back=odpowiedź) ──
skipped_no_content = []
for n in notes:
    if n['nid'] in SPECIAL_NIDS:
        continue
    front_raw = get_front(n)
    back_raw = get_back(n)
    m = IMG_TAG_RE.search(front_raw)
    img_file = m.group(1) if m else None
    front_no_img = IMG_TAG_RE.sub('', front_raw)
    q = strip_html(front_no_img).strip(' ?')
    if not q:
        skipped_no_content.append(n['nid'])
        continue
    q = cap(q) + "?"

    back_clean = strip_html(back_raw)
    if not back_clean:
        skipped_no_content.append(n['nid'])
        continue
    back_clean = cap(back_clean)

    out.append({"q": q, "answers": [back_clean], "img": img_file})

print("po prostych notatkach ->", len(out))
print("pominięte (brak treści):", skipped_no_content)

for item in out:
    item["subject"] = "histologia"
    item["category"] = CATEGORY
    item["mode"] = "typed"

json.dump(out, open("histologia_probne_raw.json", "w", encoding="utf-8"), ensure_ascii=False)
print("zapisano histologia_probne_raw.json:", len(out), "pytan")
