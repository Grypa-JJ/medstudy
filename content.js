// content.js
// Leniwe ładowanie TREŚCI pytań (q/o/a/rationale/mode/answers) z Supabase,
// chronionej RLS (patrz supabase_schema_questions.sql - tylko zalogowani).
// `img` NIE jest tu pobierany - zostaje jawny w meta.json (duże base64, do
// ~700KB/pytanie, psuły CSV-import do Supabase; zdjęcie samo w sobie nie jest
// kluczem odpowiedzi) i jest już obecny w "lekkim" rekordzie od razu po
// wczytaniu meta.json.
// `questions` (globalna tablica z index.html) zaczyna życie jako "lekkie"
// rekordy z meta.json (id/subject/category/tier/img, bez q/o/a/rationale) -
// ta funkcja dogrywa resztę treści in-place, żeby cała reszta appki
// (renderQuestions, fiszki, egzamin, retry...) mogła dalej czytać
// qData.q/.o/.a/.rationale bez zmian.
//
// WAŻNE: to samo `id` (ten sam hash subject+q+o) może wystąpić pod wieloma
// kategoriami w `questions` (giełda x2, T4/T5 w anatomii itd.) - stąd
// `idToIndices` (id -> tablica WSZYSTKICH indeksów w `questions` z tym id),
// budowane raz po wczytaniu meta.json, żeby jedno pobranie treści zasiliło
// każde wystąpienie.

let idToIndices = new Map();
const _loadedContentIds = new Set();

// Wywołać raz, zaraz po ustawieniu globalnej `questions` z meta.json.
function buildIdIndex() {
    idToIndices = new Map();
    questions.forEach((q, i) => {
        let arr = idToIndices.get(q.id);
        if (!arr) { arr = []; idToIndices.set(q.id, arr); }
        arr.push(i);
    });
}

function _chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

// Pobiera i dogrywa treść dla podanych id (duplikaty i już-załadowane pomijane
// automatycznie). Zwraca Promise<void> - czeka aż WSZYSTKIE potrzebne fetch'e
// się skończą. Bezpieczne do wywołania wielokrotnie/równolegle dla tych samych id.
async function ensureContentLoaded(ids) {
    const need = [...new Set(ids)].filter(id => id != null && !_loadedContentIds.has(id));
    if (!need.length) return;

    const CHUNK_SIZE = 1000; // mieści się pod domyślnym limitem PostgREST (1000 wierszy/zapytanie)
    const chunks = _chunk(need, CHUNK_SIZE);

    const results = await Promise.all(chunks.map(chunk =>
        sb.from("questions").select("id,q,o,a,rationale,mode,answers").in("id", chunk)
    ));

    for (const res of results) {
        if (res.error) {
            console.error("Nie udało się pobrać treści pytań:", res.error.message);
            continue; // pozostałe chunki i tak próbujemy zastosować
        }
        for (const row of res.data) {
            const indices = idToIndices.get(row.id);
            if (!indices) continue; // nie powinno się zdarzyć, ale nie wywalaj appki
            for (const i of indices) {
                const target = questions[i];
                target.q = row.q;
                target.o = row.o;
                target.a = row.a;
                // target.img NIE jest tu dotykany - już jest ustawiony z meta.json.
                target.rationale = row.rationale ?? undefined;
                if (row.mode) target.mode = row.mode;
                if (row.answers) target.answers = row.answers;
            }
            _loadedContentIds.add(row.id);
        }
    }

    const missing = need.filter(id => !_loadedContentIds.has(id));
    if (missing.length) {
        console.error(`Treść ${missing.length}/${need.length} pytań nie została załadowana (błąd sieci/RLS?).`, missing.slice(0, 5));
    }
}

if (typeof module !== "undefined") {
    module.exports = { buildIdIndex, ensureContentLoaded };
}
