import fs from 'fs';

const GIELDA_CATEGORY = 'Giełda z sesji 2024/2025 (Moodle, wykłady)';

const items = [
  { targetCategory: 'Wykład 25 — Równowaga kwasowo-zasadowa (RKZ)', q: 'Stężenie HCO3- w osoczu wynosi prawidłowo 24 mM (przy H2CO3 = 1,2 mM, zachowującym pH prawidłowe wg stosunku 20:1). Jeśli H2CO3 wzrośnie do 1,4 mM, o ile musi wzrosnąć stężenie HCO3-, aby pH pozostało NIEZMIENIONE?', o: ['O 4 mM', 'O 8 mM', 'O 0,2 mM', 'O 2 mM', 'O 1 mM'], a: 0, rationale: 'Zgodnie z równaniem Hendersona-Hasselbalcha pH osocza zależy od STOSUNKU stężenia HCO3- do H2CO3, który przy prawidłowym pH wynosi 20:1 (24 mM / 1,2 mM = 20). Żeby ten stosunek pozostał niezmieniony po wzroście H2CO3 do 1,4 mM, HCO3- musi wzrosnąć proporcjonalnie: 1,4 × 20 = 28 mM, czyli o 4 mM (z 24 do 28 mM) — dokładnie zachowując stosunek 20:1 i tym samym pH. Wzrost o 8 mM (opcja B) dawałby HCO3-=32 mM, co zmieniłoby stosunek na 32/1,4 ≈ 22,9 — WIĘKSZY niż 20, czyli pH by WZROSŁO (zasadowica), nie pozostało niezmienione. Wzrost o 0,2 mM (opcja C), 2 mM (opcja D) i 1 mM (opcja E) dawałyby HCO3- odpowiednio 24,2/26/25 mM — żadna z tych wartości nie zachowuje dokładnie proporcji 20:1 względem nowego H2CO3=1,4 mM, więc pH uległoby zmianie (obniżeniu, bo stosunek spadłby poniżej 20).' },
];

const raw = JSON.parse(fs.readFileSync('fizjopato_raw.json', 'utf8'));
let added = 0;
for (const item of items) {
  raw.push({ category: item.targetCategory, q: item.q, o: item.o, a: item.a, rationale: item.rationale });
  raw.push({ category: GIELDA_CATEGORY, q: item.q, o: item.o, a: item.a, rationale: item.rationale });
  added += 2;
}
fs.writeFileSync('fizjopato_raw.json', JSON.stringify(raw, null, 2));
console.log('dodano', items.length, 'unikalnych pytan (x2 =', added, 'wpisow). nowa dlugosc fizjopato_raw.json:', raw.length);
