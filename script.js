class TransactionApp {
  constructor() {
    this.monthSelect = document.getElementById("month-select");
    this.resetBtn = document.getElementById("reset-btn");
    this.form = document.getElementById("transaction-form");
    this.totalIncomeEl = document.getElementById("total-income");
    this.totalExpenseEl = document.getElementById("total-expense");
    this.totalBalanceEl = document.getElementById("net-balance");
    this.transactionList = document.getElementById("transaction-list");
    this.categoryFilter = document.getElementById("category-filter");
    this.exportBtn = document.getElementById("export-btn");
    this.importFile = document.getElementById("import-file");
    this.chartEl = document.getElementById("expense-chart");

    this.monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    this.allTransactions = JSON.parse(localStorage.getItem("allTransactions")) || {};
    this.currentMonth = new Date().toISOString().slice(0,7);

    if (!this.allTransactions[this.currentMonth]) this.allTransactions[this.currentMonth] = [];
    this.tempTransactions = [];
    this.editingIndex = null; // Track edit index
    this.chart = null;

    this.bindEvents();
    this.populateMonths();
    this.renderTransaction(this.currentMonth);
  }

  bindEvents() {
    this.form.addEventListener("submit", e => this.handleSubmit(e));
    this.monthSelect.addEventListener("change", () => this.renderTransaction(this.monthSelect.value));
    this.transactionList.addEventListener("click", e => {
      const index = Number(e.target.dataset.index);
      if (e.target.classList.contains("delete-btn")) this.deleteTransaction(this.monthSelect.value, index);
      if (e.target.classList.contains("edit-btn")) this.editTransaction(this.monthSelect.value, index);
    });
    this.resetBtn.addEventListener("click", () => this.resetCurrentMonth());
    this.categoryFilter.addEventListener("change", () => this.renderTransaction(this.monthSelect.value));
    this.exportBtn.addEventListener("click", () => this.exportTransactions());
    this.importFile.addEventListener("change", e => this.importTransactions(e));
  }

  populateMonths() {
    this.monthSelect.innerHTML = "";
    const keys = Object.keys(this.allTransactions).sort().reverse();
    keys.forEach(monthKey => {
      const [year, month] = monthKey.split("-");
      const monthName = `${this.monthNames[parseInt(month)-1]} ${year}`;
      const option = document.createElement("option");
      option.value = monthKey;
      option.textContent = monthName;
      this.monthSelect.appendChild(option);
    });
    this.monthSelect.value = this.currentMonth;
  }

  renderTempTable() {
    this.transactionList.innerHTML = "";
    let income = 0, expense = 0;

    const selectedCategory = this.categoryFilter.value;
    const filteredTransactions = this.tempTransactions.filter(t =>
      selectedCategory === "all" || t.category === selectedCategory
    );

    filteredTransactions.forEach((t, index) => {
      const amount = parseFloat(t.amount) || 0;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${t.date}</td>
        <td>${t.description}</td>
        <td>${t.category}</td>
        <td>${amount.toFixed(2)}</td>
        <td>${t.type}</td>
        <td>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </td>
      `;
      this.transactionList.appendChild(row);

      if (t.type === "income") income += amount;
      else if (t.type === "expense") expense += amount;
    });

    this.totalIncomeEl.textContent = income.toFixed(2);
    this.totalExpenseEl.textContent = expense.toFixed(2);
    this.totalBalanceEl.textContent = (income - expense).toFixed(2);

    this.updateChart(filteredTransactions);
  }

  updateChart(transactions) {
    const expenseByCategory = {};
    transactions.forEach(t => {
      if (t.type === "expense") {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + parseFloat(t.amount);
      }
    });

    const labels = Object.keys(expenseByCategory);
    const data = Object.values(expenseByCategory);

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.chartEl, {
      type: "pie",
      data: {
        labels,
        datasets: [{ data, backgroundColor: labels.map(() => this.getRandomColor()) }]
      }
    });
  }

  getRandomColor() {
    return `hsl(${Math.random()*360}, 70%, 60%)`;
  }

  deleteTransaction(monthKey, index) {
    if (!this.allTransactions[monthKey]) return;
    this.allTransactions[monthKey].splice(index, 1);
    this.saveToLocal();
    this.renderTransaction(monthKey);
  }

  editTransaction(monthKey, index) {
    const transaction = this.tempTransactions[index];
    if (!transaction) return;

    // Pre-fill form
    document.getElementById("date").value = transaction.date;
    document.getElementById("description").value = transaction.description;
    document.getElementById("category").value = transaction.category;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("type").value = transaction.type;

    // Track editing index
    this.editingIndex = index;

    // Remove original from array (will be re-added on submit)
    this.allTransactions[monthKey].splice(index, 1);
    this.saveToLocal();
    this.renderTransaction(monthKey);
  }

  renderTransaction(monthKey) {
    this.tempTransactions = [...(this.allTransactions[monthKey] || [])];
    this.renderTempTable();
  }

  resetCurrentMonth() {
    const monthKey = this.monthSelect.value;

    if (!monthKey) return;

    const confirmDelete = confirm(
      `Delete ALL transactions for ${monthKey}? This cannot be undone.`
    );

    if (!confirmDelete) return;

    // 🔥 REAL DELETE
    delete this.allTransactions[monthKey];

    // Save changes
    this.saveToLocal();

    // Update month list
    this.populateMonths();

    // Set a valid month after deletion
    this.currentMonth = new Date().toISOString().slice(0, 7);

    if (!this.allTransactions[this.currentMonth]) {
      this.allTransactions[this.currentMonth] = [];
    }

    this.monthSelect.value = this.currentMonth;
    this.renderTransaction(this.currentMonth);
  }

  handleSubmit(e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (!date || !description || isNaN(amount) || !type) {
      alert('Please fill all fields correctly!');
      return;
    }

    const monthKey = date.slice(0,7);
    if (!this.allTransactions[monthKey]) this.allTransactions[monthKey] = [];

    // Add transaction
    this.allTransactions[monthKey].push({ date, description, category, amount, type });
    this.saveToLocal();
    this.populateMonths();

    // Reset editing state
    this.editingIndex = null;

    // Render table for currently selected month
    this.renderTransaction(this.monthSelect.value);
    this.form.reset();
  }

  saveToLocal() {
    localStorage.setItem("allTransactions", JSON.stringify(this.allTransactions));
  }

  exportTransactions() {
    const dataStr = JSON.stringify(this.allTransactions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  importTransactions(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const imported = JSON.parse(evt.target.result);
        this.allTransactions = { ...this.allTransactions, ...imported };
        this.saveToLocal();
        this.populateMonths();
        this.renderTransaction(this.monthSelect.value);
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }
}

document.addEventListener('DOMContentLoaded', () => new TransactionApp());