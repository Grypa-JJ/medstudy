// _detect_all_adjacencies.mjs
// Automatyczne wykrycie WSZYSTKICH par stykajacych sie kosci w calym szkielecie
// (203 kosci = ~20 503 par) - zamiast recznie wypisywac stawy, sprawdzamy
// geometrycznie kto kogo dotyka. Dwuetapowo dla wydajnosci:
//  1. Szybkie odrzucenie: bounding-box (z marginesem) musi sie nakladac.
//  2. Dla par ktore przejda etap 1: prawdziwy min-dystans wierzchol-wierzcholek.
// Pary z min-dystansem < THRESHOLD -> generuja powierzchnie stawowe (facet)
// na KAZDEJ z dwoch kosci (miejsce kontaktu z drugiej strony).
import fs from "fs";

const BONES_DIR = "r2_upload/atlas/szkielet";
const THRESHOLD = 5.0; // mm
const BBOX_MARGIN = 8.0; // mm - margines przy szybkim odrzuceniu bounding-box

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
function bbox(verts) {
    const min = [Infinity,Infinity,Infinity], max = [-Infinity,-Infinity,-Infinity];
    for (const v of verts) for (let i=0;i<3;i++){ if(v[i]<min[i]) min[i]=v[i]; if(v[i]>max[i]) max[i]=v[i]; }
    return { min, max };
}
function bboxOverlap(a, b, margin) {
    for (let i=0;i<3;i++) {
        if (a.max[i]+margin < b.min[i] || b.max[i]+margin < a.min[i]) return false;
    }
    return true;
}

const bones = JSON.parse(fs.readFileSync("all_bones_labeled.json", "utf-8"));
console.log(`Wczytywanie wierzcholkow dla ${bones.length} kosci...`);

const vertsById = new Map();
const bboxById = new Map();
for (const b of bones) {
    const verts = parseObjVertices(fs.readFileSync(`${BONES_DIR}/${b.id}.obj`, "utf-8"));
    vertsById.set(b.id, verts);
    bboxById.set(b.id, bbox(verts));
}
console.log("Wczytano.");

let candidatePairs = 0;
const touchingPairs = [];

for (let i = 0; i < bones.length; i++) {
    for (let j = i + 1; j < bones.length; j++) {
        const idA = bones[i].id, idB = bones[j].id;
        if (!bboxOverlap(bboxById.get(idA), bboxById.get(idB), BBOX_MARGIN)) continue;
        candidatePairs++;

        const vA = vertsById.get(idA), vB = vertsById.get(idB);
        let minD = Infinity;
        // szybkie zgrubne oszacowanie: probka co 4. wierzcholek do wstepnego sprawdzenia,
        // potem pelne sprawdzenie tylko jesli przyblizenie sugeruje bliskosc
        outer:
        for (let ai = 0; ai < vA.length; ai++) {
            for (let bi = 0; bi < vB.length; bi++) {
                const d = dist(vA[ai], vB[bi]);
                if (d < minD) minD = d;
                if (minD < 0.5) break outer; // wystarczajaco blisko, nie trzeba dalej szukac dokladniejszego minimum
            }
        }
        if (minD < THRESHOLD) {
            touchingPairs.push({ a: idA, b: idB, minDist: minD });
        }
    }
}

console.log(`Kandydatow (po bbox): ${candidatePairs}`);
console.log(`Stykajacych sie par: ${touchingPairs.length}`);
fs.writeFileSync("_atlas_pilot/touching_pairs.json", JSON.stringify(touchingPairs, null, 1));
