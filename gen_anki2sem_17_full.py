# -*- coding: utf-8 -*-
import json

def fix(s):
    return s.replace("fi ", "fi").replace("fl ", "fl").strip()

Q = []
def add(cat, q, o, a, rationale):
    Q.append({"category": cat, "q": fix(q), "o": [fix(x) for x in o], "a": a, "rationale": rationale})

C17 = "17. Przewód pokarmowy cz. II — cewa pokarmowa"

add(C17, "Ile wynosi czas życia powierzchownych komórek śluzowych żołądka?",
    ["4-7 dni", "6 miesięcy", "20 lat", "24 godziny"],
    0,
    "Powierzchowne komórki śluzowe żołądka, nieustannie narażone na kontakt z kwaśną treścią żołądkową, mają stosunkowo krótki cykl życiowy wynoszący 4-7 dni, po czym są zastępowane nowymi komórkami różnicującymi się z komórek macierzystych cieśni.")

add(C17, "Ile wynosi całkowity obrót pętli jelitowych w toku rozwoju?",
    ["270 stopni", "90 stopni", "360 stopni", "180 stopni"],
    0,
    "Pętle jelitowe, w toku swojego powrotu z fizjologicznej przepukliny pępowinowej do jamy brzusznej, wykonują łącznie obrót o 270 stopni w kierunku przeciwnym do ruchu wskazówek zegara, licząc od pierwszego, wstępnego obrotu o 90 stopni.")

add(C17, "Co stanowi granicę między nabłonkami pochodzenia ektodermalnego i endodermalnego w kanale odbytu?",
    ["Linia grzebieniowa (kresa odbytowo-odbytnicza)", "Zastawka Bauhina", "Zwieracz wewnętrzny odbytu", "Błona śluzowa odbytnicy"],
    0,
    "Linia grzebieniowa (kresa odbytowo-odbytnicza) w kanale odbytu wyznacza ostrą granicę histologiczną między nabłonkiem pochodzenia endodermalnego (jednowarstwowy walcowaty, wywodzący się z jelita pierwotnego tylnego) a nabłonkiem pochodzenia ektodermalnego (wielowarstwowy płaski, wywodzący się z dołka odbytowego).")

add(C17, "Z czego powstają mięśnie gładkie dolnego odcinka przełyku?",
    ["Z listka trzewnego mezodermy bocznej", "Z mezenchymy łuków gardłowych", "Z somitów szyjnych", "Z endodermy jelita pierwotnego przedniego"],
    0,
    "Mięśnie gładkie budujące dolną jedną trzecią przełyku (w odróżnieniu od górnej, szkieletowej części pochodzącej z mezenchymy łuków gardłowych) wywodzą się z listka trzewnego mezodermy bocznej, otaczającego jelito pierwotne przednie.")

add(C17, "Co zawiera mikrokosmek błony komórkowej i jaka jest jego rola strukturalna?",
    ["Filamenty aktynowe, stanowiące szkielet mechaniczny wypustki", "Mikrotubule, identycznie jak w rzęskach", "Filamenty pośrednie keratynowe", "Mikrokosmek jest pozbawiony jakiegokolwiek szkieletu wewnętrznego"],
    0,
    "Rdzeń każdego mikrokosmka wypełniony jest wiązką filamentów aktynowych, biegnących równolegle do jego długiej osi i zakotwiczonych w leżącej pod nim siateczce końcowej — ta struktura nadaje mikrokosmkowi sztywność mechaniczną, niezbędną przy zwiększaniu powierzchni chłonnej komórki.")

add(C17, "Co zostaje wciągnięte do szypuły bocznej po utworzeniu fałdu ogonowego?",
    ["Omocznia", "Przewód żółtkowo-jelitowy", "Struna grzbietowa", "Cewa sercowa"],
    0,
    "Powstanie fałdu ogonowego w toku fałdowania zarodka w osi głowowo-ogonowej powoduje wciągnięcie omoczni do formującej się szypuły bocznej (przyszłego sznura pępowinowego) — analogicznie fałdowanie boczne wciąga do tej samej szypuły przewód żółtkowo-jelitowy.")

add(C17, "Jaka błona ściany jelita różnicuje się w ostatniej kolejności w rozwoju zarodkowym?",
    ["Blaszka mięśniowa błony śluzowej", "Błona surowicza", "Nabłonek pokrywający błonę śluzową", "Błona podśluzowa"],
    0,
    "Spośród wszystkich warstw budujących ścianę jelita, blaszka mięśniowa błony śluzowej — cienka warstwa mięśni gładkich oddzielająca błonę śluzową od podśluzowej — różnicuje się jako ostatnia, już po ukształtowaniu się pozostałych elementów ściany.")

add(C17, "Co stanowi najbardziej zewnętrzną warstwę przewodu pokarmowego?",
    ["Błona surowicza", "Błona mięśniowa", "Błona podśluzowa", "Blaszka właściwa błony śluzowej"],
    0,
    "Błona surowicza, pokryta jednowarstwowym nabłonkiem płaskim surowiczym i zbudowana z tkanki łącznej luźnej, stanowi najbardziej zewnętrzną warstwę ściany przewodu pokarmowego na większości jego długości.")

add(C17, "Gdzie znajdują się gruczoły przełykowe?",
    ["W błonie podśluzowej przełyku", "W błonie śluzowej żołądka", "W błonie mięśniowej jelita cienkiego", "W przydance jelita grubego"],
    0,
    "Właściwe gruczoły przełykowe, wydzielające śluz nawilżający i chroniący błonę śluzową przełyku, zlokalizowane są w jego błonie podśluzowej, rozproszone na całej długości narządu.")

add(C17, "Co jest głównym produktem ślinianek podjęzykowych?",
    ["Śluz", "Alfa-amylaza", "Kwas solny", "Pepsynogen"],
    0,
    "Ślinianki podjęzykowe, zdominowane przez cewki śluzowe, wydzielają głównie gęsty śluz — w odróżnieniu od czysto surowiczej ślinianki przyusznej, produkującej wodnistą wydzielinę bogatą w alfa-amylazę.")

add(C17, "Gdzie znajdują się gruczoły przełykowe wpustowe?",
    ["W błonie śluzowej przełyku, w pobliżu połączenia przełyku z żołądkiem", "W błonie podśluzowej przełyku, na całej jego długości", "W błonie śluzowej żołądka, w okolicy dna", "W błonie mięśniowej przełyku"],
    0,
    "Gruczoły przełykowe wpustowe, w odróżnieniu od właściwych gruczołów przełykowych zlokalizowanych w błonie podśluzowej, znajdują się w błonie śluzowej przełyku i są ograniczone do jego dolnego odcinka, w pobliżu połączenia z żołądkiem.")

add(C17, "Jaki typ mięśni znajduje się w górnej, środkowej i dolnej jednej trzeciej przełyku?",
    ["Górna 1/3 — mięśnie szkieletowe; środkowa — mięśnie szkieletowe i gładkie; dolna 1/3 — mięśnie gładkie", "Wszystkie trzy odcinki zbudowane są wyłącznie z mięśni gładkich", "Górna 1/3 — mięśnie gładkie; dolna — mięśnie szkieletowe, w odwrotnej kolejności", "Przełyk nie zawiera żadnych elementów mięśni szkieletowych"],
    0,
    "Błona mięśniowa przełyku wykazuje stopniowe przejście typu tkanki mięśniowej: górna jedna trzecia zbudowana jest wyłącznie z mięśni poprzecznie prążkowanych, środkowa zawiera mieszaninę włókien szkieletowych i gładkich, a dolna jedna trzecia zbudowana jest już wyłącznie z mięśni gładkich.")

add(C17, "Czym otoczony jest przełyk na większości swojej długości?",
    ["Przydanką (błona surowicza pokrywa jedynie mały, dystalny odcinek w jamie otrzewnej)", "Błoną surowiczą na całej długości", "Wyłącznie skórą właściwą", "Torebką łącznotkankową analogiczną do torebki nerki"],
    0,
    "Przełyk, w przeciwieństwie do większości przewodu pokarmowego położonego wewnątrzotrzewnowo, otoczony jest na przeważającej długości przydanką — jedynie krótki, dystalny odcinek znajdujący się już w jamie otrzewnej pokryty jest właściwą błoną surowiczą.")

add(C17, "Jaki enzym żołądkowy zapoczątkowuje trawienie białek?",
    ["Pepsyna", "Trypsyna", "Chymotrypsyna", "Amylaza"],
    0,
    "Pepsyna, powstająca z nieaktywnego pepsynogenu pod wpływem kwaśnego środowiska żołądka, jest głównym enzymem proteolitycznym żołądka, zapoczątkowującym trawienie białek pokarmowych jeszcze przed ich dalszym rozkładem przez enzymy trzustkowe w dwunastnicy.")

add(C17, "Wymień cztery części żołądka.",
    ["Wpust, dno, trzon i część odźwiernikowa", "Wpust, ciało, szyjkę i koniuszek", "Górę, środek, dół i podstawę", "Głowę, trzon i ogon"],
    0,
    "Żołądek dzieli się anatomicznie na cztery główne części: wpust (miejsce połączenia z przełykiem), dno (górna, kopulasta część), trzon (największa, centralna część) oraz część odźwiernikową (łączącą się z dwunastnicą).")

