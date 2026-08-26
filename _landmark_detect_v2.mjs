// _landmark_detect_v2.mjs
// Generalna wersja _landmark_detect.mjs - dwa typy wykrywania geometrycznego,
// stosowane na wielu parach/kosciach naraz zamiast recznie dla jednej:
//  1. Powierzchnie stawowe: dla kazdej pary sasiadujacych kosci, wierzcholki
//     KAZDEJ z nich najblizsze drugiej (prawdziwy kontakt, nie zgadywanie).
//  2. Punkty ekstremalne: najdalszy wierzcholek danej kosci wzdluz osi
//     wyznaczonej wektorem do wskazanej kosci-referencji (np. "najbardziej
//     boczny punkt kosci udowej" = ekstremum wzdluz osi biodro->kolano, w strone przeciwna).
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
function loadVerts(id) {
    return parseObjVertices(fs.readFileSync(`${BONES_DIR}/${id}.obj`, "utf-8"));
}
function centroid(verts) {
    const c = [0, 0, 0];
    for (const v of verts) { c[0] += v[0]; c[1] += v[1]; c[2] += v[2]; }
    return c.map(x => x / verts.length);
}
function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function norm(a) { const l = Math.sqrt(dot(a, a)); return l > 0 ? [a[0] / l, a[1] / l, a[2] / l] : [0, 0, 0]; }
function dist(a, b) { return Math.sqrt(dot(sub(a, b), sub(a, b))); }

const vertsCache = new Map();
function getVerts(id) {
    if (!vertsCache.has(id)) vertsCache.set(id, loadVerts(id));
    return vertsCache.get(id);
}

// Zwraca centroid wierzcholkow bonA najblizszych bonB (prog w mm). Bez
// probkowania (pelne O(n*m)) - siatki sa male (setki-kilka tys. wierzcholkow),
// a wczesniejsze probkowanie co 3. wierzcholek zawyzalo wykryty min-dystans i
// gubilo pary, ktore naprawde sie stykaja (np. strzalka-skokowa, 2.7mm).
function articularFacet(idA, idB, threshold = 5.0) {
    const vA = getVerts(idA);
    const vB = getVerts(idB);
    const near = [];
    for (const va of vA) {
        let minD = Infinity;
        for (const vb of vB) {
            const d = dist(va, vb);
            if (d < minD) minD = d;
        }
        if (minD < threshold) near.push(va);
    }
    if (!near.length) return null;
    return { pos: centroid(near), count: near.length };
}

// Zwraca najdalszy wierzcholek `boneId` wzdluz kierunku (od centroidu boneId
// do centroidu refBoneId), z opcjonalnym odwroceniem (sign=-1 -> przeciwny kierunek).
function extremePoint(boneId, refBoneId, sign = 1) {
    const verts = getVerts(boneId);
    const c = centroid(verts);
    const refC = centroid(getVerts(refBoneId));
    const dir = norm(sub(refC, c));
    let best = verts[0];
    let bestProj = -Infinity;
    for (const v of verts) {
        const proj = sign * dot(sub(v, c), dir);
        if (proj > bestProj) { bestProj = proj; best = v; }
    }
    return best;
}

// ── Definicje ──
// Powierzchnie stawowe - pary sasiadujacych kosci glownych stawow konczyny
// dolnej (prawa strona, zeby pasowaly do reszty zestawu).
const JOINT_PAIRS = [
    { a: "FMA16586", an: "Powierzchnia stawowa panewki (staw biodrowy)", b: "FMA24474", bn: "Głowa kości udowej (powierzchnia stawowa)" }, // hip bone <-> femur
    { a: "FMA24474", an: "Powierzchnia stawowa kłykcia kości udowej (staw kolanowy)", b: "FMA24477", bn: "Powierzchnia stawowa górna piszczeli (staw kolanowy)" }, // femur <-> tibia
    { a: "FMA24474", an: "Powierzchnia rzepkowa kości udowej", b: "FMA24486", bn: "Powierzchnia stawowa rzepki" }, // femur <-> patella
    { a: "FMA24477", an: "Powierzchnia stawowa strzałkowa piszczeli (staw piszczelowo-strzałkowy)", b: "FMA24480", bn: "Powierzchnia stawowa piszczelowa strzałki" }, // tibia <-> fibula
    { a: "FMA24477", an: "Powierzchnia stawowa dolna piszczeli (staw skokowo-goleniowy)", b: "FMA24482", bn: "Powierzchnia stawowa bloczka kości skokowej (górna)" }, // tibia <-> talus
    { a: "FMA24480", an: "Powierzchnia stawowa kostki bocznej", b: "FMA24482", bn: "Powierzchnia stawowa boczna kości skokowej" }, // fibula <-> talus
    { a: "FMA24482", an: "Powierzchnia stawowa dla kości łódkowatej", b: "FMA24500", bn: "Powierzchnia stawowa dla kości skokowej (kość łódkowata)" }, // talus <-> navicular
];

// Punkty ekstremalne - klasyczne wyrostki/krętarze, latwe do zdefiniowania
// przez os anatomiczna (kierunek do sasiadujacej kosci).
const EXTREME_POINTS = [
    // Krętarz większy: bocznie od trzonu, mniej wiecej na wysokosci szyjki -
    // przyblizamy jako ekstremum W STRONE PRZECIWNA do kosci piszczelowej
    // (czyli "do gory i na bok") nie jest idealne dla samej lateralnosci, ale
    // krętarz wiekszy jest najbardziej bocznym/gornym wystajacym punktem trzonu.
    { id: "FMA24474", ref: "FMA16586", sign: 1, pl: "Krętarz większy (przybliżenie)", en: "Greater trochanter (approx.)" },
    { id: "FMA24477", ref: "FMA24500", sign: -1, pl: "Guzowatość piszczeli", en: "Tibial tuberosity" },
];

const results = [];

for (const jp of JOINT_PAIRS) {
    const facetA = articularFacet(jp.a, jp.b);
    if (facetA) results.push({ boneId: jp.a, pl: jp.an, en: jp.an, pos: facetA.pos, method: "facet", verts: facetA.count });
    const facetB = articularFacet(jp.b, jp.a);
    if (facetB) results.push({ boneId: jp.b, pl: jp.bn, en: jp.bn, pos: facetB.pos, method: "facet", verts: facetB.count });
}

for (const ep of EXTREME_POINTS) {
    const pos = extremePoint(ep.id, ep.ref, ep.sign);
    results.push({ boneId: ep.id, pl: ep.pl, en: ep.en, pos, method: "extreme" });
}

console.log(`Wygenerowano ${results.length} punktow orientacyjnych.`);
for (const r of results) console.log(`  [${r.method}] ${r.boneId}: ${r.pl}${r.verts ? ` (${r.verts} wierzcholkow)` : ""}`);

fs.writeFileSync("_atlas_pilot/landmarks_v2.json", JSON.stringify(results, null, 1));
