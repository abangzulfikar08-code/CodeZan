// Aksi tombol gym dan kebiasaan (dipanggil lewat data-act).
const AG = {
  day: d => { sel = +d.i; render(); },
  tg: d => { if (S.done[d.d]) delete S.done[d.d]; else S.done[d.d] = true; save(); render(); },
  saveP: () => {
    const p = S.p, w = num("#pw"), old = S.wt.length ? S.wt[S.wt.length - 1].k : null;
    p.h = num("#ph") || p.h; p.t = num("#pt") || p.t; p.a = num("#pa") || p.a; p.g = $("#pg").value; p.f = +$("#pf").value;
    if (w > 0) { p.w = w; if (old !== w) logW(w); }
    save(); render(); toast("Data tubuh tersimpan");
  },
  addWt: () => { const w = num("#nw"); if (!(w > 0)) return toast("Isi berat badan"); logW(w); S.p.w = w; save(); render(); toast("Berat tercatat"); },
  hb: d => { const t = iso(); if (d.id === "latihan") { if (S.done[t]) delete S.done[t]; else S.done[t] = true; } else { const h = S.hb[t] = S.hb[t] || {}; if (h[d.id]) delete h[d.id]; else h[d.id] = 1; } save(); render(); }
};
function logW(k) { const d = iso(), l = S.wt[S.wt.length - 1]; if (l && l.d === d) l.k = k; else S.wt.push({d, k}); }
