// Router, halaman Beranda, PIN, cadangan, dan pemasangan event.
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
${vAsisten("semua")}
<section class="card"><h2>Gym hari ini: ${hari.n}</h2><p>${hari.t}</p><p class="l">Minggu ini ${n}/7 hari selesai</p>${bar(n, 7)}<button class="btn alt" data-act="go" data-v="wo">Buka jadwal workout</button></section>
<div class="g2"><section class="card"><span class="l">Target kalori</span><div class="big" style="font-size:24px">${Math.round(k.k)}</div><span class="l">kkal per hari</span></section><section class="card"><span class="l">Berat badan</span><div class="big" style="font-size:24px">${cur()} kg</div><span class="l">target ${S.p.t} kg</span></section></div>`;
}
function vPin() {
  return `<section class="card"><h2>Kunci PIN</h2><div class="form"><label>PIN 4 angka${S.pin ? " (sedang aktif)" : ""}<input id="pn" type="password" inputmode="numeric" maxlength="4"></label><div class="g2"><button class="btn alt" data-act="setPin">Pasang PIN</button><button class="btn alt" data-act="clrPin">Hapus PIN</button></div></div></section>
<section class="card"><h2>Cadangan data</h2><p class="l">Semua datamu hanya tersimpan di browser HP ini, tidak ada server. Kalau browser dibersihkan atau HP diganti, data hilang. Cadangan adalah file salinan data yang bisa kamu simpan, lalu dipulihkan kapan saja.</p><div class="g2"><button class="btn alt" data-act="exp">Simpan cadangan</button><button class="btn alt" data-act="imp">Pulihkan dari file</button></div></section>`;
}
const vHome = () => vMon() + vPin(), vFin = () => `<h1>Monitoring Keuangan</h1>` + vPlan() + vAsisten("keuangan") + vAnggaran() + kalk() + vRen() + vCat(), vWo = () => vGym() + vKebiasaan() + vKeperluan() + vAsisten("gym") + vBody();
const V = {home: vHome, fin: vFin, wo: vWo}, NAV = [["home", "🏠", "Beranda"], ["fin", "💰", "Monitoring Keuangan"], ["wo", "🏋️", "Jadwal Workout"]];
function render() {
  if (S.pin && !ok) { $("#nav").innerHTML = ""; $("#app").innerHTML = '<div class="lock"><h1>Masukkan PIN</h1><input id="up" type="password" inputmode="numeric" maxlength="4" style="text-align:center;font-size:22px"><button class="btn" data-act="unlock">Buka</button></div>'; return; }
  $("#app").innerHTML = V[tab](); $("#nav").innerHTML = '<div class="brand">MK</div>' + NAV.map(n => `<button class="${n[0] === tab ? "on" : ""}" data-act="go" data-v="${n[0]}"><span class="ic">${n[1]}</span><span class="tx2">${n[2]}</span></button>`).join("");
}
const A = {...AK, ...AG,
  go: d => { tab = d.v; render(); scrollTo(0, 0); },
  setPin: () => { const p = $("#pn").value; if (!/^\d{4}$/.test(p)) return toast("PIN harus 4 angka"); S.pin = p; ok = true; save(); render(); toast("PIN dipasang"); },
  clrPin: () => { S.pin = ""; save(); render(); toast("PIN dihapus"); },
  unlock: () => { if ($("#up").value === S.pin) { ok = true; render(); } else { $("#up").value = ""; toast("PIN salah"); } },
  exp: () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], {type: "application/json"})); a.download = "cadangan-monitoring-" + iso() + ".json"; a.click(); toast("File cadangan disimpan"); },
  imp: () => $("#file").click()
};
document.addEventListener("click", e => { const b = e.target.closest("[data-act]"); if (b && A[b.dataset.act]) A[b.dataset.act](b.dataset); });
document.addEventListener("input", e => { if (e.target.id === "kt" || e.target.id === "kn") $("#ko").innerHTML = hasil(parseFloat($("#kt").value) || 0, parseFloat($("#kn").value) || 0); });
document.addEventListener("change", e => { if (e.target.id === "tk") $("#tc").innerHTML = opsi(e.target.value); });
$("#file").addEventListener("change", e => {
  const f = e.target.files[0]; if (!f) return; const r = new FileReader();
  r.onload = () => { try { const o = JSON.parse(r.result); if (!Array.isArray(o.tx)) throw 0; S = {...JSON.parse(JSON.stringify(DEF)), ...o}; save(); render(); toast("Data dipulihkan"); } catch (x) { toast("File cadangan tidak valid"); } };
  r.readAsText(f); e.target.value = "";
});
render();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
