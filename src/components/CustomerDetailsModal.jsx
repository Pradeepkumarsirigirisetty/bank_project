import React from 'react';
import { 
  X, 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Calendar, 
  Mail, 
  ShieldCheck, 
  Copy, 
  Check, 
  History,
  TrendingUp
} from 'lucide-react';
import { formatCurrency, formatDate } from '../data/initialData';

export default function CustomerDetailsModal({
  isOpen,
  onClose,
  customer,
  transactions,
  onOpenDeposit,
  onOpenWithdraw
}) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !customer) return null;

  const customerTransactions = transactions.filter(
    t => t.accountNumber === customer.accountNumber
  );

  const handleCopyAcc = () => {
    navigator.clipboard.writeText(customer.accountNumber.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Account Dossier & Balance</h3>
              <p className="text-xs text-slate-400">View customer balance and transaction statement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Customer Profile Banner */}
          <div className="flex items-center justify-between bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-md uppercase">
                {customer.name.substring(0, 2)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{customer.name}</h4>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs text-slate-400 font-mono">
                    Acc #{customer.accountNumber}
                  </span>
                  <button
                    onClick={handleCopyAcc}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                    title="Copy Account Number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Active Vault
            </span>
          </div>

          {/* Primary Balance Display (C++ Module 6) */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>AVAILABLE BALANCE</span>
              <span className="text-emerald-400 flex items-center font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Ledger
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight my-1">
              {formatCurrency(customer.balance)}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Account Type: <span className="text-slate-200 font-medium">{customer.accountType || 'Savings'}</span>
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/40">
              <span className="text-slate-400 flex items-center mb-1">
                <Mail className="w-3.5 h-3.5 mr-1.5" /> Email Address
              </span>
              <span className="text-slate-200 font-medium truncate block">
                {customer.email || 'customer@bank.internal'}
              </span>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/40">
              <span className="text-slate-400 flex items-center mb-1">
                <Calendar className="w-3.5 h-3.5 mr-1.5" /> Account Opened
              </span>
              <span className="text-slate-200 font-medium">
                {formatDate(customer.createdAt)}
              </span>
            </div>
          </div>

          {/* Customer Specific Statement / Activity */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center">
                <History className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Recent Account Activity
              </span>
              <span className="text-xs text-slate-500">
                {customerTransactions.length} events
              </span>
            </div>

            {customerTransactions.length === 0 ? (
              <div className="bg-slate-850 rounded-xl p-4 text-center border border-slate-800 text-xs text-slate-400">
                No recent transactions recorded for this account.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {customerTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${
                        tx.type === 'DEPOSIT'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {tx.type === 'DEPOSIT' ? (
                          <ArrowDownCircle className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpCircle className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{tx.notes || tx.type}</div>
                        <div className="text-[10px] text-slate-400">{formatDate(tx.date)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-bold ${
                        tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenDeposit(customer);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-semibold transition-colors"
            >
              <ArrowDownCircle className="w-3.5 h-3.5" />
              <span>Deposit</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenWithdraw(customer);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-700/50 text-xs font-semibold transition-colors"
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
