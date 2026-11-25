const test = require("node:test");
const assert = require("node:assert/strict");
const {hitungRencana, bolehKeluar, hariSisa, ringkasBulan} = require("../keuangan/hitung.js");
const {hitungKalori, hitungAir, hitungStreak, habitHitung, kunciTgl} = require("../gym/hitung.js");
const p = {h: 170, w: 60, t: 70, a: 20, g: "m", f: 1.55};
const tgl = new Date(2026, 10, 10); // 10 November 2026 (30 hari)

test("jatah belanja = uang bulanan - target nabung", () => {
  const r = hitungRencana(1500000, 200000, 0, 0, tgl);
  assert.equal(r.jatah, 1300000); assert.equal(r.sisa, 1300000);
});
test("jatah tidak pernah negatif", () => assert.equal(hitungRencana(100000, 200000, 0, 0, tgl).jatah, 0));
test("sisa hari termasuk hari ini", () => { assert.equal(hariSisa(tgl), 21); assert.equal(hariSisa(new Date(2026, 10, 30)), 1); });
test("batas per hari = sisa jatah / sisa hari", () => {
  const r = hitungRencana(1500000, 200000, 130000, 0, tgl);
  assert.equal(Math.round(r.perHari), Math.round(1170000 / 21));
});
test("uang yang boleh dikeluarkan = total - tabungan", () => {
  assert.equal(bolehKeluar(1500000, 200000, tgl).b, 1300000);
  assert.ok(bolehKeluar(100000, 200000, tgl).b < 0);
});
test("ringkasBulan mengelompokkan per kategori dan grup, mengabaikan bulan lain", () => {
  const tx = [{k: "out", a: 100, c: "Makan", d: "2026-11-02"}, {k: "out", a: 50, c: "Hiburan", d: "2026-11-03"}, {k: "out", a: 999, c: "Makan", d: "2026-10-30"}, {k: "in", a: 500, c: "Gaji", d: "2026-11-01"}];
  const r = ringkasBulan(tx, "2026-11", {Makan: "Kebutuhan", Hiburan: "Keinginan"});
  assert.equal(r.total, 150); assert.equal(r.kat.Makan, 100); assert.equal(r.grup.Keinginan, 50);
});
test("BMR dan penyesuaian kalori", () => {
  assert.equal(hitungKalori(p, 60).bmr, 1567.5);
  assert.equal(hitungKalori(p, 60).adj, 300);
  assert.equal(hitungKalori({...p, t: 55}, 60).adj, -400);
  assert.equal(hitungKalori({...p, t: 60}, 60).adj, 0);
});
test("air minum: 35 ml per kg, tambah 0,5 liter di hari gym", () => { assert.equal(hitungAir(60, false), 2.1); assert.equal(hitungAir(60, true), 2.6); });
test("streak menghitung hari berturut-turut dan tidak putus oleh hari ini yang belum selesai", () => {
  const ok = new Set(["2026-11-09", "2026-11-08", "2026-11-07", "2026-11-05"]);
  assert.equal(hitungStreak(k => ok.has(k), tgl), 3);
  ok.add("2026-11-10"); assert.equal(hitungStreak(k => ok.has(k), tgl), 4);
});
test("habitHitung menghitung latihan dari done dan kebiasaan lain dari hb", () => {
  const S = {done: {"2026-11-10": true}, hb: {"2026-11-10": {protein: 1, air: 1}}};
  assert.equal(habitHitung(S, "2026-11-10"), 3);
  assert.equal(kunciTgl(tgl), "2026-11-10");
});
