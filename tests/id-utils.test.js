import { describe, it, expect } from "vitest";
import { makeQuestionId, assignIds, normalizeText, fnv1a } from "../id-utils.js";

describe("normalizeText", () => {
    it("usuwa numerację z początku", () => {
        expect(normalizeText("123. Jak nazywa się kość?")).toBe("Jak nazywa się kość?");
    });

    it("przycina białe znaki na brzegach i zwija wielokrotne spacje", () => {
        expect(normalizeText("  Jak   nazywa się kość?  ")).toBe("Jak nazywa się kość?");
    });

    it("nie rusza tekstu bez numeracji", () => {
        expect(normalizeText("Jak nazywa się kość?")).toBe("Jak nazywa się kość?");
    });
});

describe("fnv1a", () => {
    it("jest deterministyczny dla tego samego wejścia", () => {
        expect(fnv1a("abc")).toBe(fnv1a("abc"));
    });

    it("różne wejścia dają (zazwyczaj) różny hash", () => {
        expect(fnv1a("abc")).not.toBe(fnv1a("abcd"));
    });

    it("zwraca 8-znakowy hex", () => {
        expect(fnv1a("test")).toMatch(/^[0-9a-f]{8}$/);
    });

    it("poprawnie liczy bajty UTF-8 polskich znaków diakrytycznych", () => {
        // ó w UTF-8 to 2 bajty (0xC3 0xB3) - regresja na .charCodeAt() zamiast TextEncoder
        expect(fnv1a("ó")).not.toBe(fnv1a("o"));
        expect(fnv1a("kość")).toMatch(/^[0-9a-f]{8}$/);
    });
});

describe("makeQuestionId", () => {
    it("używa znanego prefiksu przedmiotu", () => {
        const id = makeQuestionId("anatomia", "Pytanie?", ["a", "b"]);
        expect(id.startsWith("anat_")).toBe(true);
    });

    it("dla nieznanego przedmiotu używa pierwszych 5 znaków jako prefiksu", () => {
        const id = makeQuestionId("nieznany_przedmiot", "Pytanie?", ["a", "b"]);
        expect(id.startsWith("niezn_")).toBe(true);
    });

    it("jest deterministyczny dla tych samych danych", () => {
        const a = makeQuestionId("anatomia", "Pytanie?", ["a", "b"]);
        const b = makeQuestionId("anatomia", "Pytanie?", ["a", "b"]);
        expect(a).toBe(b);
    });

    it("normalizuje pytanie (numeracja/białe znaki) przed liczeniem ID", () => {
        const a = makeQuestionId("anatomia", "1. Pytanie?", ["a", "b"]);
        const b = makeQuestionId("anatomia", "Pytanie?", ["a", "b"]);
        expect(a).toBe(b);
    });

    it("różne opcje odpowiedzi dają różne ID przy tym samym pytaniu", () => {
        const a = makeQuestionId("anatomia", "Pytanie?", ["a", "b"]);
        const b = makeQuestionId("anatomia", "Pytanie?", ["a", "c"]);
        expect(a).not.toBe(b);
    });
});

describe("assignIds", () => {
    it("dogrywa id do pytań, które go nie mają", () => {
        const out = assignIds([{ q: "Pytanie?", o: ["a", "b"] }], "anatomia");
        expect(out[0].id).toBeDefined();
        expect(out[0].id.startsWith("anat_")).toBe(true);
    });

    it("nie nadpisuje już istniejącego id", () => {
        const out = assignIds([{ id: "custom_id", q: "Pytanie?", o: ["a", "b"] }], "anatomia");
        expect(out[0].id).toBe("custom_id");
    });

    it("nie mutuje oryginalnej tablicy/obiektów", () => {
        const input = [{ q: "Pytanie?", o: ["a", "b"] }];
        const out = assignIds(input, "anatomia");
        expect(input[0].id).toBeUndefined();
        expect(out).not.toBe(input);
    });
});
