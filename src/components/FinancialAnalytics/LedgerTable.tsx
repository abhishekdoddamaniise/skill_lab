import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { BookingRecord, CurrencyCode } from '../../types';
import { CURRENCY_RATES } from '../../data/mockData';
import { Search, Filter, ArrowUpDown, ShieldCheck, Download, RefreshCw } from 'lucide-react';

export const LedgerTable: React.FC = () => {
  const { bookings, formatCurrency, currency, exportToCSV, exportToJSON } = usePlatform();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = bookings.filter((b) => {
    if (currencyFilter !== 'all' && b.currency !== currencyFilter) return false;
    if (statusFilter !== 'all' && b.paymentStatus !== statusFilter) return false;
    if (searchTerm.trim() === '') return true;

    const q = searchTerm.toLowerCase();
    return (
      b.bookingRef.toLowerCase().includes(q) ||
      b.userName.toLowerCase().includes(q) ||
      b.route.toLowerCase().includes(q) ||
      b.idempotencyKey.toLowerCase().includes(q) ||
      b.gatewayTransactionId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden space-y-0">
      {/* Table Controls Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">
            Audited Financial Transactions & Settlement Ledger
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable PCI-DSS transaction records with cryptographic idempotency keys and multi-currency foreign exchange rates.
          </p>
        </div>

        {/* Quick export actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportToJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filters Bar with cmd+k styled search badge */}
      <div className="p-4 bg-[#090d16]/80 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search booking ref, route, idemp key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg pl-9 pr-14 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Currency Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-[11px] shrink-0">Currency:</span>
          <select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value)}
            className="flex-1 bg-[#0b0f19] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">All Currencies (9 Rails)</option>
            {Object.keys(CURRENCY_RATES).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-[11px] shrink-0">Payment Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 bg-[#0b0f19] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">All Statuses</option>
            <option value="settled">Settled (100%)</option>
            <option value="pending">Pending Auth</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* High Density Zebra-Striped Table */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#070a12] text-slate-400 uppercase text-[10px] border-b border-slate-800/80 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4">Booking Ref</th>
              <th className="py-3 px-4">Passenger</th>
              <th className="py-3 px-4">Route & Seats</th>
              <th className="py-3 px-4">Billed Amount</th>
              <th className="py-3 px-4">USD Equivalent</th>
              <th className="py-3 px-4">FX Applied</th>
              <th className="py-3 px-4">Payment Rail</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Idempotency Key</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500">
                  No transaction records matched the current filters.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b, i) => (
                <tr
                  key={b.id}
                  className={`transition-colors ${
                    i % 2 === 0 ? 'bg-[#090d16]' : 'bg-[#0b0f19]'
                  } hover:bg-slate-800/50`}
                >
                  <td className="py-2.5 px-4 font-bold text-cyan-400">{b.bookingRef}</td>
                  <td className="py-2.5 px-4 text-slate-200 font-sans font-medium">{b.userName}</td>
                  <td className="py-2.5 px-4 text-slate-300">
                    <div>{b.route}</div>
                    <div className="text-[10px] text-cyan-500">Seat {b.seatNumbers.join(', ')}</div>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-white tabular-nums">
                    {b.currency} {b.originalAmount.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 text-slate-300 tabular-nums">
                    ${b.usdEquivalent.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 tabular-nums">
                    {b.fxRateUsed.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-slate-300 uppercase">
                      {b.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                      {b.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 text-[10px] truncate max-w-[140px]" title={b.idempotencyKey}>
                    {b.idempotencyKey}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                    {b.createdAt}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
