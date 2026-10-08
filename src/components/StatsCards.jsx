import React from 'react';
import { 
  Trophy, 
  Wallet, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '../data/initialData';

export default function StatsCards({ customers, onSelectCustomer }) {
  // Calculations mirroring C++ statistics
  const totalBalance = customers.reduce((sum, c) => sum + (c.balance || 0), 0);
  const totalAccounts = customers.length;
  const averageBalance = totalAccounts > 0 ? totalBalance / totalAccounts : 0;

  // C++ displayHighestBalance logic:
  // int highestIndex = 0; for (int i = 1; i < bank.size(); i++) ...
  const highestCustomer = customers.reduce((highest, current) => {
    if (!highest || (current.balance || 0) > (highest.balance || 0)) {
      return current;
    }
    return highest;
  }, null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Liquidity */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Deposits</span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {formatCurrency(totalBalance)}
        </div>
        <div className="mt-2 flex items-center text-xs text-emerald-400 font-medium">
          <TrendingUp className="w-3.5 h-3.5 mr-1" />
          <span>Across all active customer vaults</span>
        </div>
      </div>

      {/* 2. Total Customer Accounts */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Accounts</span>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {totalAccounts} <span className="text-sm font-normal text-slate-400">records</span>
        </div>
        <div className="mt-2 flex items-center text-xs text-blue-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          <span>100% FDIC insured & verified</span>
        </div>
      </div>

      {/* 3. Highest Balance (Module 7: displayHighestBalance) */}
      <div 
        onClick={() => highestCustomer && onSelectCustomer(highestCustomer)}
        className="bg-gradient-to-br from-amber-950/40 via-slate-800/90 to-slate-800/90 border border-amber-600/40 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-400 cursor-pointer transition-all duration-300"
        title="Click to view Highest Balance Customer details"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Highest Balance</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 rounded font-bold border border-amber-500/30">Top VIP</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
        {highestCustomer ? (
          <>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight">
              {formatCurrency(highestCustomer.balance)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold truncate max-w-[150px]">
                #{highestCustomer.accountNumber} • {highestCustomer.name}
              </span>
              <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center font-medium">
                View <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </>
        ) : (
          <div className="text-sm text-slate-400 py-3">No customer records</div>
        )}
      </div>

      {/* 4. Average Account Balance */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-teal-500/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Balance</span>
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {formatCurrency(averageBalance)}
        </div>
        <div className="mt-2 flex items-center text-xs text-slate-400 font-medium">
          <span>Median reserve per customer</span>
        </div>
      </div>
    </div>
  );
}
