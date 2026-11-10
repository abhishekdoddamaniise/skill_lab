import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Play, 
  Layers, 
  Database, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Download, 
  ChevronDown,
  Sparkles,
  Sliders
} from 'lucide-react';

interface StudioHeaderProps {
  onOpenExport: () => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  onOpenExport,
  isInspectorOpen,
  onToggleInspector,
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    trafficQPS, 
    triggerFlashSaleSpike, 
    chaosEnabled 
  } = usePlatform();

  const studioViews = [
    { id: 'mobile', label: 'Mobile Simulator' },
    { id: 'microservices', label: 'Go Microservices' },
    { id: 'redis', label: 'Redis Redlock' },
    { id: 'database', label: 'Spanner Schema' },
    { id: 'analytics', label: 'Financial Ledger' },
  ] as const;

  return (
    <header className="h-14 border-b border-[#37393b] bg-[#1e1f20] px-4 flex items-center justify-between text-[#e3e3e3] shrink-0 z-20">
      {/* Left: Studio Brand & Project Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Gemini Sparkle / Studio Logo Mark */}
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#a8c7fa] to-[#669df6] flex items-center justify-center text-[#040e25] font-black text-xs shadow-sm">
            ✦
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight text-white font-sans">
              1MS25IS002_assignment1 Studio
            </span>
            <span className="text-[11px] font-mono text-[#8e918f]">
              v2.4
            </span>
          </div>
        </div>

        {/* Model / Architecture Preset Dropdown Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131314] border border-[#37393b] text-xs font-mono text-[#c4c7c5] hover:border-[#444746] cursor-pointer">
          <span className="text-[#a8c7fa] font-semibold">Mesh:</span>
          <span>Go 1.23 + Spanner + Redlock</span>
          <ChevronDown className="h-3 w-3 text-[#8e918f]" />
        </div>
      </div>

      {/* Center: Gemini-Style Rounded Pill Segmented Navigation */}
      <nav className="hidden lg:flex items-center p-1 rounded-full bg-[#131314] border border-[#37393b]">
        {studioViews.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#37393b] text-[#a8c7fa] font-semibold shadow-sm'
                  : 'text-[#c4c7c5] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right: Live Connection Indicator, Inspector Toggle, Run / Simulate Button */}
      <div className="flex items-center gap-3">
        {/* Live system status indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#8e918f]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8c7fa] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a8c7fa]"></span>
          </span>
          <span className="text-[#c4c7c5]">
            Connected · <strong className="text-[#a8c7fa]">98.6%</strong> Cache Hit
          </span>
        </div>

        {/* Export secondary button */}
        <button
          onClick={onOpenExport}
          className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#747775] text-[#e3e2e6] hover:bg-[#282a2c] transition-colors"
        >
          <Download className="h-3.5 w-3.5 inline mr-1" />
          <span>Export</span>
        </button>

        {/* Toggle Right Inspector Drawer */}
        <button
          onClick={onToggleInspector}
          className={`p-1.5 rounded-full border transition-colors ${
            isInspectorOpen
              ? 'bg-[#282a2c] text-[#a8c7fa] border-[#7cacf8]'
              : 'border-[#444746] text-[#c4c7c5] hover:bg-[#282a2c]'
          }`}
          title="Toggle Inspection Drawer"
        >
          <Terminal className="h-4 w-4" />
        </button>

        {/* Gemini-Style Primary Pill Run / Simulate Button */}
        <button
          onClick={triggerFlashSaleSpike}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#a8c7fa] hover:bg-[#7cacf8] text-[#040e25] transition-all shadow-md active:scale-95 whitespace-nowrap"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Run Simulate</span>
        </button>
      </div>
    </header>
  );
};
