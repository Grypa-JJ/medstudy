// build_questions.mjs
// Skrypt migracyjny: scala starą bazę anatomii (baza_pytan_eksport.json) oraz
// dwie osobne apki (htmlhisto.txt, htmlbiochem.txt) do wspólnego schematu
// opisanego w schema.md, i zapisuje wynik do questions.json.
//
// Uruchomienie: node build_questions.mjs

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { makeQuestionId, normalizeText, fnv1a } from "./id-utils.js";
import { validateQuestions } from "./validator.js";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const LETTERS = ["a", "b", "c", "d", "e"];
const R2_BASE_URL = "https://pub-75514e92552347ccbcdab6bfacd153fd.r2.dev";

function letterToIdx(letter) {
    const i = LETTERS.indexOf(letter);
    if (i === -1) throw new Error(`Nieznana litera odpowiedzi: "${letter}"`);
    return i;
}

// ── 1. Lookup kategorii/tierów anatomii, przepisany 1:1 z BATCHES w index.html ──
// key = stara wartość pola `batch`; label = etykieta wyświetlana w UI (z emoji/tierem);
// category = etykieta bez prefiksu "[Tn]" (używana jako klucz filtrowania pytań).
const ANATOMIA_BATCHES = [
    // TIER 1
    { key: "b10", tier: 1, label: "🟢 [T1] Letnie pewniaczki Grupy 27 (jesteście kotami) " },
    { key: "b5", tier: 1, label: "🟢 [T1] Giełda Świętokrzyska V2 - całe egz. lata 22-24" },
    { key: "bimg_2024_2025", tier: 1, label: "🟢 [T1] 🖼️ Giełda ze zdjęciami (zima) — 2024/2025" },
    { key: "bimg_2023_2024", tier: 1, label: "🟢 [T1] 🖼️ Giełda ze zdjęciami (zima) — 2023/2024" },
    { key: "bimg_2022_2023", tier: 1, label: "🟢 [T1] 🖼️ Giełda ze zdjęciami (zima) — 2022/2023" },
    { key: "bimg_2021_2022", tier: 1, label: "🟢 [T1] 🖼️ Giełda ze zdjęciami (zima) — 2021/2022" },
    { key: "bimg_2020_2021", tier: 1, label: "🟢 [T1] 🖼️ Giełda ze zdjęciami (zima) — 2020/2021" },
    { key: "bimg_2019_2020", tier: 1, label: "🟢 [T1] 🖼️ Giełda ze zdjęciami (zima) — 2019/2020" },
    // TIER 2 — Mocne gówno
    { key: "bmg_nerwy_glowa", tier: 2, label: "🟡 [T2] 💩 Mocne gówno — Nerwy i głowa (92)" },
    { key: "bmg_oko_ucho", tier: 2, label: "🟡 [T2] 💩 Mocne gówno — Oko i ucho (114)" },
    { key: "bmg_oun_mozg", tier: 2, label: "🟡 [T2] 💩 Mocne gówno — OUN / mózg (58)" },
    { key: "bmg_krazenie", tier: 2, label: "🟡 [T2] 💩 Mocne gówno — Układ krążenia (156)" },
    { key: "bmg_oddechowy", tier: 2, label: "🟡 [T2] 💩 Mocne gówno — Układ oddechowy (29)" },
    { key: "bmg_pokarmowy", tier: 2, label: "🟡 [T2] 💩 Mocne gówno — Układ pokarmowy (77)" },
    { key: "bmg_moczowo_plciowy", tier: 2, label: "🟡 [T2] 💩 Mocne gówno — Układ moczowo-płciowy (72)" },
    { key: "bmg_endokrynny_inne", tier: 2, label: "🟡 [T2] 💩 Mocne gówno — Gruczoły i narządy miąższowe (27)" },
    { key: "bmg_miesnie", tier: 2, label: "🟡 [T2] 💩 Mocne gówno — Mięśnie (80)" },
    { key: "bmg_koscie_stawy", tier: 2, label: "🟡 [T2] 💩 Mocne gówno — Kości i stawy (136)" },
    { key: "bmg_inne", tier: 2, label: "🟡 [T2] 💩 Mocne gówno — Pozostałe / mix (248)" },
    // TIER 2 — Z tego się uczyli rok wcześniej
    { key: "b11_oun", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Mózgowie/OUN (bez kategorii)" },
    { key: "b11_miesnie", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Mięśnie" },
    { key: "b11_nerwy", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Nerwy" },
    { key: "b11_naczynia", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Naczynia" },
    { key: "b11_kosci", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Kości i stawy" },
    { key: "b11_pokarmowy", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Pokarmowy" },
    { key: "b11_miejsca", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Miejsca i ograniczenia" },
    { key: "b11_serce", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Serce" },
    { key: "b11_rozrodczy", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Rozrodczy" },
    { key: "b11_oddechowy", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Układ oddechowy" },
    { key: "b11_mocz", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Zimny mocz" },
    { key: "b11_czacha", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Czacha i zatoki" },
    { key: "b11_zmysly", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Zmysły, krtań, jama ustna" },
    { key: "b11_kliniki", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — Kliniki" },
    { key: "b11_english", tier: 2, label: "🟡 [T2] Z tego się uczyli rok wcześniej — English" },
    // TIER 3
    { key: "b1", tier: 3, label: "🔴 [T3] BIOSTRUKTURA – inne giełdy" },
    { key: "b2", tier: 3, label: "🔴 [T3] POTĘŻNA giełda biostruktura" },
    { key: "b3", tier: 3, label: "🔴 [T3] Giełda wykurwista " },
    { key: "b4", tier: 3, label: "🔴 [T3] Dodatkowy zestaw anatomii (unikalne pytania)" },
    // TIER 4
    { key: "t4_unikalne_anatomia", tier: 4, label: "🔵 [T4] Unikalne pytania z Anatomii (4035, bez duplikatów)" },
    // TIER 5
    { key: "t5_esencja", tier: 5, label: "🟣 [T5] Esencja (T1 + powtórki ≥2×, 1692 pytań)" },
];

function cleanLabel(label) {
    return label.replace(/^.*?\[T\d+\]\s*/u, "").trim();
}

// Batche z baza_pytan_eksport.json, które mimo pola "batch" nie są anatomią -
// trafiły do tego samego eksportu, ale należą do EBM/Historii medycyny (patrz
// buildEbm()/buildHistoriaMedycyny() niżej). Wykluczone z buildAnatomia(),
// żeby nie wpadły do niej przez fallback "Nieopisane" i nie zdublowały się.
const EBM_BATCHES = ["b6", "b8"];
const HISTORIA_MEDYCYNY_BATCHES = ["b7", "b9"];
const NON_ANATOMIA_BATCHES = [...EBM_BATCHES, ...HISTORIA_MEDYCYNY_BATCHES];

// ── 2. Anatomia ──
function buildAnatomia() {
    const rawAll = JSON.parse(fs.readFileSync(path.join(DIR, "baza_pytan_eksport.json"), "utf-8"));
    const raw = rawAll.filter(q => !NON_ANATOMIA_BATCHES.includes(q.batch));
    const lookup = new Map(ANATOMIA_BATCHES.map(b => [b.key, b]));

    // Batche obecne w danych, a nieopisane w ANATOMIA_BATCHES -> fallback, żeby nic nie zgubić.
    const seenBatchKeys = new Set(raw.map(q => q.batch));
    const orphanKeys = [...seenBatchKeys].filter(k => !lookup.has(k));
    if (orphanKeys.length) {
        console.warn("[anatomia] batch bez wpisu w ANATOMIA_BATCHES (fallback kategoria):", orphanKeys);
        for (const k of orphanKeys) {
            lookup.set(k, { key: k, tier: null, label: `⚪ [Anatomia] Nieopisane — ${k}` });
        }
    }

    const out = raw.map(q => {
        const meta = lookup.get(q.batch);
        const category = cleanLabel(meta.label);
        const question = {
            subject: "anatomia",
            category,
            tier: meta.tier,
            q: q.q,
            a: letterToIdx(q.a),
            o: q.o,
            img: q.img ?? null,
        };
        question.id = makeQuestionId("anatomia", question.q, question.o);
        return question;
    });

    // Kategorie do UI, w kolejności ANATOMIA_BATCHES (+ ewentualne orphany na końcu).
    const orderedMeta = [...ANATOMIA_BATCHES, ...orphanKeys.map(k => lookup.get(k))];
    const categories = orderedMeta
        .filter(meta => seenBatchKeys.has(meta.key))
        .map(meta => ({ label: meta.label, key: cleanLabel(meta.label), tier: meta.tier, subject: "anatomia" }));

    return extendWithGielda({ questions: out, categories }, "anatomia", "anatomia_gielda_raw.json", "🗂️ [Anatomia]");
}

// ── 3. Wspólny helper: wyciągnięcie tablicy `const questions = [ ... ];` z pliku ──
function extractQuestionsArray(filePath, { needLineNumbers = false } = {}) {
    const text = fs.readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n");
    const startMarker = "const questions = [";
    const startIdx = text.indexOf(startMarker);
    if (startIdx === -1) throw new Error(`Nie znaleziono "${startMarker}" w ${filePath}`);
    const arrOpenIdx = startIdx + startMarker.length - 1; // wskazuje na "["
    const endIdx = text.indexOf("\n];", arrOpenIdx);
    if (endIdx === -1) throw new Error(`Nie znaleziono zamykającego "];" w ${filePath}`);
    const arrayText = text.slice(arrOpenIdx, endIdx + 2); // włącznie z "]"
    const arr = new Function(`"use strict"; return (${arrayText});`)();

    if (!needLineNumbers) return { questions: arr, questionLineNumbers: null, fullText: text };

    // Numer linii każdego kolejnego pytania w oryginalnym tekście - do przypisania kategorii.
    // Obiekt pytania zaczyna się od "{" po którym (na tej samej linii, po ew. innych spacjach)
    // prędzej czy później pojawi się "q:" zanim pojawi się kolejny "{" - dopasuj po polu "q:".
    const before = text.slice(0, arrOpenIdx);
    const linesBefore = before.split("\n").length;
    const arraySrcLines = arrayText.split("\n");
    const questionLineNumbers = [];
    arraySrcLines.forEach((line, i) => {
        if (/^\s*q\s*:/.test(line) || /{\s*q\s*:/.test(line)) questionLineNumbers.push(linesBefore + i);
    });
    if (questionLineNumbers.length !== arr.length) {
        throw new Error(
            `${filePath}: liczba dopasowanych linii "q:" (${questionLineNumbers.length}) != liczba pytań w tablicy (${arr.length})`
        );
    }
    return { questions: arr, questionLineNumbers, fullText: text };
}

// ── 4. Histologia Rok 1 — przebudowa na 22 tematy (Semestr Zimowy 1-11, Letni 12-22) ──
// Cała stara treść (htmlhisto.txt, ZESTAW 1-22 + "pozostałe", oraz histologia_gielda_raw.json)
// trafia do JEDNEJ kategorii "Giełda" (bez zmian, user chce jeden folder archiwalny),
// a tam gdzie ZESTAW/kategoria da się jednoznacznie dopasować do jednego z 22 tematów roku,
// pytanie jest DODATKOWO zduplikowane (ten sam content -> ten sam id, dozwolony "dual x2",
// patrz komentarz przy `byId`/`sameContent` w main()) pod właściwym tematem.
// Nowe pytania autorskie (Junqueira/skrypty/embriologia/Anki) dopisywane są w kolejnych
// rundach do HISTOLOGIA_TEMATY_RAW_FILES (patrz buildHistologiaTematy) i scalane tu, żeby
// kategorie (jedna lista `categories`) powstawały z finalnego, złączonego zbioru pytań.
const HISTOLOGIA_THEME_TEORIA = "📖 Teoria";
const HISTOLOGIA_THEME_PRAKTYKA = "🔬 Egzamin praktyczny";
const HISTOLOGIA_THEME_ORDER = [HISTOLOGIA_THEME_TEORIA, HISTOLOGIA_THEME_PRAKTYKA];

export const HISTOLOGIA_TOPICS = [
    "01. Wprowadzenie do technik histologicznych i mikroskopii",
    "02. Cytofizjologia cz. I — cytoplazma",
    "03. Cytofizjologia cz. II — jądro komórkowe",
    "04. Tkanka nabłonkowa",
    "05. Tkanka łączna i tłuszczowa",
    "06. Tkanki łączne oporowe — chrzęstna i kostna",
    "07. Tkanka mięśniowa",
    "08. Tkanka nerwowa i układ nerwowy",
    "09. Krew i hemopoeza",
    "10. Układ płciowy żeński",
    "11. Układ płciowy męski",
    "12. Embriologia ogólna",
    "13. Układ krwionośny i jego rozwój embriologiczny",
    "14. Układ limfatyczny i jego rozwój embriologiczny",
    "15. Narządy zmysłów, skóra i rozwój układu nerwowego",
    "16. Przewód pokarmowy cz. I — jama ustna",
    "17. Przewód pokarmowy cz. II — cewa pokarmowa",
    "18. Narządy związane z przewodem pokarmowym",
    "19. Układ oddechowy i jego rozwój embriologiczny",
    "20. Układ moczowy i płciowy — rozwój embriologiczny",
    "21. Układ dokrewny i jego rozwój embriologiczny",
    "22. Popłód, jego rozwój i teratologia",
];

// Mapowanie starego "ZESTAW N" (numeracja z pierwotnego skryptu 1.pdf-22.pdf) na numer
// (1-22) aktualnej listy 22 tematów roku (ze zdjęć kart zaliczeń, patrz pamięć projektu).
const ZESTAW_TO_TOPIC = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 5, 7: 6, 8: 6, 9: 7, 10: 8, 11: 9,
    12: 11, 13: 10, 14: 13, 15: 14, 16: 15, 17: 17, 18: 18, 19: 19, 20: 21, 21: 20, 22: 15,
};
// Kategorie własne histologia_gielda_raw.json, które da się jednoznacznie przypisać do tematu
// (pozostałe dwie - "Tkanki i komórki" / "Narządy i układy" - są zbyt mieszane, zostają tylko w Giełdzie).
const GIELDA_CATEGORY_TO_TOPIC = {
    "Giełda — Embriologia (sesja letnia)": 12,
};

function buildHistologia() {
    const filePath = path.join(DIR, "htmlhisto.txt");
    const { questions, questionLineNumbers, fullText } = extractQuestionsArray(filePath, { needLineNumbers: true });
    const lines = fullText.split("\n");

    // Zbierz (numer_linii -> nazwa zestawu) dla wszystkich komentarzy // ZESTAW ...
    const zestawLines = [];
    lines.forEach((line, i) => {
        const m = line.match(/\/\/\s*(ZESTAW\s+\d+\s*:.*)$/i);
        if (m) zestawLines.push({ line: i, name: m[1].trim() });
    });

    const FALLBACK_CATEGORY = "Histologia — pozostałe (bez zestawu)";

    function categoryForLine(lineNo) {
        let current = null;
        for (const z of zestawLines) {
            if (z.line <= lineNo) current = z.name;
            else break;
        }
        return current || FALLBACK_CATEGORY;
    }

    const legacyQuestions = questions.map((q, i) => {
        const originalCategory = categoryForLine(questionLineNumbers[i]);
        const question = {
            subject: "histologia",
            category: originalCategory,
            tier: null,
            q: q.q,
            a: letterToIdx(q.a),
            o: q.o,
            img: null,
        };
        question.id = makeQuestionId("histologia", question.q, question.o);
        return { question, originalCategory };
    });

    const gieldaRawPath = path.join(DIR, "histologia_gielda_raw.json");
    const gieldaLegacy = fs.existsSync(gieldaRawPath)
        ? JSON.parse(fs.readFileSync(gieldaRawPath, "utf-8")).map(item => {
            const question = {
                subject: "histologia",
                category: item.category,
                tier: null,
                q: item.q,
                a: item.a,
                o: item.o,
                img: null,
            };
            if (item.rationale) question.rationale = item.rationale;
            question.id = makeQuestionId("histologia", question.q, question.o);
            return { question, originalCategory: item.category };
        })
        : [];

    const allLegacy = [...legacyQuestions, ...gieldaLegacy];

    const out = [];

    // Nowe pytania autorskie (Junqueira/skrypty/embriologia/Anki), dopisywane rundami do
    // histologia_tematy_raw.json - każdy wpis ma już poprawny `category` (jedna z HISTOLOGIA_TOPICS).
    const tematyRawPath = path.join(DIR, "histologia_tematy_raw.json");
    if (fs.existsSync(tematyRawPath)) {
        const tematyRaw = JSON.parse(fs.readFileSync(tematyRawPath, "utf-8"));
        for (const item of tematyRaw) {
            const question = {
                subject: "histologia",
                category: item.category,
                tier: null,
                q: item.q,
                a: item.a,
                o: item.o,
                img: null,
            };
            if (item.rationale) question.rationale = item.rationale;
            question.id = makeQuestionId("histologia", question.q, question.o);
            out.push(question);
        }
    }

    for (const { question, originalCategory } of allLegacy) {
        // Kopia nr 1: zawsze trafia do jednej, zbiorczej "Giełdy".
        out.push({ ...question, category: "Giełda (pytania z poprzednich lat)" });

        // Kopia nr 2 (dual-tag): jeśli oryginalna kategoria da się dopasować do jednego z 22
        // tematów, ten sam content (ten sam id) trafia też pod właściwy temat.
        const zestawMatch = originalCategory.match(/^ZESTAW\s+(\d+)/i);
        const topicNum = zestawMatch
            ? ZESTAW_TO_TOPIC[Number(zestawMatch[1])]
            : GIELDA_CATEGORY_TO_TOPIC[originalCategory];
        if (topicNum) {
            out.push({ ...question, category: HISTOLOGIA_TOPICS[topicNum - 1] });
        }
    }

    // Kategorie budowane raz, na końcu, ze złączonego zbioru pytań - dzięki temu kolejne
    // rundy dopisujące nowe pytania z Junqueiry/skryptów/Anki (patrz taski #53-56) mogą po
    // prostu dopisać obiekty do `out` przed tym miejscem, bez ryzyka zdublowanych kategorii.
    const byCategory = new Map();
    for (const q of out) byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1);
    const categories = [...byCategory.entries()].map(([cat, count]) => {
        const c = {
            label: cat.startsWith("Giełda") ? `🗂️ [Histologia] ${cat} (${count})` : `🧫 [Histologia] ${cat} (${count})`,
            key: cat,
            tier: null,
            subject: "histologia",
            theme: HISTOLOGIA_THEME_TEORIA,
        };
        // Dowiązanie kategorii (=temat) do jednostki tygodniowej planu nauki (patrz
        // Plan rozbudowy apki.md + supabase_schema_study_plan.sql) - ordinal jednostki
        // = numer tematu (1-22), bo kolejność HISTOLOGIA_TOPICS JEST już poprawną
        // kolejnością dydaktyczną (ustaloną wcześniej ze skryptu/zaliczeń). Dzięki temu
        // "Dzisiejsza sesja" może skoczyć od razu w konkretny temat, nie tylko przedmiot.
        const topicIdx = HISTOLOGIA_TOPICS.indexOf(cat);
        if (topicIdx !== -1) c.studyUnit = { ordinal: topicIdx + 1 };
        return c;
    });

    return { questions: out, categories };
}

// ── 4b. Histologia — egzamin praktyczny (preparaty) ──
// Kilka plików *_raw.json (jeden na źródło z folderu "Praktyczny Histologia":
// talie Anki, PDF-y) - każdy to lista {category, q, answers, rationale?, img?}
// (zdjęcia preparatów/elektronogramów, czasem z narysowanymi strzałkami-numerami
// + pytanie o rozpoznanie wskazanej komórki/struktury). Tryb "typed" (wpisywana
// odpowiedź), bo to dokładnie odwzorowuje realny format egzaminu praktycznego.
// `img` w plikach raw to już ścieżka względna w buckecie R2 (np.
// "hist_prakt/paste-....jpg"), więc trzeba tylko dokleić R2_BASE_URL.
const HISTOLOGIA_PRAKTYCZNY_RAW_FILES = [
    "histologia_praktyczny_raw.json",
    "histologia_teams_raw.json",
    "histologia_probne_raw.json",
    "histologia_pdf_testy_raw.json",
    "histologia_jk_raw.json",
    "histologia_mega_raw.json",
    "histologia_sem2_raw.json",
];
function buildHistologiaPraktyczny() {
    const raw = HISTOLOGIA_PRAKTYCZNY_RAW_FILES.flatMap(fname => {
        const rawPath = path.join(DIR, fname);
        if (!fs.existsSync(rawPath)) {
            console.warn(`[histologia_praktyczny] brak ${fname} - pomijam`);
            return [];
        }
        return JSON.parse(fs.readFileSync(rawPath, "utf-8"));
    });

    const out = raw.map(item => {
        const question = {
            subject: "histologia",
            category: item.category,
            tier: null,
            q: item.q,
            mode: "typed",
            a: 0,
            o: [item.answers[0]],
            answers: item.answers,
            // niektóre pliki (zrzuty ekranu) mają spacje/nawiasy/polskie znaki w nazwie -
            // trzeba zakodować każdy segment ścieżki osobno, żeby nie zepsuć "/" jako separatora.
            img: item.img ? `${R2_BASE_URL}/img/${item.img.split("/").map(encodeURIComponent).join("/")}` : null,
        };
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("histologia", question.q, question.o);
        return question;
    });

    // Dowiązanie do jednostki tygodniowej planu nauki (patrz HISTOLOGIA_TOPICS) - tylko dla
    // kategorii, które faktycznie odpowiadają jednemu konkretnemu tematowi z 22 (np. "Krew i
    // hemopoeza"); kategorie zbiorcze (np. TEAMS, które mieszają wiele tematów) zostają bez ordinal.
    const CATEGORY_TO_STUDY_UNIT = {
        "Egzamin praktyczny — Krew i hemopoeza": 9,
    };

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => {
        const c = {
            label: `🔬 [Histologia] ${cat} (${count})`,
            key: cat,
            tier: null,
            subject: "histologia",
            theme: HISTOLOGIA_THEME_PRAKTYKA,
        };
        if (CATEGORY_TO_STUDY_UNIT[cat]) c.studyUnit = { ordinal: CATEGORY_TO_STUDY_UNIT[cat] };
        return c;
    });

    return { questions: out, categories };
}

// ── 5. Biochemia (bez podziału na kategorie) ──
// Pytania wzbogacane są opcjonalnie o biochemia_enrichment.json - mapę
// {numer_pytania: {o, a, rationale}} pozwalającą podmienić dystraktory (żeby
// nie wyglądały na 1:1 skopiowane z oryginalnego źródła) i dodać statyczne
// "wytłumaczenie teoretyczne" (patrz createExplainButton() w index.html)
// bez ingerencji w oryginalny plik htmlbiochem.txt. Klucz to numer z prefiksu
// pytania ("N. ..."), więc wzbogacanie można uzupełniać stopniowo, rundami.
function loadBiochemiaEnrichment() {
    const filePath = path.join(DIR, "biochemia_enrichment.json");
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// Giełdy z sesji egzaminacyjnych (różne lata/terminy) - dokładane jako osobne
// kategorie obok głównej puli 988 pytań z htmlbiochem.txt. Źródło:
// biochemia_gielda_raw.json, tablica {category, q, o, a, rationale}, a jest
// indeksem 0-based (nie literą) w o. Rozszerzane stopniowo, rundami.
function loadBiochemiaGielda() {
    const rawPath = path.join(DIR, "biochemia_gielda_raw.json");
    if (!fs.existsSync(rawPath)) return [];
    return JSON.parse(fs.readFileSync(rawPath, "utf-8"));
}

function buildBiochemia() {
    const filePath = path.join(DIR, "htmlbiochem.txt");
    const { questions } = extractQuestionsArray(filePath);
    const CATEGORY = "Biochemia — wszystkie pytania";
    const enrichment = loadBiochemiaEnrichment();

    let enrichedCount = 0;
    const out = questions.map(q => {
        const numMatch = q.q.match(/^(\d+)\./);
        const enr = numMatch ? enrichment[numMatch[1]] : undefined;

        const question = {
            subject: "biochemia",
            category: CATEGORY,
            tier: null,
            q: q.q,
            a: enr ? letterToIdx(enr.a) : letterToIdx(q.a),
            o: enr ? enr.o : q.o,
            img: null,
        };
        if (enr) {
            question.rationale = enr.rationale;
            enrichedCount++;
        }
        question.id = makeQuestionId("biochemia", question.q, question.o);
        return question;
    });
    console.log(`[biochemia] wzbogacono ${enrichedCount}/${out.length} pytań (dystraktory + wytłumaczenie)`);

    // Kafelek "wszystkie pytania" jest ukryty w UI (patrz loadAppData() w index.html,
    // filtruje categories po `hidden`) - te same pytania są teraz dostępne rozdzielone
    // na kategorie tematyczne w biochemia_gielda_raw.json (patrz categorize_biochemia_append.mjs).
    // Pytania NIE są usuwane z bazy, tylko przestaje istnieć osobny kafelek do wyboru.
    const categories = [{ label: `🧪 [Biochemia] ${CATEGORY} (${out.length})`, key: CATEGORY, tier: null, subject: "biochemia", hidden: true }];

    const gielda = loadBiochemiaGielda();
    if (gielda.length) {
        const gieldaOut = gielda.map(item => {
            const question = {
                subject: "biochemia",
                category: item.category,
                tier: null,
                q: item.q,
                a: item.a,
                o: item.o,
                img: null,
            };
            if (item.rationale) question.rationale = item.rationale;
            question.id = makeQuestionId("biochemia", question.q, question.o);
            return question;
        });
        const byCategory = new Map();
        gieldaOut.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
        for (const [cat, count] of byCategory) {
            categories.push({ label: `🗂️ [Biochemia] ${cat} (${count})`, key: cat, tier: null, subject: "biochemia" });
        }
        out.push(...gieldaOut);
        console.log(`[biochemia] giełda: ${gieldaOut.length} pytań w ${byCategory.size} kategoriach`);
    }

    return { questions: out, categories };
}

// ── 6. EBM i Historia medycyny - też z baza_pytan_eksport.json, tylko inne
// wartości pola "batch" (patrz EBM_BATCHES/HISTORIA_MEDYCYNY_BATCHES wyżej).
// Te partie były błędnie oznaczone jako anatomia (batch=b6/b7/b8/b9), a to
// zupełnie inne przedmioty - stąd osobne budowanie zamiast wrzucania do
// buildAnatomia() przez fallback "Nieopisane". Każdy stary "batch" ma tu
// przypisaną własną kategorię (batchCategoryMap), zamiast jednego wspólnego worka -
// b6/b7 i b8/b9 różnią się stylem (giełda vs wykłady/ściąga), więc zasługują
// na osobne partie w UI.
function buildFromLegacyBatches(batchCategoryMap, subjectKey, iconLabel) {
    const rawAll = JSON.parse(fs.readFileSync(path.join(DIR, "baza_pytan_eksport.json"), "utf-8"));
    const batchKeys = Object.keys(batchCategoryMap);
    const raw = rawAll.filter(q => batchKeys.includes(q.batch));

    const out = raw.map(q => {
        const question = {
            subject: subjectKey,
            category: batchCategoryMap[q.batch],
            tier: null,
            q: q.q,
            a: letterToIdx(q.a),
            o: q.o,
            img: q.img ?? null,
        };
        question.id = makeQuestionId(subjectKey, question.q, question.o);
        return question;
    });

    // Kategorie w kolejności podanej w batchCategoryMap (Object.keys zachowuje
    // kolejność wstawiania dla kluczy string), pomijając te bez pytań.
    const seenCats = [];
    for (const cat of Object.values(batchCategoryMap)) if (!seenCats.includes(cat)) seenCats.push(cat);
    const categories = seenCats
        .map(cat => ({ label: `${iconLabel} ${cat} (${out.filter(q => q.category === cat).length})`, key: cat, tier: null, subject: subjectKey }))
        .filter(c => !c.label.includes("(0)"));

    return { questions: out, categories };
}

function buildEbm() {
    return buildFromLegacyBatches(
        { b6: "EBM — Giełda", b8: "EBM — Ściąga (krótkie pytania)" },
        "ebm",
        "🧮 [EBM]"
    );
}

// Generyczne rozszerzenie o dodatkowe pytania z pliku *_gielda_raw.json (ten sam
// format co biochemia_gielda_raw.json: tablica {category, q, o, a, rationale},
// a jest indeksem 0-based). Używane przez histologię, anatomię i historię
// medycyny do dokładania nowych kategorii giełd bez ingerencji w istniejące
// źródła (htmlhisto.txt / baza_pytan_eksport.json / legacy batches).
function loadGieldaRaw(rawFileName) {
    const rawPath = path.join(DIR, rawFileName);
    if (!fs.existsSync(rawPath)) return [];
    return JSON.parse(fs.readFileSync(rawPath, "utf-8"));
}

function extendWithGielda(built, subjectKey, rawFileName, iconLabel) {
    const gielda = loadGieldaRaw(rawFileName);
    if (!gielda.length) return built;

    const gieldaOut = gielda.map(item => {
        const question = {
            subject: subjectKey,
            category: item.category,
            tier: null,
            q: item.q,
            a: item.a,
            o: item.o,
            img: null,
        };
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId(subjectKey, question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    gieldaOut.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    for (const [cat, count] of byCategory) {
        built.categories.push({ label: `${iconLabel} ${cat} (${count})`, key: cat, tier: null, subject: subjectKey });
    }
    built.questions.push(...gieldaOut);
    console.log(`[${subjectKey}] giełda: ${gieldaOut.length} pytań w ${byCategory.size} kategoriach`);
    return built;
}

function buildHistoriaMedycyny() {
    const built = buildFromLegacyBatches(
        { b7: "Historia medycyny — Wykłady", b9: "Historia medycyny — Giełda" },
        "historia_medycyny",
        "📜 [Historia medycyny]"
    );
    return extendWithGielda(built, "historia_medycyny", "historia_medycyny_gielda_raw.json", "🗂️ [Historia medycyny]");
}

// ── 7. Angielski - fiszki z Anki (angielski_raw.json, patrz apkg_to_json.py) ──
// To są pary przód/tył (słówko/tłumaczenie), nie pytania testowe z gotowymi
// opcjami - dopisujemy 4 dystraktory losowane z INNYCH fiszek tej samej talii
// (kategorii), żeby działały tak samo jak reszta bazy w trybie testowym/
// egzaminacyjnym/eksporcie do Anki, a nie tylko w trybie fiszek.
// Losowanie jest deterministyczne (seed = fnv1a treści), żeby ponowne
// uruchomienie skryptu dawało te same id, a nie nowy losowy zestaw za każdym razem.
function seededShuffle(arr, seedHex) {
    let s = parseInt(seedHex, 16) >>> 0;
    const rand = () => {
        s = (Math.imul(s, 1103515245) + 12345) >>> 0;
        return s / 0xffffffff;
    };
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function buildAngielski() {
    const rawPath = path.join(DIR, "angielski_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[angielski] brak angielski_raw.json - pomijam (uruchom najpierw: python apkg_to_json.py)");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const byCategory = new Map();
    raw.forEach(n => {
        if (!byCategory.has(n.category)) byCategory.set(n.category, []);
        byCategory.get(n.category).push(n);
    });

    const out = [];
    for (const [category, notes] of byCategory) {
        const allBacks = notes.map(n => n.back);
        notes.forEach(n => {
            const seed = fnv1a(n.front + "||" + n.back);
            const others = allBacks.filter(b => b !== n.back);
            const distractors = seededShuffle(others, seed).slice(0, 4);
            const options = seededShuffle([n.back, ...distractors], seed);
            const question = {
                subject: "angielski",
                category,
                tier: null,
                q: n.front,
                a: options.indexOf(n.back),
                o: options,
                img: null,
            };
            question.id = makeQuestionId("angielski", question.q, question.o);
            out.push(question);
        });
    }

    const categories = [...byCategory.entries()].map(([cat, notes]) => ({
        label: `🇬🇧 [Angielski] ${cat} (${notes.length})`,
        key: cat,
        tier: null,
        subject: "angielski",
    }));

    return { questions: out, categories };
}

// ── 8. Ćwiczenia z angielskiego (angielski_cwiczenia_raw.json) - ręcznie
// zdigitalizowane zadania z dokumentów ćwiczeniowych (Lek-I-Review-of-material,
// Term-II-review-of-material): uzupełnianie tekstu, tłumaczenia, definicje,
// słowotwórstwo, synonimy, przyimki (mode: "typed" - wpisywana odpowiedź) oraz
// test wyboru / prawda-fałsz (mode: "mc" - zwykłe pytanie z opcjami).
function buildAngielskiCwiczenia() {
    const rawPath = path.join(DIR, "angielski_cwiczenia_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[angielski_cwiczenia] brak angielski_cwiczenia_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "angielski",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        question.id = makeQuestionId("angielski", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `🇬🇧 [Angielski] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "angielski",
    }));

    return { questions: out, categories };
}

// ── 8b. Angielski Rok 2 (semestr III/IV, materiały Skrypt III/IV + Anki Emergency
// Medicine) - osobny przedmiot (nie kategoria w "angielski"), bo "rok" jest
// przypisany per-subject (patrz SUBJECTS niżej), a to inny rocznik kursu niż
// istniejące fiszki roku 1. Kategorie "BUTRYN::SEMESTR 3::..." ze starych
// talii Anki (patrz apkg_to_json.py) są przemianowywane na czytelne etykiety.
const ANGIELSKI2_CATEGORY_RENAME = {
    "BUTRYN::SEMESTR 3::1.EMERGENCY MEDICINE": "Emergency medicine — fiszki Anki",
};

function buildAngielski2() {
    const rawPaths = ["angielski2_skrypt_raw.json", "angielski2_anki_raw.json"];
    let raw = [];
    for (const fname of rawPaths) {
        const rawPath = path.join(DIR, fname);
        if (!fs.existsSync(rawPath)) {
            console.warn(`[angielski_2] brak ${fname} - pomijam`);
            continue;
        }
        raw = raw.concat(JSON.parse(fs.readFileSync(rawPath, "utf-8")));
    }
    raw = raw.map(n => ({
        ...n,
        category: ANGIELSKI2_CATEGORY_RENAME[n.category] ?? n.category,
    }));

    const byCategory = new Map();
    raw.forEach(n => {
        if (!byCategory.has(n.category)) byCategory.set(n.category, []);
        byCategory.get(n.category).push(n);
    });

    const out = [];
    for (const [category, notes] of byCategory) {
        const allBacks = notes.map(n => n.back);
        notes.forEach(n => {
            const seed = fnv1a(n.front + "||" + n.back);
            const others = allBacks.filter(b => b !== n.back);
            const distractors = seededShuffle(others, seed).slice(0, 4);
            const options = seededShuffle([n.back, ...distractors], seed);
            const question = {
                subject: "angielski_2",
                category,
                tier: null,
                q: n.front,
                a: options.indexOf(n.back),
                o: options,
                img: null,
            };
            question.id = makeQuestionId("angielski_2", question.q, question.o);
            out.push(question);
        });
    }

    const categories = [...byCategory.entries()].map(([cat, notes]) => ({
        label: `🇬🇧 [Angielski Rok 2] ${cat} (${notes.length})`,
        key: cat,
        tier: null,
        subject: "angielski_2",
    }));

    return { questions: out, categories };
}

// ── 8c. Ćwiczenia z angielskiego Rok 2 (angielski2_cwiczenia_raw.json) -
// zdigitalizowane zadania z Term-III-review (odpowiedzi zweryfikowane odręcznym
// kluczem) oraz Lek2 U2 revision (zadania "ułóż kolejność" i "dopasuj parę"
// przekształcone na pytania typed/mc, patrz komentarz w tym pliku JSON).
function buildAngielski2Cwiczenia() {
    const rawPath = path.join(DIR, "angielski2_cwiczenia_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[angielski_2_cwiczenia] brak angielski2_cwiczenia_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "angielski_2",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        question.id = makeQuestionId("angielski_2", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `🇬🇧 [Angielski Rok 2] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "angielski_2",
    }));

    return { questions: out, categories };
}

// Dowiązuje kategorie do planu nauki (study_units) NA POZIOMIE KATEGORII, w
// kolejności tematów z `themeOrder`, a w obrębie tematu - w kolejności, w
// jakiej kategorie i tak już występują w tablicy (czyli w kolejności danych
// źródłowych - zwykle numeracja wykładów/ćwiczeń). Każda kategoria dostaje
// kolejny, rosnący `studyUnit.ordinal` (1, 2, 3...) - jeden ciągły numerowany
// spis "lekcji" na cały przedmiot, niezależnie od podziału na tematy. Wiele
// kolejnych ordinali może potem współdzielić ten sam tydzień kalendarzowy w
// SQL-owym seedzie (patrz prototype_seed_theme_weeks.sql) - to ROZWIĄZUJE
// problem "cały temat w 1 tygodniu" (np. Wirusologia = 12 kategorii, przy 5
// kategoriach/tydzień to ~2,5 tygodnia, nie 1).
function assignStudyUnitOrdinalsByTheme(categories, themeOrder) {
    let ordinal = 0;
    themeOrder.forEach(theme => {
        categories.forEach(c => {
            if (c.theme === theme) {
                ordinal++;
                c.studyUnit = { ordinal };
            }
        });
    });
}

// ── Warstwa "temat" (theme) nad kategoriami mikrobiologii i fizjopato ──
// Obie bazy mają dziesiątki drobnych kategorii (jeden wykład/rozdział = jedna
// kategoria, często <10 pytań), więc same kategorie są za drobnoziarniste do
// wygodnej nawigacji kafelkami. Ta warstwa grupuje kategorie w kilkanaście
// szerszych tematów medycznych (np. wszystkie kategorie o sercu/EKG → jeden
// temat "Układ krążenia i EKG"), nie zmieniając samych kategorii - `category`
// na pytaniu i tak zostaje oryginalną, drobną nazwą (notatki, eksport do Anki,
// filtrowanie po `category` działają bez zmian). UI (index.html) używa `theme`
// jako dodatkowego, opcjonalnego poziomu nawigacji: Przedmiot → Temat → Partia.
const MIKROBIOLOGIA_THEME_ORDER = [
    "🔬 Podstawy mikrobiologii",
    "💊 Antybiotyki i oporność",
    "🧬 Wirusologia",
    "🧴 Zakażenia skóry",
    "🫁 Zakażenia dróg oddechowych",
    "🍽️ Zakażenia przewodu pokarmowego",
    "🚽 Zakażenia układu moczowego",
    "🔞 Zakażenia układu płciowego i okołoporodowe",
    "🩸 Bakteriemia, wsierdzie i pałeczki niefermentujące",
    "🧠 Neuroinfekcje",
    "📋 Powtórki ogólne",
];

const MIKROBIOLOGIA_THEME_MAP = {
    // Bakteriologia szczegółowa — Rozdz. 1 (skóra)
    "Bakteriologia szczegółowa — Rozdz. 1 — Actinomyces (promienica)": "🧴 Zakażenia skóry",
    "Bakteriologia szczegółowa — Rozdz. 1 — Clostridium perfringens": "🧴 Zakażenia skóry",
    "Bakteriologia szczegółowa — Rozdz. 1 — Cutibacterium acnes i trądzik": "🧴 Zakażenia skóry",
    "Bakteriologia szczegółowa — Rozdz. 1 — Mycobacterium leprae (trąd)": "🧴 Zakażenia skóry",
    "Bakteriologia szczegółowa — Rozdz. 1 — Nocardia": "🧴 Zakażenia skóry",
    "Bakteriologia szczegółowa — Rozdz. 1 — Staphylococcus aureus": "🧴 Zakażenia skóry",
    "Bakteriologia szczegółowa — Rozdz. 1 — Streptococcus pyogenes": "🧴 Zakażenia skóry",
    "Bakteriologia szczegółowa — Rozdz. 1 — Wirusy skóry i mikrobiom": "🧴 Zakażenia skóry",
    // Rozdz. 2 (drogi oddechowe)
    "Bakteriologia szczegółowa — Rozdz. 2 — Bordetella pertussis (krztusiec)": "🫁 Zakażenia dróg oddechowych",
    "Bakteriologia szczegółowa — Rozdz. 2 — Chlamydia spp.": "🫁 Zakażenia dróg oddechowych",
    "Bakteriologia szczegółowa — Rozdz. 2 — Corynebacterium diphtheriae (błonica)": "🫁 Zakażenia dróg oddechowych",
    "Bakteriologia szczegółowa — Rozdz. 2 — Haemophilus influenzae": "🫁 Zakażenia dróg oddechowych",
    "Bakteriologia szczegółowa — Rozdz. 2 — Legionella pneumophila": "🫁 Zakażenia dróg oddechowych",
    "Bakteriologia szczegółowa — Rozdz. 2 — Moraxella catarrhalis": "🫁 Zakażenia dróg oddechowych",
    "Bakteriologia szczegółowa — Rozdz. 2 — Mycobacterium tuberculosis (gruźlica)": "🫁 Zakażenia dróg oddechowych",
    "Bakteriologia szczegółowa — Rozdz. 2 — Mycoplasma pneumoniae": "🫁 Zakażenia dróg oddechowych",
    "Bakteriologia szczegółowa — Rozdz. 2 — Streptococcus pneumoniae": "🫁 Zakażenia dróg oddechowych",
    "Bakteriologia szczegółowa — Rozdz. 2 — Wprowadzenie i wirusy UO": "🫁 Zakażenia dróg oddechowych",
    // Rozdz. 3 (przewód pokarmowy)
    "Bakteriologia szczegółowa — Rozdz. 3 — Bacillus cereus": "🍽️ Zakażenia przewodu pokarmowego",
    "Bakteriologia szczegółowa — Rozdz. 3 — Campylobacter jejuni": "🍽️ Zakażenia przewodu pokarmowego",
    "Bakteriologia szczegółowa — Rozdz. 3 — Clostridioides difficile": "🍽️ Zakażenia przewodu pokarmowego",
    "Bakteriologia szczegółowa — Rozdz. 3 — Escherichia coli": "🍽️ Zakażenia przewodu pokarmowego",
    "Bakteriologia szczegółowa — Rozdz. 3 — Helicobacter pylori": "🍽️ Zakażenia przewodu pokarmowego",
    "Bakteriologia szczegółowa — Rozdz. 3 — Listeria monocytogenes": "🍽️ Zakażenia przewodu pokarmowego",
    "Bakteriologia szczegółowa — Rozdz. 3 — Salmonella": "🍽️ Zakażenia przewodu pokarmowego",
    "Bakteriologia szczegółowa — Rozdz. 3 — Shigella": "🍽️ Zakażenia przewodu pokarmowego",
    "Bakteriologia szczegółowa — Rozdz. 3 — Vibrio cholerae": "🍽️ Zakażenia przewodu pokarmowego",
    "Bakteriologia szczegółowa — Rozdz. 3 — Wprowadzenie": "🍽️ Zakażenia przewodu pokarmowego",
    // Rozdz. 4 (układ moczowy)
    "Bakteriologia szczegółowa — Rozdz. 4 — Chlamydia trachomatis": "🚽 Zakażenia układu moczowego",
    "Bakteriologia szczegółowa — Rozdz. 4 — Enterobacter i Citrobacter": "🚽 Zakażenia układu moczowego",
    "Bakteriologia szczegółowa — Rozdz. 4 — Enterococcus": "🚽 Zakażenia układu moczowego",
    "Bakteriologia szczegółowa — Rozdz. 4 — Escherichia coli (ZUM)": "🚽 Zakażenia układu moczowego",
    "Bakteriologia szczegółowa — Rozdz. 4 — Klebsiella pneumoniae": "🚽 Zakażenia układu moczowego",
    "Bakteriologia szczegółowa — Rozdz. 4 — Mycoplasma i Ureaplasma (ZUM)": "🚽 Zakażenia układu moczowego",
    "Bakteriologia szczegółowa — Rozdz. 4 — Proteus, Morganella, Providencia, Serratia": "🚽 Zakażenia układu moczowego",
    "Bakteriologia szczegółowa — Rozdz. 4 — Pseudomonas aeruginosa (ZUM)": "🚽 Zakażenia układu moczowego",
    "Bakteriologia szczegółowa — Rozdz. 4 — S. saprophyticus i C. urealyticum": "🚽 Zakażenia układu moczowego",
    "Bakteriologia szczegółowa — Rozdz. 4 — Wprowadzenie i Enterobacterales": "🚽 Zakażenia układu moczowego",
    // Rozdz. 5 (STD/TORCH) + Rozdz. 6 (flora pochwy/BV) → jeden temat płciowy/okołoporodowy
    "Bakteriologia szczegółowa — Rozdz. 5 — Haemophilus ducreyi (wrzód miękki)": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 5 — Klebsiella granulomatis (donowanoza)": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 5 — Neisseria gonorrhoeae": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 5 — Streptococcus agalactiae (GBS)": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 5 — Treponema pallidum (kiła)": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 5 — Wprowadzenie (STD i TORCH)": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 6 — Atopobium": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 6 — Bacteroides": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 6 — Fusobacterium": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 6 — Gardnerella vaginalis": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 6 — Leptotrichia buccalis": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 6 — Mobiluncus": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 6 — Porphyromonas": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 6 — Prevotella": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Bakteriologia szczegółowa — Rozdz. 6 — Wprowadzenie (fizjologia pochwy i BV)": "🔞 Zakażenia układu płciowego i okołoporodowe",
    // Rozdz. 7 (bakteriemia/BSI) + Rozdz. 8 (pałeczki niefermentujące)
    "Bakteriologia szczegółowa — Rozdz. 7 — Paciorkowce jamy ustnej (grupa viridans)": "🩸 Bakteriemia, wsierdzie i pałeczki niefermentujące",
    "Bakteriologia szczegółowa — Rozdz. 7 — Staphylococcus epidermidis (CNS)": "🩸 Bakteriemia, wsierdzie i pałeczki niefermentujące",
    "Bakteriologia szczegółowa — Rozdz. 7 — Wprowadzenie (bakteriemia, sepsa, BSI)": "🩸 Bakteriemia, wsierdzie i pałeczki niefermentujące",
    "Bakteriologia szczegółowa — Rozdz. 8 — Acinetobacter baumannii": "🩸 Bakteriemia, wsierdzie i pałeczki niefermentujące",
    "Bakteriologia szczegółowa — Rozdz. 8 — Burkholderia (cepacia, gladioli, mallei, pseudomallei)": "🩸 Bakteriemia, wsierdzie i pałeczki niefermentujące",
    "Bakteriologia szczegółowa — Rozdz. 8 — Pseudomonas aeruginosa": "🩸 Bakteriemia, wsierdzie i pałeczki niefermentujące",
    "Bakteriologia szczegółowa — Rozdz. 8 — Stenotrophomonas maltophilia": "🩸 Bakteriemia, wsierdzie i pałeczki niefermentujące",
    "Bakteriologia szczegółowa — Rozdz. 8 — Wprowadzenie (pałeczki niefermentujące)": "🩸 Bakteriemia, wsierdzie i pałeczki niefermentujące",
    // Rozdz. 9 (neuroinfekcje)
    "Bakteriologia szczegółowa — Rozdz. 9 — Clostridium botulinum (botulizm)": "🧠 Neuroinfekcje",
    "Bakteriologia szczegółowa — Rozdz. 9 — Clostridium tetani (tężec)": "🧠 Neuroinfekcje",
    "Bakteriologia szczegółowa — Rozdz. 9 — Escherichia coli serotypu K1": "🧠 Neuroinfekcje",
    "Bakteriologia szczegółowa — Rozdz. 9 — Neisseria meningitidis": "🧠 Neuroinfekcje",
    "Bakteriologia szczegółowa — Rozdz. 9 — Wprowadzenie (neuroinfekcje)": "🧠 Neuroinfekcje",
    // Wykłady
    "Wykład 1-2 — Taksonomia, budowa bakterii, epidemiologia i wirulencja": "🔬 Podstawy mikrobiologii",
    "Wykład 10 — Zakażenia wirusowe ciąży i okresu noworodkowego": "🧬 Wirusologia",
    "Wykład 11 — HIV i zakażenia oportunistyczne": "🧬 Wirusologia",
    "Wykład 12 — Wirusowe zakażenia układu pokarmowego": "🧬 Wirusologia",
    "Wykład 13 — Wirusy hepatotropowe (WZW)": "🧬 Wirusologia",
    "Wykład 14 — Wirusowe zakażenia układu oddechowego": "🧬 Wirusologia",
    "Wykład 15 — Koronawirusy i COVID-19": "🧬 Wirusologia",
    "Wykład 16+ — Priony, arbowirusy i uzupełnienia wirusologiczne": "🧬 Wirusologia",
    "Wykład 3 — Mikrobiom człowieka": "🔬 Podstawy mikrobiologii",
    "Wykład 4-5 — Antybiotyki, oporność i zakażenia szpitalne": "💊 Antybiotyki i oporność",
    "Wykład 6-7 — Budowa, replikacja wirusów i odpowiedź przeciwwirusowa": "🧬 Wirusologia",
    "Wykład 8 — Wirusy DNA": "🧬 Wirusologia",
    "Wykład 9 — Wirusy RNA (reowirusy, paramyksowirusy, ortomyksowirusy, inne)": "🧬 Wirusologia",
    "Wykład 9b — Wirusowe choroby skóry i błon śluzowych": "🧬 Wirusologia",
    "Wykład: Giełda posegregowana — powtórka ogólna": "📋 Powtórki ogólne",
    "Wykład: Mikrobiologia wypunktowana — powtórka ogólna": "📋 Powtórki ogólne",
    "Wykład: Mikrokoszmar — powtórka ogólna": "📋 Powtórki ogólne",
    "Wykład: Wielka Powtórka — Antybiotyki (biosynteza białek i genom)": "💊 Antybiotyki i oporność",
    "Wykład: Wielka Powtórka — Antybiotyki (kliniczne perełki dr Brauncajs)": "💊 Antybiotyki i oporność",
    "Wykład: Wielka Powtórka — Oporność na antybiotyki (mechanizmy)": "💊 Antybiotyki i oporność",
    "Wykład: Wielka Powtórka — Wirusologia": "🧬 Wirusologia",
    // Ćwiczenia
    "Ćwiczenie 1 — Budowa, kształty i klasyfikacja bakterii": "🔬 Podstawy mikrobiologii",
    "Ćwiczenie 10 — Choroby przenoszone drogą płciową i zakażenia okołoporodowe": "🔞 Zakażenia układu płciowego i okołoporodowe",
    "Ćwiczenie 11 — Zakażenia łożyska naczyniowego i pałeczki niefermentujące": "🩸 Bakteriemia, wsierdzie i pałeczki niefermentujące",
    "Ćwiczenie 12 — Neuroinfekcje i neurotoksyny bakterii sporujących": "🧠 Neuroinfekcje",
    "Ćwiczenie 2 — Dezynfekcja i sterylizacja": "🔬 Podstawy mikrobiologii",
    "Ćwiczenie 3 — Diagnostyka mikrobiologiczna i patogeneza zakażeń": "🔬 Podstawy mikrobiologii",
    "Ćwiczenie 4 — Leki przeciwbakteryjne": "💊 Antybiotyki i oporność",
    "Ćwiczenie 5 — Oporność bakterii na leki przeciwbakteryjne": "💊 Antybiotyki i oporność",
    "Ćwiczenie 6 — Zakażenia skóry i tkanki podskórnej": "🧴 Zakażenia skóry",
    "Ćwiczenie 7 — Zakażenia układu oddechowego": "🫁 Zakażenia dróg oddechowych",
    "Ćwiczenie 8 — Zakażenia układu pokarmowego": "🍽️ Zakażenia przewodu pokarmowego",
    "Ćwiczenie 9 — Zakażenia układu moczowego": "🚽 Zakażenia układu moczowego",
    "Giełda z sesji 2023/2024 (mikrobiologia)": "📋 Powtórki ogólne",
};

const FIZJOPATO_THEME_ORDER = [
    "📖 Wstęp do patofizjologii",
    "❤️ Układ krążenia i EKG",
    "🫁 Układ oddechowy",
    "💧 Nerki i równowaga wodno-elektrolitowa",
    "🩸 Krew, odporność i zapalenie",
    "🦴 Endokrynologia",
    "🍽️ Przewód pokarmowy i wątroba",
    "🧠 Neurofizjologia, zmysły i ból",
    "🌡️ Metabolizm, termoregulacja i otyłość",
    "👶 Rozrodczość i ciąża",
    "🔀 Mieszane pytania powtórkowe",
];

const FIZJOPATO_THEME_MAP = {
    "Endokrynologia — Wprowadzenie": "🦴 Endokrynologia",
    "Giełda FIZJOPATO — Inne": "🔀 Mieszane pytania powtórkowe",
    "Giełda FIZJOPATO — Metabolizm i termoregulacja": "🌡️ Metabolizm, termoregulacja i otyłość",
    "Giełda FIZJOPATO — Równowaga kwasowo-zasadowa i gospodarka wodno-elektrolitowa": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Giełda FIZJOPATO — Układ Hormonalny": "🦴 Endokrynologia",
    "Giełda FIZJOPATO — Układ Immunologiczny / Krwiotwórczy": "🩸 Krew, odporność i zapalenie",
    "Giełda FIZJOPATO — Układ Krążenia": "❤️ Układ krążenia i EKG",
    "Giełda FIZJOPATO — Układ Nerwowy": "🧠 Neurofizjologia, zmysły i ból",
    "Giełda FIZJOPATO — Układ Oddechowy": "🫁 Układ oddechowy",
    "Giełda FIZJOPATO — Układ Pokarmowy": "🍽️ Przewód pokarmowy i wątroba",
    "Giełda FIZJOPATO — Układ Wydalniczy (Nerkowy)": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Giełda letni 2024/2025 — EKG": "❤️ Układ krążenia i EKG",
    "Giełda letni 2024/2025 — Fizjologia krążenia": "❤️ Układ krążenia i EKG",
    "Giełda letni 2024/2025 — Fizjologia oddechowa": "🫁 Układ oddechowy",
    "Giełda letni 2024/2025 — Fizjologia pokarmowa": "🍽️ Przewód pokarmowy i wątroba",
    "Giełda letni 2024/2025 — Krew i nerki": "🩸 Krew, odporność i zapalenie",
    "Giełda zimowy 2024/2025 — EKG I": "❤️ Układ krążenia i EKG",
    "Giełda zimowy 2024/2025 — Endokrynologia": "🦴 Endokrynologia",
    "Giełda zimowy 2024/2025 — Neurofizjologia I": "🧠 Neurofizjologia, zmysły i ból",
    "Giełda zimowy 2024/2025 — Neurofizjologia II": "🧠 Neurofizjologia, zmysły i ból",
    "Giełda z sesji 2024/2025 (Moodle, wykłady)": "🔀 Mieszane pytania powtórkowe",
    "Giełda z sesji 2024/2025 (Endokrynologia, rozwiązana)": "🦴 Endokrynologia",
    "Podręcznik patofizjologii — Anemia i policytemia": "🩸 Krew, odporność i zapalenie",
    "Podręcznik patofizjologii — Bradyarytmie": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Ból": "🧠 Neurofizjologia, zmysły i ból",
    "Podręcznik patofizjologii — Choroba niedokrwienna serca (IHD) i zawał (MI)": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Cukrzyca": "🦴 Endokrynologia",
    "Podręcznik patofizjologii — EKG: załamki, odcinki, odstępy": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Elektrofizjologia i wstęp do EKG": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Gorączka": "🌡️ Metabolizm, termoregulacja i otyłość",
    "Podręcznik patofizjologii — Jakościowe zaburzenia wentylacji": "🫁 Układ oddechowy",
    "Podręcznik patofizjologii — Miażdżyca (atherosclerosis)": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Nadciśnienie płucne": "🫁 Układ oddechowy",
    "Podręcznik patofizjologii — Nadciśnienie tętnicze": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Nadciśnienie tętnicze i śródbłonek": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Nadkrzepliwość": "🩸 Krew, odporność i zapalenie",
    "Podręcznik patofizjologii — Nadnercza i potas": "🦴 Endokrynologia",
    "Podręcznik patofizjologii — Nerki i kłębuszkowe zapalenie nerek (KZN)": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Podręcznik patofizjologii — Niedożywienie i głodzenie": "🌡️ Metabolizm, termoregulacja i otyłość",
    "Podręcznik patofizjologii — Niewydolność krążenia (duszność)": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Niewydolność krążenia (serce jako pompa)": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Niewydolność nerek": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Podręcznik patofizjologii — Niewydolność oddechowa": "🫁 Układ oddechowy",
    "Podręcznik patofizjologii — Niewydolność serca (HF)": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Obrzęk": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Otyłość": "🌡️ Metabolizm, termoregulacja i otyłość",
    "Podręcznik patofizjologii — Przewód pokarmowy": "🍽️ Przewód pokarmowy i wątroba",
    "Podręcznik patofizjologii — Przysadka i tarczyca": "🦴 Endokrynologia",
    "Podręcznik patofizjologii — Przytarczyce i wapń": "🦴 Endokrynologia",
    "Podręcznik patofizjologii — Równowaga kwasowo-zasadowa (RKZ)": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Podręcznik patofizjologii — Skazy krwotoczne": "🩸 Krew, odporność i zapalenie",
    "Podręcznik patofizjologii — Tachyarytmie i zawał": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Woda i sód": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Podręcznik patofizjologii — Wstrząs": "❤️ Układ krążenia i EKG",
    "Podręcznik patofizjologii — Wstęp do patofizjologii": "📖 Wstęp do patofizjologii",
    "Podręcznik patofizjologii — Wątroba": "🍽️ Przewód pokarmowy i wątroba",
    "Podręcznik patofizjologii — Zaburzenia wymiany gazowej": "🫁 Układ oddechowy",
    "Podręcznik patofizjologii — Zapalenie": "🩸 Krew, odporność i zapalenie",
    "Prezentacje — Czynność bioelektryczna serca (EKG)": "❤️ Układ krążenia i EKG",
    "Prezentacje — Endokrynologia (fizjologia)": "🦴 Endokrynologia",
    "Prezentacje — Fizjologia krwi": "🩸 Krew, odporność i zapalenie",
    "Prezentacje — Fizjologia układu pokarmowego": "🍽️ Przewód pokarmowy i wątroba",
    "Prezentacje — Kontrola czynności ruchowej": "🧠 Neurofizjologia, zmysły i ból",
    "Prezentacje — Medycyna snu": "🧠 Neurofizjologia, zmysły i ból",
    "Prezentacje — Mowa i pamięć": "🧠 Neurofizjologia, zmysły i ból",
    "Prezentacje — Regulacja układu krążenia": "❤️ Układ krążenia i EKG",
    "Prezentacje — Wstrząs": "❤️ Układ krążenia i EKG",
    "Skrypt fizjologii — Krew (laboratorium)": "🩸 Krew, odporność i zapalenie",
    "Skrypt fizjologii — Narządy zmysłów": "🧠 Neurofizjologia, zmysły i ból",
    "Skrypt — Ból": "🧠 Neurofizjologia, zmysły i ból",
    "Skrypt — Ciąża i laktacja": "👶 Rozrodczość i ciąża",
    "Skrypt — Czynność wątroby": "🍽️ Przewód pokarmowy i wątroba",
    "Skrypt — Elektrofizjologia i krążenie (zaawansowana)": "❤️ Układ krążenia i EKG",
    "Skrypt — Fizjologia nerek": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Skrypt — Fizjologia oddychania (zaawansowana)": "🫁 Układ oddechowy",
    "Skrypt — Fizjologia przewodu pokarmowego (zaawansowana)": "🍽️ Przewód pokarmowy i wątroba",
    "Skrypt — Fizjologia płodu i noworodka": "👶 Rozrodczość i ciąża",
    "Skrypt — Fizjologia układu krążenia": "❤️ Układ krążenia i EKG",
    "Skrypt — Hormony tarczycy": "🦴 Endokrynologia",
    "Skrypt — Insulina, glukagon, cukrzyca": "🦴 Endokrynologia",
    "Skrypt — Krew i odporność (zaawansowana)": "🩸 Krew, odporność i zapalenie",
    "Skrypt — Laboratoryjna diagnostyka krwi": "🩸 Krew, odporność i zapalenie",
    "Skrypt — Neurofizjologia I": "🧠 Neurofizjologia, zmysły i ból",
    "Skrypt — Pracownia neurofizjologiczna": "🧠 Neurofizjologia, zmysły i ból",
    "Skrypt — Pracownia układu krążenia": "❤️ Układ krążenia i EKG",
    "Skrypt — Pracownia układu oddechowego": "🫁 Układ oddechowy",
    "Skrypt — Rozrodczość kobieca": "👶 Rozrodczość i ciąża",
    "Skrypt — Rozrodczość męska": "👶 Rozrodczość i ciąża",
    "Skrypt — Równowaga kwasowo-zasadowa (zaawansowana)": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Skrypt — Termoregulacja i gorączka": "🌡️ Metabolizm, termoregulacja i otyłość",
    "Skrypt — Wywody Wody Werki": "🔀 Mieszane pytania powtórkowe",
    "Giełda z sesji 2023/2024 (semestr letni)": "🔀 Mieszane pytania powtórkowe",
    "Skrypt — Zmysł wzroku": "🧠 Neurofizjologia, zmysły i ból",
    "Skrypt — Zmysły chemiczne": "🧠 Neurofizjologia, zmysły i ból",
    "Wejściówki FIZJOPATO — Układ Krążenia": "❤️ Układ krążenia i EKG",
    "Wejściówki FIZJOPATO — Układ Oddechowy": "🫁 Układ oddechowy",
    "Wejściówki FIZJOPATO — Układ Pokarmowy": "🍽️ Przewód pokarmowy i wątroba",
    "Wykład 1 — Zmiany adaptacyjne i uszkodzenie komórki": "📖 Wstęp do patofizjologii",
    "Wykład 10 — Patofizjologia niewydolności serca": "❤️ Układ krążenia i EKG",
    "Wykład 11 — Zaburzenia rytmu serca (arytmie)": "❤️ Układ krążenia i EKG",
    "Wykład 12 — Fizjologia ciśnienia tętniczego i nadciśnienie": "❤️ Układ krążenia i EKG",
    "Wykład 13 — Miażdżyca i choroba niedokrwienna serca (IHD)": "❤️ Układ krążenia i EKG",
    "Wykład 14 — Zaburzenia wymiany gazowej": "🫁 Układ oddechowy",
    "Wykład 15 — Niewydolność oddechowa": "🫁 Układ oddechowy",
    "Wykład 16 — Jakościowe zaburzenia wentylacji (obturacja i restrykcja)": "🫁 Układ oddechowy",
    "Wykład 17 — Nadciśnienie płucne": "🫁 Układ oddechowy",
    "Wykład 18 — Patofizjologia nerek (zespoły nerkowe)": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Wykład 19 — Niewydolność nerek (AKI i przewlekła)": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Wykład 2 — Patofizjologia bólu": "🧠 Neurofizjologia, zmysły i ból",
    "Wykład 20 — Patofizjologia anemii": "🩸 Krew, odporność i zapalenie",
    "Wykład 21 — Skazy krwotoczne": "🩸 Krew, odporność i zapalenie",
    "Wykład 22 — Nadkrzepliwość i zatorowość": "🩸 Krew, odporność i zapalenie",
    "Wykład 23 — Gospodarka wodno-sodowa": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Wykład 25 — Równowaga kwasowo-zasadowa (RKZ)": "💧 Nerki i równowaga wodno-elektrolitowa",
    "Wykład 26 — Patofizjologia przysadki i tarczycy": "🦴 Endokrynologia",
    "Wykład 27 — Nadnercza i gospodarka potasowa": "🦴 Endokrynologia",
    "Wykład 28 — Przytarczyce i gospodarka wapniowa": "🦴 Endokrynologia",
    "Wykład 29 — Patologia wątroby": "🍽️ Przewód pokarmowy i wątroba",
    "Wykład 3 — Termoregulacja: gorączka i zaburzenia temperatury": "🌡️ Metabolizm, termoregulacja i otyłość",
    "Wykład 30 — Patofizjologia otyłości i niedożywienia": "🌡️ Metabolizm, termoregulacja i otyłość",
    "Wykład 31 — Patofizjologia przewodu pokarmowego": "🍽️ Przewód pokarmowy i wątroba",
    "Wykład 4 — Patofizjologia obrzęków": "❤️ Układ krążenia i EKG",
    "Wykład 5 — Patofizjologia zapalenia": "🩸 Krew, odporność i zapalenie",
    "Wykład 6 — EKG i elektryczna czynność serca": "❤️ Układ krążenia i EKG",
    "Wykład 7 — Zaburzenia rytmu i przewodzenia serca": "❤️ Układ krążenia i EKG",
    "Wykład 8 — Fizjologia rezerwy sercowej i duszności": "❤️ Układ krążenia i EKG",
    "Wykład 9 — Patofizjologia wstrząsu": "❤️ Układ krążenia i EKG",
};

// ── 8d. Mikrobiologia (mikrobiologia_cwiczenia_raw.json) - budowana krok po kroku,
// jeden temat (Ćwiczenie) na raz. Każda kategoria = "Ćwiczenie N — temat", zgodnie
// z podziałem z Regulaminu (sem. 3: Ćw. 1-6 Mikrobiologia Ogólna, sem. 4: Ćw. 7-12
// Mikrobiologia Medyczna). Notatki do czytania (mikrobiologia_notes.json) są scalane
// osobno w main() jako top-level pole `notes`, kluczowane tą samą nazwą kategorii.
function buildMikrobiologiaCwiczenia() {
    const rawPath = path.join(DIR, "mikrobiologia_cwiczenia_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[mikrobiologia] brak mikrobiologia_cwiczenia_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "mikrobiologia",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("mikrobiologia", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => {
        const theme = MIKROBIOLOGIA_THEME_MAP[cat];
        if (!theme) console.warn(`[mikrobiologia] brak tematu (theme) dla kategorii: "${cat}"`);
        return {
            label: `🦠 [Mikrobiologia] ${cat} (${count})`,
            key: cat,
            tier: null,
            subject: "mikrobiologia",
            theme: theme || null,
        };
    });
    // Dowiązanie do planu nauki NA POZIOMIE KATEGORII (nie całego tematu -
    // patrz assignStudyUnitOrdinalsByTheme: cały temat "Wirusologia" ma 12
    // wykładów, stłoczenie ich w 1 tydzień było nierealistyczne - zgłoszone
    // przez usera po obejrzeniu prototypu na żywo, 2026-07-27).
    assignStudyUnitOrdinalsByTheme(categories, MIKROBIOLOGIA_THEME_ORDER);

    return { questions: out, categories };
}

// Notatki teoretyczne ("📖 Notatki do przeczytania") per kategoria - wspólny loader dla
// wszystkich przedmiotów. Klucz w finalnym `notes` to "subject::category" (nie sama nazwa
// kategorii), żeby uniknąć kolizji, gdy różne przedmioty mają kategorię o tej samej nazwie.
function loadNotesFile(filename, subject) {
    const notesPath = path.join(DIR, filename);
    if (!fs.existsSync(notesPath)) return {};
    const raw = JSON.parse(fs.readFileSync(notesPath, "utf-8"));
    const out = {};
    for (const [category, html] of Object.entries(raw)) {
        out[`${subject}::${category}`] = html;
    }
    return out;
}

function loadMikrobiologiaNotes() {
    return loadNotesFile("mikrobiologia_notes.json", "mikrobiologia");
}

function loadFarmakologiaNotes() {
    return loadNotesFile("farmakologia_notes.json", "farmakologia");
}

function loadImmunologiaNotes() {
    return loadNotesFile("immunologia_notes.json", "immunologia");
}

function loadHistologiaNotes() {
    return loadNotesFile("histologia_notes.json", "histologia");
}

// ── 8e. Fizjologia + Patofizjologia ("Funkcjonowanie organizmu ludzkiego", sem. III-IV) -
// budowana krok po kroku jak mikrobiologia, jeden temat/wykład na raz. Kategorie:
// "Wykład N — temat" dla pytań spod wykładów (Giełdy/Pytania spod wykładów/1-31),
// oraz kategorie tematyczne ("Krążenie", "Krew", "Neurofizjologia", "Endokrynologia" itd.)
// dla skryptów, giełd zbiorczych i prezentacji.
function buildFizjopatoCwiczenia() {
    const rawPath = path.join(DIR, "fizjopato_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[fizjopato] brak fizjopato_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "fizjopato",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("fizjopato", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => {
        const theme = FIZJOPATO_THEME_MAP[cat];
        if (!theme) console.warn(`[fizjopato] brak tematu (theme) dla kategorii: "${cat}"`);
        return {
            label: `🫀 [Fizjo+Pato] ${cat} (${count})`,
            key: cat,
            tier: null,
            subject: "fizjopato",
            theme: theme || null,
        };
    });
    // Dowiązanie na poziomie kategorii, nie całego tematu - patrz komentarz w
    // buildMikrobiologiaCwiczenia() powyżej (ten sam problem: "Układ krążenia
    // i EKG" ma 33 kategorie, cały temat w 1 tygodniu byłby absurdalny).
    assignStudyUnitOrdinalsByTheme(categories, FIZJOPATO_THEME_ORDER);

    return { questions: out, categories };
}

// Kolejność "stacji" WdNK do dowiązania z planem nauki (patrz Plan rozbudowy
// apki.md / study_plan.js resolveTodaySessionTarget) - analogicznie do
// HISTOLOGIA_TOPICS (1 kategoria = 1 tydzień). UWAGA: kolejność jest MOIM
// założeniem dydaktycznym (ogólne badanie -> specjalistyczne -> proceduralne
// -> myślenie kliniczne na koniec), nie potwierdzonym realnym sylabusem WdNK -
// do poprawy, jeśli user zna faktyczną kolejność zajęć.
const WDNK_TOPIC_ORDER = [
    "Wywiad lekarski",
    "Badanie klatki piersiowej",
    "Badanie brzucha",
    "Badanie narządu ruchu",
    "Badanie neurologiczne",
    "Badanie dna oka",
    "Laryngologia",
    "Dermatologia",
    "Badanie ginekologiczne",
    "EKG i mierzenie ciśnienia",
    "Kaniulacja naczyń, iniekcje i desmurgia",
    "Cewnikowanie i per rectum",
    "Szycie chirurgiczne",
    "Myślenie kliniczne",
];

// ── 8f. Wstęp do nauk klinicznych (wdnk_raw.json) - nowy przedmiot, budowany
// stacja po stacji (badanie brzucha, dna oka, ginekologiczne, klatki piersiowej,
// neurologiczne, cewnikowanie/per rectum, dermatologia, EKG/ciśnienie, kaniulacja/
// iniekcje/desmurgia, laryngologia, myślenie kliniczne, szycie chirurgiczne,
// wywiad lekarski) na podstawie "Opracowana_giełda_WDNK_2021_dla_leniwych.pdf".
// Tylko 13 kategorii (stacji) - nie wymaga warstwy "temat" jak fizjopato/mikrobiologia.
function buildWdnk() {
    const rawPath = path.join(DIR, "wdnk_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[wdnk] brak wdnk_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "wdnk",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("wdnk", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => {
        const c = {
            label: `🩺 [WdNK] ${cat} (${count})`,
            key: cat,
            tier: null,
            subject: "wdnk",
        };
        const topicIdx = WDNK_TOPIC_ORDER.indexOf(cat);
        if (topicIdx !== -1) c.studyUnit = { ordinal: topicIdx + 1 };
        return c;
    });

    return { questions: out, categories };
}

// Kolejność tematów MSN do dowiązania z planem nauki - w przeciwieństwie do
// WDNK_TOPIC_ORDER ta kolejność jest DOBRZE uzasadniona samą naturą materiału:
// drogi oddechowe/uraz jako fundament -> progresja BLS -> ALS -> PALS -> NLS
// (dokładnie kolejność złożoności resuscytacji) -> opieka po resuscytacji ->
// pierwsza pomoc (podstawy, zwykle powtórka) -> sytuacje szczególne na koniec
// (wymagają znajomości wszystkiego wcześniejszego).
const MSN_TOPIC_ORDER = [
    "Udrażnianie dróg oddechowych i tlenoterapia",
    "Postępowanie urazowe",
    "BLS — Podstawowe zabiegi resuscytacyjne",
    "ALS — Zaawansowane zabiegi resuscytacyjne",
    "PALS — Zabiegi resuscytacyjne u dzieci",
    "NLS — Resuscytacja noworodka",
    "Opieka poresuscytacyjna",
    "Pierwsza pomoc",
    "Sytuacje szczególne w resuscytacji",
];

// ── 8g. Medycyna stanów nagłych (msn_raw.json) - nowy przedmiot, budowany
// stacja po stacji (drogi oddechowe/tlenoterapia, postępowanie urazowe, BLS, ALS,
// PALS, NLS, sytuacje szczególne, opieka poresuscytacyjna, pierwsza pomoc) na
// podstawie skryptu egzaminacyjnego, wejściówek i wytycznych ERC 2021.
function buildMsn() {
    const rawPath = path.join(DIR, "msn_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[msn] brak msn_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "msn",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("msn", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => {
        const c = {
            label: `🚑 [MSN] ${cat} (${count})`,
            key: cat,
            tier: null,
            subject: "msn",
        };
        const topicIdx = MSN_TOPIC_ORDER.indexOf(cat);
        if (topicIdx !== -1) c.studyUnit = { ordinal: topicIdx + 1 };
        return c;
    });

    return { questions: out, categories };
}

// ── 8h. Fakultety (fakultety_raw.json) - zbiorczy "przedmiot" na krótkie
// fakultatywne mini-kursy Roku 2/3 (np. Diagnostyka Tarczycy), każdy jako
// osobna kategoria - analogicznie do WdNK/MSN, ale bez podziału na stacje.
function buildFakultety() {
    const rawPath = path.join(DIR, "fakultety_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[fakultety] brak fakultety_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "fakultety",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("fakultety", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `🎓 [Fakultety] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "fakultety",
    }));

    return { questions: out, categories };
}

// ── 8h2. Socjologia (socjologia_raw.json) - nowy przedmiot Roku 2 (Kompetencje
// generyczne w medycynie), zbudowany od zera z prawdziwych artykułów naukowych
// (Wójcik-Żołądek, Tarkowska, Pospiszyl i in.) - wzorzec identyczny jak Fakultety.
function buildSocjologia() {
    const rawPath = path.join(DIR, "socjologia_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[socjologia] brak socjologia_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "socjologia",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("socjologia", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `👥 [Socjologia] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "socjologia",
    }));

    return { questions: out, categories };
}

// ── 8i. Patologia (Rok 3) - patologia_raw.json - na razie talia Anki "Leśniowski
// Korn; reszta z przewodu pokarmowego" (Robbins), tryb typed (gęste notatki
// własne, nie nadają się do ABCDE bez utraty treści).
function buildPatologia() {
    const rawPath = path.join(DIR, "patologia_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[patologia] brak patologia_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "patologia",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("patologia", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `🩸 [Patologia] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "patologia",
    }));

    return { questions: out, categories };
}

// ── 8j. Medycyna sądowa i patologia sekcyjna (Rok 3) - medycyna_sadowa_raw.json -
// talia Anki "3-ROK Medycyna Sądowa: giełda - pytania studenckie", sparsowana z
// oryginalnych ABCDE (realne dystraktory z prawdziwej giełdy, nie generowane).
function buildMedycynaSadowa() {
    const rawPath = path.join(DIR, "medycyna_sadowa_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[medycyna_sadowa] brak medycyna_sadowa_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "medycyna_sadowa",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("medycyna_sadowa", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `⚖️ [Med. sądowa] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "medycyna_sadowa",
    }));

    return { questions: out, categories };
}

// ── 8j2. Generyczny loader dla osieroconych talii Anki (front/back/category,
// opcjonalnie rationale) - dystraktory losowane z INNYCH fiszek tej samej
// kategorii (ten sam mechanizm co buildAngielski/buildAngielski2). Używany do
// domineowania mikrobiologia_anki_raw.json / patologia_anki_raw.json /
// medycyna_sadowa_anki_raw.json, które istniały na dysku, ale nie były
// dotąd wpięte do żadnego build*() - stąd 0 pytań z nich w questions.json.
function buildAnkiFrontBack(rawFilename, subject, labelPrefix) {
    const rawPath = path.join(DIR, rawFilename);
    if (!fs.existsSync(rawPath)) {
        console.warn(`[${subject}] brak ${rawFilename} - pomijam`);
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const byCategory = new Map();
    raw.forEach(n => {
        if (!byCategory.has(n.category)) byCategory.set(n.category, []);
        byCategory.get(n.category).push(n);
    });

    const out = [];
    for (const [category, notes] of byCategory) {
        const allBacks = notes.map(n => n.back);
        notes.forEach(n => {
            const seed = fnv1a(n.front + "||" + n.back);
            const others = allBacks.filter(b => b !== n.back);
            const distractors = seededShuffle(others, seed).slice(0, 4);
            const options = seededShuffle([n.back, ...distractors], seed);
            const question = {
                subject,
                category,
                tier: null,
                q: n.front,
                a: options.indexOf(n.back),
                o: options,
                img: null,
            };
            if (n.rationale) question.rationale = n.rationale;
            question.id = makeQuestionId(subject, question.q, question.o);
            out.push(question);
        });
    }

    const byCategoryCount = new Map();
    out.forEach(q => byCategoryCount.set(q.category, (byCategoryCount.get(q.category) || 0) + 1));
    const categories = [...byCategoryCount.entries()].map(([cat, count]) => ({
        label: `${labelPrefix} ${cat} (${count})`,
        key: cat,
        tier: null,
        subject,
    }));

    return { questions: out, categories };
}

// ── 8k. Diagnostyka laboratoryjna (Rok 3) - diagnostyka_lab_raw.json - nowy
// przedmiot budowany od zera: giełdy tegoroczne (zima/lato) + zrzuty ekranu
// ocenionych quizów Google Forms (Kraszula/Pietruczuk) z własnego folderu.
function buildDiagnostykaLab() {
    const rawPath = path.join(DIR, "diagnostyka_lab_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[diagnostyka_lab] brak diagnostyka_lab_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "diagnostyka_lab",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("diagnostyka_lab", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `🔬 [Diag. lab.] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "diagnostyka_lab",
    }));

    return { questions: out, categories };
}

