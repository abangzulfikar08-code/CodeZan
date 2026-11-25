// Aksi tombol keuangan (dipanggil lewat data-act).
const AK = {
  isi: () => { const a = num("#is"); if (!(a > 0)) return toast("Isi jumlah lebih dari 0"); S.tx.push({id: Date.now(), k: "in", a, c: "Isi saldo", d: iso(), n: ""}); save(); render(); toast("Saldo bertambah " + rp(a)); },
  add: () => {
    const a = num("#ta"); if (!(a > 0)) return toast("Isi jumlah lebih dari 0");
    S.tx.push({id: Date.now(), k: $("#tk").value, a, c: $("#tc").value, d: $("#td").value || iso(), n: $("#tn").value.trim()});
    save(); render(); toast("Transaksi tersimpan");
  },
  del: d => { S.tx = S.tx.filter(t => t.id !== +d.id); save(); render(); toast("Transaksi dihapus"); },
  saveR: () => {
    const u = num("#ru"), n = num("#rn"); if (!(u >= 0) || !(n >= 0)) return toast("Isi angka yang valid");
    if (n > u) return toast("Target nabung tidak boleh lebih besar dari uang bulanan");
    S.uang = u; S.nabung = n; S.goal = num("#rg") || 0; save(); render(); toast("Rencana tersimpan");
  },
  saveAnggaran: () => { KATEGORI.out.forEach((c, i) => { const v = parseFloat($("#bk" + i).value); if (v > 0) S.bk[c] = v; else delete S.bk[c]; }); save(); render(); toast("Anggaran kategori tersimpan"); }
};
