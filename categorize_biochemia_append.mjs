// Jednorazowy skrypt: dla każdego z 988 pytań głównej puli biochemii (htmlbiochem.txt,
// wzbogaconych o biochemia_enrichment.json) dopisuje DUPLIKAT do biochemia_gielda_raw.json
// z kategorią tematyczną wg biochemia_categorization_final.json (ten sam wzorzec x2 co przy
// fizjopato/mikrobiologii - makeQuestionId nie uwzględnia category, więc id/postęp są dzielone
// z oryginałem w "Biochemia — wszystkie pytania").
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const DIR = path.dirname(fileURLToPath(import.meta.url));
const LETTERS = ["a", "b", "c", "d", "e"];
function letterToIdx(letter) {
    return LETTERS.indexOf(letter);
}

function extractQuestionsArray(filePath) {
    const text = fs.readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n");
    const startMarker = "const questions = [";
    const startIdx = text.indexOf(startMarker);
    const arrOpenIdx = startIdx + startMarker.length - 1;
    const endIdx = text.indexOf("\n];", arrOpenIdx);
    const arrayText = text.slice(arrOpenIdx, endIdx + 2);
    return new Function(`"use strict"; return (${arrayText});`)();
}

const questions = extractQuestionsArray(path.join(DIR, "htmlbiochem.txt"));
const enrichment = JSON.parse(fs.readFileSync(path.join(DIR, "biochemia_enrichment.json"), "utf-8"));
const categorization = JSON.parse(fs.readFileSync("C:/Users/Jakub/AppData/Local/Temp/claude/C--Users-Jakub-Desktop-Prod-projekt-w-budowie/5b271756-3497-41b2-84e6-8e1d1037c3aa/scratchpad/biochemia_categorization_final.json", "utf-8"));

const gieldaPath = path.join(DIR, "biochemia_gielda_raw.json");
const gielda = JSON.parse(fs.readFileSync(gieldaPath, "utf-8"));

let added = 0;
questions.forEach((q, idx) => {
    const num = idx + 1;
    const numMatch = q.q.match(/^(\d+)\./);
    const enr = numMatch ? enrichment[numMatch[1]] : undefined;
    const category = categorization[String(num)];
    if (!category) {
        console.warn("BRAK kategorii dla pytania", num, q.q.slice(0, 60));
        return;
    }
    const finalO = enr ? enr.o : q.o;
    const finalA = enr ? letterToIdx(enr.a) : letterToIdx(q.a);
    const rationale = enr ? enr.rationale : undefined;
    const item = { category, q: q.q, o: finalO, a: finalA };
    if (rationale) item.rationale = rationale;
    gielda.push(item);
    added++;
});

fs.writeFileSync(gieldaPath, JSON.stringify(gielda, null, 1));
console.log("dodano", added, "wpisów; gielda total:", gielda.length);
