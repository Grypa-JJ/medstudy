import fs from 'fs';

const kwPath = 'C:\\Users\\Jakub\\AppData\\Local\\Temp\\claude\\C--Users-Jakub-Desktop-Prod-projekt-w-budowie\\5b271756-3497-41b2-84e6-8e1d1037c3aa\\scratchpad\\junqueira_chapters\\keywords_true_blue.json';
const kw = JSON.parse(fs.readFileSync(kwPath, 'utf-8'));

const raw = JSON.parse(fs.readFileSync('histologia_tematy_raw.json', 'utf-8'));

// chapter -> categories mapping (a chapter's content may span 1-2 topic categories)
const chapterCats = {
  R_01: ['01. Wprowadzenie do technik histologicznych i mikroskopii'],
  R_02: ['02. Cytofizjologia cz. I — cytoplazma'],
  R_03: ['03. Cytofizjologia cz. II — jądro komórkowe'],
  R_04: ['04. Tkanka nabłonkowa'],
  R_05: ['05. Tkanka łączna i tłuszczowa'],
  R_06: ['05. Tkanka łączna i tłuszczowa'],
  R_07: ['06. Tkanki łączne oporowe — chrzęstna i kostna'],
  R_08: ['06. Tkanki łączne oporowe — chrzęstna i kostna'],
  R_09: ['08. Tkanka nerwowa i układ nerwowy'],
  R_10: ['07. Tkanka mięśniowa'],
  R_11: ['13. Układ krwionośny i jego rozwój embriologiczny'],
  R_12: ['09. Krew i hemopoeza'],
  R_13: ['09. Krew i hemopoeza'],
  R_14: ['14. Układ limfatyczny i jego rozwój embriologiczny'],
  R_15: ['16. Przewód pokarmowy cz. I — jama ustna', '17. Przewód pokarmowy cz. II — cewa pokarmowa'],
  R_16: ['18. Narządy związane z przewodem pokarmowym'],
  R_17: ['19. Układ oddechowy i jego rozwój embriologiczny'],
  R_18: ['15. Narządy zmysłów, skóra i rozwój układu nerwowego'],
  R_19: ['20. Układ moczowy i płciowy — rozwój embriologiczny'],
  R_20: ['21. Układ dokrewny i jego rozwój embriologiczny'],
  R_21: ['11. Układ płciowy męski'],
  R_22: ['10. Układ płciowy żeński'],
  R_23: ['15. Narządy zmysłów, skóra i rozwój układu nerwowego'],
};

function normalize(s) {
  return s.toLowerCase().replace(/[„”"()]/g, '').trim();
}

const allMissing = {};
for (const [chapter, keywords] of Object.entries(kw)) {
  const cats = chapterCats[chapter] || [];
  const items = raw.filter(x => cats.includes(x.category));
  const haystack = normalize(items.map(x => x.q + ' ' + (x.rationale||'') + ' ' + x.o.join(' ')).join(' \n '));
  let covered = 0;
  const missing = [];
  for (const k of keywords) {
    const nk = normalize(k);
    // strip very short connector words / single tokens that are too generic
    if (nk.length < 4) { covered++; continue; }
    if (haystack.includes(nk)) {
      covered++;
    } else {
      missing.push(k);
    }
  }
  console.log(`${chapter}: ${covered}/${keywords.length} covered, existing questions: ${items.length}, MISSING: ${missing.length}`);
  allMissing[chapter] = missing;
}
fs.writeFileSync('C:\\Users\\Jakub\\AppData\\Local\\Temp\\claude\\C--Users-Jakub-Desktop-Prod-projekt-w-budowie\\5b271756-3497-41b2-84e6-8e1d1037c3aa\\scratchpad\\junqueira_chapters\\missing_keywords.json', JSON.stringify(allMissing, null, 2), 'utf-8');
console.log('saved missing_keywords.json');
