// _landmarks_batch2.mjs
// Kolejna partia recznie zdefiniowanych punktow (region+kierunek anatomiczny):
// piszczel/strzalka (reszta), kosc ramienna, lopatka, promieniowa, lokciowa.
// Te same osie co femur/hip (zweryfikowane empirycznie): przysrodkowa=+Y,
// boczna=-Y, przednia=-X, tylna=+X, gorna=+Z, dolna=-Z - dla calego ciala w tym
// modelu (prawa strona = ujemne Y, sprawdzone na humerus/scapula centroid tez).
import fs from "fs";

const BONES_DIR = "r2_upload/atlas/szkielet";

function parseObjVertices(text) {
    const verts = [];
    for (const line of text.split("\n")) {
        if (line.startsWith("v ")) {
            const [, x, y, z] = line.trim().split(/\s+/);
            verts.push([parseFloat(x), parseFloat(y), parseFloat(z)]);
        }
    }
    return verts;
}
const vertsCache = new Map();
function getVerts(id) {
    if (!vertsCache.has(id)) vertsCache.set(id, parseObjVertices(fs.readFileSync(`${BONES_DIR}/${id}.obj`, "utf-8")));
    return vertsCache.get(id);
}
function zRange(verts) {
    let min = Infinity, max = -Infinity;
    for (const v of verts) { if (v[2] < min) min = v[2]; if (v[2] > max) max = v[2]; }
    return { min, max };
}
function extremeInRegion(boneId, direction, zFilter) {
    const verts = getVerts(boneId);
    const { min, max } = zRange(verts);
    let best = null, bestProj = -Infinity;
    for (const v of verts) {
        if (zFilter && !zFilter(v[2], min, max)) continue;
        const proj = v[0]*direction[0] + v[1]*direction[1] + v[2]*direction[2];
        if (proj > bestProj) { bestProj = proj; best = v; }
    }
    return best;
}

const MEDIAL = [1,0,0], LATERAL = [-1,0,0], ANTERIOR = [0,-1,0], POSTERIOR = [0,1,0], SUPERIOR=[0,0,1];

const results = [];
function add(boneId, pl, en, pos) {
    if (!pos) { console.warn(`  POMINIETO: ${pl}`); return; }
    results.push({ boneId, pl, en, pos });
}

// ── Piszczel (tibia) FMA24477 - juz mamy guzowatosc + facety stawowe ──
const TIBIA = "FMA24477";
const tTop = (z,mn,mx) => z > mx-(mx-mn)*0.12;
const tBottom = (z,mn,mx) => z < mn+(mx-mn)*0.12;
add(TIBIA, "Kłykieć przyśrodkowy piszczeli", "Medial condyle of tibia", extremeInRegion(TIBIA, MEDIAL, tTop));
add(TIBIA, "Kłykieć boczny piszczeli", "Lateral condyle of tibia", extremeInRegion(TIBIA, LATERAL, tTop));
add(TIBIA, "Kostka przyśrodkowa", "Medial malleolus", extremeInRegion(TIBIA, MEDIAL, tBottom));

// ── Strzalka (fibula) FMA24480 ──
const FIBULA = "FMA24480";
const fTop = (z,mn,mx) => z > mx-(mx-mn)*0.10;
const fBottom = (z,mn,mx) => z < mn+(mx-mn)*0.10;
add(FIBULA, "Głowa strzałki", "Head of fibula", extremeInRegion(FIBULA, SUPERIOR, fTop));
add(FIBULA, "Kostka boczna", "Lateral malleolus", extremeInRegion(FIBULA, LATERAL, fBottom));

// ── Kosc ramienna (humerus) FMA23130 - prawa, gorna=blizej barku, dolna=blizej lokcia ──
const HUMERUS = "FMA23130";
const hTop = (z,mn,mx) => z > mx-(mx-mn)*0.15;
const hBottom = (z,mn,mx) => z < mn+(mx-mn)*0.15;
const hMidShaft = (z,mn,mx) => z > mn+(mx-mn)*0.40 && z < mx-(mx-mn)*0.40;
add(HUMERUS, "Guzek większy", "Greater tubercle", extremeInRegion(HUMERUS, LATERAL, hTop));
add(HUMERUS, "Guzek mniejszy", "Lesser tubercle", extremeInRegion(HUMERUS, ANTERIOR, hTop));
add(HUMERUS, "Guzowatość naramienna", "Deltoid tuberosity", extremeInRegion(HUMERUS, LATERAL, hMidShaft));
add(HUMERUS, "Nadkłykieć przyśrodkowy (ramię)", "Medial epicondyle (humerus)", extremeInRegion(HUMERUS, MEDIAL, hBottom));
add(HUMERUS, "Nadkłykieć boczny (ramię)", "Lateral epicondyle (humerus)", extremeInRegion(HUMERUS, LATERAL, hBottom));
add(HUMERUS, "Główka kości ramiennej (capitulum)", "Capitulum of humerus", extremeInRegion(HUMERUS, [-1,0,-1], hBottom));
add(HUMERUS, "Bloczek kości ramiennej (trochlea)", "Trochlea of humerus", extremeInRegion(HUMERUS, [1,0,-1], hBottom));

// ── Lopatka (scapula) FMA13395 - os Z tu mniej znaczaca (plaska kosc), ale
// gorna czesc (bark) wciaz ma wyzsze Z niz dolny kat ──
const SCAPULA = "FMA13395";
const scTop = (z,mn,mx) => z > mx-(mx-mn)*0.20;
add(SCAPULA, "Wyrostek barkowy (akromion)", "Acromion", extremeInRegion(SCAPULA, [-1,0,1], scTop));
add(SCAPULA, "Wyrostek kruczy", "Coracoid process", extremeInRegion(SCAPULA, [0,-1,0.5], scTop));
add(SCAPULA, "Kąt dolny łopatki", "Inferior angle of scapula", extremeInRegion(SCAPULA, [0,0,-1], null));

// ── Kosc promieniowa (radius) FMA23464 - gorna=blizej lokcia, dolna=blizej nadgarstka ──
const RADIUS = "FMA23464";
const rTop = (z,mn,mx) => z > mx-(mx-mn)*0.15;
const rBottom = (z,mn,mx) => z < mn+(mx-mn)*0.12;
add(RADIUS, "Guzowatość promieniowa", "Radial tuberosity", extremeInRegion(RADIUS, ANTERIOR, rTop));
add(RADIUS, "Wyrostek rylcowaty kości promieniowej", "Styloid process of radius", extremeInRegion(RADIUS, LATERAL, rBottom));

// ── Kosc lokciowa (ulna) FMA23467 - gorna=blizej lokcia, dolna=blizej nadgarstka ──
const ULNA = "FMA23467";
const uTop = (z,mn,mx) => z > mx-(mx-mn)*0.10;
const uBottom = (z,mn,mx) => z < mn+(mx-mn)*0.10;
add(ULNA, "Wyrostek łokciowy", "Olecranon", extremeInRegion(ULNA, [0,0.3,1], uTop));
add(ULNA, "Wyrostek dziobiasty", "Coronoid process", extremeInRegion(ULNA, [0,-1,0.3], uTop));
add(ULNA, "Wyrostek rylcowaty kości łokciowej", "Styloid process of ulna", extremeInRegion(ULNA, MEDIAL, uBottom));

console.log(`Wygenerowano ${results.length} punktow.`);
for (const r of results) console.log(`  ${r.boneId}: ${r.pl} @ [${r.pos.map(x=>x.toFixed(1))}]`);

fs.writeFileSync("_atlas_pilot/landmarks_batch2.json", JSON.stringify(results, null, 1));
