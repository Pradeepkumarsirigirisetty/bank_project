import React, { useState, useEffect } from 'react';
import { X, ArrowLeftRight, AlertCircle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../data/initialData';

export default function TransferModal({
  isOpen,
  onClose,
  customers,
  onTransfer
}) {
  const [fromAccNo, setFromAccNo] = useState('');
  const [toAccNo, setToAccNo] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && customers.length >= 2) {
      setFromAccNo(customers[0].accountNumber.toString());
      setToAccNo(customers[1].accountNumber.toString());
      setAmount('');
      setError('');
    }
  }, [isOpen, customers]);

  if (!isOpen) return null;

  const sourceCustomer = customers.find(c => c.accountNumber.toString() === fromAccNo);
  const destCustomer = customers.find(c => c.accountNumber.toString() === toAccNo);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!sourceCustomer || !destCustomer) {
      setError('Please select both source and destination accounts.');
      return;
    }

    if (sourceCustomer.accountNumber === destCustomer.accountNumber) {
      setError('Source and Destination accounts cannot be the same!');
      return;
    }

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Transfer amount must be greater than zero.');
      return;
    }

    if (val > sourceCustomer.balance) {
      setError(`Insufficient funds in source account #${sourceCustomer.accountNumber} (${formatCurrency(sourceCustomer.balance)}).`);
      return;
    }

    onTransfer(sourceCustomer.accountNumber, destCustomer.accountNumber, val);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Transfer Funds</h3>
              <p className="text-xs text-slate-400">Inter-Account Ledger Transfer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Source Account */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Source Account (Debit From)
            </label>
            <select
              value={fromAccNo}
              onChange={(e) => setFromAccNo(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {customers.map((c) => (
                <option key={c.accountNumber} value={c.accountNumber}>
                  #{c.accountNumber} - {c.name} ({formatCurrency(c.balance)})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Account */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Destination Account (Credit To)
            </label>
            <select
              value={toAccNo}
              onChange={(e) => setToAccNo(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {customers.map((c) => (
                <option key={c.accountNumber} value={c.accountNumber}>
                  #{c.accountNumber} - {c.name} ({formatCurrency(c.balance)})
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Transfer Amount ($)
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
                placeholder="0.00"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-base text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
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
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center space-x-1.5"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Confirm Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
