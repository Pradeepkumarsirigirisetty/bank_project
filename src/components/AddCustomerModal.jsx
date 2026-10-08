import React, { useState, useEffect } from 'react';
import { X, UserPlus, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { formatCurrency } from '../data/initialData';

export default function AddCustomerModal({
  isOpen,
  onClose,
  onAddCustomer,
  existingAccountNumbers
}) {
  const [accountNumber, setAccountNumber] = useState('');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [accountType, setAccountType] = useState('Standard Savings');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Auto suggest next account number
  useEffect(() => {
    if (isOpen) {
      const nextAcc = existingAccountNumbers.length > 0
        ? Math.max(...existingAccountNumbers) + 1
        : 101;
      setAccountNumber(nextAcc.toString());
      setName('');
      setBalance('500');
      setEmail('');
      setError('');
    }
  }, [isOpen, existingAccountNumbers]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const accNum = parseInt(accountNumber, 10);
    const initialBal = parseFloat(balance);

    // Validation 1: Account number format
    if (isNaN(accNum) || accNum <= 0) {
      setError('Error: Please enter a valid positive account number.');
      return;
    }

    // C++ Edge Case 1: Prevent duplicate account numbers
    // if (findCustomerIndex(bank, accNo) != -1)
    if (existingAccountNumbers.includes(accNum)) {
      setError(`Error: Account number #${accNum} already exists! Duplicate numbers are not allowed.`);
      return;
    }

    // Validation 2: Customer Name
    if (!name.trim()) {
      setError('Error: Customer name cannot be empty.');
      return;
    }

    // C++ Edge Case 2: Prevent negative starting balance
    // while (balance < 0)
    if (isNaN(initialBal) || initialBal < 0) {
      setError('Error: Balance cannot be negative. Initial deposit must be 0 or higher.');
      return;
    }

    onAddCustomer({
      accountNumber: accNum,
      name: name.trim(),
      balance: initialBal,
      accountType,
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@apexbank.internal`,
      createdAt: new Date().toISOString(),
      status: 'Active'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create New Customer Account</h3>
              <p className="text-xs text-slate-400">Enter customer details to open a new account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Account Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Account Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 106"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = existingAccountNumbers.length > 0 ? Math.max(...existingAccountNumbers) + 1 : 101;
                    setAccountNumber(next.toString());
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded font-mono"
                  title="Auto-generate next unique account number"
                >
                  Auto #
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Must be a unique account number</p>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Standard Savings">Standard Savings</option>
                <option value="Checking">Checking Account</option>
                <option value="Business">Business Account</option>
                <option value="Premium Savings">Premium Savings</option>
                <option value="Wealth Investment">Wealth Investment</option>
              </select>
            </div>
          </div>

          {/* Customer Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Customer Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alexander Hamilton"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alexander@example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Initial Balance */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Initial Deposit Balance ($) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Initial deposit must be $0.00 or higher
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