add(C17, "Jaki nabłonek występuje w błonie śluzowej odbytnicy przed połączeniem odbytowo-odbytniczym?",
    ["Nabłonek jednowarstwowy walcowaty", "Nabłonek wielowarstwowy płaski nierogowaciejący", "Nabłonek wielorzędowy walcowaty urzęsiony", "Nabłonek jednowarstwowy sześcienny"],
    0,
    "Błona śluzowa odbytnicy, zanim dotrze do linii grzebieniowej (połączenia odbytowo-odbytniczego), pokryta jest typowym dla jelita grubego nabłonkiem jednowarstwowym walcowatym — dopiero za tą granicą przechodzi w nabłonek wielowarstwowy płaski.")

add(C17, "Co wyściełają powierzchniowe komórki śluzowe żołądka i w co bogaty jest ich śluz?",
    ["Wyściełają światło żołądka i dołki żołądkowe; ich śluz jest bogaty w jony wodorowęglanowe", "Wyściełają wyłącznie dno gruczołów żołądkowych; ich śluz jest bogaty w jony wapniowe", "Wyściełają błonę podśluzową żołądka; ich śluz zawiera pepsynogen", "Wyściełają wyłącznie odźwiernik"],
    0,
    "Powierzchniowe komórki śluzowe wyściełają zarówno światło żołądka, jak i prowadzące w głąb błony śluzowej dołki żołądkowe — wydzielany przez nie śluz jest bogaty w jony wodorowęglanowe, tworząc warstwę ochronną neutralizującą kwas solny.")

add(C17, "Gdzie znajdują się komórki macierzyste nabłonka żołądka?",
    ["W cieśni, między dołkiem żołądkowym a gruczołem żołądkowym", "Wyłącznie w dnie gruczołów żołądkowych", "W blaszce mięśniowej błony śluzowej", "W błonie podśluzowej żołądka"],
    0,
    "Komórki macierzyste odpowiedzialne za ciągłą odnowę nabłonka żołądka zlokalizowane są w cieśni — wąskim, przejściowym odcinku łączącym dołek żołądkowy z leżącym głębiej gruczołem żołądkowym.")

add(C17, "Do czego prowadzą dołki żołądkowe?",
    ["Do gruczołów żołądkowych — rozgałęzionych gruczołów cewkowych", "Bezpośrednio do błony podśluzowej żołądka", "Do przełyku", "Do dwunastnicy"],
    0,
    "Dołki żołądkowe, wpuklenia nabłonka powierzchniowego żołądka, prowadzą w głąb błony śluzowej do rozgałęzionych gruczołów cewkowych — gruczołów żołądkowych właściwych, w których zachodzi produkcja kwasu solnego i enzymów trawiennych.")

add(C17, "Co zawarte jest w blaszce właściwej błony śluzowej żołądka?",
    ["Włókna mięśni gładkich, komórki limfatyczne, naczynia włosowate i naczynia limfatyczne", "Wyłącznie komórki nabłonkowe, bez elementów tkanki łącznej", "Wyłącznie gruczoły trzustkowe", "Chrząstka szklista"],
    0,
    "Blaszka właściwa błony śluzowej żołądka, wypełniająca przestrzeń między gruczołami żołądkowymi, zawiera rozproszone włókna mięśni gładkich, komórki limfatyczne oraz gęstą sieć naczyń włosowatych i limfatycznych, odżywiających nabłonek gruczołowy.")

add(C17, "Z czego zbudowana jest blaszka mięśniowa błony śluzowej żołądka?",
    ["Z mięśni gładkich", "Z mięśni poprzecznie prążkowanych", "Z tkanki chrzęstnej", "Z tkanki łącznej zbitej, bez udziału komórek mięśniowych"],
    0,
    "Blaszka mięśniowa błony śluzowej żołądka, oddzielająca błonę śluzową od podśluzowej, zbudowana jest z cienkiej warstwy mięśni gładkich, których skurcz umożliwia niezależne od reszty ściany ruchy fałdów błony śluzowej.")

add(C17, "Wymień cztery komórki wydzielnicze nabłonka gruczołów żołądkowych.",
    ["Komórki śluzowe szyjki, komórki okładzinowe, komórki główne (zymogenne) i komórki enteroendokrynowe", "Enterocyty, komórki kubkowe, komórki Panetha i komórki M", "Hepatocyty, cholangiocyty, komórki Kupffera i komórki Ito", "Tyreocyty, komórki C, komórki główne i oksyfilne"],
    0,
    "Nabłonek gruczołów żołądkowych zawiera cztery odrębne, wyspecjalizowane populacje komórek wydzielniczych: komórki śluzowe szyjki, komórki okładzinowe (produkujące kwas solny), komórki główne/zymogenne (produkujące pepsynogen i lipazę) oraz komórki enteroendokrynowe.")

add(C17, "Jaka jest budowa komórek śluzowych szyjki żołądka?",
    ["Walcowate komórki z okrągłymi jądrami i ziarnistościami wydzielniczymi w częściach szczytowych", "Duże, piramidowe komórki z licznymi mitochondriami", "Płaskie komórki bez organelli", "Komórki wielojądrzaste, identyczne z syncytiotrofoblastem"],
    0,
    "Komórki śluzowe szyjki, zlokalizowane w górnej części gruczołu żołądkowego, są komórkami walcowatymi z okrągłymi jądrami komórkowymi i ziarnistościami wydzielniczymi skupionymi w ich szczytowej części, gotowymi do wydzielenia ochronnego śluzu.")

add(C17, "Jakie komórki nabłonka gruczołów żołądkowych wytwarzają kwas solny (HCl)?",
    ["Komórki okładzinowe", "Komórki główne", "Komórki śluzowe szyjki", "Komórki enteroendokrynowe"],
    0,
    "Komórki okładzinowe, zlokalizowane między komórkami śluzowymi szyjki a głębszymi częściami gruczołu, są jedynymi komórkami nabłonka żołądkowego zdolnymi do produkcji kwasu solnego, kluczowego dla trawienia i ochrony przeciwbakteryjnej.")

add(C17, "Gdzie znajdują się komórki okładzinowe w gruczole żołądkowym?",
    ["Między komórkami śluzowymi szyjki i w głębszych częściach gruczołu", "Wyłącznie w dnie gruczołu, poniżej komórek głównych", "Wyłącznie w dołkach żołądkowych", "W blaszce mięśniowej błony śluzowej"],
    0,
    "Komórki okładzinowe rozmieszczone są w środkowej i głębszej części gruczołu żołądkowego — pojawiają się już między komórkami śluzowymi szyjki i kontynuują w głąb, aż do okolicy komórek głównych.")

add(C17, "Jaka jest budowa komórek okładzinowych?",
    ["Duże, owalne lub piramidalne, z 1 lub 2 jądrami komórkowymi i dużą liczbą mitochondriów (stąd kwasochłonność)", "Małe, płaskie komórki bez organelli", "Komórki wielojądrzaste z licznymi ziarnistościami śluzu", "Komórki identyczne z podocytami kłębuszka nerkowego"],
    0,
    "Komórki okładzinowe wyróżniają się charakterystyczną budową: są duże, o kształcie owalnym lub piramidalnym, posiadają jedno lub dwa jądra komórkowe oraz wyjątkowo dużą liczbę mitochondriów, nadających im silną kwasochłonność w barwieniu H+E — odzwierciedla to ich wysoki koszt energetyczny produkcji kwasu solnego.")

add(C17, "Jaka jest charakterystyczna ultrastrukturalna cecha aktywnych komórek okładzinowych?",
    ["Kanalik wewnątrzkomórkowy na szczytowej powierzchni błony komórkowej z mikrokosmkami", "Liczne ciałka blaszkowate", "Rozbudowane RER zajmujące większość cytoplazmy", "Brak jakichkolwiek organelli błonowych"],
    0,
    "Aktywne, wydzielające komórki okładzinowe wykazują charakterystyczne, głębokie wpuklenie błony komórkowej — kanalik wewnątrzkomórkowy, którego powierzchnia dodatkowo pokryta jest licznymi mikrokosmkami, znacząco zwiększającymi powierzchnię wydzielania kwasu solnego do światła gruczołu.")

add(C17, "Co robi anhydraza węglanowa w komórce okładzinowej?",
    ["Katalizuje przekształcanie wody i CO2 w jony HCO3- i H+", "Katalizuje trawienie białek do peptydów", "Aktywuje pepsynogen do pepsyny", "Neutralizuje nadmiar kwasu solnego"],
    0,
    "Anhydraza węglanowa, obecna w cytoplazmie komórki okładzinowej, katalizuje reakcję wody i dwutlenku węgla do jonów wodorowęglanowych (HCO3-) i wodorowych (H+), stanowiących bezpośredni substrat do wytworzenia kwasu solnego.")

add(C17, "Jak transportowane są jony H+ i HCO3- z komórki okładzinowej?",
    ["H+ jest transportowany ze szczytu komórki; HCO3- z części podstawnej komórki", "H+ jest transportowany z części podstawnej; HCO3- ze szczytu, w odwrotnej konfiguracji", "Oba jony są transportowane wyłącznie ze szczytu komórki", "Żaden z jonów nie opuszcza komórki okładzinowej"],
    0,
    "Powstałe w komórce okładzinowej jony są transportowane w przeciwnych kierunkach: jon H+ jest aktywnie wydzielany przez błonę szczytową do światła gruczołu (tworząc kwas solny), natomiast jon HCO3- jest uwalniany przez błonę podstawną do krwi i blaszki właściwej.")

