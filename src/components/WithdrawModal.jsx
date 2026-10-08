import React, { useState, useEffect } from 'react';
import { X, ArrowUpCircle, AlertCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../data/initialData';

export default function WithdrawModal({
  isOpen,
  onClose,
  customers,
  initialCustomer,
  onWithdraw
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
      setNotes('Cash Withdrawal');
      setError('');
    }
  }, [isOpen, initialCustomer, customers]);

  if (!isOpen) return null;

  const currentCustomer = customers.find(c => c.accountNumber.toString() === selectedAccNo);
  const currentBalance = currentCustomer ? currentCustomer.balance : 0;
  const withdrawVal = parseFloat(amount) || 0;
  const remainingBalance = currentBalance - withdrawVal;
  const isOverdrawn = withdrawVal > currentBalance;

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!currentCustomer) {
      setError('Error: Account not found.');
      return;
    }

    const val = parseFloat(amount);

    // C++ Edge Case 1: Positive withdrawal requirement
    // if (amount <= 0) { cout << "Withdrawal amount must be greater than zero.\n"; return; }
    if (isNaN(val) || val <= 0) {
      setError('Error: Withdrawal amount must be greater than zero.');
      return;
    }

    // C++ Edge Case 2: Insufficient funds check
    // if (amount > bank[index].balance) { cout << "Insufficient balance! Current Balance is " << bank[index].balance << "\n"; return; }
    if (val > currentCustomer.balance) {
      setError(`Insufficient balance! Current Balance is ${formatCurrency(currentCustomer.balance)}. Overdraft is not permitted.`);
      return;
    }

    onWithdraw(currentCustomer.accountNumber, val, notes.trim() || 'Cash Withdrawal');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Withdraw Funds</h3>
              <p className="text-xs text-slate-400">Debit funds with overdraft protection</p>
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
        <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/70 text-rose-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
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
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium"
            >
              {customers.map((c) => (
                <option key={c.accountNumber} value={c.accountNumber}>
                  #{c.accountNumber} - {c.name} ({formatCurrency(c.balance)})
                </option>
              ))}
            </select>
          </div>

          {/* Balance Preview Card */}
          {currentCustomer && (
            <div className={`rounded-xl p-3.5 flex items-center justify-between text-xs border transition-colors ${
              isOverdrawn 
                ? 'bg-rose-950/40 border-rose-800/60' 
                : 'bg-slate-800/80 border-slate-700/60'
            }`}>
              <div>
                <span className="text-slate-400 block mb-0.5">Current Balance:</span>
                <span className="font-mono font-bold text-slate-200 text-sm">
                  {formatCurrency(currentBalance)}
                </span>
              </div>
              <ArrowRight className={`w-4 h-4 ${isOverdrawn ? 'text-rose-400' : 'text-slate-400'}`} />
              <div className="text-right">
                <span className="text-slate-400 block mb-0.5">Remaining Balance:</span>
                <span className={`font-mono font-bold text-sm ${
                  isOverdrawn ? 'text-rose-400 flex items-center justify-end' : 'text-slate-200'
                }`}>
                  {isOverdrawn && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                  {formatCurrency(remainingBalance)}
                </span>
              </div>
            </div>
          )}

          {/* Withdrawal Amount Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Withdrawal Amount ($) <span className="text-rose-400">*</span>
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
                placeholder="Enter withdrawal amount"
                className={`w-full bg-slate-800 border rounded-xl pl-8 pr-3.5 py-2.5 text-base text-white font-mono focus:outline-none focus:ring-1 ${
                  isOverdrawn 
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' 
                    : 'border-slate-700 focus:border-rose-500 focus:ring-rose-500'
                }`}
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[50, 100, 200, 500].map((preset) => (
              <button
                type="button"
                key={preset}
                disabled={currentBalance < preset}
                onClick={() => setAmount(preset.toString())}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 text-xs font-mono border border-slate-700 hover:border-rose-500/50 transition-colors"
              >
                ${preset}
              </button>
            ))}
            {currentBalance > 0 && (
              <button
                type="button"
                onClick={() => setAmount(currentBalance.toString())}
                className="px-2.5 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-xs font-mono border border-rose-800/50 transition-colors"
                title="Withdraw all available balance"
              >
                Max (100%)
              </button>
            )}
          </div>

          {/* Reference / Reason */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Reason / ATM Note
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. ATM withdrawal, Bill payment"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
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
              disabled={isOverdrawn}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-lg shadow-rose-600/20 transition-all flex items-center space-x-1.5"
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Confirm Withdrawal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
