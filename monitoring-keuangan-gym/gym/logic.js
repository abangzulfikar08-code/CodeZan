// Hitungan gym yang membaca state S.
const cur = () => S.wt.length ? S.wt[S.wt.length - 1].k : S.p.w;
const kal = () => hitungKalori(S.p, cur());
function minggu() { const d = new Date(), i = (d.getDay() + 6) % 7; return JADWAL.map((_, j) => iso(new Date(d.getFullYear(), d.getMonth(), d.getDate() - i + j))); }
function progres() { const s = S.wt.length ? S.wt[0].k : S.p.w, t = S.p.t; return t === s ? 100 : Math.max(0, Math.min(100, (cur() - s) / (t - s) * 100)); }
