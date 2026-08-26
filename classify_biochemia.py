import json, re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

d = json.load(open('C:/Users/Jakub/AppData/Local/Temp/claude/C--Users-Jakub-Desktop-Prod-projekt-w-budowie/5b271756-3497-41b2-84e6-8e1d1037c3aa/scratchpad/questions_dump.json', encoding='utf-8'))

# (category, [(pattern, weight), ...]) - weight higher = more specific/decisive signal
RULES = [
    ("Giełda — Onkogeneza i choroby neurodegeneracyjne (sesje egzaminacyjne)", [
        (r'nowotw', 2), (r'onkogen', 3), (r'supresorow', 3), (r'Alzheimer', 3), (r'Parkinson', 3),
        (r'amyloid', 3), (r'prion', 3), (r'\bPrP', 3), (r'apoptoz', 2), (r'autofagi', 3), (r'nekroz', 2),
        (r'Li-Fraumeni', 3), (r'BRCA', 3), (r'\bTP53\b', 3), (r'\bRAS\b', 2), (r'\bMYC\b', 2),
        (r'\bRB1\b', 3), (r'\bAPC\b', 2), (r'HER2', 3), (r'chromotrypsi', 3), (r'angiogenez', 2),
        (r'metastaz', 3), (r'przerzut', 2), (r'karcynogenez', 3), (r'kancerogenez', 3), (r'mutator', 2),
        (r'Knudson', 3), (r'two.hit', 3), (r'trisom', 2), (r'\btau\b', 2), (r'synuklein', 3),
        (r'\bCJD\b', 3), (r'Creutzfeldt', 3), (r'neurodegeneracyj', 3), (r'TDP-43', 3),
        (r'\bALS\b', 2), (r'chorob[a-z]* nowotworow', 3), (r'\bAPP\b', 2), (r'sekretaz', 2),
        (r'gen[a-z]* mutatorow', 2), (r'protoonkogen', 3), (r'lamin[a-z]* i laminopati', 3),
        (r'progeryn', 3), (r'progeri', 3),
    ]),
    ("Giełda — Sygnalizacja hormonalna (sesje egzaminacyjne)", [
        (r'\breceptor\w*\b', 1), (r'\bhormon\w*\b', 1), (r'\bcAMP\b', 2), (r'\bcGMP\b', 2),
        (r'kaskad[a-z]* sygnał', 3), (r'przekaźnik[a-z]* (I|drugi|wtórn)', 2), (r'kalmodulin', 3),
        (r'białk[ao] G\b', 3), (r'\bGPCR\b', 3), (r'kinaz[ay]* białkow[a-z]* [AC]\b', 2), (r'\bPKA\b', 2),
        (r'\bPKC\b', 2), (r'insulinow', 1), (r'\binsuliny\b', 1), (r'adrenalin', 1), (r'noradrenalin', 1),
        (r'kortyzol', 2), (r'hormon[a-z]* steroidow', 3), (r'tarczyc', 1), (r'estrogen', 1),
        (r'testosteron', 1), (r'progesteron', 1), (r'JAK-STAT', 3), (r'\bIP3\b', 2), (r'\bDAG\b', 1),
        (r'fosfolipaz[ay]* C\b', 2), (r'toksyn[a-z]* cholery', 3), (r'toksyn[a-z]* krztuśca', 3),
        (r'\bmTOR\b', 2), (r'insulinopodobn', 2), (r'przekaźnictw[a-z]* (parakrynn|jukstakrynn|autokrynn)', 3),
        (r'oś podwzgórze', 3), (r'gruczoł[a-z]* dokrewn', 2), (r'wtórny przekaźnik', 2),
    ]),
    ("Giełda — Metabolizm ksenobiotyków (sesje egzaminacyjne)", [
        (r'cytochrom[a-z]* P450', 3), (r'\bCYP\d', 3), (r'biotransformacj', 3), (r'ksenobiotyk', 3),
        (r'detoksykacj', 2), (r'\bglutation\w*\b', 2), (r'wolny[a-z]* rodnik', 2), (r'rodnika', 1),
        (r'antyoksydant', 2), (r'\bSOD\b', 2), (r'dysmutaz[ay]* ponadtlenkow', 3), (r'peroksydaz[ay]* glutationow', 3),
        (r'faz[ay]* I i II (biotransformacj|metabolizm)', 3), (r'kwas[a-z]* merkapturow', 3),
        (r'reakcj[a-z]* Fentona', 3), (r'stres oksydacyjn', 2), (r'peroksydacj[a-z]* lipid', 3),
        (r'rodnik[a-z]* lipidow', 3), (r'\bLOO', 2), (r'\bMDA\b', 2), (r'malonylodialdehyd', 3),
        (r'katalaz[ay]*\b', 2), (r'mieloperoksydaz', 2), (r'\bNADPH-oksydaz', 2),
    ]),
    ("Giełda — Metabolizm nukleotydów (sesje egzaminacyjne)", [
        (r'purynow', 2), (r'pirymidynow', 2), (r'\bIMP\b', 2), (r'\bGMP\b', 2), (r'\bAMP\b(?!K)', 1),
        (r'kwas[a-z]* moczow', 2), (r'dn[a-z]* moczanow', 3), (r'\bPRPP\b', 3), (r'Lescha-Nyhana', 3),
        (r'von Gierke', 2), (r'orotacydur', 3), (r'hipoksantyn', 2), (r'ksantyn', 2),
        (r'oksydaz[a-z]* ksantynow', 3), (r'reduktaz[a-z]* rybonukleotydow', 3), (r'\bnukleotyd\w*\b', 1),
        (r'syntez[a-z]* de novo purynow', 3), (r'katabolizm[a-z]* purynow', 3), (r'\bATCase\b', 2),
        (r'\bHGPRT\b', 3), (r'adenozyn[a-z]*.{0,20}deaminaz', 3), (r'\bADA\b.{0,10}(niedob|SCID)', 3),
        (r'\bSCID\b', 2),
    ]),
    ("Giełda — Biochemia kliniczna i metabolizm hemu (sesje egzaminacyjne)", [
        (r'\bhem[u]?\b', 2), (r'\bhemem\b', 2), (r'bilirubin', 3), (r'żółtaczk', 3), (r'porfiri', 3),
        (r'\bżelaz\w*\b', 1), (r'transferyn', 2), (r'ferrytyn', 3), (r'ferrochelataz', 3),
        (r'medycyn[a-z]* sądow', 3), (r'próg[a-z]* nerkow', 2), (r'badani[a-z]* moczu', 2),
        (r'\bosocz\w*\b', 1), (r'\bsurowic\w*\b', 1), (r'marker[a-z]* diagnostyczn', 2),
        (r'norm[a-z]* laboratoryjn', 2), (r'kernicterus', 3), (r'metod[a-z]* fenoloftaleinow', 3),
        (r'wykryw[a-z]* materiał[a-z]* biologiczn', 3), (r'amylaz[a-z]*.{0,20}skrobi', 3),
        (r'ślinę?\b.{0,20}(wykry|test)', 2), (r'nasieni', 2), (r'krew.{0,20}(wykry|test)', 1),
    ]),
    ("Giełda — Utlenianie biologiczne (sesje egzaminacyjne)", [
        (r'łańcuch[a-z]* oddechow', 3), (r'fosforylacj[a-z]* oksydacyjn', 3), (r'kompleks[a-z]* [IVX]+\b', 2),
        (r'cykl[a-z]* Krebsa', 2), (r'\bNADH\b', 1), (r'\bFADH', 1), (r'\bATP\b', 1), (r'\bPDH\b', 2),
        (r'dehydrogenaz[a-z]* pirogronianow', 2), (r'dehydrogenaz[a-z]* bursztynianow', 2), (r'\bSDH\b', 2),
        (r'rozprzęgacz', 3), (r'chemiosmotyczn', 3), (r'syntaz[a-z]* ATP', 2), (r'mitochondri', 1),
        (r'oksydacyjn[a-z]* dekarboksylacj', 2), (r'cytochrom[a-z]* c\b', 2), (r'wiązani[a-z]* wysokoenergetyczn', 2),
    ]),
    ("Giełda — Lipidy (sesje egzaminacyjne)", [
        (r'kwas[a-zó]*[a-z]* tłuszczow', 2), (r'beta.oksydacj', 2), (r'\bcholesterol\w*\b', 1),
        (r'lipoprotein', 2), (r'\bLDL\b', 2), (r'\bHDL\b', 2), (r'\bVLDL\b', 2), (r'chylomikron', 3),
        (r'ketogenez', 2), (r'ciał[a-z]* keton', 2), (r'eikozanoid', 2), (r'prostaglandyn', 2),
        (r'\bfosfolipid', 2), (r'sfingolipid', 2), (r'sfingomielin', 2), (r'\bkarnityn', 2),
        (r'triacyloglicerol', 2), (r'triglicery', 2), (r'kwas[a-zó]* żółciow', 2), (r'apolipoprotein', 2),
        (r'\blipaz', 2), (r'komórk[a-z]* piankowat', 3), (r'miażdżyc', 2), (r'kwas[a-z]* arachidonow', 2),
        (r'palmitynian', 2), (r'skwalen', 2), (r'kardiolipin', 2),
    ]),
    ("Giełda — Węglowodany (sesje egzaminacyjne)", [
        (r'glikoliz', 2), (r'glukoneogenez', 2), (r'\bglikogen', 2), (r'fruktoz', 2), (r'galaktoz', 2),
        (r'pentozow', 2), (r'\bPFK\b', 2), (r'heksokinaz', 2), (r'glukokinaz', 2), (r'\baldolaz', 1),
        (r'kinaz[a-z]* pirogronianow', 2), (r'cykl[a-z]* Cori', 3), (r'\bpirogronian\w*\b', 1),
        (r'mleczan\w*\b', 1), (r'\bGLUT\d', 2), (r'glikemi', 2), (r'\bglukoz[ay]*\b', 1),
    ]),
    ("Giełda — Aminokwasy i białka (sesje egzaminacyjne)", [
        (r'aminokwas', 2), (r'transaminacj', 2), (r'cykl[a-z]* mocznikow', 2), (r'hemoglobin', 2),
        (r'mioglobin', 2), (r'struktur[a-z]* (I|II|III|IV|pierwszo|drugo|trzecio|czwarto)rzędow', 2),
        (r'denaturacj', 1), (r'wiązani[a-z]* peptydow', 2), (r'\bkolagen', 2), (r'fenyloketonuri', 3),
        (r'citrulinemi', 3), (r'cytrulinemi', 3), (r'homocystynuri', 3), (r'2,3-BPG', 2), (r'efekt Bohra', 2),
        (r'mocznik\w*\b', 1), (r'\bazot\w* w cząsteczce mocznika', 3),
    ]),
    ("Giełda — Biologia molekularna (sesje egzaminacyjne)", [
        (r'\bDNA\b', 1), (r'\bRNA\b', 1), (r'replikacj', 2), (r'transkrypcj', 2), (r'translacj', 2),
        (r'mutacj', 1), (r'\bgen[uóa]?\b', 1), (r'chromosom', 1), (r'telomer', 2), (r'epigenetyk', 2),
        (r'metylacj[a-z]* DNA', 2), (r'histon', 2), (r'nukleosom', 2), (r'rybosom', 2), (r'kodon', 2),
        (r'\bPCR\b', 2), (r'sekwencjonowani', 2), (r'plazmid', 2), (r'wektor', 1), (r'CRISPR', 2),
        (r'szczepion', 1), (r'\bwirus\w*\b', 1), (r'\beIF', 2), (r'potranslacyjn', 2), (r'\brRNA\b', 2),
        (r'\btRNA\b', 2), (r'\bmRNA\b', 1), (r'antybiotyk.{0,20}rybosom', 2), (r'nutrigenomik', 3),
        (r'\bSAM\b', 1), (r'S-adenozylometionin', 2),
    ]),
    ("Giełda — Enzymy (sesje egzaminacyjne)", [
        (r'\benzym\w*\b', 1), (r'\bKm\b', 2), (r'Vmax', 2), (r'inhibitor[a-z]* kompetycyjn', 2),
        (r'inhibitor[a-z]* akompetycyjn', 2), (r'\bkoenzym', 2), (r'kofaktor', 2), (r'klas[a-z]* EC\b', 2),
        (r'\bligaz\w*\b', 2), (r'\bhydrolaz\w*\b', 2), (r'\bizomeraz\w*\b', 2), (r'\btransferaz\w*\b', 2),
        (r'oksydoreduktaz', 2), (r'\bliaz\w*\b', 2), (r'katalizuj', 1), (r'aktywność[a-z]* enzymatyczn', 2),
        (r'Lineweaver', 3), (r'kinetyk[a-z]* enzymatyczn', 2), (r'kinaz[a-z]* glicerolow', 2),
    ]),
]