add(C17, "W jaki sposób błona śluzowa żołądka utrzymuje bardziej obojętne pH w swojej tkance mimo produkcji kwasu solnego?",
    ["Zostają uwolnione wodorowęglany przez komórki okładzinowe do blaszki właściwej", "Poprzez wydzielanie dodatkowej ilości kwasu solnego neutralizującego się samoistnie", "Poprzez fagocytozę nadmiaru jonów wodorowych przez makrofagi", "Błona śluzowa żołądka nie utrzymuje odmiennego pH od światła żołądka"],
    0,
    "Mimo intensywnej produkcji silnie kwaśnej wydzieliny do światła żołądka, sama tkanka błony śluzowej pozostaje względnie obojętna dzięki lokalnemu uwalnianiu wodorowęglanów przez komórki okładzinowe do blaszki właściwej — zjawisko to nazywane jest alkalicznym przypływem.")

add(C17, "Jaka jest rola glikoproteiny dodatkowo wydzielanej przez komórki okładzinowe?",
    ["Jest niezbędna do wchłaniania witaminy B12 w jelicie cienkim", "Aktywuje pepsynogen do pepsyny", "Neutralizuje nadmiar kwasu solnego", "Stymuluje wydzielanie gastryny"],
    0,
    "Komórki okładzinowe, poza kwasem solnym, produkują również czynnik wewnętrzny (glikoproteinę) niezbędny do prawidłowego wchłaniania witaminy B12 w końcowym odcinku jelita cienkiego.")

add(C17, "W jaki sposób stymulowana jest aktywność wydzielnicza komórek okładzinowych?",
    ["Poprzez unerwienie przywspółczulne oraz drogą parakrynną — uwalnianie histaminy i gastryny przez komórki enteroendokrynowe", "Wyłącznie poprzez bezpośredni kontakt z treścią pokarmową", "Wyłącznie poprzez unerwienie współczulne", "Aktywność komórek okładzinowych nie podlega żadnej regulacji"],
    0,
    "Wydzielanie kwasu solnego przez komórki okładzinowe podlega podwójnej regulacji: bezpośredniemu unerwieniu przywspółczulnemu (nerw błędny) oraz sygnalizacji parakrynnej — histamina i gastryna uwalniane przez pobliskie komórki enteroendokrynowe wzmagają aktywność wydzielniczą komórek okładzinowych.")

add(C17, "Gdzie przeważają komórki główne (zymogenne) w gruczole żołądkowym?",
    ["W dolnej części gruczołów żołądkowych", "W górnej części, przy dołku żołądkowym", "Wyłącznie w cieśni gruczołu", "Rozmieszczone są równomiernie na całej długości gruczołu"],
    0,
    "Komórki główne (zymogenne), produkujące enzymy trawienne, przeważają w dolnej (dennej) części gruczołów żołądkowych, w odróżnieniu od komórek śluzowych szyjki dominujących w części górnej.")

add(C17, "Jaka jest budowa ultrastrukturalna komórek głównych (zymogennych)?",
    ["Bogate w RER, z ziarnistościami wydzielniczymi w części szczytowej", "Bogate w SER, bez żadnych ziarnistości wydzielniczych", "Wielojądrzaste, z licznymi wakuolami lipidowymi", "Pozbawione jakichkolwiek organelli błonowych"],
    0,
    "Komórki główne, wyspecjalizowane w syntezie i wydzielaniu białkowych enzymów trawiennych, wykazują typową dla komórek wydzielniczych białka budowę: bogato rozwinięte szorstkie retikulum endoplazmatyczne (RER) oraz liczne ziarnistości wydzielnicze skupione w ich szczytowej części.")

add(C17, "Co produkują komórki główne (zymogenne)?",
    ["Pepsynogen i lipazę żołądkową", "Kwas solny i czynnik wewnętrzny", "Gastrynę i somatostatynę", "Śluz i wodorowęglany"],
    0,
    "Komórki główne produkują dwa kluczowe enzymy trawienne: pepsynogen (nieaktywny prekursor pepsyny, trawiącej białka) oraz lipazę żołądkową, rozpoczynającą wstępne trawienie tłuszczów jeszcze w żołądku.")

add(C17, "Co znajduje się w ziarnistościach wydzielniczych komórek głównych?",
    ["Pepsynogen", "Gotowa, aktywna pepsyna", "Kwas solny", "Gastryna"],
    0,
    "Ziarnistości wydzielnicze komórek głównych zawierają nieaktywny pepsynogen — dopiero po wydzieleniu do silnie kwaśnego środowiska żołądka ulega on autokatalitycznemu przekształceniu w aktywną pepsynę.")

add(C17, "Jak powstaje pepsyna z pepsynogenu?",
    ["Pepsynogen w kwaśnym środowisku przekształca się w pepsynę", "Pepsynogen przekształca się w pepsynę pod wpływem enteropeptydazy jelitowej", "Pepsyna powstaje bezpośrednio, bez nieaktywnego prekursora", "Pepsynogen przekształca się w pepsynę wyłącznie w zasadowym środowisku dwunastnicy"],
    0,
    "Nieaktywny pepsynogen, wydzielany przez komórki główne, ulega autokatalitycznemu przekształceniu w aktywną pepsynę pod wpływem silnie kwaśnego środowiska żołądka wytworzonego przez komórki okładzinowe.")

add(C17, "W jakim zakresie pH pepsyna jest najbardziej aktywna?",
    ["1,8-3,5", "6,5-7,5", "8,0-9,0", "0,1-0,5"],
    0,
    "Pepsyna wykazuje maksymalną aktywność enzymatyczną w zakresie pH 1,8-3,5, typowym dla światła żołądka — poza tym zakresem, np. w bardziej obojętnym środowisku dwunastnicy, ulega ona dezaktywacji.")

add(C17, "Co wydzielają komórki enteroendokrynowe (typu EC) i jaka jest ich funkcja?",
    ["Serotoninę; działają endokrynnie lub parakrynnie", "Wyłącznie gastrynę, działając endokrynnie", "Wyłącznie somatostatynę, działając parakrynnie", "Insulinę, działając endokrynnie"],
    0,
    "Komórki enteroendokrynowe typu EC, zlokalizowane w podstawnej części gruczołów żołądkowych, wydzielają serotoninę, mogącą działać zarówno endokrynnie (poprzez krew), jak i parakrynnie (na sąsiednie komórki).")

add(C17, "Co produkują komórki G i gdzie się znajdują?",
    ["Gastrynę; komórki G zlokalizowane są głównie w odźwierniku", "Somatostatynę; zlokalizowane w dwunastnicy", "Insulinę; zlokalizowane w wyspach trzustkowych", "Sekretynę; zlokalizowane w jelicie cienkim"],
    0,
    "Komórki enteroendokrynowe typu G, zlokalizowane głównie w odźwierniku żołądka, produkują gastrynę — hormon pobudzający wydzielanie kwasu solnego przez komórki okładzinowe.")

add(C17, "Czym można wybarwić komórki enteroendokrynne?",
    ["Solami chromu i solami srebra", "Wyłącznie hematoksyliną i eozyną", "Wyłącznie błękitem toluidyny", "Solami żelaza i solami wapnia"],
    0,
    "Komórki enteroendokrynowe, trudne do wyróżnienia w standardowym barwieniu H+E, mogą być selektywnie uwidocznione dzięki technikom histochemicznym wykorzystującym sole chromu (komórki chromochłonne) lub sole srebra (komórki srebrochłonne).")

add(C17, "Gdzie lokalizują się komórki D i co wydzielają?",
    ["W odźwierniku, dwunastnicy i wyspach trzustkowych; wydzielają somatostatynę", "Wyłącznie w żołądku; wydzielają gastrynę", "Wyłącznie w jelicie grubym; wydzielają serotoninę", "W wątrobie; wydzielają żółć"],
    0,
    "Komórki D, rozproszone w odźwierniku żołądka, dwunastnicy oraz wyspach trzustkowych (Langerhansa), wydzielają somatostatynę — hormon hamujący wydzielanie innych, sąsiadujących komórek rozproszonego układu neuroendokrynnego.")

add(C17, "Jakie jest działanie somatostatyny?",
    ["Hamuje wydzielanie blisko położonych innych komórek rozproszonego układu neuroendokrynnego (DNES)", "Pobudza wydzielanie kwasu solnego przez komórki okładzinowe", "Stymuluje motorykę jelit", "Zwiększa stężenie glukozy we krwi"],
    0,
    "Somatostatyna, wydzielana przez komórki D drogą parakrynną, hamuje wydzielanie licznych innych komórek rozproszonego układu neuroendokrynnego (DNES) położonych w jej bezpośrednim sąsiedztwie, pełniąc rolę lokalnego regulatora hamującego.")

add(C17, "Jakie dwa hormony wydzielane przez komórki EC pobudzają wzrost motoryki jelit?",
    ["Serotonina i substancja P", "Gastryna i sekretyna", "Insulina i glukagon", "Somatostatyna i polipeptyd trzustkowy"],
    0,
    "Serotonina i substancja P, wydzielane przez komórki enteroendokrynowe typu EC rozproszone w żołądku, jelicie cienkim i grubym, pobudzają wzrost motoryki jelit, wzmagając ruchy perystaltyczne przewodu pokarmowego.")

add(C17, "Jakie gruczoły w błonie śluzowej żołądka wydzielają śluz?",
    ["Gruczoły wpustowe i gruczoły odźwiernikowe", "Wyłącznie gruczoły trzonu żołądka", "Gruczoły dwunastnicze (Brunnera)", "Gruczoły ślinowe podniebienia"],
    0,
    "Poza właściwymi gruczołami żołądkowymi (dna i trzonu), błona śluzowa żołądka zawiera dwa dodatkowe typy gruczołów wydzielających głównie śluz: gruczoły wpustowe (przy połączeniu z przełykiem) i gruczoły odźwiernikowe (przy połączeniu z dwunastnicą).")

