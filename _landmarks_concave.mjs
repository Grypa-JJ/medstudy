// _landmarks_concave.mjs
// Punkty wklesle (doly/bruzdy) - krzywizna proxy (srednia projekcja wektora
// do sasiada na wlasna normalna, w promieniu R). Dodatnia = wklesle.
// Plus "szyjka" jako interpolacja miedzy dwoma juz znanymi punktami (nie
// ekstremum ani krzywizna - to po prostu punkt W POLOWIE drogi).
import fs from "fs";

const BONES_DIR = "r2_upload/atlas/szkielet";

function parseObjVertsAndNormals(text) {
    const verts = [], normals = [];
    let pendingNormal = null;
    for (const line of text.split("\n")) {
        if (line.startsWith("vn ")) {
            const [, x, y, z] = line.trim().split(/\s+/);
            pendingNormal = [parseFloat(x), parseFloat(y), parseFloat(z)];
        } else if (line.startsWith("v ")) {
            const [, x, y, z] = line.trim().split(/\s+/);
            verts.push([parseFloat(x), parseFloat(y), parseFloat(z)]);
            normals.push(pendingNormal);
        }
    }
    return { verts, normals };
}
function sub(a,b){ return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]; }
function dot(a,b){ return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
function len(a){ return Math.sqrt(dot(a,a)); }
function mid(a,b){ return [(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2]; }

// Zwraca centroid TOP-K najbardziej wklesnych punktow w regionie (usredniamy
// zamiast brac pojedynczy punkt - mniej szumu niz pojedyncze ekstremum).
function mostConcaveInRegion(boneId, regionFilter, radius = 8.0, topK = 5) {
    const { verts, normals } = parseObjVertsAndNormals(fs.readFileSync(`${BONES_DIR}/${boneId}.obj`, "utf-8"));
    const candidates = [];
    for (let i = 0; i < verts.length; i++) {
        if (regionFilter && !regionFilter(verts[i])) continue;
        let sum = 0, count = 0;
        for (let j = 0; j < verts.length; j++) {
            if (i === j) continue;
            const d = sub(verts[j], verts[i]);
            const dist = len(d);
            if (dist > radius || dist < 0.01) continue;
            sum += dot(d, normals[i]) / dist;
            count++;
        }
        if (count < 4) continue;
        candidates.push({ pos: verts[i], curvature: sum / count });
    }
    candidates.sort((a,b) => b.curvature - a.curvature);
    const top = candidates.slice(0, topK);
    if (!top.length) return null;
    const c = [0,0,0];
    for (const t of top) { c[0]+=t.pos[0]; c[1]+=t.pos[1]; c[2]+=t.pos[2]; }
    return { pos: c.map(x=>x/top.length), maxCurvature: top[0].curvature };
}

const results = [];
function add(boneId, pl, en, pos) {
    if (!pos) { console.warn(`  POMINIETO: ${pl}`); return; }
    results.push({ boneId, pl, en, pos });
}

// ── Dol krętarzowy (femur) - przysrodkowo/tylnie od krętarza wiekszego, region proksymalny ──
const FEMUR = "FMA24474";
const fossa = mostConcaveInRegion(FEMUR, v => {
    const zVals = [813, 900]; // przyblizony zakres Z gdzie jest szyjka/krętarz (z wczesniejszych wynikow)
    return v[2] > 780 && v[2] < 850;
});
console.log("Dol krętarzowy - krzywizna:", fossa?.maxCurvature.toFixed(3));
add(FEMUR, "Dół krętarzowy", "Trochanteric fossa", fossa?.pos);

// ── Bruzda zebra (costal groove) - dolna-wewnetrzna krawedz trzonu, srodkowa 1/3 dlugosci ──
const bones = JSON.parse(fs.readFileSync("all_bones_labeled.json", "utf-8"));
const boneById = new Map(bones.map(b => [b.id, b]));
const ribs = bones.filter(b => /żebro/.test(b.pl));
let grooveCount = 0;
for (const r of ribs) {
    const { verts } = parseObjVertsAndNormals(fs.readFileSync(`${BONES_DIR}/${r.id}.obj`, "utf-8"));
    const zVals = verts.map(v=>v[2]);
    const zMin = Math.min(...zVals), zMax = Math.max(...zVals);
    // srodkowa 1/2 dlugosci trzonu (wzdluz Z - u zeber to nie do konca "gora-dol"
    // ciala, ale przyblizenie regionu srodkowego trzonu wystarczy)
    const groove = mostConcaveInRegion(r.id, v => v[2] > zMin+(zMax-zMin)*0.25 && v[2] < zMax-(zMax-zMin)*0.25, 6.0, 3);
    if (groove) { add(r.id, `Bruzda żebra (${r.pl})`, `Costal groove (${r.en})`, groove.pos); grooveCount++; }
}
console.log(`Bruzda zebra: ${grooveCount}/${ribs.length}`);

// ── Szyjka zebra - interpolacja miedzy juz znanymi Glowa i Kat zebra (nie ekstremum/krzywizna) ──
const existingLandmarks = JSON.parse(fs.readFileSync("bone_landmarks.json", "utf-8"));
let neckCount = 0;
for (const r of ribs) {
    const head = existingLandmarks.find(l => l.boneId === r.id && l.pl.startsWith("Głowa żebra"));
    const angle = existingLandmarks.find(l => l.boneId === r.id && l.pl.startsWith("Kąt żebra"));
    if (head && angle) {
        add(r.id, `Szyjka żebra (${r.pl})`, `Neck of rib (${r.en})`, mid(head.pos, angle.pos));
        neckCount++;
    }
}
console.log(`Szyjka zebra: ${neckCount}/${ribs.length}`);

console.log(`\nWygenerowano ${results.length} punktow.`);
fs.writeFileSync("_atlas_pilot/landmarks_concave.json", JSON.stringify(results, null, 1));
