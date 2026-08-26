#!/bin/bash
# Usage: _save_capture.sh <tool-result-file.txt> <out.png>
node -e '
const fs = require("fs");
const [, inFile, outFile] = process.argv;
const raw = fs.readFileSync(inFile, "utf8");
const arr = JSON.parse(raw);
let text = arr[0].text;
if (text.startsWith(`"`)) text = text.slice(1, -1);
const m = text.match(/^data:image\/png;base64,(.+)$/s);
const buf = Buffer.from(m[1], "base64");
fs.writeFileSync(outFile, buf);
console.log("wrote", buf.length, "bytes ->", outFile);
' "$1" "$2"