add(C17, "Jakich dwóch typów komórek nie ma w gruczołach wpustowych i odźwiernikowych?",
    ["Komórek okładzinowych i komórek głównych", "Komórek śluzowych i komórek enteroendokrynowych", "Komórek G i komórek D", "Powierzchniowych komórek śluzowych"],
    0,
    "W odróżnieniu od gruczołów żołądkowych właściwych, gruczoły wpustowe i odźwiernikowe — wydzielające głównie śluz — nie zawierają komórek okładzinowych ani komórek głównych.")

add(C17, "Jaka jest budowa błony mięśniowej żołądka?",
    ["Trzy warstwy mięśni gładkich: zewnętrzna podłużna, środkowa okrężna i wewnętrzna skośna", "Wyłącznie dwie warstwy: okrężna i podłużna", "Jedna, jednolita warstwa mięśni gładkich", "Trzy warstwy mięśni poprzecznie prążkowanych"],
    0,
    "Żołądek, w odróżnieniu od typowej dwuwarstwowej błony mięśniowej reszty przewodu pokarmowego, posiada dodatkową, trzecią warstwę: zewnętrzną warstwę podłużną, środkową warstwę okrężną oraz najgłębszą, wewnętrzną warstwę skośną, ułatwiającą intensywne mieszanie treści pokarmowej.")

add(C17, "Czym pokryty jest żołądek?",
    ["Cienką błoną surowiczą", "Grubą przydanką, analogicznie do przełyku", "Skórą właściwą", "Torebką łącznotkankową"],
    0,
    "Żołądek, położony wewnątrzotrzewnowo, pokryty jest na całej swojej zewnętrznej powierzchni cienką błoną surowiczą, umożliwiającą swobodny ruch narządu względem sąsiednich struktur jamy brzusznej.")

add(C17, "Jak uformowana jest wyściółka jelita cienkiego i z czego składają się fałdy okrężne?",
    ["W fałdy okrężne, zbudowane z błony śluzowej i podśluzowej", "W fałdy podłużne, zbudowane wyłącznie z błony śluzowej", "Wyściółka jelita cienkiego jest gładka, bez żadnych fałdów", "Fałdy okrężne zbudowane są z błony mięśniowej"],
    0,
    "Błona śluzowa jelita cienkiego, wraz z leżącą pod nią błoną podśluzową, tworzy trwałe fałdy okrężne — struktury zwiększające powierzchnię wchłaniania.")

add(C17, "Gdzie fałdy okrężne jelita cienkiego są najlepiej wykształcone?",
    ["W jelicie czczym", "W dwunastnicy", "W jelicie krętym", "W jelicie grubym"],
    0,
    "Fałdy okrężne jelita cienkiego są najlepiej wykształcone w jelicie czczym, gdzie procesy trawienia i wchłaniania składników odżywczych są najintensywniejsze.")

add(C17, "Czym pokryta jest błona śluzowa jelita cienkiego?",
    ["Kosmkami jelitowymi (wypustkami błony śluzowej)", "Wyłącznie gładkim nabłonkiem, bez żadnych wypustek", "Fałdami identycznymi jak w żołądku", "Brodawkami identycznymi jak na języku"],
    0,
    "Powierzchnia błony śluzowej jelita cienkiego pokryta jest kosmkami jelitowymi — palczastymi wypustkami znacząco zwiększającymi powierzchnię wchłaniania składników odżywczych.")

add(C17, "Jakie komórki tworzą nabłonek kosmków jelitowych?",
    ["Enterocyty i komórki kubkowe", "Wyłącznie enterocyty, bez komórek kubkowych", "Komórki Panetha i komórki M", "Komórki okładzinowe i komórki główne"],
    0,
    "Nabłonek pokrywający kosmki jelitowe zbudowany jest z dwóch podstawowych typów komórek: enterocytów (odpowiedzialnych za trawienie i wchłanianie) oraz rozproszonych między nimi komórek kubkowych (wydzielających ochronny śluz).")

add(C17, "Z czego zbudowany jest rdzeń kosmków jelitowych?",
    ["Z tkanki łącznej luźnej z fibroblastami, włóknami mięśni gładkich, limfocytami, komórkami plazmatycznymi i porowatymi naczyniami włosowatymi", "Wyłącznie z tkanki nabłonkowej, bez elementów łącznotkankowych", "Z tkanki chrzęstnej szklistej", "Z tkanki kostnej gąbczastej"],
    0,
    "Rdzeń każdego kosmka jelitowego (blaszka właściwa błony śluzowej) wypełniony jest tkanką łączną luźną, zawierającą fibroblasty, rozproszone włókna mięśni gładkich, limfocyty, komórki plazmatyczne oraz gęstą sieć porowatych (fenestrowanych) naczyń włosowatych.")

add(C17, "Co znajduje się pomiędzy kosmkami jelitowymi?",
    ["Ujścia gruczołów jelitowych (krypty)", "Wyłącznie tkanka łączna, bez żadnych struktur gruczołowych", "Ujścia gruczołów żołądkowych", "Ujścia gruczołów ślinowych"],
    0,
    "Przestrzeń między sąsiadującymi kosmkami jelitowymi zajmują ujścia gruczołów jelitowych (krypt Lieberkühna), zawierających m.in. komórki macierzyste i komórki Panetha.")

add(C17, "Jaka jest budowa enterocytów?",
    ["Walcowate, z owalnym jądrem blisko podstawy komórki i rąbkiem prążkowanym/szczoteczkowym w części szczytowej", "Płaskie komórki bez organelli", "Wielojądrzaste komórki z licznymi ziarnistościami", "Komórki sześcienne z centralnie położonym jądrem"],
    0,
    "Enterocyty, główne komórki absorpcyjne nabłonka jelitowego, mają charakterystyczny kształt walcowaty, z owalnym jądrem komórkowym położonym blisko podstawy oraz rąbkiem prążkowanym (szczoteczkowym) w części szczytowej, zwiększającym powierzchnię wchłaniania.")

add(C17, "Czym jest rąbek prążkowany enterocytów?",
    ["Mikrokosmki pokryte glikokaliksem", "Rzęski ruchome pokryte śluzem", "Fałdy błony podstawnej enterocytu", "Struktura tożsama z kosmkiem jelitowym"],
    0,
    "Rąbek prążkowany (szczoteczkowy) enterocytów to gęsto upakowane mikrokosmki pokryte grubą warstwą glikokaliksu — glikoproteinowej powłoki zawierającej enzymy trawienne (disacharydazy, peptydazy) kotwiczone na powierzchni błony komórkowej.")

add(C17, "Jakie trzy struktury zwiększają powierzchnię wchłaniania błony śluzowej jelita cienkiego?",
    ["Mikrokosmki, kosmki jelitowe i fałdy okrężne", "Wyłącznie kosmki jelitowe, bez pozostałych struktur", "Krypty jelitowe i gruczoły Brunnera", "Taśmy okrężnicy i przyczepki sieciowe"],
    0,
    "Powierzchnia wchłaniania jelita cienkiego jest wielokrotnie zwiększona dzięki hierarchicznemu systemowi trzech struktur: makroskopowych fałdów okrężnych, mikroskopowych kosmków jelitowych oraz submikroskopowych mikrokosmków na powierzchni enterocytów.")

add(C17, "Czym są lakteale i gdzie się znajdują?",
    ["Włosowate naczynia limfatyczne w blaszce właściwej błony śluzowej kosmków jelitowych", "Naczynia krwionośne w błonie podśluzowej jelita", "Gruczoły wydzielające śluz w kryptach jelitowych", "Wypustki komórek Panetha"],
    0,
    "Lakteale to drobne naczynia limfatyczne zlokalizowane w rdzeniu każdego kosmka jelitowego — ich kluczową funkcją jest wchłanianie chylomikronów, zbyt dużych, by przenikać przez ścianę naczyń krwionośnych.")

add(C17, "Przez co wydzielane są disacharydazy i peptydazy jelitowe?",
    ["Przez enterocyty, w glikokaliksie", "Przez komórki kubkowe, do światła jelita", "Przez komórki Panetha, do krypt jelitowych", "Przez trzustkę, wyłącznie do dwunastnicy"],
    0,
    "Enzymy trawienne rozkładające disacharydy i krótkie peptydy są wydzielane przez same enterocyty i pozostają zakotwiczone w glikokaliksie pokrywającym rąbek prążkowany, umożliwiając trawienie błonowe (kontaktowe) bezpośrednio przy powierzchni komórki.")

add(C17, "Gdzie lipidy zostają estryfikowane do trójglicerydów w enterocycie?",
    ["W obrębie gładkiego retikulum endoplazmatycznego (SER) enterocytu", "W jądrze komórkowym enterocytu", "W mitochondriach enterocytu", "W przestrzeni okołokomórkowej, poza enterocytem"],
    0,
    "Wchłonięte przez enterocyt wolne kwasy tłuszczowe i monoglicerydy są ponownie estryfikowane do trójglicerydów w gładkim retikulum endoplazmatycznym (SER), przygotowując je do dalszego pakowania w chylomikrony.")

