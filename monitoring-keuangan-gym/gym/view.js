// Tampilan halaman Jadwal Workout.
function grafik() {
  const a = S.wt.slice(-20); if (a.length < 2) return '<p class="l">Catat berat minimal 2 kali untuk melihat grafik.</p>';
  const v = a.map(x => x.k).concat([S.p.t]), lo = Math.min(...v) - 1, hi = Math.max(...v) + 1, X = i => 10 + i * 300 / (a.length - 1), Y = k => 110 - (k - lo) / (hi - lo) * 100;
  return `<svg viewBox="0 0 320 120" role="img" aria-label="Grafik berat badan"><line x1="10" x2="310" y1="${Y(S.p.t)}" y2="${Y(S.p.t)}" stroke="#22C55E" stroke-dasharray="4 4" opacity=".6"/><polyline fill="none" stroke="#22C55E" stroke-width="2.5" points="${a.map((x, i) => X(i) + "," + Y(x.k)).join(" ")}"/>${a.map((x, i) => `<circle r="3" cx="${X(i)}" cy="${Y(x.k)}" fill="#22C55E"/>`).join("")}</svg><p class="l">Garis putus-putus: berat target.</p>`;
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
function vKebiasaan() {
  const t = iso(), n = habitHitung(S, t), st = hitungStreak(k => habitHitung(S, k) >= 3, new Date());
  const pekan = minggu().reduce((a, k) => a + habitHitung(S, k), 0);
  return `<section class="card"><h2>Kebiasaan hari ini</h2><p class="l">Streak: <b>${st} hari</b> berturut-turut (hari berhasil jika minimal 3 dari 5). Minggu ini: ${Math.round(pekan / 35 * 100)}%.</p>${HABIT.map(h => `<button class="hbt${habitYa(S, t, h[0]) ? " d" : ""}" data-act="hb" data-id="${h[0]}"><b>${habitYa(S, t, h[0]) ? "✓" : ""}</b><span>${h[1]}</span></button>`).join("")}<p class="l">${n}/5 selesai hari ini</p></section>`;
}
function vKeperluan() {
  const d = JADWAL[(new Date().getDay() + 6) % 7], gym = d.t.startsWith("Gym"), k = kal();
  return `<section class="card"><h2>Keperluan hari ini (${d.n})</h2><div class="row"><span>Kalori</span><b>${Math.round(k.k)} kkal</b></div><div class="row"><span>Protein</span><b>${Math.round(k.p1)}–${Math.round(k.p2)} g</b></div><div class="row"><span>Air minum</span><b>${hitungAir(cur(), gym)} liter</b></div><h3>Siapkan</h3><ul>${PERLENGKAPAN[gym ? "gym" : "ringan"].map(x => `<li>${x}</li>`).join("")}</ul></section>`;
}
