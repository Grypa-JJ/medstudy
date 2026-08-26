// _build_latin_lookup.mjs
// Buduje ta2_latin_lookup.json: mapa "angielska nazwa (lowercase, bez L/R)" ->
// "lacinska nazwa" z TA2.csv (Terminologia Anatomica 2, FIPAT). Dopasowanie po
// polu EN (nie PL), bo TA2.csv ma kolumne English, a nasze dane (bones +
// landmarks) maja juz pole "en" z BodyParts3D/FMA. Trzymane jako OSOBNY plik
// (nie wpisujemy "la" do all_bones_labeled.json/bone_landmarks.json), zeby nie
// kolidowac ze wspoldzielonymi plikami edytowanymi rownolegle w drugiej
// rozmowie.
import fs from "fs";

function normalizeEn(en) {
    return en
        .toLowerCase()
        .replace(/\s*\((left|right|l|r)\)\s*$/i, "")
        .replace(/,\s*(left|right)\s*$/i, "")
        .replace(/\b(right|left)\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function parseTA2(text) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const map = new Map();
    for (const line of lines) {
        // Kazda linia to JEDNO pole CSV w cudzyslowiu, wewnatrz ktorego kolumny
        // sa oddzielone ";" - usuwamy otaczajace cudzyslowy, potem splitujemy.
        const inner = line.replace(/^"|"$/g, "");
        const cols = inner.split(";");
        if (cols.length < 3) continue;
        const [ta2id, english, latin] = cols;
        if (ta2id === "TA2ID") continue; // naglowek
        if (!english || !latin) continue;
        const key = normalizeEn(english);
        if (!map.has(key)) map.set(key, latin.trim());
    }
    return map;
}

const ta2Text = fs.readFileSync("TA2.csv", "utf-8");
const ta2Map = parseTA2(ta2Text);
console.log(`TA2.csv: ${ta2Map.size} unikalnych terminow EN->LA.`);

// Normalizacja naszych nazw EN: usun sufiksy strony "(left)"/"(right)"/"(l)"/
// "(r)" oraz odmiany typu ", left"/", right" - zeby "Radius (left)" i "Radius"
// trafily w ten sam klucz TA2 "radius".
function normalizeEn(en) {
    return en
        .toLowerCase()
        .replace(/\s*\((left|right|l|r)\)\s*$/i, "")
        .replace(/,\s*(left|right)\s*$/i, "")
        // BodyParts3D/FMA koduje strone jako osobne slowo ("right"/"left")
        // gdziekolwiek w nazwie ("right femur", "navicular bone of right
        // foot"); TA2 nie rozroznia strony w ogole - usuwamy to slowo wszedzie.
        .replace(/\b(right|left)\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

const bones = JSON.parse(fs.readFileSync("all_bones_labeled.json", "utf-8"));
const landmarks = JSON.parse(fs.readFileSync("bone_landmarks.json", "utf-8"));

const lookup = {}; // znormalizowany-en -> lacina
let boneMatches = 0, lmMatches = 0;
const unmatchedBones = [];

for (const b of bones) {
    const key = normalizeEn(b.en);
    if (ta2Map.has(key)) { lookup[key] = ta2Map.get(key); boneMatches++; }
    else unmatchedBones.push(b.en);
}
for (const lm of landmarks) {
    const key = normalizeEn(lm.en);
    if (ta2Map.has(key)) { lookup[key] = ta2Map.get(key); lmMatches++; }
}

console.log(`Kosci: ${boneMatches}/${bones.length} dopasowanych.`);
console.log(`Punkty orientacyjne: ${lmMatches}/${landmarks.length} dopasowanych.`);
console.log(`Lacznie kluczy w slowniku: ${Object.keys(lookup).length}`);
console.log("Przyklad niedopasowanych kosci (pierwsze 15):", unmatchedBones.slice(0, 15));

fs.writeFileSync("ta2_latin_lookup.json", JSON.stringify(lookup));