add(C17, "Czym są chylomikrony i gdzie są tworzone?",
    ["Kompleks trójglicerydów i apoprotein, tworzony w aparacie Golgiego enterocytu", "Kompleks glukozy i insuliny, tworzony w trzustce", "Cząsteczki cholesterolu, tworzone w wątrobie", "Kompleksy aminokwasów, tworzone w RER enterocytu"],
    0,
    "Chylomikrony to duże kompleksy lipidowo-białkowe, złożone z trójglicerydów połączonych z apoproteinami — powstają one w aparacie Golgiego enterocytu, po czym opuszczają komórkę i są pobierane przez lakteal w rdzeniu kosmka.")

add(C17, "Co wydzielają komórki kubkowe i jaka jest ich funkcja?",
    ["Glikoproteinowe mucyny, które po uwodnieniu stają się śluzem chroniącym i zwilżającym nabłonek jelita", "Lizozym i defensyny, chroniące przed bakteriami", "Serotoninę, pobudzającą motorykę jelit", "Pepsynogen, trawiący białka"],
    0,
    "Komórki kubkowe wydzielają glikoproteinowe mucyny — po uwodnieniu w świetle jelita substancje te tworzą warstwę ochronnego i nawilżającego śluzu, chroniącą nabłonek błony śluzowej jelita.")

add(C17, "Gdzie znajdują się komórki kubkowe?",
    ["Rozproszone między enterocytami", "Wyłącznie na szczycie kosmków jelitowych", "Wyłącznie w kryptach jelitowych", "Wyłącznie w błonie podśluzowej"],
    0,
    "Komórki kubkowe są rozproszone pojedynczo między enterocytami na całej długości jelita, ich liczba stopniowo wzrasta w kierunku dystalnym jelita cienkiego i grubego.")

add(C17, "Gdzie znajdują się komórki Panetha?",
    ["W podstawnej części krypt jelitowych, poniżej komórek macierzystych", "Na szczycie kosmków jelitowych", "W błonie podśluzowej jelita", "W nabłonku żołądka"],
    0,
    "Komórki Panetha zlokalizowane są w podstawnej części krypt jelitowych, bezpośrednio poniżej niszy komórek macierzystych.")

add(C17, "Co zawierają ziarnistości komórek Panetha?",
    ["Lizozym, fosfolipazę A2 i defensyny", "Mucyny i glikoproteiny", "Pepsynogen i lipazę żołądkową", "Insulinę i glukagon"],
    0,
    "Komórki Panetha zawierają w swoich ziarnistościach wydzielniczych trzy grupy substancji przeciwbakteryjnych: lizozym, fosfolipazę A2 i defensyny.")

add(C17, "Jaka jest funkcja enzymów ziarnistości komórek Panetha?",
    ["Rozkładają ścianę komórkową bakterii", "Trawią białka pokarmowe w świetle jelita", "Neutralizują nadmiar kwasu żołądkowego", "Aktywują witaminę D"],
    0,
    "Enzymy zawarte w ziarnistościach komórek Panetha (lizozym, fosfolipaza A2) enzymatycznie rozkładają ścianę komórkową bakterii, pełniąc istotną rolę w odporności wrodzonej jelita.")

add(C17, "Jakie komórki w jelicie kontrolują stężenie niektórych składników odżywczych?",
    ["Komórki enteroendokrynowe", "Enterocyty wyłącznie", "Komórki kubkowe", "Komórki Panetha"],
    0,
    "Komórki enteroendokrynowe jelita cienkiego, poprzez wydzielanie różnorodnych hormonów peptydowych w odpowiedzi na obecność składników odżywczych w świetle jelita, kontrolują ich dalsze wchłanianie i metabolizm.")

add(C17, "W co różnicują się komórki potomne jelita cienkiego?",
    ["Komórki enteroendokrynowe, komórki kubkowe i enterocyty", "Wyłącznie enterocyty, bez pozostałych typów", "Komórki Panetha i komórki M wyłącznie", "Hepatocyty i cholangiocyty"],
    0,
    "Wielopotencjalne komórki macierzyste krypt jelitowych dają początek komórkom potomnym różnicującym się w trzy główne typy funkcjonalne: komórki enteroendokrynowe, komórki kubkowe oraz enterocyty.")

add(C17, "W czym wyspecjalizowane są komórki M i gdzie głównie się znajdują?",
    ["W transporcie patogenów i drobnoustrojów przez nabłonek jelita; głównie w jelicie krętym, w błonie śluzowej pokrywającej kępki Peyera", "W produkcji śluzu ochronnego; głównie w jelicie grubym", "W trawieniu tłuszczów; głównie w dwunastnicy", "W produkcji kwasu solnego; głównie w żołądku"],
    0,
    "Komórki M, wyspecjalizowane w transporcie (transcytozie) patogenów i drobnoustrojów przez nabłonek jelita, występują głównie w jelicie krętym, w obrębie nabłonka pokrywającego kępki Peyera.")

add(C17, "Co zawiera blaszka właściwa błony śluzowej jelita cienkiego?",
    ["Tkankę łączną luźną, naczynia krwionośne, naczynia limfatyczne, włókna nerwowe, tkankę limfatyczną i miocyty", "Wyłącznie tkankę chrzęstną szklistą", "Wyłącznie gruczoły ślinowe", "Wyłącznie warstwę mięśni poprzecznie prążkowanych"],
    0,
    "Blaszka właściwa błony śluzowej jelita cienkiego zawiera zróżnicowany zestaw elementów: tkankę łączną luźną, naczynia krwionośne i limfatyczne, włókna nerwowe, tkankę limfatyczną oraz rozproszone miocyty gładkie.")

add(C17, "Jaka jest rola miocytów blaszki właściwej błony śluzowej jelita cienkiego?",
    ["Powodują rytmiczne ruchy kosmków jelitowych i lokalny ruch fałdów okrężnych", "Wytwarzają śluz ochronny", "Produkują enzymy trawienne", "Odpowiadają wyłącznie za perystaltykę całego jelita"],
    0,
    "Rozproszone miocyty gładkie blaszki właściwej błony śluzowej jelita cienkiego pełnią dwie lokalne funkcje motoryczne: powodują rytmiczne ruchy pojedynczych kosmków jelitowych oraz lokalny ruch fałdów okrężnych.")

add(C17, "Na co pozwalają rytmiczne ruchy kosmków jelitowych?",
    ["Zwiększają wydajność wchłaniania", "Zmniejszają wydajność wchłaniania, chroniąc kosmki przed uszkodzeniem", "Nie mają żadnego wpływu na proces wchłaniania", "Umożliwiają wyłącznie perystaltykę całego jelita"],
    0,
    "Rytmiczne ruchy kosmków jelitowych, wywołane skurczem miocytów blaszki właściwej, zwiększają wydajność wchłaniania poprzez ciągłe odnawianie kontaktu nabłonka z treścią pokarmową.")

add(C17, "Na co pozwalają lokalne ruchy fałdów okrężnych?",
    ["Pomagają w przepływie chłonki z naczyń włosowatych limfatycznych do naczyń chłonnych błony podśluzowej i krezki jelitowej", "Przyspieszają wyłącznie perystaltykę całego jelita", "Hamują wchłanianie składników odżywczych", "Nie mają żadnego znaczenia funkcjonalnego"],
    0,
    "Lokalne ruchy fałdów okrężnych wspomagają przepływ chłonki z drobnych naczyń włosowatych limfatycznych (lakteali) kosmków do większych naczyń chłonnych błony podśluzowej i krezki jelitowej.")

add(C17, "Gdzie znajdują się gruczoły śluzowo-surowicze w oskrzelach?",
    ["W błonie podśluzowej", "W blaszce właściwej błony śluzowej", "W błonie mięśniowej oskrzela", "W przydance oskrzela"],
    0,
    "Gruczoły śluzowo-surowicze oskrzeli, wydzielające śluz i płyn surowiczy nawilżający drogi oddechowe, zlokalizowane są w błonie podśluzowej ściany oskrzela.")

add(C17, "Gdzie znajdują się gruczoły dwunastnicze (Brunnera)?",
    ["W błonie śluzowej i błonie podśluzowej bliższej części dwunastnicy", "Wyłącznie w błonie śluzowej żołądka", "Wyłącznie w błonie mięśniowej jelita cienkiego", "W jelicie grubym"],
    0,
    "Gruczoły dwunastnicze (Brunnera), rozgałęzione gruczoły cewkowe, zlokalizowane są zarówno w błonie śluzowej, jak i w błonie podśluzowej bliższej (początkowej) części dwunastnicy.")

add(C17, "Jakim typem gruczołu są gruczoły dwunastnicze (Brunnera)?",
    ["Gruczoł rozgałęziony cewkowy", "Gruczoł pęcherzykowy", "Gruczoł cewkowo-pęcherzykowy złożony", "Gruczoł jednokomórkowy"],
    0,
    "Gruczoły dwunastnicze (Brunnera) są klasycznym przykładem rozgałęzionego gruczołu cewkowego, którego liczne cewki wydzielnicze uchodzą wspólnie do krypt jelitowych.")

add(C17, "Dokąd uchodzą przewody gruczołów dwunastniczych (Brunnera)?",
    ["Do krypt jelitowych", "Bezpośrednio do światła dwunastnicy, z pominięciem krypt", "Do przewodu żółciowego wspólnego", "Do przewodu trzustkowego głównego"],
    0,
    "Przewody wyprowadzające gruczołów dwunastniczych (Brunnera) uchodzą do dna otaczających je krypt jelitowych, skąd ich zasadowa wydzielina miesza się z treścią pokarmową przepływającą przez światło jelita.")

