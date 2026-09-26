import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { GRPC_METHODS } from '../../data/mockData';
import { GrpcMethod } from '../../types';
import { 
  Play, 
  Terminal, 
  Code2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';

export const GrpcStreamInspector: React.FC = () => {
  const { grpcLogs, addGrpcLog, chaosEnabled } = usePlatform();
  const [selectedMethod, setSelectedMethod] = useState<GrpcMethod>(GRPC_METHODS[0]);
  const [activeCodeTab, setActiveCodeTab] = useState<'proto' | 'go'>('proto');
  const [copied, setCopied] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<boolean>(false);

  const handleExecuteRpc = async () => {
    setIsCalling(true);
    const latency = chaosEnabled ? 18.4 : Number((1.2 + Math.random() * 2.2).toFixed(2));
    await new Promise((r) => setTimeout(r, 120));

    addGrpcLog({
      service: selectedMethod.service,
      method: selectedMethod.name,
      status: 'OK',
      latencyMs: latency,
      payloadSummary: `interactive_call req=${selectedMethod.requestType} resp=${selectedMethod.responseType}`,
    });
    setIsCalling(false);
  };

  const handleCopyCode = () => {
    const textToCopy = activeCodeTab === 'proto' ? selectedMethod.protoDefinition : selectedMethod.goCode;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-cyan-400">
              gRPC PROTOBUF INSPECTOR & GO STREAM BENCH
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-emerald-400 font-mono">
              HTTP/2 Multiplexing
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Real-Time RPC Stream Diagnostics
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Test unary and bidirectional server-streaming RPCs directly against the Go backend cluster.
            Inspect protobuf schemas, memory allocations, and execution latencies.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleExecuteRpc}
          disabled={isCalling}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
        >
          <Play className={`h-3.5 w-3.5 fill-current ${isCalling ? 'animate-spin' : ''}`} />
          <span>{isCalling ? 'Streaming RPC...' : 'Execute Test RPC'}</span>
        </button>
      </div>

      {/* Main Workbench: Method Selector + Code View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Method Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono block">
            Available Microservice Methods
          </label>
          <div className="space-y-2">
            {GRPC_METHODS.map((m) => {
              const isSelected = selectedMethod.name === m.name;
              return (
                <div
                  key={m.name}
                  onClick={() => setSelectedMethod(m)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{m.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        m.type === 'server_streaming'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {m.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {m.description}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-2 flex items-center gap-1">
                    <span>{m.service}</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                    <span>{m.responseType}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Payload Inspector */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 font-mono uppercase block">
              Sample Request Payload
            </span>
            <pre className="p-2.5 rounded-lg bg-slate-950 text-[11px] font-mono text-cyan-300 overflow-x-auto border border-slate-800/80">
              {JSON.stringify(selectedMethod.sampleRequest, null, 2)}
            </pre>
          </div>
        </div>

        {/* Right: Code Viewer (Protobuf Schema / Go 1.23 Implementation) - Monokai / VS Code Theme */}
        <div className="lg:col-span-2 rounded-xl bg-[#0e1422] border border-slate-800/80 overflow-hidden flex flex-col shadow-xl">
          {/* VS Code / Terminal Title Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-[#070a12]">
            <div className="flex items-center gap-3">
              {/* macOS / VS Code window dots */}
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {activeCodeTab === 'proto' ? `${selectedMethod.service.toLowerCase()}.v1.proto` : `${selectedMethod.service.toLowerCase()}_server.go`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveCodeTab('proto')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  activeCodeTab === 'proto'
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="h-3 w-3" />
                <span>Proto3</span>
              </button>
              <button
                onClick={() => setActiveCodeTab('go')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  activeCodeTab === 'go'
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="h-3 w-3" />
                <span>Go 1.23</span>
              </button>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors ml-1"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Monokai-styled Code Block */}
          <div className="p-4 flex-1 bg-[#0b0f19] font-mono text-xs text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed selection:bg-cyan-500/30">
            <pre className="text-slate-200">
              {activeCodeTab === 'proto' ? selectedMethod.protoDefinition : selectedMethod.goCode}
            </pre>
          </div>
        </div>
      </div>

      {/* Live Stream Telemetry Log Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white uppercase tracking-wider">
              Live gRPC Call Stream Logs (Last 50 events)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            HTTP/2 Bidirectional Multiplexing
          </span>
        </div>

        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Service</th>
                <th className="py-2.5 px-4">Method</th>
                <th className="py-2.5 px-4">Latency</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Payload Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {grpcLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-2 px-4 text-slate-500">{log.timestamp}</td>
                  <td className="py-2 px-4 text-cyan-400 font-semibold">{log.service}</td>
                  <td className="py-2 px-4 text-slate-300">{log.method}</td>
                  <td className="py-2 px-4 tabular-nums">
                    <span
                      className={
                        log.latencyMs > 10
                          ? 'text-amber-400'
                          : log.latencyMs > 5
                          ? 'text-yellow-400'
                          : 'text-emerald-400'
                      }
                    >
                      {log.latencyMs.toFixed(2)} ms
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-slate-400 truncate max-w-xs">
                    {log.payloadSummary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