// ── 8l. Genetyka kliniczna (Rok 3) - genetyka_raw.json - nowy przedmiot budowany
// od zera: giełda "zaliczenie końcowe" (wiele terminów w roku) + GIEŁDY
// TEGOROCZNE/Genetyka (EGZAMIN 18.06.2026, 2 tury) - recall studencki.
function buildGenetyka() {
    const rawPath = path.join(DIR, "genetyka_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[genetyka] brak genetyka_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "genetyka",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("genetyka", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `🧬 [Genetyka] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "genetyka",
    }));

    return { questions: out, categories };
}

// ── 8m. Immunologia (Rok 2, przesunięta z Roku 3 w siatce programowej) - immunologia_raw.json - nowy przedmiot budowany od
// zera: giełda "I Termin II ROK" (realne ABCDE z opcjami) + GIEŁDY TEGOROCZNE/
// Immunologia (2 egzaminy pisemne, recall studencki - wybrano tylko pewne pozycje).
// Kolejność tematów immunologii do dowiązania z planem nauki - standardowa
// sekwencja dydaktyczna kursu immunologii: mechanizmy podstawowe (wrodzona,
// dopełniacz, rozwój limfocytów, MHC, receptory/przeciwciała, aktywacja T,
// subpopulacje, cytokiny, cytotoksyczność) -> tematy kliniczne/aplikacyjne
// (szczepionki, pamięć/autoimmunizacja, nadwrażliwość, alergologia, niedobory,
// transplantologia, nowotwory, ciąża, transfuzjologia, leki biologiczne).
// Kolejność MOJA (nie potwierdzona sylabusem) - do poprawy w razie potrzeby.
const IMMUNOLOGIA_TOPIC_ORDER = [
    "Odporność wrodzona — receptory i mediatory",
    "Dopełniacz",
    "Rozwój i selekcja limfocytów",
    "MHC i prezentacja antygenu",
    "Przeciwciała i receptory limfocytów (BCR/TCR)",
    "Przeciwciała — budowa i różnorodność",
    "Aktywacja limfocytów T",
    "Subpopulacje limfocytów i komórki NK",
    "Komórki układu odpornościowego i markery CD",
    "Cytokiny",
    "Cytotoksyczność komórkowa i mechanizmy efektorowe",
    "Odporność przeciwzakaźna i szczepionki",
    "Pamięć immunologiczna i autoimmunizacja",
    "Reakcje nadwrażliwości",
    "Alergologia",
    "Pierwotne niedobory odporności",
    "Transplantologia",
    "Immunologia nowotworów",
    "Immunologia ciąży",
    "Transfuzjologia i konflikt serologiczny",
    "Leki biologiczne i immunosupresyjne",
];

