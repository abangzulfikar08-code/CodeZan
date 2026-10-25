/* js/workout.js - Workout, Makro, & Habit */
const Workout = {
    database: {
        senin: {
            title: "PUSH (Chest, Upper Delts, Triceps)",
            focus: "Prioritas Chest, Side Delts, Triceps",
            targetCal: "±2,700 - 2,900 kcal | Protein 120-140 g",
            exercises: [
                "Bench Press: 3 × 6-8 reps",
                "Incline DB Press: 3 × 8-10 reps",
                "Seated Shoulder Press: 3 × 8-10 reps",
                "Lateral Raise: 4 × 12-15 reps (Bahu Lebar)",
                "Rope Pushdown: 3 × 10-12 reps",
                "Overhead Triceps Extension: 2 × 12-15 reps"
            ],
            meals: [
                "Pagi: Oatmeal + Susu + Pisang + 3 Telur Rebus",
                "Siang: Nasi + Ayam 150-200g + Tempe + Sayur",
                "Malam: Nasi + Telur + Tahu/Tempe + Sayur"
            ]
        },
        selasa: {
            title: "RECOVERY & MOBILITY",
            focus: "Protein tetap 120-140g | Tidur 7-9 jam",
            targetCal: "Kalori Maintenance",
            exercises: ["Jalan Santai: 20-30 menit", "Mobilitas & Stretching: 10-15 menit"],
            meals: ["Pagi: Nasi + 3 Telur + Sayur + Buah", "Siang: Nasi + Ayam/Ikan + Tempe + Sayur", "Snack: Susu + Pisang + Roti/Kacang", "Malam: Nasi + Tahu/Tempe + Telur + Sayur"]
        },
        rabu: {
            title: "PULL (Back, Rear Delts, Biceps)",
            focus: "Prioritas Lats, Upper Back, Rear Delts, Biceps",
            targetCal: "±2,700 - 2,900 kcal | Protein 120-140 g",
            exercises: [
                "Lat Pulldown / Pull-up: 3 × 8-10 reps",
                "Chest-Supported Row: 3 × 8-10 reps",
                "Seated Cable Row: 2 × 10-12 reps",
                "Face Pull / Reverse Fly: 3 × 12-15 reps",
                "Dumbbell Curl: 3 × 10-12 reps",
                "Hammer Curl: 3 × 10-12 reps"
            ],
            meals: ["Pagi: Oatmeal + Susu + 3 Telur + Pisang", "Siang: Nasi + Ayam 150-200g + Tempe + Sayur", "Pre-Gym: Roti + Pisang", "Post-Gym: Nasi + Ikan/Ayam + Sayur", "Malam: Nasi + Telur + Tahu/Tempe + Sayur"]
        },
        kamis: {
            title: "RECOVERY & HYDRATION",
            focus: "Fokus Recovery & Hidrasi",
            targetCal: "Kalori Target Maintenance",
            exercises: ["Rest Total / Jalan Santai 20-30m", "Mobilitas Ringan jika kaku"],
            meals: ["Pagi: Nasi + Telur 3 + Sayur", "Siang: Nasi + Ayam/Ikan + Tempe + Sayur", "Snack: Oatmeal + Susu + Pisang", "Malam: Nasi + Telur/Tahu/Tempe + Sayur + Buah"]
        },
        jumat: {
            title: "LEGS + PHYSIQUE PRIORITY",
            focus: "Upper Chest, Side Delts, Arms, Leg Volume",
            targetCal: "±2,700 - 2,900 kcal | Protein 120-140 g",
            exercises: [
                "Squat / Leg Press: 3 × 6-10 reps",
                "Romanian Deadlift: 3 × 8-10 reps",
                "Leg Curl: 2 × 10-12 reps",
                "Incline DB Press: 3 × 8-10 reps",
                "Lateral Raise: 4 × 12-15 reps",
                "Cable Curl: 2 × 10-12 reps",
                "Triceps Pushdown: 2 × 10-12 reps"
            ],
            meals: ["Pagi: Oatmeal + Susu + Pisang + 3 Telur", "Siang: Nasi + Ayam 150-200g + Tempe + Sayur", "Pre-Gym: Roti + Pisang + Susu", "Post-Gym: Nasi + Ayam/Ikan + Sayur", "Malam: Nasi + Telur + Tahu/Tempe + Sayur"]
        },
        sabtu: {
            title: "ACTIVE RECOVERY",
            focus: "Meal Prep 2-3 Hari Sekaligus",
            targetCal: "Protein 120-140 g",
            exercises: ["Jalan Santai 20-30 Menit", "Stretching 10 Menit"],
            meals: ["Pagi: Nasi + Telur + Sayur + Buah", "Siang: Nasi + Ayam/Ikan + Tempe + Sayur", "Snack: Susu + Pisang + Roti", "Malam: Nasi + Tahu/Tempe + Telur + Sayur"]
        },
        minggu: {
            title: "TOTAL REST & EVALUATION",
            focus: "Evaluasi BB (Jika stagnan >2 minggu, tambah +100-150 kcal)",
            targetCal: "Rest Day Recovery",
            exercises: ["Istirahat Total / Aktivitas Santai"],
            meals: ["Pagi: Oatmeal + Susu + 3 Telur + Pisang", "Siang: Nasi + Ayam/Ikan + Tempe", "Malam: Nasi + Telur + Tahu/Tempe + Sayur"]
        }
    },

    calculateMacros: function() {
        const h = parseFloat(document.getElementById('body-height').value) || 175;
        const w = parseFloat(document.getElementById('body-weight').value) || 58;

        const bmr = 10 * w + 6.25 * h - 5 * 21 + 5;
        const tdee = bmr * 1.45;
        const targetCalories = Math.round(tdee + 350);

        document.getElementById('macro-calories').innerText = targetCalories.toLocaleString('id-ID') + ' kcal';
        document.getElementById('macro-protein').innerText = `${Math.round(w * 2.1)} - ${Math.round(w * 2.4)} g`;
        document.getElementById('macro-carbs').innerText = `${Math.round(w * 6)} - ${Math.round(w * 7)} g`;
    },

    renderSchedule: function() {
        const day = document.getElementById('workout-day-select').value;
        const data = this.database[day];
        const container = document.getElementById('workout-details-container');
        if (!data) return;

        let exercisesHTML = data.exercises.map(ex => `<li class="text-xs text-textgray flex items-center gap-2"><i class="fas fa-dumbbell text-accentemerald text-[10px]"></i> ${ex}</li>`).join('');
        let mealsHTML = data.meals.map(m => `<li class="text-xs text-textgray flex items-center gap-2"><i class="fas fa-utensils text-accentemerald text-[10px]"></i> ${m}</li>`).join('');

        container.innerHTML = `
            <div class="bg-darkbg border border-bordercolor p-4 rounded-lg space-y-3">
                <div class="flex justify-between items-center border-b border-bordercolor pb-2">
                    <span class="text-xs font-bold text-white uppercase">${data.title}</span>
                    <span class="text-[10px] bg-accentemerald/10 text-accentemerald px-2 py-0.5 rounded border border-accentemerald/20">${data.targetCal}</span>
                </div>
                <p class="text-xs text-accentemerald font-medium"><i class="fas fa-bullseye"></i> ${data.focus}</p>
                <h4 class="text-xs font-semibold text-white pt-2">Menu Latihan:</h4>
                <ul class="space-y-2">${exercisesHTML}</ul>
            </div>
            <div class="bg-darkbg border border-bordercolor p-4 rounded-lg space-y-3">
                <h4 class="text-xs font-semibold text-white border-b border-bordercolor pb-2 flex items-center gap-2">
                    <i class="fas fa-drumstick-bite text-accentemerald"></i> Panduan Makan:
                </h4>
                <ul class="space-y-2 pt-1">${mealsHTML}</ul>
            </div>
        `;
    },

    saveHabits: function() {
        if (!Auth.currentUser) return;
        const habits = {
            skincareAM: document.getElementById('habit-skincare-am').checked,
            protein: document.getElementById('habit-protein').checked,
            water: document.getElementById('habit-water').checked,
            workout: document.getElementById('habit-workout').checked,
            skincarePM: document.getElementById('habit-skincare-pm').checked,
            sleep: document.getElementById('habit-sleep').checked
        };
        localStorage.setItem('glowup_habits_' + Auth.currentUser, JSON.stringify(habits));
        App.showToast('Habit tersimpan');
    },

    loadHabits: function() {
        if (!Auth.currentUser) return;
        const raw = localStorage.getItem('glowup_habits_' + Auth.currentUser);
        if (raw) {
            const habits = JSON.parse(raw);
            document.getElementById('habit-skincare-am').checked = habits.skincareAM || false;
            document.getElementById('habit-protein').checked = habits.protein || false;
            document.getElementById('habit-water').checked = habits.water || false;
            document.getElementById('habit-workout').checked = habits.workout || false;
            document.getElementById('habit-skincare-pm').checked = habits.skincarePM || false;
            document.getElementById('habit-sleep').checked = habits.sleep || false;
        }
    }
};
