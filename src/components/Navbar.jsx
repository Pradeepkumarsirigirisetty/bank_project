import React from 'react';
import { 
  Building2, 
  UserPlus, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ArrowLeftRight, 
  RotateCcw,
  Search
} from 'lucide-react';

export default function Navbar({ 
  onOpenAddCustomer, 
  onOpenDeposit, 
  onOpenWithdraw, 
  onOpenTransfer,
  onOpenSearch,
  onResetData 
}) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">ApexTrust</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Core Banking</span>
              </div>
              <p className="text-xs text-slate-400">Enterprise Bank Management</p>
            </div>
          </div>

          {/* Clean Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-sm font-medium transition-all"
              title="Search Customer Account"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              onClick={onOpenDeposit}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/40 text-sm font-medium transition-all"
              title="Deposit Funds"
            >
              <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Deposit</span>
            </button>

            <button
              onClick={onOpenWithdraw}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-700/40 text-sm font-medium transition-all"
              title="Withdraw Funds"
            >
              <ArrowUpCircle className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline">Withdraw</span>
            </button>

            <button
              onClick={onOpenTransfer}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/40 text-sm font-medium transition-all"
              title="Transfer Funds"
            >
              <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
              <span>Transfer</span>
            </button>

            <button
              onClick={onOpenAddCustomer}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
              title="Create New Account"
            >
              <UserPlus className="w-4 h-4" />
              <span>New Account</span>
            </button>

            <button
              onClick={onResetData}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700/50 transition-all ml-1"
              title="Reset Sample Records"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
