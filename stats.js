// stats.js
// Czyste funkcje liczące statystyki do panelu dashboard.html. Wydzielone z
// dashboard.html, żeby dało się je przetestować (tests/stats.test.js) bez
// przeglądarki/Supabase - biorą gotowe tablice wierszy, nie robią fetchy.

function dateKey(iso) {
    return iso.slice(0, 10); // "YYYY-MM-DDTHH:mm:ss..." -> "YYYY-MM-DD"
}

// Zwraca {days: string[], accuracyPct: number[]} dla ostatnich `maxDays` dni,
// w których padła choć jedna odpowiedź. `ts` w progress to data OSTATNIEJ
// odpowiedzi na dane pytanie (progress jest kluczowane per pytanie, nie jest
// logiem każdej próby) - to przybliżenie "stanu wiedzy danego dnia", nie
// pełna historia.
function computeAccuracyByDay(progressRows, maxDays = 30) {
    const byDay = new Map();
    for (const row of progressRows) {
        if (!row.ts) continue;
        const day = dateKey(row.ts);
        const bucket = byDay.get(day) || { correct: 0, total: 0 };
        bucket.total += 1;
        if (row.correct) bucket.correct += 1;
        byDay.set(day, bucket);
    }

    const days = [...byDay.keys()].sort().slice(-maxDays);
    const accuracyPct = days.map(d => {
        const b = byDay.get(d);
        return Math.round((b.correct / b.total) * 100);
    });

    return { days, accuracyPct };
}

// Zwraca posortowaną (od najsłabszej) tablicę {category, accuracy, total},
// tylko dla kategorii z co najmniej `minSamples` odpowiedziami, max `topN` wpisów.
function computeWeakCategories(progressRows, idToCategory, minSamples = 5, topN = 10) {
    const byCategory = new Map();
    for (const row of progressRows) {
        const category = idToCategory.get(row.question_id);
        if (!category) continue;
        const bucket = byCategory.get(category) || { correct: 0, total: 0 };
        bucket.total += 1;
        if (row.correct) bucket.correct += 1;
        byCategory.set(category, bucket);
    }

    return [...byCategory.entries()]
        .filter(([, b]) => b.total >= minSamples)
        .map(([category, b]) => ({
            category,
            accuracy: Math.round((b.correct / b.total) * 100),
            total: b.total,
        }))
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, topN);
}

// Zwraca {total, accuracyPct, activeDays}.
function computeSummary(progressRows, activityRows) {
    const total = progressRows.length;
    const correct = progressRows.filter(r => r.correct).length;
    const accuracyPct = total ? Math.round((correct / total) * 100) : 0;
    return { total, accuracyPct, activeDays: activityRows.length };
}

if (typeof module !== "undefined") {
    module.exports = { computeAccuracyByDay, computeWeakCategories, computeSummary, dateKey };
}