def score_all(q):
    text = q['q'] + ' ' + ' '.join(q['o'])
    scores = {}
    for cat, patterns in RULES:
        s = 0
        for p, w in patterns:
            hits = len(re.findall(p, text, re.I))
            s += hits * w
        if s > 0:
            scores[cat] = s
    return scores

results = {}
unclassified = []
ambiguous = []
for i, q in enumerate(d, start=1):
    scores = score_all(q)
    if not scores:
        unclassified.append((i, q['q']))
        continue
    best = max(scores.items(), key=lambda kv: kv[1])
    sorted_scores = sorted(scores.items(), key=lambda kv: -kv[1])
    results[i] = best[0]
    if len(sorted_scores) > 1 and sorted_scores[0][1] - sorted_scores[1][1] <= 1:
        ambiguous.append((i, q['q'], sorted_scores[:3]))

from collections import Counter
counts = Counter(results.values())
for cat, _ in RULES:
    print(cat, '->', counts.get(cat, 0))
print('UNCLASSIFIED:', len(unclassified))
print('AMBIGUOUS (close scores):', len(ambiguous))

out_path = 'C:/Users/Jakub/AppData/Local/Temp/claude/C--Users-Jakub-Desktop-Prod-projekt-w-budowie/5b271756-3497-41b2-84e6-8e1d1037c3aa/scratchpad/'
json.dump(results, open(out_path+'biochemia_categorization_draft.json', 'w', encoding='utf-8'), ensure_ascii=False)
json.dump(unclassified, open(out_path+'biochemia_unclassified.json', 'w', encoding='utf-8'), ensure_ascii=False)
json.dump(ambiguous, open(out_path+'biochemia_ambiguous.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('written outputs')
