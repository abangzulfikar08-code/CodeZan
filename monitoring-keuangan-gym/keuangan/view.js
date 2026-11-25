// Tampilan halaman Monitoring Keuangan.
const opsi = t => KATEGORI[t].map(c => `<option>${c}</option>`).join("");
function vCat() {
  const l = S.tx.slice().sort((a, b) => a.d < b.d ? 1 : a.d > b.d ? -1 : b.id - a.id).slice(0, 40);
  return `<section class="card"><h2>Catat transaksi</h2><div class="form">
<div class="g2"><label>Jenis<select id="tk"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option><option value="sv">Setor ke tabungan</option></select></label><label>Jumlah (Rp)<input id="ta" type="number" inputmode="numeric" min="0"></label></div>
<div class="g2"><label>Kategori<select id="tc">${opsi("out")}</select></label><label>Tanggal<input id="td" type="date" value="${iso()}"></label></div>
<label>Catatan (boleh kosong)<input id="tn" maxlength="60"></label>
<button class="btn" data-act="add">Simpan transaksi</button></div>
<p class="l">Pemasukan menambah saldo utama. Pengeluaran dan setoran tabungan mengurangi saldo utama. Setoran tabungan menambah total tabungan.</p></section>
<section class="card"><h2>Riwayat</h2>${l.length ? l.map(t => `<div class="tx"><div class="m"><div>${esc(t.c)}${t.n ? ": " + esc(t.n) : ""}</div><div class="l">${t.d}</div></div><b class="${t.k}">${t.k === "out" ? "-" : "+"}${rp(t.a)}</b><button class="btn ghost" aria-label="Hapus" data-act="del" data-id="${t.id}">✕</button></div>`).join("") : '<p class="l">Belum ada transaksi. Mulai dengan mencatat uang bulananmu sebagai pemasukan.</p>'}</section>`;
}
function vRen() {
  return `<section class="card"><h2>Atur rencana bulanan</h2><div class="form">
<label>Uang bulanan (Rp)<input id="ru" type="number" inputmode="numeric" value="${S.uang}"></label>
<label>Target nabung per bulan (Rp)<input id="rn" type="number" inputmode="numeric" value="${S.nabung}"></label>
<label>Target tabungan total (Rp, boleh kosong)<input id="rg" type="number" inputmode="numeric" value="${S.goal || ""}"></label>
<p class="l">Contoh: uang bulanan 1.500.000 dan target nabung 200.000, maka jatah belanja 1.300.000 per bulan.</p>
<button class="btn" data-act="saveR">Simpan rencana</button></div></section>`;
}
const isiCard = () => `<section class="card"><h2>Isi saldo utama</h2><div class="g2" style="grid-template-columns:1fr auto"><input id="is" type="number" inputmode="numeric" placeholder="Jumlah uang (Rp)"><button class="btn" style="width:auto" data-act="isi">Tambah saldo</button></div><p class="l">Masukkan uang yang kamu punya. Jumlahnya ditambahkan ke saldo utama dan tercatat di riwayat. Salah input? Hapus di Riwayat (halaman Monitoring Keuangan).</p></section>`;
function hasil(t, n) {
  const {b, sh} = bolehKeluar(t, n, new Date());
  return b < 0 ? '<span class="neg">Target nabung lebih besar dari total uang.</span>' : `Maksimal uang yang boleh dikeluarkan: <b>${rp(b)}</b><br><span class="l">Sekitar ${rp(b / sh)} per hari sampai akhir bulan (${sh} hari)</span>`;
}
const kalk = () => `<section class="card"><h2>Kalkulator: berapa yang boleh dikeluarkan?</h2><div class="form"><label>Total uang sekarang (Rp)<input id="kt" type="number" inputmode="numeric" value="${Math.round(saldo()) || ""}"></label><label>Uang yang ingin ditabung (Rp)<input id="kn" type="number" inputmode="numeric" value="${S.nabung}"></label><div id="ko" class="card" style="margin:0">${hasil(saldo(), S.nabung)}</div></div><p class="l">Rumus: total uang dikurangi uang yang ditabung. Ini hanya hitungan, tidak mengubah saldo.</p></section>`;
function vPlan() {
  const r = rencana(), tb = sum("sv"), bln = S.nabung > 0 && S.goal > tb ? Math.ceil((S.goal - tb) / S.nabung) : 0;
  return `<section class="card hero"><span class="l">Saldo utama (uang kamu sekarang)</span><div class="big">${rp(saldo())}</div><span class="l">Tabungan terkumpul: <b>${rp(tb)}</b></span></section>
${isiCard()}
<section class="card"><h2>Rencana uang bulanan</h2>
<div class="row"><span>Uang bulanan</span><b>${rp(S.uang)}</b></div>
<div class="row"><span>Disisihkan untuk nabung</span><b class="in">${rp(S.nabung)}</b></div>
<div class="row"><span>Boleh dibelanjakan per bulan</span><b>${rp(r.jatah)}</b></div>
<div class="row"><span>Per minggu</span><b>${rp(r.jatah / 4.33)}</b></div>
<div class="row"><span>Per hari</span><b>${rp(r.jatah / r.dim)}</b></div>
<h3>Pengeluaran ${rp(r.pakai)} dari ${rp(r.jatah)}</h3>${bar(r.pakai, r.jatah, 1)}
<p class="l ${r.sisa < 0 ? "neg" : ""}">${r.sisa < 0 ? "Melebihi jatah " + rp(-r.sisa) : "Sisa jatah " + rp(r.sisa) + ", aman dipakai sekitar " + rp(r.perHari) + " per hari"}</p>
<h3>Nabung bulan ini ${rp(r.sv)} dari ${rp(S.nabung)}</h3>${bar(r.sv, S.nabung)}
<p class="l">${r.sv >= S.nabung ? "Target nabung bulan ini tercapai" : "Kurang " + rp(S.nabung - r.sv) + " lagi"}</p>
${S.goal ? `<h3>Target tabungan ${rp(S.goal)}: terkumpul ${rp(tb)}</h3>${bar(tb, S.goal)}<p class="l">${tb >= S.goal ? "Target tercapai" : bln ? "Dengan nabung " + rp(S.nabung) + " per bulan, sekitar " + bln + " bulan lagi" : "Isi target nabung per bulan"}</p>` : ""}</section>`;
}
function vAnggaran() {
  const r = ringkasBulan(S.tx, iso().slice(0, 7), GRUP);
  const grup = Object.keys(r.grup).map(g => `<div class="row"><span>${g}</span><b>${rp(r.grup[g])} <span class="l">(${r.total ? Math.round(r.grup[g] / r.total * 100) : 0}%)</span></b></div>`).join("");
  const baris = KATEGORI.out.map((c, i) => {
    const s = r.kat[c] || 0, b = S.bk[c] || 0;
    return `<div class="kt"><div class="sp"><span>${c}</span><span class="l">${rp(s)}${b ? " / " + rp(b) : ""}</span></div>${b ? bar(s, b, 1) : ""}<input id="bk${i}" type="number" inputmode="numeric" placeholder="Batas bulanan (Rp), kosong = tanpa batas" value="${b || ""}"></div>`;
  }).join("");
  return `<section class="card"><h2>Anggaran per kategori (bulan ini)</h2>${baris}<button class="btn" data-act="saveAnggaran">Simpan anggaran</button>${grup ? `<h3>Pola pengeluaran</h3>${grup}` : ""}</section>`;
}
