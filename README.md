**💰 Expense Tracker (Advanced)**

      A feature-rich, browser-based Expense Tracker that allows users to manage income and expenses month-wise, filter and visualize data, and persist everything locally using localStorage.
      
      Built entirely with Vanilla JavaScript — no frameworks, no shortcuts.

**Live Demo** 👉 https://ala111205.github.io/Expense-Tracker/

**🚀 Key Features:**

**➕ Transaction Management**

      Add income and expense transactions

      Fields: date, description, category, amount, type

      Transactions are automatically grouped by month based on date

      Input validation prevents invalid or incomplete entries

**📆 Month-Wise Expense Tracking**

      Month selector dynamically populated from stored data

      Switch between months without losing any data

      Each month maintains independent transactions and totals

**📊 Financial Summary (Per Month)**

      Total Income

      Total Expenses

      Net Balance (Income − Expense)

      Values update instantly on add, delete, edit, filter, or import

**🗂 Category Filtering**

      Filter transactions by category (Food, Transport, Rent, Salary, etc.)

      Filtering updates:

        Transaction table

        Totals (income, expense, balance)

        Pie chart visualization

      Filter does not affect stored data, only the view

**✏️ Edit & Delete Transactions**

      Edit any transaction directly from the table

      Updates reflect immediately in totals and charts

      Delete transactions permanently from localStorage

**📈 Data Visualization**

      Interactive Pie Chart (Chart.js)

      Shows expense distribution by category

      Automatically updates when:

      Month changes

      Category filter changes

      Transaction is added, edited, or deleted

**🔄 Reset Table (Safe Reset)**

      Clears the table UI for the selected month only

      Does NOT delete stored data

      Refreshing the page restores the saved transactions

**📤 Export & 📥 Import Data**

      Export all transactions as a JSON file

      Import previously exported data

      Imported data:

        Merges safely with existing months

        Recalculates totals and charts automatically

      Useful for backups or transferring data between devices

**💾 Persistent Storage**

      Uses browser localStorage

      No backend required

      Works fully offline

      Data remains available after page reload or browser restart

**📱 Responsive UI**

      Clean and simple layout

      Works smoothly on:

      Desktop

      Tablet

      Mobile

**🛠️ Technologies Used:**

      HTML5 – Structure

      CSS3 – Styling & responsive layout

      JavaScript (Vanilla) – Logic & data handling
  
      Chart.js – Expense visualization

      LocalStorage API – Data persistence

**📄 How to Use:**

      Add transactions using the input form.

      Select a month from the dropdown to view its data.

      Filter transactions by category if needed.

      Edit or delete transactions directly from the table.

      View updated totals and chart in real time.

      Use Export to save your data or Import to restore it.
