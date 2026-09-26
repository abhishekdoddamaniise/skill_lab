import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Sliders, 
  Flame, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  Terminal, 
  Cpu, 
  Layers, 
  Database, 
  ShieldCheck, 
  ChevronDown, 
  Info, 
  Sparkles, 
  Zap 
} from 'lucide-react';
import { CurrencyCode } from '../../types';
import { CURRENCY_RATES } from '../../data/mockData';

export const StudioLeftControlPanel: React.FC = () => {
  const { 
    trafficQPS, 
    setTrafficQPS, 
    chaosEnabled, 
    setChaosEnabled, 
    chaosType, 
    setChaosType, 
    triggerFlashSaleSpike,
    currency,
    setCurrency,
    microservices
  } = usePlatform();

  const [activePreset, setActivePreset] = useState<'nominal' | 'peak' | 'stress'>('nominal');
  const [selectedClusterRegion, setSelectedClusterRegion] = useState<string>('global-mesh');
  const [governanceMode, setGovernanceMode] = useState<string>('pci-strict');

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrafficQPS(Number(e.target.value));
  };

  const handleApplyPreset = (preset: 'nominal' | 'peak' | 'stress') => {
    setActivePreset(preset);
    if (preset === 'nominal') {
      setTrafficQPS(850000);
      setChaosEnabled(false);
      setChaosType('none');
    } else if (preset === 'peak') {
      setTrafficQPS(1845000);
      setChaosEnabled(false);
      setChaosType('none');
    } else if (preset === 'stress') {
      setTrafficQPS(2450000);
      setChaosEnabled(true);
      setChaosType('latency_spike');
    }
  };

  return (
    <aside className="w-[340px] shrink-0 border-r border-[#37393b] bg-[#1e1f20] flex flex-col h-full overflow-y-auto text-[#e3e3e3]">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#37393b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-[#a8c7fa]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#c4c7c5] font-sans">
            System Parameters
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[#a8c7fa] bg-[#282a2c] px-2 py-0.5 rounded-full border border-[#444746]">
          Go 1.23 · gRPC
        </span>
      </div>

      <div className="p-4 space-y-6">
        {/* System Preset Segmented Pill Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-[#c4c7c5] flex items-center justify-between">
            <span>Execution Profile</span>
            <span className="text-[#8e918f] font-mono text-[10px]">Preset</span>
          </label>
          <div className="p-1 rounded-full bg-[#131314] border border-[#37393b] flex items-center">
            <button
              onClick={() => handleApplyPreset('nominal')}
              className={`flex-1 py-1 px-2.5 rounded-full text-xs font-medium transition-all ${
                activePreset === 'nominal'
                  ? 'bg-[#37393b] text-[#a8c7fa] shadow-sm font-semibold'
                  : 'text-[#c4c7c5] hover:text-white'
              }`}
            >
              Nominal
            </button>
            <button
              onClick={() => handleApplyPreset('peak')}
              className={`flex-1 py-1 px-2.5 rounded-full text-xs font-medium transition-all ${
                activePreset === 'peak'
                  ? 'bg-[#37393b] text-[#a8c7fa] shadow-sm font-semibold'
                  : 'text-[#c4c7c5] hover:text-white'
              }`}
            >
              Peak (1.8M)
            </button>
            <button
              onClick={() => handleApplyPreset('stress')}
              className={`flex-1 py-1 px-2.5 rounded-full text-xs font-medium transition-all ${
                activePreset === 'stress'
                  ? 'bg-[#37393b] text-[#f2b8b5] shadow-sm font-semibold'
                  : 'text-[#c4c7c5] hover:text-white'
              }`}
            >
              Stress / Chaos
            </button>
          </div>
        </div>

        {/* Material 3 Slider with Numeric Input: Concurrency QPS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[#c4c7c5]">
              Target Edge Concurrency
            </label>
            <div className="flex items-center gap-1 font-mono text-xs text-[#a8c7fa] bg-[#131314] px-2 py-0.5 rounded-md border border-[#37393b]">
              <span>{(trafficQPS / 1_000_000).toFixed(2)}M</span>
              <span className="text-[#8e918f] text-[10px]">QPS</span>
            </div>
          </div>
          <input
            type="range"
            min={10000}
            max={2500000}
            step={25000}
            value={trafficQPS}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-[#131314] rounded-lg appearance-none cursor-pointer accent-[#a8c7fa]"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#8e918f]">
            <span>10k (Idle)</span>
            <span>1.25M (Standard)</span>
            <span>2.5M (Flash Sale)</span>
          </div>
        </div>

        {/* Global Cluster Region Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[#c4c7c5]">
            Primary Cluster Shard & Mesh
          </label>
          <div className="relative">
            <select
              value={selectedClusterRegion}
              onChange={(e) => setSelectedClusterRegion(e.target.value)}
              className="w-full appearance-none bg-[#131314] border border-[#37393b] rounded-lg px-3 py-2 text-xs text-[#e3e3e3] font-mono hover:border-[#444746] focus:outline-none focus:border-[#7cacf8] cursor-pointer"
            >
              <option value="global-mesh">Global Multi-Region Mesh (3 Shards)</option>
              <option value="us-east">US-East-1 (N. Virginia - Envoy)</option>
              <option value="eu-west">EU-West-1 (Frankfurt - Spanner)</option>
              <option value="ap-east">AP-East-1 (Tokyo - Redis Redlock)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8e918f]" />
          </div>
        </div>

        {/* Currency Settlement Rail */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[#c4c7c5] flex items-center justify-between">
            <span>Settlement Currency (FX Rate Lock)</span>
            <span className="text-[#a8c7fa] font-mono text-[10px]">10m Expiry</span>
          </label>
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="w-full appearance-none bg-[#131314] border border-[#37393b] rounded-lg px-3 py-2 text-xs text-[#e3e3e3] font-mono hover:border-[#444746] focus:outline-none focus:border-[#7cacf8] cursor-pointer"
            >
              {Object.keys(CURRENCY_RATES).map((code) => {
                const info = CURRENCY_RATES[code as CurrencyCode];
                return (
                  <option key={code} value={code}>
                    {code} ({info.symbol}) — {info.name} [Rate: {info.rateToUSD.toFixed(2)}]
                  </option>
                );
              })}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8e918f]" />
          </div>
        </div>

        {/* Chaos Engineering Fault Injection Section */}
        <div className="p-3.5 rounded-xl bg-[#131314] border border-[#37393b] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className={`h-3.5 w-3.5 ${chaosEnabled ? 'text-[#f2b8b5]' : 'text-[#8e918f]'}`} />
              <span className="text-xs font-semibold text-[#e3e3e3]">
                Chaos Engineering
              </span>
            </div>
            <button
              onClick={() => setChaosEnabled(!chaosEnabled)}
              className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border transition-colors ${
                chaosEnabled
                  ? 'bg-[#3b1219] text-[#f2b8b5] border-[#8c1d18]'
                  : 'bg-[#1e1f20] text-[#c4c7c5] border-[#444746]'
              }`}
            >
              {chaosEnabled ? 'Armed (Active)' : 'Disabled'}
            </button>
          </div>

          <p className="text-[11px] text-[#8e918f] leading-relaxed">
            Inject simulated network partitions, PSP timeout cascades, or Redis leader failovers to verify resilience.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => {
                setChaosEnabled(true);
                setChaosType('latency_spike');
              }}
              className={`p-2 rounded-lg border text-left transition-colors ${
                chaosEnabled && chaosType === 'latency_spike'
                  ? 'bg-[#282a2c] text-[#a8c7fa] border-[#7cacf8]'
                  : 'bg-[#1e1f20] text-[#c4c7c5] border-[#37393b] hover:border-[#444746]'
              }`}
            >
              <div className="text-[10px] text-[#8e918f]">Fault A</div>
              <div className="font-semibold truncate">PSP Latency +140ms</div>
            </button>

            <button
              onClick={() => {
                setChaosEnabled(true);
                setChaosType('redis_failover');
              }}
              className={`p-2 rounded-lg border text-left transition-colors ${
                chaosEnabled && chaosType === 'redis_failover'
                  ? 'bg-[#282a2c] text-[#a8c7fa] border-[#7cacf8]'
                  : 'bg-[#1e1f20] text-[#c4c7c5] border-[#37393b] hover:border-[#444746]'
              }`}
            >
              <div className="text-[10px] text-[#8e918f]">Fault B</div>
              <div className="font-semibold truncate">Redis Shard Failover</div>
            </button>
          </div>

          {chaosEnabled && (
            <button
              onClick={() => {
                setChaosEnabled(false);
                setChaosType('none');
                setTrafficQPS(1845000);
              }}
              className="w-full py-1.5 rounded-full text-xs font-medium text-[#c4c7c5] bg-[#1e1f20] hover:bg-[#282a2c] border border-[#37393b] transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="h-3 w-3 text-[#8e918f]" />
              <span>Reset Nominal Engine</span>
            </button>
          )}
        </div>

        {/* System Instructions / Metadata Note */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[#c4c7c5] flex items-center gap-1">
            <Info className="h-3 w-3 text-[#8e918f]" />
            <span>Architecture Specification</span>
          </label>
          <div className="p-3 rounded-lg bg-[#131314] border border-[#37393b] text-[11px] font-mono text-[#8e918f] space-y-1">
            <div className="flex justify-between">
              <span>Go Runtime:</span>
              <span className="text-[#e3e3e3]">v1.23.1 linux/amd64</span>
            </div>
            <div className="flex justify-between">
              <span>Serialization:</span>
              <span className="text-[#e3e3e3]">Protobuf v3 (gRPC)</span>
            </div>
            <div className="flex justify-between">
              <span>Isolation:</span>
              <span className="text-[#e3e3e3]">Serializable ACID</span>
            </div>
            <div className="flex justify-between">
              <span>Cache Strategy:</span>
              <span className="text-[#a8c7fa]">Redlock 3/5 Quorum</span>
            </div>
          </div>
        </div>

        {/* Quick Surge CTA */}
        <button
          onClick={triggerFlashSaleSpike}
          className="w-full py-2.5 px-4 rounded-full font-medium text-xs bg-gradient-to-r from-[#282a2c] to-[#1e1f20] hover:from-[#37393b] hover:to-[#282a2c] border border-[#37393b] text-[#d3e3fd] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Zap className="h-3.5 w-3.5 text-[#a8c7fa] animate-pulse" />
          <span>Simulate 2.5M Flash Surge</span>
        </button>
      </div>
    </aside>
  );
};
