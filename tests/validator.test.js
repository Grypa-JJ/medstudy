import { describe, it, expect } from "vitest";
import { validateQuestions } from "../validator.js";

function baseQuestion(overrides = {}) {
    return {
        id: "anat_deadbeef",
        subject: "anatomia",
        q: "Jak nazywa się kość udowa po łacinie?",
        o: ["femur", "tibia", "fibula"],
        a: 0,
        ...overrides,
    };
}

describe("validateQuestions", () => {
    it("nie zgłasza błędów dla poprawnego zestawu", () => {
        const result = validateQuestions([baseQuestion()]);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
        expect(result.count).toBe(1);
    });

    it("łapie brak id", () => {
        const q = baseQuestion();
        delete q.id;
        const result = validateQuestions([q]);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes("brak pola id"))).toBe(true);
    });

    it("łapie duplikat id", () => {
        const result = validateQuestions([baseQuestion(), baseQuestion()]);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes("duplikat id"))).toBe(true);
    });

    it("łapie brak subject", () => {
        const q = baseQuestion();
        delete q.subject;
        const result = validateQuestions([q]);
        expect(result.errors.some(e => e.includes("brak pola subject"))).toBe(true);
    });

    it("łapie 'a' wskazujące poza zakres opcji", () => {
        const result = validateQuestions([baseQuestion({ a: 5 })]);
        expect(result.errors.some(e => e.includes("nie wskazuje poprawnego indeksu"))).toBe(true);
    });

    it("łapie 'a' ujemne", () => {
        const result = validateQuestions([baseQuestion({ a: -1 })]);
        expect(result.errors.some(e => e.includes("nie wskazuje poprawnego indeksu"))).toBe(true);
    });

    it("łapie 'a' niebędące liczbą", () => {
        const result = validateQuestions([baseQuestion({ a: "0" })]);
        expect(result.errors.some(e => e.includes("nie wskazuje poprawnego indeksu"))).toBe(true);
    });

    it("wymaga min. 2 opcji dla zwykłego pytania (nie 'typed')", () => {
        const result = validateQuestions([baseQuestion({ o: ["femur"], a: 0 })]);
        expect(result.errors.some(e => e.includes("co najmniej 2"))).toBe(true);
    });

    it("dla mode='typed' wystarczy 1 opcja", () => {
        const result = validateQuestions([
            baseQuestion({ mode: "typed", o: ["femur"], a: 0 }),
        ]);
        expect(result.valid).toBe(true);
    });

    it("łapie puste pytanie", () => {
        const result = validateQuestions([baseQuestion({ q: "   " })]);
        expect(result.errors.some(e => e.includes("puste pole q"))).toBe(true);
    });

    it("łapie kategorię spoza rejestru, gdy podano validCategories", () => {
        const result = validateQuestions(
            [baseQuestion({ category: "literowka_w_nazwie" })],
            new Set(["kosci", "miesnie"])
        );
        expect(result.errors.some(e => e.includes("nie istnieje w rejestrze kategorii"))).toBe(true);
    });

    it("nie sprawdza kategorii, gdy validCategories nie podano", () => {
        const result = validateQuestions([baseQuestion({ category: "cokolwiek" })]);
        expect(result.valid).toBe(true);
    });

    it("zbiera błędy z wielu pytań naraz", () => {
        const result = validateQuestions([
            baseQuestion({ id: undefined }),
            baseQuestion({ id: "inne_id", a: 99 }),
        ]);
        expect(result.errors.length).toBeGreaterThanOrEqual(2);
        expect(result.count).toBe(2);
    });
});
