import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Layers, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Database, 
  Clock, 
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface ConcurrentContender {
  id: string;
  clientId: string;
  timestamp: string;
  status: 'acquired' | 'rejected' | 'pending';
  lockNode: string;
  latencyMicros: number;
}

export const RedisVisualizer: React.FC = () => {
  const { redisKeys, trafficQPS, chaosEnabled, triggerFlashSaleSpike } = usePlatform();
  const [activeTab, setActiveTab] = useState<'cluster' | 'hotkeys' | 'redlock'>('redlock');

  // Redlock concurrency simulator state
  const [isSimulatingRace, setIsSimulatingRace] = useState<boolean>(false);
  const [contenders, setContenders] = useState<ConcurrentContender[]>([
    {
      id: 'c-1',
      clientId: 'mobile_ios_usr_9021',
      timestamp: '21:50:01.002',
      status: 'acquired',
      lockNode: 'redis-shard-01a',
      latencyMicros: 480,
    },
    {
      id: 'c-2',
      clientId: 'mobile_android_usr_4412',
      timestamp: '21:50:01.003',
      status: 'rejected',
      lockNode: 'redis-shard-01a',
      latencyMicros: 510,
    },
    {
      id: 'c-3',
      clientId: 'web_client_usr_8819',
      timestamp: '21:50:01.004',
      status: 'rejected',
      lockNode: 'redis-shard-01a',
      latencyMicros: 490,
    },
  ]);

  const runRedlockRaceSimulation = async () => {
    setIsSimulatingRace(true);
    setContenders([]);

    const clients = [
      'mobile_ios_tokyo_u89',
      'mobile_android_sfo_u12',
      'web_react_paris_u44',
      'agent_api_bot_u99',
      'mobile_ios_london_u03',
      'web_safari_zurich_u77',
      'mobile_android_sing_u55',
    ];

    const generated: ConcurrentContender[] = [];
    for (let i = 0; i < clients.length; i++) {
      const isWinner = i === 0;
      generated.push({
        id: `race-${Date.now()}-${i}`,
        clientId: clients[i],
        timestamp: `21:50:04.${(100 + i * 2).toString()}`,
        status: isWinner ? 'acquired' : 'rejected',
        lockNode: 'redis-shard-01a (Leader)',
        latencyMicros: 420 + Math.floor(Math.random() * 200),
      });
    }

    await new Promise((r) => setTimeout(r, 300));
    setContenders(generated);
    setIsSimulatingRace(false);
  };

  const shards = [
    { id: 'shard-01', region: 'US-East (N. Virginia)', role: 'Master + 2 Replicas', keysCount: '4.2M', opsSec: '620k', memory: '18.4 GB / 32 GB' },
    { id: 'shard-02', region: 'EU-Central (Frankfurt)', role: 'Master + 2 Replicas', keysCount: '3.8M', opsSec: '540k', memory: '16.1 GB / 32 GB' },
    { id: 'shard-03', region: 'AP-East (Tokyo)', role: 'Master + 2 Replicas', keysCount: '4.9M', opsSec: '685k', memory: '21.0 GB / 32 GB' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-cyan-400">
              REDIS L1/L2 IN-MEMORY CLUSTER & DISTRIBUTED LOCKS
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-emerald-400 font-mono">
              98.6% Cache Hit Ratio
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Sub-Millisecond Inventory Caching & Redlock
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Protects the persistent database against flash-sale traffic surges.
            Redis handles seat bitmasks, dynamic pricing surge cache, and atomic distributed holds (SET NX PX)
            preventing double bookings with sub-millisecond serialization.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('redlock')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'redlock'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Redlock Concurrency
          </button>
          <button
            onClick={() => setActiveTab('cluster')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'cluster'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cluster Topology
          </button>
          <button
            onClick={() => setActiveTab('hotkeys')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'hotkeys'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hot Keys
          </button>
        </div>
      </div>

      {/* Primary Tab: Redlock Concurrency Resolver */}
      {activeTab === 'redlock' && (
        <div className="space-y-6">
          {/* Explanatory Architecture Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">
                    Redis Redlock Algorithm (Race Condition Shield)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  When 100,000 users compete for the final seat (14A), Redlock executes an atomic
                  <code className="text-cyan-400 font-mono ml-1">SET key token NX PX 300000</code> command.
                  Only one thread acquires the lock; all other concurrent requests receive immediate rejection in &lt;1ms.
                </p>
              </div>

              <button
                onClick={runRedlockRaceSimulation}
                disabled={isSimulatingRace}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                <Play className={`h-3.5 w-3.5 fill-current ${isSimulatingRace ? 'animate-spin' : ''}`} />
                <span>Simulate 7 Concurrent Requests (Seat 14A)</span>
              </button>
            </div>

            {/* Visual Redlock Mechanism Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block">Step 1: Atomic NX Check</span>
                <p className="text-slate-300 text-[11px]">
                  Redis checks if key exists. Evaluates in single-threaded event loop (zero race conditions).
                </p>
                <div className="text-[10px] text-slate-500 font-mono">Cost: O(1) · 0.4ms</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block">Step 2: Quorum Validation</span>
                <p className="text-slate-300 text-[11px]">
                  Requires majority confirmation across 3 of 5 independent Redis master nodes before ACK.
                </p>
                <div className="text-[10px] text-slate-500 font-mono">Quorum: 3/5 · Drift Tolerant</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block">Step 3: Auto-Release TTL</span>
                <p className="text-slate-300 text-[11px]">
                  Key automatically expires after 300s if user abandons checkout, returning seat to inventory.
                </p>
                <div className="text-[10px] text-emerald-400 font-mono">Zero Zombie Locks</div>
              </div>
            </div>
          </div>

          {/* Real-time Race Simulation Results */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Concurrent Lock Contention Telemetry (Key: lock:flight:fl-782:seat:14A)
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                Resolution: Atomic Mutual Exclusion
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Contending Client ID</th>
                    <th className="py-2.5 px-4">Arrival Timestamp</th>
                    <th className="py-2.5 px-4">Lock Shard</th>
                    <th className="py-2.5 px-4">Resolution Latency</th>
                    <th className="py-2.5 px-4">Redlock Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {contenders.map((c) => {
                    const isWinner = c.status === 'acquired';
                    return (
                      <tr
                        key={c.id}
                        className={`transition-colors ${
                          isWinner ? 'bg-cyan-950/30' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2.5 px-4 text-slate-200 font-semibold">{c.clientId}</td>
                        <td className="py-2.5 px-4 text-slate-400">{c.timestamp}</td>
                        <td className="py-2.5 px-4 text-slate-400">{c.lockNode}</td>
                        <td className="py-2.5 px-4 text-cyan-400 tabular-nums">
                          {c.latencyMicros} µs (0.{c.latencyMicros}ms)
                        </td>
                        <td className="py-2.5 px-4">
                          {isWinner ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>LOCK ACQUIRED (WINNER)</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1 w-fit">
                              <AlertCircle className="h-3 w-3" />
                              <span>REJECTED (409 CONFLICT)</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cluster Shards Tab */}
      {activeTab === 'cluster' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shards.map((s, idx) => {
            // Memory percentages for visual meter
            const memPercentages = [57.5, 50.3, 65.6];
            const pct = memPercentages[idx] || 55;

            return (
              <div key={s.id} className="p-5 rounded-xl bg-[#0e1422] border border-slate-800/80 space-y-3 shadow-md hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white font-mono">{s.id}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 font-semibold">
                    HEALTHY
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium">{s.region}</div>
                <div className="text-[11px] text-slate-500 font-mono">{s.role}</div>

                {/* Real-time Memory Usage Progress Meter */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">RAM Allocation ({pct}%)</span>
                    <span className="text-slate-200">{s.memory}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Keys</span>
                    <span className="text-slate-200 font-semibold">{s.keysCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Ops / Sec</span>
                    <span className="text-cyan-400 font-semibold">{s.opsSec}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hot Keys Tab */}
      {activeTab === 'hotkeys' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Top Active L1 / L2 Hot Keys in Cluster
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Eviction: volatile-lru
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Key Name</th>
                  <th className="py-2.5 px-4">Data Type</th>
                  <th className="py-2.5 px-4">Hosting Node</th>
                  <th className="py-2.5 px-4">TTL</th>
                  <th className="py-2.5 px-4">Reads / Sec</th>
                  <th className="py-2.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {redisKeys.map((k) => (
                  <tr key={k.key} className="hover:bg-slate-800/50">
                    <td className="py-2.5 px-4 text-cyan-400 font-bold">{k.key}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                        {k.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">{k.node}</td>
                    <td className="py-2.5 px-4 text-amber-400">{k.ttlSeconds}s</td>
                    <td className="py-2.5 px-4 text-white font-semibold">
                      {(k.hitsPerSec / 1000).toFixed(1)}k
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 truncate max-w-xs">{k.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
