# 🏦 ApexTrust - Modern Bank Management System (React.js)

A modern, high-performance banking management web application created with **React 18**, **Tailwind CSS**, and **Vite**, transforming a classic C++ console-based banking system into an enterprise dashboard.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Then open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔄 C++ to React Architecture Mapping

| C++ Module & Function | C++ Console Implementation | React.js Web UI Implementation |
| :--- | :--- | :--- |
| **Module VI: Struct `Customer`** | `struct Customer { int accountNumber; string name; double balance; };` | Object state stored in `customers` array backed by browser `localStorage` |
| **Module II: `findCustomerIndex`** | Linear `for` loop traversal over `vector<Customer>& bank` | `customers.find(c => c.accountNumber === acc)` with instant lookup |
| **Option 1: `addCustomer`** | `bank.push_back(newCustomer)` with duplicate check | Interactive Modal with auto-generated account numbers, validation, and account type selection |
| **Option 2: `displayCustomers`** | Formatted console table print | Interactive Data Table & Grid view toggle, search filter, and row action buttons |
| **Option 3: `searchCustomer`** | Search prompt & display matching customer | Dedicated Search Modal and search bar with live account verification badge |
| **Option 4: `depositMoney`** | `bank[index].balance += amount` (checks `amount > 0`) | Deposit Modal with quick-deposit chips ($100, $500, $1K, $5K), live new balance calculation, and ledger entry |
| **Option 5: `withdrawMoney`** | `bank[index].balance -= amount` with overdraft check | Withdraw Modal with overdraft warning, remaining balance preview, and quick percentage chips |
| **Option 6: `displayBalance`** | Console balance inquiry | Customer Dossier Modal showing current balance, account tier, and full activity history |
| **Option 7: `displayHighestBalance`** | Linear scan finding highest balance customer | Golden Trophy VIP Spotlight card on the dashboard with direct profile view |
| **Option 8: `sortCustomersByBalance`** | Nested Bubble Sort algorithm descending by balance | Dedicated Bubble Sort trigger button and interactive sorting controls |
| **Bonus Features** | N/A | Inter-account transfers, immutable audit ledger, CSV export, and sample data reset |

---

## 🛡️ Edge Cases Handled

1. **Duplicate Account Numbers**: Prevents registering an account number that already exists in records.
2. **Negative Initial Balance**: Disallows negative deposit values at account creation.
3. **Invalid Transaction Amounts**: Rejects zero or negative amounts for deposits and withdrawals.
4. **Insufficient Funds / Overdraft Protection**: Prohibits withdrawing more than the customer's current balance with immediate visual warnings.
5. **Empty Bank State**: Handles empty database gracefully with helpful onboarding call-to-actions.

---

## 📁 Project Structure

```
bank_management_system/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── data/
│   │   └── initialData.js
│   └── components/
│       ├── AddCustomerModal.jsx
│       ├── CppCodeViewerModal.jsx
│       ├── CustomerDetailsModal.jsx
│       ├── CustomerSearchModal.jsx
│       ├── CustomerTable.jsx
│       ├── DepositModal.jsx
│       ├── Navbar.jsx
│       ├── StatsCards.jsx
│       ├── TransactionHistory.jsx
│       ├── TransferModal.jsx
│       └── WithdrawModal.jsx
```
