// Hitungan keuangan yang membaca state S.
const sum = (k, m) => S.tx.filter(t => t.k === k && (!m || t.d.startsWith(m))).reduce((a, t) => a + t.a, 0);
const saldo = () => sum("in") - sum("out") - sum("sv");
const rencana = () => { const m = iso().slice(0, 7); return hitungRencana(S.uang, S.nabung, sum("out", m), sum("sv", m), new Date()); };
