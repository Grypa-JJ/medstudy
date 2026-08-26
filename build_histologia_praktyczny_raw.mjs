// build_histologia_praktyczny_raw.mjs
// Jednorazowy skrypt: buduje histologia_praktyczny_raw.json z ręcznie
// wyekstrahowanej i sprawdzonej wizualnie (numery strzałek na zdjęciach
// zweryfikowane przez podgląd obrazków) talii Anki "09. Krew i hemopoeza"
// (folder "Praktyczny Histologia"). Każdy wpis: {category, q, mode:"typed",
// answers, rationale?, img} - img to sama nazwa pliku (bez URL-a, dogrywany
// przez build_questions.mjs po wgraniu na R2).
//
// Uruchomienie: node build_histologia_praktyczny_raw.mjs

import fs from "fs";

const CATEGORY = "Egzamin praktyczny — Krew i hemopoeza";
const IMG_PREFIX = "hist_prakt/"; // podfolder w r2_upload/img/ i w buckecie

const raw = [
    {
        img: "paste-200e167215963ac2cab851c73624680d71ff3af8.jpg",
        q: "a) Co to za komórka? b) Jaki procent wszystkich leukocytów stanowi? c) Jakie są składniki jej ziarnistości azurofilnych (3) i swoistych (3)? d) Ile czasu przebywa we krwi obwodowej, a ile w tkance łącznej? e) Jakie stadium rozwojowe granulocytów jest charakterystyczne tylko dla tej komórki? f) Jaki jest główny sposób pozyskiwania energii przez te komórki?",
        answers: ["Neutrofil"],
        rationale: "a) Neutrofil. b) 50-70% wszystkich leukocytów. c) Ziarnistości azurofilne: mieloperoksydaza, lizozym, defensyny. Ziarnistości swoiste: cytokiny, chemokiny i mediatory lipidowe. d) 6-8h we krwi obwodowej, 1-4 dni w tkance łącznej. e) Granulocyt pałeczkowaty. f) Główny sposób pozyskiwania energii: glikoliza beztlenowa.",
    },
    {
        img: "paste-f5e1243521f2380502f48b67051a4c7d20181fe7.jpg",
        q: "a) Co to za komórka? b) Jaki procent wszystkich leukocytów stanowi? c) Jakie substancje wydziela ta komórka (5)? d) Ile czasu żyje? e) W jakiej typowej reakcji odpornościowej bierze udział?",
        answers: ["Bazofil"],
        rationale: "a) Bazofil. b) Mniej niż 1% leukocytów. c) Wydziela: heparynę, histaminę, czynnik aktywujący płytki krwi, czynnik chemotaktyczny eozynofili, fosfolipazę A. d) Żyje kilka miesięcy. e) Bierze udział w reakcji alergicznej.\n\nUwaga: liczne ziarnistości bardzo zasadochłonne i brak podziału jądra na płaty — w odróżnieniu od eozynofilu.",
    },
    {
        img: "paste-fa030ea6c890c307fb60549018b99caf350042de.jpg",
        q: "Co przedstawia komórka wskazana strzałką nr 1 na preparacie?",
        answers: ["Neutrofil"],
    },
    {
        img: "paste-fa030ea6c890c307fb60549018b99caf350042de.jpg",
        q: "Komórka wskazana strzałką nr 2: a) Co to za komórka? b) Jaki procent wszystkich leukocytów stanowi? c) Dla jakich komórek jest prekursorem (5)? d) Ile wynosi ich czas życia? e) Co zawierają ich ziarnistości swoiste? f) Przez co są produkowane w życiu płodowym?",
        answers: ["Monocyt"],
        rationale: "a) Monocyt. b) 2-8% leukocytów. c) Jest prekursorem dla: mikrogleju, komórki Kupffera, makrofagów śledziony, komórki Langerhansa, osteoklastów. d) Czas życia: od kilku godzin do kilku lat. e) Nic — monocyty nie posiadają ziarnistości swoistych. f) W życiu płodowym są produkowane przez pęcherzyk żółtkowy.\n\nUwaga: jądro w kształcie litery C.",
    },
    {
        img: "paste-fa030ea6c890c307fb60549018b99caf350042de.jpg",
        q: "Co przedstawia komórka wskazana strzałką nr 3 na preparacie?",
        answers: ["Monocyt"],
        rationale: "Uwaga: jądro w kształcie litery C.",
    },
    {
        img: "paste-f8b621bf76da14d9a12c13bac046ac13b8db0964.jpg",
        q: "a) Co to za komórka? b) Jaki procent wszystkich leukocytów stanowi? c) Jaka jest typowa cecha jej ziarnistości swoistych i co zawierają (2)? d) Jaki jest czas życia? e) W jaki sposób regulują przebieg miejscowej reakcji zapalnej (2)? f) Jaki jest ich główny \"przeciwnik\"?",
        answers: ["Eozynofil"],
        rationale: "a) Eozynofil. b) 1-4% leukocytów. c) Krystaloidowy rdzeń ziarnistości; zawierają główne białko zasadowe i peroksydazę eozynofilową. d) Czas życia: 1-2 tygodnie. e) Uwalniają chemokiny, cytokiny i mediatory lipidowe. f) Główny przeciwnik to robaki i pasożyty.\n\nUwaga: liczne ziarnistości, bardziej kwasochłonne niż zasadochłonna cytoplazma jądra (porównaj kolory); jądro podzielone na dwa płaty (odróżnia od bazofila). Ziarnistości eozynofila są kwasochłonne, podobnie jak erytrocyty (bo hemoglobina) — podobny kolor barwienia wskazuje na eozynofil.",
    },
    {
        img: "paste-d4a598a8841f3948fcfcadefbe342dc735be4cf5.jpg",
        q: "Jaką komórkę przedstawia preparat?",
        answers: ["Monocyt"],
        rationale: "Uwaga: jądro w kształcie litery C.",
    },
    {
        img: "paste-31480a6680f2d9a1e9646fb6a07f1274138ee354.jpg",
        q: "Co przedstawia komórka wskazana strzałką nr 1 na preparacie?",
        answers: ["Eozynofil"],
        rationale: "Uwaga: kolor podobny jak sąsiadujące erytrocyty; jądro podzielone na płaty.",
    },
    {
        img: "paste-31480a6680f2d9a1e9646fb6a07f1274138ee354.jpg",
        q: "Co przedstawia komórka wskazana strzałką nr 2 na preparacie?",
        answers: ["Neutrofil"],
    },
    {
        img: "paste-31480a6680f2d9a1e9646fb6a07f1274138ee354.jpg",
        q: "Co przedstawia komórka wskazana strzałką nr 3 na preparacie?",
        answers: ["Neutrofil"],
    },
    {
        img: "paste-9b1262d77eabd615f8c9c611e0553097bc8e1719.jpg",
        q: "Jaką komórkę przedstawia preparat?",
        answers: ["Eozynofil"],
        rationale: "Uwaga: jądro podzielone na dwa płaty.",
    },
    {
        img: "paste-225aafa197cf5a6bb8a84be27351808e63a070fd.jpg",
        q: "a) Co to za komórka? b) Jaki procent wszystkich leukocytów stanowi? c) Jakie posiada ziarnistości? d) Podaj rodzaje i miejsce ich dojrzewania. e) Jaki jest czas życia?",
        answers: ["Limfocyt"],
        rationale: "a) Limfocyt. b) 20-40% leukocytów. c) Tylko ziarnistości azurofilne. d) Limfocyty B dojrzewają w szpiku kostnym (markery IgM i IgD); limfocyty T dojrzewają w grasicy (Th → CD4, Tc → CD8). e) Czas życia: od kilku godzin do kilku lat.\n\nUwaga: cechą charakterystyczną jest niewielka ilość cytoplazmy otaczającej jądro limfocytu.",
    },
    {
        img: "paste-7d96a8a8354afe0756f76412c3a7fc6e089a19bc.jpg",
        q: "Co przedstawia komórka wskazana strzałką nr 1 na preparacie?",
        answers: ["Monocyt"],
        rationale: "Uwaga: jądro z wcięciem, w kształcie litery C.",
    },
    {
        img: "paste-7d96a8a8354afe0756f76412c3a7fc6e089a19bc.jpg",
        q: "Co przedstawia komórka wskazana strzałką nr 2 na preparacie?",
        answers: ["Limfocyt"],
        rationale: "Uwaga: łatwo pomylić np. z bazofilem, bo otaczająca jądro cytoplazma nie jest tu dobrze widoczna, ale prowadzący podpisał tę komórkę jako limfocyt.",
    },
    {
        img: "paste-5608272d11cfd924648c7ecc0a4edcfa0eb412c2.jpg",
        q: "Jaką komórkę przedstawia preparat?",
        answers: ["Eozynofil"],
        rationale: "Uwaga: jądro może wyglądać na 3-płatowe, co jest mylące — ziarnistości barwią się inaczej niż chromatyna w jądrze i muszą być kwasochłonne, by rozpoznać eozynofila.",
    },
    {
        img: "paste-f09926ad370f389ffefdd1c696bcf86d6e786cf5.jpg",
        q: "Jaką komórkę przedstawia preparat?",
        answers: ["Eozynofil"],
    },
    {
        img: "paste-e8962ace441e56e9f9343b56ca98be87bf14cbf5.jpg",
        q: "Jaką komórkę przedstawia preparat?",
        answers: ["Neutrofil"],
    },
    {
        img: "paste-9e938f60422aae0771b13db8b33cad1cf3836395.jpg",
        q: "Jaką komórkę przedstawia preparat?",
        answers: ["Bazofil"],
        rationale: "Uwaga: liczne ziarnistości, które barwią się tak samo jak chromatyna w jądrze — są ZASADOCHŁONNE, mimo że jądro wygląda na podzielone na płaty (co jest mylące).",
    },
    {
        img: "paste-c5db63306b940cd2a9e758efa1d4b47e0026dc0b.jpg",
        q: "Jaką komórkę przedstawia preparat?",
        answers: ["Monocyt"],
    },
    {
        img: "paste-6e0073bb872c7990f63909ae22706d65aa2d3841.jpg",
        q: "Jaką komórkę przedstawia preparat?",
        answers: ["Limfocyt"],
    },
    {
        img: "paste-6784eb1dd411dfce8b6f55c1fab9559e94c357dc.jpg",
        q: "Jaką komórkę przedstawia preparat?",
        answers: ["Limfocyt"],
    },
    {
        img: "paste-430e6c13274dde09c2b31ab62d3f810e89c85285.jpg",
        q: "Co przedstawia preparat?",
        answers: ["Szpik kostny czerwony"],
    },
    {
        img: "paste-c49ebb61ed7583c3358490bede9f45a99e8d5db5.jpg",
        q: "Co przedstawia struktura oznaczona nr 1 na preparacie szpiku kostnego?",
        answers: ["Adipocyt"],
    },
    {
        img: "paste-c49ebb61ed7583c3358490bede9f45a99e8d5db5.jpg",
        q: "Co przedstawiają struktury oznaczone nr 2 na preparacie szpiku kostnego?",
        answers: ["Naczynia włosowate typu zatokowe"],
    },
    {
        img: "paste-c49ebb61ed7583c3358490bede9f45a99e8d5db5.jpg",
        q: "Co przedstawia struktura oznaczona nr 3 na preparacie szpiku kostnego i czego jest prekursorem?",
        answers: ["Megakariocyt"],
        rationale: "Nr 3 to megakariocyt — prekursor trombocytów (płytek krwi).",
    },
    {
        img: "paste-c49ebb61ed7583c3358490bede9f45a99e8d5db5.jpg",
        q: "Co przedstawiają struktury oznaczone nr 4 na preparacie szpiku kostnego?",
        answers: ["Komórki hemopoetyczne"],
    },
    {
        img: "paste-01dfee5fca3698f4034cd51350b59db99aed9a1c.jpg",
        q: "Jaka tkanka tworzy zrąb tej struktury?",
        answers: ["Tkanka łączna siateczkowata"],
    },
    {
        img: "paste-8799e1e48ab2443a58deed7952127f6a843bb947.jpg",
        q: "Jak się nazywa struktura na zdjęciu?",
        answers: ["Neutrofil", "granulocyt obojętnochłonny"],
    },
    {
        img: "paste-b7ce87c82612a3daac5388aadc9fae7a5af2b940.jpg",
        q: "Co wskazuje strzałka nr 1 na elektronogramie?",
        answers: ["Jądro komórkowe", "jądro"],
        rationale: "Zwróć uwagę: jądro jest podzielone na wiele płatów — cecha charakterystyczna neutrofila.",
    },
    {
        img: "paste-b7ce87c82612a3daac5388aadc9fae7a5af2b940.jpg",
        q: "Co wskazuje strzałka nr 2 na elektronogramie?",
        answers: ["Mitochondrium"],
    },
    {
        img: "paste-b7ce87c82612a3daac5388aadc9fae7a5af2b940.jpg",
        q: "Co wskazuje strzałka nr 3 na elektronogramie?",
        answers: ["Aparat Golgiego"],
    },
    {
        img: "paste-b7ce87c82612a3daac5388aadc9fae7a5af2b940.jpg",
        q: "Co wskazuje strzałka nr 4 na elektronogramie?",
        answers: ["Centriola"],
    },
    {
        img: "paste-b7ce87c82612a3daac5388aadc9fae7a5af2b940.jpg",
        q: "Co wskazuje strzałka nr 5 na elektronogramie?",
        answers: ["Szorstka siateczka śródplazmatyczna", "szorstkie retikulum endoplazmatyczne"],
    },
    {
        img: "paste-b7ce87c82612a3daac5388aadc9fae7a5af2b940.jpg",
        q: "Co oznacza etykieta \"g2\" na elektronogramie?",
        answers: ["Ziarnistości azurofilne"],
        rationale: "Aby odróżnić ziarnistości azurofilne od swoistych: azurofilne są elektronowo-gęste (całe czarne) i identyczne w każdym granulocycie/agranulocycie; ziarnistości swoiste są elektronowo-jaśniejsze, mają charakterystyczne wzory i są unikalne dla danej komórki.",
    },
    {
        img: "paste-b7ce87c82612a3daac5388aadc9fae7a5af2b940.jpg",
        q: "Co oznacza etykieta \"g1\" na elektronogramie?",
        answers: ["Ziarnistości swoiste"],
        rationale: "Aby odróżnić ziarnistości azurofilne od swoistych: azurofilne są elektronowo-gęste (całe czarne) i identyczne w każdym granulocycie/agranulocycie; ziarnistości swoiste są elektronowo-jaśniejsze, mają charakterystyczne wzory i są unikalne dla danej komórki.",
    },
    {
        img: "paste-fa25843bffdef21609e3baf4b1d5c1aea179093f.jpg",
        q: "Jaką komórkę przedstawia elektronogram?",
        answers: ["Eozynofil"],
    },
    {
        img: "paste-e33c5c138cb5605b7eecc29386b5ba42f1d1d97b.jpg",
        q: "Jak rozpoznać ziarnistości swoiste tej komórki (eozynofila)? Jaka jest ich cecha charakterystyczna?",
        answers: ["krystaliczny rdzeń"],
        rationale: "Ziarnistości swoiste eozynofilu mają krystaliczny rdzeń, który przenika ich długość.",
    },
    {
        img: "paste-e33c5c138cb5605b7eecc29386b5ba42f1d1d97b.jpg",
        q: "Co wskazuje etykieta \"1\" na elektronogramie?",
        answers: ["Ziarnistości swoiste"],
    },
    {
        img: "paste-e33c5c138cb5605b7eecc29386b5ba42f1d1d97b.jpg",
        q: "Co oznacza etykieta \"N\" na elektronogramie?",
        answers: ["Jądro komórkowe", "jądro"],
    },
    {
        img: "paste-e33c5c138cb5605b7eecc29386b5ba42f1d1d97b.jpg",
        q: "Co oznacza etykieta \"M\" na elektronogramie?",
        answers: ["Mitochondrium"],
    },
    {
        img: "paste-16dc7627392ae600cd97dcf861ff495f457b6a81.jpg",
        q: "Jaką komórkę przedstawia elektronogram?",
        answers: ["Bazofil"],
    },
    {
        img: "paste-16dc7627392ae600cd97dcf861ff495f457b6a81.jpg",
        q: "Co oznacza etykieta \"B\" na elektronogramie?",
        answers: ["Ziarnistości swoiste"],
    },
    {
        img: "paste-16dc7627392ae600cd97dcf861ff495f457b6a81.jpg",
        q: "Co oznacza etykieta \"N\" na elektronogramie?",
        answers: ["Jądro komórkowe", "jądro"],
    },
    {
        img: "paste-a24966e107aac96123c2b80087311aff226b9912.jpg",
        q: "Jaką komórkę przedstawia preparat?",
        answers: ["Eozynofil"],
    },
    {
        img: "paste-5ecee19147882306781301102d2c1c4b5c5aa6eb.jpg",
        q: "Jaką komórkę przedstawia preparat?",
        answers: ["Bazofil"],
        rationale: "Porównaj z komórką tuczną (mastocytem) — mają podobny wygląd, ale różne pochodzenie i funkcję.",
    },
    {
        img: "paste-e03e44d8ec40e06194f0bd433c10f58701232b61.jpg",
        q: "a) Podaj nazwę tych struktur. b) Skąd się wywodzą? c) Ile czasu żyją? d) Co znajduje się obwodowo (4)? e) Co znajduje się centralnie (3)? f) Co zawierają ziarnistości alfa i delta?",
        answers: ["Trombocyty", "płytki krwi"],
        rationale: "a) Trombocyty (płytki krwi). b) Wywodzą się z megakariocytów. c) Żyją ok. 10 dni. d) Obwodowo: wiązka brzeżna (filamenty aktynowe i mikrotubule), hialomer, system kanalików gęstych (magazyn wapnia), system kanalików otwartych (pobiera składniki osocza). e) Centralnie: hialomer; ziarnistości alfa i ziarnistości delta. f) Ziarnistości alfa: płytkopochodny czynnik wzrostu, czynnik płytkowy 4. Ziarnistości delta: ADP, ATP, serotonina.",
    },
    {
        img: "paste-37bc7aa7650144313739bfef9a47fb3d80481703.jpg",
        q: "Ile wynosi hematokryt (odsetek objętości krwi zajmowany przez erytrocyty)?",
        answers: ["44%"],
    },
    {
        img: "paste-37bc7aa7650144313739bfef9a47fb3d80481703.jpg",
        q: "Jaka jest prawidłowa liczba erytrocytów na mm³ krwi?",
        answers: ["4,0 - 6,0 mln", "4-6 mln"],
    },
    {
        img: "paste-37bc7aa7650144313739bfef9a47fb3d80481703.jpg",
        q: "Jaka jest prawidłowa liczba trombocytów (płytek krwi) na mm³ krwi?",
        answers: ["150 000 - 400 000", "150000-400000"],
    },
    {
        img: "paste-37bc7aa7650144313739bfef9a47fb3d80481703.jpg",
        q: "Jaka jest prawidłowa liczba leukocytów na mm³ krwi?",
        answers: ["4500 - 11000", "4 500 - 11 000"],
    },
    {
        img: "paste-37bc7aa7650144313739bfef9a47fb3d80481703.jpg",
        q: "Wymień integryny (2) i białka tworzące sieć błonową (2) erytrocytu.",
        answers: ["glikoforyna A, białko prążka 3; spektryna, ankiryna"],
        rationale: "Integryny: glikoforyna A, białko prążka 3. Białka tworzące sieć błonową (cytoszkielet): spektryna, ankiryna.",
    },
    {
        img: "paste-37bc7aa7650144313739bfef9a47fb3d80481703.jpg",
        q: "Ile trwa powstawanie erytrocytu (od komórki macierzystej do dojrzałej postaci)?",
        answers: ["7 dni"],
    },
    {
        img: "paste-37bc7aa7650144313739bfef9a47fb3d80481703.jpg",
        q: "W jakim stadium rozwojowym erytrocyt traci jądro komórkowe?",
        answers: ["retikulocyt"],
    },
    {
        img: "paste-37bc7aa7650144313739bfef9a47fb3d80481703.jpg",
        q: "Ile czasu trwa różnicowanie się retikulocytu do dojrzałego erytrocytu?",
        answers: ["3 dni"],
    },
];

const out = raw.map(item => ({
    subject: "histologia",
    category: CATEGORY,
    q: item.q,
    mode: "typed",
    answers: item.answers,
    ...(item.rationale ? { rationale: item.rationale } : {}),
    img: IMG_PREFIX + item.img,
}));

fs.writeFileSync("histologia_praktyczny_raw.json", JSON.stringify(out, null, 0), "utf-8");
console.log(`Zapisano ${out.length} pytań do histologia_praktyczny_raw.json`);
