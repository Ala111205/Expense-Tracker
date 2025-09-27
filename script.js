class TransactionApp{
  constructor(){
    this.monthSelect = document.getElementById("month-select");
    this.resetBtn = document.getElementById("reset-btn");
    this.form = document.getElementById("transaction-form");
    this.totalIncomeEl = document.getElementById("total-income");
    this.totalExpenseEl = document.getElementById("total-expense");
    this.totalBalanceEl = document.getElementById("net-balance");
    this.transactionList = document.getElementById("transaction-list");

    this.monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    this.allTransactions = JSON.parse(localStorage.getItem("allTransactions")) || {};
    this.currentMonth = new Date().toISOString().slice(0,7);

    if(!this.allTransactions[this.currentMonth]){
      this.allTransactions[this.currentMonth] = [];
    };

    this.tempTransactions = [];

    this.bindEvents();
    this.populateMonths();
    this.renderTransaction(this.monthSelect.value);
  }
  bindEvents(){
    this.form.addEventListener("submit", (e)=>this.handleSubmit(e));

    this.monthSelect.addEventListener("change", ()=>this.renderTransaction(this.monthSelect.value));

    this.transactionList.addEventListener("click", (e)=>{
      if(e.target.classList.contains("delete-btn")){
        const index = Number(e.target.dataset.index);
        this.deleteTransaction(this.monthSelect.value, index)
      }
    })

    this.resetBtn.addEventListener("click", ()=>this.clearMonthTableUI())
  }
  populateMonths(){
    this.monthSelect.innerHTML="";
    const key = Object.keys(this.allTransactions).sort().reverse();
    key.forEach(monthKey=>{
      const[year, month] = monthKey.split("-")
      const monthNamesyear = `${this.monthNames[parseInt(month)-1]} ${year}`;
      const option = document.createElement("option");
      option.value = monthKey;
      option.textContent = monthNamesyear;
      this.monthSelect.appendChild(option);
    })
    this.monthSelect.value = this.currentMonth;
  }
  renderTempTable(){
    this.transactionList.innerHTML="";
    let income = 0, expense = 0;

    this.tempTransactions.forEach((t, index)=>{
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${t.date}</td>
        <td>${t.description}</td>
        <td>${t.category}</td>
        <td>${t.amount}</td>
        <td>${t.type}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `
      this.transactionList.appendChild(row);

      if(t.type === "income") income+=t.amount
      else expense+=t.amount
    })

    this.totalIncomeEl.textContent = income;
    this.totalExpenseEl.textContent = expense;
    this.totalBalanceEl.textContent = income-expense;
  }
  deleteTransaction(monthKey, index){
    this.allTransactions[monthKey].splice(index, 1);
    this.saveToLocal();
    this.renderTransaction(monthKey);
  }
  renderTransaction(monthKey){
    this.tempTransactions = [...(this.allTransactions[monthKey] || [])];
    this.renderTempTable();
  }
  clearMonthTableUI(){
    this.tempTransactions = [];
    this.renderTempTable();
  }
  handleSubmit(e){
    e.preventDefault();

    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (!date || !description || isNaN(amount)) {
      alert('Please fill all fields correctly!');
      return;
    }

    this.monthKey = date.slice(0,7);
    if(!this.allTransactions[this.monthKey]) this.allTransactions[this.monthKey] = [];
    this.allTransactions[this.monthKey].push({date, description, category, amount, type});

    this.saveToLocal();
    this.populateMonths();
    this.renderTransaction(this.monthSelect.value);
    this.form.reset();
  }
  saveToLocal(){
    localStorage.setItem("allTransactions", JSON.stringify(this.allTransactions));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TransactionApp();
});