function buildImmunologia() {
    const rawPath = path.join(DIR, "immunologia_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[immunologia] brak immunologia_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "immunologia",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("immunologia", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => {
        const c = {
            label: `🧫 [Immunologia] ${cat} (${count})`,
            key: cat,
            tier: null,
            subject: "immunologia",
        };
        const topicIdx = IMMUNOLOGIA_TOPIC_ORDER.indexOf(cat);
        if (topicIdx !== -1) c.studyUnit = { ordinal: topicIdx + 1 };
        return c;
    });

    return { questions: out, categories };
}

// ── 8n. Radiologia (Rok 3) - radiologia_raw.json - nowy przedmiot budowany od
// zera: "Radiologia-giełda-z-zaliczeń-semestralnych" (bogaty tekstowy bank pytań,
// pominięto pytania czysto obrazkowe bez załączonych obrazów) + GIEŁDY TEGOROCZNE/
// Radiologia (4 egzaminy, w większości potwierdzają tę samą pulę). Duży plik
// "5 rok - TESTER Radiologia" (849 pytań, całkowicie obrazkowy quiz RTG/TK/MRI)
// NIE wykorzystany - wymaga osobnej rundy z wizualnym przeglądem obrazów.
function buildRadiologia() {
    const rawPath = path.join(DIR, "radiologia_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[radiologia] brak radiologia_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "radiologia",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("radiologia", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `🩻 [Radiologia] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "radiologia",
    }));

    return { questions: out, categories };
}

