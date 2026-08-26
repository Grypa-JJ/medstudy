// _build_all_bones.mjs
// Rozszerza zestaw kosci z 31 (konczyna dolna) do pelnego szkieletu (241 kosci).
// Laczy 3 zrodla nazw PL, w kolejnosci priorytetu:
//  1. juz zrobione recznie (lower_limb_bones_labeled.json)
//  2. automatyczne dopasowanie do slownika UMed (po normalizacji stronnosci)
//  3. regularne wzorce (kregi, zebra, kosci srodreka/srodstopia, paliczki) -
//     generowane programowo wg polskiej konwencji anatomicznej
//  4. reczna lista dla pozostalych unikalnych przypadkow
import fs from "fs";

const ORDINAL_EN_TO_NUM = {
    first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7,
    eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12,
};
const ORDINAL_PL_M = ["", "pierwszy", "drugi", "trzeci", "czwarty", "piąty", "szósty", "siódmy", "ósmy", "dziewiąty", "dziesiąty", "jedenasty", "dwunasty"];
const ORDINAL_PL_ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const SIDE_PL = { right: "prawa", left: "lewa" };
const SIDE_PL_M = { right: "prawy", left: "lewy" };

function stripSide(en) {
    const m = en.match(/^(right|left)\s+(.*)$/);
    return m ? { side: m[1], rest: m[2] } : { side: null, rest: en };
}

// Zwraca nazwe PL dla wzorcow regularnych, albo null jesli nie pasuje.
function patternMatch(en) {
    const low = en.toLowerCase();
    const { side, rest } = stripSide(low);

    // Kregi: "ninth thoracic vertebra", "atlas", "axis"
    if (rest === "atlas") return "Kręg szczytowy (atlas)";
    if (rest === "axis") return "Kręg obrotowy (axis)";
    let m = rest.match(/^(\w+)\s+(thoracic|cervical|lumbar)\s+vertebra$/);
    if (m) {
        const num = ORDINAL_EN_TO_NUM[m[1]];
        const region = { thoracic: "piersiowy", cervical: "szyjny", lumbar: "lędźwiowy" }[m[2]];
        const abbrev = { thoracic: "Th", cervical: "C", lumbar: "L" }[m[2]];
        return `${num}. kręg ${region} (${abbrev}${num})`;
    }
    // Zebra: "second rib" / z boczna: "right second rib" - "zebro" jest rodzaju
    // nijakiego (prawE/lewE), nie zenskiego jak wiekszosc "kosci".
    m = rest.match(/^(\w+)\s+rib$/);
    if (m && side) {
        const num = ORDINAL_EN_TO_NUM[m[1]];
        const sideN = side === "right" ? "prawe" : "lewe";
        return `${num}. żebro ${sideN}`;
    }
    // Kosci srodreka: "right first metacarpal bone"
    m = rest.match(/^(\w+)\s+metacarpal bone$/);
    if (m && side) {
        const num = ORDINAL_PL_ROMAN[ORDINAL_EN_TO_NUM[m[1]]];
        return `${num} kość śródręcza (${SIDE_PL[side]})`;
    }
    // Kosci srodstopia: "left first metatarsal bone" (te bez recznej etykiety)
    m = rest.match(/^(\w+)\s+metatarsal bone$/);
    if (m && side) {
        const num = ORDINAL_PL_ROMAN[ORDINAL_EN_TO_NUM[m[1]]];
        return `${num} kość śródstopia (${SIDE_PL[side]})`;
    }
    // Paliczki reki: "middle phalanx of left ring finger" - stronnosc jest PO
    // "of", nie na poczatku calego stringa, wiec dopasuj wprost na `low` (przed stripSide).
    m = low.match(/^(proximal|middle|distal)\s+phalanx\s+of\s+(right|left)\s+(thumb|index|middle|ring|little)(?:\s+finger)?$/);
    if (m) {
        const part = { proximal: "bliższy", middle: "środkowy", distal: "dalszy" }[m[1]];
        const fingerNames = { thumb: "kciuka", index: "palca wskazującego", middle: "palca środkowego", ring: "palca serdecznego", little: "palca małego" };
        const fingerPl = fingerNames[m[3]];
        const sideF = m[2] === "right" ? "prawa" : "lewa";
        return `Paliczek ${part} ${fingerPl} (ręka ${sideF})`;
    }
    // Paliczki stopy - brakujace warianty lewej stopy (prawa juz recznie w
    // histologia_praktyczny... nie, w lower_limb_bones_labeled.json).
    m = low.match(/^(proximal|middle|distal)\s+phalanx\s+of\s+(right|left)\s+(big toe|second toe|third toe|fourth toe|little toe)$/);
    if (m) {
        const part = { proximal: "bliższy", middle: "środkowy", distal: "dalszy" }[m[1]];
        const toeNames = { "big toe": "palucha", "second toe": "II palca stopy", "third toe": "III palca stopy", "fourth toe": "IV palca stopy", "little toe": "V palca stopy" };
        const toeName = toeNames[m[3]];
        const sideF = m[2] === "right" ? "prawa" : "lewa";
        return `Paliczek ${part} ${toeName} (stopa ${sideF})`;
    }
    return null;
}

