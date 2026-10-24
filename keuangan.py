# Analisis Keuangan Personal - keuangan.py
import pandas as pd
import numpy as np
import sys
import os

def load_data(filepath):
    """Membaca file rekap CSV hasil ekspor dari dashboard web."""
    if not os.path.exists(filepath):
        print(f"[Error] File '{filepath}' tidak ditemukan.")
        return None
    
    df = pd.read_csv(filepath)
    df['Nominal'] = pd.to_numeric(df['Nominal'], errors='coerce')
    return df

def analyze_finance(df):
    """Melakukan kalkulasi statistik pengeluaran, pemasukan, dan alokasi."""
    income = df[df['Tipe'] == 'income']['Nominal'].sum()
    expense = df[df['Tipe'] == 'expense']['Nominal'].sum()
    net_savings = income - expense

    print("\n==========================================")
    print("      LOKAL ANALISIS KEUANGAN PYTHON      ")
    print("==========================================")
    print(f"Total Pemasukan   : Rp {income:,.0f}")
    print(f"Total Pengeluaran : Rp {expense:,.0f}")
    print(f"Sisa Net Tabungan : Rp {net_savings:,.0f}")
    print("------------------------------------------")

    # Grouping Berdasarkan Kategori
    expense_df = df[df['Tipe'] == 'expense']
    if not expense_df.empty:
        cat_summary = expense_df.groupby('Kategori')['Nominal'].sum().reset_index()
        cat_summary['Persentase'] = (cat_summary['Nominal'] / expense) * 100
        cat_summary = cat_summary.sort_values(by='Nominal', ascending=False)

        print("\n[ Breakdown Pengeluaran per Kategori ]")
        for idx, row in cat_summary.iterrows():
            print(f"- {row['Kategori']:<20}: Rp {row['Nominal']:>10,.0f} ({row['Persentase']:>5.1f}%)")
    
    # Evaluasi Alokasi Portofolio Ideal (70/30)
    print("\n[ Rekomendasi Alokasi Portofolio dari Sisa Tabungan ]")
    emergency_fund = max(0, net_savings * 0.70)
    growth_fund = max(0, net_savings * 0.30)
    print(f"* 70% Likuid/RDPU/SeaBank  : Rp {emergency_fund:,.0f}")
    print(f"* 30% Saham Blue Chip (BBRI): Rp {growth_fund:,.0f}")
    print("==========================================\n")

if __name__ == "__main__":
    file_path = sys.argv[1] if len(sys.argv) > 1 else "rekap_keuangan_guest_demo.csv"
    data = load_data(file_path)
    if data is not None:
        analyze_finance(data)