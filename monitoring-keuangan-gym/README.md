# Monitoring Keuangan + Gym

Aplikasi web untuk HP: monitoring keuangan (saldo, jatah belanja, target nabung) dan gym (jadwal, centang harian, kalori, berat badan). Data tersimpan di browser, tanpa login dan server.

## Struktur
- `index.html` halaman utama
- `style.css` tampilan (hijau-hitam)
- `js/data.js` jadwal gym, makanan, kategori
- `js/app.js` seluruh logika aplikasi
- `manifest.json`, `sw.js`, `assets/icon.svg` agar bisa dipasang dan offline
- `server.py` server lokal untuk mencoba di HP
- `python/monitor_keuangan.py` versi terminal untuk menghitung uang yang boleh dikeluarkan (`python python/monitor_keuangan.py`)

## Cara menjalankan
1. Buka folder di VS Code. Cara cepat: pasang ekstensi **Live Server**, klik kanan `index.html`, pilih **Open with Live Server**.
2. Atau dengan Python: `python server.py`, lalu buka alamat "HP" yang tampil (HP dan laptop satu Wi-Fi).

## Pasang sebagai aplikasi di HP
Mode pasang dan offline butuh HTTPS. Upload folder ini ke hosting gratis (GitHub Pages, Netlify, atau Cloudflare Pages), buka linknya di Chrome HP, lalu menu ⋮ > **Pasang aplikasi**.
Setelah mengubah file, naikkan nama cache `C` di `sw.js` (mis. `mkg-v4`) agar HP memuat versi baru.

## Cadangan data
Menu Atur > **Simpan cadangan** menghasilkan file .json. Pulihkan lewat **Pulihkan dari file**.
