// ===== Dasar =====
const KEY = "mkg-v1";
const $ = s => document.querySelector(s);
const rp = n => (n < 0 ? "-" : "") + "Rp" + Math.abs(Math.round(n)).toLocaleString("id-ID");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const iso = (d = new Date()) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const DEF = {uang:1500000, nabung:200000, goal:0, tx:[], p:{h:170,w:60,t:70,a:20,g:"m",f:1.55}, wt:[], done:{}, pin:""};
let S; try { S = {...DEF, ...JSON.parse(localStorage.getItem(KEY) || "{}")}; } catch (e) { S = {...DEF}; }
let tab = "home", sel = (new Date().getDay() + 6) % 7, ok = false;
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 2200); };

// ===== Hitungan keuangan =====
const sum = (k, m) => S.tx.filter(t => t.k === k && (!m || t.d.startsWith(m))).reduce((a, t) => a + t.a, 0);
const saldo = () => sum("in") - sum("out") - sum("sv");
function rencana() {
  const n = new Date(), dim = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate(), sisaHari = dim - n.getDate() + 1, m = iso().slice(0, 7);
  const jatah = Math.max(S.uang - S.nabung, 0), pakai = sum("out", m), sisa = jatah - pakai;
  return {jatah, pakai, sisa, dim, perHari: sisa / sisaHari, sv: sum("sv", m)};
}
const bar = (a, b, w) => `<div class="bar${w && a > b ? " bad" : ""}"><i style="width:${b > 0 ? Math.min(100, Math.max(0, a / b * 100)) : 0}%"></i></div>`;

// ===== Hitungan tubuh =====
const cur = () => S.wt.length ? S.wt[S.wt.length - 1].k : S.p.w;
function kal() {
  const p = S.p, w = cur(), bmr = 10 * w + 6.25 * p.h - 5 * p.a + (p.g === "m" ? 5 : -161), td = bmr * p.f, adj = p.t > w ? 300 : p.t < w ? -400 : 0;
  return {bmr, td, adj, k: td + adj, p1: w * 1.6, p2: w * 2};
}
function minggu() { const d = new Date(), i = (d.getDay() + 6) % 7; return JADWAL.map((_, j) => iso(new Date(d.getFullYear(), d.getMonth(), d.getDate() - i + j))); }
function progres() { const s = S.wt.length ? S.wt[0].k : S.p.w, t = S.p.t; return t === s ? 100 : Math.max(0, Math.min(100, (cur() - s) / (t - s) * 100)); }
function grafik() {
  const a = S.wt.slice(-20); if (a.length < 2) return '<p class="l">Catat berat minimal 2 kali untuk melihat grafik.</p>';
  const v = a.map(x => x.k).concat([S.p.t]), lo = Math.min(...v) - 1, hi = Math.max(...v) + 1, X = i => 10 + i * 300 / (a.length - 1), Y = k => 110 - (k - lo) / (hi - lo) * 100;
  return `<svg viewBox="0 0 320 120" role="img" aria-label="Grafik berat badan"><line x1="10" x2="310" y1="${Y(S.p.t)}" y2="${Y(S.p.t)}" stroke="#22C55E" stroke-dasharray="4 4" opacity=".6"/><polyline fill="none" stroke="#22C55E" stroke-width="2.5" points="${a.map((x, i) => X(i) + "," + Y(x.k)).join(" ")}"/>${a.map((x, i) => `<circle r="3" cx="${X(i)}" cy="${Y(x.k)}" fill="#22C55E"/>`).join("")}</svg><p class="l">Garis putus-putus: berat target.</p>`;
}

