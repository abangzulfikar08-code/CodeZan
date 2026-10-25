const Workout = {
    saveProfile: function() {
        const h = parseFloat(document.getElementById('profile-height').value);
        const w = parseFloat(document.getElementById('profile-weight').value);
        const t = parseFloat(document.getElementById('profile-target').value);

        if(!h || !w || !t) return alert("Isi semua data tinggi, berat, dan target!");

        const profile = { height: h, weight: w, target: t };
        localStorage.setItem('profile_' + Auth.currentUser, JSON.stringify(profile));
        
        this.updateHeaderDisplay(h, w);
        this.calculateMacros(h, w);
        App.showToast('Profil Fisik Disimpan!');
    },

    loadProfile: function() {
        const raw = localStorage.getItem('profile_' + Auth.currentUser);
        if (raw) {
            const profile = JSON.parse(raw);
            document.getElementById('profile-height').value = profile.height;
            document.getElementById('profile-weight').value = profile.weight;
            document.getElementById('profile-target').value = profile.target;
            
            this.updateHeaderDisplay(profile.height, profile.weight);
            this.calculateMacros(profile.height, profile.weight);
        } else {
            document.getElementById('profile-height').value = "";
            document.getElementById('profile-weight').value = "";
            document.getElementById('profile-target').value = "";
            this.updateHeaderDisplay("-", "-");
            this.clearMacros();
        }
    },

    updateHeaderDisplay: function(h, w) {
        document.getElementById('display-physique').innerText = `${h} cm / ${w} kg`;
    },

    calculateMacros: function(h, w) {
        const bmr = 10 * w + 6.25 * h - 5 * 21 + 5;
        const tdee = bmr * 1.45;
        const targetCalories = Math.round(tdee + 350);

        document.getElementById('macro-calories').innerText = targetCalories.toLocaleString('id-ID') + ' kcal';
        document.getElementById('macro-protein').innerText = `${Math.round(w * 2.1)} - ${Math.round(w * 2.4)} g`;
        document.getElementById('macro-carbs').innerText = `${Math.round(w * 6)} - ${Math.round(w * 7)} g`;
        document.getElementById('macro-water').innerText = '3.0 - 3.5 L';
    },

    clearMacros: function() {
        document.getElementById('macro-calories').innerText = '-';
        document.getElementById('macro-protein').innerText = '-';
        document.getElementById('macro-carbs').innerText = '-';
        document.getElementById('macro-water').innerText = '-';
    },

    // --- LOGIKA JADWAL LATIHAN MINGGUAN ---
    saveSchedule: function() {
        const schedule = {
            senin: document.getElementById('wo-senin').checked,
            selasa: document.getElementById('wo-selasa').checked,
            rabu: document.getElementById('wo-rabu').checked,
            kamis: document.getElementById('wo-kamis').checked,
            jumat: document.getElementById('wo-jumat').checked,
            sabtu: document.getElementById('wo-sabtu').checked,
            minggu: document.getElementById('wo-minggu').checked,
        };
        localStorage.setItem('schedule_' + Auth.currentUser, JSON.stringify(schedule));
        App.showToast('Jadwal Latihan Diperbarui!');
    },

    loadSchedule: function() {
        const raw = localStorage.getItem('schedule_' + Auth.currentUser);
        if (raw) {
            const schedule = JSON.parse(raw);
            document.getElementById('wo-senin').checked = schedule.senin || false;
            document.getElementById('wo-selasa').checked = schedule.selasa || false;
            document.getElementById('wo-rabu').checked = schedule.rabu || false;
            document.getElementById('wo-kamis').checked = schedule.kamis || false;
            document.getElementById('wo-jumat').checked = schedule.jumat || false;
            document.getElementById('wo-sabtu').checked = schedule.sabtu || false;
            document.getElementById('wo-minggu').checked = schedule.minggu || false;
        } else {
            // Reset jika user baru
            ['senin','selasa','rabu','kamis','jumat','sabtu','minggu'].forEach(day => {
                document.getElementById(`wo-${day}`).checked = false;
            });
        }
    },
    // -------------------------------------

    saveHabits: function() {
        const habits = {
            protein: document.getElementById('habit-protein').checked,
            water: document.getElementById('habit-water').checked
        };
        localStorage.setItem('habits_' + Auth.currentUser, JSON.stringify(habits));
        App.showToast('Checklist disimpan');
    },

    loadHabits: function() {
        const raw = localStorage.getItem('habits_' + Auth.currentUser);
        if (raw) {
            const habits = JSON.parse(raw);
            document.getElementById('habit-protein').checked = habits.protein || false;
            document.getElementById('habit-water').checked = habits.water || false;
        } else {
            document.getElementById('habit-protein').checked = false;
            document.getElementById('habit-water').checked = false;
        }
    }
};