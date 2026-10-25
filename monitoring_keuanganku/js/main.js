const App = {
    // Fungsi untuk berpindah antar Tab (Finance <-> Workout)
    switchTab: function(tabName) {
        ['finance', 'workout'].forEach(t => {
            document.getElementById(`tab-content-${t}`).classList.add('hidden');
            document.getElementById(`tab-btn-${t}`).classList.remove('active');
        });
        
        document.getElementById(`tab-content-${tabName}`).classList.remove('hidden');
        document.getElementById(`tab-btn-${tabName}`).classList.add('active');
    },

    // Fungsi untuk menampilkan notifikasi kecil di pojok kanan bawah
    showToast: function(msg, isSuccess = true) {
        const toast = document.getElementById('toast');
        document.getElementById('toast-msg').innerText = msg;
        
        // Ganti ikon dan warna berdasarkan status (berhasil/gagal)
        document.getElementById('toast-icon').className = isSuccess 
            ? "fas fa-check-circle text-accentemerald" 
            : "fas fa-exclamation-circle text-red-500";
            
        // Animasi muncul
        toast.classList.remove('translate-y-20', 'opacity-0');
        
        // Animasi hilang setelah 2.5 detik
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 2500);
    }
};