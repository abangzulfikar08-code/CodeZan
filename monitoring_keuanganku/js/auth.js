const Auth = {
    currentUser: null,

    init: function() {
        const savedUser = localStorage.getItem('finance_active_user');
        if (savedUser) {
            this.currentUser = savedUser;
            this.showDashboard();
        }
    },

    login: function() {
        const userIn = document.getElementById('auth-username').value.trim().toLowerCase();
        if (!userIn) return alert('Masukkan username!');
        
        this.currentUser = userIn;
        localStorage.setItem('finance_active_user', this.currentUser);
        this.showDashboard();
        App.showToast(`Login sebagai: ${this.currentUser.toUpperCase()}`);
    },

    logout: function() {
        localStorage.removeItem('finance_active_user');
        this.currentUser = null;
        document.getElementById('main-dashboard').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('auth-username').value = '';
    },

    showDashboard: function() {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-dashboard').classList.remove('hidden');
        document.getElementById('user-display').innerText = this.currentUser;
        
        Workout.loadProfile();
        Workout.loadSchedule(); // <--- TAMBAHAN BARU
        Workout.loadHabits();
        
        Finance.syncFromCloud();
    }
};