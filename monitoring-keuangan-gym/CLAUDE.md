# Monitoring Keuangan + Gym

Aplikasi web statis (PWA) untuk HP. Tanpa framework dan tanpa server. Data disimpan di localStorage (kunci `mkg-v1`).

@docs/PROGRESS.md

## Perintah
- `npm run dev`: server lokal di http://localhost:8000
- `npm test`: tes logika (node --test). `npm install && npm run test:ui`: uji UI jsdom
- `npm run build`: hasilkan `dist/` dan nama cache service worker otomatis

## Struktur (satu folder per kelas)
- `core/`: `util.js` (state S, format), `app.js` (router, Beranda, PIN, cadangan, event).
- `keuangan/`: `kategori.js`, `hitung.js` (murni, dites), `logic.js`, `view.js`, `aksi.js`, `monitor_keuangan.py`.
- `gym/`: `jadwal.js`, `hitung.js` (murni, dites), `logic.js`, `view.js`, `aksi.js`, `kebutuhan_gym.py`.
- `ai/`: `asisten.js` (analisis otomatis di HP), `saran_ai.py` (saran dari Claude lewat API, opsional).
- Urutan `<script>` di `index.html` dan daftar `F` di `sw.js` harus selalu sama dengan file yang ada.

## Aturan
- Semua teks UI berbahasa Indonesia. Uang diformat dengan `rp()`.
- Tombol memakai `data-act` + objek `A`. Jangan pakai onclick inline, alert(), confirm(), atau CDN.
- Hitungan baru masuk ke `keuangan/hitung.js`, `gym/hitung.js`, atau `ai/asisten.js` dan wajib punya tes di `tests/`.
- Bentuk data `S` tidak boleh merusak data lama: pertahankan penggabungan DEF dengan data tersimpan.
- Hanya 3 halaman: Beranda, Monitoring Keuangan, Jadwal Workout. Tema hijau-hitam lewat variabel CSS di `style.css`.

## Alur multi-agent (orkestrasi oleh sesi utama)
1. `planner`: rencana langkah, tanpa mengubah kode.
2. `builder`: menulis kode sesuai rencana.
3. `tester`: jalankan `npm test`, lalu coba fitur di browser lewat Playwright MCP.
4. `reviewer`: tinjau perubahan (read-only) terhadap aturan di atas.
Sesi utama merangkum hasil dan menunggu persetujuan sebelum push.

## Definisi selesai
`npm test` dan `npm run test:ui` lulus, fitur dicoba di localhost lewat Playwright MCP, dan ringkasan ditambahkan ke `docs/PROGRESS.md`.
