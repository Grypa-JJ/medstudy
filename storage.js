// storage.js
// Postęp nauki (progress) i historia aktywności (activity) trzymane w Supabase,
// przypisane do zalogowanego użytkownika (patrz auth.js, supabase_schema.sql).
// Zastępuje dawną wersję opartą o localStorage (medStudyProgress_v1) - zachowuje
// te same nazwy/kształty funkcji (loadProgress→loadProgressRows, recordAnswer,
// isAnswered), żeby index.html nie musiał się zmieniać w większości miejsc wywołania.

async function _currentUserId() {
    const { data, error } = await sb.auth.getUser();
    if (error || !data.user) throw new Error("Brak zalogowanego użytkownika");
    return data.user.id;
}

// Zwraca tablicę wierszy {question_id, correct, chosen, ts} dla zalogowanego usera.
async function loadProgressRows() {
    const { data, error } = await sb.from("progress").select("question_id, correct, chosen, ts");
    if (error) throw error;
    return data;
}

// Zwraca tablicę wierszy {date, count, seconds} dla zalogowanego usera.
async function loadActivityRows() {
    const { data, error } = await sb.from("activity").select("date, count, seconds");
    if (!error) return data;

    // Kolumna `seconds` może jeszcze nie istnieć (stara instalacja sprzed
    // supabase_schema_profile_v2.sql) - awaryjnie wczytaj bez niej, żeby reszta
    // appki (dailyHistory/heatmapa/streak - to jest w "fatalnej" części
    // ładowania, nie może po prostu rzucić błędem jak fiszki/odznaki) działała
    // dalej jak wcześniej.
    const fallback = await sb.from("activity").select("date, count");
    if (fallback.error) throw fallback.error;
    return fallback.data.map(row => Object.assign({}, row, { seconds: 0 }));
}

// Aktualizuje obiekt `progress` w pamięci od razu (synchronicznie), a w tle
// (fire-and-forget, wywołujący nie czeka na sieć) wysyła upsert do Supabase.
function recordAnswer(progress, questionId, correct, chosenIndex) {
    const ts = Date.now();
    progress[questionId] = { correct, chosen: chosenIndex, ts };

    _currentUserId()
        .then(userId => sb.from("progress").upsert({
            user_id: userId,
            question_id: questionId,
            correct,
            chosen: chosenIndex,
            ts: new Date(ts).toISOString(),
        }))
        .then(res => { if (res && res.error) console.error("Nie udało się zapisać postępu:", res.error.message); })
        .catch(err => console.error("Nie udało się zapisać postępu:", err.message));

    return progress;
}

function isAnswered(progress, questionId) {
    return Object.prototype.hasOwnProperty.call(progress, questionId);
}

// Usuwa CAŁY postęp usera (przycisk "Reset postępu").
async function clearAllProgress() {
    const userId = await _currentUserId();
    const { error } = await sb.from("progress").delete().eq("user_id", userId);
    if (error) throw error;
}

// Usuwa wybrane wiersze postępu po id pytania (np. "przećwicz błędne ponownie").
async function deleteProgressRows(questionIds) {
    if (!questionIds.length) return;
    const userId = await _currentUserId();
    const { error } = await sb.from("progress").delete().eq("user_id", userId).in("question_id", questionIds);
    if (error) throw error;
}

// Masowy import postępu z zaimportowanego pliku sesji (upsert wielu wierszy naraz).
async function bulkImportProgress(progressObj) {
    const userId = await _currentUserId();
    const rows = Object.keys(progressObj).map(qid => {
        const e = progressObj[qid];
        return {
            user_id: userId,
            question_id: qid,
            correct: e.correct,
            chosen: e.chosen,
            ts: new Date(e.ts || Date.now()).toISOString(),
        };
    });
    if (!rows.length) return;
    const { error } = await sb.from("progress").upsert(rows);
    if (error) throw error;
}

