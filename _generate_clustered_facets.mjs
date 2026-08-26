// _generate_clustered_facets.mjs
// Ulepszona wersja _generate_all_facets.mjs: zamiast JEDNEGO centroidu ze
// wszystkich wierzcholkow-w-kontakcie miedzy para kosci, GRUPUJE je w osobne
// skupiska (BFS, prog 3mm - zweryfikowane na parze pieta-skokowa: daje ~3-4
// sensowne skupiska odpowiadajace prawdziwym oddzielnym powierzchniom
// stawowym, np. przednia/srodkowa/tylna powierzchnia skokowa pietowa z
// dokladnie tego przykladu w slowniku). Kazde skupisko >= MIN_CLUSTER_SIZE
// wierzcholkow dostaje WLASNY punkt (centroid tego skupiska), z numerem
// porzadkowym w nazwie jesli jest ich wiecej niz 1.
import fs from "fs";

const BONES_DIR = "r2_upload/atlas/szkielet";
const THRESHOLD = 5.0;
const CLUSTER_DIST = 3.0;
const MIN_CLUSTER_SIZE = 10; // wieksze niz przedtem - odrzuca drobny szum siatki, nie tylko male-ale-realne skupiska
const MAX_CLUSTERS_PER_SIDE = 3; // brzytwa Ockhama: student nie bedzie przeklikiwac 10+ "szwow" miedzy tymi samymi 2 koscmi

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

const SKULL_IDS = new Set([
    "FMA9710","FMA52748","FMA52735","FMA52734","FMA52740","FMA52736",
    "FMA53646","FMA53645","FMA52892","FMA52893","FMA53655","FMA53656",
    "FMA54738","FMA54737","FMA53647","FMA53648","FMA52788","FMA52789",
    "FMA53649","FMA53650","FMA52739","FMA52738",
]);
const MANDIBLE_ID = "FMA52748";
const TEMPORAL_IDS = new Set(["FMA52738", "FMA52739"]);
function isVertebra(boneId) {
    const b = boneById.get(boneId);
    return b && /kręg (szyjny|piersiowy|lędźwiowy)|^Kręg szczytowy|^Kręg obrotowy/.test(b.pl);
}
function classify(idA, idB) {
    const aSkull = SKULL_IDS.has(idA), bSkull = SKULL_IDS.has(idB);
    if (aSkull && bSkull) {
        const isTMJ = (idA === MANDIBLE_ID && TEMPORAL_IDS.has(idB)) || (idB === MANDIBLE_ID && TEMPORAL_IDS.has(idA));
        return isTMJ ? "joint_tmj" : "suture";
    }
    if (isVertebra(idA) && isVertebra(idB)) return "intervertebral";
    return "joint";
}
function labelFor(kind, otherBonePl, otherBoneEn, idx, total) {
    const numSuf = total > 1 ? ` ${idx+1}/${total}` : "";
    switch (kind) {
        case "suture": return { pl: `Szew${numSuf} (z: ${otherBonePl})`, en: `Suture${numSuf} (with: ${otherBoneEn})` };
        case "joint_tmj": return { pl: `Powierzchnia stawowa — staw skroniowo-żuchwowy${numSuf} (z: ${otherBonePl})`, en: `Articular surface — TMJ${numSuf} (with: ${otherBoneEn})` };
        case "intervertebral": return { pl: `Powierzchnia międzykręgowa${numSuf} (z: ${otherBonePl})`, en: `Intervertebral surface${numSuf} (with: ${otherBoneEn})` };
        default: return { pl: `Powierzchnia stawowa${numSuf} (z: ${otherBonePl})`, en: `Articular surface${numSuf} (with: ${otherBoneEn})` };
    }
}

const vertsCache = new Map();
function getVerts(id) {
    if (!vertsCache.has(id)) vertsCache.set(id, parseObjVertices(fs.readFileSync(`${BONES_DIR}/${id}.obj`, "utf-8")));
    return vertsCache.get(id);
}

// Dla szwow/dyskow: JEDEN centroid ze WSZYSTKICH stykajacych sie wierzcholkow
// (stara logika sprzed klastrowania) - to jedno ciagle polaczenie, nie kilka.
function centroidOfAll(idSelf, idOther) {
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
    return near.length ? centroid(near) : null;
}

// Zwraca liste centroidow oddzielnych skupisk (zamiast 1 sredniej).
function clusteredFacets(idSelf, idOther) {
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
    if (!near.length) return [];

    const visited = new Array(near.length).fill(false);
    const clusters = [];
    for (let i = 0; i < near.length; i++) {
        if (visited[i]) continue;
        const stack = [i]; visited[i] = true; const comp = [i];
        while (stack.length) {
            const cur = stack.pop();
            for (let j = 0; j < near.length; j++) {
                if (!visited[j] && dist(near[cur], near[j]) < CLUSTER_DIST) { visited[j] = true; stack.push(j); comp.push(j); }
            }
        }
        clusters.push(comp);
    }
    return clusters
        .filter(c => c.length >= MIN_CLUSTER_SIZE)
        .sort((a, b) => b.length - a.length)
        .slice(0, MAX_CLUSTERS_PER_SIDE)
        .map(c => centroid(c.map(i => near[i])));
}

const results = [];
const kindCounts = {};
let totalClustersFound = 0, singleClusterPairs = 0, multiClusterPairs = 0;

for (const pair of pairs) {
    const boneA = boneById.get(pair.a), boneB = boneById.get(pair.b);
    if (!boneA || !boneB) continue;
    const kind = classify(pair.a, pair.b);
    kindCounts[kind] = (kindCounts[kind] || 0) + 1;

    // Szew/dysk miedzykregowy to jedno CIAGLE polaczenie anatomicznie, nie kilka
    // oddzielnych powierzchni - klastrowanie tam tylko dzieli linie szwu na
    // przypadkowe kawalki wg siatki. Tylko prawdziwe stawy moga miec >1 punkt.
    const allowMulti = kind === "joint" || kind === "joint_tmj";
    let clustersA, clustersB;
    if (allowMulti) {
        clustersA = clusteredFacets(pair.a, pair.b);
        clustersB = clusteredFacets(pair.b, pair.a);
    } else {
        const cA = centroidOfAll(pair.a, pair.b);
        const cB = centroidOfAll(pair.b, pair.a);
        clustersA = cA ? [cA] : [];
        clustersB = cB ? [cB] : [];
    }
    if (clustersA.length > 1 || clustersB.length > 1) multiClusterPairs++; else if (clustersA.length===1 && clustersB.length===1) singleClusterPairs++;
    totalClustersFound += clustersA.length + clustersB.length;

    clustersA.forEach((pos, idx) => {
        const lbl = labelFor(kind, boneB.pl, boneB.en, idx, clustersA.length);
        results.push({ boneId: pair.a, pl: lbl.pl, en: lbl.en, pos });
    });
    clustersB.forEach((pos, idx) => {
        const lbl = labelFor(kind, boneA.pl, boneA.en, idx, clustersB.length);
        results.push({ boneId: pair.b, pl: lbl.pl, en: lbl.en, pos });
    });
}

console.log(`Wygenerowano ${results.length} punktow kontaktu (bylo 726 w wersji bez klastrowania).`);
console.log(`Pary z wieloma skupiskami: ${multiClusterPairs}, z jednym: ${singleClusterPairs}`);
console.log("Podzial wg typu polaczenia:", JSON.stringify(kindCounts, null, 1));

fs.writeFileSync("_atlas_pilot/all_facets_clustered.json", JSON.stringify(results, null, 1));