// ── 8o. Propedeutyka chorób wewnętrznych (Rok 3) - propedeutyka_cw_raw.json -
// nowy przedmiot budowany od zera: giełdy tegoroczne (wejściówka + zaliczenie
// końcowe) - bogaty recall z wielu terminów/grup w ciągu roku.
function buildPropedeutykaCw() {
    const rawPath = path.join(DIR, "propedeutyka_cw_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[propedeutyka_cw] brak propedeutyka_cw_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "propedeutyka_cw",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("propedeutyka_cw", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `🫀 [Prop. chorób wewn.] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "propedeutyka_cw",
    }));

    return { questions: out, categories };
}

// ── 8p. Propedeutyka onkologii (Rok 3) - propedeutyka_onko_raw.json - nowy
// przedmiot budowany od zera: GIEŁDY TEGOROCZNE/Propedeutyka onkologii (2
// egzaminy). Własny folder przedmiotu ma tylko prezentacje wykładowe.
function buildPropedeutykaOnko() {
    const rawPath = path.join(DIR, "propedeutyka_onko_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[propedeutyka_onko] brak propedeutyka_onko_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "propedeutyka_onko",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("propedeutyka_onko", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `🦞 [Prop. onkologii] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "propedeutyka_onko",
    }));

    return { questions: out, categories };
}

