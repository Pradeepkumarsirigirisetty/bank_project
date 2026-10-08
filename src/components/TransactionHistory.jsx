import React, { useState } from 'react';
import { 
  History, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ArrowLeftRight, 
  Download, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency, formatDate } from '../data/initialData';

export default function TransactionHistory({ transactions }) {
  const [filterType, setFilterType] = useState('ALL');

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  const exportCSV = () => {
    const headers = ["Transaction ID", "Date", "Account Number", "Customer Name", "Type", "Amount", "Balance After", "Notes"];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.date,
      t.accountNumber,
      `"${t.customerName}"`,
      t.type,
      t.amount,
      t.balanceAfter,
      `"${t.notes || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bank_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl p-5 shadow-xl mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center">
              <History className="w-5 h-5 text-emerald-400 mr-2" />
              Audit Ledger & Transactions
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
              {filteredTransactions.length} records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log of all credit, debit, and account initialization events
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter Chips */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
            {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterType === type
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="py-10 text-center text-xs text-slate-400">
          No transactions found for the selected filter.
        </div>
      ) : (
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-700/60 font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Acc No</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Vault Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 font-medium">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-750/30 transition-colors">
                  <td className="py-3 px-3 whitespace-nowrap text-slate-400 font-mono">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                      tx.type === 'DEPOSIT'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : tx.type === 'WITHDRAWAL'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {tx.type === 'DEPOSIT' && <ArrowDownCircle className="w-3 h-3 mr-1" />}
                      {tx.type === 'WITHDRAWAL' && <ArrowUpCircle className="w-3 h-3 mr-1" />}
                      {tx.type === 'TRANSFER' && <ArrowLeftRight className="w-3 h-3 mr-1" />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-slate-200">
                    #{tx.accountNumber}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-semibold text-white">
                    {tx.customerName}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-400">
                    {tx.notes || 'Banking operation'}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-right font-mono font-bold">
                    <span className={tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-rose-400'}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-right font-mono text-slate-300">
                    {formatCurrency(tx.balanceAfter)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
