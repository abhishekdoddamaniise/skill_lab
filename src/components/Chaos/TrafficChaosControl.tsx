import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Zap, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Flame, 
  ShieldCheck, 
  Radio,
  Sliders
} from 'lucide-react';

export const TrafficChaosControl: React.FC = () => {
  const { 
    trafficQPS, 
    setTrafficQPS, 
    chaosEnabled, 
    setChaosEnabled, 
    chaosType, 
    setChaosType, 
    triggerFlashSaleSpike 
  } = usePlatform();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrafficQPS(Number(e.target.value));
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      setTrafficQPS(Math.max(10000, Math.min(2500000, val)));
    }
  };

  const isExtremeSurge = trafficQPS >= 2_000_000;
  const isHighLoad = trafficQPS >= 1_000_000 && trafficQPS < 2_000_000;

  return (
    <div className="p-5 rounded-2xl bg-[#1e1f20] border border-[#37393b] space-y-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#37393b] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-[#a8c7fa]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#c4c7c5] font-sans">
            Traffic Simulation & Chaos Engine
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#8e918f]">Status:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full font-semibold border text-xs ${
              isExtremeSurge
                ? 'bg-[#3b1219] text-[#f2b8b5] border-[#8c1d18]'
                : isHighLoad
                ? 'bg-[#3e2723] text-[#ffcc80] border-[#8d6e63]'
                : 'bg-[#1c2e22] text-[#6dd58c] border-[#2b4c34]'
            }`}
          >
            {(trafficQPS / 1_000_000).toFixed(2)}M QPS ·{' '}
            {isExtremeSurge ? 'Critical Peak' : isHighLoad ? 'Elevated Surge' : 'Nominal'}
          </span>
        </div>
      </div>

      {/* Material 3 Slider with Numeric Input */}
      <div className="p-4 rounded-xl bg-[#131314] border border-[#37393b] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-medium text-[#c4c7c5]">
            Target Edge Concurrency (10,000 – 2,500,000 QPS)
          </label>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs text-[#8e918f]">Raw QPS:</span>
            <input
              type="number"
              min={10000}
              max={2500000}
              step={10000}
              value={trafficQPS}
              onChange={handleNumericInputChange}
              className="w-32 px-3 py-1 text-xs font-mono font-bold bg-[#1e1f20] border border-[#37393b] rounded-lg text-[#a8c7fa] focus:outline-none focus:border-[#7cacf8] text-right"
            />
          </div>
        </div>

        <input
          type="range"
          min={10000}
          max={2500000}
          step={20000}
          value={trafficQPS}
          onChange={handleSliderChange}
          className="w-full h-2 bg-[#282a2c] rounded-lg appearance-none cursor-pointer accent-[#a8c7fa]"
        />

        <div className="flex justify-between text-[11px] font-mono text-[#8e918f]">
          <span className="text-[#6dd58c]">● 10k QPS (Baseline)</span>
          <span className="text-[#ffcc80]">● 1.0M QPS (Warning)</span>
          <span className="text-[#f2b8b5]">● 2.5M QPS (Flash Stress)</span>
        </div>
      </div>

      {/* Gemini-Style Action Pill Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* Flash Sale Pill */}
        <button
          onClick={triggerFlashSaleSpike}
          className="py-2.5 px-4 rounded-full bg-[#a8c7fa] hover:bg-[#7cacf8] text-[#040e25] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Flame className="h-4 w-4 fill-current animate-bounce" />
          <span>Simulate 2.5M Surge</span>
        </button>

        {/* Latency Spike Pill */}
        <button
          onClick={() => {
            setChaosEnabled(true);
            setChaosType('latency_spike');
          }}
          className={`py-2.5 px-4 rounded-full text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
            chaosEnabled && chaosType === 'latency_spike'
              ? 'bg-[#3b1219] text-[#f2b8b5] border-[#8c1d18]'
              : 'border-[#747775] text-[#e3e2e6] hover:bg-[#282a2c]'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-[#ffcc80]" />
          <span>Inject PSP Spike (+140ms)</span>
        </button>

        {/* Redis Node Failover Pill */}
        <button
          onClick={() => {
            setChaosEnabled(true);
            setChaosType('redis_failover');
          }}
          className={`py-2.5 px-4 rounded-full text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
            chaosEnabled && chaosType === 'redis_failover'
              ? 'bg-[#3b1219] text-[#f2b8b5] border-[#8c1d18]'
              : 'border-[#747775] text-[#e3e2e6] hover:bg-[#282a2c]'
          }`}
        >
          <Radio className="h-3.5 w-3.5 text-[#f2b8b5]" />
          <span>Redis Shard Failover</span>
        </button>

        {/* Reset / Recover Pill */}
        <button
          onClick={() => {
            setChaosEnabled(false);
            setChaosType('none');
            setTrafficQPS(1845000);
          }}
          className="py-2.5 px-4 rounded-full border border-[#747775] text-[#e3e2e6] hover:bg-[#282a2c] text-xs font-medium flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#8e918f]" />
          <span>Reset Nominal State</span>
        </button>
      </div>
    </div>
  );
};