add(C17, "Jaka jest rola śluzu wydzielanego przez gruczoły dwunastnicze (Brunnera)?",
    ["Zobojętnia treść pokarmową", "Trawi tłuszcze pokarmowe", "Aktywuje enzymy trzustkowe", "Chroni przed bakteriami, analogicznie do lizozymu"],
    0,
    "Zasadowy śluz wydzielany przez gruczoły dwunastnicze (Brunnera) neutralizuje kwaśną treść pokarmową napływającą z żołądka, chroniąc delikatną błonę śluzową dwunastnicy przed uszkodzeniem.")

add(C17, "Śluz jakich gruczołów ma odczyn zasadowy?",
    ["Gruczołów dwunastniczych (Brunnera)", "Gruczołów żołądkowych właściwych", "Gruczołów przełykowych", "Gruczołów ślinianek podjęzykowych"],
    0,
    "Spośród gruczołów przewodu pokarmowego to właśnie śluz gruczołów dwunastniczych (Brunnera) wyróżnia się charakterystycznym, zasadowym odczynem, umożliwiającym neutralizację kwaśnej treści żołądkowej.")

add(C17, "Co zapewnia odpowiednie pH zawartości jelita niezbędne dla enzymów trzustkowych?",
    ["Śluz gruczołów dwunastniczych (Brunnera)", "Kwas solny żołądka", "Żółć wątrobowa", "Śluz komórek kubkowych jelita krętego"],
    0,
    "Zasadowa wydzielina gruczołów dwunastniczych (Brunnera), neutralizując kwaśną treść żołądkową, zapewnia optymalne, zbliżone do obojętnego pH niezbędne dla prawidłowej aktywności enzymów trzustkowych w dwunastnicy.")

add(C17, "Gdzie w jelicie występuje MALT i z czego się składa?",
    ["W jelicie krętym — w blaszce właściwej błony śluzowej i błonie podśluzowej; składa się z kępek Peyera", "Wyłącznie w żołądku; składa się z gruczołów wpustowych", "Wyłącznie w jelicie grubym; składa się z taśm okrężnicy", "MALT nie występuje w przewodzie pokarmowym"],
    0,
    "Tkanka limfatyczna błony śluzowej (MALT) jest szczególnie licznie reprezentowana w jelicie krętym, w blaszce właściwej błony śluzowej oraz błonie podśluzowej, gdzie skupia się w formie kępek Peyera.")

add(C17, "Gdzie leżą kępki Peyera względem komórek M nabłonka jelita?",
    ["Poniżej komórek M nabłonka jelita", "Powyżej komórek M, w świetle jelita", "Kępki Peyera nie mają związku przestrzennego z komórkami M", "W błonie mięśniowej, z dala od nabłonka"],
    0,
    "Kępki Peyera, skupiska tkanki limfatycznej jelita krętego, leżą bezpośrednio poniżej wyspecjalizowanych komórek M nabłonka jelita, które aktywnie transportują antygeny do leżącej pod nimi tkanki limfatycznej.")

add(C17, "Z ilu i jakich warstw zbudowana jest błona mięśniowa jelita cienkiego i jaki splot znajduje się między nimi?",
    ["Z dwóch warstw — wewnętrznej okrężnej i zewnętrznej podłużnej — pomiędzy którymi znajduje się splot Auerbacha", "Z trzech warstw, identycznie jak w żołądku", "Z jednej, jednolitej warstwy mięśni gładkich", "Z dwóch warstw, bez żadnego splotu nerwowego między nimi"],
    0,
    "Błona mięśniowa jelita cienkiego zbudowana jest z dwóch warstw mięśni gładkich — wewnętrznej okrężnej i zewnętrznej podłużnej — pomiędzy którymi przebiega splot nerwowy błony mięśniowej (splot Auerbacha).")

add(C17, "Za co odpowiedzialny jest splot Auerbacha?",
    ["Za perystaltykę jelit", "Za wydzielanie enzymów trawiennych", "Za wchłanianie składników odżywczych", "Za produkcję śluzu ochronnego"],
    0,
    "Splot Auerbacha (splot nerwowy błony mięśniowej), część jelitowego układu nerwowego, jest odpowiedzialny za generowanie i koordynację skurczów mięśniówki gładkiej, w tym perystaltyki jelit.")

add(C17, "Czego nie zawiera błona śluzowa jelita grubego w porównaniu z jelitem cienkim?",
    ["Fałdów okrężnych i kosmków jelitowych", "Gruczołów jelitowych i komórek kubkowych", "Blaszki właściwej błony śluzowej i błony podśluzowej", "Błony mięśniowej i błony surowiczej"],
    0,
    "Błona śluzowa jelita grubego, w odróżnieniu od jelita cienkiego zoptymalizowanego pod kątem wchłaniania, jest pozbawiona zarówno fałdów okrężnych, jak i kosmków jelitowych.")

add(C17, "Co zawiera ściana jelita grubego charakterystycznego dla okrężnicy?",
    ["Wypuklenia okrężnicy (haustra)", "Kosmki jelitowe identyczne z jelitem cienkim", "Chrząstkę szklistą", "Nabłonek wielorzędowy walcowaty urzęsiony"],
    0,
    "Charakterystyczną cechą makroskopową ściany jelita grubego są wypuklenia okrężnicy (haustra), powstające wskutek skróconej długości taśm okrężnicy w stosunku do reszty ściany.")

add(C17, "Jakimi komórkami wysłana jest błona śluzowa jelita grubego i gruczoły jelitowe?",
    ["Komórkami kubkowymi, kolonocytami i komórkami enteroendokrynowymi", "Wyłącznie enterocytami, identycznie jak w jelicie cienkim", "Wyłącznie komórkami Panetha", "Komórkami okładzinowymi i głównymi"],
    0,
    "Nabłonek błony śluzowej jelita grubego oraz wyściełające ją proste gruczoły jelitowe zbudowane są z trzech typów komórek: licznych komórek kubkowych, kolonocytów (komórek absorpcyjnych) oraz komórek enteroendokrynowych.")

add(C17, "Jaka jest budowa kolonocytów?",
    ["Walcowate, z nieregularnymi mikrokosmkami i rozszerzonymi przestrzeniami międzykomórkowymi", "Płaskie komórki bez mikrokosmków", "Wielojądrzaste komórki z licznymi ziarnistościami", "Komórki sześcienne z centralnie położonym jądrem"],
    0,
    "Kolonocyty, główne komórki absorpcyjne jelita grubego, są komórkami walcowatymi z nieregularnie ułożonymi mikrokosmkami oraz charakterystycznie rozszerzonymi przestrzeniami międzykomórkowymi, wspomagającymi wchłanianie wody i elektrolitów.")

add(C17, "W co bogata jest blaszka właściwa błony śluzowej jelita grubego?",
    ["W komórki limfatyczne i grudki chłonne", "Wyłącznie w gruczoły trawienne", "W tkankę chrzęstną", "W komórki mięśniowe poprzecznie prążkowane"],
    0,
    "Blaszka właściwa błony śluzowej jelita grubego jest bogata w rozproszone komórki limfatyczne oraz liczne grudki chłonne, odzwierciedlając wysoką ekspozycję tego odcinka na bakterie jelitowe.")

add(C17, "Jaka jest budowa błony mięśniowej jelita grubego?",
    ["Dwie warstwy: wewnętrzna okrężna i zewnętrzna w postaci trzech taśm okrężnicy", "Trzy warstwy, identycznie jak w żołądku", "Jedna, jednolita warstwa mięśni gładkich, bez podziału na taśmy", "Wyłącznie warstwa podłużna, bez warstwy okrężnej"],
    0,
    "Błona mięśniowa jelita grubego zbudowana jest z dwóch warstw: wewnętrznej, ciągłej warstwy okrężnej oraz zewnętrznej warstwy podłużnej, skupionej w charakterystyczne trzy taśmy okrężnicy zamiast ciągłej powłoki.")

add(C17, "Czym są taśmy okrężnicy?",
    ["Podłużne włókna błony mięśniowej jelita grubego, zebrane w trzy podłużne pasma", "Wewnętrzna, okrężna warstwa błony mięśniowej", "Struktury błony śluzowej analogiczne do kosmków jelita cienkiego", "Zewnętrzne uwypuklenia błony surowiczej wypełnione tłuszczem"],
    0,
    "Taśmy okrężnicy to charakterystyczna cecha zewnętrznej, podłużnej warstwy błony mięśniowej jelita grubego — zamiast ciągłej powłoki, włókna podłużne skupiają się w trzy odrębne, wąskie pasma biegnące wzdłuż całej długości okrężnicy.")

add(C17, "Czym pokryte jest jelito grube?",
    ["Błoną surowiczą z uwypukleniami tkanki tłuszczowej — przyczepkami sieciowymi", "Wyłącznie przydanką, bez żadnych uwypukleń tłuszczowych", "Skórą właściwą", "Torebką łącznotkankową"],
    0,
    "Zewnętrzną powierzchnię jelita grubego pokrywa błona surowicza, z której odchodzą charakterystyczne, workowate uwypuklenia wypełnione tkanką tłuszczową — przyczepki sieciowe.")

