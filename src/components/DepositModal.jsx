import React, { useState, useEffect } from 'react';
import { X, ArrowDownCircle, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../data/initialData';

export default function DepositModal({
  isOpen,
  onClose,
  customers,
  initialCustomer,
  onDeposit
}) {
  const [selectedAccNo, setSelectedAccNo] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialCustomer) {
        setSelectedAccNo(initialCustomer.accountNumber.toString());
      } else if (customers.length > 0) {
        setSelectedAccNo(customers[0].accountNumber.toString());
      }
      setAmount('');
      setNotes('Direct Deposit');
      setError('');
    }
  }, [isOpen, initialCustomer, customers]);

  if (!isOpen) return null;

  const currentCustomer = customers.find(c => c.accountNumber.toString() === selectedAccNo);
  const currentBalance = currentCustomer ? currentCustomer.balance : 0;
  const depositVal = parseFloat(amount) || 0;
  const newBalance = currentBalance + depositVal;

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!currentCustomer) {
      setError('Error: Account not found.');
      return;
    }

    const val = parseFloat(amount);
    // C++ Edge Case:
    // if (amount <= 0) { cout << "Deposit amount must be greater than zero.\n"; return; }
    if (isNaN(val) || val <= 0) {
      setError('Error: Deposit amount must be greater than zero.');
      return;
    }

    onDeposit(currentCustomer.accountNumber, val, notes.trim() || 'Direct Cash Deposit');
    onClose();
  };

  const handleQuickAdd = (addVal) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + addVal).toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Deposit Funds</h3>
              <p className="text-xs text-slate-400">Credit funds to customer account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleDepositSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Account Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Select Customer Account
            </label>
            <select
              value={selectedAccNo}
              onChange={(e) => setSelectedAccNo(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              {customers.map((c) => (
                <option key={c.accountNumber} value={c.accountNumber}>
                  #{c.accountNumber} - {c.name} ({formatCurrency(c.balance)})
                </option>
              ))}
            </select>
          </div>

          {/* Current & Future Balance Box */}
          {currentCustomer && (
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Current Balance:</span>
                <span className="font-mono font-bold text-slate-200 text-sm">
                  {formatCurrency(currentBalance)}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <div className="text-right">
                <span className="text-slate-400 block mb-0.5">New Balance:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {formatCurrency(newBalance)}
                </span>
              </div>
            </div>
          )}

          {/* Deposit Amount Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Deposit Amount ($) <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter deposit amount"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-base text-white font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[100, 500, 1000, 5000].map((chip) => (
              <button
                type="button"
                key={chip}
                onClick={() => handleQuickAdd(chip)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 hover:border-emerald-500/50 transition-colors"
              >
                +${chip.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Transaction Note */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Reference / Note
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Salary, Dividend, Cash deposit"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
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
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>Confirm Deposit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
