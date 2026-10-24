/* Logika Dashboard Keuangan - keuangan.js */
let currentUser = null;
let userData = {
    balance: 0,
    transactions: []
};

let catChartInstance = null;
let dailyChartInstance = null;

// Inisialisasi Sistem
window.onload = function() {
    const savedUser = localStorage.getItem('finance_active_user');
    if (savedUser) {
        currentUser = savedUser;
        loadUserData();
        showDashboard();
    }
};

function showToast(msg, isSuccess = true) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');

    toastMsg.innerText = msg;
    toastIcon.className = isSuccess ? "fas fa-check-circle text-accentgreen text-xl" : "fas fa-exclamation-circle text-accentred text-xl";

    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

function handleAuthLogin() {
    const userIn = document.getElementById('auth-username').value.trim();
    if (!userIn) {
        alert('Silakan masukkan username terlebih dahulu.');
        return;
    }
    currentUser = userIn.toLowerCase();
    localStorage.setItem('finance_active_user', currentUser);
    loadUserData();
    showDashboard();
    showToast('Selamat datang kembali, ' + currentUser);
}

function handleGuestLogin() {
    currentUser = 'guest_demo';
    localStorage.setItem('finance_active_user', currentUser);
    loadUserData();
    showDashboard();
    showToast('Masuk dalam Mode Tamu / Demo');
}

function handleLogout() {
    localStorage.removeItem('finance_active_user');
    currentUser = null;
    document.getElementById('main-dashboard').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
}

function loadUserData() {
    const raw = localStorage.getItem('finance_db_' + currentUser);
    if (raw) {
        userData = JSON.parse(raw);
    } else {
        userData = {
            balance: 1000000, // Default Modal Awal
            transactions: []
        };
        saveUserData();
    }
}

function saveUserData() {
    if (!currentUser) return;
    localStorage.setItem('finance_db_' + currentUser, JSON.stringify(userData));
    updateUI();
}

function showDashboard() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    document.getElementById('user-display').innerText = currentUser;
    updateUI();
}

function formatIDR(val) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

function updateUI() {
    document.getElementById('display-total-balance').innerText = formatIDR(userData.balance);

    let totalIncome = 0;
    let totalExpense = 0;

    userData.transactions.forEach(t => {
        if (t.type === 'income') totalIncome += parseFloat(t.amount);
        if (t.type === 'expense') totalExpense += parseFloat(t.amount);
    });

    document.getElementById('display-total-income').innerText = formatIDR(totalIncome);
    document.getElementById('display-total-expense').innerText = formatIDR(totalExpense);

    // Kalkulasi Batas Aman Harian
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(1, lastDayOfMonth - now.getDate() + 1);
    
    const dailyLimit = Math.max(0, userData.balance / daysRemaining);
    document.getElementById('display-daily-limit').innerText = formatIDR(dailyLimit) + ' / hari';
    document.getElementById('display-days-remaining').innerText = `Sisa ${daysRemaining} hari dalam bulan ini`;

    // Kalkulasi Alokasi 70/30
    const alloc70 = Math.max(0, userData.balance * 0.70);
    const alloc30 = Math.max(0, userData.balance * 0.30);

    document.getElementById('alloc-emergency').innerText = formatIDR(alloc70);
    document.getElementById('alloc-growth').innerText = formatIDR(alloc30);

    // Estimasi Imbal Hasil Bebas Pajak (~5% p.a.)
    const yieldEstimate = alloc70 * 0.05;
    document.getElementById('estimated-yield').innerText = '+' + formatIDR(yieldEstimate) + ' / thn';

    renderTable();
    renderCharts();
}

function handleAddTransaction(e) {
    e.preventDefault();
    const type = document.getElementById('tx-type').value;
    const category = document.getElementById('tx-category').value;
    const amount = parseFloat(document.getElementById('tx-amount').value);
    const desc = document.getElementById('tx-desc').value.trim();

    if (!amount || amount <= 0) return;

    const newTx = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        type,
        category,
        amount,
        desc
    };

    userData.transactions.unshift(newTx);

    if (type === 'income') {
        userData.balance += amount;
    } else {
        userData.balance -= amount;
    }

    saveUserData();
    document.getElementById('tx-form').reset();
    showToast('Transaksi berhasil ditambahkan!');
}

function deleteTransaction(id) {
    const tx = userData.transactions.find(t => t.id === id);
    if (!tx) return;

    if (tx.type === 'income') {
        userData.balance -= tx.amount;
    } else {
        userData.balance += tx.amount;
    }

    userData.transactions = userData.transactions.filter(t => t.id !== id);
    saveUserData();
    showToast('Transaksi berhasil dihapus');
}