add(C17, "Jaki nabłonek występuje od połączenia odbytowo-odbytniczego?",
    ["Nabłonek wielowarstwowy płaski (nierogowaciejący)", "Nabłonek jednowarstwowy walcowaty, identycznie jak w odbytnicy", "Nabłonek wielorzędowy walcowaty urzęsiony", "Nabłonek jednowarstwowy sześcienny"],
    0,
    "Od miejsca połączenia odbytowo-odbytniczego (linii grzebieniowej) nabłonek zmienia się z jednowarstwowego walcowatego (typowego dla odbytnicy) na nabłonek wielowarstwowy płaski, kontynuujący się w kierunku kanału odbytu.")

add(C17, "Przez co tworzone są słupy odbytu?",
    ["Przez błonę śluzową i błonę podśluzową kanału odbytu", "Wyłącznie przez błonę mięśniową", "Przez błonę surowiczą", "Przez torebkę łącznotkankową"],
    0,
    "Podłużne słupy odbytu (kolumny Morgagniego) tworzone są przez sfałdowaną błonę śluzową i podśluzową kanału odbytu.")

add(C17, "Gdzie znajdują się zatoki splotu żylnego odbytu?",
    ["W blaszce właściwej błony śluzowej i błonie podśluzowej słupów odbytu", "Wyłącznie w błonie mięśniowej odbytnicy", "W błonie surowiczej jelita grubego", "W mięśniu zwieraczu zewnętrznym odbytu"],
    0,
    "Zatoki bogatego splotu żylnego odbytu przebiegają w obrębie blaszki właściwej błony śluzowej oraz błony podśluzowej słupów odbytu — ich patologiczne poszerzenie prowadzi do powstania hemoroidów.")

add(C17, "Przez co stworzony jest zwieracz wewnętrzny odbytu?",
    ["Przez warstwę okrężną błony mięśniowej odbytnicy", "Przez mięśnie szkieletowe (poprzecznie prążkowane)", "Przez warstwę podłużną błony mięśniowej", "Przez błonę podśluzową"],
    0,
    "Zwieracz wewnętrzny odbytu jest przedłużeniem wewnętrznej, okrężnej warstwy błony mięśniowej gładkiej odbytnicy, poddanej wyłącznie mimowolnej kontroli.")

add(C17, "Przez co stworzony jest zwieracz zewnętrzny odbytu?",
    ["Przez mięśnie szkieletowe (poprzecznie prążkowane)", "Przez warstwę okrężną błony mięśniowej gładkiej", "Przez tkankę łączną zbitą", "Przez błonę śluzową kanału odbytu"],
    0,
    "Zwieracz zewnętrzny odbytu zbudowany jest z mięśni szkieletowych (poprzecznie prążkowanych), poddanych świadomej, dowolnej kontroli — w odróżnieniu od mimowolnego zwieracza wewnętrznego.")

add(C17, "Jak rozciąga się jelito przednie, środkowe i tylne w rozwoju zarodkowym?",
    ["Przednie — od błony ustno-gardłowej do zawiązka wątroby; środkowe — od ujścia przewodu żółciowego do okrężnicy poprzecznej; tylne — od 1/3 okrężnicy poprzecznej do błony stekowej", "Wszystkie trzy odcinki obejmują dokładnie tę samą długość jelita pierwotnego", "Przednie — wyłącznie gardło; środkowe — wyłącznie żołądek", "Jelito pierwotne nie dzieli się na odrębne odcinki"],
    0,
    "Jelito pierwotne dzieli się na trzy odcinki o różnym unaczynieniu: jelito przednie (od błony ustno-gardłowej do zawiązka wątroby), jelito środkowe (od ujścia przewodu żółciowego do 2/3 okrężnicy poprzecznej) oraz jelito tylne (od tego punktu do błony stekowej).")

add(C17, "Kiedy nerka ostateczna przemieszcza się do okolicy brzusznej?",
    ["9. tydzień", "4. tydzień", "20. tydzień", "Nerka ostateczna nigdy nie zmienia swojego pierwotnego położenia"],
    0,
    "Nerka ostateczna, początkowo położona w okolicy lędźwiowo-krzyżowej, przemieszcza się do docelowej okolicy brzusznej w 9. tygodniu rozwoju, w toku różnicowego wzrostu ciała zarodka.")

add(C17, "Co dzieje się wraz z zanikiem pochodnych błon stekowych?",
    ["Przewód pokarmowy zostaje udrożniony", "Przewód pokarmowy ulega całkowitemu zamknięciu", "Powstaje przepuklina pępowinowa", "Formuje się dodatkowa pętla jelitowa"],
    0,
    "Zanik pochodnych błon stekowych (błony moczowo-płciowej i błony odbytowej) prowadzi do ostatecznego udrożnienia przewodu pokarmowego, umożliwiając swobodny przepływ treści jelitowej na zewnątrz organizmu.")

add(C17, "Z czego powstaje nabłonek wyścielający gruczoły przewodu pokarmowego?",
    ["Z endodermy", "Z ektodermy powierzchniowej", "Z mezodermy trzewnej", "Z grzebienia nerwowego"],
    0,
    "Nabłonek wyścielający wszystkie gruczoły przewodu pokarmowego (ślinianki, wątrobę, trzustkę, gruczoły żołądkowe i jelitowe) wywodzi się z endodermy jelita pierwotnego.")

add(C17, "Z czego powstają sploty nerwowe Meissnera i Auerbacha?",
    ["Z komórek grzebienia nerwowego", "Z endodermy jelita pierwotnego", "Z mezodermy trzewnej, identycznie jak komórki mięśniowe jelita", "Z ektodermy pokrywającej"],
    0,
    "Oba sploty jelitowego układu nerwowego — Meissnera (podśluzowy) i Auerbacha (mięśniowy) — wywodzą się z komórek grzebienia nerwowego, migrujących i zasiedlających pierwotną ścianę jelita.")

add(C17, "W jaki sposób rozpoczyna się rozwój błony mięśniowej w jelitach?",
    ["Komórki grzebienia nerwowego zasiedlają pierwotne ściany jelita", "Komórki mięśniowe różnicują się niezależnie, bez udziału grzebienia nerwowego", "Rozwój błony mięśniowej rozpoczyna się dopiero po urodzeniu", "Rozwój rozpoczyna się od migracji komórek endodermalnych"],
    0,
    "Rozwój błony mięśniowej jelita rozpoczyna się od zasiedlenia pierwotnej ściany jelita przez migrujące komórki grzebienia nerwowego, tworzące zawiązki przyszłych splotów nerwowych — dopiero ich obecność indukuje dalsze różnicowanie samych komórek mięśniowych.")

add(C17, "Przez co indukowany jest rozwój komórek mięśniowych jelita?",
    ["Przez neuroblasty splotów Meissnera i Auerbacha", "Przez komórki endodermalne nabłonka jelita", "Przez komórki nabłonka gruczołów jelitowych", "Rozwój komórek mięśniowych jelita zachodzi spontanicznie, bez żadnej indukcji"],
    0,
    "Różnicowanie komórek mięśniowych jelita jest indukowane przez neuroblasty rozwijających się splotów nerwowych Meissnera i Auerbacha, zasiedlających ścianę jelita przed uformowaniem się jej błony mięśniowej.")

add(C17, "Skąd pochodzą komórki mięśniowe jelita?",
    ["Z listka trzewnego mezodermy bocznej", "Z endodermy jelita pierwotnego", "Z grzebienia nerwowego", "Z mezodermy przyosiowej"],
    0,
    "Komórki mięśniowe budujące błonę mięśniową jelita pochodzą z listka trzewnego mezodermy bocznej, otaczającego jelito pierwotne — w odróżnieniu od unerwiających je neuronów, wywodzących się z grzebienia nerwowego.")

add(C17, "Jakie komórki błony mięśniowej jelita powstają jako pierwsze?",
    ["Miocyty warstwy okrężnej", "Miocyty warstwy podłużnej", "Miocyty warstwy skośnej", "Wszystkie trzy warstwy powstają jednocześnie"],
    0,
    "W toku różnicowania błony mięśniowej jelita jako pierwsze powstają miocyty warstwy okrężnej (wewnętrznej), a dopiero później miocyty warstwy podłużnej (zewnętrznej).")

add(C17, "Gdzie znajduje się odcinek głowowy jelita przedniego?",
    ["Między błoną ustno-gardłową a bruzdą krtaniowo-tchawiczą", "Między bruzdą krtaniowo-tchawiczą a miejscem odejścia zawiązka wątroby", "Między zawiązkiem wątroby a błoną stekową", "Odcinek głowowy jelita przedniego nie istnieje jako odrębna struktura"],
    0,
    "Odcinek głowowy jelita pierwotnego przedniego rozciąga się między błoną ustno-gardłową a bruzdą krtaniowo-tchawiczą, dając ostatecznie początek gardłu i dolnemu odcinkowi układu oddechowego.")

add(C17, "Gdzie znajduje się odcinek ogonowy jelita przedniego?",
    ["Między bruzdą krtaniowo-tchawiczą a miejscem odejścia zawiązka wątroby", "Między błoną ustno-gardłową a bruzdą krtaniowo-tchawiczą", "Między zawiązkiem wątroby a błoną stekową", "Odcinek ogonowy jelita przedniego jest tożsamy z jelitem środkowym"],
    0,
    "Odcinek ogonowy jelita pierwotnego przedniego rozciąga się między bruzdą krtaniowo-tchawiczą a miejscem odejścia zawiązka wątroby, dając początek przełykowi, żołądkowi, dwunastnicy, wątrobie, pęcherzykowi żółciowemu i trzustce.")

