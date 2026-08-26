// _generate_all_facets.mjs (v2 - poprawiona klasyfikacja typu polaczenia)
// Dla kazdej wykrytej stykajacej sie pary kosci generuje punkt kontaktu na
// KAZDEJ z dwoch stron, z etykieta zalezna od RODZAJU POLACZENIA - nie
// wszystkie kontakty miedzy kosciami to stawy maziowe (poprzednia wersja
// bledna: nazwala WSZYSTKIE kontakty "powierzchnia stawowa", co jest
// anatomicznie niepoprawne np. dla szwow czaszki, ktore sa polaczeniami
// wloknistymi/nieruchomymi, nie stawami).
import fs from "fs";

const BONES_DIR = "r2_upload/atlas/szkielet";
const THRESHOLD = 5.0;

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
function dist(a, b) { return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2); }
function centroid(verts) {
    const c = [0,0,0];
    for (const v of verts) { c[0]+=v[0]; c[1]+=v[1]; c[2]+=v[2]; }
    return c.map(x => x/verts.length);
}

const bones = JSON.parse(fs.readFileSync("all_bones_labeled.json", "utf-8"));
const boneById = new Map(bones.map(b => [b.id, b]));
const pairs = JSON.parse(fs.readFileSync("_atlas_pilot/touching_pairs.json", "utf-8"));

// ── Klasyfikacja typu polaczenia po ID kosci (nie po tekscie nazwy - pewniejsze) ──
const SKULL_IDS = new Set([
    "FMA9710","FMA52748","FMA52735","FMA52734","FMA52740","FMA52736",
    "FMA53646","FMA53645","FMA52892","FMA52893","FMA53655","FMA53656",
    "FMA54738","FMA54737","FMA53647","FMA53648","FMA52788","FMA52789",
    "FMA53649","FMA53650","FMA52739","FMA52738",
]);
const MANDIBLE_ID = "FMA52748";
const TEMPORAL_IDS = new Set(["FMA52738", "FMA52739"]);

// Kregi - wykryj po wzorcu w PL etykiecie (np. "kręg szyjny/piersiowy/lędźwiowy", "atlas", "axis")
function isVertebra(boneId) {
    const b = boneById.get(boneId);
    if (!b) return false;
    return /kręg (szyjny|piersiowy|lędźwiowy)|^Kręg szczytowy|^Kręg obrotowy/.test(b.pl);
}

function classify(idA, idB) {
    const aSkull = SKULL_IDS.has(idA), bSkull = SKULL_IDS.has(idB);
    if (aSkull && bSkull) {
        // Staw skroniowo-zuchwowy to JEDYNY prawdziwy staw w tej okolicy (zuchwa-kosc skroniowa)
        const isTMJ = (idA === MANDIBLE_ID && TEMPORAL_IDS.has(idB)) || (idB === MANDIBLE_ID && TEMPORAL_IDS.has(idA));
        if (isTMJ) return "joint_tmj";
        return "suture"; // szew - polaczenie wloknist, nieruchome
    }
    if (isVertebra(idA) && isVertebra(idB)) return "intervertebral"; // trzon-trzon (dysk) - nie staw maziowy
    return "joint"; // domyslnie: wiekszosc pozostalych kontaktow (konczyny, żebra-kręgi, krzyżowo-biodrowy) to prawdziwe stawy maziowe
}

function labelFor(kind, otherBonePl, otherBoneEn) {
    switch (kind) {
        case "suture":
            return { pl: `Szew (z: ${otherBonePl})`, en: `Suture (with: ${otherBoneEn})` };
        case "joint_tmj":
            return { pl: `Powierzchnia stawowa — staw skroniowo-żuchwowy (z: ${otherBonePl})`, en: `Articular surface — temporomandibular joint (with: ${otherBoneEn})` };
        case "intervertebral":
            return { pl: `Powierzchnia międzykręgowa (z: ${otherBonePl})`, en: `Intervertebral surface (with: ${otherBoneEn})` };
        default:
            return { pl: `Powierzchnia stawowa (z: ${otherBonePl})`, en: `Articular surface (with: ${otherBoneEn})` };
    }
}

const vertsCache = new Map();
function getVerts(id) {
    if (!vertsCache.has(id)) vertsCache.set(id, parseObjVertices(fs.readFileSync(`${BONES_DIR}/${id}.obj`, "utf-8")));
    return vertsCache.get(id);
}
function facetOn(idSelf, idOther) {
    const vSelf = getVerts(idSelf), vOther = getVerts(idOther);
    const near = [];
    for (const v of vSelf) {
        let minD = Infinity;
        for (const o of vOther) {
            const d = dist(v, o);
            if (d < minD) minD = d;
            if (minD < 0.3) break;
        }
        if (minD < THRESHOLD) near.push(v);
    }
    if (!near.length) return null;
    return centroid(near);
}

const results = [];
const kindCounts = {};
for (const pair of pairs) {
    const boneA = boneById.get(pair.a), boneB = boneById.get(pair.b);
    if (!boneA || !boneB) continue;
    const kind = classify(pair.a, pair.b);
    kindCounts[kind] = (kindCounts[kind] || 0) + 1;

    const posA = facetOn(pair.a, pair.b);
    if (posA) {
        const lbl = labelFor(kind, boneB.pl, boneB.en);
        results.push({ boneId: pair.a, pl: lbl.pl, en: lbl.en, pos: posA });
    }
    const posB = facetOn(pair.b, pair.a);
    if (posB) {
        const lbl = labelFor(kind, boneA.pl, boneA.en);
        results.push({ boneId: pair.b, pl: lbl.pl, en: lbl.en, pos: posB });
    }
}

console.log(`Wygenerowano ${results.length} punktow kontaktu.`);
console.log("Podzial wg typu polaczenia (liczba PAR, nie punktow):", JSON.stringify(kindCounts, null, 1));

fs.writeFileSync("_atlas_pilot/all_facets.json", JSON.stringify(results, null, 1));
