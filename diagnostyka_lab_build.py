# -*- coding: utf-8 -*-
# Diagnostyka laboratoryjna (Rok 3) - nowy przedmiot od zera.
# Źródła: GIEŁDY TEGOROCZNE 2025-2026 (2 egzaminy - zima/lato, recall studencki)
# + zrzuty ekranu quizów Google Forms z ocenionymi odpowiedziami (Kraszula/Pietruczuk
# "Giełda tegoroczna") z własnego folderu przedmiotu.
import json

ITEMS = [
    # --- Morfologia krwi i niedokrwistości ---
    {"category": "Morfologia krwi i niedokrwistości", "q": "MCH w normie, MCV w normie, MCHC w normie - jaki to typ krwinki czerwonej?",
     "mode": "typed", "answers": ["normocyt normobarwliwy"]},
    {"category": "Morfologia krwi i niedokrwistości", "q": "U noworodka we krwi obwodowej dominują:",
     "mode": "typed", "answers": ["neutrofile (granulocyty obojętnochłonne)"]},
    {"category": "Morfologia krwi i niedokrwistości", "q": "U dziecka w wieku 1,5 roku we krwi obwodowej dominują:",
     "mode": "typed", "answers": ["limfocyty"]},
    {"category": "Morfologia krwi i niedokrwistości", "q": "Kobieta: MCV, MCHC i MCH obniżone, żelazo obniżone, ale ferrytyna bardzo wysoka. Co to za niedokrwistość?",
     "o": ["niedokrwistość chorób przewlekłych", "niedokrwistość z niedoboru żelaza", "niedokrwistość aplastyczna", "niedokrwistość megaloblastyczna (z niedoboru B12)"], "a": 0},
    {"category": "Morfologia krwi i niedokrwistości", "q": "W niedokrwistości z niedoboru kwasu foliowego charakterystyczne parametry to:",
     "o": ["MCV, MCH podwyższone, MCHC bez zmian", "MCV, MCH, MCHC bez zmian", "MCV, MCH, MCHC podwyższone", "MCV, MCH, MCHC obniżone"], "a": 0},
    {"category": "Morfologia krwi i niedokrwistości", "q": "Które parametry laboratoryjne pozwalają na potwierdzenie rodzaju niedokrwistości?",
     "o": ["MCV, MCH, MCHC", "MCH, HCT, RBC", "RBC, HGB, HCT", "RET, MCHC, HGB"], "a": 0},
    {"category": "Morfologia krwi i niedokrwistości", "q": "Parametr RDW opisuje:",
     "o": ["wskaźnik anizocytozy erytrocytów", "wskaźnik anizocytozy retykulocytów", "wskaźnik anizocytozy granulocytów", "wskaźnik anizocytozy płytek krwi"], "a": 0},
    {"category": "Morfologia krwi i niedokrwistości", "q": "Limfocytoza to:",
     "o": ["wzrost liczby limfocytów", "spadek odsetka limfocytów", "spadek liczby limfocytów", "wzrost odsetka limfocytów"], "a": 0},
    {"category": "Morfologia krwi i niedokrwistości", "q": "\"Right shift\" (przesunięcie w prawo) w rozmazie krwi to:",
     "o": ["hipersegmentacja jąder neutrocytów", "przesunięcie w lewo w szeregu neutrocytów", "hiposegmentacja jąder neutrocytów", "pseudopelgeryzacja jąder neutrocytów"], "a": 0},
    {"category": "Morfologia krwi i niedokrwistości", "q": "WBC = 1×10⁹/L, neutrofile 45%, limfocyty 50%, monocyty 5%. Jak opisać ten wynik?",
     "mode": "typed", "answers": ["leukopenia z towarzyszącą neutropenią i limfopenią (wartości bezwzględne obu linii poniżej normy)"]},

    # --- Białaczki i choroby układu krwiotwórczego ---
    {"category": "Białaczki i choroby układu krwiotwórczego", "q": "W przewlekłej białaczce limfocytowej (CLL) we krwi obwodowej dominują:",
     "o": ["limfocyty", "blasty", "limfoblasty", "mielocyty", "metamielocyty"], "a": 0},
    {"category": "Białaczki i choroby układu krwiotwórczego", "q": "95% blastów w szpiku kostnym wraz z ostrą leukocytozą wskazuje na:",
     "mode": "typed", "answers": ["ostrą białaczkę (szpikową)"]},
    {"category": "Białaczki i choroby układu krwiotwórczego", "q": "Bezwzględna limfocytoza powyżej 5×10⁹/L pozwala podejrzewać:",
     "mode": "typed", "answers": ["przewlekłą białaczkę limfocytową (CLL)"]},

    # --- Markery sercowe ---
    {"category": "Markery sercowe i kardiologia laboratoryjna", "q": "Który marker jest najbardziej swoisty dla uszkodzenia serca?",
     "o": ["troponina sercowa", "CK-MB mass", "mioglobina", "sercowe białko wiążące miozynę"], "a": 0},
    {"category": "Markery sercowe i kardiologia laboratoryjna", "q": "W jakiej sytuacji klinicznej troponiny są STABILNIE (przewlekle) podwyższone, bez typowej dynamiki wzrostu/spadku?",
     "o": ["przewlekła choroba nerek", "świeży zawał serca typu 1", "zawał serca typu 2", "ostre pęknięcie blaszki miażdżycowej"], "a": 0},
    {"category": "Markery sercowe i kardiologia laboratoryjna", "q": "Pacjent z dusznością: troponina przy przyjęciu = 11, po 1 godzinie = 13 (algorytm 0h/1h). Co to oznacza?",
     "mode": "typed", "answers": ["wynik niejednoznaczny — mieści się w strefie obserwacji, nie pozwala ani potwierdzić, ani wykluczyć zawału"]},
    {"category": "Markery sercowe i kardiologia laboratoryjna", "q": "Który wskaźnik wzrasta najmocniej po dużym wysiłku fizycznym (np. maraton)?",
     "o": ["CK (kinaza kreatynowa)", "AST", "ALP"], "a": 0},

    # --- Gospodarka lipidowa ---
    {"category": "Gospodarka lipidowa", "q": "Wyniki: cholesterol całkowity w normie, triglicerydy podwyższone, HDL obniżony. Co to sugeruje?",
     "mode": "typed", "answers": ["otyłość / zespół metaboliczny"]},
    {"category": "Gospodarka lipidowa", "q": "Przy jakim stężeniu triglicerydów wzór Friedewalda (do szacowania LDL) staje się niewiarygodny?",
     "mode": "typed", "answers": ["powyżej ok. 350-400 mg/dl"]},
    {"category": "Gospodarka lipidowa", "q": "Ile godzin na czczo standardowo zaleca się przed pobraniem lipidogramu?",
     "mode": "typed", "answers": ["12-14 godzin"]},
    {"category": "Gospodarka lipidowa", "q": "Jaka jest docelowa wartość cholesterolu LDL u pacjenta z wynikiem w skali Pol-Score2 = 17%?",
     "o": ["<55 mg/dl", "<40 mg/dl", "<70 mg/dl", "<100 mg/dl"], "a": 0},

    # --- Diabetologia laboratoryjna ---
    {"category": "Diabetologia laboratoryjna", "q": "Definicja prawidłowej tolerancji glukozy w 2. godzinie testu OGTT (stężenie glukozy w osoczu):",
     "mode": "typed", "answers": ["poniżej 140 mg/dl"]},
    {"category": "Diabetologia laboratoryjna", "q": "45-letniemu pacjentowi w 2. godzinie testu OGTT stężenie glukozy w osoczu wyniosło 160 mg/dl. Wynik wskazuje na:",
     "o": ["nieprawidłową tolerancję glukozy", "prawidłową glikemię na czczo", "prawidłową tolerancję glukozy", "cukrzycę"], "a": 0},
    {"category": "Diabetologia laboratoryjna", "q": "Wynik 2. godziny testu OGTT = 135 mg/dl. Wynik wskazuje na:",
     "o": ["prawidłową tolerancję glukozy", "nieprawidłową tolerancję glukozy", "cukrzycę", "cukrzycę ciążową"], "a": 0},
    {"category": "Diabetologia laboratoryjna", "q": "Nieprawidłowa glikemia na czczo (IFG) to wartości:",
     "o": ["100-125 mg/dl", "poniżej 70 mg/dl", "90-100 mg/dl", "powyżej 140 mg/dl"], "a": 0},
    {"category": "Diabetologia laboratoryjna", "q": "Jaki parametr służy do wstecznej (ok. 3-miesięcznej) oceny wyrównania glikemii?",
     "mode": "typed", "answers": ["hemoglobina glikowana (HbA1c)"]},

    # --- Czynność nerek ---
    {"category": "Czynność nerek", "q": "Co to jest eGFR?",
     "mode": "typed", "answers": ["szacowany wskaźnik (współczynnik) filtracji kłębuszkowej"]},
    {"category": "Czynność nerek", "q": "Który test jest najdokładniejszy przy wyliczaniu GFR?",
     "o": ["CKD-EPI z kreatyniny i cystatyny C", "CKD-EPI z samej kreatyniny", "MDRD skrócony", "wzór Cockcrofta-Gaulta"], "a": 0},
    {"category": "Czynność nerek", "q": "Który parametr najdokładniej charakteryzuje wielkość filtracji kłębuszkowej spośród podanych?",
     "o": ["klirens endogennej kreatyniny", "stężenie kreatyniny w surowicy", "stężenie mocznika w surowicy"], "a": 0},
    {"category": "Czynność nerek", "q": "Wskaż zdanie FAŁSZYWE dotyczące stężenia kreatyniny w surowicy:",
     "o": ["jej stężenie wzrasta już, gdy GFR obniży się nieznacznie do ok. 90 ml/min/1,73m²",
           "jest wydalana praktycznie tylko drogą nerek",
           "uszkodzenie mięśni poprzecznie prążkowanych powoduje przejściowy wzrost jej stężenia",
           "jej stężenie wzrasta znamiennie dopiero gdy GFR obniży się znacznie, do ok. 70-75 ml/min/1,73m²"], "a": 0},
    {"category": "Czynność nerek", "q": "Wartość eGFR charakterystyczna dla CIĘŻKIEGO zmniejszenia GFR to:",
     "o": ["20 ml/min/1,73m²", "60 ml/min/1,73m²", "90 ml/min/1,73m²", "45 ml/min/1,73m²", "35 ml/min/1,73m²"], "a": 0},
    {"category": "Czynność nerek", "q": "Anuria (bezmocz) najczęściej wynika z:",
     "o": ["ostrego uszkodzenia nerek (AKI)", "przewlekłej choroby nerek", "cukrzycy", "moczówki prostej"], "a": 0},
    {"category": "Czynność nerek", "q": "Kobieta 65 lat, UACR = 100 mg/g. Jaka to kategoria albuminurii?",
     "mode": "typed", "answers": ["albuminuria umiarkowanie zwiększona (kategoria A2)"]},
    {"category": "Czynność nerek", "q": "Pacjentka z albuminurią umiarkowaną (kategoria A2, UACR ok. 100) i GFR = 50 ml/min (kategoria G3a). Jakie ma łączne ryzyko sercowo-nerkowe wg klasyfikacji KDIGO?",
     "mode": "typed", "answers": ["duże (wysokie) ryzyko"]},

    # --- Wątroba i drogi żółciowe ---
    {"category": "Wątroba i drogi żółciowe", "q": "Enzymy wskazujące na uszkodzenie hepatocytów to:",
     "o": ["ALT, AST", "CK i LDH", "ALP, AST", "GGT, ALT"], "a": 0},
    {"category": "Wątroba i drogi żółciowe", "q": "Badania laboratoryjne, które potwierdzają dysfunkcję (niewydolność syntetyczną) wątroby to:",
     "o": ["albumina, PT (czas protrombinowy)", "ALT, AST", "ALP, GGT", "LDH, albumina"], "a": 0},
    {"category": "Wątroba i drogi żółciowe", "q": "Enzymy cholestatyczne to:",
     "o": ["ALP, GGT", "ALT, AST", "LDH, GGT", "AST, ALP"], "a": 0},
    {"category": "Wątroba i drogi żółciowe", "q": "Pacjent z obniżonymi albuminami i podwyższonym amoniakiem we krwi - najbardziej prawdopodobnie ma:",
     "o": ["przewlekłą chorobę wątroby (marskość)", "ostre uszkodzenie wątroby", "alkoholową chorobę wątroby o krótkim przebiegu"], "a": 0},
    {"category": "Wątroba i drogi żółciowe", "q": "ALT > 2000 U/L, AST > 2000 U/L (wskaźnik de Ritis <1), ALP nieznacznie podwyższone. Co to za obraz?",
     "mode": "typed", "answers": ["ostre uszkodzenie wątroby (hepatocellularne, np. wirusowe zapalenie wątroby)"]},
    {"category": "Wątroba i drogi żółciowe", "q": "Test anty-HCV wyszedł jako wstępnie reaktywny. Jaki jest następny krok diagnostyczny?",
     "mode": "typed", "answers": ["wykonać badanie HCV RNA metodą molekularną (potwierdzenie czynnego zakażenia)"]},

    # --- Markery nowotworowe ---
    {"category": "Markery nowotworowe", "q": "Marker nowotworowy dla raka wątrobowokomórkowego to:",
     "o": ["AFP", "CEA", "CA 19-9", "CA 125"], "a": 0},
    {"category": "Markery nowotworowe", "q": "Jaki marker jest najbardziej użyteczny w ocenie/monitorowaniu raka trzustki?",
     "o": ["CA 19-9", "CA 15-3", "CEA"], "a": 0},
    {"category": "Markery nowotworowe", "q": "Test ROMA (ocena ryzyka raka jajnika) składa się z markerów:",
     "mode": "typed", "answers": ["CA 125 i HE4"]},
    {"category": "Markery nowotworowe", "q": "Który marker nowotworowy jest przesiewowo przydatny w populacji ogólnej (bezobjawowej)?",
     "mode": "typed", "answers": ["żaden — nie ma markera zwalidowanego do przesiewowych badań populacji ogólnej"]},

    # --- Stany zagrożenia życia — wartości krytyczne ---
    {"category": "Stany zagrożenia życia — wartości krytyczne", "q": "Górna wartość krytyczna aktywności lipazy, wskazująca na stan zagrożenia życia, to:",
     "o": ["1000 IU/L", "60 IU/L", "100 IU/L", "200 IU/L", "600 IU/L"], "a": 0},
    {"category": "Stany zagrożenia życia — wartości krytyczne", "q": "Górna wartość krytyczna CRP u pacjentów hospitalizowanych, wskazująca na stan zagrożenia życia, to:",
     "o": ["200 mg/L", "> 5 mg/L", "50 mg/L", "100 mg/L", "126 mg/L"], "a": 0},
    {"category": "Stany zagrożenia życia — wartości krytyczne", "q": "Który z poniższych parametrów NIE należy do parametrów alarmowych?",
     "o": ["przeciwciała anty-HBs", "glukoza", "AST", "sód", "kreatynina"], "a": 0},

    # --- Gazometria i zasady pobierania próbek ---
    {"category": "Gazometria i zasady pobierania próbek", "q": "Ile czasu po pobraniu próbka nadaje się jeszcze do wykonania gazometrii?",
     "mode": "typed", "answers": ["ok. 30 minut"]},
    {"category": "Gazometria i zasady pobierania próbek", "q": "Który parametr wymaga kooksymetrii i jest dostępny tylko w analizie gazometrycznej (nie w zwykłej biochemii)?",
     "mode": "typed", "answers": ["karboksyhemoglobina (HbCO)"]},
    {"category": "Gazometria i zasady pobierania próbek", "q": "Które stężenia zmieniają się NAJMNIEJ w próbce krwi w ciągu pierwszych 2 godzin po pobraniu (opóźniona obróbka)?",
     "o": ["mocznik i kreatynina", "glukoza", "pH i pO2", "aktywność CK, ALT i AST"], "a": 0},
    {"category": "Gazometria i zasady pobierania próbek", "q": "Jak działa fluorek sodu w probówkach do oznaczania glukozy?",
     "mode": "typed", "answers": ["hamuje glikolizę (enolazę) w próbce krwi, stabilizując poziom glukozy do oznaczenia"]},
    {"category": "Gazometria i zasady pobierania próbek", "q": "Jaki enzym jest wykrywany w moczu i jest ważny diagnostycznie (np. w ostrym zapaleniu trzustki)?",
     "o": ["amylaza", "LDH", "lipaza", "AST"], "a": 0},
    {"category": "Gazometria i zasady pobierania próbek", "q": "Skąd wynika policytemia rzekoma (pozorna)?",
     "o": ["ze zmniejszenia objętości osocza (odwodnienie/hemokoncentracja)", "ze zwiększenia objętości osocza", "ze wzrostu liczby krwinek", "ze spadku liczby krwinek"], "a": 0},
    {"category": "Gazometria i zasady pobierania próbek", "q": "Jaki marker jest wykorzystywany do oceny stanu odżywienia pacjenta?",
     "o": ["albumina", "alfa-1-antytrypsyna", "alfa-2-antytrypsyna"], "a": 0},
]

with open('diagnostyka_lab_raw.json', 'w', encoding='utf-8') as f:
    json.dump(ITEMS, f, ensure_ascii=False, indent=2)

by_cat = {}
for it in ITEMS:
    by_cat[it['category']] = by_cat.get(it['category'], 0) + 1
for c, n in sorted(by_cat.items()):
    print(n, '-', c)
print('TOTAL', len(ITEMS))
