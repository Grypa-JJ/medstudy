# -*- coding: utf-8 -*-
# Propedeutyka chorób wewnętrznych (Rok 3) - RUNDA 2. Źródło: własny folder
# Prezentacje tegoroczne/"Badanie przedmiotowe 2024.pdf" (dr Anna Zawiasa-Bryszewska,
# Klinika Chorób Wewnętrznych i Nefrologii Transplantacyjnej UM w Łodzi) - materiał
# dydaktyczny własnej uczelni.
import json

NEW_ITEMS = [
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Jakie są 4 podstawowe elementy (etapy) badania przedmiotowego?",
     "mode": "typed", "answers": ["oglądanie, obmacywanie (palpacja), opukiwanie (perkusja), osłuchiwanie (auskultacja)"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Jakie są zakresy punktowe skali Glasgow (GCS) odpowiadające poszczególnym stopniom zaburzeń przytomności?",
     "mode": "typed", "answers": ["15-13: łagodne zaburzenia (przytomny); 12-9: umiarkowane zaburzenia; 8-6: nieprzytomny; poniżej: odkorowanie/odmóżdżenie/śmierć mózgu (3 pkt)"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Czym różni się senność od stuporu w ocenie zaburzeń świadomości?",
     "mode": "typed", "answers": ["senność — chory wybudza się pod wpływem łagodnych bodźców; stupor — chorego można wybudzić jedynie silnymi, powtarzanymi bodźcami"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Wymień 3 typy konstytucjonalne budowy ciała.",
     "mode": "typed", "answers": ["asteniczny (leptosomiczny) — smukły, wąska klatka piersiowa; atletyczny — muskularny, szeroki pas barkowy; pykniczny — krótkie kończyny, obfita tkanka tłuszczowa, krótka szyja"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Jakie są przyczyny wzrostu olbrzymiego (>190 cm) typu akromegalicznego?",
     "mode": "typed", "answers": ["nadczynność przedniego płata przysadki (nadmiar hormonu wzrostu) przed okresem dojrzewania — prognatyzm, rozrost kości twarzy, rąk i nóg"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Karłowatość przysadkowa i kretynizm — jakie mają podłoże hormonalne?",
     "mode": "typed", "answers": ["karłowatość przysadkowa — niedoczynność przedniego płata przysadki; kretynizm — niedoczynność tarczycy"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Otyłość w zespole Cushinga — jaki ma charakterystyczny rozkład?",
     "mode": "typed", "answers": ["nagromadzenie tłuszczu głównie na tułowiu, przy prawidłowych (szczupłych) kończynach"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Wymień podstawowe (pierwotne) wykwity skórne: plama, pęcherzyk, krosta, bąbel.",
     "mode": "typed", "answers": ["plama — zmiana zabarwienia w poziomie skóry; pęcherzyk — wykwit wyniosły wypełniony płynem; krosta — wykwit wyniosły wypełniony treścią ropną; bąbel — szybko powstający i ustępujący obrzęk skóry właściwej bez śladu"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Czym różni się nadżerka od owrzodzenia?",
     "mode": "typed", "answers": ["nadżerka to powierzchowny ubytek naskórka, ustępujący BEZ blizny; owrzodzenie to ubytek naskórka i skóry właściwej, ustępujący Z pozostawieniem blizny"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Jak różnicujemy żółtaczkę przedwątrobową od pozawątrobowej na podstawie koloru stolca i moczu?",
     "mode": "typed", "answers": ["żółtaczka przedwątrobowa (hemolityczna): stolec ciemny (więcej bilirubiny), mocz prawidłowy (wyjątek: masywna hemoliza); żółtaczka pozawątrobowa (zastoinowa): stolec odbarwiony, mocz ciemny (bilirubina sprzężona w moczu)"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Jaka jest definicja hipotermii (temperatura wewnętrzna) i gorączki?",
     "mode": "typed", "answers": ["hipotermia: temperatura wewnętrzna (odbyt/błona bębenkowa) <35°C; gorączka: temperatura >38,3°C"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Opisz stopnie (I-IV) odleżyn.",
     "mode": "typed", "answers": ["I — nieblednące zaczerwienienie, ciągłość skóry zachowana; II — obejmuje naskórek i skórę właściwą, pęcherze/płytkie owrzodzenia; III — sięga do tkanki podskórnej; IV — niszczy tkanki miękkie aż do kości i stawów"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Jakie są objawy odwodnienia widoczne w badaniu skóry i błon śluzowych?",
     "mode": "typed", "answers": ["skóra sucha z dodatnim objawem fałdu skórnego, suche śluzówki jamy ustnej, suchy/obłożony język, zapadnięte żyły szyjne"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Wymień przyczyny obrzęków MIEJSCOWYCH.",
     "mode": "typed", "answers": ["zapalne, alergiczne (np. obrzęk Quinckego), zaburzenia odpływu żylnego (np. zakrzepica żył głębokich), zaburzenia odpływu chłonki (np. róża, filarioza)"]},
    {"category": "Badanie ogólne pacjenta i skóra", "q": "Wymień przyczyny obrzęków UOGÓLNIONYCH.",
     "mode": "typed", "answers": ["sercowa (niewydolność serca), wątrobowa (marskość), nerkowa (zespół nerczycowy), hormonalna (niedoczynność tarczycy), niedożywienie, ciąża, polekowe (kortykoterapia)"]},

    # --- EKG — uzupełnienie (Zakład Kardiologii Nieinwazyjnej UM Łódź) ---
    {"category": "EKG — podstawy i interpretacja", "q": "Standardowe 12-odprowadzeniowe EKG składa się z ilu odprowadzeń kończynowych i przedsercowych?",
     "mode": "typed", "answers": ["6 odprowadzeń kończynowych (I, II, III, aVR, aVL, aVF) i 6 przedsercowych (V1-V6)"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Jakie są kolory i lokalizacja standardowych elektrod kończynowych EKG?",
     "mode": "typed", "answers": ["czarna — prawa goleń (uziemienie), czerwona — prawa ręka, żółta — lewa ręka, zielona — lewa goleń"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Gdzie dokładnie umieszcza się elektrody przedsercowe V1, V2 i V4?",
     "mode": "typed", "answers": ["V1 — IV międzyżebrze przy prawym brzegu mostka; V2 — IV międzyżebrze przy lewym brzegu mostka; V4 — V międzyżebrze w linii środkowoobojczykowej lewej"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Jaka jest najczęstsza pomyłka przy podłączaniu elektrod EKG?",
     "mode": "typed", "answers": ["zamiana elektrody czerwonej (prawa ręka) i żółtej (lewa ręka)"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Jak obliczyć częstość akcji serca z zapisu EKG przy przesuwie 25 mm/s?",
     "mode": "typed", "answers": ["300 podzielone przez liczbę dużych kratek między kolejnymi zespołami QRS"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Jaki jest niestandardowy układ odprowadzeń stosowany w Holterze i próbach wysiłkowych?",
     "mode": "typed", "answers": ["układ Masona-Likara"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Do czego służą odprowadzenia V7-V9?",
     "mode": "typed", "answers": ["ocena niedokrwienia w obszarze ściany dolno-podstawnej (tylnej) serca"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Do czego służy prawostronny układ odprowadzeń V3R-V6R?",
     "mode": "typed", "answers": ["diagnostyka podejrzenia zawału prawej komory"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Wymień przyczyny bradykardii zatokowej.",
     "mode": "typed", "answers": ["leki (beta-blokery, naparstnica, leki antyarytmiczne, iwabradyna, diltiazem, werapamil), niedoczynność tarczycy, niewydolność węzła zatokowego"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Jaki jest charakterystyczny obraz EKG trzepotania przedsionków?",
     "mode": "typed", "answers": ["fale trzepotania w kształcie \"zębów piły\""]},
    {"category": "EKG — podstawy i interpretacja", "q": "Jakie są cechy EKG migotania przedsionków?",
     "mode": "typed", "answers": ["rytm niemiarowy, brak widocznych załamków P, obecność fali migotania \"f\""]},
    {"category": "EKG — podstawy i interpretacja", "q": "Jaka jest wartość odstępu PQ w bloku przedsionkowo-komorowym I stopnia?",
     "mode": "typed", "answers": ["powyżej 200 ms (stały, wydłużony odstęp PQ)"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Jakie są kryteria uniesienia odcinka ST wskazujące na ostre niedokrwienie (STEMI)?",
     "mode": "typed", "answers": ["nowe uniesienie ST w punkcie J w co najmniej 2 sąsiednich odprowadzeniach, powyżej określonych progów (np. >0,1 mV w większości odprowadzeń, wyższe progi płciowo-wiekowe w V2-V3)"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Które odprowadzenia EKG odpowiadają zawałowi ściany dolnej, a które ściany bocznej serca?",
     "mode": "typed", "answers": ["ściana dolna: II, III, aVF; ściana boczna: I, aVL, V5-V6"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Które odprowadzenia EKG odpowiadają zawałowi przednio-przegrodowemu?",
     "mode": "typed", "answers": ["V1-V4"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Jakie są przyczyny wydłużenia odstępu QT?",
     "mode": "typed", "answers": ["leki (np. amiodaron, sotalol, klarytromycyna, haloperidol), niedokrwienie mięśnia sercowego, zaburzenia elektrolitowe (hipokaliemia, hipokalcemia, hipomagnezemia)"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Wymień przykłady leków wydłużających odstęp QT z różnych grup.",
     "mode": "typed", "answers": ["przeciwarytmiczne (chinidyna, sotalol, amiodaron), przeciwzakaźne (klarytromycyna, erytromycyna, moksyfloksacyna), przeciwpsychotyczne (haloperidol, chlorpromazyna), przeciwdepresyjne (amitryptylina, imipramina)"]},
    {"category": "EKG — podstawy i interpretacja", "q": "Jakie są przyczyny artefaktów w zapisie EKG?",
     "mode": "typed", "answers": ["złe przewodnictwo (niewystarczające nawilżenie skóry), drgania mięśniowe (np. choroba Parkinsona, chłód), uszkodzenie kabli, zakłócenia elektromagnetyczne"]},
]

with open('propedeutyka_cw_raw.json', encoding='utf-8') as f:
    existing = json.load(f)

before = len(existing)
existing.extend(NEW_ITEMS)
with open('propedeutyka_cw_raw.json', 'w', encoding='utf-8') as f:
    json.dump(existing, f, ensure_ascii=False, indent=2)

print(f"propedeutyka_cw_raw.json: {before} -> {len(existing)} (+{len(NEW_ITEMS)})")
