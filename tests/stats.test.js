import { describe, it, expect } from "vitest";
import { computeAccuracyByDay, computeWeakCategories, computeSummary, dateKey } from "../stats.js";

describe("dateKey", () => {
    it("wycina samą datę z ISO timestampu", () => {
        expect(dateKey("2026-08-20T12:34:56.000Z")).toBe("2026-08-20");
    });
});

describe("computeAccuracyByDay", () => {
    it("liczy % poprawnych per dzień", () => {
        const rows = [
            { ts: "2026-08-01T10:00:00Z", correct: true },
            { ts: "2026-08-01T11:00:00Z", correct: false },
            { ts: "2026-08-02T10:00:00Z", correct: true },
        ];
        const { days, accuracyPct } = computeAccuracyByDay(rows, 30);
        expect(days).toEqual(["2026-08-01", "2026-08-02"]);
        expect(accuracyPct).toEqual([50, 100]);
    });

    it("pomija wiersze bez ts", () => {
        const rows = [{ correct: true }, { ts: "2026-08-01T10:00:00Z", correct: true }];
        const { days } = computeAccuracyByDay(rows, 30);
        expect(days).toEqual(["2026-08-01"]);
    });

    it("ogranicza wynik do ostatnich maxDays dni", () => {
        const rows = Array.from({ length: 40 }, (_, i) => ({
            ts: `2026-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`,
            correct: true,
        })).slice(0, 31); // 31 unikalnych dni ze stycznia (1..31)
        const { days } = computeAccuracyByDay(rows, 5);
        expect(days.length).toBe(5);
        expect(days).toEqual(["2026-01-27", "2026-01-28", "2026-01-29", "2026-01-30", "2026-01-31"]);
    });

    it("zwraca puste tablice dla braku danych", () => {
        const { days, accuracyPct } = computeAccuracyByDay([], 30);
        expect(days).toEqual([]);
        expect(accuracyPct).toEqual([]);
    });
});

describe("computeWeakCategories", () => {
    const idToCategory = new Map([
        ["q1", "koscie"],
        ["q2", "koscie"],
        ["q3", "koscie"],
        ["q4", "koscie"],
        ["q5", "koscie"],
        ["q6", "miesnie"],
        ["q7", "miesnie"],
    ]);

    it("filtruje kategorie z za małą liczbą prób", () => {
        const rows = [
            { question_id: "q1", correct: true },
            { question_id: "q6", correct: false },
            { question_id: "q7", correct: false },
        ];
        // "miesnie" ma tylko 2 próby < minSamples=5 -> odpada, "koscie" ma tylko 1 -> też odpada
        const result = computeWeakCategories(rows, idToCategory, 5, 10);
        expect(result).toEqual([]);
    });

    it("sortuje od najsłabszej kategorii", () => {
        const mixed = [
            { question_id: "q1", correct: true },
            { question_id: "q2", correct: true },
            { question_id: "q3", correct: true },
            { question_id: "q4", correct: true },
            { question_id: "q5", correct: false }, // koscie: 4/5 = 80%
            { question_id: "q6", correct: false },
            { question_id: "q7", correct: false },
            { question_id: "q6", correct: false },
            { question_id: "q7", correct: false },
            { question_id: "q6", correct: true }, // miesnie: 1/5 = 20%
        ];
        const result = computeWeakCategories(mixed, idToCategory, 5, 10);
        expect(result[0].category).toBe("miesnie");
        expect(result[0].accuracy).toBe(20);
        expect(result[1].category).toBe("koscie");
        expect(result[1].accuracy).toBe(80);
    });

    it("pomija pytania spoza mapy id->category", () => {
        const rows = [{ question_id: "nieznane_id", correct: true }];
        const result = computeWeakCategories(rows, idToCategory, 1, 10);
        expect(result).toEqual([]);
    });

    it("ogranicza wynik do topN", () => {
        const manyCategories = new Map();
        const rows = [];
        for (let c = 0; c < 15; c++) {
            for (let i = 0; i < 5; i++) {
                const id = `cat${c}_q${i}`;
                manyCategories.set(id, `kategoria_${c}`);
                rows.push({ question_id: id, correct: false });
            }
        }
        const result = computeWeakCategories(rows, manyCategories, 5, 10);
        expect(result.length).toBe(10);
    });
});

describe("computeSummary", () => {
    it("liczy total/accuracy/activeDays", () => {
        const progressRows = [
            { correct: true },
            { correct: true },
            { correct: false },
            { correct: false },
        ];
        const activityRows = [{ date: "2026-08-01" }, { date: "2026-08-02" }];
        expect(computeSummary(progressRows, activityRows)).toEqual({
            total: 4,
            accuracyPct: 50,
            activeDays: 2,
        });
    });

    it("zwraca accuracyPct=0 przy braku odpowiedzi (bez dzielenia przez zero)", () => {
        expect(computeSummary([], [])).toEqual({ total: 0, accuracyPct: 0, activeDays: 0 });
    });
});
