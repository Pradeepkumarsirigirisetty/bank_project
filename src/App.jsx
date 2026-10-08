import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import CustomerTable from './components/CustomerTable';
import AddCustomerModal from './components/AddCustomerModal';
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import CustomerSearchModal from './components/CustomerSearchModal';
import CustomerDetailsModal from './components/CustomerDetailsModal';
import TransferModal from './components/TransferModal';
import TransactionHistory from './components/TransactionHistory';

import { 
  INITIAL_CUSTOMERS, 
  INITIAL_TRANSACTIONS, 
  formatCurrency 
} from './data/initialData';

import { 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export default function App() {
  // 1. Core State (Backed by LocalStorage)
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_bank_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch (e) {
      return INITIAL_CUSTOMERS;
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_bank_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch (e) {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('apex_bank_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('apex_bank_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // 2. Modals & Targeted Customer State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const [activeCustomer, setActiveCustomer] = useState(null);

  // 3. Sorting State
  const [sortOrder, setSortOrder] = useState('none'); // 'balance-desc', 'account-asc', 'none'

  // 4. Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Helper: Find highest balance customer
  const highestCustomer = customers.reduce((highest, curr) => {
    if (!highest || (curr.balance || 0) > (highest.balance || 0)) {
      return curr;
    }
    return highest;
  }, null);

  // Helper: Sorted customers array
  const sortedCustomers = React.useMemo(() => {
    const list = [...customers];
    if (sortOrder === 'balance-desc') {
      for (let i = 0; i < list.length - 1; i++) {
        for (let j = 0; j < list.length - i - 1; j++) {
          if (list[j].balance < list[j + 1].balance) {
            const temp = list[j];
            list[j] = list[j + 1];
            list[j + 1] = temp;
          }
        }
      }
      return list;
    } else if (sortOrder === 'account-asc') {
      return list.sort((a, b) => a.accountNumber - b.accountNumber);
    }
    return list;
  }, [customers, sortOrder]);

  // Create new customer
  const handleAddCustomer = (newCustomer) => {
    setCustomers(prev => [...prev, newCustomer]);

    // Record Transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      accountNumber: newCustomer.accountNumber,
      customerName: newCustomer.name,
      type: 'DEPOSIT',
      amount: newCustomer.balance,
      balanceAfter: newCustomer.balance,
      date: new Date().toISOString(),
      notes: 'Initial Account Deposit'
    };
    setTransactions(prev => [newTx, ...prev]);

    showToast(`Account #${newCustomer.accountNumber} created for ${newCustomer.name}`);
  };

  // Deposit money
  const handleDeposit = (accNo, amount, notes) => {
    let customerName = '';
    let updatedBalance = 0;

    setCustomers(prev => prev.map(c => {
      if (c.accountNumber === accNo) {
        customerName = c.name;
        updatedBalance = c.balance + amount;
        return { ...c, balance: updatedBalance };
      }
      return c;
    }));

    // Record Transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      accountNumber: accNo,
      customerName: customerName,
      type: 'DEPOSIT',
      amount: amount,
      balanceAfter: updatedBalance,
      date: new Date().toISOString(),
      notes: notes || 'Cash Deposit'
    };
    setTransactions(prev => [newTx, ...prev]);

    showToast(`Deposited ${formatCurrency(amount)} into Acc #${accNo}. New Balance: ${formatCurrency(updatedBalance)}`);
  };

  // Withdraw money
  const handleWithdraw = (accNo, amount, notes) => {
    let customerName = '';
    let updatedBalance = 0;

    setCustomers(prev => prev.map(c => {
      if (c.accountNumber === accNo) {
        customerName = c.name;
        updatedBalance = c.balance - amount;
        return { ...c, balance: updatedBalance };
      }
      return c;
    }));

    // Record Transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      accountNumber: accNo,
      customerName: customerName,
      type: 'WITHDRAWAL',
      amount: amount,
      balanceAfter: updatedBalance,
      date: new Date().toISOString(),
      notes: notes || 'Cash Withdrawal'
    };
    setTransactions(prev => [newTx, ...prev]);

    showToast(`Withdrawn ${formatCurrency(amount)} from Acc #${accNo}. New Balance: ${formatCurrency(updatedBalance)}`);
  };

  // Inter-Account Transfer
  const handleTransfer = (fromAccNo, toAccNo, amount) => {
    const fromCust = customers.find(c => c.accountNumber === fromAccNo);
    const toCust = customers.find(c => c.accountNumber === toAccNo);

    if (!fromCust || !toCust) return;

    const fromNewBal = fromCust.balance - amount;
    const toNewBal = toCust.balance + amount;

    setCustomers(prev => prev.map(c => {
      if (c.accountNumber === fromAccNo) return { ...c, balance: fromNewBal };
      if (c.accountNumber === toAccNo) return { ...c, balance: toNewBal };
      return c;
    }));

    const txDebit = {
      id: `tx-${Date.now()}-1`,
      accountNumber: fromAccNo,
      customerName: fromCust.name,
      type: 'TRANSFER',
      amount: amount,
      balanceAfter: fromNewBal,
      date: new Date().toISOString(),
      notes: `Transfer to #${toAccNo} (${toCust.name})`
    };

    const txCredit = {
      id: `tx-${Date.now()}-2`,
      accountNumber: toAccNo,
      customerName: toCust.name,
      type: 'TRANSFER',
      amount: amount,
      balanceAfter: toNewBal,
      date: new Date().toISOString(),
      notes: `Transfer from #${fromAccNo} (${fromCust.name})`
    };

    setTransactions(prev => [txCredit, txDebit, ...prev]);

    showToast(`Transferred ${formatCurrency(amount)} from #${fromAccNo} to #${toAccNo}!`);
  };

  // Delete Customer
  const handleDeleteCustomer = (accNo) => {
    if (window.confirm(`Are you sure you want to close account #${accNo}? This cannot be undone.`)) {
      setCustomers(prev => prev.filter(c => c.accountNumber !== accNo));
      showToast(`Account #${accNo} closed and removed from system.`, 'info');
    }
  };

  // Reset Data to sample
  const handleResetData = () => {
    if (window.confirm("Reset all bank records to default sample data?")) {
      setCustomers(INITIAL_CUSTOMERS);
      setTransactions(INITIAL_TRANSACTIONS);
      setSortOrder('none');
      showToast("Bank records reset to default state.");
    }
  };

  // Toggle sort by balance
  const toggleSortBalance = () => {
    if (sortOrder === 'balance-desc') {
      setSortOrder('none');
      showToast("Default sorting restored.");
    } else {
      setSortOrder('balance-desc');
      showToast("Sorted by balance (highest first).");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 p-4 rounded-2xl shadow-2xl bg-slate-900 border border-slate-700 text-slate-100 animate-slide-up max-w-md">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />}
          <div className="text-sm font-medium flex-1">{toast.message}</div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenAddCustomer={() => setIsAddOpen(true)}
        onOpenDeposit={() => {
          setActiveCustomer(customers[0] || null);
          setIsDepositOpen(true);
        }}
        onOpenWithdraw={() => {
          setActiveCustomer(customers[0] || null);
          setIsWithdrawOpen(true);
        }}
        onOpenTransfer={() => setIsTransferOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple & Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Banking Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Overview of customer accounts, deposits, and real-time transaction activity
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSortBalance}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all border ${
                sortOrder === 'balance-desc'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-500/50'
              }`}
            >
              <ArrowUpDown className="w-4 h-4 text-emerald-400" />
              <span>Sort by Balance</span>
            </button>
          </div>
        </div>

        {/* 1. Statistics Cards */}
        <StatsCards
          customers={customers}
          onSelectCustomer={(cust) => {
            setActiveCustomer(cust);
            setIsDetailsOpen(true);
          }}
        />

        {/* 2. Customer Table */}
        <CustomerTable
          customers={sortedCustomers}
          highestCustomerId={highestCustomer ? highestCustomer.accountNumber : null}
          onOpenAddCustomer={() => setIsAddOpen(true)}
          onOpenDeposit={(cust) => {
            setActiveCustomer(cust);
            setIsDepositOpen(true);
          }}
          onOpenWithdraw={(cust) => {
            setActiveCustomer(cust);
            setIsWithdrawOpen(true);
          }}
          onSelectCustomer={(cust) => {
            setActiveCustomer(cust);
            setIsDetailsOpen(true);
          }}
          onDeleteCustomer={handleDeleteCustomer}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        {/* 3. Transaction History */}
        <TransactionHistory transactions={transactions} />
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>ApexTrust Bank &bull; Secure Core Banking System</p>
      </footer>

      {/* Modals */}
      <AddCustomerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddCustomer={handleAddCustomer}
        existingAccountNumbers={customers.map(c => c.accountNumber)}
      />

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        customers={customers}
        initialCustomer={activeCustomer}
        onDeposit={handleDeposit}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        customers={customers}
        initialCustomer={activeCustomer}
        onWithdraw={handleWithdraw}
      />

      <CustomerSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        customers={customers}
        onSelectCustomer={(cust) => {
          setActiveCustomer(cust);
          setIsDetailsOpen(true);
        }}
        onOpenDeposit={(cust) => {
          setActiveCustomer(cust);
          setIsDepositOpen(true);
        }}
        onOpenWithdraw={(cust) => {
          setActiveCustomer(cust);
          setIsWithdrawOpen(true);
        }}
      />

      <CustomerDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        customer={activeCustomer}
        transactions={transactions}
        onOpenDeposit={(cust) => {
          setActiveCustomer(cust);
          setIsDepositOpen(true);
        }}
        onOpenWithdraw={(cust) => {
          setActiveCustomer(cust);
          setIsWithdrawOpen(true);
        }}
      />

      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        customers={customers}
        onTransfer={handleTransfer}
      />
    </div>
  );
}
