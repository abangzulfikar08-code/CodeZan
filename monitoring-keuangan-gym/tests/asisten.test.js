const test = require("node:test");
const assert = require("node:assert/strict");
const {analisis} = require("../ai/asisten.js");
const now = new Date(2026, 10, 10);
const dasar = () => ({uang: 1500000, nabung: 200000, bk: {}, hb: {}, done: {}, wt: [], p: {h: 170, w: 60, t: 70, a: 20, g: "m", f: 1.55}, tx: []});
const ada = (l, t, kata) => l.some(i => i.t === t && i.x.includes(kata));

test("tanpa transaksi, asisten mengajak mencatat", () => assert.ok(ada(analisis(dasar(), now).keuangan, "info", "Belum ada transaksi")));
test("proyeksi melebihi jatah menghasilkan peringatan", () => {
  const S = dasar(); S.tx.push({k: "out", a: 900000, c: "Makan", d: "2026-11-05"});
  assert.ok(ada(analisis(S, now).keuangan, "peringatan", "melebihi jatah"));
});
test("anggaran kategori terlampaui menghasilkan peringatan", () => {
  const S = dasar(); S.bk = {Makan: 50000}; S.tx.push({k: "out", a: 80000, c: "Makan", d: "2026-11-05"});
  assert.ok(ada(analisis(S, now).keuangan, "peringatan", "Anggaran Makan terlampaui"));
});
test("belum nabung menghasilkan saran setoran", () => {
  const S = dasar(); S.tx.push({k: "in", a: 1500000, c: "Uang bulanan", d: "2026-11-01"});
  assert.ok(ada(analisis(S, now).keuangan, "saran", "Target nabung bulan ini kurang"));
});
test("gym hari Senin yang terlewat diingatkan (hari ini Selasa)", () => {
  const sel = new Date(2026, 10, 10); // Selasa
  assert.ok(ada(analisis(dasar(), sel).gym, "saran", "Senin belum dicentang"));
});
test("berat tidak naik 2 minggu: saran tambah kalori", () => {
  const S = dasar(); S.wt = [{d: "2026-10-25", k: 60}, {d: "2026-11-09", k: 60}];
  assert.ok(ada(analisis(S, now).gym, "saran", "100–150 kkal"));
});
