// id-utils.js
// Deterministyczne ID pytań. Ten sam algorytm co w id_utils.py (Python),
// żeby ID liczone offline (przy migracji bazy) i w przeglądarce się zgadzały.

const SUBJECT_PREFIX = {
    anatomia: "anat",
    histologia: "hist",
    biochemia: "bioch",
    ebm: "ebm",
    historia_medycyny: "hmed",
    angielski_2: "ang2",
    mikrobiologia: "mikro",
};

function normalizeText(s) {
    return s
        .replace(/^\s*\d+\.\s*/, "")   // usuń numerację "123. " z początku
        .trim()
        .replace(/\s+/g, " ");
}

// FNV-1a 32-bit nad bajtami UTF-8 (TextEncoder), żeby wynik był identyczny
// z Pythonem (s.encode('utf-8')) niezależnie od polskich znaków diakrytycznych.
function fnv1a(str) {
    const bytes = new TextEncoder().encode(str);
    let h = 0x811c9dc5;
    for (let i = 0; i < bytes.length; i++) {
        h ^= bytes[i];
        h = Math.imul(h, 0x01000193) >>> 0;
    }
    return (h >>> 0).toString(16).padStart(8, "0");
}

function makeQuestionId(subject, q, o) {
    const prefix = SUBJECT_PREFIX[subject] || subject.slice(0, 5);
    const normQ = normalizeText(q);
    const normO = o.map(x => x.trim()).join("|");
    const hash = fnv1a(normQ + "||" + normO);
    return `${prefix}_${hash}`;
}

// Dołącza `id` do każdego pytania w tablicy, jeśli go jeszcze nie ma.
function assignIds(questions, subject) {
    return questions.map(q => ({
        ...q,
        id: q.id || makeQuestionId(subject, q.q, q.o),
    }));
}

if (typeof module !== "undefined") {
    module.exports = { makeQuestionId, assignIds, normalizeText, fnv1a };
}
