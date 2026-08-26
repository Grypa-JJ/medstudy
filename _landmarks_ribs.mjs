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
function extreme(verts, dir) {
    let best = null, bestProj = -Infinity;
    for (const v of verts) {
        const p = v[0]*dir[0] + v[1]*dir[1] + v[2]*dir[2];
        if (p > bestProj) { bestProj = p; best = v; }
    }
    return best;
}
const POSTERIOR = [0,1,0];

const bones = JSON.parse(fs.readFileSync("all_bones_labeled.json", "utf-8"));
const ribs = bones.filter(b => /żebro/.test(b.pl));

const results = [];
for (const r of ribs) {
    const verts = parseObjVertices(fs.readFileSync(`${BONES_DIR}/${r.id}.obj`, "utf-8"));
    // Prawa/lewa strona rozstrzyga kierunek "boczny" (X): jesli nazwa ma "prawe" -> bok = -X, "lewe" -> bok = +X, brak oznaczenia (1./2. generyczne) -> uzyj wiekszej |X|
    let lateralDir;
    if (r.pl.includes("prawe")) lateralDir = [-1,0,0];
    else if (r.pl.includes("lewe")) lateralDir = [1,0,0];
    else {
        // generyczne "1. zebro"/"2. zebro" bez strony - sprawdz centroid, zeby zgadnac
        const cx = verts.reduce((s,v)=>s+v[0],0)/verts.length;
        lateralDir = cx < 0 ? [-1,0,0] : [1,0,0];
    }
    const head = extreme(verts, POSTERIOR);
    const angle = extreme(verts, lateralDir);
    if (head) results.push({ boneId: r.id, pl: `Głowa żebra (${r.pl})`, en: `Head of rib (${r.en})`, pos: head });
    if (angle) results.push({ boneId: r.id, pl: `Kąt żebra (${r.pl})`, en: `Angle of rib (${r.en})`, pos: angle });
}

console.log(`Wygenerowano ${results.length} punktow dla ${ribs.length} zeber.`);
fs.writeFileSync("_atlas_pilot/landmarks_ribs.json", JSON.stringify(results, null, 1));
