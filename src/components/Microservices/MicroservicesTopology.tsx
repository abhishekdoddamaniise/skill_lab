import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { MicroserviceNode } from '../../types';
import { 
  Cpu, 
  Layers, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Server,
  Network,
  Clock,
  Zap
} from 'lucide-react';

export const MicroservicesTopology: React.FC = () => {
  const { microservices, trafficQPS, chaosEnabled } = usePlatform();
  const [selectedService, setSelectedService] = useState<MicroserviceNode>(microservices[1]); // inventory-service

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1e1f20] border border-[#37393b]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#a8c7fa]">
              GO MICROSERVICES ARCHITECTURE
            </span>
            <span className="text-[#8e918f]">·</span>
            <span className="text-xs text-[#6dd58c] font-mono">
              6 Active Daemons · gRPC HTTP/2 Mesh
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Distributed High-Throughput Service Mesh Topology
          </h2>
          <p className="text-xs text-[#c4c7c5] mt-1 max-w-2xl">
            Compiled with Go 1.23 using native goroutines, low-allocation protobuf serializers,
            and bidirectional streaming channels handling millions of concurrent requests with sub-5ms P99 latency.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#131314] p-3 rounded-xl border border-[#37393b] font-mono text-xs">
          <div>
            <span className="text-[#8e918f] block text-[10px] uppercase">TOTAL MESH QPS</span>
            <span className="text-[#a8c7fa] font-bold tabular-nums">
              {(trafficQPS / 1000000).toFixed(2)}M / sec
            </span>
          </div>
          <div className="h-7 w-px bg-[#37393b]" />
          <div>
            <span className="text-[#8e918f] block text-[10px] uppercase">SYSTEM STATUS</span>
            <span className={`font-bold ${chaosEnabled ? 'text-[#ffcc80]' : 'text-[#6dd58c]'}`}>
              {chaosEnabled ? 'CHAOS INJECTED' : 'NOMINAL (100%)'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Glowing SVG Node Topology Visualizer with Animated Particles */}
      <div className="p-5 rounded-xl bg-[#0e1422] border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-cyan-400" />
            <span className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Active gRPC Request Stream Mesh (Live Pulses)
            </span>
          </div>
          <span className="text-slate-500">Click any node to inspect telemetry</span>
        </div>

        <div className="relative rounded-xl bg-[#080c14] border border-slate-800/80 p-4 overflow-hidden">
          <svg className="w-full h-48 select-none" viewBox="0 0 900 190" fill="none">
            {/* Flow Connecting Lines with Glowing Gradient */}
            <defs>
              <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Edge to Core Services */}
            <path d="M 120 95 C 200 40, 260 40, 360 45" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 120 95 C 200 95, 260 95, 360 95" stroke="url(#streamGrad)" strokeWidth="2.5" />
            <path d="M 120 95 C 200 150, 260 150, 360 145" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

            {/* Core to Downstream */}
            <path d="M 520 45 C 600 45, 640 85, 740 95" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 520 95 C 600 95, 640 95, 740 95" stroke="url(#streamGrad)" strokeWidth="2.5" />
            <path d="M 520 145 C 600 145, 640 105, 740 95" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

            {/* Animated Stream Particles */}
            <circle r="4" fill="#22d3ee">
              <animateMotion
                path="M 120 95 C 200 95, 260 95, 360 95"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="3.5" fill="#818cf8">
              <animateMotion
                path="M 120 95 C 200 40, 260 40, 360 45"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="3.5" fill="#34d399">
              <animateMotion
                path="M 520 95 C 600 95, 640 95, 740 95"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Node 1: api-edge-proxy */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedService(microservices[0])}
            >
              <rect x="30" y="65" width="160" height="60" rx="10" fill="#0e1422" stroke={selectedService.id === 'api-gateway' ? '#22d3ee' : '#334155'} strokeWidth="1.5" />
              <circle cx="50" cy="95" r="5" fill="#10b981" />
              <text x="66" y="90" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">api-edge-proxy</text>
              <text x="66" y="106" fill="#94a3b8" fontSize="10" fontFamily="monospace">Envoy / Go 1.23</text>
            </g>

            {/* Node 2: dynamic-pricing */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedService(microservices[4])}
            >
              <rect x="360" y="15" width="160" height="60" rx="10" fill="#0e1422" stroke={selectedService.id === 'pricing-service' ? '#22d3ee' : '#334155'} strokeWidth="1.5" />
              <circle cx="380" cy="45" r="5" fill="#10b981" />
              <text x="396" y="40" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">dynamic-pricing</text>
              <text x="396" y="56" fill="#94a3b8" fontSize="10" fontFamily="monospace">1.1ms · 450k QPS</text>
            </g>

            {/* Node 3: inventory-service */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedService(microservices[1])}
            >
              <rect x="360" y="65" width="160" height="60" rx="10" fill="#0e1422" stroke={selectedService.id === 'inventory-service' ? '#22d3ee' : '#334155'} strokeWidth="1.5" />
              <circle cx="380" cy="95" r="5" fill="#22d3ee" className="animate-pulse" />
              <text x="396" y="90" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">inventory-service</text>
              <text x="396" y="106" fill="#22d3ee" fontSize="10" fontFamily="monospace">1.2ms · 840k QPS</text>
            </g>

            {/* Node 4: booking-engine */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedService(microservices[2])}
            >
              <rect x="360" y="115" width="160" height="60" rx="10" fill="#0e1422" stroke={selectedService.id === 'booking-engine' ? '#22d3ee' : '#334155'} strokeWidth="1.5" />
              <circle cx="380" cy="145" r="5" fill="#10b981" />
              <text x="396" y="140" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">booking-engine</text>
              <text x="396" y="156" fill="#94a3b8" fontSize="10" fontFamily="monospace">2.4ms · Saga Go</text>
            </g>

            {/* Node 5: payment-gateway */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedService(microservices[3])}
            >
              <rect x="680" y="65" width="170" height="60" rx="10" fill="#0e1422" stroke={selectedService.id === 'payment-service' ? '#22d3ee' : '#334155'} strokeWidth="1.5" />
              <circle cx="700" cy="95" r="5" fill="#10b981" />
              <text x="716" y="90" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">payment-gateway</text>
              <text x="716" y="106" fill="#94a3b8" fontSize="10" fontFamily="monospace">PCI-DSS · Multi-FX</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Grid of Microservices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {microservices.map((svc) => {
          const isSelected = selectedService.id === svc.id;
          const isDegraded = svc.status !== 'healthy';

          return (
            <div
              key={svc.id}
              onClick={() => setSelectedService(svc)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Service Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        isDegraded ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                      }`}
                    />
                    <h3 className="text-sm font-bold text-white font-mono">{svc.name}</h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                    :{svc.port}
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-400 line-clamp-2">
                  {svc.description}
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Avg Latency</span>
                  <span className="text-slate-200 font-semibold">{svc.avgLatencyMs}ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">P99 Latency</span>
                  <span className={svc.p99LatencyMs > 5 ? 'text-amber-400 font-semibold' : 'text-slate-200 font-semibold'}>
                    {svc.p99LatencyMs}ms
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Throughput</span>
                  <span className="text-cyan-400 font-semibold">
                    {(svc.qps / 1000).toFixed(0)}k QPS
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Microservice Deep-Dive Inspection */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-mono">
                Service Inspector: {selectedService.name}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Compiled runtime: <span className="text-slate-200 font-mono">{selectedService.runtime}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-500">Protocol:</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {selectedService.protocol}
            </span>
          </div>
        </div>

        {/* Node Performance Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Error Rate</span>
            <span className="text-base font-bold font-mono text-emerald-400">
              {(selectedService.errorRate * 100).toFixed(3)}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Active Goroutines</span>
            <span className="text-base font-bold font-mono text-cyan-400">
              {Math.round(selectedService.qps / 180).toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">P99 SLA Guarantee</span>
            <span className="text-base font-bold font-mono text-slate-200">
              &lt; 10.0 ms
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">GC Pause Time</span>
            <span className="text-base font-bold font-mono text-emerald-400">
              0.18 ms (Go 1.23)
            </span>
          </div>
        </div>

        {/* Downstream Dependencies */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-slate-300 font-mono uppercase block mb-2">
            gRPC Dependency Links
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedService.dependencies.length === 0 ? (
              <span className="text-xs text-slate-500 font-mono">Terminal event consumer (No downstream calls)</span>
            ) : (
              selectedService.dependencies.map((dep) => (
                <div
                  key={dep}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                >
                  <ArrowRight className="h-3 w-3 text-cyan-400" />
                  <span>{dep}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
