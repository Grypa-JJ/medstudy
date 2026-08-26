# -*- coding: utf-8 -*-
# Genetyka kliniczna (Rok 3) - RUNDA 2. Źródło: własny folder "Wykłady tegoroczne"
# (7 wykładów/seminariów prowadzących Zakładu Genetyki Medycznej UM w Łodzi -
# materiały dydaktyczne własnej uczelni, nie publikacje komercyjne).
import json

NEW_ITEMS = [
    # --- Wybrane choroby genetyczne (Kupczak) ---
    {"category": "Choroby jednogenowe — tkanka łączna i kości", "q": "Achondroplazja — jaki gen jest zmutowany i jaki jest mechanizm choroby?",
     "mode": "typed", "answers": ["gen FGFR3 (4p16.3) — mutacja powoduje stałą aktywację receptora FGFR3, co upośledza kostnienie śródchrzęstne i zaburza rozwój kośćca"]},
    {"category": "Choroby jednogenowe — tkanka łączna i kości", "q": "Achondroplazja — jaki jest sposób dziedziczenia i jaki odsetek przypadków to nowe mutacje?",
     "mode": "typed", "answers": ["autosomalnie dominujący; ok. 80% to mutacje de novo (chorzy mają zdrowych rodziców)"]},
    {"category": "Choroby jednogenowe — tkanka łączna i kości", "q": "Zespół Marfana — jaki gen jest zmutowany i jakie białko koduje?",
     "mode": "typed", "answers": ["gen FBN1 (15q21.1), kodujący fibrylinę 1 — białko strukturalne tkanki łącznej"]},
    {"category": "Choroby jednogenowe — tkanka łączna i kości", "q": "Zespół Marfana — jakie jest najczęstsze zagrażające życiu powikłanie kardiologiczne?",
     "mode": "typed", "answers": ["tętniak aorty (i jego pęknięcie) — najczęstsza przyczyna zgonu, oraz wypadanie płatka zastawki mitralnej"]},
    {"category": "Choroby jednogenowe — tkanka łączna i kości", "q": "Wrodzona łamliwość kości (osteogenesis imperfecta) — jaki gen jest najczęściej zmutowany?",
     "mode": "typed", "answers": ["COL1A1 (17q21.31-q22) lub COL1A2 (7q22.1), kodujące kolagen typu 1"]},
    {"category": "Choroby jednogenowe — tkanka łączna i kości", "q": "Wrodzona łamliwość kości typu 1 — jakie ma charakterystyczne objawy poza łamliwością kości?",
     "mode": "typed", "answers": ["błękitne twardówki, głuchota typu przewodzeniowego, prawidłowa długość życia"]},
    {"category": "Choroby jednogenowe — tkanka łączna i kości", "q": "Wrodzona łamliwość kości typu 2 — jak przebiega i jakie jest rokowanie?",
     "mode": "typed", "answers": ["najcięższa, letalna postać — liczne złamania (w tym żeber) już w życiu płodowym/okołoporodowym, zgon okołoporodowy z powodu powikłań krążeniowo-oddechowych"]},
    {"category": "Choroby jednogenowe — tkanka łączna i kości", "q": "Dysplazja obojczykowo-czaszkowa — jaki gen jest zmutowany i jaki typ dziedziczenia?",
     "mode": "typed", "answers": ["gen RUNX2 (6p21), dziedziczenie autosomalne (opisywane też jako dominujące w części źródeł — tu podano recesywne)"]},
    {"category": "Choroby jednogenowe — tkanka łączna i kości", "q": "Dysplazja obojczykowo-czaszkowa — jaki jest charakterystyczny objaw dotyczący obojczyków?",
     "mode": "typed", "answers": ["aplazja lub hipoplazja obojczyków"]},
    {"category": "Choroby jednogenowe — tkanka łączna i kości", "q": "Zespół Treacher-Collins — jaki gen jest zmutowany i jak inaczej się nazywa?",
     "mode": "typed", "answers": ["gen TCOF1 (lub POLR1D); zwany też dyzostozą żuchwowo-twarzową / zespołem Franceschettiego-Zwahlena-Kleina"]},

    # --- Choroby metaboliczne (spichrzeniowe) ---
    {"category": "Choroby metaboliczne dziedziczne", "q": "Hipercholesterolemia rodzinna — jaki gen jest zmutowany i jaki jest mechanizm?",
     "mode": "typed", "answers": ["gen LDLR (19p13) kodujący receptor LDL — brak/niedobór funkcjonalnych receptorów prowadzi do podwyższonego cholesterolu LDL i przedwczesnej miażdżycy"]},
    {"category": "Choroby metaboliczne dziedziczne", "q": "Hipercholesterolemia rodzinna — czym różni się postać heterozygotyczna od homozygotycznej pod względem stężenia cholesterolu?",
     "mode": "typed", "answers": ["heterozygotyczna: cholesterol 300-500 mg/dl; homozygotyczna: 700-1200 mg/dl (niezależnie od diety i leczenia)"]},
    {"category": "Choroby metaboliczne dziedziczne", "q": "Hemochromatoza — jaki gen jest najczęściej zmutowany i jaki jest sposób dziedziczenia?",
     "mode": "typed", "answers": ["gen HFE (6p21.3), dziedziczenie autosomalne recesywne — najczęstsza dziedziczna choroba metaboliczna wątroby"]},
    {"category": "Choroby metaboliczne dziedziczne", "q": "Hemochromatoza — jaki jest mechanizm choroby i główne narządowe konsekwencje?",
     "mode": "typed", "answers": ["2-3-krotnie zwiększone wchłanianie żelaza w dwunastnicy prowadzi do odkładania żelaza w wątrobie (marskość, rak wątrobowokomórkowy), trzustce, sercu (kardiomiopatia) i skórze (przebarwienia)"]},
    {"category": "Choroby metaboliczne dziedziczne", "q": "Choroba Wilsona — jaki gen jest zmutowany i jaki jest mechanizm?",
     "mode": "typed", "answers": ["gen ATP7B (13q14.3), kodujący ATP-azę transportującą miedź — upośledzony transport miedzi prowadzi do jej gromadzenia w wątrobie, mózgu i innych narządach"]},
    {"category": "Choroby metaboliczne dziedziczne", "q": "Choroba Wilsona — jaki jest charakterystyczny objaw oczny?",
     "mode": "typed", "answers": ["pierścień Kaysera-Fleischera (pomarańczowo-brunatny pierścień na obwodzie rogówki, odkładanie miedzi)"]},

    # --- Choroby nerek ---
    {"category": "Choroby nerek o podłożu genetycznym", "q": "Wielotorbielowatość nerek typu dorosłego (ADPKD) — jaki gen jest najczęściej zmutowany i jaki typ dziedziczenia?",
     "mode": "typed", "answers": ["gen PKD1 (rzadziej PKD2), dziedziczenie autosomalne dominujące"]},
    {"category": "Choroby nerek o podłożu genetycznym", "q": "Wielotorbielowatość nerek typu dziecięcego (ARPKD) — jaki gen jest zmutowany i jaki typ dziedziczenia?",
     "mode": "typed", "answers": ["gen PKHD1, dziedziczenie autosomalne recesywne"]},
    {"category": "Choroby nerek o podłożu genetycznym", "q": "ADPKD vs ARPKD — z jakiej części nefronu powstają torbiele w każdej z tych chorób?",
     "mode": "typed", "answers": ["ADPKD: z różnych części nefronu; ARPKD: z cewek zbiorczych"]},

    # --- Neuropatie dziedziczne ---
    {"category": "Choroby nerwowo-mięśniowe dziedziczne", "q": "Zespół Charcot-Marie-Tooth — co to za grupa chorób i jaka jest częstość występowania?",
     "mode": "typed", "answers": ["grupa dziedzicznych neuropatii ruchowo-czuciowych (zidentyfikowano ponad 100 genów odpowiedzialnych), częstość ok. 1:2500"]},
    {"category": "Choroby nerwowo-mięśniowe dziedziczne", "q": "Zespół Charcot-Marie-Tooth — jakie są charakterystyczne objawy?",
     "mode": "typed", "answers": ["stopa wydrążona, opadanie stopy (chód brodzący), zaniki mięśni kończyn dolnych, parestezje, młotkowate palce stóp"]},

    # --- Genetyka mitochondrialna (Skoczylas) ---
    {"category": "Genetyka mitochondrialna", "q": "Ile genów zawiera ludzki genom mitochondrialny (mtDNA) i jaki ma kształt?",
     "mode": "typed", "answers": ["37 genów, w postaci kolistego (jednego) chromosomu, ok. 16,6 tys. par zasad"]},
    {"category": "Genetyka mitochondrialna", "q": "Jak dziedziczony jest genom mitochondrialny (mtDNA)?",
     "mode": "typed", "answers": ["wyłącznie matczyno (od matki) — w przeciwieństwie do mendlowskiego dziedziczenia DNA jądrowego"]},
    {"category": "Genetyka mitochondrialna", "q": "Dlaczego mtDNA ma wyższą częstotliwość mutacji niż DNA jądrowe?",
     "mode": "typed", "answers": ["z powodu bardziej ograniczonych mechanizmów naprawy DNA oraz bliskości do łańcucha oddechowego (ekspozycja na reaktywne formy tlenu)"]},
    {"category": "Genetyka mitochondrialna", "q": "Jaka jest częstość występowania chorób mitochondrialnych?",
     "mode": "typed", "answers": ["ok. 1 na 5000 osób"]},
    {"category": "Genetyka mitochondrialna", "q": "Co oznacza skrót MELAS i jakie są jego główne objawy?",
     "mode": "typed", "answers": ["miopatia mitochondrialna, encefalopatia, kwasica mleczanowa i epizody podobne do udaru (Mitochondrial Encephalopathy, Lactic Acidosis, Stroke-like episodes); objawy: migrenopodobne bóle głowy, drgawki, cofanie się umiejętności psychoruchowych, głuchota"]},
    {"category": "Genetyka mitochondrialna", "q": "Jakie podstawowe badania laboratoryjne wskazują na MELAS?",
     "mode": "typed", "answers": ["wysoki poziom mleczanu we krwi i płynie mózgowo-rdzeniowym, podwyższona kinaza kreatynowa, kwasica mleczanowa w gazometrii"]},
    {"category": "Genetyka mitochondrialna", "q": "Co oznacza skrót MERRF?",
     "mode": "typed", "answers": ["padaczka miokloniczna z czerwonymi poszarpanymi włóknami (Myoclonic Epilepsy with Ragged Red Fibers)"]},
    {"category": "Genetyka mitochondrialna", "q": "Co oznacza skrót MIDD?",
     "mode": "typed", "answers": ["cukrzyca i głuchota dziedziczone matczynie (Maternally Inherited Diabetes and Deafness)"]},
    {"category": "Genetyka mitochondrialna", "q": "Zespół Leigha — jaka jest częstość i charakter przebiegu?",
     "mode": "typed", "answers": ["ok. 1:40000; ciężka, postępująca choroba neurodegeneracyjna prowadząca zwykle do śmierci we wczesnym dzieciństwie (niewydolność oddechowa)"]},
    {"category": "Genetyka mitochondrialna", "q": "Neuropatia nerwu wzrokowego Lebera (LHON) — jaka jest najczęstsza mutacja i jaki objaw główny?",
     "mode": "typed", "answers": ["mutacja m.11778G>A w genie MT-ND4 (najczęstsza, cięższy przebieg); główny objaw: zanik nerwów wzrokowych (utrata wzroku)"]},
    {"category": "Genetyka mitochondrialna", "q": "Jakie czynniki mogą wyzwalać ujawnienie się LHON u nosicieli mutacji?",
     "mode": "typed", "answers": ["palenie tytoniu, spożycie alkoholu"]},
    {"category": "Genetyka mitochondrialna", "q": "Zespół Kearns-Sayre — jakie są 2 klasyczne objawy oczne i typowy wiek zachorowania?",
     "mode": "typed", "answers": ["postępująca zewnętrzna oftalmoplegia oraz zwyrodnienie barwnikowe siatkówki; początek objawów przed 20. rokiem życia"]},

    # --- Genetyka kliniczna nowotworów (Borkowska) ---
    {"category": "Dziedziczne zespoły nowotworowe", "q": "Jakie jest w przybliżeniu ryzyko zachorowania na raka piersi i jajnika u nosicielek mutacji BRCA1 (dane dla populacji polskiej)?",
     "mode": "typed", "answers": ["ok. 66% ryzyka raka piersi i ok. 44% ryzyka raka jajnika (globalnie podaje się szerzej 50-80% i ok. 40%)"]},
    {"category": "Dziedziczne zespoły nowotworowe", "q": "Jakie jest ryzyko raka piersi i jajnika u nosicielek mutacji BRCA2 (dane z piśmiennictwa)?",
     "mode": "typed", "answers": ["ryzyko raka piersi 31-56%, raka jajnika 11-27%"]},
    {"category": "Dziedziczne zespoły nowotworowe", "q": "Na jakim chromosomie znajduje się gen BRCA1 i jaki jest typ dziedziczenia zespołu BRCA1?",
     "mode": "typed", "answers": ["chromosom 17, dziedziczenie autosomalne dominujące"]},
    {"category": "Dziedziczne zespoły nowotworowe", "q": "Czym jest efekt założyciela w genetyce populacyjnej?",
     "mode": "typed", "answers": ["zjawisko polegające na odłączeniu od populacji wyjściowej niewielkiej grupy osobników, która migruje/zostaje odizolowana na nowym obszarze, co prowadzi do nagromadzenia specyficznych dla tej grupy wariantów genetycznych (np. częstych mutacji BRCA1/2 w niektórych populacjach)"]},
    {"category": "Dziedziczne zespoły nowotworowe", "q": "Siatkówczak (retinoblastoma) — jaki odsetek przypadków jest sporadyczny (somatyczny), a jaki dziedziczny (konstytucyjny)?",
     "mode": "typed", "answers": ["ok. 60% przypadków sporadycznych (zmiany somatyczne), ok. 40% konstytucyjnych (w tym 10-15% rodzinnych i 25-30% sporadycznych rodowodowo, ale z mutacją germinalną de novo)"]},
    {"category": "Dziedziczne zespoły nowotworowe", "q": "Siatkówczak — jaka jest penetracja wariantów patogennych genu RB1 i jaki jest warunek konieczny powstania nowotworu?",
     "mode": "typed", "answers": ["penetracja sięga ok. 90%; do powstania nowotworu konieczna jest utrata funkcji OBU kopii genu RB1 (unieczynnienie białka pRB) — klasyczny przykład teorii dwóch uderzeń Knudsona"]},
    {"category": "Dziedziczne zespoły nowotworowe", "q": "Dlaczego siatkówczak sporadyczny (somatyczny) pojawia się zwykle w nieco późniejszym wieku niż siatkówczak dziedziczny?",
     "mode": "typed", "answers": ["wymaga wystąpienia DWÓCH kolejnych niezależnych mutacji somatycznych w tej samej komórce, co jest zdarzeniem rzadszym i zależnym od dłuższego czasu (długości życia komórki) niż w przypadku już obecnej jednej mutacji konstytucyjnej"]},
]

with open('genetyka_raw.json', encoding='utf-8') as f:
    existing = json.load(f)

before = len(existing)
existing.extend(NEW_ITEMS)
with open('genetyka_raw.json', 'w', encoding='utf-8') as f:
    json.dump(existing, f, ensure_ascii=False, indent=2)

print(f"genetyka_raw.json: {before} -> {len(existing)} (+{len(NEW_ITEMS)})")
