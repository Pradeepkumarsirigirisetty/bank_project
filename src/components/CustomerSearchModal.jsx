import React, { useState } from 'react';
import { X, Search, UserCheck, UserX, ArrowDownCircle, ArrowUpCircle, Eye, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../data/initialData';

export default function CustomerSearchModal({
  isOpen,
  onClose,
  customers,
  onSelectCustomer,
  onOpenDeposit,
  onOpenWithdraw
}) {
  const [searchAccNo, setSearchAccNo] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);

    // C++ Edge Case: Bank is empty
    if (customers.length === 0) {
      setResult(null);
      return;
    }

    const acc = parseInt(searchAccNo, 10);
    // C++ logic: findCustomerIndex(bank, accNo)
    const found = customers.find(c => c.accountNumber === acc);
    setResult(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Search Customer Vault</h3>
              <p className="text-xs text-slate-400">Search customer by account number</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Enter Account Number to Search
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  required
                  autoFocus
                  placeholder="e.g. 101, 103"
                  value={searchAccNo}
                  onChange={(e) => {
                    setSearchAccNo(e.target.value);
                    setSearched(false);
                  }}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all flex items-center space-x-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Search Results */}
          {searched && (
            <div className="pt-2">
              {customers.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs flex items-center space-x-3">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span>Bank records are empty. No accounts registered.</span>
                </div>
              ) : result ? (
                /* Found Result Card */
                <div className="bg-slate-800/90 border border-emerald-500/50 rounded-2xl p-5 shadow-lg relative overflow-hidden animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Account Verified #{result.accountNumber}
                    </span>
                    <span className="flex items-center text-xs text-emerald-400 font-semibold">
                      <UserCheck className="w-4 h-4 mr-1" /> Active Record
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-white mb-0.5">{result.name}</h4>
                    <p className="text-xs text-slate-400">{result.accountType || 'Savings Account'}</p>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-3.5 mb-4 border border-slate-700/60">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Current Available Balance
                    </span>
                    <span className="text-2xl font-extrabold font-mono text-emerald-400">
                      {formatCurrency(result.balance)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/50">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDeposit(result);
                      }}
                      className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-semibold transition-colors"
                    >
                      <ArrowDownCircle className="w-3.5 h-3.5" />
                      <span>Deposit</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenWithdraw(result);
                      }}
                      className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-700/50 text-xs font-semibold transition-colors"
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                      <span>Withdraw</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectCustomer(result);
                      }}
                      className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                      title="View Full Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Not Found Card */
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-2 text-rose-400">
                    <UserX className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-0.5">Customer Not Found</h4>
                  <p className="text-xs text-slate-400">
                    No matching account with Account Number <span className="font-mono text-rose-300">#{searchAccNo}</span> was found in bank records.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
