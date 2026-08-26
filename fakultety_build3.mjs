import fs from 'fs';

const SCRATCH = 'C:/Users/Jakub/AppData/Local/Temp/claude/C--Users-Jakub-Desktop-Prod-projekt-w-budowie/ddbc60f4-3023-4409-80cd-51615071f1ef/scratchpad';
const CATEGORY = 'Historia medycyny — KGWM (Rok 2, talia Anki)';

const abcde = JSON.parse(fs.readFileSync(`${SCRATCH}/higiena_abcde.json`, 'utf8'));
let typed = JSON.parse(fs.readFileSync(`${SCRATCH}/higiena_typed.json`, 'utf8'));

// Ręczna korekta jedynego znanego artefaktu parsowania (lista opcji bez "a)"
// tylko z numerkiem przy odpowiedzi) + usunięcie kilku zbyt krótkich/niejasnych
// kart (np. gołe "1." bez treści) jeśli się pojawią.
typed = typed.filter(t => t.front && t.back && t.back.length > 0);
typed.forEach(t => {
    t.back = t.back.replace(/^\d+\.\s*/, ''); // usuń wiodące "3. " itp.
});
// Ta jedna karta miała nieodseparowane opcje w treści pytania - skracamy do czystego pytania.
typed.forEach(t => {
    if (t.front.startsWith('Leki galenowe to inaczej:')) {
        t.front = 'Leki galenowe to inaczej:';
    }
});

const raw = JSON.parse(fs.readFileSync('fakultety_raw.json', 'utf8'));

let added = 0;
abcde.forEach(item => {
    raw.push({ category: CATEGORY, q: item.q, o: item.o, a: item.a });
    added++;
});
typed.forEach(item => {
    raw.push({ category: CATEGORY, mode: 'typed', q: item.front, answers: [item.back] });
    added++;
});

fs.writeFileSync('fakultety_raw.json', JSON.stringify(raw, null, 2));
console.log('dodano', added, 'pytan (', abcde.length, 'ABCDE +', typed.length, 'typed ). nowa dlugosc fakultety_raw.json:', raw.length);
