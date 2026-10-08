import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Eye, 
  Trash2, 
  Plus, 
  LayoutGrid, 
  Table as TableIcon,
  Trophy,
  SlidersHorizontal,
  BadgeDollarSign
} from 'lucide-react';
import { formatCurrency, formatDate } from '../data/initialData';

export default function CustomerTable({
  customers,
  highestCustomerId,
  onOpenAddCustomer,
  onOpenDeposit,
  onOpenWithdraw,
  onSelectCustomer,
  onDeleteCustomer,
  sortOrder,
  onSortChange
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Filter customers by search term (account number or name)
  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      c.accountNumber.toString().includes(term) ||
      c.name.toLowerCase().includes(term) ||
      (c.accountType && c.accountType.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl p-5 shadow-xl">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Customer Accounts</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {filteredCustomers.length} {filteredCustomers.length === 1 ? 'Account' : 'Accounts'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage customer vaults, view balances, deposit, and withdraw funds
          </p>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or Acc No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Sort Control (Module 8: sortCustomersByBalance) */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700 rounded-xl p-1">
            <button
              onClick={() => onSortChange('balance-desc')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                sortOrder === 'balance-desc'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Sort by highest balance"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Balance (High &rarr; Low)</span>
            </button>
            <button
              onClick={() => onSortChange('account-asc')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                sortOrder === 'account-asc'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Sort by Account Number"
            >
              Acc No
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State check (C++ Edge case: bank.size() == 0) */}
      {filteredCustomers.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <BadgeDollarSign className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Customers Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-5">
            {searchTerm
              ? `No bank records matching "${searchTerm}". Try a different account number or name.`
              : 'The bank record system is currently empty. Add your first customer to get started!'}
          </p>
          <button
            onClick={onOpenAddCustomer}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Customer</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (Module 2: displayCustomers) */
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-700/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Acc No.</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Account Type</th>
                <th className="py-3 px-4 text-right">Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 font-medium">
              {filteredCustomers.map((customer) => {
                const isHighest = customer.accountNumber === highestCustomerId;

                return (
                  <tr
                    key={customer.accountNumber}
                    className="hover:bg-slate-750/50 hover:bg-slate-700/30 transition-colors group"
                  >
                    {/* Account Number */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-semibold text-white bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                          #{customer.accountNumber}
                        </span>
                        {isHighest && (
                          <span 
                            title="Highest Balance Customer in Bank"
                            className="flex items-center text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-[11px] font-bold"
                          >
                            <Trophy className="w-3 h-3 mr-0.5" /> Top VIP
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer Name */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-xs uppercase border border-slate-600">
                          {customer.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors cursor-pointer" onClick={() => onSelectCustomer(customer)}>
                            {customer.name}
                          </div>
                          <div className="text-xs text-slate-400">{customer.email || 'customer@bank.internal'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Account Type */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/40">
                        {customer.accountType || 'Standard Savings'}
                      </span>
                    </td>

                    {/* Balance */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <span className="text-base font-bold font-mono text-emerald-400">
                        {formatCurrency(customer.balance)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                        Active
                      </span>
                    </td>

                    {/* Quick Row Actions */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Deposit */}
                        <button
                          onClick={() => onOpenDeposit(customer)}
                          className="p-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 transition-colors"
                          title="Deposit Funds"
                        >
                          <ArrowDownCircle className="w-4 h-4" />
                        </button>

                        {/* Withdraw */}
                        <button
                          onClick={() => onOpenWithdraw(customer)}
                          className="p-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-700/50 transition-colors"
                          title="Withdraw Funds"
                        >
                          <ArrowUpCircle className="w-4 h-4" />
                        </button>

                        {/* View Details */}
                        <button
                          onClick={() => onSelectCustomer(customer)}
                          className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/50 transition-colors"
                          title="View Account Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteCustomer(customer.accountNumber)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/70 text-slate-400 hover:text-red-400 border border-slate-700/50 hover:border-red-700/50 transition-colors"
                          title="Close Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredCustomers.map((customer) => {
            const isHighest = customer.accountNumber === highestCustomerId;

            return (
              <div
                key={customer.accountNumber}
                className={`bg-slate-900/80 rounded-xl p-5 border transition-all duration-200 relative group flex flex-col justify-between ${
                  isHighest
                    ? 'border-amber-500/50 shadow-lg shadow-amber-500/5 hover:border-amber-400'
                    : 'border-slate-700/70 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Acc #{customer.accountNumber}
                    </span>
                    {isHighest ? (
                      <span className="flex items-center text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-xs font-bold">
                        <Trophy className="w-3.5 h-3.5 mr-1" /> Highest Balance
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {customer.accountType || 'Savings'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {customer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                        {customer.name}
                      </h4>
                      <p className="text-xs text-slate-400">{customer.email || 'customer@bank.internal'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-3 mb-4 border border-slate-700/50">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Current Vault Balance
                    </span>
                    <span className="text-xl font-extrabold font-mono text-emerald-400">
                      {formatCurrency(customer.balance)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onOpenDeposit(customer)}
                    className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/40 text-xs font-semibold transition-colors"
                  >
                    <ArrowDownCircle className="w-3.5 h-3.5" />
                    <span>Deposit</span>
                  </button>
                  <button
                    onClick={() => onOpenWithdraw(customer)}
                    className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-700/40 text-xs font-semibold transition-colors"
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>Withdraw</span>
                  </button>
                  <button
                    onClick={() => onSelectCustomer(customer)}
                    className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