// Zapisuje/aktualizuje liczbę kart przejrzanych i sekund nauki danego dnia
// (upsert w tle, fire-and-forget). Nazwa celowo inna niż istniejąca w index.html
// funkcja `recordActivity()` (śledzenie bezczynności w timerze nauki) - to dwie
// różne rzeczy o podobnie brzmiących nazwach.
function saveActivityDay(dateStr, count, seconds) {
    _currentUserId()
        .then(userId => sb.from("activity").upsert({ user_id: userId, date: dateStr, count, seconds: seconds || 0 }))
        .then(res => { if (res && res.error) console.error("Nie udało się zapisać aktywności:", res.error.message); })
        .catch(err => console.error("Nie udało się zapisać aktywności:", err.message));
}

// ============== FISZKI (tryb nauki, system pudełek Leitnera) ==============
// Kluczowane id pytania (nie pozycją w tablicy questions) - ta sama poprawka,
// którą zastosowaliśmy dla progress/activity. `box` zastąpił wcześniejsze
// interval/ease/reps (SM-2-like) - patrz supabase_schema_flashcards_v2.sql.

// Zwraca tablicę wierszy {question_id, box, due, lapses, deleted}.
async function loadFlashcardsRows() {
    const { data, error } = await sb.from("flashcards").select("question_id, box, due, lapses, deleted");
    if (error) throw error;
    return data;
}

// Upsert jednego wiersza (fire-and-forget, wywołujący nie czeka na sieć).
function saveFlashcardRow(questionId, state) {
    _currentUserId()
        .then(userId => sb.from("flashcards").upsert({
            user_id: userId,
            question_id: questionId,
            box: state.box || 0,
            due: state.due || 0,
            lapses: state.lapses || 0,
            deleted: !!state.deleted,
        }))
        .then(res => { if (res && res.error) console.error("Nie udało się zapisać fiszki:", res.error.message); })
        .catch(err => console.error("Nie udało się zapisać fiszki:", err.message));
}

// Usuwa wiersze fiszek po id pytania (np. reset talii - wraca do stanu domyślnego).
async function deleteFlashcardRows(questionIds) {
    if (!questionIds.length) return;
    const userId = await _currentUserId();
    const { error } = await sb.from("flashcards").delete().eq("user_id", userId).in("question_id", questionIds);
    if (error) throw error;
}

// Masowy import stanu fiszek z zaimportowanego pliku sesji (upsert wielu wierszy naraz).
async function bulkImportFlashcards(flashStateObj, deletedObj) {
    const userId = await _currentUserId();
    const ids = new Set([...Object.keys(flashStateObj || {}), ...Object.keys(deletedObj || {})]);
    const rows = [...ids].map(id => {
        const st = (flashStateObj && flashStateObj[id]) || {};
        return {
            user_id: userId,
            question_id: id,
            box: st.box || 0,
            due: st.due || 0,
            lapses: st.lapses || 0,
            deleted: !!(deletedObj && deletedObj[id]),
        };
    });
    if (!rows.length) return;
    const { error } = await sb.from("flashcards").upsert(rows);
    if (error) throw error;
}

// ============== TRYB: TRUDNE PYTANIA (streak) ==============
// Kluczowane id pytania. Sama przynależność do puli "trudnych" wynika z
// progress[id].correct===false (tabela progress) - tu trzymamy tylko licznik
// kolejnych poprawnych odpowiedzi UDZIELONYCH W TYM TRYBIE, potrzebny żeby
// pytanie "wygraduowało" dopiero po kilku powtórzeniach z rzędu, nie po jednej
// przypadkowej poprawnej odpowiedzi.

// Zwraca tablicę wierszy {question_id, streak}.
async function loadHardStreakRows() {
    const { data, error } = await sb.from("hard_streak").select("question_id, streak");
    if (error) throw error;
    return data;
}

// Upsert jednego wiersza (fire-and-forget, wywołujący nie czeka na sieć).
function saveHardStreakRow(questionId, streak) {
    _currentUserId()
        .then(userId => sb.from("hard_streak").upsert({
            user_id: userId,
            question_id: questionId,
            streak: streak || 0,
        }))
        .then(res => { if (res && res.error) console.error("Nie udało się zapisać streaka trudnych pytań:", res.error.message); })
        .catch(err => console.error("Nie udało się zapisać streaka trudnych pytań:", err.message));
}

// Usuwa wiersze streaka po id pytania (np. po zresetowaniu postępu).
async function deleteHardStreakRows(questionIds) {
    if (!questionIds.length) return;
    const userId = await _currentUserId();
    const { error } = await sb.from("hard_streak").delete().eq("user_id", userId).in("question_id", questionIds);
    if (error) throw error;
}