const MANUAL = {
    "triquetral": "Kość trójgraniasta",
    "right triquetral": "Kość trójgraniasta (prawa)",
    "left triquetral": "Kość trójgraniasta (lewa)",
    "lateral cuneiform bone": "Kość klinowata boczna",
    "left lateral cuneiform bone": "Kość klinowata boczna (lewa)",
    "cuboid bone": "Kość sześcienna",
    "left cuboid bone": "Kość sześcienna (lewa)",
    "intermediate cuneiform bone": "Kość klinowata pośrednia",
    "left intermediate cuneiform bone": "Kość klinowata pośrednia (lewa)",
    "medial cuneiform bone": "Kość klinowata przyśrodkowa",
    "left medial cuneiform bone": "Kość klinowata przyśrodkowa (lewa)",
    "navicular bone of foot": "Kość łódkowata (stopy)",
    "navicular bone of left foot": "Kość łódkowata (lewej stopy)",
    "sesamoid bone of left foot": "Kość trzeszczkowata (lewej stopy)",
    "sesamoid bone of right foot": "Kość trzeszczkowata (prawej stopy)",
    "left first metatarsal bone": "I kość śródstopia (lewa)",
    "vertebral column": "Kręgosłup",
    "manubrium": "Rękojeść mostka",
    "ethmoid": "Kość sitowa",
    "pneumatized bone": null, // kategoria typu kosci, nie konkretna struktura - pomin
    "sacrum": "Kość krzyżowa", // slownik ma dwa wpisy dla "Sacrum" - pierwszy (strona 40) to zlozony
    // wpis "Sacrum; Sacral vertebrae" z doklejonym opisem kregow, nadpisujemy czystym (strona 59)
    "second rib": "2. żebro", // ujednolicenie stylu z reszta zeber (3-12), zamiast slownikowego "Zebro drugie"
    "first rib": "1. żebro", // jw., zamiast slownikowego "Pierwsze żebro"
};

function resolvePl(en, slownikMap) {
    const key = en.toLowerCase().split(";")[0].split(",")[0].trim().replace(/^(right|left)\s+/, "").trim();
    // MANUAL ma pierwszenstwo przed slownikiem - kilka wpisow slownika ma
    // doklejone dodatkowe opisy (np. "Sacrum; Sacral vertebrae...") albo inny
    // styl niz reszta analogicznych struktur (np. "Pierwsze żebro" vs "2. żebro").
    if (MANUAL[key] !== undefined) return MANUAL[key];
    if (MANUAL[en.toLowerCase()] !== undefined) return MANUAL[en.toLowerCase()];
    if (slownikMap.has(key)) return slownikMap.get(key);
    const pat = patternMatch(en);
    if (pat) return pat;
    return null;
}

const slownik = JSON.parse(fs.readFileSync("slownik_anatomiczny_umed_pl_en.json", "utf-8"));
const slownikMap = new Map();
for (const e of slownik) {
    const key = e.en.toLowerCase().split(";")[0].split(",")[0].trim().replace(/^(right|left)\s+/, "").trim();
    if (!slownikMap.has(key)) slownikMap.set(key, e.pl);
}

const remaining = JSON.parse(fs.readFileSync("_atlas_pilot/remaining_bones.json", "utf-8"));
const alreadyDone = JSON.parse(fs.readFileSync("lower_limb_bones_labeled.json", "utf-8"));

const newlyLabeled = [];
const stillMissing = [];
for (const b of remaining) {
    const pl = resolvePl(b.en, slownikMap);
    if (pl === null && MANUAL[b.en.toLowerCase()] === null) continue; // swiadomie pominiete (kategoria, nie struktura)
    if (pl) newlyLabeled.push({ id: b.id, en: b.en, pl });
    else stillMissing.push(b);
}

console.log("nowo wyznaczonych PL:", newlyLabeled.length);
console.log("dalej brakuje:", stillMissing.length);
console.log(stillMissing.map(m => m.id + " | " + m.en).join("\n"));

fs.writeFileSync("_atlas_pilot/newly_labeled_bones.json", JSON.stringify(newlyLabeled, null, 1));
fs.writeFileSync("_atlas_pilot/still_missing_bones.json", JSON.stringify(stillMissing, null, 1));
