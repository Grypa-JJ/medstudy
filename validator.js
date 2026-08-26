// validator.js
// Uruchamiany przed publikacją bazy. Łapie dokładnie te błędy, które już raz
// nas ugryzły: literówki w batch/category, zły indeks odpowiedzi, duplikaty ID.

function validateQuestions(questions, validCategories = null) {
    const errors = [];
    const seenIds = new Set();

    questions.forEach((item, idx) => {
        const where = `#${idx} (id=${item.id || "BRAK"})`;

        if (!item.id) errors.push(`${where}: brak pola id`);
        else if (seenIds.has(item.id)) errors.push(`${where}: duplikat id "${item.id}"`);
        else seenIds.add(item.id);

        if (!item.subject) errors.push(`${where}: brak pola subject`);

        if (typeof item.a !== "number" || item.a < 0 || item.a >= (item.o || []).length) {
            errors.push(`${where}: pole 'a' (${item.a}) nie wskazuje poprawnego indeksu w 'o'`);
        }

        // Pytania typu "typed" (wpisywana odpowiedź) nie mają wariantów do wyboru -
        // 'o' to wtedy tablica jednoelementowa z samą poprawną odpowiedzią.
        const minOptions = item.mode === "typed" ? 1 : 2;
        if (!Array.isArray(item.o) || item.o.length < minOptions) {
            errors.push(`${where}: 'o' musi być tablicą z co najmniej ${minOptions} opcją/opcjami`);
        }

        if (!item.q || !item.q.trim()) errors.push(`${where}: puste pole q`);

        if (validCategories && item.category && !validCategories.has(item.category)) {
            errors.push(`${where}: category "${item.category}" nie istnieje w rejestrze kategorii (literówka?)`);
        }
    });

    return { valid: errors.length === 0, errors, count: questions.length };
}

if (typeof module !== "undefined") {
    module.exports = { validateQuestions };
}
