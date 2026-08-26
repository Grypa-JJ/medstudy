import fs from 'fs';

const categories = {
  'Ćwiczenie 7 — Zakażenia układu oddechowego': [
    {
      oldQ: 'Jaki drobnoustrój wywołuje anginę paciorkowcową?',
      q: 'Jaki drobnoustrój wywołuje anginę paciorkowcową?',
      o: ['Streptococcus pyogenes', 'Streptococcus pneumoniae', 'Haemophilus influenzae', 'Corynebacterium diphtheriae', 'Mycoplasma pneumoniae'],
      a: 0,
      rationale: 'Poprawnie: Streptococcus pyogenes. Pozostałe to realne, inne patogeny dróg oddechowych z tej kategorii, wywołujące odmienne jednostki chorobowe (zapalenie płuc, błonicę, atypowe zapalenie płuc).'
    },
    {
      oldQ: 'Jakim antybiotykiem leczy się anginę paciorkowcową ambulatoryjnie (doustnie)?',
      q: 'Jakim antybiotykiem leczy się anginę paciorkowcową ambulatoryjnie (doustnie)?',
      o: ['Fenoksypenicyliną', 'Makrolidem, jak w zakażeniu Mycoplasma pneumoniae', 'Ceftriaksonem', 'Wankomycyną', 'Metronidazolem'],
      a: 0,
      rationale: 'Poprawnie: fenoksypenicylina (penicylina V) - lek pierwszego wyboru w anginie paciorkowcowej. Makrolidy są lekiem z wyboru w INNYM, opisanym w tej kategorii zakażeniu - Mycoplasma pneumoniae (dalsze pytanie), nie w anginie paciorkowcowej.'
    },
    {
      oldQ: 'Jaka toksyna S. pyogenes odpowiada za wystąpienie szkarlatyny?',
      q: 'Jaka toksyna Streptococcus pyogenes odpowiada za wystąpienie szkarlatyny?',
      o: ['Toksyna pirogenna (erytrogenna)', 'Toksyna błonicza, jak Corynebacterium diphtheriae', 'Toksyna krztuścowa, jak Bordetella pertussis', 'TSST-1, jak Staphylococcus aureus', 'Leukocydyna Panton-Valentine'],
      a: 0,
      rationale: 'Poprawnie: toksyna pirogenna (erytrogenna), superantygen odpowiedzialny za wysypkę płoniczą. Pozostałe to realne toksyny innych, opisanych w tym kursie bakterii (Corynebacterium, Bordetella, Staphylococcus), niezwiązane ze szkarlatyną.'
    },
    {
      oldQ: 'Jaki drobnoustrój wywołuje atypowe zapalenie płuc z suchym kaszlem, na które nie działa penicylina?',
      q: 'Jaki drobnoustrój wywołuje atypowe zapalenie płuc z suchym kaszlem, na które nie działa penicylina?',
      o: ['Mycoplasma pneumoniae', 'Streptococcus pneumoniae, wrażliwy na penicylinę', 'Haemophilus influenzae', 'Klebsiella pneumoniae', 'Legionella pneumophila, o innym rezerwuarze środowiskowym'],
      a: 0,
      rationale: 'Poprawnie: Mycoplasma pneumoniae. Streptococcus pneumoniae wywołuje typowe zapalenie płuc, zwykle wrażliwe na penicylinę - przeciwna cecha kliniczna i mikrobiologiczna względem opisanej w pytaniu.'
    },
    {
      oldQ: 'Dlaczego penicylina nie działa na Mycoplasma pneumoniae?',
      q: 'Dlaczego penicylina nie działa na Mycoplasma pneumoniae?',
      o: [
        'Brak ściany komórkowej',
        'Posiada otoczkę hamującą wnikanie leku',
        'Produkuje beta-laktamazę, jak niektóre szczepy Haemophilus influenzae',
        'Jest bakterią wyłącznie wewnątrzkomórkową, jak Chlamydia',
        'Ma zmienione białka PBP, jak MRSA'
      ],
      a: 0,
      rationale: 'Poprawnie: brak ściany komórkowej - penicylina, hamując PBP zaangażowane w syntezę peptydoglikanu, nie ma punktu uchwytu. Produkcja beta-laktamazy to realny, ale INNY mechanizm oporności opisany dla Haemophilus influenzae w tym kursie, niezwiązany z budową Mycoplasma.'
    },
    {
      oldQ: 'Jaką grupą antybiotyków leczy się zakażenie Mycoplasma pneumoniae?',
      q: 'Jaką grupą antybiotyków leczy się zakażenie Mycoplasma pneumoniae?',
      o: ['Makrolidami', 'Beta-laktamami, jak w zakażeniu Haemophilus influenzae', 'Aminoglikozydami', 'Fenoksypenicyliną, jak w anginie paciorkowcowej', 'Sulfonamidami'],
      a: 0,
      rationale: 'Poprawnie: makrolidy, działające na rybosom, a nie na ścianę komórkową. Beta-laktamy są nieskuteczne z powodu braku ściany komórkowej Mycoplasma (inne pytanie w tej kategorii) - błędnie tu podstawione.'
    },
    {
      oldQ: 'Od jakiej grupy antybiotyków zaczynamy leczenie zakażenia Haemophilus influenzae?',
      q: 'Od jakiej grupy antybiotyków zaczynamy leczenie zakażenia Haemophilus influenzae?',
      o: ['Od beta-laktamów', 'Od makrolidów, jak w zakażeniu Mycoplasma pneumoniae', 'Od aminoglikozydów', 'Od glikopeptydów', 'Od nitroimidazoli'],
      a: 0,
      rationale: 'Poprawnie: beta-laktamy, jako leczenie pierwszego rzutu. Makrolidy są lekiem z wyboru w INNYM, opisanym w tej kategorii zakażeniu - Mycoplasma pneumoniae, bakterii pozbawionej ściany komórkowej.'
    },
    {
      oldQ: 'Jaki jest główny czynnik chorobotwórczości Streptococcus pneumoniae odpowiedzialny za działanie antyfagocytarne?',
      q: 'Jaki jest główny czynnik chorobotwórczości Streptococcus pneumoniae odpowiedzialny za działanie antyfagocytarne?',
      o: ['Otoczka polisacharydowa', 'Pneumolizyna, o działaniu cytolitycznym', 'Proteaza IgA1', 'Toksyna błonicza', 'Lipooligosacharyd (LOS), jak Haemophilus influenzae'],
      a: 0,
      rationale: 'Poprawnie: otoczka polisacharydowa, kluczowa dla oporności na fagocytozę. Pneumolizyna to INNY, opisany w tej kategorii czynnik tej samej bakterii, działający cytolitycznie na błony komórkowe, nie antyfagocytarnie.'
    },
    {
      oldQ: 'Jaka hemolizyna/cytolizyna S. pneumoniae uszkadza błony komórkowe i rzęski nabłonka oddechowego?',
      q: 'Jaka hemolizyna/cytolizyna Streptococcus pneumoniae uszkadza błony komórkowe i rzęski nabłonka oddechowego?',
      o: ['Pneumolizyna', 'Otoczka polisacharydowa, o działaniu antyfagocytarnym', 'Proteaza IgA1', 'Hemolizyna beta, jak Staphylococcus aureus', 'Leukocydyna Panton-Valentine'],
      a: 0,
      rationale: 'Poprawnie: pneumolizyna. Otoczka polisacharydowa to INNY, opisany w tej kategorii czynnik tej samej bakterii, działający antyfagocytarnie, nie cytolitycznie na błony komórkowe.'
    },
    {
      oldQ: 'Jaki enzym S. pneumoniae rozkłada wydzielniczą IgA, ułatwiając kolonizację błon śluzowych?',
      q: 'Jaki enzym Streptococcus pneumoniae rozkłada wydzielniczą IgA, ułatwiając kolonizację błon śluzowych?',
      o: ['Proteaza IgA1', 'Pneumolizyna', 'Otoczka polisacharydowa, niebędąca enzymem', 'Hialuronidaza, jak Staphylococcus aureus', 'Ureaza'],
      a: 0,
      rationale: 'Poprawnie: proteaza IgA1. Pneumolizyna to INNY, opisany w tej kategorii czynnik tej samej bakterii, działający cytolitycznie, a nie proteolitycznie na immunoglobuliny.'
    },
    {
      oldQ: 'Jaki drobnoustrój wywołuje krztusiec?',
      q: 'Jaki drobnoustrój wywołuje krztusiec?',
      o: ['Bordetella pertussis', 'Corynebacterium diphtheriae, wywołujące błonicę', 'Mycoplasma pneumoniae', 'Streptococcus pyogenes', 'Haemophilus influenzae'],
      a: 0,
      rationale: 'Poprawnie: Bordetella pertussis. Pozostałe to realne, inne patogeny dróg oddechowych z tej kategorii, wywołujące odmienne jednostki chorobowe.'
    },
    {
      oldQ: 'Jak nazywa się białko Bordetella pertussis umożliwiające adhezję do nabłonka rzęskowego?',
      q: 'Jak nazywa się białko Bordetella pertussis umożliwiające adhezję do nabłonka rzęskowego?',
      o: ['Hemaglutynina włókienkowa (FHA)', 'Białko P1, jak Mycoplasma pneumoniae', 'Intimina, jak Escherichia coli', 'Czynnik skupiania, jak Staphylococcus aureus', 'Pilus koniugacyjny'],
      a: 0,
      rationale: 'Poprawnie: hemaglutynina włókienkowa (FHA). Białko P1 jest analogicznym, ale INNYM, opisanym w tej kategorii białkiem adhezyjnym innej bakterii - Mycoplasma pneumoniae.'
    },
    {
      oldQ: 'Jak nazywa się główna toksyna Bordetella pertussis zaburzająca sygnalizację komórkową (ADP-rybozylacja białek G)?',
      q: 'Jak nazywa się główna toksyna Bordetella pertussis, zaburzająca sygnalizację komórkową poprzez ADP-rybozylację białek G?',
      o: ['Toksyna krztuścowa (PT)', 'Toksyna błonicza, inaktywująca EF-2', 'Toksyna pirogenna, jak Streptococcus pyogenes', 'Toksyna botulinowa', 'Hemolizyna beta'],
      a: 0,
      rationale: 'Poprawnie: toksyna krztuścowa (PT). Toksyna błonicza to INNA, opisana w tej kategorii toksyna, działająca innym mechanizmem - inaktywacją czynnika elongacyjnego EF-2, a nie ADP-rybozylacją białek G.'
    },
    {
      oldQ: 'Jaki typ otoczki Haemophilus influenzae jest najbardziej inwazyjny (odpowiedzialny za ciężkie zakażenia inwazyjne)?',
      q: 'Jaki typ otoczki Haemophilus influenzae jest najbardziej inwazyjny, odpowiedzialny za ciężkie zakażenia inwazyjne?',
      o: ['Typ b (Hib)', 'Typ a', 'Typ c', 'Typ d', 'Typ f'],
      a: 0,
      rationale: 'Poprawnie: typ b (Hib), przeciwko któremu opracowano obowiązkowe szczepienie. Pozostałe typy otoczkowe są realne, ale znacznie rzadziej związane z ciężkimi zakażeniami inwazyjnymi.'
    },
    {
      oldQ: 'Jaki endotoksynowy składnik ściany komórkowej ma Haemophilus influenzae zamiast pełnego LPS?',
      q: 'Jaki endotoksynowy składnik ściany komórkowej ma Haemophilus influenzae zamiast pełnego LPS?',
      o: [
        'Lipooligosacharyd (LOS)',
        'Pełny LPS z łańcuchem O-swoistym, jak typowe Enterobacterales',
        'Kwas tejchojowy',
        'Peptydoglikan wyłącznie, bez elementu endotoksynowego',
        'Otoczkę polisacharydową, jak Streptococcus pneumoniae'
      ],
      a: 0,
      rationale: 'Poprawnie: lipooligosacharyd (LOS), pozbawiony powtarzalnego łańcucha O-swoistego charakterystycznego dla pełnego LPS Enterobacterales. Otoczka polisacharydowa to INNA, opisana w tym kursie struktura innej bakterii - Streptococcus pneumoniae.'
    },
    {
      oldQ: 'Jaki jest rezerwuar Legionella pneumophila?',
      q: 'Jaki jest rezerwuar Legionella pneumophila?',
      o: ['Woda (systemy wodne)', 'Gleba, jak Clostridium botulinum', 'Przewód pokarmowy zwierząt domowych', 'Nosogardło człowieka, jak Neisseria meningitidis', 'Skóra człowieka'],
      a: 0,
      rationale: 'Poprawnie: woda, w tym systemy wodne budynków (klimatyzacja, instalacje). Gleba jest rezerwuarem INNEJ, opisanej w tym kursie bakterii - Clostridium botulinum, a nosogardło - Neisseria meningitidis.'
    },
    {
      oldQ: 'Jaka jest droga zakażenia Legionella pneumophila?',
      q: 'Jaka jest droga zakażenia Legionella pneumophila?',
      o: [
        'Inhalacja skażonego aerozolu wodnego',
        'Droga kropelkowa, bezpośrednio między ludźmi',
        'Droga pokarmowa',
        'Droga płciowa',
        'Droga przezłożyskowa'
      ],
      a: 0,
      rationale: 'Poprawnie: inhalacja aerozolu wodnego. Legionella, w odróżnieniu od wielu innych patogenów oddechowych z tego kursu, NIE przenosi się drogą kropelkową bezpośrednio między ludźmi - istotna cecha epidemiologiczna.'
    },
    {
      oldQ: 'Jak nazywa się łagodna, grypopodobna postać choroby wywołanej przez Legionella pneumophila?',
      q: 'Jak nazywa się łagodna, grypopodobna postać choroby wywołanej przez Legionella pneumophila?',
      o: ['Gorączka Pontiac', 'Choroba legionistów, ciężka postać tej samej bakterii', 'Gorączka reumatyczna', 'Gorączka Q', 'Grypa sezonowa'],
      a: 0,
      rationale: 'Poprawnie: gorączka Pontiac, łagodna postać. Choroba legionistów to CIĘŻKA, opisana w tej kategorii postać zakażenia tą samą bakterią (kolejne pytanie) - przeciwny biegun nasilenia tej samej infekcji.'
    },
    {
      oldQ: 'Jak nazywa się ciężka postać zapalenia płuc wywołana przez Legionella pneumophila?',
      q: 'Jak nazywa się ciężka postać zapalenia płuc wywołana przez Legionella pneumophila?',
      o: ['Choroba legionistów', 'Gorączka Pontiac, łagodna postać tej samej bakterii', 'Atypowe zapalenie płuc wywołane przez Mycoplasma pneumoniae', 'Zespół hemolityczno-mocznicowy', 'Zespół Guillaina-Barrégo'],
      a: 0,
      rationale: 'Poprawnie: choroba legionistów, ciężka postać z zapaleniem płuc. Gorączka Pontiac to ŁAGODNA, opisana w tej kategorii postać zakażenia tą samą bakterią (poprzednie pytanie) - przeciwny biegun nasilenia tej samej infekcji.'
    },
    {
      oldQ: 'Jaki drobnoustrój wywołuje błonicę?',
      q: 'Jaki drobnoustrój wywołuje błonicę?',
      o: ['Corynebacterium diphtheriae', 'Bordetella pertussis, wywołująca krztusiec', 'Streptococcus pyogenes', 'Mycoplasma pneumoniae', 'Klebsiella pneumoniae'],
      a: 0,
      rationale: 'Poprawnie: Corynebacterium diphtheriae. Pozostałe to realne, inne patogeny dróg oddechowych z tej kategorii, wywołujące odmienne jednostki chorobowe.'
    },
    {
      oldQ: 'Jaki jest główny czynnik wirulencji Corynebacterium diphtheriae?',
      q: 'Jaki jest główny czynnik wirulencji Corynebacterium diphtheriae?',
      o: ['Toksyna błonicza', 'Toksyna krztuścowa, jak Bordetella pertussis', 'Toksyna pirogenna, jak Streptococcus pyogenes', 'Pneumolizyna', 'Hemolizyna beta'],
      a: 0,
      rationale: 'Poprawnie: toksyna błonicza. Pozostałe to realne toksyny innych, opisanych w tym kursie bakterii (Bordetella, Streptococcus pyogenes, Streptococcus pneumoniae, Staphylococcus aureus), niezwiązane z błonicą.'
    },
    {
      oldQ: 'Jaki czynnik elongacyjny inaktywuje toksyna błonicza, hamując syntezę białek?',
      q: 'Jaki czynnik elongacyjny inaktywuje toksyna błonicza, hamując syntezę białek?',
      o: ['EF-2', 'Białka G, jak toksyna krztuścowa', 'eIF2, jak kinaza PKR w odpowiedzi interferonowej', 'Podjednostkę rybosomalną 30S bezpośrednio', 'Kinazy tyrozynowe'],
      a: 0,
      rationale: 'Poprawnie: czynnik elongacyjny EF-2. ADP-rybozylacja białek G jest mechanizmem INNEJ, opisanej w tej kategorii toksyny - toksyny krztuścowej Bordetella pertussis, a eIF2 to cel działania kinazy PKR w zupełnie innym, wirusologicznym kontekście (z innego kursu).'
    },
    {
      oldQ: 'Jakim barwieniem uwidacznia się prątki gruźlicy (Mycobacterium tuberculosis) zamiast metodą Grama?',
      q: 'Jakim barwieniem uwidacznia się prątki gruźlicy (Mycobacterium tuberculosis) zamiast metodą Grama?',
      o: ['Metodą Ziehl-Neelsena', 'Metodą Schaeffera-Fultona, jak endospory bakteryjne', 'Metodą wysrebrzania, jak Treponema pallidum', 'Barwieniem Giemsy', 'Zmodyfikowaną metodą Grama z dłuższym utrwalaniem'],
      a: 0,
      rationale: 'Poprawnie: metoda Ziehl-Neelsena, wykorzystująca kwasooporność prątków. Metoda Schaeffera-Fultona i metoda wysrebrzania to inne, realne techniki barwienia omawiane w tym kursie, ale służące do uwidaczniania odpowiednio endospor i krętków Treponema.'
    },
    {
      oldQ: 'Dlaczego prątki (Mycobacterium) są kwasooporne?',
      q: 'Dlaczego prątki (Mycobacterium) są kwasooporne?',
      o: [
        'Z powodu wysokiej zawartości kwasów mikolowych w ścianie komórkowej',
        'Z powodu obecności kwasu tejchojowego, jak bakterie Gram-dodatnie',
        'Z powodu obecności LPS, jak bakterie Gram-ujemne',
        'Z powodu zdolności tworzenia endospor',
        'Z powodu grubej otoczki polisacharydowej'
      ],
      a: 0,
      rationale: 'Poprawnie: wysoka zawartość kwasów mikolowych w ścianie komórkowej. Kwas tejchojowy i LPS to składniki ścian komórkowych typowych bakterii Gram-dodatnich i Gram-ujemnych - inna budowa niż wyjątkowa ściana prątków.'
    },
    {
      oldQ: 'Jak nazywa się glikolipid powierzchniowy prątków, hamujący fuzję fagosomu z lizosomem?',
      q: 'Jak nazywa się glikolipid powierzchniowy prątków, hamujący fuzję fagosomu z lizosomem?',
      o: ['Czynnik wiązkowy (cord factor)', 'Kwasy mikolowe bezpośrednio, odpowiedzialne za kwasooporność', 'Arabinogalaktan', 'Lipooligosacharyd (LOS)', 'Otoczka polisacharydowa'],
      a: 0,
      rationale: 'Poprawnie: czynnik wiązkowy (cord factor), hamujący fuzję fagosomalno-lizosomalną. Kwasy mikolowe odpowiadają w tej samej kategorii za INNĄ cechę - kwasooporność w barwieniu (poprzednie pytanie), nie za hamowanie fuzji fagosomu z lizosomem.'
    },
    {
      oldQ: 'Jaką drogą przenoszony jest Mycobacterium tuberculosis?',
      q: 'Jaką drogą przenoszony jest Mycobacterium tuberculosis?',
      o: ['Drogą kropelkową', 'Drogą pokarmową', 'Drogą płciową', 'Drogą przezłożyskową', 'Drogą wektorową (poprzez owady)'],
      a: 0,
      rationale: 'Poprawnie: droga kropelkowa. Pozostałe drogi transmisji są realne dla innych patogenów, ale nie stanowią typowej drogi zakażenia gruźlicą.'
    },
    {
      oldQ: 'Wymień jeden gatunek prątków niegruźliczych wywołujących mykobakteriozy.',
      q: 'Który z poniższych jest gatunkiem prątków niegruźliczych wywołujących mykobakteriozy?',
      o: ['Mycobacterium avium', 'Mycobacterium tuberculosis, prątek gruźlicy', 'Mycobacterium leprae, prątek trądu', 'Corynebacterium diphtheriae', 'Nocardia asteroides'],
      a: 0,
      rationale: 'Poprawnie: Mycobacterium avium (obok M. kansasii). Mycobacterium tuberculosis i Mycobacterium leprae są prątkami, ale wywołującymi odpowiednio gruźlicę i trąd - odrębne, dobrze zdefiniowane jednostki chorobowe, nie mykobakteriozy niegruźlicze.'
    },
    {
      oldQ: 'Dlaczego Mycoplasma i Chlamydia pneumoniae wywołują atypowe zapalenia płuc niereagujące na beta-laktamy?',
      q: 'Dlaczego Mycoplasma pneumoniae i Chlamydia pneumoniae wywołują atypowe zapalenia płuc niereagujące na antybiotyki beta-laktamowe?',
      o: [
        'Mycoplasma nie posiada ściany komórkowej, a Chlamydia jest bakterią wewnątrzkomórkową',
        'Obie bakterie produkują silne beta-laktamazy',
        'Obie bakterie mają zmienione białka PBP',
        'Są wielolekoopornymi (MDR) szczepami szpitalnymi',
        'Wytwarzają otoczkę odporną na działanie antybiotyku'
      ],
      a: 0,
      rationale: 'Poprawnie: brak ściany komórkowej u Mycoplasma i wewnątrzkomórkowa lokalizacja Chlamydia - oba mechanizmy uniemożliwiają działanie beta-laktamów celujących w PBP/syntezę ściany komórkowej. Pozostałe opcje opisują mechanizmy oporności INNYCH bakterii z tego kursu (produkcja beta-laktamaz, zmienione PBP u MRSA), niezwiązane z tymi dwoma patogenami.'
    },
    {
      oldQ: 'Jaki drobnoustrój wywołał bakteryjne zapalenie płuc w przypadku klinicznym z Ćwiczenia 7 (przypadek 6)?',
      q: 'Jaki drobnoustrój wywołał opisane w tej kategorii bakteryjne zapalenie płuc w przypadku klinicznym (przypadek 6)?',
      o: ['Klebsiella pneumoniae', 'Streptococcus pneumoniae', 'Legionella pneumophila', 'Haemophilus influenzae', 'Mycoplasma pneumoniae'],
      a: 0,
      rationale: 'Poprawnie: Klebsiella pneumoniae, zgodnie z opisem przypadku (m.in. charakterystyczna plwocina ceglasta, kolejne pytanie w tej kategorii). Pozostałe to realne, inne patogeny dróg oddechowych z tego kursu.'
    },
    {
      oldQ: 'Wymień cztery choroby będące skutkiem zakażenia Streptococcus pneumoniae.',
      q: 'Które cztery choroby są skutkiem zakażenia Streptococcus pneumoniae?',
      o: [
        'Zapalenie płuc, zapalenie ucha środkowego, zapalenie zatok przynosowych, zapalenie opon mózgowo-rdzeniowych',
        'Zapalenie opon mózgowo-rdzeniowych, zapalenie nagłośni, zapalenie ucha środkowego, zapalenie płuc - lista dla Haemophilus influenzae',
        'Błonica, krztusiec, angina paciorkowcowa, szkarlatyna',
        'Gorączka Pontiac, choroba legionistów, atypowe zapalenie płuc, gruźlica',
        'Wyłącznie zapalenie opon mózgowo-rdzeniowych, bez pozostałych chorób'
      ],
      a: 0,
      rationale: 'Poprawnie wg materiału źródłowego: pełny zestaw czterech chorób. Drugi dystraktor to realna, opisana w tej kategorii lista chorób INNEJ bakterii - Haemophilus influenzae (kolejne pytanie), różniąca się kluczowo zapaleniem nagłośni zamiast zapalenia zatok przynosowych.'
    },
    {
      oldQ: 'Wymień cztery jednostki chorobowe wywoływane przez Haemophilus influenzae.',
      q: 'Które cztery jednostki chorobowe są wywoływane przez Haemophilus influenzae?',
      o: [
        'Zapalenie opon mózgowo-rdzeniowych, zapalenie nagłośni, zapalenie ucha środkowego, zapalenie płuc',
        'Zapalenie płuc, zapalenie ucha środkowego, zapalenie zatok przynosowych, zapalenie opon mózgowo-rdzeniowych - lista dla Streptococcus pneumoniae',
        'Błonica, krztusiec, angina paciorkowcowa, szkarlatyna',
        'Gorączka Pontiac, choroba legionistów, atypowe zapalenie płuc, gruźlica',
        'Wyłącznie zapalenie nagłośni, bez pozostałych chorób'
      ],
      a: 0,
      rationale: 'Poprawnie wg materiału źródłowego: pełny zestaw czterech jednostek chorobowych, w tym charakterystyczne dla tej bakterii zapalenie nagłośni. Drugi dystraktor to realna, opisana w tej kategorii lista chorób INNEJ bakterii - Streptococcus pneumoniae (poprzednie pytanie), z zapaleniem zatok zamiast nagłośni.'
    },
    {
      oldQ: 'Jak nazywa się białko adhezyjne P1 i u jakiej bakterii występuje?',
      q: 'U jakiej bakterii występuje białko adhezyjne P1, umożliwiające przyleganie do nabłonka rzęskowego dróg oddechowych?',
      o: ['Mycoplasma pneumoniae', 'Bordetella pertussis, posiadająca analogiczne białko FHA', 'Streptococcus pneumoniae', 'Haemophilus influenzae', 'Corynebacterium diphtheriae'],
      a: 0,
      rationale: 'Poprawnie: Mycoplasma pneumoniae. Bordetella pertussis posiada analogiczne pod względem funkcji, ale INNE, opisane w tej kategorii białko adhezyjne - hemaglutyninę włókienkowatą (FHA), nie białko P1.'
    },
    {
      oldQ: 'Jak wygląda Streptococcus pneumoniae w preparacie barwionym metodą Grama?',
      q: 'Jak wygląda Streptococcus pneumoniae w preparacie barwionym metodą Grama?',
      o: [
        'Gram-dodatnie dwoinki o lancetowatym (płomykowatym) kształcie',
        'Gram-ujemne pałeczki, jak Haemophilus influenzae',
        'Gram-dodatnie ziarniaki w układzie kiści winogron, jak Staphylococcus',
        'Gram-dodatnie laseczki',
        'Gram-ujemne dwoinki, jak Neisseria'
      ],
      a: 0,
      rationale: 'Poprawnie: Gram-dodatnie dwoinki lancetowate. Pozostałe opisy morfologiczne odpowiadają w tym kursie INNYM bakteriom (Haemophilus, Staphylococcus, Neisseria) o odmiennym kształcie i barwieniu Gram.'
    },
    {
      oldQ: 'Jaką nieswoistą profilaktykę stosuje się przeciw zakażeniom Legionella pneumophila?',
      q: 'Jaką nieswoistą profilaktykę stosuje się przeciw zakażeniom Legionella pneumophila?',
      o: [
        'Dezynfekcję i kontrolę temperatury instalacji wodnych',
        'Szczepienie ochronne, dostępne dla tej bakterii',
        'Izolację chorego, ze względu na transmisję kropelkową',
        'Chemioprofilaktykę antybiotykową kontaktów chorego',
        'Noszenie masek ochronnych w miejscach publicznych'
      ],
      a: 0,
      rationale: 'Poprawnie: dezynfekcja i kontrola temperatury instalacji wodnych, ograniczające namnażanie bakterii w rezerwuarze środowiskowym. Szczepionka przeciw Legionella nie istnieje, a izolacja chorego jest zbędna, ponieważ bakteria nie przenosi się drogą kropelkową między ludźmi (inne pytanie w tej kategorii).'
    },
    {
      oldQ: 'Podaj przykład gatunku prątków niegruźliczych (poza Mycobacterium leprae) wywołujących mykobakteriozy.',
      q: 'Który z poniższych jest przykładem gatunku prątków niegruźliczych, poza Mycobacterium leprae, wywołujących mykobakteriozy?',
      o: ['Mycobacterium avium', 'Mycobacterium leprae, wykluczony w treści pytania', 'Mycobacterium tuberculosis, prątek gruźlicy', 'Corynebacterium diphtheriae', 'Nocardia asteroides'],
      a: 0,
      rationale: 'Poprawnie: Mycobacterium avium (obok M. kansasii). Mycobacterium leprae jest explicite WYKLUCZONY treścią pytania jako już wskazany, a Mycobacterium tuberculosis to prątek GRUŹLICY, odrębnej, dobrze zdefiniowanej jednostki chorobowej, nie mykobakteriozy niegruźliczej.'
    },
    {
      oldQ: 'Przypadek kliniczny: Rodzice 6-letniej dziewczynki zgłosili się do lekarza rodzinnego zaniepokojeni wysoką gorączką (39°C) i trudnościami w połykaniu. Matka zgłasza ból gardła od trzech dni, brak apetytu i bóle głowy. W badaniu: znaczne obrzmienie gardła (szczególnie po stronie lewej), powiększone węzły szyjne przednie, obrzęk migdałków z widocznym nalotem i czopami ropnymi. Jaki drobnoustrój jest najbardziej prawdopodobnym czynnikiem etiologicznym i jaka jest nazwa opisywanej jednostki chorobowej?',
      q: 'Przypadek kliniczny: Rodzice 6-letniej dziewczynki zgłosili się do lekarza rodzinnego zaniepokojeni wysoką gorączką (39°C) i trudnościami w połykaniu. Matka zgłasza ból gardła od trzech dni, brak apetytu i bóle głowy. W badaniu: znaczne obrzmienie gardła (szczególnie po stronie lewej), powiększone węzły szyjne przednie, obrzęk migdałków z widocznym nalotem i czopami ropnymi. Jaki drobnoustrój jest najbardziej prawdopodobnym czynnikiem etiologicznym, i jaka jest nazwa opisywanej jednostki chorobowej?',
      o: [
        'Streptococcus pyogenes, angina paciorkowcowa',
        'Corynebacterium diphtheriae, błonica',
        'Epstein-Barr virus, mononukleoza zakaźna',
        'Streptococcus pneumoniae, zapalenie płuc',
        'Mycoplasma pneumoniae, atypowe zapalenie płuc'
      ],
      a: 0,
      rationale: 'Poprawnie: Streptococcus pyogenes, angina paciorkowcowa - typowy obraz ropnego nalotu na migdałkach z gorączką i powiększeniem węzłów szyjnych. Błonica dawałaby charakterystyczną SZARĄ RZEKOMOBŁONĘ, nie ropny nalot z czopami, a mononukleoza zakaźna miałaby zwykle łagodniejszy, dłuższy przebieg z uogólnioną limfadenopatią.'
    },
    {
      oldQ: 'Przypadek kliniczny: Matka zgłosiła się z 3-letnim chłopcem z powodu gorączki 38,2°C, wymiotów oraz wysypki na całym ciele z nasileniem w zgięciach łokciowych i w pachwinach. W badaniu stwierdzono powiększenie węzłów chłonnych oraz język koloru malinowego z białym nalotem. Jaki drobnoustrój jest najbardziej prawdopodobnym czynnikiem etiologicznym i jaka jest nazwa opisywanej jednostki chorobowej?',
      q: 'Przypadek kliniczny: Matka zgłosiła się z 3-letnim chłopcem z powodu gorączki 38,2°C, wymiotów oraz wysypki na całym ciele z nasileniem w zgięciach łokciowych i w pachwinach. W badaniu stwierdzono powiększenie węzłów chłonnych oraz język koloru malinowego z białym nalotem. Jaki drobnoustrój jest najbardziej prawdopodobnym czynnikiem etiologicznym, i jaka jest nazwa opisywanej jednostki chorobowej?',
      o: [
        'Streptococcus pyogenes, szkarlatyna',
        'Wirus odry, odra',
        'Staphylococcus aureus, zespół wstrząsu toksycznego',
        'Streptococcus pneumoniae, zapalenie płuc',
        'Choroba Kawasakiego (przyczyna nieinfekcyjna)'
      ],
      a: 0,
      rationale: 'Poprawnie: Streptococcus pyogenes, szkarlatyna - typowy obraz wysypki z nasileniem w zgięciach i języka malinowego. Odra dawałaby inny wzór wysypki (plamisto-grudkowa, zstępująca od twarzy) poprzedzony plamkami Koplika, nie wysypką nasiloną w zgięciach z językiem malinowym.'
    },
    {
      oldQ: 'Jaki objaw kliniczny (wygląd języka) jest charakterystyczny dla szkarlatyny wywołanej przez Streptococcus pyogenes?',
      q: 'Jaki objaw kliniczny (wygląd języka) jest charakterystyczny dla szkarlatyny wywołanej przez Streptococcus pyogenes?',
      o: ['Język malinowy', 'Język geograficzny', 'Język włochaty czarny', 'Język tarczowaty', 'Język bruzdowaty'],
      a: 0,
      rationale: 'Poprawnie: język malinowy. Pozostałe to realne, nazwane zmiany języka, ale związane z zupełnie innymi, niezakaźnymi lub odmiennymi etiologicznie schorzeniami.'
    },
    {
      oldQ: 'Przypadek kliniczny: 34-letnia kobieta zgłosiła się do lekarza rodzinnego z powodu utrzymującego się od 2 tygodni napadowego suchego kaszlu z uczuciem duszności i uciskiem na klatkę piersiową, temperatura 37,7–38,5°C. Przez tydzień brała Augmentin bez poprawy. Osłuchowo bez zmian, w RTG cechy zapalenia śródmiąższowego, w plwocinie tylko flora fizjologiczna jamy ustnej. Jaki drobnoustrój jest najbardziej prawdopodobnym czynnikiem etiologicznym i dlaczego antybiotyk beta-laktamowy (Augmentin) nie przyniósł poprawy?',
      q: 'Przypadek kliniczny: 34-letnia kobieta zgłosiła się do lekarza rodzinnego z powodu utrzymującego się od 2 tygodni napadowego suchego kaszlu z uczuciem duszności i uciskiem na klatkę piersiową, temperatura 37,7–38,5°C. Przez tydzień brała Augmentin bez poprawy. Osłuchowo bez zmian, w RTG cechy zapalenia śródmiąższowego, w plwocinie tylko flora fizjologiczna jamy ustnej. Jaki drobnoustrój jest najbardziej prawdopodobnym czynnikiem etiologicznym, i dlaczego antybiotyk beta-laktamowy (Augmentin) nie przyniósł poprawy?',
      o: [
        'Mycoplasma pneumoniae, nieposiadająca ściany komórkowej, więc beta-laktamy są nieskuteczne',
        'Streptococcus pneumoniae, zwykle dobrze reagujący na Augmentin',
        'Klebsiella pneumoniae, produkująca ESBL',
        'Legionella pneumophila, o rezerwuarze wodnym',
        'Haemophilus influenzae, zwykle wrażliwy na beta-laktamy'
      ],
      a: 0,
      rationale: 'Poprawnie: Mycoplasma pneumoniae - przewlekły suchy kaszel, zmiany śródmiąższowe, brak poprawy po beta-laktamie ze względu na brak ściany komórkowej tej bakterii. Streptococcus pneumoniae i Haemophilus influenzae zwykle DOBRZE reagują na Augmentin (amoksycylinę z kwasem klawulanowym) - przeciwny do opisanego przebieg kliniczny.'
    },
    {
      oldQ: 'Przypadek kliniczny: 2-letni chłopczyk przywieziony na ostry dyżur pediatryczny z powodu duszności, gorączki (38,7°C) i silnego bólu gardła, z trudem przełyka pokarm, jest niespokojny i płaczliwy. Tętno 140/min, oddech przyspieszony. Tkliwość i ból okolicy szyi i kości gnykowej przy palpacji oraz obrzęk i zaczerwienienie nagłośni. Jaki drobnoustrój jest najbardziej prawdopodobnym czynnikiem etiologicznym, jaka jest nazwa jednostki chorobowej i dlaczego w tym przypadku NIE pobiera się materiału do badania mikrobiologicznego z gardła?',
      q: 'Przypadek kliniczny: 2-letni chłopczyk przywieziony na ostry dyżur pediatryczny z powodu duszności, gorączki (38,7°C) i silnego bólu gardła, z trudem przełyka pokarm, jest niespokojny i płaczliwy. Tętno 140/min, oddech przyspieszony. Tkliwość i ból okolicy szyi i kości gnykowej przy palpacji oraz obrzęk i zaczerwienienie nagłośni. Jaki drobnoustrój jest najbardziej prawdopodobnym czynnikiem etiologicznym, jaka jest nazwa jednostki chorobowej, i dlaczego w tym przypadku NIE pobiera się materiału do badania mikrobiologicznego z gardła?',
      o: [
        'Haemophilus influenzae, zapalenie nagłośni; nie pobieramy materiału ze względu na ryzyko wywołania odruchu i całkowitej niedrożności dróg oddechowych',
        'Streptococcus pyogenes, angina paciorkowcowa; pobranie wymazu jest w tym przypadku standardowo wskazane i bezpieczne',
        'Corynebacterium diphtheriae, błonica; pobranie wymazu jest bezpieczne i zalecane',
        'Bordetella pertussis, krztusiec; materiał pobiera się z nosogardła, nie z gardła',
        'Mycoplasma pneumoniae, atypowe zapalenie płuc; materiału nie pobiera się z braku wskazań diagnostycznych'
      ],
      a: 0,
      rationale: 'Poprawnie: Haemophilus influenzae, zapalenie nagłośni - klasyczny, zagrażający życiu obraz kliniczny u małego dziecka, w którym manipulacja w gardle grozi całkowitą niedrożnością dróg oddechowych. W anginie paciorkowcowej pobranie wymazu z gardła jest rutynowe i bezpieczne - przeciwna sytuacja kliniczna.'
    },
    {
      oldQ: 'Dlaczego przy podejrzeniu ostrego zapalenia nagłośni (np. u dziecka z obrzękiem nagłośni, dusznością i tachykardią) nie pobiera się wymazu z gardła do badania mikrobiologicznego?',
      q: 'Dlaczego przy podejrzeniu ostrego zapalenia nagłośni (np. u dziecka z obrzękiem nagłośni, dusznością i tachykardią) nie pobiera się wymazu z gardła do badania mikrobiologicznego?',
      o: [
        'Manipulacja w gardle może wywołać skurcz i całkowitą niedrożność dróg oddechowych - stan zagrożenia życia',
        'Wymaz nie ma żadnego znaczenia diagnostycznego w tej chorobie',
        'Ból towarzyszący pobraniu byłby zbyt silny dla małego pacjenta',
        'Wynik badania i tak byłby fałszywie ujemny',
        'Brak jest odpowiednich testów laboratoryjnych dla tej lokalizacji'
      ],
      a: 0,
      rationale: 'Poprawnie: ryzyko wywołania odruchu i całkowitej niedrożności dróg oddechowych wskutek manipulacji przy obrzękniętej nagłośni - bezpośrednie zagrożenie życia. Pozostałe opcje błędnie umniejszają realne niebezpieczeństwo kliniczne lub podają nieprawdziwe uzasadnienia.'
    },
    {
      oldQ: 'Przypadek kliniczny: 35-letnia pacjentka zgłosiła się do lekarza POZ z powodu silnego bólu gardła, kaszlu i kataru. Zgłasza stany podgorączkowe i ogólne osłabienie. Bez cech ciężkiego zakażenia bakteryjnego. Jaka jest najbardziej prawdopodobna etiologia i jakie jest zalecane postępowanie terapeutyczne?',
      q: 'Przypadek kliniczny: 35-letnia pacjentka zgłosiła się do lekarza POZ z powodu silnego bólu gardła, kaszlu i kataru. Zgłasza stany podgorączkowe i ogólne osłabienie. Bez cech ciężkiego zakażenia bakteryjnego. Jaka jest najbardziej prawdopodobna etiologia, i jakie jest zalecane postępowanie terapeutyczne?',
      o: [
        'Etiologia wirusowa; leczenie objawowe, antybiotyk nie jest wskazany',
        'Etiologia bakteryjna; konieczna natychmiastowa antybiotykoterapia empiryczna',
        'Streptococcus pyogenes; konieczna fenoksypenicylina',
        'Mycoplasma pneumoniae; konieczne makrolidy',
        'Corynebacterium diphtheriae; konieczna antytoksyna błonicza'
      ],
      a: 0,
      rationale: 'Poprawnie: etiologia wirusowa ("przeziębienie"), leczenie wyłącznie objawowe - obraz kliniczny bez cech ciężkiego zakażenia bakteryjnego nie uzasadnia antybiotykoterapii. Pozostałe opcje błędnie zakładają konieczność leczenia przeciwbakteryjnego pomimo braku wskazań klinicznych do tego w opisanym przypadku.'
    },
    {
      oldQ: 'Przypadek kliniczny: Pacjent lat 70 w stanie ogólnym ciężkim (wcześniejsza utrata przytomności), z wielokrotną wcześniejszą hospitalizacją w wywiadzie. W badaniu: gorączka, duszność oddechowa, rzężenia osłuchowe, przy kaszlu odkrztuszanie obfitej, gęstej, ceglastej plwociny. Jaki drobnoustrój jest najbardziej prawdopodobnym czynnikiem etiologicznym tego bakteryjnego zapalenia płuc?',
      q: 'Przypadek kliniczny: Pacjent lat 70 w stanie ogólnym ciężkim (wcześniejsza utrata przytomności), z wielokrotną wcześniejszą hospitalizacją w wywiadzie. W badaniu: gorączka, duszność oddechowa, rzężenia osłuchowe, przy kaszlu odkrztuszanie obfitej, gęstej, ceglastej plwociny. Jaki drobnoustrój jest najbardziej prawdopodobnym czynnikiem etiologicznym tego bakteryjnego zapalenia płuc?',
      o: ['Klebsiella pneumoniae', 'Streptococcus pneumoniae', 'Legionella pneumophila', 'Mycoplasma pneumoniae', 'Haemophilus influenzae'],
      a: 0,
      rationale: 'Poprawnie: Klebsiella pneumoniae, klasycznie związana z ciężkim przebiegiem u pacjentów po wielokrotnych hospitalizacjach oraz charakterystyczną plwociną koloru ceglastego (kolejne pytanie w tej kategorii).'
    },
    {
      oldQ: 'Jak nazywa się charakterystyczna, gęsta plwocina koloru ceglastego (przypominająca galaretkę porzeczkową) typowa dla ciężkiego bakteryjnego zapalenia płuc wywołanego przez Klebsiella pneumoniae, zwłaszcza u pacjentów po wielokrotnych hospitalizacjach?',
      q: 'Jak nazywa się charakterystyczna, gęsta plwocina koloru ceglastego (przypominająca galaretkę porzeczkową), typowa dla ciężkiego bakteryjnego zapalenia płuc wywołanego przez Klebsiella pneumoniae?',
      o: [
        'Plwocina ceglasta (currant jelly sputum)',
        'Plwocina rdzawa, typowa dla Streptococcus pneumoniae',
        'Plwocina ropna, żółto-zielona',
        'Plwocina pienista, różowa, jak w obrzęku płuc',
        'Plwocina cuchnąca, jak w ropniu płuca wywołanym bakteriami beztlenowymi'
      ],
      a: 0,
      rationale: 'Poprawnie: plwocina ceglasta (currant jelly sputum), charakterystyczna dla Klebsiella pneumoniae. Plwocina rdzawa to INNY, klasyczny opis wydzieliny oddechowej, ale kojarzony z zupełnie inną bakterią - Streptococcus pneumoniae - łatwa do pomylenia, ale odmienna cecha diagnostyczna.'
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
