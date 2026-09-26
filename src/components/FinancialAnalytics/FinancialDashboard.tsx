import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { LedgerTable } from './LedgerTable';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Activity, 
  Globe, 
  CreditCard, 
  Download, 
  Zap,
  ArrowUpRight
} from 'lucide-react';

interface FinancialDashboardProps {
  onOpenExportModal: () => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ onOpenExportModal }) => {
  const { metrics, currency, formatCurrency, trafficQPS, exportToCSV, exportToJSON, exportCTOReport } = usePlatform();

  // Multi-currency revenue distribution
  const currencyDistribution = [
    { code: 'USD', share: '54.2%', amountUSD: '$26.15M', color: 'bg-cyan-500' },
    { code: 'EUR', share: '22.8%', amountUSD: '$11.01M', color: 'bg-blue-500' },
    { code: 'GBP', share: '8.5%', amountUSD: '$4.10M', color: 'bg-indigo-500' },
    { code: 'JPY', share: '7.4%', amountUSD: '$3.57M', color: 'bg-emerald-500' },
    { code: 'SGD', share: '4.1%', amountUSD: '$1.98M', color: 'bg-amber-500' },
    { code: 'Other', share: '3.0%', amountUSD: '$1.44M', color: 'bg-slate-500' },
  ];

  // Real-time conversion funnel stages
  const funnelStages = [
    { step: '1. Route & Inventory Search', count: '1,845,000 req/s', rate: '100%', pct: 100 },
    { step: '2. Seat Map & Detail View', count: '774,900 req/s', rate: '42.0%', pct: 42 },
    { step: '3. Redis Redlock Seat Hold', count: '332,100 req/s', rate: '18.0%', pct: 18 },
    { step: '4. Multi-Currency Checkout', count: '173,430 req/s', rate: '9.4%', pct: 9.4 },
    { step: '5. Settled & Dispatched', count: '164,205 req/s', rate: '8.9%', pct: 8.9 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-cyan-400">
              CTO EXECUTIVE FINANCIAL DASHBOARD & USER TELEMETRY
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-emerald-400 font-mono">
              Live Real-Time Aggregation
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Financial Health, Multi-Currency Volume & User Metrics
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time financial performance indicators, take rates, foreign currency exposure,
            high-concurrency conversion funnel analysis, and auditable export reports.
          </p>
        </div>

        {/* Global Export Engine Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95 transition-all whitespace-nowrap"
          >
            <Download className="h-4 w-4" />
            <span>Generate Audited Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono uppercase">Gross Merchandise Value</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center">
              +14.8% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            ${(metrics.gmvUSD / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Annualized run rate: ${(metrics.gmvUSD * 12 / 1000000).toFixed(1)}M USD
          </div>
        </div>

        {/* Net Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono uppercase">Net Platform Revenue</span>
            <span className="text-xs text-cyan-400 font-mono font-semibold">
              {metrics.takeRatePercentage}% Take Rate
            </span>
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono tabular-nums">
            ${(metrics.netRevenueUSD / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Pure gross margin: 91.2% after PSP fees
          </div>
        </div>

        {/* Active Concurrent Users */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono uppercase">Concurrent User Load</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-mono">Live</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {(metrics.activeUsers / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Handling {(metrics.qpsCurrent / 1000000).toFixed(2)}M concurrent QPS
          </div>
        </div>

        {/* Payment Success & Integrity */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono uppercase">Payment Settlement SLA</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {metrics.paymentSuccessRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Fraud / Chargeback rate: {metrics.chargebackRate}% (Target &lt; 0.1%)
          </div>
        </div>
      </div>

      {/* Analytics Midsection: Multi-Currency Breakdown & Real-Time Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Currency Volume Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Multi-Currency Settlement Volume
              </h3>
              <p className="text-xs text-slate-400">
                Global FX clearing mix across 9 major foreign currencies
              </p>
            </div>
            <Globe className="h-4 w-4 text-cyan-400" />
          </div>

          {/* Visual Share Bar */}
          <div className="h-4 w-full rounded-full bg-slate-950 overflow-hidden flex">
            {currencyDistribution.map((item) => (
              <div
                key={item.code}
                style={{ width: item.share }}
                className={`${item.color} h-full transition-all`}
                title={`${item.code}: ${item.share}`}
              />
            ))}
          </div>

          {/* Currency Legend Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            {currencyDistribution.map((c) => (
              <div key={c.code} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2.5 w-2.5 rounded-full ${c.color}`} />
                    <span className="font-bold text-white">{c.code}</span>
                  </div>
                  <span className="text-cyan-400">{c.share}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{c.amountUSD}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Conversion Funnel */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Real-Time User Booking Funnel
              </h3>
              <p className="text-xs text-slate-400">
                Microservice conversion efficiency under concurrent load
              </p>
            </div>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="space-y-3 pt-1">
            {funnelStages.map((stage) => (
              <div key={stage.step} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{stage.step}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{stage.count}</span>
                    <span className="font-bold text-cyan-400">{stage.rate}</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                    style={{ width: `${stage.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded High-Density Audited Transactions Ledger */}
      <LedgerTable />
    </div>
  );
};
