import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('mikrobiologia_cwiczenia_raw.json', 'utf8'));
let fixed = 0;
for (const item of raw) {
  if (item.category === 'Wykład 6-7 — Budowa, replikacja wirusów i odpowiedź przeciwwirusową') {
    item.category = 'Wykład 6-7 — Budowa, replikacja wirusów i odpowiedź przeciwwirusowa';
    fixed++;
  }
  if (item.category === 'Podręcznik patofizjologii — Wstrząs') {
    item.category = 'Bakteriologia szczegółowa — Rozdz. 7 — Wprowadzenie (bakteriemia, sepsa, BSI)';
    fixed++;
  }
}
fs.writeFileSync('mikrobiologia_cwiczenia_raw.json', JSON.stringify(raw, null, 2));
console.log('naprawiono', fixed, 'wpisow z blednymi kategoriami');
