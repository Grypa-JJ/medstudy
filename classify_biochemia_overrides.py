# -*- coding: utf-8 -*-
import json, re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ENZ = "Giełda — Enzymy (sesje egzaminacyjne)"
WEG = "Giełda — Węglowodany (sesje egzaminacyjne)"
LIP = "Giełda — Lipidy (sesje egzaminacyjne)"
UTL = "Giełda — Utlenianie biologiczne (sesje egzaminacyjne)"
AMK = "Giełda — Aminokwasy i białka (sesje egzaminacyjne)"
KLI = "Giełda — Biochemia kliniczna i metabolizm hemu (sesje egzaminacyjne)"
MOL = "Giełda — Biologia molekularna (sesje egzaminacyjne)"
SYG = "Giełda — Sygnalizacja hormonalna (sesje egzaminacyjne)"
NUK = "Giełda — Metabolizm nukleotydów (sesje egzaminacyjne)"
KSE = "Giełda — Metabolizm ksenobiotyków (sesje egzaminacyjne)"
ONK = "Giełda — Onkogeneza i choroby neurodegeneracyjne (sesje egzaminacyjne)"

# key = substring uniquely identifying the normalized question text (prefix match after stripping "N. ")
OVERRIDES = [
    ("Które z poniższych najlepiej opisuje funkcję autofagii", ONK),
    ("Chcąc wykonać sekwencjonowanie całego genomu (WGS)", MOL),
    ("Które z poniższych stwierdzeń najlepiej opisuje funkcję hamartyny i tuberyny", MOL),
    ("Które aminokwasy ulegają deaminacji nieoksydacyjnej", AMK),
    ("Który enzym bierze udział w biosyntezie pirymidyn", NUK),
    ("Który z poniższych związków NIE generuje rodnika ponadtlenkowego", KSE),
    ("Jaki enzym jest wykorzystywany w domowych glukometrach", ENZ),
    ("Domowe glukometry mierzą poziom glukozy, wykorzystując enzym", ENZ),
    ("Jak działają arsenian i rtęć lub ołów na kompleks dehydrogenazy pirogronianowej", UTL),
    ("Jak działają arsenian i rtęć na kompleks dehydrogenazy pirogronianowej", UTL),
    ("Niedobór którego enzymu prowadzi do rozwoju cytrulinemii", AMK),
    ("Który enzym odpowiada za regenerację NAD+ z NADH podczas beztlenowej glikolizy", WEG),
    ("Zespół błon szklistych (IRDS) u noworodków", LIP),
    ("Wskaż poprawny zestaw: kofaktor", ENZ),
    ("Który intermediat cyklu Krebsa pełni funkcję prekursora w syntezie kwasów tłuszczowych", LIP),
    ("Jaka jest główna funkcja polimerazy DNA beta", MOL),
    ("W jakim kierunku syntetyzowane jest RNA", MOL),
    ("Które funkcje pełni białko WRN", MOL),
    ("Elementem łączącym ścieżkę „zewnętrzną” i „wewnętrzną” w procesie apoptozy", ONK),
    ("Wskaż koenzym/y acetylotransferazy dihydroliponianowej (E2)", UTL),
    ("Wskaż poprawny zestaw koenzymów dla acetylotransferazy dihydroliponianowej (E2)", UTL),
    ("Poprawny zestaw koenzymów dla E2 w kompleksie PDH", UTL),
    ("Białka adaptorowe (np. Grb2, Shc)", SYG),
    ("Jaki materiał należy pobrać od chorego do badania genetycznego", MOL),
    ("Jaki materiał należy pobrać do badania genetycznego", MOL),
    ("Do badania genetycznego (izolacja DNA genomowego) od chorego pobiera się", MOL),
    ("Jaki materiał należy pobrać od chorego do izolacji DNA genomowego", MOL),
    ("Utlenienie hemoglobiny do methemoglobiny", UTL),
    ("Które stwierdzenie NIE odnosi się do rodzinnej hipercholesterolemii", LIP),
    ("Hydroksylacja jest częstą modyfikacją potranslacyjną aminokwasów", AMK),
    ("Wskaż zdanie prawdziwe na temat hialuronidazy", ENZ),
    ("Jaki enzym bierze udział w tworzeniu karbamoiloasparaginianu", NUK),
    ("Co jest prawdziwe o szlaku UPR związanym z kinazą PERK", MOL),
    ("Co jest bezpośrednio hamowane przez 5-fluorouracyl", NUK),
    ("Które z poniższych stwierdzeń dotyczących adrenaliny jest fałszywe", SYG),
    ("Wskaż prawidłową charakterystykę heksokinazy (typy I-III)", WEG),
    ("Wskaż prawidłową charakterystykę glukokinazy (heksokinazy IV)", ENZ),
    ("Heksokinaza (typy I-III) w porównaniu do glukokinazy posiada", WEG),
    ("Acetylo-CoA z mitochondrium do cytoplazmy (szlak lipogenezy)", LIP),
    ("Acetylo-CoA z mitochondrium do syntezy kwasów tłuszczowych", LIP),
    ("Acetylo-CoA do syntezy kwasów tłuszczowych przenoszony jest z mitochondrium", LIP),
    ("Acetylo-CoA z mitochondrium do cytoplazmy przenoszony jest jako", LIP),
    ("Podczas konwersji proinsuliny do insuliny", SYG),
    ("Wskaż BŁĘDNE zdanie dotyczące denaturacji DNA", MOL),
    ("BŁĘDNE zdanie dotyczące denaturacji DNA", MOL),
    ("Sirtuiny to deacetylazy, które jako kofaktora wymagają", ENZ),
    ("Sirtuiny (deacetylazy) do swojej aktywności wymagają jako kofaktora", ENZ),
    ("Do czego służy glutamina w nerkach", AMK),
    ("Wydłużanie kwasów tłuszczowych powyżej 16 atomów węgla", LIP),
    ("Wydłużanie kwasów tłuszczowych w cytoplazmie (elongacja)", LIP),
    ("Które zdanie opisuje cząsteczkę nukleotydu", NUK),
    ("Które zdanie opisuje nukleotyd", NUK),
    ("Wskaż BŁĘDNE zdanie na temat kinazy glicerolowej", ENZ),
    ("Hormon adrenokortykotropowy (ACTH)", AMK),
    ("Synteza jednej cząsteczki palmitynianu (C16) wymaga dostarczenia ilu cząsteczek NADPH", LIP),
    ("Synteza palmitynianu - ile cząsteczek G6P musi ulec przemianie", LIP),
    ("Ile cząsteczek glukozo-6-fosforanu musi wejść w szlak pentozowy, aby dostarczyć 14 NADPH", LIP),
    ("Ile cząsteczek glukozo-6-fosforanu musi ulec przemianie w szlaku pentozowym dla 14 NADPH", LIP),
    ("Ile G6P musi ulec przemianie w szlaku pentozowym dla 14 NADPH", LIP),
    ("Do syntezy triacylogliceroli (TAG)", LIP),
    ("Choroba z defektem transportu jonów chlorkowych i gęstym śluzem", AMK),
    ("Które ze stwierdzeń dotyczących wirusa brodawczaka ludzkiego (HPV)", ONK),
    ("Który aminokwas uczestniczy w autoglikozylacji glikogeniny", WEG),
    ("Wskaż aminokwas uczestniczący w autoglikozylacji glikogeniny", WEG),
    ("Prawdziwe o telomerazie", MOL),
    ("Spośród zdań o telomerazie zaznacz prawidłowe", MOL),
    ("Wskaż zdanie fałszywe na temat syntetazy karbamoilofosforanowej II", NUK),
    ("Wskaż FAŁSZYWE zdanie o syntetazie karbamoilofosforanowej II", NUK),
    ("Wskaż zdanie fałszywe na temat lipofuscyny", KSE),
    ("Prawdziwe o antygenach grup krwi", LIP),
    ("Dinukleotyd nikotynamidoadeninowy (NAD+) jest koenzymem dla", ENZ),
    ("Dinukleotyd nikotynamidoadeninowy (NAD+) jest bezpośrednim koenzymem dla", ENZ),
    ("NAD+ (dinukleotyd nikotynamidoadeninowy) jest bezpośrednim koenzymem dla", ENZ),
    ("Wskaż FAŁSZYWY zestaw informacji na temat szlaku pentozowego", WEG),
    ("Wskaż fałszywy zestaw informacji na temat szlaku pentozowego", WEG),
    ("Wskaż FAŁSZYWY zestaw informacji o szlaku pentozowym", WEG),
    ("cAMP (cykliczny adenozyno-3',5'-monofosforan) jest rozkładany przez", SYG),
    ("Enzymem odpowiedzialnym za rozkład cAMP do 5'-AMP przy udziale wody", SYG),
    ("Kluczowym białkiem wiążącym receptor insulinowy z wewnątrzkomórkowymi ścieżkami", SYG),
    ("Kluczowym białkiem adaptorowym wiążącym receptor insulinowy", SYG),
    ("Które związki są dobrymi substratami do glukoneogenezy", WEG),
    ("Jakie szlaki glukoneogenezy występują u człowieka", WEG),
    ("Glukoneogeneza u człowieka zachodzi w lokalizacji", WEG),
    ("Taq polimeraza, wyizolowana z bakterii", MOL),
    ("Przykładem fosforylacji substratowej w cyklu Krebsa i glikolizie", WEG),
    ("Przykładem fosforylacji substratowej w glikolizie i cyklu Krebsa", WEG),
    ("Przykładem fosforylacji substratowej (bezpośredni transfer P na ADP)", WEG),
    ("Czym jest hemoglobina względem budowy chemicznej i funkcjonalnej", AMK),
    ("Czym jest hemoglobina pod względem budowy chemicznej", AMK),
    ("U podłoża nowotworów leżą zaburzenia ekspresji genów", ONK),
    ("Wskaż zdanie prawdziwe na temat hialuronidazy", ENZ),
    ("Diagnoza choroby Bergera (nefropatia IgA)", KLI),
    ("Diagnoza nefropatii IgA (choroba Bergera)", KLI),
    ("Wybierz zdanie prawdziwe o cyklu mocznikowym", AMK),
    ("Wskaż zestaw markerów zawału mięśnia sercowego", KLI),
    ("Cykl nukleotydów purynowych (anapleroza cyklu Krebsa)", NUK),
    ("Cykl nukleotydów purynowych pełni ważną rolę w anaplerozie cyklu Krebsa", NUK),
    ("Progeryna (zespół Hutchinsona-Gilforda) powstaje", ONK),
    ("Progeryna, białko odpowiedzialne za zespół HGPS", ONK),
    ("Wskaż zdanie FAŁSZYWE na temat białka SSB w replikacji DNA", MOL),
    ("Aktywność 5'->3' egzonukleolityczną (usuwanie starterów) posiada u bakterii", MOL),
    ("Hydroksylacja reszt Pro i Lys w kolagenie", AMK),
    ("Hydroksylacja reszt Pro i Lys w prokolagenie", AMK),
    ("Aminokwas w trakcie syntezy aminoacylo-tRNA", MOL),
    ("Hormony tarczycy (T3, T4) posiadają swoje specyficzne receptory", SYG),
    ("Białka GAP regulują aktywność białka Ras", SYG),
    ("Fosforylacja karboksylazy acetylo-CoA (ACC) przez kinazę AMPK", LIP),
    ("Tyrozynaza, kodowana przez gen TYR", AMK),
    ("Anacetrapib i torcetrapib to inhibitory białka CETP", LIP),
    ("Adenozyna jest substratem dla kinazy adenozynowej", NUK),
    ("W jakich populacjach najczęściej utrzymuje się mutacja anemii sierpowej", KLI),
    ("Co przedstawia wzór chemiczny zawierający zasadę azotową (tyminę)", MOL),
    ("Który z aminokwasów jako pierwszy uczestniczy w syntezie pierścienia pirymidynowego", NUK),
    ("Który aminokwas jest wyłącznie ketogenny i nie może być użyty do GNG", AMK),
    ("Wskaż zdanie fałszywe na temat syntetazy karbamoilofosforanowej II (CPS II)", NUK),
    ("Wskaż FAŁSZYWY zdanie o syntetazie karbamoilofosforanowej II (CPS II)", NUK),
    ("Arsen (As3+) wpływa toksycznie na aktywność PDH", UTL),
    ("Paklitaksel (Taxol) działa przeciwnowotworowo", ONK),
    ("Który z leków NIE jest stosowany w terapii przeciwnowotworowej (leczy cholesterol)", ONK),
    ("Podawanie kofeiny powoduje wzrost stężenia WKT", LIP),
    ("Dlaczego spożywanie kofeiny powoduje wzrost stężenia wolnych kwasów tłuszczowych", LIP),
    ("Pierwszym bezpośrednim skutkiem połączenia EGF z receptorem EGFR", SYG),
    # unclassified batch
    ("Z ciężkimi reakcjami skórnymi po podaniu allopurynolu związany jest wariant", KSE),
    ("Pelagra jest wynikiem niedoboru", UTL),
    ("Niski wzrost, krępa budowa ciała, brak talii i krótka płetwiasta szyja u kobiet to objawy", MOL),
    ("Niski wzrost, krótka płetwiasta szyja i koślawość łokci u kobiet to objawy", MOL),
    ("Który ze związków NIE jest źródłem tlenku azotu (NO) w organizmie", SYG),
    ("Gdzie syntetyzowane są neurohormony", SYG),
    ("Wybierz prawidłowe zdanie dotyczące mechanizmu działania paklitakselu", ONK),
    ("Mechanizm działania paklitakselu", ONK),
    ("Jakie są produkty reakcji katalizowanej przez katalazę", KSE),
    ("Produkty reakcji katalizowanej przez katalazę", KSE),
    ("Do czego służy glutamina w nerkach i innych tkankach", AMK),
    ("Do czego służy glutamina w tkankach", AMK),
    ("Do czego służy glutamina w organizmie człowieka", AMK),
    ("Fosfatydyloetanoloamina może powstawać bezpośrednio poprzez dekarboksylację", LIP),
    ("Fosfatydyloetanoloamina może powstawać bezpośrednio w wyniku dekarboksylacji", LIP),
    ("Jakie przekaźnictwo charakteryzuje tlenek azotu (NO) jako cząsteczkę sygnałową", SYG),
    ("W reakcji deamidacji glutaminy uczestniczy", AMK),
    ("Toczeń rumieniowaty układowy (SLE) jest chorobą związaną z zaburzeniami", MOL),
    ("Toczeń rumieniowaty układowy (SLE) jest chorobą autoimmunologiczną związaną z zaburzeniami", MOL),
    ("Toczeń rumieniowaty układowy (SLE) wiąże się z zaburzeniami", MOL),
    ("Toczeń rumieniowaty układowy (SLE) jest związany m.in. z zaburzeniami", MOL),
    ("Toczeń rumieniowaty układowy (SLE) wiąże się m.in. z autoprzeciwciałami", MOL),
    ("Toczeń rumieniowaty układowy (SLE) jest związany z patologiczną autoimmunizacją", MOL),
    ("Spośród niżej podanych wybierz metylotransferazę zachowawczą", MOL),
    ("Która metylotransferaza odpowiada za kopiowanie wzoru metylacji", MOL),
    ("Metylotransferaza zachowawcza (kopiowanie wzoru)", MOL),
    ("Wskaż prawdziwe stwierdzenie dotyczące fosforylacji karboksylazy acetylo-CoA (ACC)", LIP),
    ("W której z wymienionych tkanek praktycznie NIE zachodzi szlak pentozofosforanowy", WEG),
    ("Szlak pentozofosforanowy praktycznie NIE zachodzi w", WEG),
    ("W reakcji amidacji glutaminianu (powstawanie glutaminy) uczestniczy", AMK),
    ("W Hb Milwaukee dochodzi do zmiany waliny w pozycji 67 beta na", KLI),
    ("Jak zinterpretować wynik FISH: 3 komórki", MOL),
    ("Glutamina w organizmie człowieka NIE bierze udziału w", AMK),
    ("Przewlekła białaczka szpikowa (CML) i chłoniak Burkitta wywołane są przez", ONK),
    ("Które z poniższych związków są neuroprzekaźnikami", SYG),
    ("Hemofilia C", AMK),
    ("Gdzie syntetyzowane są neurohormony takie jak oksytocyna czy wazopresyna", SYG),
    ("Niedobór tryptofanu (prekursora niacyny) prowadzi do występowania", UTL),
    ("Co przedstawia wzór chemiczny zawierający jądro izoalloksazynowe, rybitol", UTL),
    ("Glukozo-6-fosfataza występuje u człowieka w", WEG),
]