// ── 8q. Propedeutyka pediatrii (Rok 3) - propedeutyka_ped_raw.json - nowy
// przedmiot budowany od zera: GIEŁDY TEGOROCZNE/Pediatria (2 egzaminy zima+lato).
function buildPropedeutykaPed() {
    const rawPath = path.join(DIR, "propedeutyka_ped_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[propedeutyka_ped] brak propedeutyka_ped_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "propedeutyka_ped",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("propedeutyka_ped", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `👶 [Prop. pediatrii] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "propedeutyka_ped",
    }));

    return { questions: out, categories };
}

// ── 8r. Farmakologia (Rok 3) - farmakologia_raw.json - nowy przedmiot, pierwsza
// runda: GIEŁDY TEGOROCZNE/Farmakologia/Teoria (1 egzamin, bardzo bogaty, 2 tury).
// Pominięto świadomie KOLOKWIA/Oficyny z własnego folderu (administracyjne Q&A o
// zasadach pisania recept na tym kursie, nie portable wiedza farmakologiczna) oraz
// PODRĘCZNIKI/SKRYPTY (>1,3GB, prawdopodobnie zeskanowane/komercyjne - do
// osobnej rundy z przeglądem wizualnym). Pozostaje jeszcze ~14 innych egzaminów
// z GIEŁDY TEGOROCZNE/Farmakologia (kolokwia I-IV, oficyny, obie sesje) do
// wykorzystania w kolejnych rundach.
function buildFarmakologia() {
    const rawPath = path.join(DIR, "farmakologia_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[farmakologia] brak farmakologia_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "farmakologia",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("farmakologia", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `💊 [Farmakologia] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "farmakologia",
    }));

    return { questions: out, categories };
}

