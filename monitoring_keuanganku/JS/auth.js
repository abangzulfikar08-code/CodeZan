/* js/auth.js - Login & Session Management */
const Auth = {
    currentUser: null,

    init: function() {
        const savedUser = localStorage.getItem('finance_active_user');
        if (savedUser) {
            this.currentUser = savedUser;
            this.showDashboard();
            Finance.syncFromCloud();
            Workout.calculateMacros();
            Workout.renderSchedule();
            Workout.loadHabits();
        }
    },

    login: function() {
        const userIn = document.getElementById('auth-username').value.trim();
        if (!userIn) {
            alert('Masukkan username terlebih dahulu.');
            return;
        }
        this.currentUser = userIn.toLowerCase();
        localStorage.setItem('finance_active_user', this.currentUser);
        this.showDashboard();
        Finance.syncFromCloud();
        Workout.calculateMacros();
        Workout.renderSchedule();
        Workout.loadHabits();
        App.showToast('System active: ' + this.currentUser);
    },

    guestLogin: function() {
        this.currentUser = 'guest_demo';
        localStorage.setItem('finance_active_user', this.currentUser);
        this.showDashboard();
        Finance.syncFromCloud();
        Workout.calculateMacros();
        Workout.renderSchedule();
        Workout.loadHabits();
        App.showToast('Guest mode initialized');
    },

    logout: function() {
        localStorage.removeItem('finance_active_user');
        this.currentUser = null;
        document.getElementById('main-dashboard').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
    },

    showDashboard: function() {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-dashboard').classList.remove('hidden');
        document.getElementById('user-display').innerText = this.currentUser;
        Finance.updateUI();
    }
};