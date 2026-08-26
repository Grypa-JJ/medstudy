// _landmarks_vertebrae.mjs
// Wzorzec generyczny dla wszystkich 24 kregow: wyrostek kolczysty (najbardziej
// tylny punkt) + wyrostki poprzeczne lewy/prawy (ekstrema wzdluz X, ktore
// faktycznie jest osia lewo-prawo - patrz poprawka w rozmowie). Bonus: zab
// obrotnika (dens axis) dla kregu obrotowego - najbardziej gorny punkt.
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
function extreme(verts, direction) {
    let best = null, bestProj = -Infinity;
    for (const v of verts) {
        const proj = v[0]*direction[0] + v[1]*direction[1] + v[2]*direction[2];
        if (proj > bestProj) { bestProj = proj; best = v; }
    }
    return best;
}

const POSTERIOR = [0,1,0], RIGHT = [-1,0,0], LEFT = [1,0,0], SUPERIOR = [0,0,1];

const bones = JSON.parse(fs.readFileSync("all_bones_labeled.json", "utf-8"));
const vertebrae = bones.filter(b => /kręg (szyjny|piersiowy|lędźwiowy)|^Kręg szczytowy|^Kręg obrotowy/.test(b.pl));

const results = [];
function add(boneId, pl, en, pos) {
    if (!pos) return;
    results.push({ boneId, pl, en, pos });
}

for (const v of vertebrae) {
    const verts = parseObjVertices(fs.readFileSync(`${BONES_DIR}/${v.id}.obj`, "utf-8"));
    const isAtlas = v.pl.includes("szczytowy");
    if (!isAtlas) {
        add(v.id, `Wyrostek kolczysty (${v.pl})`, `Spinous process (${v.en})`, extreme(verts, POSTERIOR));
    }
    add(v.id, `Wyrostek poprzeczny prawy (${v.pl})`, `Right transverse process (${v.en})`, extreme(verts, RIGHT));
    add(v.id, `Wyrostek poprzeczny lewy (${v.pl})`, `Left transverse process (${v.en})`, extreme(verts, LEFT));
    if (v.pl.includes("obrotowy")) {
        add(v.id, "Ząb obrotnika (dens axis)", "Dens of axis", extreme(verts, SUPERIOR));
    }
}

console.log(`Wygenerowano ${results.length} punktow dla ${vertebrae.length} kregow.`);
fs.writeFileSync("_atlas_pilot/landmarks_vertebrae.json", JSON.stringify(results, null, 1));
