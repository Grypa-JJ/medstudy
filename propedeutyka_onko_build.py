# -*- coding: utf-8 -*-
# Propedeutyka onkologii (Rok 3) - nowy przedmiot od zera.
# Źródło: GIEŁDY TEGOROCZNE/Propedeutyka onkologii - 2 egzaminy (01.12.2025,
# 06.02.2026), bardzo dobra jakość recall, w większości spójne między sesjami.
# Własny folder przedmiotu ma tylko prezentacje wykładowe (bez gotowej giełdy).
import json

ITEMS = [
    # --- Epidemiologia nowotworów ---
    {"category": "Epidemiologia nowotworów", "q": "Które nowotwory mają największą zachorowalność w Polsce (osobno u mężczyzn i kobiet)?",
     "mode": "typed", "answers": ["u mężczyzn — rak gruczołu krokowego (prostaty), u kobiet — rak piersi"]},
    {"category": "Epidemiologia nowotworów", "q": "Który nowotwór ma największą umieralność w Polsce (u obu płci)?",
     "mode": "typed", "answers": ["rak płuca"]},
    {"category": "Epidemiologia nowotworów", "q": "W 2020 roku na raka piersi zachorowało 50 na 100 000 kobiet. Jaki wskaźnik epidemiologiczny to opisuje?",
     "mode": "typed", "answers": ["zachorowalność (zapadalność, incydencja)"]},
    {"category": "Epidemiologia nowotworów", "q": "Czym jest zapadalność (incidence)?",
     "mode": "typed", "answers": ["stosunek liczby nowych przypadków choroby do liczebności populacji w danym okresie"]},
    {"category": "Epidemiologia nowotworów", "q": "\"Na nowotwór umiera X% chorych (spośród zdiagnozowanych)\" — jaki to wskaźnik?",
     "mode": "typed", "answers": ["śmiertelność (case-fatality rate) — w odróżnieniu od umieralności liczonej na całą populację"]},

    # --- Podstawy biologii molekularnej nowotworów ---
    {"category": "Biologia molekularna nowotworów", "q": "Jaką funkcję pełni receptor HER2?",
     "mode": "typed", "answers": ["jest receptorem naskórkowym o aktywności kinazy tyrozynowej (nie odpowiada za naprawę DNA)"]},
    {"category": "Biologia molekularna nowotworów", "q": "Które z poniższych są genami SUPRESOROWYMI nowotworów (a nie protoonkogenami): BRCA1, c-MYC, K-RAS?",
     "mode": "typed", "answers": ["BRCA1 (c-MYC i K-RAS to protoonkogeny)"]},
    {"category": "Biologia molekularna nowotworów", "q": "Wymień geny supresorowe najczęściej poddawane mutacjom w nowotworach.",
     "mode": "typed", "answers": ["TP53, CDKN2A, RB1, BRCA1"]},
    {"category": "Biologia molekularna nowotworów", "q": "Jaką rolę pełni białko MDM2 wobec p53?",
     "mode": "typed", "answers": ["hamuje (degraduje) p53, nawet gdy p53 jest w postaci niezmutowanej"]},
    {"category": "Biologia molekularna nowotworów", "q": "Jak działa białko RB (retinoblastoma)?",
     "mode": "typed", "answers": ["hamuje przejście cyklu komórkowego z fazy G1 do S"]},
    {"category": "Biologia molekularna nowotworów", "q": "Na czym polega teoria dwóch uderzeń (two-hit hypothesis) Knudsona?",
     "mode": "typed", "answers": ["pierwsza mutacja w genie supresorowym jest dziedziczona, druga powstaje jako mutacja somatyczna — dopiero utrata obu alleli prowadzi do nowotworu"]},
    {"category": "Biologia molekularna nowotworów", "q": "Ile mutacji potrzebuje protoonkogen, by wywołać efekt onkogenny (gain of function)?",
     "mode": "typed", "answers": ["wystarczy mutacja jednej kopii (allelu) — działa dominująco"]},
    {"category": "Biologia molekularna nowotworów", "q": "Na jaki etap kancerogenezy (inicjacja/promocja/progresja) wpływa zakażenie wirusem HPV?",
     "mode": "typed", "answers": ["inicjację (integracja DNA wirusowego z genomem gospodarza)"]},
    {"category": "Biologia molekularna nowotworów", "q": "Wskaż BŁĘDNIE dopasowaną parę czynnik kancerogenny — nowotwór:",
     "mode": "typed", "answers": ["EBV — rak płaskonabłonkowy języka (EBV wiąże się z rakiem nosogardła i chłoniakiem Burkitta, nie z rakiem płaskonabłonkowym języka)"]},
    {"category": "Biologia molekularna nowotworów", "q": "Jaka jest teoria najlepiej tłumacząca powstawanie przerzutów do odległych, specyficznych narządów (np. rak prostaty → szpik kostny)?",
     "mode": "typed", "answers": ["teoria \"seed and soil\" (nasienia i gleby)"]},
    {"category": "Biologia molekularna nowotworów", "q": "Ucieczka nowotworu przed układem odpornościowym jest m.in. skutkiem:",
     "mode": "typed", "answers": ["nadekspresji PD-L1 na komórkach nowotworowych"]},
    {"category": "Biologia molekularna nowotworów", "q": "Na produkty których genów/białek kierowana jest immunoterapia przeciwnowotworowa (inhibitory punktów kontrolnych)?",
     "mode": "typed", "answers": ["CTLA4, PD-1, PD-L1"]},
    {"category": "Biologia molekularna nowotworów", "q": "Czy nowotwór monoklonalny w trakcie rozwoju może stać się wtórnie heterogeniczny?",
     "mode": "typed", "answers": ["tak — dalsze mutacje w trakcie progresji prowadzą do heterogenności wewnątrznowotworowej mimo monoklonalnego pochodzenia"]},
    {"category": "Biologia molekularna nowotworów", "q": "Czym jest chondroma?",
     "mode": "typed", "answers": ["łagodnym nowotworem wywodzącym się z tkanki mezenchymalnej (chrzęstnej)"]},
    {"category": "Biologia molekularna nowotworów", "q": "Jaka jest różnica między stanem przedrakowym (\"condition\") a zmianą przedrakową (\"lesion\")?",
     "mode": "typed", "answers": ["stan przedrakowy (condition) to choroba/sytuacja układowa zwiększająca ryzyko raka; zmiana przedrakowa (lesion) to konkretna zmiana miejscowa, która bywa odwracalna"]},
    {"category": "Biologia molekularna nowotworów", "q": "Jakie metody biologii molekularnej wykorzystuje się w diagnostyce patomorfologicznej nowotworów?",
     "mode": "typed", "answers": ["FISH, PCR, NGS (sekwencjonowanie nowej generacji), cytometria przepływowa"]},

    # --- Zespoły paranowotworowe ---
    {"category": "Zespoły paranowotworowe", "q": "Wymień przykłady zespołów paranowotworowych.",
     "mode": "typed", "answers": ["zespół Lesera-Trélata, zespół miasteniczny Lamberta-Eatona, policytemia (czerwienica paranowotworowa)"]},
    {"category": "Zespoły paranowotworowe", "q": "Pacjentka z hiponatremią bez cech odwodnienia w przebiegu raka płuca — najbardziej prawdopodobna przyczyna?",
     "mode": "typed", "answers": ["zespół SIADH (nieadekwatnego wydzielania ADH) — częsty zespół paranowotworowy w raku drobnokomórkowym płuca"]},
    {"category": "Zespoły paranowotworowe", "q": "Kacheksję nowotworową z hipoalbuminemią u pacjenta z rozsianym nowotworem najlepiej tłumaczy:",
     "mode": "typed", "answers": ["wytwarzanie cytokin prozapalnych (TNF-α, IL-6) przez guz i odpowiedź gospodarza"]},
    {"category": "Zespoły paranowotworowe", "q": "Pacjentka z rumieniem, świądem skóry i napadowymi biegunkami — jaki nowotwór podejrzewasz?",
     "mode": "typed", "answers": ["rakowiak (nowotwór neuroendokrynny — zespół rakowiaka)"]},
    {"category": "Zespoły paranowotworowe", "q": "Zakrzepica żył głębokich (wędrujące zapalenie żył, zespół Trousseau) jest klasycznie kojarzona z jakim nowotworem?",
     "mode": "typed", "answers": ["rakiem trzustki"]},

    # --- Profilaktyka i skrining nowotworów ---
    {"category": "Profilaktyka i skrining nowotworów", "q": "Jaki rodzaj profilaktyki jest najważniejszy w zapobieganiu rakowi płuca?",
     "mode": "typed", "answers": ["profilaktyka pierwotna — niepalenie tytoniu"]},
    {"category": "Profilaktyka i skrining nowotworów", "q": "Dla nowotworów złośliwych których narządów dysponujemy potwierdzonymi, skutecznymi badaniami skriningowymi (populacyjnymi)?",
     "mode": "typed", "answers": ["szyjka macicy (cytologia), jelito grube (kolonoskopia), pierś (mammografia), a w grupie ryzyka — płuco (niskodawkowa TK)"]},
    {"category": "Profilaktyka i skrining nowotworów", "q": "Jaki jest potwierdzony skrining raka płuca i u kogo się go stosuje?",
     "mode": "typed", "answers": ["niskodawkowa tomografia komputerowa (LDCT) u długoletnich palaczy w wieku ok. 55-74 lat"]},
    {"category": "Profilaktyka i skrining nowotworów", "q": "Cechy dobrego testu skriningowego to:",
     "mode": "typed", "answers": ["tani, prosty w wykonaniu, o wysokiej czułości i wysokiej swoistości"]},
    {"category": "Profilaktyka i skrining nowotworów", "q": "Dlaczego objęcie badaniem skriningowym dużej części populacji jest kluczowe dla jego skuteczności?",
     "mode": "typed", "answers": ["badanie skriningowe ma sens populacyjny tylko wtedy, gdy obejmuje większość (dużą część) populacji docelowej"]},
    {"category": "Profilaktyka i skrining nowotworów", "q": "Jaki jest główny cel programu skriningowego?",
     "mode": "typed", "answers": ["obniżenie umieralności z powodu danego nowotworu"]},
    {"category": "Profilaktyka i skrining nowotworów", "q": "Przykład profilaktyki WTÓRNEJ w przypadku raka szyjki macicy to:",
     "mode": "typed", "answers": ["cytologia (test Papanicolaou)"]},
    {"category": "Profilaktyka i skrining nowotworów", "q": "Przykład profilaktyki TRZECIORZĘDOWEJ po leczeniu raka płuca to:",
     "mode": "typed", "answers": ["kontrolna tomografia komputerowa po wycięciu guza płuca (nadzór onkologiczny)"]},
    {"category": "Profilaktyka i skrining nowotworów", "q": "Czy skuteczność profilaktyki (szkodliwości) palenia papierosów zależy głównie od RODZAJU papierosów, które pali pacjent?",
     "mode": "typed", "answers": ["nie — kluczowe są liczba paczkolat i czas palenia, nie rodzaj papierosów"]},

    # --- Diagnostyka onkologiczna — biopsja i postępowanie ---
    {"category": "Diagnostyka onkologiczna — biopsja i postępowanie", "q": "Pacjentka ok. 50 lat, dodatni wynik badania na krew utajoną w kale. Jakie dalsze postępowanie diagnostyczne?",
     "mode": "typed", "answers": ["kolonoskopia"]},
    {"category": "Diagnostyka onkologiczna — biopsja i postępowanie", "q": "Pacjentka z twardym, nieprzesuwalnym guzkiem w piersi — jakie jest prawidłowe postępowanie?",
     "mode": "typed", "answers": ["biopsja gruboigłowa zmiany po wykonaniu badania obrazowego diagnostycznego"]},
    {"category": "Diagnostyka onkologiczna — biopsja i postępowanie", "q": "Pacjent z wysokim PSA i bezbolesnym krwiomoczem — co zlecisz?",
     "mode": "typed", "answers": ["wielopunktową biopsję gruboigłową prostaty pod kontrolą USG"]},
    {"category": "Diagnostyka onkologiczna — biopsja i postępowanie", "q": "Jakie jest prawidłowe postępowanie diagnostyczne w przypadku obwodowo położonego guza płuca?",
     "mode": "typed", "answers": ["biopsja gruboigłowa pod kontrolą TK"]},
    {"category": "Diagnostyka onkologiczna — biopsja i postępowanie", "q": "Kobieta ze zmianą barwnikową skóry (podejrzenie czerniaka) na udzie — jakie jest prawidłowe postępowanie?",
     "mode": "typed", "answers": ["wycięcie chirurgiczne w całości (biopsja wycinająca) z marginesem ok. 0,1-0,2 cm"]},
    {"category": "Diagnostyka onkologiczna — biopsja i postępowanie", "q": "Co bierzemy pod uwagę w wywiadzie z pacjentem kwalifikowanym do chemioterapii?",
     "mode": "typed", "answers": ["stan ogólny pacjenta, wydolność narządów, choroby przewlekłe współistniejące"]},
    {"category": "Diagnostyka onkologiczna — biopsja i postępowanie", "q": "Co jest kluczowe w diagnostyce nowotworu o nieznanym punkcie wyjścia (CUP)?",
     "mode": "typed", "answers": ["połączenie wielu metod — immunohistochemii i badań molekularnych — pozwala ustalić najbardziej prawdopodobne pochodzenie nowotworu"]},

    # --- Genetyka nowotworów dziedzicznych ---
    {"category": "Genetyka nowotworów dziedzicznych", "q": "Z jakimi nowotworami związane są mutacje genów BRCA1 i BRCA2?",
     "mode": "typed", "answers": ["rakiem piersi i rakiem jajnika (BRCA1 w większym stopniu odpowiada za raka jajnika niż BRCA2; BRCA1 zwiększa też ryzyko raka trzustki)"]},
    {"category": "Genetyka nowotworów dziedzicznych", "q": "Czy BRCA1 i BRCA2 są protoonkogenami czy genami supresorowymi?",
     "mode": "typed", "answers": ["genami supresorowymi nowotworów"]},
    {"category": "Genetyka nowotworów dziedzicznych", "q": "Jakie markery immunohistochemiczne bada się w diagnostyce zespołu Lyncha (niestabilność mikrosatelitarna, MMR)?",
     "mode": "typed", "answers": ["MLH1, MSH2, MSH6, PMS2"]},

    # --- Klasyfikacja TNM, staging i grading ---
    {"category": "TNM, staging i grading", "q": "Na podstawie jakich danych ustalamy klasyfikację TNM?",
     "mode": "typed", "answers": ["danych klinicznych oraz patomorfologicznych (histopatologicznych)"]},
    {"category": "TNM, staging i grading", "q": "Czy klasyfikacja TNM jest wskaźnikiem złośliwości HISTOLOGICZNEJ nowotworu?",
     "mode": "typed", "answers": ["nie — TNM opisuje anatomiczny zasięg (stopień zaawansowania) choroby, złośliwość histologiczną ocenia grading, nie staging"]},
    {"category": "TNM, staging i grading", "q": "Która skala gradingu ma największe znaczenie diagnostyczne (najwyższy dodatni współczynnik predykcyjny) w raku gruczołowym prostaty?",
     "mode": "typed", "answers": ["skala Gleasona"]},
    {"category": "TNM, staging i grading", "q": "Co oznacza wynik pT3N2aM1 w klasyfikacji TNM?",
     "mode": "typed", "answers": ["obecność przerzutów do węzłów chłonnych (N2a) oraz przerzutów odległych (M1)"]},

    # --- Leczenie onkologiczne — zasady ogólne ---
    {"category": "Leczenie onkologiczne — zasady ogólne", "q": "W jaki sposób cytostatyki (chemioterapia) działają na komórki nowotworowe?",
     "mode": "typed", "answers": ["hamują proliferację i wzrost komórek nowotworowych"]},
    {"category": "Leczenie onkologiczne — zasady ogólne", "q": "W jakich celach wdraża się chemioterapię PALIATYWNĄ?",
     "mode": "typed", "answers": ["dla przedłużenia całkowitego przeżycia, poprawy jakości życia oraz złagodzenia objawów nowotworu"]},
]

with open('propedeutyka_onko_raw.json', 'w', encoding='utf-8') as f:
    json.dump(ITEMS, f, ensure_ascii=False, indent=2)

by_cat = {}
for it in ITEMS:
    by_cat[it['category']] = by_cat.get(it['category'], 0) + 1
for c, n in sorted(by_cat.items()):
    print(n, '-', c)
print('TOTAL', len(ITEMS))