// ── 8s. Propedeutyka psychiatrii (Rok 3) - propedeutyka_psych_raw.json - nowy
// przedmiot budowany od zera: własny plik "zaliczenie 2025_2026.docx" (recall
// z wielu grup/terminów, część potwierdzona pełnym kluczem odpowiedzi).
function buildPropedeutykaPsych() {
    const rawPath = path.join(DIR, "propedeutyka_psych_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[propedeutyka_psych] brak propedeutyka_psych_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "propedeutyka_psych",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("propedeutyka_psych", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `🧠 [Prop. psychiatrii] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "propedeutyka_psych",
    }));

    return { questions: out, categories };
}

// ── 8t. Propedeutyka chirurgii (Rok 3) - propedeutyka_chir_raw.json - nowy
// przedmiot, bardzo mały (1 skromny plik źródłowy) - talia startowa.
function buildPropedeutykaChir() {
    const rawPath = path.join(DIR, "propedeutyka_chir_raw.json");
    if (!fs.existsSync(rawPath)) {
        console.warn("[propedeutyka_chir] brak propedeutyka_chir_raw.json - pomijam");
        return { questions: [], categories: [] };
    }
    const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const out = raw.map(item => {
        const isTyped = item.mode === "typed";
        const question = {
            subject: "propedeutyka_chir",
            category: item.category,
            tier: null,
            q: item.q,
            a: isTyped ? 0 : item.a,
            o: isTyped ? [item.answers[0]] : item.o,
            img: null,
        };
        if (isTyped) {
            question.mode = "typed";
            question.answers = item.answers;
        }
        if (item.rationale) question.rationale = item.rationale;
        question.id = makeQuestionId("propedeutyka_chir", question.q, question.o);
        return question;
    });

    const byCategory = new Map();
    out.forEach(q => byCategory.set(q.category, (byCategory.get(q.category) || 0) + 1));
    const categories = [...byCategory.entries()].map(([cat, count]) => ({
        label: `🪒 [Prop. chirurgii] ${cat} (${count})`,
        key: cat,
        tier: null,
        subject: "propedeutyka_chir",
    }));

    return { questions: out, categories };
}

