import fs from 'fs';

const GIELDA_CATEGORY = 'Ćwiczenia — Giełda (sesje 2023/2024)';

const CATEGORY_RENAME = {
  'Ćwiczenia — Skróty (abbreviations)': 'Ćwiczenia — Skróty',
};

const items = JSON.parse(fs.readFileSync(
  'C:/Users/Jakub/AppData/Local/Temp/claude/C--Users-Jakub-Desktop-Prod-projekt-w-budowie/ddbc60f4-3023-4409-80cd-51615071f1ef/scratchpad/angielski_gielda_items.json',
  'utf8'
));

const raw = JSON.parse(fs.readFileSync('angielski2_cwiczenia_raw.json', 'utf8'));
let added = 0;
for (const item of items) {
  const category = CATEGORY_RENAME[item.category] || item.category;
  raw.push({ category, mode: 'typed', q: item.q, answers: item.answers });
  raw.push({ category: GIELDA_CATEGORY, mode: 'typed', q: item.q, answers: item.answers });
  added += 2;
}
fs.writeFileSync('angielski2_cwiczenia_raw.json', JSON.stringify(raw, null, 2));
console.log('dodano', items.length, 'unikalnych pytan (x2 =', added, 'wpisow). nowa dlugosc angielski2_cwiczenia_raw.json:', raw.length);