// ============== CYKL NAUKI (postęp etapów, multi-device) ==============
// Kluczowane (subject_key, ordinal) - jedna jednostka planu (tydzień/blok).
// `days` to tablica dat YYYY-MM-DD "odbytych" - patrz peekCycleStage/
// commitCycleDay w index.html. Ten sam wzorzec co flashcards: ładowanie raz
// przy starcie, zapis fire-and-forget przy każdej zmianie.

// Zwraca tablicę wierszy {subject_key, ordinal, days}.
async function loadCycleProgressRows() {
    const { data, error } = await sb.from("cycle_progress").select("subject_key, ordinal, days");
    if (error) throw error;
    return data;
}

// Upsert jednego wiersza (fire-and-forget, wywołujący nie czeka na sieć).
function saveCycleProgressRow(subjectKey, ordinal, days) {
    _currentUserId()
        .then(userId => sb.from("cycle_progress").upsert({
            user_id: userId,
            subject_key: subjectKey,
            ordinal,
            days,
            updated_at: new Date().toISOString(),
        }))
        .then(res => { if (res && res.error) console.error("Nie udało się zapisać postępu cyklu:", res.error.message); })
        .catch(err => console.error("Nie udało się zapisać postępu cyklu:", err.message));
}

// ============== ODZNAKI / OSIĄGNIĘCIA ==============

// Zwraca tablicę wierszy {badge_key, unlocked_at}.
async function loadBadgeRows() {
    const { data, error } = await sb.from("badges").select("badge_key, unlocked_at");
    if (error) throw error;
    return data;
}

// Odblokowuje odznakę (upsert - bezpieczne przy ewentualnym podwójnym wywołaniu).
async function unlockBadge(badgeKey) {
    const userId = await _currentUserId();
    const { error } = await sb.from("badges").upsert({ user_id: userId, badge_key: badgeKey });
    if (error) throw error;
}

// ============== PROFIL: AWATAR / OBWÓDKA / ROK ==============

// Aktualizuje dowolny podzbiór pól profilu (avatar_key, equipped_border, year,
// display_name). `updates` to obiekt z tylko tymi kluczami, które chcemy zmienić.
async function updateMyProfile(updates) {
    const userId = await _currentUserId();
    const { error } = await sb.from("profiles").update(updates).eq("id", userId);
    if (error) throw error;
}

// ============== STATYSTYKI ZBIORCZE (bez ujawniania cudzych danych) ==============
// Obie funkcje wywołują funkcje SQL "security definer" (patrz
// supabase_schema_profile_v2.sql), które widzą wszystkich userów, ale zwracają
// WYŁĄCZNIE zagregowane liczby - nigdy pojedyncze wiersze z danymi kogoś innego.

// Zwraca tablicę {year, user_count} - ile osób ma ustawiony każdy rok studiów.
async function getYearDistribution() {
    const { data, error } = await sb.rpc("year_distribution");
    if (error) throw error;
    return data;
}

// Zwraca {cohort_size, rank_percentile} - pozycja (percentyl) wywołującego na
// tle jego rocznika, licząc po liczbie odpowiedzianych pytań.
async function getYearPercentile(year, myAnswerCount) {
    const { data, error } = await sb.rpc("year_percentile", { my_year: year, my_answer_count: myAnswerCount });
    if (error) throw error;
    return (data && data[0]) || { cohort_size: 0, rank_percentile: null };
}

if (typeof module !== "undefined") {
    module.exports = {
        loadProgressRows,
        loadActivityRows,
        recordAnswer,
        isAnswered,
        clearAllProgress,
        deleteProgressRows,
        bulkImportProgress,
        saveActivityDay,
        loadFlashcardsRows,
        saveFlashcardRow,
        deleteFlashcardRows,
        bulkImportFlashcards,
        loadHardStreakRows,
        saveHardStreakRow,
        deleteHardStreakRows,
        loadCycleProgressRows,
        saveCycleProgressRow,
        loadBadgeRows,
        unlockBadge,
        updateMyProfile,
        getYearDistribution,
        getYearPercentile,
    };
}
