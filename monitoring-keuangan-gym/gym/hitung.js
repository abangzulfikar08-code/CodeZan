// Hitungan gym murni (tanpa DOM): dipakai browser dan tests/.
const HABIT = [["latihan", "Latihan atau aktif sesuai jadwal"], ["protein", "Protein harian tercapai"], ["air", "Air minum cukup"], ["tidur", "Tidur 7–9 jam"], ["skincare", "Skincare pagi dan malam"]];
function kunciTgl(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function hitungKalori(p, w) {
  const bmr = 10 * w + 6.25 * p.h - 5 * p.a + (p.g === "m" ? 5 : -161), td = bmr * p.f, adj = p.t > w ? 300 : p.t < w ? -400 : 0;
  return {bmr, td, adj, k: td + adj, p1: w * 1.6, p2: w * 2};
}
function hitungAir(w, hariGym) { return Math.round((w * 0.035 + (hariGym ? 0.5 : 0)) * 10) / 10; }
function habitYa(S, key, id) { return id === "latihan" ? !!S.done[key] : !!(S.hb && S.hb[key] && S.hb[key][id]); }
function habitHitung(S, key) { return HABIT.filter(h => habitYa(S, key, h[0])).length; }
function hitungStreak(ok, now) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate()); let n = 0;
  if (!ok(kunciTgl(d))) d.setDate(d.getDate() - 1); // hari ini yang belum selesai tidak memutus streak
  while (n < 365 && ok(kunciTgl(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
if (typeof module !== "undefined") module.exports = {HABIT, kunciTgl, hitungKalori, hitungAir, habitYa, habitHitung, hitungStreak};
