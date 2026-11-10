// Data tetap: jadwal latihan + makanan (dari foto jadwalmu) dan kategori transaksi.
const KATEGORI = {
  out: ["Makan", "Transport", "Belanja", "Tagihan", "Hiburan", "Kesehatan", "Lainnya"],
  in: ["Uang bulanan", "Gaji", "Bonus", "Lainnya"],
  sv: ["Tabungan"]
};
const JADWAL = [
{n:"Senin",t:"Gym: Push",w:["Bench Press 3×6-8","Incline DB Press 3×8-10","Seated Shoulder Press 3×8-10","Lateral Raise 4×12-15","Rope Pushdown 3×10-12","Overhead Triceps Extension 2×12-15"],m:["Pagi: oat + susu + pisang + 3 telur","Siang: nasi + ayam 150–200 g + tempe + sayur","Malam: nasi + telur + tahu/tempe + sayur"],f:"Prioritas chest, side delts, triceps."},
{n:"Selasa",t:"Recovery",w:["Jalan santai 20–30 menit atau mobilitas 10–15 menit"],m:["Pagi: nasi + 3 telur + sayur + buah","Siang: nasi + ayam/ikan + tempe + sayur","Snack: susu + pisang + roti/kacang","Malam: nasi + tahu/tempe + telur + sayur"],f:"Protein tetap 120–140 g. Tidur 7–9 jam. Jangan sengaja mengurangi makan."},
{n:"Rabu",t:"Gym: Pull",w:["Lat Pulldown/Pull-up 3×8-10","Chest-Supported Row 3×8-10","Seated Cable Row 2×10-12","Face Pull/Reverse Fly 3×12-15","DB Curl 3×10-12","Hammer Curl 3×10-12"],m:["Pagi: oat + susu + 3 telur + pisang","Siang: nasi + ayam 150–200 g + tempe + sayur","Pre-gym: roti + pisang","Post-gym: nasi + ikan/ayam + sayur","Malam: nasi + telur + tahu/tempe + sayur"],f:"Prioritas lats, upper back, rear delts, biceps."},
{n:"Kamis",t:"Recovery",w:["Rest. Jalan santai 20–30 menit bila mau.","Mobilitas ringan jika kaku."],m:["Pagi: nasi + telur 3 + sayur","Siang: nasi + ayam/ikan + tempe + sayur","Snack: oatmeal + susu + pisang","Malam: nasi + telur/tahu/tempe + sayur + buah"],f:"Kalori tetap sekitar target. Fokus recovery dan hidrasi."},
{n:"Jumat",t:"Gym: Legs + Physique",w:["Squat/Leg Press 3×6-10","Romanian Deadlift 3×8-10","Leg Curl 2×10-12","Incline DB Press 3×8-10","Lateral Raise 4×12-15","Cable Curl 2×10-12","Triceps Pushdown 2×10-12"],m:["Pagi: oat + susu + pisang + 3 telur","Siang: nasi + ayam 150–200 g + tempe + sayur","Pre-gym: roti + pisang + susu","Post-gym: nasi + ayam/ikan + sayur","Malam: nasi + telur + tahu/tempe + sayur"],f:"Prioritas upper chest, side delts, arms; kaki tetap dilatih."},
{n:"Sabtu",t:"Active recovery",w:["Jalan santai 20–30 menit + stretching ringan 10 menit","Tidak perlu beban tambahan"],m:["Pagi: nasi + telur + sayur + buah","Siang: nasi + ayam/ikan + tempe + sayur","Snack: susu + pisang + roti","Malam: nasi + tahu/tempe + telur + sayur"],f:"Protein tetap 120–140 g. Boleh meal-prep 2–3 hari sekaligus."},
{n:"Minggu",t:"Rest",w:["Istirahat total atau aktivitas ringan"],m:["Pagi: oatmeal + susu + 3 telur + pisang","Siang: nasi + ayam/ikan + tempe"],f:"Jika rata-rata berat tidak naik setelah 2–3 minggu, tambah 100–150 kkal."}
];
