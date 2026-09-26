import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  Terminal, 
  Layers, 
  Database, 
  X, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronDown,
  RefreshCw,
  Maximize2,
  FileCode,
  ArrowRight
} from 'lucide-react';

interface StudioRightInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioRightInspectorDrawer: React.FC<StudioRightInspectorDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { grpcLogs, bookings, redisKeys, metrics, trafficQPS } = usePlatform();
  const [activeInspectorTab, setActiveInspectorTab] = useState<'grpc' | 'outbox' | 'redlock' | 'json'>('grpc');
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedLogIndex, setSelectedLogIndex] = useState<number>(0);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const latestLog = grpcLogs[selectedLogIndex] || grpcLogs[0];

  const currentPayloadJSON = JSON.stringify(
    {
      telemetry: {
        timestamp: new Date().toISOString(),
        currentMeshQPS: trafficQPS,
        p99LatencyMs: 2.1,
        activeSLA: `${metrics.paymentSuccessRate}%`,
        activeClusterNodes: 6,
      },
      latestConfirmedTransaction: bookings[0] || null,
      topCacheKey: redisKeys[0] || null,
    },
    null,
    2
  );

  return (
    <aside className="w-[380px] shrink-0 border-l border-[#37393b] bg-[#1e1f20] flex flex-col h-full overflow-hidden text-[#e3e3e3] shadow-2xl z-30 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="h-14 px-4 border-b border-[#37393b] flex items-center justify-between bg-[#1e1f20]">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-[#a8c7fa]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#c4c7c5] font-sans">
            Inspector & Live Output
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleCopy(currentPayloadJSON)}
            className="p-1.5 rounded-full text-[#8e918f] hover:text-[#e3e3e3] hover:bg-[#282a2c] transition-colors"
            title="Copy Inspector State JSON"
          >
            {copied ? <Check className="h-4 w-4 text-[#a8c7fa]" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8e918f] hover:text-[#e3e3e3] hover:bg-[#282a2c] transition-colors"
            title="Close Inspector"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Pill-Style Tabs */}
      <div className="p-3 border-b border-[#37393b] bg-[#131314]">
        <div className="p-1 rounded-full bg-[#1e1f20] border border-[#37393b] flex items-center text-xs">
          <button
            onClick={() => setActiveInspectorTab('grpc')}
            className={`flex-1 py-1 px-2 rounded-full font-medium transition-all ${
              activeInspectorTab === 'grpc'
                ? 'bg-[#37393b] text-[#a8c7fa] font-semibold'
                : 'text-[#c4c7c5] hover:text-white'
            }`}
          >
            gRPC Stream
          </button>
          <button
            onClick={() => setActiveInspectorTab('outbox')}
            className={`flex-1 py-1 px-2 rounded-full font-medium transition-all ${
              activeInspectorTab === 'outbox'
                ? 'bg-[#37393b] text-[#a8c7fa] font-semibold'
                : 'text-[#c4c7c5] hover:text-white'
            }`}
          >
            Outbox WAL
          </button>
          <button
            onClick={() => setActiveInspectorTab('redlock')}
            className={`flex-1 py-1 px-2 rounded-full font-medium transition-all ${
              activeInspectorTab === 'redlock'
                ? 'bg-[#37393b] text-[#a8c7fa] font-semibold'
                : 'text-[#c4c7c5] hover:text-white'
            }`}
          >
            Redlock
          </button>
          <button
            onClick={() => setActiveInspectorTab('json')}
            className={`flex-1 py-1 px-2 rounded-full font-medium transition-all ${
              activeInspectorTab === 'json'
                ? 'bg-[#37393b] text-[#a8c7fa] font-semibold'
                : 'text-[#c4c7c5] hover:text-white'
            }`}
          >
            JSON Tree
          </button>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {/* Tab 1: gRPC Stream Log Lines */}
        {activeInspectorTab === 'grpc' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#8e918f]">
              <span>Stream Events ({grpcLogs.length})</span>
              <span className="text-[#a8c7fa]">HTTP/2 Multiplexed</span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {grpcLogs.slice(0, 15).map((log, index) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLogIndex(index)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedLogIndex === index
                      ? 'bg-[#282a2c] border-[#7cacf8] text-[#e3e3e3]'
                      : 'bg-[#131314] border-[#37393b] text-[#c4c7c5] hover:border-[#444746]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#8e918f]">{log.timestamp}</span>
                    <span className="text-[#a8c7fa] font-semibold">{log.latencyMs.toFixed(1)}ms</span>
                  </div>
                  <div className="mt-1 font-semibold text-white flex items-center gap-1.5">
                    <span className="text-[#a8c7fa]">{log.service}.</span>
                    <span>{log.method}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-[#8e918f] truncate">
                    {log.payloadSummary}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected gRPC Frame Payload Card */}
            {latestLog && (
              <div className="p-3 rounded-lg bg-[#131314] border border-[#37393b] space-y-2">
                <div className="flex items-center justify-between text-[10px] text-[#8e918f] uppercase">
                  <span>Frame Detail: {latestLog.method}</span>
                  <span className="text-[#6dd58c]">STATUS: {latestLog.status}</span>
                </div>
                <pre className="p-2 rounded bg-[#0e0e0e] text-[11px] text-[#d3e3fd] overflow-x-auto border border-[#282a2c]">
{`{
  "service": "${latestLog.service}",
  "rpc": "${latestLog.method}",
  "latency_ms": ${latestLog.latencyMs},
  "status_code": 0,
  "summary": "${latestLog.payloadSummary}"
}`}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Outbox CDC WAL events */}
        {activeInspectorTab === 'outbox' && (
          <div className="space-y-3">
            <div className="text-[11px] text-[#8e918f] flex items-center justify-between">
              <span>Kafka CDC Outbox Log</span>
              <span className="text-[#6dd58c]">100% Zero-Loss ACK</span>
            </div>

            <div className="space-y-2">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="p-2.5 rounded-lg bg-[#131314] border border-[#37393b] space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#a8c7fa] font-bold">BookingConfirmedEvent</span>
                    <span className="text-[#8e918f]">{b.createdAt.slice(11, 19)}</span>
                  </div>
                  <div className="text-white text-[11px] font-sans font-medium">
                    {b.bookingRef} · {b.route}
                  </div>
                  <div className="text-[10px] text-[#8e918f] truncate font-mono">
                    Idemp: {b.idempotencyKey}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Redlock concurrency tokens */}
        {activeInspectorTab === 'redlock' && (
          <div className="space-y-3">
            <div className="text-[11px] text-[#8e918f]">
              Active Redlock Mutex Holds
            </div>
            <div className="p-3 rounded-lg bg-[#131314] border border-[#37393b] space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8e918f]">Key:</span>
                <span className="text-[#a8c7fa]">lock:flight:fl-782:seat:14A</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8e918f]">Quorum Nodes:</span>
                <span className="text-[#6dd58c]">3 of 5 Shards</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8e918f]">Lock TTL Remaining:</span>
                <span className="text-[#f2b8b5]">284 seconds</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8e918f]">Algorithm:</span>
                <span className="text-[#c4c7c5]">SET key token NX PX 300000</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: JSON State Tree */}
        {activeInspectorTab === 'json' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#8e918f]">
              <span>Runtime State Object</span>
              <button
                onClick={() => handleCopy(currentPayloadJSON)}
                className="text-[#a8c7fa] hover:underline"
              >
                Copy Raw
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-[#131314] text-[#d3e3fd] text-[11px] leading-relaxed overflow-x-auto border border-[#37393b]">
              {currentPayloadJSON}
            </pre>
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-[#37393b] bg-[#1e1f20] flex items-center justify-between text-[11px] font-mono text-[#8e918f]">
        <span>Port: :50051 (gRPC HTTP/2)</span>
        <span className="text-[#6dd58c]">Active Polling</span>
      </div>
    </aside>
  );
};
