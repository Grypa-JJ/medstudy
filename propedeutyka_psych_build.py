# -*- coding: utf-8 -*-
# Propedeutyka psychiatrii (Rok 3) - NOWY przedmiot od zera.
# Źródło: własny folder "Propedeutyka Psychiatrii - zaliczenie 2025_2026.docx" -
# recall z wielu grup/terminów (Aleksandrowska, Czechosłowacka CKD), w tym pełne
# zestawy ABCDE z odpowiedziami potwierdzonymi w powtórzonym terminie 29.04.2026.
import json

ITEMS = [
    {"category": "Psychopatologia — objawy i definicje", "q": "Do jakiej grupy omamów należą omamy cenestetyczne?",
     "mode": "typed", "answers": ["omamy dotykowe (cielesne)"]},
    {"category": "Psychopatologia — objawy i definicje", "q": "Co to jest agorafobia?",
     "mode": "typed", "answers": ["lęk przed otwartą przestrzenią"]},
    {"category": "Psychopatologia — objawy i definicje", "q": "Czym są pareidolie?",
     "mode": "typed", "answers": ["złudzenia (nierealne spostrzeżenia) powstające na bazie realnego, ale niejednostajnego, nieostrego/zamazanego tła (np. dostrzeganie twarzy w chmurach)"]},
    {"category": "Psychopatologia — objawy i definicje", "q": "Co to jest obsesja?",
     "mode": "typed", "answers": ["natrętna, uporczywa myśl pojawiająca się wbrew woli chorego"]},
    {"category": "Psychopatologia — objawy i definicje", "q": "Co to jest kryptomnezja?",
     "mode": "typed", "answers": ["zjawisko, w którym zapomniane źródło wspomnienia/informacji jest mylnie odbierane jako własny, oryginalny pomysł"]},
    {"category": "Psychopatologia — objawy i definicje", "q": "Na czym polega myślenie magiczne?",
     "mode": "typed", "answers": ["przekonanie, że własne myśli, słowa lub rytuały mogą bezpośrednio wpływać na przebieg wydarzeń w świecie zewnętrznym, bez logicznego związku przyczynowo-skutkowego"]},
    {"category": "Psychopatologia — objawy i definicje", "q": "Do zaburzeń treści myślenia (spośród: dygresyjność myślenia, urojenia cenestetyczne, idee nadwartościowe, rozkojarzenie, ambisentencja) należą przede wszystkim:",
     "o": ["idee nadwartościowe", "dygresyjność myślenia", "rozkojarzenie", "ambisentencja"], "a": 0},
    {"category": "Psychopatologia — objawy i definicje", "q": "Jakie zaburzenie aktywności ruchowej jest typowe dla narkolepsji?",
     "o": ["katapleksja", "katalepsja", "apraksja", "posturyzm", "echopraksja"], "a": 0},
    {"category": "Psychopatologia — objawy i definicje", "q": "Które z poniższych NIE będzie przyczyną katatonii?",
     "o": ["epizod manii w chorobie afektywnej dwubiegunowej", "depresja psychotyczna", "organiczne uszkodzenie mózgu", "schizofrenia", "zaburzenia konwersyjne"], "a": 0},
    {"category": "Psychopatologia — objawy i definicje", "q": "Triada Becka (poznawcza triada depresyjna) dotyczy objawów jakiego zaburzenia?",
     "o": ["depresji", "hipomanii", "schizofrenii", "zaburzeń urojeniowych", "zaburzenia schizoafektywnego"], "a": 0},
    {"category": "Psychopatologia — objawy i definicje", "q": "W przebiegu której fobii dochodzi do mobilizacji układu PRZYWSPÓŁCZULNEGO, prowadzącej w konsekwencji do omdlenia (reakcja wazowagalna)?",
     "o": ["hemofobii (fobii krwi)", "agorafobii", "klaustrofobii", "tokofobii", "fobii społecznej"], "a": 0},
    {"category": "Psychopatologia — objawy i definicje", "q": "Do objawów negatywnych schizofrenii NIE należy:",
     "o": ["stupor", "anhedonia", "alogia", "blady (spłycony) afekt", "apatia"], "a": 0},
    {"category": "Psychopatologia — objawy i definicje", "q": "Wymień 4 objawy negatywne schizofrenii.",
     "mode": "typed", "answers": ["alogia, awolicja, anhedonia, spłycony (płaski) afekt"]},
    {"category": "Psychopatologia — objawy i definicje", "q": "Wymień jakościowe zaburzenia świadomości.",
     "mode": "typed", "answers": ["przymglenie, zmącenie, zwężenie świadomości"]},
    {"category": "Psychopatologia — objawy i definicje", "q": "Wymień ilościowe zaburzenia świadomości (od najlżejszego do najgłębszego).",
     "mode": "typed", "answers": ["somnolencja, sopor (stupor), śpiączka"]},
    {"category": "Psychopatologia — objawy i definicje", "q": "Czym różni się hipomania od pełnoobjawowej manii?",
     "mode": "typed", "answers": ["hipomania jest łagodniejsza, nie powoduje znaczącego upośledzenia funkcjonowania społecznego/zawodowego, nie towarzyszą jej objawy psychotyczne, i trwa krócej (min. 4 dni, mania min. 7 dni)"]},

    {"category": "Zaburzenia nastroju (depresja, ChAD)", "q": "Ile minimalnie trwa epizod manii, aby spełnić kryterium czasowe rozpoznania?",
     "mode": "typed", "answers": ["7 dni"]},
    {"category": "Zaburzenia nastroju (depresja, ChAD)", "q": "Jak nazywa się zaburzenie, w którym objawy depresji i manii współwystępują jednocześnie (np. trwający tydzień epizod depresji połączonej z manią)?",
     "mode": "typed", "answers": ["epizod (stan) mieszany w przebiegu choroby afektywnej dwubiegunowej"]},
    {"category": "Zaburzenia nastroju (depresja, ChAD)", "q": "Cechą depresji w przebiegu choroby afektywnej dwubiegunowej NIE jest:",
     "o": ["dobra odpowiedź na leki przeciwdepresyjne", "nadmierna senność", "przebieg z częstymi nawrotami", "młody wiek wystąpienia pierwszego epizodu", "objawy psychotyczne towarzyszące depresji"], "a": 0},
    {"category": "Zaburzenia nastroju (depresja, ChAD)", "q": "Wymień 4 rodzaje urojeń depresyjnych.",
     "mode": "typed", "answers": ["urojenia winy, urojenia hipochondryczne, urojenia ruiny (zubożenia materialnego), urojenia nihilistyczne (Cotarda)"]},
    {"category": "Zaburzenia nastroju (depresja, ChAD)", "q": "W diagnostyce różnicowej epizodu depresji należy uwzględnić:",
     "o": ["wszystkie wymienione: zaburzenia metaboliczne, zaburzenia osobowości, zaburzenia schizoafektywne, zaburzenia lękowe", "wyłącznie zaburzenia metaboliczne", "wyłącznie zaburzenia osobowości", "wyłącznie zaburzenia lękowe"], "a": 0},

    {"category": "Schizofrenia i zaburzenia psychotyczne", "q": "Pacjent ze spowolnieniem psychoruchowym, brakiem kontaktu wzrokowego, rytualnym odczekiwaniem przed czynnościami z obawy \"że stanie się coś złego\", urojeniami prześladowczymi (\"oni chcą mnie wykończyć\") i wycofaniem społecznym, przy prawidłowym EEG/MRI — najbardziej prawdopodobna diagnoza?",
     "o": ["schizofrenia paranoidalna", "depresja psychotyczna", "zaburzenia konwersyjne", "uszkodzenie OUN", "uzależnienie od benzodiazepin"], "a": 0},
    {"category": "Schizofrenia i zaburzenia psychotyczne", "q": "Do zasad leczenia schizofrenii należy:",
     "o": ["utrzymanie leczenia co najmniej przez 24 miesiące po pierwszym epizodzie choroby", "leczenie co najmniej 3 neuroleptykami jednocześnie w minimalnych dawkach", "leczenie podtrzymujące po kolejnym epizodzie przez co najmniej 10 lat", "podawanie benzodiazepin zamiast neuroleptyków w ostrej fazie choroby"], "a": 0},
    {"category": "Schizofrenia i zaburzenia psychotyczne", "q": "Pacjent ze schizofrenią, w trudnym kontakcie, powtarzający gesty za badającym (echopraksja), z poczuciem wirowania ciała (omamy kinestetyczne) i rozkojarzeniem toku wypowiedzi — jakie objawy psychopatologiczne rozpoznasz?",
     "o": ["echopraksja, omamy kinestetyczne, rozkojarzenie toku myślenia", "somatyzacja, urojenia oddziaływania, werbigeracje", "automatyzm nakazowy, urojenia odnoszące, mantyzm", "katalepsja, pareidolie, mutyzm", "echolalia, złudzenia patologiczne, iteracje"], "a": 0},
    {"category": "Schizofrenia i zaburzenia psychotyczne", "q": "Wymień 4 atypowe (II generacji) leki przeciwpsychotyczne.",
     "mode": "typed", "answers": ["rysperydon, kwetiapina, olanzapina, klozapina"]},

    {"category": "Zaburzenia lękowe i obsesyjno-kompulsyjne", "q": "Do typowych współchorobowości zespołu lęku uogólnionego (GAD) NIE należy:",
     "o": ["zaburzenia osobowości", "fobia społeczna", "zaburzenia nastroju", "uzależnienie od alkoholu", "lęk paniczny"], "a": 0},
    {"category": "Zaburzenia lękowe i obsesyjno-kompulsyjne", "q": "19-letni pacjent kompulsywnie katalogujący i kolekcjonujący spisy/zeszyty po kilka godzin dziennie, z silnym niepokojem przy próbie przerwania tej czynności — jakie rozpoznanie?",
     "o": ["zaburzenie obsesyjno-kompulsyjne", "mieszane zaburzenia lękowe", "ADHD", "idea nadwartościowa", "zaburzenia osobowości"], "a": 0},
    {"category": "Zaburzenia lękowe i obsesyjno-kompulsyjne", "q": "Do czynników ryzyka wystąpienia zespołu stresu pourazowego (PTSD) NIE należy:",
     "o": ["kradzież samochodu", "gwałtowna śmierć bliskiej osoby", "przestępstwo seksualne", "rozpoznanie u dziecka ciężkiej choroby nieuleczalnej", "bycie świadkiem zabójstwa"], "a": 0},

    {"category": "Zaburzenia świadomości i majaczenie", "q": "Wymień 4 objawy zespołu majaczeniowego (delirium).",
     "mode": "typed", "answers": ["zaburzenia orientacji, agresja i drażliwość, urojenia (zwykle prześladowcze), pobudzenie psychoruchowe"]},
    {"category": "Zaburzenia świadomości i majaczenie", "q": "Scharakteryzuj zespół otępienny.",
     "mode": "typed", "answers": ["postępujące, przewlekłe upośledzenie funkcji poznawczych (pamięci, myślenia, orientacji, języka) przy zwykle zachowanej świadomości, zaburzające codzienne funkcjonowanie chorego"]},

    {"category": "Skale i czynniki ryzyka w psychiatrii", "q": "Wymień 4 czynniki ryzyka samobójczego.",
     "mode": "typed", "answers": ["płeć męska, izolacja społeczna, depresja, uzależnienie od alkoholu/substancji psychoaktywnych"]},
]

with open('propedeutyka_psych_raw.json', 'w', encoding='utf-8') as f:
    json.dump(ITEMS, f, ensure_ascii=False, indent=2)

by_cat = {}
for it in ITEMS:
    by_cat[it['category']] = by_cat.get(it['category'], 0) + 1
for c, n in sorted(by_cat.items()):
    print(n, '-', c)
print('TOTAL', len(ITEMS))
