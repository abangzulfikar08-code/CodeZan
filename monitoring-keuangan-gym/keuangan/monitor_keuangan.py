"""Program Monitoring Keuangan (versi terminal).
Jalankan: python python/monitor_keuangan.py"""
import calendar
from datetime import date


def rupiah(n):
    return "Rp " + f"{n:,.0f}".replace(",", ".")


def baca_angka(pesan):
    while True:
        try:
            nilai = float(input(pesan))
            if nilai < 0:
                raise ValueError
            return nilai
        except ValueError:
            print("Masukkan angka yang valid (tidak boleh negatif).")


def monitor_keuangan():
    print("--- PROGRAM MONITORING KEUANGAN ---")

    # Input data uang
    total_uang = baca_angka("Masukkan total uang Anda saat ini (Rp): ")
    target_tabungan = baca_angka("Masukkan jumlah uang yang ingin ditabung (Rp): ")

    # Perhitungan otomatis
    uang_dikeluarkan = total_uang - target_tabungan

    # Menampilkan hasil
    print("\n--- HASIL ANALISIS ---")
    print(f"Total Uang         : {rupiah(total_uang)}")
    print(f"Disisihkan (Nabung): {rupiah(target_tabungan)}")

    if uang_dikeluarkan < 0:
        print("Peringatan: target tabungan lebih besar dari total uang.")
        return

    hari_ini = date.today()
    sisa_hari = calendar.monthrange(hari_ini.year, hari_ini.month)[1] - hari_ini.day + 1
    print(f"Maksimal Uang yang Boleh Dikeluarkan: {rupiah(uang_dikeluarkan)}")
    print(f"Sekitar {rupiah(uang_dikeluarkan / sisa_hari)} per hari ({sisa_hari} hari sampai akhir bulan)")


if __name__ == "__main__":
    monitor_keuangan()