function handleTopUp() {
    const amt = parseFloat(document.getElementById('topup-amount').value);
    if (!amt || amt <= 0) return;

    userData.balance += amt;
    userData.transactions.unshift({
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        type: 'income',
        category: 'RDPU Bibit',
        amount: amt,
        desc: 'Top Up Saldo Utama'
    });

    saveUserData();
    closeModal('topup-modal');
    document.getElementById('topup-amount').value = '';
    showToast('Top up saldo berhasil!');
}

function handleEditBalance() {
    const amt = parseFloat(document.getElementById('edit-balance-amount').value);
    if (isNaN(amt) || amt < 0) return;

    userData.balance = amt;
    saveUserData();
    closeModal('edit-balance-modal');
    document.getElementById('edit-balance-amount').value = '';
    showToast('Total saldo berhasil dikalibrasi');
}

function renderTable() {
    const tbody = document.getElementById('tx-table-body');
    const search = document.getElementById('table-search').value.toLowerCase();
    const filter = document.getElementById('table-filter').value;

    tbody.innerHTML = '';

    const filtered = userData.transactions.filter(t => {
        const matchSearch = t.desc.toLowerCase().includes(search) || t.category.toLowerCase().includes(search);
        const matchFilter = filter === 'all' || t.type === filter;
        return matchSearch && matchFilter;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-gray-500">Belum ada riwayat transaksi recorded.</td></tr>`;
        return;
    }

    filtered.forEach(t => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-darkbg/50 transition";
        tr.innerHTML = `
            <td class="py-3 px-4 text-gray-400">${t.date}</td>
            <td class="py-3 px-4 font-medium text-white">${t.desc}</td>
            <td class="py-3 px-4"><span class="bg-bordercolor/50 px-2 py-0.5 rounded text-[11px]">${t.category}</span></td>
            <td class="py-3 px-4">${t.type === 'income' ? '<span class="text-accentgreen font-semibold">Pemasukan</span>' : '<span class="text-accentred font-semibold">Pengeluaran</span>'}</td>
            <td class="py-3 px-4 text-right font-bold ${t.type === 'income' ? 'text-accentgreen' : 'text-accentred'}">${t.type === 'income' ? '+' : '-'}${formatIDR(t.amount)}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="deleteTransaction(${t.id})" class="text-gray-500 hover:text-accentred transition"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderCharts() {
    const catMap = {};
    userData.transactions.filter(t => t.type === 'expense').forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + parseFloat(t.amount);
    });

    const catLabels = Object.keys(catMap);
    const catData = Object.values(catMap);

    const ctxCat = document.getElementById('categoryChart').getContext('2d');
    if (catChartInstance) catChartInstance.destroy();

    catChartInstance = new Chart(ctxCat, {
        type: 'doughnut',
        data: {
            labels: catLabels.length ? catLabels : ['Belum ada pengeluaran'],
            datasets: [{
                data: catData.length ? catData : [1],
                backgroundColor: ['#2ea043', '#58a6ff', '#f85149', '#d29922', '#a371f7', '#8b949e'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#8b949e', font: { size: 10 } } } }
        }
    });

    const dailyMap = {};
    userData.transactions.filter(t => t.type === 'expense').slice(0, 7).reverse().forEach(t => {
        dailyMap[t.date] = (dailyMap[t.date] || 0) + parseFloat(t.amount);
    });

    const dailyLabels = Object.keys(dailyMap);
    const dailyData = Object.values(dailyMap);

    const ctxDaily = document.getElementById('dailyChart').getContext('2d');
    if (dailyChartInstance) dailyChartInstance.destroy();

    dailyChartInstance = new Chart(ctxDaily, {
        type: 'bar',
        data: {
            labels: dailyLabels,
            datasets: [{
                label: 'Pengeluaran (Rp)',
                data: dailyData,
                backgroundColor: '#f85149',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: '#8b949e', font: { size: 10 } }, grid: { display: false } },
                y: { ticks: { color: '#8b949e', font: { size: 10 } }, grid: { color: '#30363d' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function exportToCSV() {
    if (userData.transactions.length === 0) {
        alert('Belum ada transaksi untuk diekspor.');
        return;
    }

    let csv = 'ID,Tanggal,Tipe,Kategori,Deskripsi,Nominal\n';
    userData.transactions.forEach(t => {
        csv += `"${t.id}","${t.date}","${t.type}","${t.category}","${t.desc}","${t.amount}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `rekap_keuangan_${currentUser}.csv`);
    a.click();
}

function openModal(id) {
    document.getElementById(id).classList.remove('opacity-0', 'pointer-events-none');
}

function closeModal(id) {
    document.getElementById(id).classList.add('opacity-0', 'pointer-events-none');
}