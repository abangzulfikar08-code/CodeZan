// Asisten otomatis: membaca data S lalu menghasilkan peringatan dan saran (aturan + statistik).
// Berjalan di HP tanpa internet. Bukan model bahasa; untuk saran berbasis Claude lihat ai/saran_ai.py.
const _G = typeof require !== "undefined" ? require("../gym/hitung.js") : {hitungStreak, habitHitung, kunciTgl};

function analisis(S, now, grup) {
  const rp = n => "Rp" + Math.round(Math.abs(n)).toLocaleString("id-ID");
  const bulan = _G.kunciTgl(now).slice(0, 7), dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const hari = now.getDate(), sisaHari = dim - hari + 1, K = [], G = [];
  const bm = S.tx.filter(t => t.d.startsWith(bulan)), out = bm.filter(t => t.k === "out");
  const pakai = out.reduce((a, t) => a + t.a, 0), sv = bm.filter(t => t.k === "sv").reduce((a, t) => a + t.a, 0);
  const jatah = Math.max(S.uang - S.nabung, 0);

  // ----- Keuangan
  if (!S.tx.length) K.push({t: "info", x: "Belum ada transaksi. Isi saldo dan catat pengeluaran harian supaya analisis bisa berjalan."});
  else {
    if (pakai > 0 && hari >= 3) {
      const proy = pakai / hari * dim;
      K.push(proy > jatah
        ? {t: "peringatan", x: `Dengan laju sekarang, pengeluaran akhir bulan sekitar ${rp(proy)}, melebihi jatah ${rp(jatah)} sebesar ${rp(proy - jatah)}. Batasi sekitar ${rp(Math.max(jatah - pakai, 0) / sisaHari)} per hari.`}
        : {t: "info", x: `Laju pengeluaran aman: proyeksi akhir bulan ${rp(proy)} dari jatah ${rp(jatah)}.`});
    }
    const kat = {}; out.forEach(t => kat[t.c] = (kat[t.c] || 0) + t.a);
    const top = Object.keys(kat).sort((a, b) => kat[b] - kat[a])[0];
    if (top) K.push({t: "info", x: `Pengeluaran terbesar bulan ini: ${top} (${rp(kat[top])}, ${Math.round(kat[top] / pakai * 100)}% dari total).`});
    Object.keys(S.bk || {}).forEach(c => { if (S.bk[c] > 0 && (kat[c] || 0) > S.bk[c]) K.push({t: "peringatan", x: `Anggaran ${c} terlampaui ${rp(kat[c] - S.bk[c])}.`}); });
    if (grup && pakai > 0) {
      const ke = out.filter(t => (grup[t.c] || "Keinginan") === "Keinginan").reduce((a, t) => a + t.a, 0);
      if (ke / pakai > 0.3) K.push({t: "saran", x: `Pengeluaran keinginan sudah ${Math.round(ke / pakai * 100)}% dari total. Coba tahan di bawah 30%.`});
    }
    if (S.nabung > 0) K.push(sv < S.nabung
      ? {t: "saran", x: `Target nabung bulan ini kurang ${rp(S.nabung - sv)}. Setor sekitar ${rp((S.nabung - sv) / Math.max(Math.ceil(sisaHari / 7), 1))} per minggu agar tercapai.`}
      : {t: "info", x: "Target nabung bulan ini sudah tercapai."});
  }

  // ----- Gym dan kebiasaan
  const st = _G.hitungStreak(k => _G.habitHitung(S, k) >= 3, now);
  G.push(st > 0 ? {t: "info", x: `Streak kebiasaan: ${st} hari berturut-turut.`} : {t: "saran", x: "Mulai streak hari ini: selesaikan minimal 3 dari 5 kebiasaan."});
  const idx = (now.getDay() + 6) % 7, nama = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  [0, 2, 4].filter(i => i < idx).forEach(i => {
    if (!S.done[_G.kunciTgl(new Date(now.getFullYear(), now.getMonth(), now.getDate() - idx + i))]) G.push({t: "saran", x: `Latihan gym hari ${nama[i]} belum dicentang. Kalau terlewat, geser ke hari recovery terdekat.`});
  });
  const batas = _G.kunciTgl(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 21));
  const wt = (S.wt || []).filter(w => w.d >= batas);
  if (wt.length >= 2 && S.p.t > wt[wt.length - 1].k) {
    const span = (new Date(wt[wt.length - 1].d) - new Date(wt[0].d)) / 864e5, naik = wt[wt.length - 1].k - wt[0].k;
    G.push(span >= 14 && naik < 0.2
      ? {t: "saran", x: "Berat badan belum naik dalam 2 sampai 3 minggu. Sesuai programmu, tambah sekitar 100–150 kkal per hari."}
      : {t: "info", x: `Berat berubah ${naik >= 0 ? "+" : ""}${naik.toFixed(1)} kg dalam ${Math.round(span)} hari terakhir.`});
  }
  return {keuangan: K, gym: G};
}

// Kartu tampilan (hanya dipakai di browser).
function vAsisten(dom) {
  const a = analisis(S, new Date(), typeof GRUP !== "undefined" ? GRUP : null);
  const l = dom === "semua" ? a.keuangan.concat(a.gym) : a[dom];
  const urut = l.slice().sort((x, y) => (y.t === "peringatan") - (x.t === "peringatan")).slice(0, dom === "semua" ? 3 : 6);
  return `<section class="card"><h2>Asisten otomatis</h2>${urut.map(i => `<p class="ai ${i.t}"><b>${{peringatan: "Perhatian", saran: "Saran", info: "Info"}[i.t]}:</b> ${esc(i.x)}</p>`).join("")}<p class="l">Analisis dari data di HP ini (aturan dan statistik), tanpa internet.</p></section>`;
}
if (typeof module !== "undefined") module.exports = {analisis};
