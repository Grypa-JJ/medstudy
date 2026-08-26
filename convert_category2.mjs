import fs from 'fs';

const categories = {
  'Bakteriologia szczegółowa — Rozdz. 1 — Staphylococcus aureus': [
    {
      oldQ: 'Jak układają się w skupiska ziarenkowce Staphylococcus aureus na preparacie mikroskopowym?',
      q: 'Jak układają się w skupiska ziarenkowce Staphylococcus aureus na preparacie mikroskopowym?',
      o: ['Jak kiść winogron', 'W łańcuchy lub pary, jak paciorkowce', 'W regularne tetrady', 'W pakiety przypominające bele siana, jak Sarcina', 'Pojedynczo, bez tworzenia trwałych układów'],
      a: 0,
      rationale: 'Poprawnie: układ przypominający kiść winogron, wynik podziału w wielu płaszczyznach. Układ w łańcuchy/pary jest charakterystyczny dla paciorkowców (Streptococcus) - innego rodzaju bakterii z tego kursu.'
    },
    {
      oldQ: 'Do której grupy klasyfikacyjnej gronkowców należy S. aureus (koagulaza/nowobiocyna)?',
      q: 'Do której grupy klasyfikacyjnej gronkowców należy Staphylococcus aureus, pod względem koagulazy i wrażliwości na nowobiocynę?',
      o: [
        'Koagulazo-dodatnie, wrażliwe na nowobiocynę',
        'Koagulazo-ujemne, wrażliwe na nowobiocynę, jak S. epidermidis',
        'Koagulazo-dodatnie, oporne na nowobiocynę',
        'Koagulazo-ujemne, oporne na nowobiocynę, jak S. saprophyticus',
        'Koagulaza zmienna, zależna od szczepu'
      ],
      a: 0,
      rationale: 'Poprawnie: koagulazo-dodatnie i wrażliwe na nowobiocynę. Koagulazo-ujemne, wrażliwe na nowobiocynę to grupa obejmująca S. epidermidis (kolejne pytanie w tej kategorii), a koagulazo-ujemne, oporne na nowobiocynę - S. saprophyticus (inna kategoria tego kursu) - błędne przypisania grup.'
    },
    {
      oldQ: 'Wymień jeden gatunek gronkowca koagulazo-ujemnego wrażliwego na nowobiocynę.',
      q: 'Który z poniższych jest gatunkiem gronkowca koagulazo-ujemnego, wrażliwego na nowobiocynę?',
      o: ['Staphylococcus epidermidis', 'Staphylococcus aureus, koagulazo-dodatni', 'Staphylococcus saprophyticus, oporny na nowobiocynę', 'Streptococcus pyogenes, inny rodzaj bakterii', 'Enterococcus faecalis, inny rodzaj bakterii'],
      a: 0,
      rationale: 'Poprawnie: Staphylococcus epidermidis (obok S. lugdunensis, S. haemolyticus, S. warneri). S. aureus jest koagulazo-DODATNI, a S. saprophyticus - koagulazo-ujemny, ale OPORNY na nowobiocynę (istotny marker różnicujący w ZUM, inna kategoria tego kursu).'
    },
    {
      oldQ: 'Jaki typ hemolizy wykazuje S. aureus?',
      q: 'Jaki typ hemolizy wykazuje Staphylococcus aureus?',
      o: ['Typu β (pełna hemoliza)', 'Typu α, jak Streptococcus pneumoniae', 'Typu γ (brak hemolizy)', 'Zmienny, zależny wyłącznie od podłoża', 'Nie wykazuje hemolizy'],
      a: 0,
      rationale: 'Poprawnie: hemoliza typu β (pełna). Hemoliza typu α jest cechą INNEJ, opisanej w tym kursie bakterii - Streptococcus pneumoniae - błędnie tu podstawiona.'
    },
    {
      oldQ: 'Jaki wynik testu katalazy odróżnia S. aureus od Streptococcus spp.?',
      q: 'Jaki wynik testu katalazy odróżnia Staphylococcus aureus od Streptococcus spp.?',
      o: ['Wynik dodatni', 'Wynik ujemny, jak u paciorkowców', 'Wynik zmienny, zależny od szczepu', 'Wynik słabo dodatni po 72 godzinach', 'Test nie różnicuje tych rodzajów'],
      a: 0,
      rationale: 'Poprawnie: wynik dodatni cechuje gronkowce. Paciorkowce (Streptococcus) są katalazo-UJEMNE - to właśnie ta różnica jest podstawą różnicowania obu rodzajów bakterii.'
    },
    {
      oldQ: 'Na jakim podłożu wykrywamy rozkład mannitolu przez S. aureus?',
      q: 'Na jakim podłożu wykrywamy rozkład mannitolu przez Staphylococcus aureus?',
      o: ['Na podłożu Chapmana', 'Na podłożu MacConkeya, jak Escherichia coli', 'Na podłożu TCBS, jak Vibrio cholerae', 'Na podłożu Levine\'a (EMB)', 'Na agarze czekoladowym'],
      a: 0,
      rationale: 'Poprawnie: podłoże Chapmana (mannitol salt agar), wybiórcze dla gronkowców. Pozostałe podłoża są wybiórcze dla INNYCH, opisanych w tym kursie bakterii (E. coli, Vibrio cholerae), niesłużące do oceny rozkładu mannitolu przez S. aureus.'
    },
    {
      oldQ: 'Jakie właściwości ma otoczka S. aureus?',
      q: 'Jakie właściwości ma otoczka Staphylococcus aureus?',
      o: [
        'Antyfagocytarne i antykomplementarne',
        'Wyłącznie adhezyjne, jak kwasy tejchojowe',
        'Enzymatyczne, rozkładające tkankę łączną',
        'Bezpośrednio toksyczne dla komórek gospodarza',
        'Immunostymulujące, wzmacniające odpowiedź odpornościową'
      ],
      a: 0,
      rationale: 'Poprawnie: właściwości antyfagocytarne i antykomplementarne. Funkcja adhezyjna jest cechą INNEJ, opisanej w tej kategorii struktury tej samej bakterii - kwasów tejchojowych (kolejne pytanie), a nie otoczki.'
    },
    {
      oldQ: 'Jak białko A hamuje fagocytozę?',
      q: 'Jak białko A Staphylococcus aureus hamuje fagocytozę?',
      o: [
        'Wiąże fragment Fc immunoglobulin',
        'Blokuje wiązanie dopełniacza do peptydoglikanu, jak białko M Streptococcus pyogenes',
        'Degraduje IgA na powierzchni śluzówek',
        'Wiąże fragment Fab przeciwciał',
        'Aktywuje układ dopełniacza gospodarza'
      ],
      a: 0,
      rationale: 'Poprawnie: wiązanie fragmentu Fc immunoglobulin, uniemożliwiające ich prawidłową orientację względem receptorów fagocytów. Blokada wiązania dopełniacza do peptydoglikanu jest mechanizmem INNEJ bakterii z tego kursu - białka M Streptococcus pyogenes - błędnie tu podstawiona.'
    },
    {
      oldQ: 'Jaką rolę pełnią kwasy tejchojowe S. aureus?',
      q: 'Jaką rolę pełnią kwasy tejchojowe Staphylococcus aureus?',
      o: [
        'Adhezyn',
        'Antyfagocytarną, jak otoczka',
        'Enzymatyczną, rozkładającą fibrynogen',
        'Toksyczną, bezpośrednio niszczącą komórki gospodarza',
        'Receptora dla antybiotyków beta-laktamowych'
      ],
      a: 0,
      rationale: 'Poprawnie: funkcja adhezyjna, umożliwiająca przyleganie do komórek gospodarza. Funkcja antyfagocytarna jest cechą INNEJ, opisanej w tej kategorii struktury tej samej bakterii - otoczki (poprzednie pytanie), a nie kwasów tejchojowych.'
    },
    {
      oldQ: 'Co jest receptorem dla fibrynogenu u S. aureus, powodującym wykrzepianie białek osocza?',
      q: 'Co jest receptorem dla fibrynogenu u Staphylococcus aureus, powodującym wykrzepianie białek osocza?',
      o: ['Czynnik skupiania (clumping factor)', 'Koagulaza, reagująca z protrombiną', 'Stafylokinaza, rozpuszczająca skrzep', 'Białko A', 'Hemolizyna beta'],
      a: 0,
      rationale: 'Poprawnie: czynnik skupiania (CF), wiążący fibrynogen bezpośrednio. Koagulaza działa POKREWNYM, ale odmiennym mechanizmem - reaguje z protrombiną, nie bezpośrednio z fibrynogenem (kolejne pytanie w tej kategorii).'
    },
    {
      oldQ: 'Z jakim białkiem osocza reaguje koagulaza S. aureus?',
      q: 'Z jakim białkiem osocza reaguje koagulaza Staphylococcus aureus?',
      o: ['Z protrombiną', 'Z fibrynogenem, jak czynnik skupiania', 'Z plazminogenem, jak stafylokinaza', 'Z albuminą', 'Bezpośrednio z fibryną'],
      a: 0,
      rationale: 'Poprawnie: protrombina, aktywowana przez koagulazę do postaci przekształcającej fibrynogen w fibrynę. Fibrynogen jest bezpośrednim celem INNEGO czynnika tej samej bakterii - czynnika skupiania (poprzednie pytanie), a plazminogen - stafylokinazy (kolejne pytanie).'
    },
    {
      oldQ: 'Jaką funkcję pełni stafylokinaza (w przeciwieństwie do koagulazy)?',
      q: 'Jaką funkcję pełni stafylokinaza Staphylococcus aureus, w przeciwieństwie do koagulazy?',
      o: [
        'Rozpuszcza skrzep, aktywując plazminogen do plazminy',
        'Tworzy skrzep, jak koagulaza',
        'Wiąże fragment Fc przeciwciał, jak białko A',
        'Hydrolizuje kwas hialuronowy',
        'Degraduje peptydoglikan ściany komórkowej'
      ],
      a: 0,
      rationale: 'Poprawnie: stafylokinaza (fibrynolizyna) rozpuszcza skrzep poprzez aktywację plazminogenu - funkcja PRZECIWNA do koagulazy, która skrzep tworzy. Odpowiedź "tworzy skrzep" błędnie przypisuje stafylokinazie działanie koagulazy.'
    },
    {
      oldQ: 'Jaki enzym S. aureus hydrolizuje kwas hialuronowy tkanki łącznej?',
      q: 'Jaki enzym Staphylococcus aureus hydrolizuje kwas hialuronowy tkanki łącznej?',
      o: ['Hialuronidaza', 'Koagulaza', 'Stafylokinaza', 'Penicylinaza', 'Elastaza'],
      a: 0,
      rationale: 'Poprawnie: hialuronidaza, ułatwiająca penetrację tkanek. Pozostałe to realne enzymy tej samej bakterii, ale o innym substracie działania (protrombina, plazminogen, pierścień beta-laktamowy).'
    },
    {
      oldQ: 'Która hemolizyna S. aureus jest sfingomielinazą C?',
      q: 'Która hemolizyna Staphylococcus aureus jest sfingomielinazą C?',
      o: ['Hemolizyna beta', 'Hemolizyna alfa, tworząca pory w błonie', 'Hemolizyna gamma', 'Leukocydyna Panton-Valentine', 'Eksfoliatyna'],
      a: 0,
      rationale: 'Poprawnie: hemolizyna beta, działająca jako sfingomielinaza C. Hemolizyna alfa jest INNĄ, realną hemolizyną tej samej bakterii, ale działającą poprzez tworzenie porów w błonie komórkowej, nie poprzez aktywność sfingomielinazy.'
    },
    {
      oldQ: 'Do czego służą siderofory S. aureus?',
      q: 'Do czego służą siderofory Staphylococcus aureus?',
      o: ['Do wychwytu jonów żelaza z organizmu gospodarza', 'Do wychwytu jonów wapnia', 'Do wychwytu jonów magnezu', 'Do neutralizacji przeciwciał gospodarza', 'Do degradacji dopełniacza gospodarza'],
      a: 0,
      rationale: 'Poprawnie: wychwyt żelaza, niezbędnego mikroelementu ograniczonego w organizmie gospodarza. Pozostałe funkcje są realnymi mechanizmami obrony przed odpornością, ale przypisanymi w tym kursie innym strukturom (otoczka, białko A), nie syderoforom.'
    },
    {
      oldQ: 'Jaki enzym S. aureus hydrolizuje pierścień β-laktamowy penicylin?',
      q: 'Jaki enzym Staphylococcus aureus hydrolizuje pierścień β-laktamowy penicylin?',
      o: ['Penicylinaza', 'Koagulaza', 'Hialuronidaza', 'Stafylokinaza', 'Elastaza'],
      a: 0,
      rationale: 'Poprawnie: penicylinaza (rodzaj beta-laktamazy). Pozostałe to realne enzymy tej samej bakterii, ale o innym substracie działania (białka osocza, kwas hialuronowy), niezwiązane z hydrolizą antybiotyków.'
    },
    {
      oldQ: 'W jakim zakresie pH enterotoksyny gronkowcowe zachowują aktywność?',
      q: 'W jakim zakresie pH enterotoksyny gronkowcowe Staphylococcus aureus zachowują aktywność?',
      o: ['3-11', '6-8', '1-3', '9-14', '5-9'],
      a: 0,
      rationale: 'Poprawnie wg materiału źródłowego: 3-11 - wyjątkowo szeroki zakres, tłumaczący odporność toksyn na środowisko żołądkowe. Pozostałe zakresy to wiarygodnie brzmiące, ale nieprawidłowe wartości.'
    },
    {
      oldQ: 'Które enterotoksyny gronkowcowe głównie wywołują zatrucie pokarmowe?',
      q: 'Które enterotoksyny gronkowcowe Staphylococcus aureus głównie wywołują zatrucie pokarmowe?',
      o: ['A, B i D', 'B i C, głównie wywołujące wstrząs toksyczny', 'C i D', 'Wyłącznie E', 'Wszystkie enterotoksyny jednakowo'],
      a: 0,
      rationale: 'Poprawnie wg materiału źródłowego: enterotoksyny A, B i D. Enterotoksyny B i C są w tej samej kategorii opisane jako główna przyczyna WSTRZĄSU TOKSYCZNEGO (kolejne pytanie), a nie zatrucia pokarmowego - inny obraz kliniczny tych samych/pokrewnych toksyn.'
    },
    {
      oldQ: 'Które enterotoksyny gronkowcowe głównie wywołują wstrząs toksyczny?',
      q: 'Które enterotoksyny gronkowcowe Staphylococcus aureus głównie wywołują wstrząs toksyczny?',
      o: ['B i C', 'A, B i D, głównie wywołujące zatrucie pokarmowe', 'C i D', 'Wyłącznie D', 'Wszystkie enterotoksyny jednakowo'],
      a: 0,
      rationale: 'Poprawnie wg materiału źródłowego: enterotoksyny B i C. Enterotoksyny A, B i D są w tej samej kategorii opisane jako główna przyczyna ZATRUCIA POKARMOWEGO (poprzednie pytanie), a nie wstrząsu toksycznego.'
    },
    {
      oldQ: 'Przez jakiego faga kodowane są eksfoliatyny S. aureus?',
      q: 'Przez jakiego faga kodowane są eksfoliatyny Staphylococcus aureus?',
      o: ['Faga II', 'Faga I', 'Faga III', 'Faga IV', 'Eksfoliatyny nie są kodowane przez bakteriofaga'],
      a: 0,
      rationale: 'Poprawnie wg materiału źródłowego: faga II. Pozostałe numery faga to wiarygodnie brzmiące, ale nieprawidłowe oznaczenia.'
    },
    {
      oldQ: 'Z jaką strukturą naskórka wiąże się eksfoliatyna, powodując akantolizę?',
      q: 'Z jaką strukturą naskórka wiąże się eksfoliatyna Staphylococcus aureus, powodując akantolizę?',
      o: ['Z desmogleiną 1', 'Z desmogleiną 3, jak w pęcherzycy zwykłej', 'Z keratyną', 'Z kolagenem typu VII', 'Z lamininą'],
      a: 0,
      rationale: 'Poprawnie: desmogleina 1. Desmogleina 3 jest realnym, INNYM białkiem desmosomalnym, będącym celem autoprzeciwciał w pęcherzycy zwykłej (choroba autoimmunologiczna, nie infekcyjna) - błędnie tu podstawiona.'
    },
    {
      oldQ: 'Za jaki zespół chorobowy odpowiadają eksfoliatyny S. aureus?',
      q: 'Za jaki zespół chorobowy odpowiadają eksfoliatyny Staphylococcus aureus?',
      o: [
        'Gronkowcowy zespół skóry oparzonej (SSSS)',
        'Gronkowcowy zespół wstrząsu toksycznego (STSS)',
        'Gronkowcowe zatrucie pokarmowe',
        'Karbunkuł',
        'Zespół hemolityczno-mocznicowy'
      ],
      a: 0,
      rationale: 'Poprawnie: gronkowcowy zespół skóry oparzonej (SSSS). STSS jest wywoływany przez INNĄ, opisaną w tej kategorii toksynę tej samej bakterii - TSST-1, o zupełnie innym mechanizmie (superantygen, nie proteaza desmosomalna).'
    },
    {
      oldQ: 'Co robi leukocydyna Panton-Valentine (PVL)?',
      q: 'Jaki jest mechanizm działania leukocydyny Panton-Valentine (PVL)?',
      o: [
        'Perforuje błonę cytoplazmatyczną neutrofilów, monocytów i makrofagów, hamując fagocytozę',
        'Wiąże fragment Fc przeciwciał, jak białko A',
        'Aktywuje plazminogen do plazminy, jak stafylokinaza',
        'Hydrolizuje peptydoglikan ściany komórkowej',
        'Wiąże fibrynogen, jak czynnik skupiania'
      ],
      a: 0,
      rationale: 'Poprawnie: perforacja błony komórek odpornościowych (neutrofile, monocyty, makrofagi), hamująca fagocytozę. Pozostałe mechanizmy są realnymi, ale INNYMI czynnikami wirulencji tej samej bakterii, opisanymi w tej kategorii (białko A, stafylokinaza, czynnik skupiania).'
    },
    {
      oldQ: 'Gdzie najczęściej występuje S. aureus jako składnik mikrobioty (nosicielstwo)?',
      q: 'Gdzie najczęściej występuje Staphylococcus aureus jako składnik mikrobioty (nosicielstwo)?',
      o: ['W przedsionku nosa', 'W jamie ustnej', 'W jelicie grubym', 'W pochwie', 'Wyłącznie na skórze dłoni'],
      a: 0,
      rationale: 'Poprawnie: przedsionek nosa - główne miejsce bezobjawowego nosicielstwa S. aureus. Pozostałe lokalizacje są realnymi niszami ekologicznymi INNYCH bakterii z tego kursu (flora jelitowa, pochwowa), nie typowym miejscem nosicielstwa S. aureus.'
    },
    {
      oldQ: 'Jak nazywa się zlokalizowane zapalenie mieszka włosowego rzęs (powieki)?',
      q: 'Jak nazywa się zlokalizowane zapalenie mieszka włosowego rzęs (powieki)?',
      o: ['Jęczmień', 'Figówka, dotycząca brody', 'Karbunkuł (czyrak gromadny)', 'Liszajec', 'Róża'],
      a: 0,
      rationale: 'Poprawnie: jęczmień. Figówka to INNE, opisane w tej kategorii zapalenie mieszków włosowych tej samej bakterii, ale zlokalizowane w obrębie brody (kolejne pytanie), nie powieki.'
    },
    {
      oldQ: 'Jak nazywa się rozsiane zapalenie mieszka włosowego brody?',
      q: 'Jak nazywa się rozsiane zapalenie mieszków włosowych brody?',
      o: ['Figówka', 'Jęczmień, dotyczący powieki', 'Karbunkuł (czyrak gromadny)', 'Liszajec', 'Róża'],
      a: 0,
      rationale: 'Poprawnie: figówka. Jęczmień to INNE, opisane w tej kategorii zapalenie mieszka włosowego tej samej bakterii, ale zlokalizowane w obrębie powieki (poprzednie pytanie), nie brody.'
    },
    {
      oldQ: 'Jak nazywa się czyrak gromadny?',
      q: 'Jak inaczej nazywa się czyrak gromadny?',
      o: ['Karbunkuł', 'Jęczmień', 'Figówka', 'Ropień mnogi pach', 'Liszajec'],
      a: 0,
      rationale: 'Poprawnie: karbunkuł. Jęczmień i figówka to inne, opisane w tej kategorii zmiany skórne wywoływane przez tę samą bakterię, ale o innej lokalizacji i mniejszym nasileniu.'
    },
    {
      oldQ: 'Po ilu godzinach od spożycia skażonego pokarmu pojawiają się objawy gronkowcowego zatrucia pokarmowego (SFP)?',
      q: 'Po ilu godzinach od spożycia skażonego pokarmu pojawiają się objawy gronkowcowego zatrucia pokarmowego (SFP)?',
      o: ['Po 1-6 godzinach', 'Po 12-24 godzinach', 'Po 3-5 dniach', 'Natychmiast po spożyciu', 'Po 24-48 godzinach'],
      a: 0,
      rationale: 'Poprawnie wg materiału źródłowego: 1-6 godzin - krótki okres inkubacji typowy dla intoksykacji toksyną preformowaną. Pozostałe wartości to wiarygodnie brzmiące, ale nieprawidłowe zakresy czasowe.'
    },
    {
      oldQ: 'Czy gronkowcowemu zatruciu pokarmowemu towarzyszy gorączka?',
      q: 'Czy gronkowcowemu zatruciu pokarmowemu towarzyszy gorączka?',
      o: [
        'Nie',
        'Tak, zawsze wysoka gorączka',
        'Tak, ale tylko u dzieci',
        'Zależy wyłącznie od ilości spożytej toksyny',
        'Tak, gorączka utrzymuje się kilka dni'
      ],
      a: 0,
      rationale: 'Poprawnie: nie - brak gorączki jest istotną cechą odróżniającą intoksykację gronkowcową od zakażeń inwazyjnych. Pozostałe opcje błędnie zakładają obecność gorączki w różnych wariantach.'
    },
    {
      oldQ: 'Z czym najczęściej związane są przypadki gronkowcowego zespołu wstrząsu toksycznego (STSS)?',
      q: 'Z czym najczęściej związane są przypadki gronkowcowego zespołu wstrząsu toksycznego (STSS)?',
      o: [
        'Z menstruacją i tamponami dopochwowymi',
        'Z zakażeniami ran chirurgicznych wyłącznie',
        'Z cewnikowaniem pęcherza moczowego',
        'Z zapaleniem płuc',
        'Z zakażeniami skóry noworodków'
      ],
      a: 0,
      rationale: 'Poprawnie wg materiału źródłowego: menstruacja i stosowanie tamponów dopochwowych - klasyczny, historyczny kontekst epidemiologiczny STSS. Pozostałe sytuacje kliniczne są realnymi możliwymi źródłami zakażenia gronkowcowego, ale niebędącymi najczęstszym skojarzeniem z STSS.'
    },
    {
      oldQ: 'Jaka toksyna odpowiada za większość przypadków gronkowcowego wstrząsu toksycznego?',
      q: 'Jaka toksyna odpowiada za większość przypadków gronkowcowego wstrząsu toksycznego?',
      o: ['TSST-1', 'Enterotoksyna A', 'Leukocydyna Panton-Valentine (PVL)', 'Eksfoliatyna', 'Hemolizyna alfa'],
      a: 0,
      rationale: 'Poprawnie: TSST-1 (toxic shock syndrome toxin-1), superantygen odpowiedzialny za większość przypadków STSS. Pozostałe to realne, inne toksyny tej samej bakterii, ale odpowiedzialne za odmienne zespoły chorobowe (zatrucie pokarmowe, martwicze zapalenie płuc, SSSS).'
    },
    {
      oldQ: 'Jaka jest śmiertelność STSS związanego z menstruacją?',
      q: 'Jaka jest śmiertelność gronkowcowego zespołu wstrząsu toksycznego związanego z menstruacją?',
      o: ['2,5%', '25%', '50%', '0,1%', '10%'],
      a: 0,
      rationale: 'Poprawnie wg materiału źródłowego: 2,5%. Pozostałe wartości to wiarygodnie brzmiące, ale nieprawidłowe odsetki śmiertelności.'
    },
    {
      oldQ: 'Jaki zespół wewnątrznaczyniowego wykrzepiania rozwija się w niewydolności wielonarządowej STSS?',
      q: 'Jaki zespół wewnątrznaczyniowego wykrzepiania rozwija się w niewydolności wielonarządowej w przebiegu STSS?',
      o: [
        'Rozsiane wykrzepianie wewnątrznaczyniowe (DIC)',
        'Zespół hemolityczno-mocznicowy (HUS)',
        'Przełom aplastyczny',
        'Wstrząs anafilaktyczny',
        'Zator tętnicy płucnej'
      ],
      a: 0,
      rationale: 'Poprawnie: DIC (rozsiane wykrzepianie wewnątrznaczyniowe), typowe powikłanie ciężkiej sepsy/wstrząsu toksycznego. Zespół hemolityczno-mocznicowy jest realnym, ale INNYM zespołem opisanym w tym kursie, będącym powikłaniem zakażenia EHEC, nie STSS.'
    },
    {
      oldQ: 'Jakich produktów kobiety nie powinny stosować po przebyciu STSS?',
      q: 'Jakich produktów kobiety nie powinny stosować po przebyciu STSS?',
      o: [
        'Tamponów dopochwowych i mechanicznych środków antykoncepcyjnych',
        'Antybiotyków doustnych',
        'Leków przeciwbólowych',
        'Hormonalnych środków antykoncepcyjnych',
        'Kosmetyków do higieny intymnej'
      ],
      a: 0,
      rationale: 'Poprawnie wg materiału źródłowego: tampony dopochwowe i mechaniczne środki antykoncepcyjne - czynniki ryzyka nawrotu STSS. Pozostałe opcje nie są związane z udokumentowanym ryzykiem nawrotu tego zespołu.'
    },
    {
      oldQ: 'Jaka cytotoksyna S. aureus (wydzielana głównie przez MRSA) odpowiada za martwicze zapalenie płuc?',
      q: 'Jaka cytotoksyna Staphylococcus aureus, wydzielana głównie przez szczepy MRSA, odpowiada za martwicze zapalenie płuc?',
      o: ['Leukocydyna Panton-Valentine (PVL)', 'TSST-1', 'Eksfoliatyna', 'Koagulaza', 'Czynnik skupiania'],
      a: 0,
      rationale: 'Poprawnie: PVL (leukocydyna Panton-Valentine), silnie związana ze szczepami MRSA i martwiczym zapaleniem płuc. Pozostałe to realne, inne czynniki wirulencji tej samej bakterii, ale odpowiedzialne za odmienne zespoły chorobowe.'
    },
    {
      oldQ: 'U jakiej grupy wiekowej najczęściej występuje gronkowcowy zespół skóry oparzonej (SSSS)?',
      q: 'U jakiej grupy wiekowej najczęściej występuje gronkowcowy zespół skóry oparzonej (SSSS)?',
      o: [
        'U niemowląt i małych dzieci do 5. roku życia',
        'U osób starszych powyżej 65. roku życia',
        'U młodzieży w wieku 15-18 lat',
        'U dorosłych w średnim wieku',
        'Wyłącznie u noworodków do 1. miesiąca życia'
      ],
      a: 0,
      rationale: 'Poprawnie wg materiału źródłowego: niemowlęta i małe dzieci do 5. roku życia - grupa o niedojrzałej odporności i niewydolności nerkowej eliminacji toksyny. Ostatnia opcja nadmiernie zawęża tę grupę wiekową względem podanego w źródle zakresu.'
    },
    {
      oldQ: 'Jak nazywa się dodatni objaw spełzania naskórka w SSSS?',
      q: 'Jak nazywa się dodatni objaw spełzania naskórka w SSSS?',
      o: ['Objaw Nikolskiego', 'Objaw Kerniga', 'Objaw Chvostka', 'Plamki Koplika', 'Język malinowy'],
      a: 0,
      rationale: 'Poprawnie: objaw Nikolskiego. Pozostałe to realne, nazwane objawy kliniczne, ale związane z zupełnie innymi jednostkami chorobowymi (podrażnienie opon mózgowo-rdzeniowych, tężyczka, odra, płonica).'
    },
    {
      oldQ: 'Jaki antybiotyk z grupy gronkowcowych penicylin półsyntetycznych stosuje się w zakażeniach S. aureus?',
      q: 'Jaki antybiotyk z grupy gronkowcowych penicylin półsyntetycznych stosuje się w zakażeniach Staphylococcus aureus?',
      o: ['Kloksacylina', 'Ampicylina', 'Penicylina benzylowa', 'Amoksycylina', 'Piperacylina'],
      a: 0,
      rationale: 'Poprawnie: kloksacylina, penicylina półsyntetyczna oporna na gronkowcowe penicylinazy. Pozostałe to realne penicyliny, ale wrażliwe na hydrolizę przez penicylinazę S. aureus, więc nieskuteczne w tym wskazaniu.'
    },
    {
      oldQ: 'Co oznacza skrót MRSA?',
      q: 'Co oznacza skrót MRSA?',
      o: [
        'Oporność Staphylococcus aureus na metycylinę',
        'Oporność Staphylococcus aureus na wankomycynę, jak VRSA',
        'Oporność na makrolidy, linkozamidy i streptograminy B, jak MLSb',
        'Wrażliwość Staphylococcus aureus na metycylinę (MSSA)',
        'Zmniejszoną wrażliwość na wankomycynę i teikoplaninę, jak VISA'
      ],
      a: 0,
      rationale: 'Poprawnie: MRSA - gronkowiec złocisty oporny na metycylinę (beta-laktamy). VRSA to realny, INNY, opisany w tej kategorii mechanizm oporności tej samej bakterii - na wankomycynę, nie na metycylinę.'
    },
    {
      oldQ: 'Jakimi antybiotykami leczy się zakażenia MRSA?',
      q: 'Jakimi antybiotykami leczy się zakażenia MRSA?',
      o: [
        'Wankomycyną lub linezolidem',
        'Kloksacyliną, nieskuteczną wobec MRSA z definicji',
        'Penicyliną benzylową',
        'Ampicyliną',
        'Cefalosporynami I generacji'
      ],
      a: 0,
      rationale: 'Poprawnie: wankomycyna lub linezolid. Kloksacylina, mimo skuteczności wobec wrażliwych szczepów S. aureus (inne pytanie w tej kategorii), jest z definicji NIESKUTECZNA wobec MRSA - właśnie oporność na tę grupę leków definiuje MRSA.'
    },
    {
      oldQ: 'Co oznacza oporność typu MLSb?',
      q: 'Co oznacza oporność typu MLSb?',
      o: [
        'Oporność na makrolidy, linkozamidy i streptograminy B',
        'Oporność Staphylococcus aureus na metycylinę, jak MRSA',
        'Oporność Staphylococcus aureus na wankomycynę, jak VRSA',
        'Wysoką oporność enterokoków na aminoglikozydy, jak HLAR',
        'Produkcję beta-laktamaz o rozszerzonym spektrum, jak ESBL'
      ],
      a: 0,
      rationale: 'Poprawnie: MLSb - oporność krzyżowa na makrolidy, linkozamidy i streptograminy B. Pozostałe to realne, inne skróty oporności opisane w tym kursie, dotyczące zupełnie innych grup leków lub innych bakterii.'
    },
    {
      oldQ: 'Co oznacza VRSA i jakim lekiem się to leczy?',
      q: 'Co oznacza VRSA, i jakim lekiem leczy się takie zakażenie?',
      o: [
        'Oporność na wankomycynę; leczenie linezolidem',
        'Oporność na metycylinę, jak MRSA; leczenie wankomycyną',
        'Obniżoną wrażliwość na wankomycynę i teikoplaninę (VISA); leczenie cefalosporynami V generacji',
        'Oporność na makrolidy, linkozamidy i streptograminy B; leczenie linezolidem',
        'Wysoką oporność na aminoglikozydy; leczenie ampicyliną z gentamycyną'
      ],
      a: 0,
      rationale: 'Poprawnie: VRSA - oporność S. aureus na wankomycynę, leczona linezolidem. MRSA jest INNYM, opisanym w tej kategorii mechanizmem oporności tej samej bakterii - na metycylinę (leczoną właśnie wankomycyną) - odwrotna zależność lek/oporność.'
    },
    {
      oldQ: 'Jaki gen (na kasecie SCCmec) jest genetycznym podłożem metycylinooporności S. aureus?',
      q: 'Jaki gen, zlokalizowany na kasecie SCCmec, jest genetycznym podłożem metycylinooporności Staphylococcus aureus?',
      o: ['Gen mecA', 'Gen vanA, warunkujący oporność na wankomycynę', 'Gen mcr, warunkujący oporność na kolistynę', 'Gen blaKPC, kodujący karbapenemazę', 'Gen tet, warunkujący oporność na tetracykliny'],
      a: 0,
      rationale: 'Poprawnie: gen mecA, kodujący zmodyfikowane białko PBP2a o obniżonym powinowactwie do beta-laktamów. Pozostałe to realne geny oporności omawiane w tym kursie, ale warunkujące oporność na zupełnie inne grupy leków (wankomycyna, kolistyna, karbapenemy, tetracykliny) u różnych bakterii.'
    }
  ]
};

const raw = JSON.parse(fs.readFileSync('mikrobiologia_cwiczenia_raw.json', 'utf8'));
let totalConverted = 0;
const out = raw.map(item => {
  const list = categories[item.category];
  if (!list) return item;
  const c = list.find(x => x.oldQ === item.q);
  if (!c) {
    console.log('NO CONVERSION FOUND for [' + item.category + ']:', item.q);
    return item;
  }
  totalConverted++;
  return { category: item.category, q: c.q, o: c.o, a: c.a, rationale: c.rationale };
});

for (const cat of Object.keys(categories)) {
  const remaining = out.filter(i => i.category === cat && i.mode === 'typed').length;
  console.log(cat, '-> remaining typed:', remaining);
}
console.log('total converted:', totalConverted);
fs.writeFileSync('mikrobiologia_cwiczenia_raw.json', JSON.stringify(out, null, 2));
