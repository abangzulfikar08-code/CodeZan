# Monitoring Keuangan + Gym

Dashboard web untuk HP: mengelola keuangan (saldo, anggaran per kategori, tabungan) dan kebiasaan olahraga (jadwal, kebiasaan harian, kalori). Data tersimpan di browser, tanpa login dan server.

## Struktur
```
monitoring-keuangan-gym/
├─ index.html, style.css, manifest.json, sw.js, server.py
├─ core/       util.js, app.js          (dasar, router, Beranda, PIN, cadangan)
├─ keuangan/   kategori, hitung, logic, view, aksi (.js) + monitor_keuangan.py
├─ gym/        jadwal, hitung, logic, view, aksi (.js) + kebutuhan_gym.py
├─ ai/         asisten.js (otomatis di HP) + saran_ai.py (saran dari Claude, opsional)
├─ tests/      tes logika (node --test) dan tests/ui (jsdom)
├─ scripts/    build.mjs
└─ docs/       PROGRESS.md
```

## Bahasa pemrograman
- **HTML, CSS, JavaScript**: seluruh aplikasi yang berjalan di HP.
- **Python**: alat bantu di komputer (`server.py`, `keuangan/monitor_keuangan.py`, `gym/kebutuhan_gym.py`, `ai/saran_ai.py`).
- **JSON**: format data dan cadangan.

## Menjalankan
1. VS Code + ekstensi **Live Server**: klik kanan `index.html` > Open with Live Server.
2. Atau `python server.py`, lalu buka alamat "HP" yang tampil (satu Wi-Fi).

## Asisten AI
- **Otomatis di HP** (`ai/asisten.js`): proyeksi pengeluaran akhir bulan, kategori melampaui anggaran, saran setoran tabungan, streak kebiasaan, pengingat gym yang terlewat, saran tambah kalori jika berat tidak naik. Aturan dan statistik, tanpa internet.
- **Saran dari Claude** (`ai/saran_ai.py`): simpan cadangan di menu Pengaturan, isi `ANTHROPIC_API_KEY`, lalu `python ai/saran_ai.py cadangan-....json`. Hanya angka ringkasan yang dikirim.

## Pengembangan
- `npm test`: tes logika (Node 18+). `npm install` lalu `npm run test:ui`: uji UI.
- `npm run build`: buat `dist/` dengan nama cache service worker otomatis.
- `.github/workflows/deploy.yml`: tes, build, deploy ke GitHub Pages (taruh di root repo sendiri; Settings > Pages > Source: GitHub Actions).
- `CLAUDE.md`, `.claude/agents/`, `.mcp.json`: konteks, subagent, dan MCP untuk Claude Code (token GitHub lewat variabel `GITHUB_PAT`).

## Pasang di HP
Upload ke hosting HTTPS (GitHub Pages dll), buka di Chrome HP, menu ⋮ > Pasang aplikasi. Cadangan data: Beranda (bagian bawah) > Simpan cadangan.
