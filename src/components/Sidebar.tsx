import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { 
  Smartphone, 
  Cpu, 
  Layers, 
  Database, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  Terminal,
  Server
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenExport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onOpenExport,
}) => {
  const { activeTab, setActiveTab, trafficQPS, chaosEnabled, chaosType } = usePlatform();

  const navItems = [
    {
      id: 'mobile',
      label: 'React Native Mobile',
      category: 'Client Layer',
      icon: Smartphone,
      badge: 'v4.2',
      badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-800/60',
    },
    {
      id: 'microservices',
      label: 'Go Microservices',
      category: 'Compute & Mesh',
      icon: Cpu,
      badge: 'Go 1.23',
      badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-800/60',
    },
    {
      id: 'redis',
      label: 'Redis & Redlock',
      category: 'In-Memory Cache',
      icon: Layers,
      badge: '98.6% Hit',
      badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-800/60',
    },
    {
      id: 'database',
      label: 'Distributed Spanner',
      category: 'Storage Tier',
      icon: Database,
      badge: 'Geo-Sharded',
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60',
    },
    {
      id: 'analytics',
      label: 'Financial & Ledger',
      category: 'Observability',
      icon: BarChart3,
      badge: 'PCI-DSS',
      badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800/60',
    },
  ] as const;

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 bg-[#0b0f19] border-r border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-[256px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-cyan-500/20">
              AG
            </div>
            <div className="truncate">
              <span className="text-sm font-bold tracking-tight text-white block">
                AeroGlobal
              </span>
              <span className="text-[10px] font-mono text-slate-400 block tracking-wider uppercase">
                CTO Platform v4
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-cyan-500/20">
            AG
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors ${
            collapsed ? 'mx-auto mt-2 hidden' : ''
          }`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Architecture Layers
            </div>
          )}

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-slate-800/90 text-white border border-slate-700/80 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Subtle active vertical indicator pill */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyan-400 shadow-sm shadow-cyan-400" />
                  )}

                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />

                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between text-left truncate">
                      <span className="truncate">{item.label}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Health Status Widget */}
        {!collapsed && (
          <div className="p-3 rounded-xl bg-[#090d16] border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${chaosEnabled ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span>Engine State</span>
              </span>
              <span className={`font-bold ${chaosEnabled ? 'text-amber-400' : 'text-emerald-400'}`}>
                {chaosEnabled ? 'CHAOS INJECTED' : 'NOMINAL (100%)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
              <span>Traffic Load:</span>
              <span className="text-slate-300 font-semibold tabular-nums">
                {(trafficQPS / 1_000_000).toFixed(2)}M req/s
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer controls & collapse button */}
      <div className="p-3 border-t border-slate-800/80 bg-[#090d16]/60 space-y-2">
        {collapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-full flex justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {!collapsed && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-2">
            <span>Cluster Quorum: 3/5</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        )}
      </div>
    </aside>
  );
};