// ===== Tampilan =====
function vMon() {
  const r = rencana(), k = kal(), n = minggu().filter(d => S.done[d]).length, hari = JADWAL[(new Date().getDay() + 6) % 7];
  return `<h1>Beranda</h1>
<section class="card hero"><span class="l">Saldo utama (uang kamu sekarang)</span><div class="big">${rp(saldo())}</div><span class="l">Tabungan terkumpul: <b>${rp(sum("sv"))}</b></span><div class="row" style="margin-top:6px"><span>Boleh dikeluarkan sekarang</span><b>${rp(Math.max(saldo() - Math.max(S.nabung - r.sv, 0), 0))}</b></div></section>
${isiCard()}
<section class="card"><h2>Rencana bulan ini</h2>
<div class="row"><span>Uang bulanan</span><b>${rp(S.uang)}</b></div>
<div class="row"><span>Target nabung</span><b>${rp(S.nabung)}</b></div>
<div class="row"><span>Jatah belanja</span><b>${rp(r.jatah)}</b></div>
<h3>Pengeluaran ${rp(r.pakai)} dari ${rp(r.jatah)}</h3>${bar(r.pakai, r.jatah, 1)}
<p class="l ${r.sisa < 0 ? "neg" : ""}">${r.sisa < 0 ? "Melebihi jatah " + rp(-r.sisa) : "Sisa jatah " + rp(r.sisa) + ", aman dipakai sekitar " + rp(r.perHari) + " per hari"}</p>
<h3>Nabung bulan ini ${rp(r.sv)} dari ${rp(S.nabung)}</h3>${bar(r.sv, S.nabung)}
<p class="l">${r.sv >= S.nabung ? "Target nabung bulan ini tercapai" : "Kurang " + rp(S.nabung - r.sv) + " lagi"}</p></section>
<section class="card"><h2>Gym hari ini: ${hari.n}</h2><p>${hari.t}</p><p class="l">Minggu ini ${n}/7 hari selesai</p>${bar(n, 7)}<button class="btn alt" data-act="go" data-v="wo">Buka jadwal workout</button></section>
<div class="g2"><section class="card"><span class="l">Target kalori</span><div class="big" style="font-size:24px">${Math.round(k.k)}</div><span class="l">kkal per hari</span></section><section class="card"><span class="l">Berat badan</span><div class="big" style="font-size:24px">${cur()} kg</div><span class="l">target ${S.p.t} kg</span></section></div>`;
}
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
function vGym() {
  const wk = minggu(), d = JADWAL[sel], dt = wk[sel], k = kal(), n = wk.filter(x => S.done[x]).length;
  return `<h1>Jadwal Workout Harian</h1><div class="wk">${JADWAL.map((x, i) => `<button class="${S.done[wk[i]] ? "d " : ""}${i === sel ? "sel" : ""}" data-act="day" data-i="${i}"><span>${x.n.slice(0, 3)}</span><b>${S.done[wk[i]] ? "✓" : ""}</b></button>`).join("")}</div>
<section class="card"><h2>${d.n}: ${d.t}</h2><p class="l">${dt} · ${n}/7 hari selesai minggu ini</p><button class="btn${S.done[dt] ? " alt" : ""}" data-act="tg" data-d="${dt}">${S.done[dt] ? "✓ Selesai (ketuk untuk batalkan)" : "Tandai selesai"}</button><h3>Latihan</h3><ul>${d.w.map(x => `<li>${x}</li>`).join("")}</ul></section>
<section class="card"><h2>Makanan</h2><ul>${d.m.map(x => `<li>${x}</li>`).join("")}</ul><p class="l">Target harianmu: ${Math.round(k.k)} kkal, protein ${Math.round(k.p1)}–${Math.round(k.p2)} g.</p></section>
<section class="card"><h2>Fokus</h2><p>${d.f}</p></section>`;
}
function vBody() {
  const p = S.p, k = kal(), akt = [[1.375, "Ringan (1–3x/minggu)"], [1.55, "Sedang (3–5x/minggu)"], [1.725, "Berat (6–7x/minggu)"]];
  return `<section class="card"><h2>Data tubuh</h2><div class="form">
<div class="g2"><label>Tinggi (cm)<input id="ph" type="number" value="${p.h}"></label><label>Berat sekarang (kg)<input id="pw" type="number" step="0.1" value="${cur()}"></label></div>
<div class="g2"><label>Berat target (kg)<input id="pt" type="number" step="0.1" value="${p.t}"></label><label>Usia<input id="pa" type="number" value="${p.a}"></label></div>
<div class="g2"><label>Jenis kelamin<select id="pg"><option value="m"${p.g === "m" ? " selected" : ""}>Laki-laki</option><option value="f"${p.g === "f" ? " selected" : ""}>Perempuan</option></select></label><label>Aktivitas<select id="pf">${akt.map(o => `<option value="${o[0]}"${p.f === o[0] ? " selected" : ""}>${o[1]}</option>`).join("")}</select></label></div>
<button class="btn" data-act="saveP">Simpan data tubuh</button></div></section>
<section class="card"><h2>Kebutuhan harian</h2><div class="big">${Math.round(k.k)} kkal</div><p class="l">BMR ${Math.round(k.bmr)}, TDEE ${Math.round(k.td)}${k.adj > 0 ? ", surplus +300 untuk naik berat" : k.adj < 0 ? ", defisit 400 untuk turun berat" : ", jaga berat"}</p><p>Protein sekitar <b>${Math.round(k.p1)}–${Math.round(k.p2)} g</b> per hari</p><p class="l">Perkiraan dengan rumus Mifflin-St Jeor. Jika berat tidak naik setelah 2–3 minggu, tambah 100–150 kkal.</p></section>
<section class="card"><h2>Progres berat: ${cur()} kg menuju ${p.t} kg</h2>${bar(progres(), 100)}${grafik()}<div class="g2" style="grid-template-columns:1fr auto;margin-top:10px"><input id="nw" type="number" step="0.1" placeholder="Berat hari ini (kg)"><button class="btn" style="width:auto" data-act="addWt">Catat</button></div></section>`;
}
function vRen() {
  return `<section class="card"><h2>Atur rencana bulanan</h2><div class="form">
<label>Uang bulanan (Rp)<input id="ru" type="number" inputmode="numeric" value="${S.uang}"></label>
<label>Target nabung per bulan (Rp)<input id="rn" type="number" inputmode="numeric" value="${S.nabung}"></label>
<label>Target tabungan total (Rp, boleh kosong)<input id="rg" type="number" inputmode="numeric" value="${S.goal || ""}"></label>
<p class="l">Contoh: uang bulanan 1.500.000 dan target nabung 200.000, maka jatah belanja 1.300.000 per bulan.</p>
<button class="btn" data-act="saveR">Simpan rencana</button></div></section>`;
}
function vPin() {
  return `<section class="card"><h2>Kunci PIN</h2><div class="form"><label>PIN 4 angka${S.pin ? " (sedang aktif)" : ""}<input id="pn" type="password" inputmode="numeric" maxlength="4"></label><div class="g2"><button class="btn alt" data-act="setPin">Pasang PIN</button><button class="btn alt" data-act="clrPin">Hapus PIN</button></div></div></section>
<section class="card"><h2>Cadangan data</h2><p class="l">Semua datamu hanya tersimpan di browser HP ini, tidak ada server. Kalau browser dibersihkan atau HP diganti, data hilang. Cadangan adalah file salinan data yang bisa kamu simpan, lalu dipulihkan kapan saja.</p><div class="g2"><button class="btn alt" data-act="exp">Simpan cadangan</button><button class="btn alt" data-act="imp">Pulihkan dari file</button></div></section>`;
}
const isiCard = () => `<section class="card"><h2>Isi saldo utama</h2><div class="g2" style="grid-template-columns:1fr auto"><input id="is" type="number" inputmode="numeric" placeholder="Jumlah uang (Rp)"><button class="btn" style="width:auto" data-act="isi">Tambah saldo</button></div><p class="l">Masukkan uang yang kamu punya. Jumlahnya ditambahkan ke saldo utama dan tercatat di riwayat. Salah input? Hapus di Riwayat (halaman Monitoring Keuangan).</p></section>`;
function hasil(t, n) {
  const b = t - n, d = new Date(), sh = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() - d.getDate() + 1;
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
const vHome = () => vMon() + vPin(), vFin = () => `<h1>Monitoring Keuangan</h1>` + vPlan() + kalk() + vRen() + vCat(), vWo = () => vGym() + vBody();
const V = {home: vHome, fin: vFin, wo: vWo}, NAV = [["home", "🏠", "Beranda"], ["fin", "💰", "Monitoring Keuangan"], ["wo", "🏋️", "Jadwal Workout"]];
function render() {
  if (S.pin && !ok) { $("#nav").innerHTML = ""; $("#app").innerHTML = '<div class="lock"><h1>Masukkan PIN</h1><input id="up" type="password" inputmode="numeric" maxlength="4" style="text-align:center;font-size:22px"><button class="btn" data-act="unlock">Buka</button></div>'; return; }
  $("#app").innerHTML = V[tab](); $("#nav").innerHTML = '<div class="brand">MK</div>' + NAV.map(n => `<button class="${n[0] === tab ? "on" : ""}" data-act="go" data-v="${n[0]}"><span class="ic">${n[1]}</span><span class="tx2">${n[2]}</span></button>`).join("");
}

// ===== Aksi tombol =====
const num = id => parseFloat($(id).value);
const A = {
  isi: () => { const a = num("#is"); if (!(a > 0)) return toast("Isi jumlah lebih dari 0"); S.tx.push({id: Date.now(), k: "in", a, c: "Isi saldo", d: iso(), n: ""}); save(); render(); toast("Saldo bertambah " + rp(a)); },
  go: d => { tab = d.v; render(); scrollTo(0, 0); },
  day: d => { sel = +d.i; render(); },
  tg: d => { if (S.done[d.d]) delete S.done[d.d]; else S.done[d.d] = true; save(); render(); },
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
  saveP: () => {
    const p = S.p, w = num("#pw"), old = S.wt.length ? S.wt[S.wt.length - 1].k : null;
    p.h = num("#ph") || p.h; p.t = num("#pt") || p.t; p.a = num("#pa") || p.a; p.g = $("#pg").value; p.f = +$("#pf").value;
    if (w > 0) { p.w = w; if (old !== w) logW(w); }
    save(); render(); toast("Data tubuh tersimpan");
  },
  addWt: () => { const w = num("#nw"); if (!(w > 0)) return toast("Isi berat badan"); logW(w); S.p.w = w; save(); render(); toast("Berat tercatat"); },
  setPin: () => { const p = $("#pn").value; if (!/^\d{4}$/.test(p)) return toast("PIN harus 4 angka"); S.pin = p; ok = true; save(); render(); toast("PIN dipasang"); },
  clrPin: () => { S.pin = ""; save(); render(); toast("PIN dihapus"); },
  unlock: () => { if ($("#up").value === S.pin) { ok = true; render(); } else { $("#up").value = ""; toast("PIN salah"); } },
  exp: () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], {type: "application/json"})); a.download = "cadangan-monitoring-" + iso() + ".json"; a.click(); toast("File cadangan disimpan"); },
  imp: () => $("#file").click()
};
function logW(k) { const d = iso(), l = S.wt[S.wt.length - 1]; if (l && l.d === d) l.k = k; else S.wt.push({d, k}); }
document.addEventListener("click", e => { const b = e.target.closest("[data-act]"); if (b && A[b.dataset.act]) A[b.dataset.act](b.dataset); });
document.addEventListener("input", e => { if (e.target.id === "kt" || e.target.id === "kn") $("#ko").innerHTML = hasil(parseFloat($("#kt").value) || 0, parseFloat($("#kn").value) || 0); });
document.addEventListener("change", e => { if (e.target.id === "tk") $("#tc").innerHTML = opsi(e.target.value); });
$("#file").addEventListener("change", e => {
  const f = e.target.files[0]; if (!f) return; const r = new FileReader();
  r.onload = () => { try { const o = JSON.parse(r.result); if (!Array.isArray(o.tx)) throw 0; S = {...DEF, ...o}; save(); render(); toast("Data dipulihkan"); } catch (x) { toast("File cadangan tidak valid"); } };
  r.readAsText(f); e.target.value = "";
});
render();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