// ── 9. Metadane przedmiotów (rok studiów) - do grupowania kategorii w UI wg profilu użytkownika ──
const SUBJECTS = [
    { key: "anatomia", year: 1 },
    { key: "histologia", year: 1, themeOrder: HISTOLOGIA_THEME_ORDER },
    { key: "biochemia", year: 1 },
    { key: "ebm", year: 1 },
    { key: "historia_medycyny", year: 1 },
    { key: "angielski", year: 1 },
    { key: "angielski_2", year: 2 },
    { key: "mikrobiologia", year: 2, themeOrder: MIKROBIOLOGIA_THEME_ORDER },
    { key: "fizjopato", year: 2, themeOrder: FIZJOPATO_THEME_ORDER },
    { key: "wdnk", year: 2 },
    { key: "msn", year: 2 },
    { key: "fakultety", year: 2 },
    { key: "socjologia", year: 2 },
    { key: "patologia", year: 3 },
    { key: "medycyna_sadowa", year: 3 },
    { key: "diagnostyka_lab", year: 3 },
    { key: "genetyka", year: 3 },
    { key: "immunologia", year: 2 },
    { key: "radiologia", year: 3 },
    { key: "propedeutyka_cw", year: 3 },
    { key: "propedeutyka_onko", year: 3 },
    { key: "propedeutyka_ped", year: 3 },
    { key: "farmakologia", year: 3 },
    { key: "propedeutyka_psych", year: 3 },
    { key: "propedeutyka_chir", year: 3 },
];

