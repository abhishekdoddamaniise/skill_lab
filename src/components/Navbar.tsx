import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { CurrencyCode } from '../types';
import { CURRENCY_RATES } from '../data/mockData';
import { 
  Smartphone, 
  Cpu, 
  Database, 
  BarChart3, 
  Layers, 
  Zap, 
  AlertTriangle,
  Download
} from 'lucide-react';

interface NavbarProps {
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenExport }) => {
  const { 
    activeTab, 
    setActiveTab, 
    currency, 
    setCurrency, 
    trafficQPS, 
    chaosEnabled, 
    setChaosEnabled,
    triggerFlashSaleSpike 
  } = usePlatform();

  const navItems = [
    { id: 'mobile', label: 'Mobile App', icon: Smartphone },
    { id: 'microservices', label: 'Go Services', icon: Cpu },
    { id: 'redis', label: 'Redis Cache', icon: Layers },
    { id: 'database', label: 'Global DB', icon: Database },
    { id: 'analytics', label: 'Financials', icon: BarChart3 },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single element brand mark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('mobile');
            }}
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-sm shadow-md shadow-cyan-500/20">
              AG
            </div>
            <span>1MS25IS002_assignment1</span>
          </a>
          <span className="hidden lg:inline text-xs text-slate-500 font-mono">
            Go 1.23 · gRPC · Redis · Spanner
          </span>
        </div>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions & currency selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              aria-label="Select Transaction Currency"
              className="appearance-none bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md pl-2.5 pr-7 py-1.5 font-medium hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              {Object.keys(CURRENCY_RATES).map((code) => (
                <option key={code} value={code} className="bg-slate-900 text-slate-200">
                  {code} ({CURRENCY_RATES[code as CurrencyCode].symbol})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Quick Flash Sale Trigger */}
          <button
            onClick={triggerFlashSaleSpike}
            title="Simulate 2.5M QPS concurrent booking spike"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 hover:bg-cyan-900 transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono tabular-nums">{(trafficQPS / 1000000).toFixed(2)}M QPS</span>
          </button>

          {/* Chaos Toggle */}
          <button
            onClick={() => setChaosEnabled(!chaosEnabled)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              chaosEnabled
                ? 'bg-rose-950/80 border-rose-700 text-rose-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-300'
            }`}
            title="Toggle Chaos Engineering fault injection"
          >
            <AlertTriangle className={`h-3.5 w-3.5 ${chaosEnabled ? 'text-rose-400 animate-bounce' : ''}`} />
            <span className="hidden sm:inline">{chaosEnabled ? 'Chaos Active' : 'Chaos Off'}</span>
          </button>

          {/* Export Action */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors whitespace-nowrap shadow-sm shadow-cyan-400/20"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
