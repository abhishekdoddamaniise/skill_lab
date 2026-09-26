import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Zap, 
  DollarSign, 
  ArrowUpRight,
  Database,
  Server
} from 'lucide-react';

export const MetricScorecards: React.FC = () => {
  const { metrics, trafficQPS, chaosEnabled, chaosType } = usePlatform();

  const isDegraded = chaosEnabled && (chaosType === 'latency_spike' || chaosType === 'redis_failover');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Scorecard 1: Gross Merchandise Value */}
      <div className="relative rounded-xl bg-[#1e1f20] border border-[#37393b] p-4 transition-all duration-200 hover:border-[#444746] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-medium tracking-wide uppercase text-[#c4c7c5]">
            Gross Merchandise Value
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#6dd58c] bg-[#1c2e22] px-2 py-0.5 rounded-full border border-[#2b4c34]">
            <ArrowUpRight className="h-3 w-3" />
            <span>+14.8%</span>
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-[28px] lg:text-[30px] font-bold font-mono tracking-tight text-white tabular-nums">
            ${(metrics.gmvUSD / 1_000_000).toFixed(2)}M
          </div>
          {/* Inline Micro Sparkline SVG in Gemini Electric Blue */}
          <svg className="w-16 h-7 text-[#a8c7fa]" viewBox="0 0 64 24" fill="none">
            <path
              d="M2 18 L12 15 L22 17 L32 10 L42 12 L52 6 L62 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 18 L12 15 L22 17 L32 10 L42 12 L52 6 L62 4 L62 24 L2 24 Z"
              fill="currentColor"
              className="opacity-15"
            />
          </svg>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#37393b] flex items-center justify-between text-[11px] font-mono text-[#8e918f]">
          <span>Take: ${(metrics.netRevenueUSD / 1_000_000).toFixed(2)}M (8.4%)</span>
          <span className="text-[#a8c7fa]">Run rate: $578M</span>
        </div>
      </div>

      {/* Scorecard 2: Concurrency & QPS */}
      <div className="relative rounded-xl bg-[#1e1f20] border border-[#37393b] p-4 transition-all duration-200 hover:border-[#444746] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-medium tracking-wide uppercase text-[#c4c7c5]">
            Real-Time Edge QPS
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#a8c7fa] bg-[#0c1f38] px-2 py-0.5 rounded-full border border-[#1b3d68]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8c7fa] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#a8c7fa]"></span>
            </span>
            <span>Live Mesh</span>
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-[28px] lg:text-[30px] font-bold font-mono tracking-tight text-[#a8c7fa] tabular-nums">
            {(trafficQPS / 1_000_000).toFixed(2)}M
          </div>
          {/* Wave sparkline */}
          <svg className="w-16 h-7 text-[#d3e3fd]" viewBox="0 0 64 24" fill="none">
            <path
              d="M2 12 C10 4, 18 20, 26 12 C34 4, 42 20, 50 10 L62 8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#37393b] flex items-center justify-between text-[11px] font-mono text-[#8e918f]">
          <span>Users: {(metrics.activeUsers / 1_000_000).toFixed(2)}M</span>
          <span className="text-[#a8c7fa]">p99: 2.1ms</span>
        </div>
      </div>

      {/* Scorecard 3: Payment SLA & Clearing */}
      <div className="relative rounded-xl bg-[#1e1f20] border border-[#37393b] p-4 transition-all duration-200 hover:border-[#444746] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-medium tracking-wide uppercase text-[#c4c7c5]">
            Settlement SLA
          </span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
            isDegraded 
              ? 'text-[#f2b8b5] bg-[#3b1219] border-[#8c1d18]' 
              : 'text-[#6dd58c] bg-[#1c2e22] border-[#2b4c34]'
          }`}>
            <ShieldCheck className="h-3 w-3" />
            <span>{metrics.paymentSuccessRate}% SLA</span>
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-[28px] lg:text-[30px] font-bold font-mono tracking-tight text-[#6dd58c] tabular-nums">
            {metrics.totalBookings.toLocaleString()}
          </div>
          {/* Steady line sparkline */}
          <svg className="w-16 h-7 text-[#6dd58c]" viewBox="0 0 64 24" fill="none">
            <path
              d="M2 14 L14 12 L26 12 L38 9 L50 8 L62 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#37393b] flex items-center justify-between text-[11px] font-mono text-[#8e918f]">
          <span>Chargeback: {metrics.chargebackRate}%</span>
          <span className="text-[#e3e3e3]">PCI-DSS Level 1</span>
        </div>
      </div>

      {/* Scorecard 4: Cache Hit & In-Memory Store */}
      <div className="relative rounded-xl bg-[#1e1f20] border border-[#37393b] p-4 transition-all duration-200 hover:border-[#444746] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-medium tracking-wide uppercase text-[#c4c7c5]">
            Redis L1/L2 Cache Hit
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d3e3fd] bg-[#282a2c] px-2 py-0.5 rounded-full border border-[#444746]">
            <Server className="h-3 w-3 text-[#a8c7fa]" />
            <span>6 Shards</span>
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-[28px] lg:text-[30px] font-bold font-mono tracking-tight text-white tabular-nums">
            98.6%
          </div>
          <svg className="w-16 h-7 text-[#a8c7fa]" viewBox="0 0 64 24" fill="none">
            <path
              d="M2 16 L12 14 L24 10 L36 10 L48 8 L62 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#37393b] flex items-center justify-between text-[11px] font-mono text-[#8e918f]">
          <span>Avg Lock: 480µs (Redlock)</span>
          <span className="text-[#6dd58c]">0 Miss Cascades</span>
        </div>
      </div>
    </div>
  );
};
