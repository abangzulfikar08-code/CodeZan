// Hitungan keuangan murni (tanpa DOM): dipakai browser dan tests/.
function hariBulan(now) { return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(); }
function hariSisa(now) { return hariBulan(now) - now.getDate() + 1; }
function hitungRencana(uang, nabung, pakai, sv, now) {
  const jatah = Math.max(uang - nabung, 0), sisa = jatah - pakai;
  return {jatah, pakai, sisa, dim: hariBulan(now), perHari: sisa / hariSisa(now), sv};
}
function bolehKeluar(total, nabung, now) { return {b: total - nabung, sh: hariSisa(now)}; }
function ringkasBulan(tx, bulan, grup) {
  const kat = {}, g = {}; let total = 0;
  tx.forEach(t => {
    if (t.k !== "out" || !t.d.startsWith(bulan)) return;
    total += t.a; kat[t.c] = (kat[t.c] || 0) + t.a;
    const n = (grup && grup[t.c]) || "Keinginan"; g[n] = (g[n] || 0) + t.a;
  });
  return {total, kat, grup: g};
}
if (typeof module !== "undefined") module.exports = {hariBulan, hariSisa, hitungRencana, bolehKeluar, ringkasBulan};
