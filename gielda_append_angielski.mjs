import fs from 'fs';

const GIELDA_CATEGORY = 'Ćwiczenia — Giełda (sesje 2023/2024)';

const items = [
  { targetCategory: 'Ćwiczenia — Podaj termin', q: 'Podaj termin: prolapse of the uterus', answers: ['metroptosis', 'hysteroptosis'] },
  { targetCategory: 'Ćwiczenia — Podaj termin', q: 'Podaj termin: slowness of movement', answers: ['bradykinesia'] },
  { targetCategory: 'Ćwiczenia — Podaj termin', q: 'Podaj termin: inflammation of a sweat gland', answers: ['hidradenitis'] },
  { targetCategory: 'Ćwiczenia — Podaj termin', q: 'Podaj termin: pain in the vagina', answers: ['colpodynia'] },
  { targetCategory: 'Ćwiczenia — Podaj termin', q: 'Podaj termin: suture of the ureter', answers: ['ureterorrhaphy', 'ureterorraphy'] },
  { targetCategory: 'Ćwiczenia — Podaj termin', q: 'Podaj termin: study of hair (and its diseases)', answers: ['trichology'] },
  { targetCategory: 'Ćwiczenia — Podaj termin', q: 'Podaj termin: endoscopic examination of the duodenum', answers: ['duodenoscopy'] },
  { targetCategory: 'Ćwiczenia — Podaj termin', q: 'Podaj termin: abnormal increase in the number of red blood cells', answers: ['erythrocytosis'] },
  { targetCategory: 'Ćwiczenia — Podaj termin', q: 'Podaj termin: surgical creation of an opening into the colon (stoma)', answers: ['colostomy', 'colonostomy'] },
  { targetCategory: 'Ćwiczenia — Skróty (abbreviations)', q: 'Co oznacza skrót GERD?', answers: ['gastroesophageal reflux disease', 'gastro-oesophageal reflux disease'] },
  { targetCategory: 'Ćwiczenia — Skróty (abbreviations)', q: 'Co oznacza skrót IVF?', answers: ['in vitro fertilization', 'in vitro fertilisation'] },
  { targetCategory: 'Ćwiczenia — Skróty (abbreviations)', q: 'Co oznacza skrót OT (w kontekście szpitalnym)?', answers: ['operating theatre', 'operating theater'] },
  { targetCategory: 'Ćwiczenia — Skróty (abbreviations)', q: 'Co oznacza skrót CPR?', answers: ['cardiopulmonary resuscitation'] },
  { targetCategory: 'Ćwiczenia — Skróty (abbreviations)', q: 'Co oznacza skrót ORIF?', answers: ['open reduction and internal fixation'] },
  { targetCategory: 'Ćwiczenia — Skróty (abbreviations)', q: 'Co oznacza skrót Ht?', answers: ['hematocrit', 'haematocrit'] },
  { targetCategory: 'Ćwiczenia — Skróty (abbreviations)', q: 'Co oznacza skrót NAD (w dokumentacji medycznej)?', answers: ['no abnormality detected', 'nothing abnormal detected'] },
  { targetCategory: 'Ćwiczenia — Tłumaczenia', q: 'Przetłumacz: nudności i wymioty', answers: ['nausea and vomiting'] },
  { targetCategory: 'Ćwiczenia — Tłumaczenia', q: 'Przetłumacz: planowy zabieg chirurgiczny', answers: ['elective surgical procedure', 'elective surgery', 'elective operation'] },
  { targetCategory: 'Ćwiczenia — Tłumaczenia', q: 'Przetłumacz: częstoskurcz i trudności w oddychaniu', answers: ['tachycardia and difficulty breathing', 'tachycardia and dyspnea', 'tachycardia and shortness of breath'] },
  { targetCategory: 'Ćwiczenia — Tłumaczenia', q: 'Przetłumacz: szkoła rodzenia', answers: ['antenatal classes', 'childbirth classes', 'prenatal classes'] },
  { targetCategory: 'Ćwiczenia — Tłumaczenia', q: 'Przetłumacz na polski: resection of necrotic gut', answers: ['resekcja martwiczego jelita'] },
  { targetCategory: 'Ćwiczenia — Tłumaczenia', q: 'Przetłumacz na polski: steer clear of exertion', answers: ['unikać wysiłku', 'unikaj wysiłku'] },
  { targetCategory: 'Ćwiczenia — Tłumaczenia', q: 'Przetłumacz na polski: to twitch abruptly', answers: ['drgać gwałtownie', 'nagle drgnąć', 'gwałtownie drgnąć'] },
  { targetCategory: 'Ćwiczenia — Słowotwórstwo', q: 'Enlargement of the thyroid gland can be caused by iodine deficiency. ___ of the thyroid is called a goitre. [LARGE]', answers: ['enlargement'] },
  { targetCategory: 'Ćwiczenia — Słowotwórstwo', q: 'Cancer is characterized by the ___ of abnormal cells. [MULTIPLY, UNCONTROLLED]', answers: ['uncontrolled multiplication'] },
  { targetCategory: 'Ćwiczenia — Słowotwórstwo', q: 'The muscle contracted ___, without any conscious control. [VOLUNTARY]', answers: ['involuntarily'] },
  { targetCategory: 'Ćwiczenia — Słowotwórstwo', q: 'A poor diet can lead to ___ in children. [NUTRITION]', answers: ['malnutrition'] },
  { targetCategory: 'Ćwiczenia — Słowotwórstwo', q: 'Eating too quickly can cause ___. [DIGEST]', answers: ['indigestion'] },
  { targetCategory: 'Ćwiczenia — Uzupełnij zdanie', q: 'Przekształć zdanie zachowując znaczenie, używając słowa MIND: "Can I ask you a few questions?"', answers: ['Would you mind if I asked you a few questions?'] },
  { targetCategory: 'Ćwiczenia — Uzupełnij zdanie', q: 'Przekształć zdanie zachowując znaczenie, używając słowa HAVE: "He surely had taken his meds."', answers: ['He must have taken his meds.'] },
  { targetCategory: 'Ćwiczenia — Uzupełnij zdanie', q: 'Przekształć zdanie zachowując znaczenie, używając słowa FORWARD: "Declan cannot wait to get the vaccine."', answers: ['Declan is looking forward to getting the vaccine.', 'Declan is looking forward to getting his vaccine.'] },
  { targetCategory: 'Ćwiczenia — Uzupełnij zdanie', q: 'Przekształć zdanie zachowując znaczenie, używając słowa TOLD: "Claire didn\'t tell him, that\'s why he was upset."', answers: ["If Claire had told him, he wouldn't have been upset."] },
];

const raw = JSON.parse(fs.readFileSync('angielski_cwiczenia_raw.json', 'utf8'));
let added = 0;
for (const item of items) {
  raw.push({ category: item.targetCategory, mode: 'typed', q: item.q, answers: item.answers });
  raw.push({ category: GIELDA_CATEGORY, mode: 'typed', q: item.q, answers: item.answers });
  added += 2;
}
fs.writeFileSync('angielski_cwiczenia_raw.json', JSON.stringify(raw, null, 2));
console.log('dodano', items.length, 'unikalnych cwiczen (x2 =', added, 'wpisow). nowa dlugosc angielski_cwiczenia_raw.json:', raw.length);
