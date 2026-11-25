// Build tanpa dependensi: salin file ke dist/ dan beri nama cache service worker otomatis
// (berdasarkan isi file), jadi HP selalu memuat versi terbaru setelah deploy.
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const SUMBER = ["index.html", "style.css", "manifest.json", "sw.js", "core", "keuangan", "gym", "ai", "assets"];
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
for (const f of SUMBER) cpSync(f, join("dist", f), { recursive: true, filter: s => !s.endsWith(".py") });

const jelajah = d => readdirSync(d).sort().flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? jelajah(p) : [p]; });
const hash = createHash("sha256");
for (const p of jelajah("dist")) if (!p.endsWith("sw.js")) hash.update(readFileSync(p));
const versi = "mkg-" + hash.digest("hex").slice(0, 8);

const sw = join("dist", "sw.js");
const isi = readFileSync(sw, "utf8");
if (!/const C="[^"]*"/.test(isi)) throw new Error("Baris const C=\"...\" tidak ditemukan di sw.js");
writeFileSync(sw, isi.replace(/const C="[^"]*"/, `const C="${versi}"`));
console.log(`Build selesai: dist/ (cache ${versi})`);
