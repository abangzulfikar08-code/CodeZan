// Kategori transaksi dan pengelompokannya.
const KATEGORI = {
  out: ["Makan", "Transport", "Belanja", "Tagihan", "Hiburan", "Kesehatan", "Gym & Suplemen", "Skincare", "Lainnya"],
  in: ["Uang bulanan", "Gaji", "Bonus", "Lainnya"],
  sv: ["Tabungan"]
};
// Pengelompokan untuk melihat pola pengeluaran (kebutuhan, keinginan, gym).
const GRUP = {"Makan":"Kebutuhan","Transport":"Kebutuhan","Tagihan":"Kebutuhan","Kesehatan":"Kebutuhan","Belanja":"Keinginan","Hiburan":"Keinginan","Lainnya":"Keinginan","Gym & Suplemen":"Gym dan penampilan","Skincare":"Gym dan penampilan"};
