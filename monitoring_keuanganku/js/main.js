/* js/main.js - Global App Logic (Navigation & Toast) */
const App = {
    switchTab: function(tabName) {
        ['finance', 'workout', 'code'].forEach(t => {
            const content = document.getElementById(`tab-content-${t}`);
            const btn = document.getElementById(`tab-btn-${t}`);
            if (content) content.classList.add('hidden');
            if (btn) btn.classList.remove('active');
        });

        const activeContent = document.getElementById(`tab-content-${tabName}`);
        const activeBtn = document.getElementById(`tab-btn-${tabName}`);
        if (activeContent) activeContent.classList.remove('hidden');
        if (activeBtn) activeBtn.classList.add('active');
    },

    showToast: function(msg, isSuccess = true) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        document.getElementById('toast-msg').innerText = msg;
        document.getElementById('toast-icon').className = isSuccess 
            ? "fas fa-check-circle text-accentemerald text-lg" 
            : "fas fa-exclamation-circle text-red-500 text-lg";

        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 2500);
    },

    openModal: function(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('opacity-0', 'pointer-events-none');
    },

    closeModal: function(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('opacity-0', 'pointer-events-none');
    }
};
