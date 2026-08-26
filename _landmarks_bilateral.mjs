// _landmarks_bilateral.mjs
// Powtorzenie recznie zdefiniowanych punktow (femur/hip/tibia/fibula/humerus/
// scapula/radius/ulna) dla LEWEJ strony - wczesniej zrobilem tylko prawa.
// Kierunek MEDIAL/LATERAL trzeba odwrocic dla lewej strony (lewa = ujemne X
// oznacza teraz LATERAL, nie MEDIAL jak dla prawej) - ANTERIOR/POSTERIOR/
// SUPERIOR zostaja bez zmian (nie sa zwierciadlane miedzy stronami).
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

const results = [];
function add(boneId, pl, en, pos) {
    if (!pos) { console.warn(`  POMINIETO: ${pl}`); return; }
    results.push({ boneId, pl, en, pos });
}

// side: +1 = prawa (MEDIAL=+X), -1 = lewa (MEDIAL=-X)
function defineBoneLandmarks(side) {
    const M = side === 1 ? [1,0,0] : [-1,0,0];   // MEDIAL
    const L = side === 1 ? [-1,0,0] : [1,0,0];   // LATERAL
    const A = [0,-1,0], P = [0,1,0], S = [0,0,1]; // ANTERIOR/POSTERIOR/SUPERIOR (bez zmian)

    const FEMUR = side === 1 ? "FMA24474" : "FMA24475";
    const HIP = side === 1 ? "FMA16586" : "FMA16587";
    const TIBIA = side === 1 ? "FMA24477" : "FMA24478";
    const FIBULA = side === 1 ? "FMA24480" : "FMA24481";
    const HUMERUS = side === 1 ? "FMA23130" : "FMA23131";
    const SCAPULA = side === 1 ? "FMA13395" : "FMA13396";
    const RADIUS = side === 1 ? "FMA23464" : "FMA23465";
    const ULNA = side === 1 ? "FMA23467" : "FMA23468";
    const suf = side === 1 ? "" : " (lewa)";
    const sufEn = side === 1 ? "" : " (left)";

    const fTop = (z, mn, mx) => z > mx - (mx-mn)*0.15;
    const fUpperMid = (z, mn, mx) => z > mx - (mx-mn)*0.30 && z < mx - (mx-mn)*0.10;
    add(FEMUR, "Krętarz większy"+suf, "Greater trochanter"+sufEn, extremeInRegion(FEMUR, L, fTop));
    add(FEMUR, "Krętarz mniejszy"+suf, "Lesser trochanter"+sufEn, extremeInRegion(FEMUR, [M[0],P[1],-0.5], fUpperMid));
    add(FEMUR, "Guzowatość pośladkowa"+suf, "Gluteal tuberosity"+sufEn, extremeInRegion(FEMUR, P, (z,mn,mx)=> z > mx-(mx-mn)*0.35 && z < mx-(mx-mn)*0.15));
    add(FEMUR, "Kresa chropawa (trzon)"+suf, "Linea aspera (shaft)"+sufEn, extremeInRegion(FEMUR, P, (z,mn,mx)=> z > mn+(mx-mn)*0.35 && z < mx-(mx-mn)*0.35));
    const fBottom = (z, mn, mx) => z < mn + (mx-mn)*0.15;
    const fLowerMid = (z, mn, mx) => z < mn + (mx-mn)*0.25 && z > mn + (mx-mn)*0.10;
    add(FEMUR, "Kłykieć przyśrodkowy kości udowej"+suf, "Medial condyle of femur"+sufEn, extremeInRegion(FEMUR, M, fBottom));
    add(FEMUR, "Kłykieć boczny kości udowej"+suf, "Lateral condyle of femur"+sufEn, extremeInRegion(FEMUR, L, fBottom));
    add(FEMUR, "Nadkłykieć przyśrodkowy"+suf, "Medial epicondyle"+sufEn, extremeInRegion(FEMUR, M, fLowerMid));
    add(FEMUR, "Nadkłykieć boczny"+suf, "Lateral epicondyle"+sufEn, extremeInRegion(FEMUR, L, fLowerMid));
    add(FEMUR, "Powierzchnia podkolanowa"+suf, "Popliteal surface"+sufEn, extremeInRegion(FEMUR, P, fLowerMid));

    const hTop = (z, mn, mx) => z > mx - (mx-mn)*0.15;
    const hUpperMid = (z, mn, mx) => z > mx - (mx-mn)*0.35 && z < mx - (mx-mn)*0.10;
    const hBottom = (z, mn, mx) => z < mn + (mx-mn)*0.25;
    add(HIP, "Kolec biodrowy przedni górny"+suf, "Anterior superior iliac spine"+sufEn, extremeInRegion(HIP, [A[0],A[1],0.3], hTop));
    add(HIP, "Kolec biodrowy tylny górny"+suf, "Posterior superior iliac spine"+sufEn, extremeInRegion(HIP, [P[0],P[1],0.3], hTop));
    add(HIP, "Grzebień biodrowy"+suf, "Iliac crest"+sufEn, extremeInRegion(HIP, S, hTop));
    add(HIP, "Guz kulszowy"+suf, "Ischial tuberosity"+sufEn, extremeInRegion(HIP, [0,0.3,-1], hBottom));
    add(HIP, "Kolec kulszowy"+suf, "Ischial spine"+sufEn, extremeInRegion(HIP, [M[0]*1,0.5,-0.3], hUpperMid));
    add(HIP, "Guzek łonowy"+suf, "Pubic tubercle"+sufEn, extremeInRegion(HIP, [M[0]*1,-1,-0.3], hBottom));

    const tTop = (z,mn,mx) => z > mx-(mx-mn)*0.12;
    const tBottom = (z,mn,mx) => z < mn+(mx-mn)*0.12;
    add(TIBIA, "Kłykieć przyśrodkowy piszczeli"+suf, "Medial condyle of tibia"+sufEn, extremeInRegion(TIBIA, M, tTop));
    add(TIBIA, "Kłykieć boczny piszczeli"+suf, "Lateral condyle of tibia"+sufEn, extremeInRegion(TIBIA, L, tTop));
    add(TIBIA, "Kostka przyśrodkowa"+suf, "Medial malleolus"+sufEn, extremeInRegion(TIBIA, M, tBottom));

    const fbTop = (z,mn,mx) => z > mx-(mx-mn)*0.10;
    const fbBottom = (z,mn,mx) => z < mn+(mx-mn)*0.10;
    add(FIBULA, "Głowa strzałki"+suf, "Head of fibula"+sufEn, extremeInRegion(FIBULA, S, fbTop));
    add(FIBULA, "Kostka boczna"+suf, "Lateral malleolus"+sufEn, extremeInRegion(FIBULA, L, fbBottom));

    const humTop = (z,mn,mx) => z > mx-(mx-mn)*0.15;
    const humBottom = (z,mn,mx) => z < mn+(mx-mn)*0.15;
    const humMid = (z,mn,mx) => z > mn+(mx-mn)*0.40 && z < mx-(mx-mn)*0.40;
    add(HUMERUS, "Guzek większy"+suf, "Greater tubercle"+sufEn, extremeInRegion(HUMERUS, L, humTop));
    add(HUMERUS, "Guzek mniejszy"+suf, "Lesser tubercle"+sufEn, extremeInRegion(HUMERUS, A, humTop));
    add(HUMERUS, "Guzowatość naramienna"+suf, "Deltoid tuberosity"+sufEn, extremeInRegion(HUMERUS, L, humMid));
    add(HUMERUS, "Nadkłykieć przyśrodkowy (ramię)"+suf, "Medial epicondyle (humerus)"+sufEn, extremeInRegion(HUMERUS, M, humBottom));
    add(HUMERUS, "Nadkłykieć boczny (ramię)"+suf, "Lateral epicondyle (humerus)"+sufEn, extremeInRegion(HUMERUS, L, humBottom));
    add(HUMERUS, "Główka kości ramiennej (capitulum)"+suf, "Capitulum of humerus"+sufEn, extremeInRegion(HUMERUS, [L[0],0,-1], humBottom));
    add(HUMERUS, "Bloczek kości ramiennej (trochlea)"+suf, "Trochlea of humerus"+sufEn, extremeInRegion(HUMERUS, [M[0],0,-1], humBottom));

    const scTop = (z,mn,mx) => z > mx-(mx-mn)*0.20;
    add(SCAPULA, "Wyrostek barkowy (akromion)"+suf, "Acromion"+sufEn, extremeInRegion(SCAPULA, [L[0],0,1], scTop));
    add(SCAPULA, "Wyrostek kruczy"+suf, "Coracoid process"+sufEn, extremeInRegion(SCAPULA, [0,A[1],0.5], scTop));
    add(SCAPULA, "Kąt dolny łopatki"+suf, "Inferior angle of scapula"+sufEn, extremeInRegion(SCAPULA, [0,0,-1], null));

    const rTop = (z,mn,mx) => z > mx-(mx-mn)*0.15;
    const rBottom = (z,mn,mx) => z < mn+(mx-mn)*0.12;
    add(RADIUS, "Guzowatość promieniowa"+suf, "Radial tuberosity"+sufEn, extremeInRegion(RADIUS, A, rTop));
    add(RADIUS, "Wyrostek rylcowaty kości promieniowej"+suf, "Styloid process of radius"+sufEn, extremeInRegion(RADIUS, L, rBottom));

    const uTop = (z,mn,mx) => z > mx-(mx-mn)*0.10;
    const uBottom = (z,mn,mx) => z < mn+(mx-mn)*0.10;
    add(ULNA, "Wyrostek łokciowy"+suf, "Olecranon"+sufEn, extremeInRegion(ULNA, [0,0.3,1], uTop));
    add(ULNA, "Wyrostek dziobiasty"+suf, "Coronoid process"+sufEn, extremeInRegion(ULNA, [0,A[1],0.3], uTop));
    add(ULNA, "Wyrostek rylcowaty kości łokciowej"+suf, "Styloid process of ulna"+sufEn, extremeInRegion(ULNA, M, uBottom));
}

defineBoneLandmarks(-1); // TYLKO lewa - prawa juz zrobiona wczesniej

console.log(`Wygenerowano ${results.length} punktow (lewa strona).`);
fs.writeFileSync("_atlas_pilot/landmarks_left_side.json", JSON.stringify(results, null, 1));
