// Service worker: membuat aplikasi bisa dibuka offline. Naikkan nomor C saat file diubah.
const C="mkg-v3",F=["./", "index.html", "style.css", "manifest.json", "assets/icon.svg", "core/util.js", "core/app.js", "keuangan/kategori.js", "keuangan/hitung.js", "keuangan/logic.js", "keuangan/view.js", "keuangan/aksi.js", "gym/jadwal.js", "gym/hitung.js", "gym/logic.js", "gym/view.js", "gym/aksi.js", "ai/asisten.js"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
