// _landmarks_phalanges.mjs
// Generyczne punkty dla WSZYSTKICH 56 paliczkow (rak i stop): Podstawa (koniec
// blizej dloni/stopy) + Glowa (paliczki blizszy/srodkowy) albo Guzowatosc
// paliczka dalszego (paliczki dalsze - koniec palca).
// Paliczki reki: dluga os ~Z (palce zwisaja w dol przy ciele -> nadgarstek
// wyzej/Z+, koniuszek nizej/Z-).
// Paliczki stopy: dluga os ~Y (stopa plaska, palce skierowane do przodu ->
// podstawa (blizej srodstopia) bardziej z tylu/Y+, koniuszek bardziej z przodu/Y-).
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

const bones = JSON.parse(fs.readFileSync("all_bones_labeled.json", "utf-8"));
const phalanges = bones.filter(b => b.pl.startsWith("Paliczek"));

const results = [];
function add(boneId, pl, en, pos) {
    if (!pos) return;
    results.push({ boneId, pl, en, pos });
}

for (const p of phalanges) {
    const isFoot = /stopy|palucha/.test(p.pl);
    const isDistal = p.pl.startsWith("Paliczek dalszy");
    const verts = parseObjVertices(fs.readFileSync(`${BONES_DIR}/${p.id}.obj`, "utf-8"));

    const baseDir = isFoot ? [0,1,0] : [0,0,1];  // posterior (stopa) lub superior (reka) = w strone dloni/stopy
    const tipDir = isFoot ? [0,-1,0] : [0,0,-1]; // anterior (stopa) lub inferior (reka) = koniuszek

    add(p.id, `Podstawa (${p.pl})`, `Base (${p.en})`, extreme(verts, baseDir));
    if (isDistal) {
        add(p.id, `Guzowatość paliczka dalszego (${p.pl})`, `Tuberosity of distal phalanx (${p.en})`, extreme(verts, tipDir));
    } else {
        add(p.id, `Głowa (${p.pl})`, `Head (${p.en})`, extreme(verts, tipDir));
    }
}

console.log(`Wygenerowano ${results.length} punktow dla ${phalanges.length} paliczkow.`);
fs.writeFileSync("_atlas_pilot/landmarks_phalanges.json", JSON.stringify(results, null, 1));
