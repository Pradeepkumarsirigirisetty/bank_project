// Initial dataset mirroring Module VI Customer struct
export const INITIAL_CUSTOMERS = [
  {
    accountNumber: 101,
    name: "Sarah Jenkins",
    balance: 12450.00,
    accountType: "Premium Savings",
    email: "sarah.j@example.com",
    createdAt: "2024-01-15T09:30:00Z",
    status: "Active",
  },
  {
    accountNumber: 102,
    name: "Michael Chen",
    balance: 8920.50,
    accountType: "Checking",
    email: "mchen@example.com",
    createdAt: "2024-02-10T14:15:00Z",
    status: "Active",
  },
  {
    accountNumber: 103,
    name: "Amina Al-Mansoor",
    balance: 34800.00,
    accountType: "Wealth Investment",
    email: "amina.m@example.com",
    createdAt: "2023-11-20T11:00:00Z",
    status: "Active",
  },
  {
    accountNumber: 104,
    name: "David Rodriguez",
    balance: 4150.25,
    accountType: "Savings",
    email: "david.r@example.com",
    createdAt: "2024-03-05T16:45:00Z",
    status: "Active",
  },
  {
    accountNumber: 105,
    name: "Emily Watson",
    balance: 19300.75,
    accountType: "Business",
    email: "emily.w@example.com",
    createdAt: "2023-12-12T08:20:00Z",
    status: "Active",
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx-1001",
    accountNumber: 103,
    customerName: "Amina Al-Mansoor",
    type: "DEPOSIT",
    amount: 10000.00,
    balanceAfter: 34800.00,
    date: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: "Direct wire deposit"
  },
  {
    id: "tx-1002",
    accountNumber: 101,
    customerName: "Sarah Jenkins",
    type: "DEPOSIT",
    amount: 2500.00,
    balanceAfter: 12450.00,
    date: new Date(Date.now() - 3600000 * 12).toISOString(),
    notes: "Monthly dividend deposit"
  },
  {
    id: "tx-1003",
    accountNumber: 104,
    customerName: "David Rodriguez",
    type: "WITHDRAWAL",
    amount: 500.00,
    balanceAfter: 4150.25,
    date: new Date(Date.now() - 3600000 * 28).toISOString(),
    notes: "ATM Cash Withdrawal"
  },
  {
    id: "tx-1004",
    accountNumber: 102,
    customerName: "Michael Chen",
    type: "DEPOSIT",
    amount: 1200.00,
    balanceAfter: 8920.50,
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    notes: "Mobile check deposit"
  }
];

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateStr) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateStr;
  }
};
