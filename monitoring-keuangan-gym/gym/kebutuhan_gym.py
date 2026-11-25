"""Hitung kebutuhan harian gym dan tampilkan jadwal hari ini.
Jalankan: python gym/kebutuhan_gym.py"""
from datetime import date

JADWAL = ["Gym: Push", "Recovery", "Gym: Pull", "Recovery", "Gym: Legs + Physique", "Active recovery", "Rest"]
HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]


def kebutuhan(tinggi, berat, target, usia, laki=True, aktivitas=1.55):
    bmr = 10 * berat + 6.25 * tinggi - 5 * usia + (5 if laki else -161)
    tdee = bmr * aktivitas
    tambah = 300 if target > berat else -400 if target < berat else 0
    return {"kalori": round(tdee + tambah), "protein_g": (round(berat * 1.6), round(berat * 2)), "air_liter": round(berat * 0.035, 1)}


def angka(pesan, default):
    teks = input(f"{pesan} [{default}]: ").strip()
    return float(teks) if teks else default


if __name__ == "__main__":
    t, b, tg, u = angka("Tinggi (cm)", 170), angka("Berat (kg)", 60), angka("Berat target (kg)", 70), angka("Usia", 20)
    k = kebutuhan(t, b, tg, u)
    i = date.today().weekday()
    print(f"\nHari ini: {HARI[i]}, {JADWAL[i]}")
    print(f"Kalori   : {k['kalori']} kkal")
    print(f"Protein  : {k['protein_g'][0]}-{k['protein_g'][1]} g")
    print(f"Air      : {k['air_liter'] + (0.5 if JADWAL[i].startswith('Gym') else 0):.1f} liter")
