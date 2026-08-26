// migrate_images_to_r2.mjs
// Wyciąga base64 obrazki z meta.json do plików na dysku (do wrzucenia na R2)
// i podmienia pole `img` na URL-e wskazujące na R2_BASE_URL.
//
// Użycie:
//   1. Uruchomić raz z R2_BASE_URL wskazującym placeholder (np. domyślny) - żeby
//      wygenerować pliki obrazków do r2_upload/img/.
//   2. Po założeniu bucketu R2 i podpięciu publicznego URL-a, poprawić R2_BASE_URL
//      poniżej na właściwy i uruchomić ponownie (albo zrobić find&replace w meta.json).
//   3. Wrzucić zawartość r2_upload/img/ na R2 (wrangler r2 object put, albo Dashboard).
//
//   node migrate_images_to_r2.mjs

import fs from "fs";
import path from "path";

const R2_BASE_URL = process.env.R2_BASE_URL || "https://REPLACE-ME.r2.dev";

const META_PATH = "netlify_deploy/meta.json";
const BACKUP_PATH = "netlify_deploy/meta.json.bak";
const OUT_DIR = "r2_upload/img";

function mimeToExt(mime) {
    if (mime === "image/jpeg") return "jpg";
    if (mime === "image/png") return "png";
    if (mime === "image/webp") return "webp";
    if (mime === "image/gif") return "gif";
    throw new Error(`Nieobsłużony typ obrazka: ${mime}`);
}

function extractOne(dataUri, filenameBase) {
    const m = dataUri.match(/^data:([^;]+);base64,(.+)$/s);
    if (!m) throw new Error(`Nie rozpoznano formatu data URI dla ${filenameBase}`);
    const [, mime, b64] = m;
    const ext = mimeToExt(mime);
    const filename = `${filenameBase}.${ext}`;
    const buf = Buffer.from(b64, "base64");
    fs.writeFileSync(path.join(OUT_DIR, filename), buf);
    return `${R2_BASE_URL}/img/${filename}`;
}

function main() {
    if (!fs.existsSync(BACKUP_PATH)) {
        fs.copyFileSync(META_PATH, BACKUP_PATH);
        console.log(`Kopia zapasowa: ${BACKUP_PATH}`);
    } else {
        console.log(`Kopia zapasowa już istnieje (${BACKUP_PATH}), nie nadpisuję.`);
    }

    fs.mkdirSync(OUT_DIR, { recursive: true });

    const raw = fs.readFileSync(BACKUP_PATH, "utf8"); // zawsze czytaj z oryginału (backup), nie z ewentualnie już podmienionego meta.json
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : (data.questions || data.items || Object.values(data)[0]);

    let extracted = 0;
    let totalBytes = 0;

    for (const q of arr) {
        if (!q.img) continue;
        const isArr = Array.isArray(q.img);
        const imgs = isArr ? q.img : [q.img];

        const urls = imgs.map((dataUri, idx) => {
            const base = isArr ? `${q.id}_${idx}` : q.id;
            const url = extractOne(dataUri, base);
            extracted++;
            totalBytes += fs.statSync(path.join(OUT_DIR, path.basename(url))).size;
            return url;
        });

        q.img = isArr ? urls : urls[0];
    }

    fs.writeFileSync(META_PATH, JSON.stringify(data));

    const metaSize = fs.statSync(META_PATH).size;
    console.log(`Wyciągnięto ${extracted} obrazków (${(totalBytes / 1024 / 1024).toFixed(1)} MB) do ${OUT_DIR}/`);
    console.log(`Nowy meta.json: ${(metaSize / 1024 / 1024).toFixed(1)} MB (było ~27 MB)`);
    console.log(`URL-e obrazków wskazują na: ${R2_BASE_URL}/img/...`);
    if (R2_BASE_URL.includes("REPLACE-ME")) {
        console.log(`\nUWAGA: R2_BASE_URL nie jest jeszcze ustawiony na prawdziwy adres.`);
        console.log(`Po założeniu bucketu ustaw zmienną R2_BASE_URL i uruchom skrypt ponownie`);
        console.log(`(nadpisze meta.json na nowo z backupu, z poprawnymi URL-ami).`);
    }
}

main();
