import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { CurrencyCode } from '../types';
import { CURRENCY_RATES } from '../data/mockData';
import { 
  Zap, 
  AlertTriangle, 
  Download, 
  Search, 
  Command, 
  SlidersHorizontal,
  ChevronDown,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onOpenExport: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenExport, onToggleSidebar }) => {
  const { 
    currency, 
    setCurrency, 
    trafficQPS, 
    chaosEnabled, 
    setChaosEnabled, 
    triggerFlashSaleSpike 
  } = usePlatform();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left zone: Mobile toggle + Breadcrumb context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors md:hidden"
          title="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 font-medium">1MS25IS002_assignment1</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 font-semibold">platform-core</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60 text-[10px]">
            production-cluster
          </span>
        </div>
      </div>

      {/* Middle zone: Linear-styled cmd+k search trigger visual */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-400 font-mono w-72 justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-slate-500" />
          <span>Search routes, transactions...</span>
        </div>
        <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700 flex items-center gap-0.5">
          <Command className="h-3 w-3" /> K
        </kbd>
      </div>

      {/* Right zone: Multi-currency picker, live QPS surge button, chaos toggle, export */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Currency selector */}
        <div className="relative">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            aria-label="Settlement Currency"
            className="appearance-none bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg pl-3 pr-7 py-1.5 font-mono font-medium hover:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            {Object.keys(CURRENCY_RATES).map((code) => (
              <option key={code} value={code} className="bg-slate-900 text-slate-200">
                {code} ({CURRENCY_RATES[code as CurrencyCode].symbol})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">
            ▼
          </div>
        </div>

        {/* Live QPS Simulation Flash Button */}
        <button
          onClick={triggerFlashSaleSpike}
          title="Trigger 2.5M QPS concurrent surge"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 hover:bg-cyan-900 transition-colors"
        >
          <Zap className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="tabular-nums">{(trafficQPS / 1_000_000).toFixed(2)}M QPS</span>
        </button>

        {/* Chaos Mode Toggle */}
        <button
          onClick={() => setChaosEnabled(!chaosEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
            chaosEnabled
              ? 'bg-rose-950/80 border-rose-700 text-rose-300 shadow-sm shadow-rose-950'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700'
          }`}
          title="Toggle Chaos Fault Injection"
        >
          <AlertTriangle className={`h-3.5 w-3.5 ${chaosEnabled ? 'text-rose-400 animate-bounce' : ''}`} />
          <span className="hidden md:inline">{chaosEnabled ? 'Chaos Active' : 'Chaos Off'}</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-sm shadow-cyan-400/20 active:scale-95 whitespace-nowrap"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
