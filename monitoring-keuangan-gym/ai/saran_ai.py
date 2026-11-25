"""Minta saran dari Claude berdasarkan file cadangan aplikasi (menu Atur > Simpan cadangan).

Pakai:
    set ANTHROPIC_API_KEY=kunci_kamu            (Windows)
    export ANTHROPIC_API_KEY=kunci_kamu         (Linux, macOS, WSL)
    python ai/saran_ai.py cadangan-monitoring-2026-11-25.json

Hanya angka ringkasan yang dikirim ke API Anthropic, bukan catatan teks transaksi.
Model bisa diganti lewat variabel CLAUDE_MODEL.
"""
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import date, timedelta

MODEL = os.environ.get("CLAUDE_MODEL", "claude-sonnet-5-5")


def ringkas(data, hari_ini=None):
    hari_ini = hari_ini or date.today()
    bulan = hari_ini.isoformat()[:7]
    keluar, setor, kategori = 0, 0, {}
    for t in data.get("tx", []):
        if not t["d"].startswith(bulan):
            continue
        if t["k"] == "out":
            keluar += t["a"]
            kategori[t["c"]] = kategori.get(t["c"], 0) + t["a"]
        elif t["k"] == "sv":
            setor += t["a"]
    p, wt = data.get("p", {}), data.get("wt", [])
    tujuh = [(hari_ini - timedelta(days=i)).isoformat() for i in range(7)]
    return {
        "uang_bulanan": data.get("uang", 0),
        "target_nabung_bulanan": data.get("nabung", 0),
        "pengeluaran_bulan_ini": keluar,
        "pengeluaran_per_kategori": kategori,
        "setoran_tabungan_bulan_ini": setor,
        "berat_sekarang_kg": wt[-1]["k"] if wt else p.get("w"),
        "berat_target_kg": p.get("t"),
        "hari_latihan_7_hari_terakhir": sum(1 for d in tujuh if d in data.get("done", {})),
        "kebiasaan_lain_selesai_7_hari": sum(len(data.get("hb", {}).get(d, {})) for d in tujuh),
    }


def minta_saran(ringkasan):
    kunci = os.environ.get("ANTHROPIC_API_KEY")
    if not kunci:
        sys.exit("Set dulu variabel ANTHROPIC_API_KEY.")
    perintah = (
        "Kamu asisten keuangan pribadi dan kebugaran. Berdasarkan ringkasan angka berikut (rupiah), "
        "beri maksimal 5 saran praktis dan singkat dalam bahasa Indonesia: 3 untuk keuangan, 2 untuk "
        "olahraga dan kebiasaan. Jangan memberi nasihat medis.\n\n"
        + json.dumps(ringkasan, ensure_ascii=False, indent=1)
    )
    isi = {"model": MODEL, "max_tokens": 700, "messages": [{"role": "user", "content": perintah}]}
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(isi).encode(),
        headers={"content-type": "application/json", "x-api-key": kunci, "anthropic-version": "2023-06-01"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            hasil = json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"Gagal ({e.code}): {e.read().decode()[:300]}")
    return "".join(b.get("text", "") for b in hasil["content"])


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("Pakai: python ai/saran_ai.py <file-cadangan.json>")
    with open(sys.argv[1], encoding="utf-8") as f:
        r = ringkas(json.load(f))
    print("Ringkasan yang dikirim:\n" + json.dumps(r, ensure_ascii=False, indent=1) + "\n")
    print(minta_saran(r))