add(C17, "Z czego powstaje dolny odcinek układu oddechowego i z czego powstaje pęcherzyk żółciowy?",
    ["Dolny odcinek oddechowy — z odcinka głowowego jelita przedniego; pęcherzyk żółciowy — z odcinka ogonowego jelita przedniego", "Oba narządy powstają z tego samego, odcinka ogonowego jelita przedniego", "Dolny odcinek oddechowy powstaje z jelita środkowego", "Pęcherzyk żółciowy powstaje z jelita tylnego"],
    0,
    "Dolny odcinek układu oddechowego (tchawica, oskrzela, płuca) wywodzi się z odcinka głowowego jelita pierwotnego przedniego, natomiast pęcherzyk żółciowy — podobnie jak wątroba, trzustka, żołądek i dwunastnica — powstaje z jego odcinka ogonowego.")

add(C17, "Czym oddzielony jest przełyk od tchawicy?",
    ["Przegrodą krtaniowo-tchawiczo-przełykową", "Błoną ustno-gardłową", "Przegrodą poprzeczną", "Błoną osierdziowo-otrzewnową"],
    0,
    "Przełyk i tchawica, oba wywodzące się z jednego, wspólnego odcinka jelita pierwotnego przedniego, zostają rozdzielone przegrodą krtaniowo-tchawiczo-przełykową, formującą się w wyniku zrośnięcia się brzegów bruzdy krtaniowo-tchawiczo-przełykowej.")

add(C17, "Co jest częścią grzbietową jelita pierwotnego po podziale przegrodą krtaniowo-tchawiczo-przełykową?",
    ["Przełyk", "Kanał krtaniowo-tchawiczy", "Żołądek", "Dwunastnica"],
    0,
    "Po podziale jelita pierwotnego przez przegrodę krtaniowo-tchawiczo-przełykową jego częścią grzbietową staje się przełyk, natomiast częścią brzuszną — kanał krtaniowo-tchawiczy, dający początek drogom oddechowym.")

add(C17, "Co powstanie z brzusznej części jelita przedniego (kanału krtaniowo-tchawiczego)?",
    ["Zawiązek płuc", "Zawiązek wątroby", "Zawiązek żołądka", "Zawiązek trzustki"],
    0,
    "Brzuszna część jelita przedniego, czyli kanał krtaniowo-tchawiczy, wydłuża się i rozgałęzia dystalnie, dając ostatecznie początek zawiązkowi płuc (pączkowi płucnemu) oraz całemu dolnemu układowi oddechowemu.")

add(C17, "Kiedy pojawiają się komórki endokrynowe trzustki?",
    ["3. miesiąc", "1. miesiąc", "6. miesiąc", "Dopiero po urodzeniu"],
    0,
    "Pierwsze komórki endokrynowe trzustki, różnicujące się z nabłonka jej małych przewodów, pojawiają się w 3. miesiącu rozwoju, znacznie wyprzedzając pełne uformowanie funkcjonalnych wysp Langerhansa, zachodzące dopiero w trzecim trymestrze.")

add(C17, "Gdzie na początku pojawiają się gruczoły przełyku?",
    ["W błonie śluzowej dolnego odcinka przełyku", "W błonie śluzowej górnego odcinka przełyku", "W błonie mięśniowej całego przełyku", "Gruczoły przełyku pojawiają się jednocześnie na całej długości narządu"],
    0,
    "Pierwsze gruczoły przełykowe (wpustowe) pojawiają się w błonie śluzowej dolnego odcinka przełyku, w bezpośrednim sąsiedztwie rozwijającego się połączenia z żołądkiem.")

add(C17, "Z czego powstają mięśnie poprzecznie prążkowane górnego odcinka przełyku?",
    ["Z mezenchymy łuków gardłowych", "Z listka trzewnego mezodermy bocznej", "Z endodermy jelita pierwotnego przedniego", "Z grzebienia nerwowego bezpośrednio"],
    0,
    "Mięśnie poprzecznie prążkowane górnej jednej trzeciej przełyku wywodzą się z mezenchymy łuków gardłowych — w odróżnieniu od mięśni gładkich dolnej części przełyku, pochodzących z listka trzewnego mezodermy bocznej.")

add(C17, "Kiedy pojawia się zawiązek żołądka?",
    ["W połowie 4. tygodnia", "W 8. tygodniu", "W 2. tygodniu", "Dopiero w drugim trymestrze"],
    0,
    "Zawiązek żołądka, widoczny jako niewielkie, wrzecionowate rozszerzenie jelita pierwotnego przedniego, pojawia się już w połowie 4. tygodnia rozwoju.")

add(C17, "Co jest powodem powstania krzywizny większej i mniejszej żołądka?",
    ["Ściana grzbietowa żołądka rośnie szybciej niż ściana brzuszna", "Ściana brzuszna żołądka rośnie szybciej niż ściana grzbietowa", "Obie ściany rosną z identyczną prędkością", "Krzywizny żołądka powstają wyłącznie na skutek obrotu w osi przednio-tylnej"],
    0,
    "Charakterystyczne krzywizny żołądka powstają na skutek nierównomiernego wzrostu jego ściany — szybciej rosnąca ściana grzbietowa tworzy wypukłą krzywiznę większą, natomiast wolniej rosnąca ściana brzuszna tworzy wklęsłą krzywiznę mniejszą.")

add(C17, "Jakim obrotom podlega żołądek w toku rozwoju?",
    ["Obrót o 90 stopni w osi podłużnej i obrót w osi przednio-tylnej", "Wyłącznie jeden obrót o 180 stopni w osi poprzecznej", "Żołądek nie podlega żadnym obrotom w rozwoju zarodkowym", "Obrót o 270 stopni, identyczny jak w przypadku pętli jelitowych"],
    0,
    "Żołądek podlega dwóm obrotom podczas rozwoju: obrotowi o 90 stopni w osi podłużnej oraz obrotowi w osi przednio-tylnej, co nadaje mu ostateczne, asymetryczne położenie w jamie brzusznej.")

add(C17, "Co jest konsekwencją obrotu żołądka o 90 stopni w osi podłużnej?",
    ["Krezka grzbietowa żołądka ulega sfałdowaniu i tworzy torbę sieciową", "Krezka brzuszna żołądka zanika całkowicie", "Powstaje dodatkowa pętla jelitowa", "Żołądek zmienia swoje unaczynienie na tętnicę krezkową górną"],
    0,
    "Obrót żołądka o 90 stopni w osi podłużnej powoduje, że jego pierwotnie lewa ściana staje się przednią, a prawa tylną — jednocześnie krezka grzbietowa żołądka ulega sfałdowaniu, tworząc torbę sieciową (worek sieciowy mniejszy).")

add(C17, "W jaki sposób powstają gruczoły żołądka?",
    ["Nabłonek żołądka wpukla się w sąsiednią mezenchymę", "Mezenchyma wpukla się w nabłonek żołądka", "Gruczoły żołądka powstają z endodermy jelita środkowego, niezależnie od nabłonka żołądka", "Gruczoły żołądka nie mają odrębnego zawiązka embrionalnego"],
    0,
    "Gruczoły żołądkowe powstają w wyniku wpuklania się nabłonka wyściełającego żołądek w głąb otaczającej go mezenchymy, tworząc stopniowo rozgałęzione struktury cewkowe typowe dla dojrzałego gruczołu.")

add(C17, "Kiedy rozwija się dwunastnica i z czego się rozwija?",
    ["Na początku 4. tygodnia; z końcowej części jelita pierwotnego przedniego i głowowej części jelita pierwotnego środkowego", "W 8. tygodniu; wyłącznie z jelita środkowego", "W 12. tygodniu; wyłącznie z jelita tylnego", "Dwunastnica rozwija się z tej samej struktury co żołądek, bez odrębnego pochodzenia"],
    0,
    "Dwunastnica zaczyna rozwijać się już na początku 4. tygodnia, powstając ze złożenia dwóch odrębnych odcinków jelita pierwotnego: końcowej części jelita przedniego oraz głowowej części jelita środkowego — miejsce ich połączenia wyznacza ujście przewodu żółciowego.")

add(C17, "Kiedy światło dwunastnicy przejściowo zwęża się lub zamyka?",
    ["W 5. i 6. tygodniu", "W 1. tygodniu", "W 12. tygodniu", "Światło dwunastnicy nigdy nie ulega zwężeniu w rozwoju prawidłowym"],
    0,
    "W toku intensywnego wzrostu nabłonka dwunastnicy, w 5. i 6. tygodniu rozwoju, jej światło przejściowo zwęża się lub całkowicie zamyka, by następnie ulec ponownemu udrożnieniu — zaburzenie tego procesu prowadzi do wrodzonych wad zwężenia lub niedrożności dwunastnicy.")

add(C17, "Gdzie łączą się zawiązki dwunastnicy?",
    ["Poniżej miejsca odejścia pączka wątrobowego", "Powyżej miejsca odejścia pączka wątrobowego", "W miejscu odejścia zawiązka trzustki brzusznej wyłącznie", "Zawiązki dwunastnicy nie łączą się ze sobą, pozostając odrębnymi strukturami"],
    0,
    "Dwa zawiązki dwunastnicy, wywodzące się z jelita przedniego i środkowego, łączą się ze sobą poniżej miejsca odejścia pączka wątrobowego, tworząc jednolitą, choć złożoną z dwóch źródeł, strukturę.")

with open("anki2sem_13_full_raw.json", "w", encoding="utf-8") as f:
    json.dump(Q, f, ensure_ascii=False, indent=2)
print("written", len(Q))