def norm(qtext):
    return re.sub(r'^\d+\.\s*', '', qtext).strip()

d = json.load(open('C:/Users/Jakub/AppData/Local/Temp/claude/C--Users-Jakub-Desktop-Prod-projekt-w-budowie/5b271756-3497-41b2-84e6-8e1d1037c3aa/scratchpad/questions_dump.json', encoding='utf-8'))
auto = json.load(open('C:/Users/Jakub/AppData/Local/Temp/claude/C--Users-Jakub-Desktop-Prod-projekt-w-budowie/5b271756-3497-41b2-84e6-8e1d1037c3aa/scratchpad/biochemia_categorization_draft.json', encoding='utf-8'))

results = {}
for i, q in enumerate(d, start=1):
    key = norm(q['q'])
    matched = None
    for prefix, cat in OVERRIDES:
        if key.startswith(prefix):
            matched = cat
            break
    if matched:
        results[i] = matched
    elif str(i) in auto:
        results[i] = auto[str(i)]

missing = [(i, d[i-1]['q']) for i in range(1, len(d)+1) if i not in results]
print('total classified:', len(results), '/', len(d))
print('missing:', len(missing))
for i, qt in missing[:60]:
    print(i, qt[:110])

out = 'C:/Users/Jakub/AppData/Local/Temp/claude/C--Users-Jakub-Desktop-Prod-projekt-w-budowie/5b271756-3497-41b2-84e6-8e1d1037c3aa/scratchpad/biochemia_categorization_final.json'
json.dump(results, open(out, 'w', encoding='utf-8'), ensure_ascii=False)
print('written', out)
