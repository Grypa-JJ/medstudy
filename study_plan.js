// study_plan.js
// Warstwa "tygodniowy cykl nauki" (patrz Plan rozbudowy apki.md) - cienka
// nakładka nad istniejącymi trybami, NIE nowy silnik nauki. Pokazuje "co jest
// dziś na tapecie" na podstawie dat z public.study_units. Dowiązanie jednostki
// do KONKRETNEGO materiału ma dwa warianty (patrz resolveTodaySessionTarget):
//   1. Przedmioty z `themeOrder` (mikrobiologia, fizjopato) - dowiązanie jest
//      DARMOWE, bo kolejność tematów już istnieje w kodzie (MIKROBIOLOGIA_
//      THEME_ORDER/FIZJOPATO_THEME_ORDER) - jednostka o ordinal N to po prostu
//      N-ty temat z tej listy. Nie trzeba nic tagować w build_questions.mjs.
//   2. Przedmioty z dowiązaniem na poziomie KATEGORII (`studyUnit` w
//      categories, patrz build_questions.mjs - na razie histologia: 1
//      kategoria = 1 temat = 1 tydzień) - jednostka o ordinal N to kategoria
//      z tym samym `studyUnit.ordinal`.
// Dla przedmiotów bez żadnego z powyższych (jeszcze) UI spada z powrotem na
// cały przedmiot (selectSubject) - mniej precyzyjne, ale nigdy nie blokuje.
// Świadomie NIE tagujemy pojedynczych pytań jednostką - tagowanie na poziomie
// kategorii/tematu (dziesiątki, nie tysiące wpisów) jest wystarczające i
// wielokrotnie bardziej skalowalne.
//
// Ładowane nie-fatalnie: jeśli tabele jeszcze nie istnieją (user nie uruchomił
// supabase_schema_study_plan.sql) albo są puste (brak danych dla danego roku),
// reszta appki ma działać dalej bez tej sekcji - dokładnie tak jak flashcards
// w loadAppData().

let studyUnitsBySubject = new Map(); // subject_key -> [{ordinal, title, starts_on, ends_on, exam_on, group_number}]

async function loadStudyPlan() {
    studyUnitsBySubject = new Map();
    const { data, error } = await sb.from("study_units").select("subject_key,ordinal,title,starts_on,ends_on,exam_on,group_number");
    if (error) {
        console.warn("Brak danych planu nauki (tabela study_units?):", error.message);
        return;
    }
    (data || []).forEach(function(u) {
        let arr = studyUnitsBySubject.get(u.subject_key);
        if (!arr) { arr = []; studyUnitsBySubject.set(u.subject_key, arr); }
        arr.push(u);
    });
}

// Czy dana jednostka dotyczy usera z podaną grupą - `group_number` null na
// jednostce = wspólna dla całego rocznika (np. wykład), więc widoczna dla
// wszystkich niezależnie od tego, jaką grupę (albo żadną) ma user. Jeśli
// jednostka MA ustawioną konkretną grupę (rotacje kliniczne, patrz
// supabase_schema_study_plan_groups.sql), pokazujemy ją TYLKO userowi tej
// samej grupy - user bez ustawionej grupy nie zobaczy żadnej z takich
// jednostek (lepiej nic nie pokazać niż pokazać cudzy plan).
function unitMatchesGroup(u, groupNumber) {
    return u.group_number == null || (groupNumber != null && u.group_number === groupNumber);
}

// Zwraca jednostki, których zakres dat (starts_on..ends_on) obejmuje `asOf`
// (domyślnie dziś, format YYYY-MM-DD - porównywalny leksykograficznie z `date`
// z Postgresa), dla przedmiotów należących do podanego roku studiów (bez
// `year` - wszystkie) i pasujące do grupy usera (patrz unitMatchesGroup).
// `asOf` istnieje po to, żeby dało się PODEJRZEĆ, jak sesja wygląda w innym
// momencie roku (np. w październiku, poza sezonem zajęć) - patrz kontrolka
// "Podgląd na dzień" w renderTodaySession(). Celowo NIE dotyka globalnego
// Date/zegara - to czysty parametr, więc reszta appki (timery, aktywność
// dzienna, terminy fiszek) zostaje nietknięta.
function getTodaysStudyUnits(year, asOf, groupNumber) {
    const today = asOf || new Date().toISOString().slice(0, 10);
    const out = [];
    studyUnitsBySubject.forEach(function(units, subjectKey) {
        if (year != null) {
            const subj = SUBJECTS_LIST.find(function(s) { return s.key === subjectKey; });
            if (!subj || subj.year !== year) return;
        }
        units.forEach(function(u) {
            if (!unitMatchesGroup(u, groupNumber)) return;
            if (u.starts_on && u.ends_on && u.starts_on <= today && today <= u.ends_on) {
                out.push(Object.assign({ subject_key: subjectKey }, u));
            }
        });
    });
    return out;
}

