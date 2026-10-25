const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwpsQQ90QZih6GMT71-liYRP5lpBYciJO_REdby38aWoUAlaF5eXqiDxuyDpFwiDYoT/exec";

const Finance = {
    transactions: [],
    manualBalance: 0,
    chartInstance: null,

    formatIDR: function(val) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
    },

    // --- SMART BUDGETING ---
    calculateBudget: function() {
        const saldo = parseFloat(document.getElementById('budget-saldo').value) || 0;
        const tabungan = parseFloat(document.getElementById('budget-tabungan').value) || 0;
        const hari = parseInt(document.getElementById('budget-hari').value) || 1;

        if (tabungan > saldo) {
            return alert("Target tabungan melebihi saldo saat ini!");
        }

        const sisaUang = saldo - tabungan;
        const batasHarian = Math.floor(sisaUang / hari);

        document.getElementById('budget-result').innerText = this.formatIDR(batasHarian) + " / hari";
        App.showToast('Rekomendasi dihitung!');
    },

    // --- KATEGORI DINAMIS ---
    toggleCustomCategory: function() {
        const select = document.getElementById('tx-category-select');
        const customInput = document.getElementById('tx-category-custom');
        if (select.value === 'custom') {
            customInput.classList.remove('hidden');
            customInput.focus();
        } else {
            customInput.classList.add('hidden');
        }
    },

    // --- SALDO MANUAL & CLOUD ---
    saveManualBalance: function() {
        const inputVal = parseFloat(document.getElementById('input-manual-balance').value) || 0;
        this.manualBalance = inputVal;
        localStorage.setItem('manual_balance_' + Auth.currentUser, this.manualBalance);
        this.updateUI();
        App.showToast('Saldo Manual Disimpan!');
    },

    loadManualBalance: function() {
        const saved = localStorage.getItem('manual_balance_' + Auth.currentUser);
        this.manualBalance = saved ? parseFloat(saved) : 0;
        document.getElementById('input-manual-balance').value = this.manualBalance;
    },

    syncFromCloud: function() {
        App.showToast('Menarik data cloud...');
        this.loadManualBalance();

        fetch(GOOGLE_SHEET_URL)
            .then(res => res.json())
            .then(data => {
                this.transactions = data.filter(tx => tx.username === Auth.currentUser);
                this.updateUI();
                App.showToast('Data Cloud Dimuat');
            })
            .catch(err => {
                console.error(err);
                App.showToast('Gagal koneksi Cloud', false);
            });
    },

    updateUI: function() {
        let income = 0, expense = 0;
        this.transactions.forEach(t => {
            if (t.type === 'income') income += parseFloat(t.amount);
            else expense += parseFloat(t.amount);
        });

        document.getElementById('display-total-income').innerText = this.formatIDR(income);
        document.getElementById('display-total-expense').innerText = this.formatIDR(expense);

        this.renderTable();
        this.renderChart(); // Render Line Chart
    },

    handleAddTransaction: function(e) {
        e.preventDefault();
        const type = document.getElementById('tx-type').value;
        
        let category = document.getElementById('tx-category-select').value;
        if (category === 'custom') {
            category = document.getElementById('tx-category-custom').value;
            if(!category) return alert("Isi nama kategori baru!");
        }

        const amount = parseFloat(document.getElementById('tx-amount').value);
        const desc = document.getElementById('tx-desc').value;

        if (amount <= 0) return alert("Nominal harus > 0");

        const newTx = {
            action: "add",
            username: Auth.currentUser,
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            type: type, category: category, amount: amount, desc: desc
        };

        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTx)
        }).then(() => {
            document.getElementById('tx-form').reset();
            document.getElementById('tx-category-custom').classList.add('hidden');
            App.showToast('Transaksi Disimpan!');
            setTimeout(() => this.syncFromCloud(), 1000);
        });
    },

    deleteTransaction: function(id) {
        if(!confirm("Hapus transaksi ini?")) return;
        const delReq = { action: "delete", id: id };
        
        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(delReq)
        }).then(() => {
            App.showToast('Transaksi Dihapus!');
            setTimeout(() => this.syncFromCloud(), 1000);
        });
    },

    renderTable: function() {
        const tbody = document.getElementById('tx-table-body');
        tbody.innerHTML = '';
        if (this.transactions.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="py-4 text-center">Belum ada data.</td></tr>`;
            return;
        }

        const sorted = [...this.transactions].reverse();
        sorted.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="py-3 px-4">${t.date}</td>
                <td class="py-3 px-4 text-white">${t.desc}</td>
                <td class="py-3 px-4"><span class="bg-bordercolor px-2 py-1 rounded text-[10px]">${t.category}</span></td>
                <td class="py-3 px-4 text-right font-bold ${t.type === 'income' ? 'text-accentemerald' : 'text-red-400'}">${t.type === 'income' ? '+' : '-'}${this.formatIDR(t.amount)}</td>
                <td class="py-3 px-4 text-center">
                    <button onclick="Finance.deleteTransaction('${t.id}')" class="text-red-500 hover:text-red-300"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    // --- LINE CHART LOGIC ---
    renderChart: function() {
        // Kelompokkan pengeluaran berdasarkan tanggal
        const dailyData = {};
        
        // Ambil 7 transaksi pengeluaran terakhir untuk sumbu X
        const expenses = this.transactions.filter(t => t.type === 'expense');
        
        expenses.forEach(t => {
            if (!dailyData[t.date]) dailyData[t.date] = 0;
            dailyData[t.date] += parseFloat(t.amount);
        });

        // Urutkan tanggal
        const sortedDates = Object.keys(dailyData).sort();
        
        // Ambil maksimal 10 data terakhir agar grafik tidak terlalu padat
        const displayDates = sortedDates.slice(-10);
        const displayAmounts = displayDates.map(date => dailyData[date]);

        const ctx = document.getElementById('financeChart').getContext('2d');
        if (this.chartInstance) this.chartInstance.destroy();

        this.chartInstance = new Chart(ctx, {
            type: 'line', // Diubah menjadi LINE CHART
            data: {
                labels: displayDates.length ? displayDates : ['Belum Ada Data'],
                datasets: [{
                    label: 'Pengeluaran Harian (Rp)',
                    data: displayAmounts.length ? displayAmounts : [0],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    fill: true,
                    tension: 0.3 // Membuat garis melengkung halus
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { 
                    legend: { display: false } 
                },
                scales: {
                    x: { ticks: { color: '#9ca3af', font: {size: 10} }, grid: { color: '#212835' } },
                    y: { ticks: { color: '#9ca3af', font: {size: 10} }, grid: { color: '#212835' } }
                }
            }
        });
    }
};