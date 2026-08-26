// split_meta_and_export_csv.mjs
// Jednorazowy (ale nadpisywalny - uruchamiać po każdej zmianie w questions.json)
// skrypt: rozdziela questions.json na:
//   1. meta.json - te same subjects/categories/notes + questions BEZ pól
//      q/o/a/rationale (klucz odpowiedzi), tylko id/subject/category/tier/img.
//      Bezpieczne do publikacji jako statyczny plik na Netlify - NIE zdradza
//      treści pytań/odpowiedzi (to jest chronione). `img` (zdjęcia do
//      rozpoznawania struktur w anatomii) ZOSTAJE tutaj jawnie - zdjęcie samo
//      w sobie nie jest kluczem odpowiedzi, a próba przepchnięcia dużych
//      base64 (do ~700KB/pytanie) przez CSV-importer Supabase Table Editor
//      okazała się w praktyce zawieszać import (duże pojedyncze komórki),
//      więc świadomie zostają jawne - to akceptowalny kompromis.
//   2. csv/questions_NN.csv - TYLKO klucz odpowiedzi (id,q,o,a,rationale,mode,
//      answers - BEZ img), DEDUPLIKOWANA po `id` (to samo pytanie - ten sam
//      hash subject+q+o - bywa wielokrotnie pod różnymi kategoriami, np.
//      giełda x2, T4/T5 w anatomii; 6287 z 20768 unikalnych id ma >1
//      wystąpienie w questions.json - treść jest ta sama, więc trzymamy ją
//      RAZ, a przynależność do kategorii zostaje w meta.json), podzielona wg
//      ROZMIARU (nie liczby wierszy) żeby dało się wygodnie zaimportować przez
//      Supabase Dashboard -> Table Editor -> questions -> Insert -> Import
//      data from CSV (osobno dla każdego pliku, append).
//
// Uruchomienie: node split_meta_and_export_csv.mjs (po node build_questions.mjs)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(DIR, "questions.json"), "utf-8"));

// ── 1. meta.json ──
const metaQuestions = data.questions.map(q => ({
    id: q.id,
    subject: q.subject,
    category: q.category,
    tier: q.tier ?? null,
    img: q.img ?? null,
}));
const meta = {
    questions: metaQuestions,
    categories: data.categories,
    subjects: data.subjects,
    notes: data.notes,
};
fs.writeFileSync(path.join(DIR, "meta.json"), JSON.stringify(meta));
console.log(`meta.json: ${metaQuestions.length} pytań (bez treści), zapisano.`);

// ── 2. CSV per przedmiot ──
function csvEscape(val) {
    if (val === null || val === undefined) return "";
    const s = typeof val === "string" ? val : JSON.stringify(val);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}

const csvDir = path.join(DIR, "csv");
fs.rmSync(csvDir, { recursive: true, force: true });
fs.mkdirSync(csvDir, { recursive: true });

// Deduplikacja po `id` - pierwsze wystąpienie wygrywa (przy 327/20768 id treść
// różni się kosmetycznie tylko wiodącym numerkiem pytania "N. " w `q`, bo to
// samo pytanie trafiło z różnych źródłowych numeracji - nieistotne dla
// wyświetlania, `normalizeText` używane przy hashowaniu id i tak to ignoruje).
const byId = new Map();
for (const q of data.questions) {
    if (!byId.has(q.id)) byId.set(q.id, q);
}
console.log(`Deduplikacja: ${data.questions.length} wystąpień -> ${byId.size} unikalnych id.`);

// UWAGA: nie wszystkie pytania to klasyczne ABCDE (5 opcji) - część (np. część
// angielskiego, "wpisywana odpowiedź") ma mode:"typed" + dodatkowe pole
// `answers` (lista akceptowanych odpowiedzi), a `o` bywa wtedy krótsze niż 5.
// Oba pola muszą jechać do CSV, inaczej tryb typed straci dane po migracji.
const header = "id,q,o,a,rationale,mode,answers";

// Dzielenie WEDŁUG ROZMIARU (bajtów), nie stałej liczby wierszy - pytania z
// obrazkami (base64, do ~700KB/pytanie w anatomii) są rozłożone nierówno w
// danych, więc stały CHUNK_SIZE dawał pliki od 650KB do 9,2MB i importer w
// Supabase Table Editor zawieszał się na największym z nich (dużo obrazków
// naraz w jednym pliku). Cel: każdy plik ~1.5MB, żeby import był przewidywalny
// niezależnie od tego, ile obrazków akurat wypadło w danym zakresie.
const TARGET_BYTES = 1_500_000;
const allRows = [...byId.values()];

function rowLine(q) {
    return [
        csvEscape(q.id),
        csvEscape(q.q),
        csvEscape(JSON.stringify(q.o)),
        csvEscape(q.a),
        csvEscape(q.rationale ?? ""),
        csvEscape(q.mode ?? ""),
        csvEscape(q.answers ? JSON.stringify(q.answers) : ""),
    ].join(",");
}

let fileIdx = 0;
let lines = [header];
let currentBytes = Buffer.byteLength(header, "utf-8");
let rowsInFile = 0;

function flush() {
    if (rowsInFile === 0) return;
    fileIdx++;
    const outPath = path.join(csvDir, `questions_${String(fileIdx).padStart(2, "0")}.csv`);
    fs.writeFileSync(outPath, lines.join("\n"), "utf-8");
    console.log(`csv/questions_${String(fileIdx).padStart(2, "0")}.csv: ${rowsInFile} wierszy, ${(currentBytes / 1024).toFixed(0)}KB`);
    lines = [header];
    currentBytes = Buffer.byteLength(header, "utf-8");
    rowsInFile = 0;
}

for (const q of allRows) {
    const line = rowLine(q);
    const lineBytes = Buffer.byteLength(line, "utf-8") + 1; // +1 za \n
    // Pojedynczy wiersz WIĘKSZY niż cały limit (rzadkie, ale zdarza się przy
    // pytaniach z >1 dużym obrazkiem) dostaje WŁASNY plik zamiast psuć bieżący.
    if (rowsInFile > 0 && currentBytes + lineBytes > TARGET_BYTES) flush();
    lines.push(line);
    currentBytes += lineBytes;
    rowsInFile++;
}
flush();

console.log(`Łącznie ${allRows.length} unikalnych wierszy w ${fileIdx} plikach CSV (folder csv/).`);
