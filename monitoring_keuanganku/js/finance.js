/* js/finance.js - Finance & Google Sheets Sync */
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwpsQQ90QZih6GMT71-liYRP5lpBYciJO_REdby38aWoUAlaF5eXqiDxuyDpFwiDYoT/exec";
const Finance = {
    userData: {
        balance: 0,
        transactions: []
    },
    catChartInstance: null,
    dailyChartInstance: null,

    formatIDR: function(val) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
    },

    updateUI: function() {
        document.getElementById('display-total-balance').innerText = this.formatIDR(this.userData.balance);

        let totalIncome = 0, totalExpense = 0;
        this.userData.transactions.forEach(t => {
            const amt = parseFloat(t.amount) || 0;
            if (t.type === 'income') totalIncome += amt;
            if (t.type === 'expense') totalExpense += amt;
        });

        document.getElementById('display-total-income').innerText = this.formatIDR(totalIncome);
        document.getElementById('display-total-expense').innerText = this.formatIDR(totalExpense);

        const now = new Date();
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const daysRemaining = Math.max(1, lastDayOfMonth - now.getDate() + 1);
        
        const dailyLimit = Math.max(0, this.userData.balance / daysRemaining);
        document.getElementById('display-daily-limit').innerText = this.formatIDR(dailyLimit) + ' / hari';
        document.getElementById('display-days-remaining').innerText = `Sisa ${daysRemaining} hari dalam bulan ini`;

        const alloc70 = Math.max(0, this.userData.balance * 0.70);
        const alloc30 = Math.max(0, this.userData.balance * 0.30);

        document.getElementById('alloc-emergency').innerText = this.formatIDR(alloc70);
        document.getElementById('alloc-growth').innerText = this.formatIDR(alloc30);

        const yieldEstimate = alloc70 * 0.05;
        document.getElementById('estimated-yield').innerText = '+' + this.formatIDR(yieldEstimate) + ' / thn';

        this.renderTable();
        this.renderCharts();
    },

    syncFromCloud: function() {
        App.showToast('Sync Cloud Data...');
        fetch(GOOGLE_SHEET_URL)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    this.userData.transactions = data.reverse();
                    let calcBalance = 0;
                    this.userData.transactions.forEach(t => {
                        const amt = parseFloat(t.amount) || 0;
                        if (t.type === 'income') calcBalance += amt;
                        else calcBalance -= amt;
                    });
                    this.userData.balance = calcBalance;
                    this.updateUI();
                    App.showToast('Cloud Data Synced!');
                }
            })
            .catch(err => {
                console.error('Fetch Error:', err);
                const raw = localStorage.getItem('finance_db_' + Auth.currentUser);
                if (raw) this.userData = JSON.parse(raw);
                this.updateUI();
            });
    },

    saveUserDataLocal: function() {
        if (!Auth.currentUser) return;
        localStorage.setItem('finance_db_' + Auth.currentUser, JSON.stringify(this.userData));
        this.updateUI();
    },

    handleAddTransaction: function(e) {
        e.preventDefault();
        const type = document.getElementById('tx-type').value;
        const category = document.getElementById('tx-category').value;
        const amount = parseFloat(document.getElementById('tx-amount').value);
        const desc = document.getElementById('tx-desc').value.trim();

        if (!amount || amount <= 0) return;

        const newTx = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            type, category, amount, desc
        };

        this.userData.transactions.unshift(newTx);
        if (type === 'income') this.userData.balance += amount;
        else this.userData.balance -= amount;
        
        this.saveUserDataLocal();
        document.getElementById('tx-form').reset();

        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTx)
        })
        .then(() => { App.showToast('Saved & Synced Cloud!'); })
        .catch(err => { App.showToast('Gagal Sync Cloud', false); });
    },

    deleteTransaction: function(id) {
        const tx = this.userData.transactions.find(t => t.id === id);
        if (!tx) return;

        if (tx.type === 'income') this.userData.balance -= tx.amount;
        else this.userData.balance += tx.amount;

        this.userData.transactions = this.userData.transactions.filter(t => t.id !== id);
        this.saveUserDataLocal();
        App.showToast('Transaksi dihapus');
    },

    handleTopUp: function() {
        const amt = parseFloat(document.getElementById('topup-amount').value);
        if (!amt || amt <= 0) return;

        const topUpTx = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            type: 'income',
            category: 'RDPU Bibit',
            amount: amt,
            desc: 'Top Up Saldo Utama'
        };

        this.userData.balance += amt;
        this.userData.transactions.unshift(topUpTx);
        this.saveUserDataLocal();

        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(topUpTx)
        });

        App.closeModal('topup-modal');
        document.getElementById('topup-amount').value = '';
        App.showToast('Top up berhasil!');
    },

    handleEditBalance: function() {
        const amt = parseFloat(document.getElementById('edit-balance-amount').value);
        if (isNaN(amt) || amt < 0) return;

        this.userData.balance = amt;
        this.saveUserDataLocal();
        App.closeModal('edit-balance-modal');
        document.getElementById('edit-balance-amount').value = '';
        App.showToast('Saldo dikalibrasi!');
    },

    renderTable: function() {
        const tbody = document.getElementById('tx-table-body');
        const search = document.getElementById('table-search').value.toLowerCase();
        tbody.innerHTML = '';

        const filtered = this.userData.transactions.filter(t => {
            return t.desc.toLowerCase().includes(search) || t.category.toLowerCase().includes(search);
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-textgray">Belum ada riwayat transaksi.</td></tr>`;
            return;
        }

        filtered.forEach(t => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-darkbg/50 transition";
            tr.innerHTML = `
                <td class="py-3 px-4 text-textgray">${t.date}</td>
                <td class="py-3 px-4 font-medium text-white">${t.desc}</td>
                <td class="py-3 px-4"><span class="bg-bordercolor/50 px-2 py-0.5 rounded text-[10px] text-gray-300">${t.category}</span></td>
                <td class="py-3 px-4">${t.type === 'income' ? '<span class="text-accentemerald font-semibold">Pemasukan</span>' : '<span class="text-textgray">Pengeluaran</span>'}</td>
                <td class="py-3 px-4 text-right font-bold ${t.type === 'income' ? 'text-accentemerald' : 'text-white'}">${t.type === 'income' ? '+' : '-'}${this.formatIDR(t.amount)}</td>
                <td class="py-3 px-4 text-center">
                    <button type="button" onclick="Finance.deleteTransaction(${t.id})" class="text-textgray hover:text-red-500 transition"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderCharts: function() {
        const catMap = {};
        this.userData.transactions.filter(t => t.type === 'expense').forEach(t => {
            catMap[t.category] = (catMap[t.category] || 0) + parseFloat(t.amount);
        });

        const ctxCat = document.getElementById('categoryChart').getContext('2d');
        if (this.catChartInstance) this.catChartInstance.destroy();

        this.catChartInstance = new Chart(ctxCat, {
            type: 'doughnut',
            data: {
                labels: Object.keys(catMap).length ? Object.keys(catMap) : ['Kosong'],
                datasets: [{
                    data: Object.values(catMap).length ? Object.values(catMap) : [1],
                    backgroundColor: ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#6b7280'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 10 } } } }
            }
        });

        const dailyMap = {};
        this.userData.transactions.filter(t => t.type === 'expense').slice(0, 7).reverse().forEach(t => {
            dailyMap[t.date] = (dailyMap[t.date] || 0) + parseFloat(t.amount);
        });

        const ctxDaily = document.getElementById('dailyChart').getContext('2d');
        if (this.dailyChartInstance) this.dailyChartInstance.destroy();

        this.dailyChartInstance = new Chart(ctxDaily, {
            type: 'bar',
            data: {
                labels: Object.keys(dailyMap),
                datasets: [{
                    label: 'Pengeluaran (Rp)',
                    data: Object.values(dailyMap),
                    backgroundColor: '#10b981',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { display: false } },
                    y: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { color: '#212835' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
};
