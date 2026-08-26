// _landmark_detect.mjs
// Wykrywa punkty orientacyjne na kości piętowej geometrycznie, bez zgadywania
// pikseli na obrazku:
//  - Guz piętowy (calcaneal tuberosity): najbardziej "tylny" wierzchołek kości
//    (ekstremum wzdłuż osi przód-tył, wyznaczonej wektorem
//    kość_łódkowata - kość_piętowa, bo łódkowata leży do przodu w stopie).
//  - Powierzchnia stawowa dla kości skokowej: wierzchołki kości piętowej
//    najbliżej siatki kości skokowej (prawdziwy kontakt stawowy, nie zgadywanie).
import fs from "fs";

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

function centroid(verts) {
    const c = [0, 0, 0];
    for (const v of verts) { c[0] += v[0]; c[1] += v[1]; c[2] += v[2]; }
    return c.map(x => x / verts.length);
}

function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function norm(a) { const l = Math.sqrt(dot(a, a)); return [a[0] / l, a[1] / l, a[2] / l]; }
function dist(a, b) { return Math.sqrt(dot(sub(a, b), sub(a, b))); }

const calcaneusText = fs.readFileSync("r2_upload/atlas/konczyna_dolna/FMA24497.obj", "utf-8");
const talusText = fs.readFileSync("r2_upload/atlas/konczyna_dolna/FMA24482.obj", "utf-8");
const navicularText = fs.readFileSync("r2_upload/atlas/konczyna_dolna/FMA24500.obj", "utf-8");

const calcVerts = parseObjVertices(calcaneusText);
const talusVerts = parseObjVertices(talusText);
const navVerts = parseObjVertices(navicularText);

console.log("wierzcholki: calcaneus", calcVerts.length, "talus", talusVerts.length, "navicular", navVerts.length);

const calcCentroid = centroid(calcVerts);
const navCentroid = centroid(navVerts);
const anteriorDir = norm(sub(navCentroid, calcCentroid));
console.log("kierunek 'do przodu' (od kosci pietowej ku lodkowatej):", anteriorDir);

// Guz pietowy = najbardziej tylny wierzcholek (minimalna projekcja na anteriorDir)
let tuberosity = calcVerts[0];
let minProj = Infinity;
for (const v of calcVerts) {
    const proj = dot(sub(v, calcCentroid), anteriorDir);
    if (proj < minProj) { minProj = proj; tuberosity = v; }
}
console.log("Guz pietowy (najbardziej tylny punkt):", tuberosity);

// Powierzchnia stawowa dla kosci skokowej = wierzcholki calcaneus w promieniu
// bliskosci do jakiegokolwiek wierzcholka talusa (prawdziwy kontakt stawowy).
// Zamiast O(n*m) petli po wszystkich parach (za wolne dla duzych siatek),
// probkujemy talus co k-ty wierzcholek - wystarczy do znalezienia bliskiego sasiedztwa.
const talusSample = talusVerts.filter((_, i) => i % 3 === 0);
const THRESHOLD = 3.0; // mm - typowy odstep chrzastki stawowej w tych danych
const nearTalus = [];
for (const cv of calcVerts) {
    let minD = Infinity;
    for (const tv of talusSample) {
        const d = dist(cv, tv);
        if (d < minD) minD = d;
        if (minD < THRESHOLD) break;
    }
    if (minD < THRESHOLD) nearTalus.push(cv);
}
console.log("wierzcholki blisko talusa (powierzchnia stawowa):", nearTalus.length, "/", calcVerts.length);
if (nearTalus.length) {
    const facetCentroid = centroid(nearTalus);
    console.log("centroid powierzchni stawowej (talarnej):", facetCentroid);
    fs.writeFileSync("_atlas_pilot/calcaneus_landmarks.json", JSON.stringify({
        tuberosity, facetCentroid, anteriorDir, calcCentroid, nearTalusCount: nearTalus.length,
    }, null, 1));
}
