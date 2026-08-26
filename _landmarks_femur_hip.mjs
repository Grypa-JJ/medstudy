// _landmarks_femur_hip.mjs
// Punkty orientacyjne kosc-po-kosci (recznie zdefiniowane region+kierunek na
// podstawie prawdziwej anatomii), tam gdzie automatyczne wykrywanie kontaktow
// nie dziala (guzowatosci/wyrostki nie sa powierzchniami stawowymi).
// Osie dla prawej konczyny dolnej - POPRAWIONE po weryfikacji na parze
// lewa/prawa kosc ramienna (X faktycznie zmienia znak miedzy lewa/prawa
// strona, Y nie) oraz na wyrostkach poprzecznych kregu (X przechodzi przez
// zero symetrycznie, Y nie): przysrodkowa=+X (w strone 0), boczna=-X,
// przednia=-Y, tylna=+Y, gorna=+Z, dolna=-Z.
// (Pierwsza wersja tego pliku mial X/Y zamienione - patrz poprawka w rozmowie.)
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

// direction: [dx,dy,dz] (nie musi byc znormalizowany - tylko znak/proporcje wazne)
// zFilter: (z, zMin, zMax) => bool - ktore wierzcholki brac pod uwage
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

const MEDIAL = [1,0,0], LATERAL = [-1,0,0], ANTERIOR = [0,-1,0], POSTERIOR = [0,1,0];
const SUPERIOR = [0,0,1];

const FEMUR = "FMA24474";
const HIP = "FMA16586";

const results = [];
function add(boneId, pl, en, pos) {
    if (!pos) { console.warn(`  POMINIETO (brak wyniku): ${pl}`); return; }
    results.push({ boneId, pl, en, pos });
}

// ── Kość udowa - region proksymalny (biodrowy): gorne 15% Z ──
const fTop = (z, mn, mx) => z > mx - (mx-mn)*0.15;
// gorne 25% ale ponizej samego szczytu (zeby ominac glowe/krętarz wiekszy) dla drugorzednych struktur
const fUpperMid = (z, mn, mx) => z > mx - (mx-mn)*0.30 && z < mx - (mx-mn)*0.10;

add(FEMUR, "Krętarz większy", "Greater trochanter", extremeInRegion(FEMUR, LATERAL, fTop));
add(FEMUR, "Krętarz mniejszy", "Lesser trochanter", extremeInRegion(FEMUR, [1,1,-0.5], fUpperMid)); // postero-medialny, nieco nizej
add(FEMUR, "Guzowatość pośladkowa", "Gluteal tuberosity", extremeInRegion(FEMUR, POSTERIOR, (z,mn,mx)=> z > mx-(mx-mn)*0.35 && z < mx-(mx-mn)*0.15));
add(FEMUR, "Kresa chropawa (trzon)", "Linea aspera (shaft)", extremeInRegion(FEMUR, POSTERIOR, (z,mn,mx)=> z > mn+(mx-mn)*0.35 && z < mx-(mx-mn)*0.35));

// region dystalny (kolanowy): dolne 15%
const fBottom = (z, mn, mx) => z < mn + (mx-mn)*0.15;
const fLowerMid = (z, mn, mx) => z < mn + (mx-mn)*0.25 && z > mn + (mx-mn)*0.10;

add(FEMUR, "Kłykieć przyśrodkowy kości udowej", "Medial condyle of femur", extremeInRegion(FEMUR, MEDIAL, fBottom));
add(FEMUR, "Kłykieć boczny kości udowej", "Lateral condyle of femur", extremeInRegion(FEMUR, LATERAL, fBottom));
add(FEMUR, "Nadkłykieć przyśrodkowy", "Medial epicondyle", extremeInRegion(FEMUR, MEDIAL, fLowerMid));
add(FEMUR, "Nadkłykieć boczny", "Lateral epicondyle", extremeInRegion(FEMUR, LATERAL, fLowerMid));
add(FEMUR, "Powierzchnia podkolanowa", "Popliteal surface", extremeInRegion(FEMUR, POSTERIOR, fLowerMid));

// ── Kość miedniczna (hip bone) - regiony wg Z (biodrowa=gorna, kulszowa=dolna-tylna, lonowa=dolna-przednia) ──
const hTop = (z, mn, mx) => z > mx - (mx-mn)*0.15;
const hUpperMid = (z, mn, mx) => z > mx - (mx-mn)*0.35 && z < mx - (mx-mn)*0.10;
const hBottom = (z, mn, mx) => z < mn + (mx-mn)*0.25;

add(HIP, "Kolec biodrowy przedni górny", "Anterior superior iliac spine", extremeInRegion(HIP, [0,-1,0.3], hTop));
add(HIP, "Kolec biodrowy tylny górny", "Posterior superior iliac spine", extremeInRegion(HIP, [0,1,0.3], hTop));
add(HIP, "Grzebień biodrowy", "Iliac crest", extremeInRegion(HIP, SUPERIOR, hTop));
add(HIP, "Guz kulszowy", "Ischial tuberosity", extremeInRegion(HIP, [0,0.3,-1], hBottom));
add(HIP, "Kolec kulszowy", "Ischial spine", extremeInRegion(HIP, [1,0.5,-0.3], hUpperMid));
add(HIP, "Guzek łonowy", "Pubic tubercle", extremeInRegion(HIP, [1,-1,-0.3], hBottom));

console.log(`Wygenerowano ${results.length} punktow.`);
for (const r of results) console.log(`  ${r.boneId}: ${r.pl} @ [${r.pos.map(x=>x.toFixed(1))}]`);

fs.writeFileSync("_atlas_pilot/landmarks_femur_hip.json", JSON.stringify(results, null, 1));