// ── 10. Scalenie + walidacja + zapis ──
function main() {
    const anat = buildAnatomia();
    const hist = buildHistologia();
    const histPrakt = buildHistologiaPraktyczny();
    hist.questions.push(...histPrakt.questions);
    hist.categories.push(...histPrakt.categories);
    const bioch = buildBiochemia();
    const ebm = buildEbm();
    const histMed = buildHistoriaMedycyny();
    const ang = buildAngielski();
    const angCw = buildAngielskiCwiczenia();
    const ang2 = buildAngielski2();
    const ang2Cw = buildAngielski2Cwiczenia();
    const mikro = buildMikrobiologiaCwiczenia();
    const mikroAnki = buildAnkiFrontBack("mikrobiologia_anki_raw.json", "mikrobiologia", "🦠 [Mikrobiologia]");
    mikro.questions.push(...mikroAnki.questions);
    mikro.categories.push(...mikroAnki.categories.map(c => ({ ...c, theme: null })));
    const fizjopato = buildFizjopatoCwiczenia();
    const wdnk = buildWdnk();
    const msn = buildMsn();
    const fakultety = buildFakultety();
    const socjologia = buildSocjologia();
    const patologia = buildPatologia();
    const patologiaAnki = buildAnkiFrontBack("patologia_anki_raw.json", "patologia", "🩸 [Patologia]");
    patologia.questions.push(...patologiaAnki.questions);
    patologia.categories.push(...patologiaAnki.categories);
    const medycynaSadowa = buildMedycynaSadowa();
    const medycynaSadowaAnki = buildAnkiFrontBack("medycyna_sadowa_anki_raw.json", "medycyna_sadowa", "⚖️ [Med. sądowa]");
    medycynaSadowa.questions.push(...medycynaSadowaAnki.questions);
    medycynaSadowa.categories.push(...medycynaSadowaAnki.categories);
    const diagnostykaLab = buildDiagnostykaLab();
    const genetyka = buildGenetyka();
    const immunologia = buildImmunologia();
    const radiologia = buildRadiologia();
    const propedeutykaCw = buildPropedeutykaCw();
    const propedeutykaOnko = buildPropedeutykaOnko();
    const propedeutykaPed = buildPropedeutykaPed();
    const farmakologia = buildFarmakologia();
    const propedeutykaPsych = buildPropedeutykaPsych();
    const propedeutykaChir = buildPropedeutykaChir();

    const allQuestions = [...anat.questions, ...hist.questions, ...bioch.questions, ...ebm.questions, ...histMed.questions, ...ang.questions, ...angCw.questions, ...ang2.questions, ...ang2Cw.questions, ...mikro.questions, ...fizjopato.questions, ...wdnk.questions, ...msn.questions, ...fakultety.questions, ...socjologia.questions, ...patologia.questions, ...medycynaSadowa.questions, ...diagnostykaLab.questions, ...genetyka.questions, ...immunologia.questions, ...radiologia.questions, ...propedeutykaCw.questions, ...propedeutykaOnko.questions, ...propedeutykaPed.questions, ...farmakologia.questions, ...propedeutykaPsych.questions, ...propedeutykaChir.questions];
    const allCategories = [...anat.categories, ...hist.categories, ...bioch.categories, ...ebm.categories, ...histMed.categories, ...ang.categories, ...angCw.categories, ...ang2.categories, ...ang2Cw.categories, ...mikro.categories, ...fizjopato.categories, ...wdnk.categories, ...msn.categories, ...fakultety.categories, ...socjologia.categories, ...patologia.categories, ...medycynaSadowa.categories, ...diagnostykaLab.categories, ...genetyka.categories, ...immunologia.categories, ...radiologia.categories, ...propedeutykaCw.categories, ...propedeutykaOnko.categories, ...propedeutykaPed.categories, ...farmakologia.categories, ...propedeutykaPsych.categories, ...propedeutykaChir.categories];
    const allNotes = {
        ...loadMikrobiologiaNotes(),
        ...loadFarmakologiaNotes(),
        ...loadImmunologiaNotes(),
        ...loadHistologiaNotes(),
    };

    // Duplikaty id: dozwolone tylko gdy treść (q+o) jest identyczna (zamierzony content-duplicate
    // między kategoriami, np. T4/T5 w anatomii). Prawdziwa kolizja hashu -> dopisz suffix.
    const byId = new Map();
    let collisions = 0;
    for (const item of allQuestions) {
        const existing = byId.get(item.id);
        if (!existing) {
            byId.set(item.id, item);
            continue;
        }
        // Porównuj po tej samej normalizacji, której użył makeQuestionId (numeracja/whitespace
        // nie liczą się do treści) - inaczej ten sam content z innym numerkiem/spacją fałszywie
        // wygląda na "kolizję hashu", a to zamierzony duplikat między kategoriami.
        const norm = (q, o) => normalizeText(q) + "||" + o.map(x => x.trim()).join("|");
        const sameContent = norm(existing.q, existing.o) === norm(item.q, item.o);
        if (!sameContent) {
            collisions++;
            let suffix = 2;
            let newId = `${item.id}_c${suffix}`;
            while (byId.has(newId)) { suffix++; newId = `${item.id}_c${suffix}`; }
            console.warn(`[kolizja hashu] "${item.id}" -> "${newId}" (różna treść, ta sama suma FNV1a)`);
            item.id = newId;
            byId.set(newId, item);
        }
    }

    const { valid, errors } = validateQuestions(allQuestions);
    // Duplikaty id o identycznej treści to oczekiwane zachowanie - odfiltruj je z listy błędów.
    const realErrors = errors.filter(e => !e.includes("duplikat id"));
    if (realErrors.length) {
        console.error("Błędy walidacji:");
        realErrors.forEach(e => console.error("  " + e));
        process.exit(1);
    }

    const summary = {};
    for (const q of allQuestions) {
        summary[q.subject] = summary[q.subject] || {};
        summary[q.subject][q.category] = (summary[q.subject][q.category] || 0) + 1;
    }
    console.log("=== Podsumowanie ===");
    for (const [subject, cats] of Object.entries(summary)) {
        const total = Object.values(cats).reduce((a, b) => a + b, 0);
        console.log(`${subject}: ${total} pytań, ${Object.keys(cats).length} kategorii`);
    }
    console.log(`Łącznie: ${allQuestions.length} pytań, kolizji hashu: ${collisions}`);

    fs.writeFileSync(
        path.join(DIR, "questions.json"),
        JSON.stringify({ questions: allQuestions, categories: allCategories, subjects: SUBJECTS, notes: allNotes })
    );
    console.log("Zapisano questions.json");
}

main();