// Znajduje, w co dokładnie powinno wskakiwać kliknięcie karty "dzisiejsza
// sesja" dla danej jednostki planu. Sprawdza NAJPIERW dowiązanie na poziomie
// KATEGORII (`studyUnit` w categories, patrz build_questions.mjs -
// assignStudyUnitOrdinalsByTheme - histologia, mikrobiologia, fizjopato, WdNK,
// MSN, immunologia) - to precyzyjny skok wprost w partię. Dopiero gdy go nie
// ma, spada na `themeOrder` (skok w cały temat - obecnie nieużywane, bo
// mikro/fizjopato dostały dowiązanie per-kategoria, ale zostaje jako
// zapasowa ścieżka dla ewentualnych przyszłych przedmiotów z themeOrder bez
// tagowania kategorii). Zwraca:
//   { type: "category", key: "01. Wprowadzenie..." }        - skok wprost w partię
//   { type: "theme", theme: "🔬 Podstawy mikrobiologii" }    - skok w kafelki tematu
//   null                                                     - brak dowiązania, spadamy na cały przedmiot
function resolveTodaySessionTarget(subjectKey, unitOrdinal) {
    const batch = BATCHES.find(function(b) {
        return b.subject === subjectKey && b.studyUnit && b.studyUnit.ordinal === unitOrdinal;
    });
    if (batch) return { type: "category", key: batch.key };
    const subjInfo = SUBJECTS_LIST.find(function(s) { return s.key === subjectKey; });
    if (subjInfo && subjInfo.themeOrder && subjInfo.themeOrder[unitOrdinal - 1]) {
        return { type: "theme", theme: subjInfo.themeOrder[unitOrdinal - 1] };
    }
    return null;
}

// Zwraca id wszystkich pytań objętych danym celem (patrz resolveTodaySessionTarget)
// - używane przez "Zamknij tydzień" do zasilenia fiszek całym zakresem tygodnia,
// nie tylko pojedynczą kategorią. `questions`/`BATCHES` to globalne tablice z
// index.html (ta funkcja nic nie zakłada poza tym, że już są wypełnione).
function getQuestionIdsForTarget(subjectKey, target) {
    if (!target) return [];
    if (target.type === "category") {
        return questions.filter(function(q) { return q.subject === subjectKey && q.category === target.key; }).map(function(q) { return q.id; });
    }
    if (target.type === "theme") {
        const keysInTheme = new Set(BATCHES.filter(function(b) { return b.subject === subjectKey && b.theme === target.theme; }).map(function(b) { return b.key; }));
        return questions.filter(function(q) { return q.subject === subjectKey && keysInTheme.has(q.category); }).map(function(q) { return q.id; });
    }
    return [];
}

// Najbliższy nadchodzący kolokwium/egzamin (`exam_on`) dla danego przedmiotu,
// licząc od `asOf` (domyślnie dziś). Zwraca `{ ordinal, title, exam_on, daysLeft }`
// albo `null`, gdy żadna jednostka tego przedmiotu nie ma ustawionego exam_on w
// przyszłości. Używane do odznaki "zbliża się kolokwium" - prosty, widoczny
// odpowiednik "mnożnika priorytetu" z planu (zamiast ingerować w wewnętrzny
// algorytm sortowania Leitnera, po prostu podpowiadamy studentowi, żeby otworzył
// Fiszki dla tego przedmiotu, zanim dojdzie do kolokwium).
function getUpcomingExam(subjectKey, asOf, groupNumber) {
    const today = asOf || new Date().toISOString().slice(0, 10);
    const units = studyUnitsBySubject.get(subjectKey) || [];
    let best = null;
    units.forEach(function(u) {
        if (!unitMatchesGroup(u, groupNumber)) return;
        if (!u.exam_on || u.exam_on < today) return;
        if (!best || u.exam_on < best.exam_on) best = u;
    });
    if (!best) return null;
    const DAY_MS = 86400000;
    const daysLeft = Math.round((Date.parse(best.exam_on + "T00:00:00Z") - Date.parse(today + "T00:00:00Z")) / DAY_MS);
    return { ordinal: best.ordinal, title: best.title, exam_on: best.exam_on, daysLeft: daysLeft };
}

if (typeof module !== "undefined") {
    module.exports = { loadStudyPlan, getTodaysStudyUnits, resolveTodaySessionTarget, getQuestionIdsForTarget, getUpcomingExam, unitMatchesGroup };
}
