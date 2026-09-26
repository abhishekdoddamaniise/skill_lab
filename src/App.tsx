import React, { useState } from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { StudioHeader } from './components/Studio/StudioHeader';
import { StudioLeftControlPanel } from './components/Studio/StudioLeftControlPanel';
import { StudioRightInspectorDrawer } from './components/Studio/StudioRightInspectorDrawer';
import { MetricScorecards } from './components/MetricScorecards';
import { MobilePhoneSimulator } from './components/MobileApp/MobilePhoneSimulator';
import { MicroservicesTopology } from './components/Microservices/MicroservicesTopology';
import { GrpcStreamInspector } from './components/Microservices/GrpcStreamInspector';
import { RedisVisualizer } from './components/RedisCache/RedisVisualizer';
import { DatabaseArchitecture } from './components/DatabaseSchema/DatabaseArchitecture';
import { FinancialDashboard } from './components/FinancialAnalytics/FinancialDashboard';
import { TrafficChaosControl } from './components/Chaos/TrafficChaosControl';
import { ExportModal } from './components/FinancialAnalytics/ExportModal';
import { Terminal, Sparkles, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';

const StudioWorkspace: React.FC = () => {
  const { activeTab, trafficQPS, metrics } = usePlatform();
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState<boolean>(false);

  return (
    <div className="h-screen w-screen bg-[#131314] text-[#e3e3e3] flex flex-col font-sans selection:bg-[#a8c7fa]/20 selection:text-[#a8c7fa] overflow-hidden">
      {/* 1. Google AI Studio Header Navigation */}
      <StudioHeader
        onOpenExport={() => setIsExportModalOpen(true)}
        isInspectorOpen={isInspectorOpen}
        onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
      />

      {/* 2. Three-Panel Studio Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: System Parameters & Chaos Engine (Collapsible) */}
        {!isLeftPanelCollapsed ? (
          <div className="relative shrink-0 flex h-full">
            <StudioLeftControlPanel />
            <button
              onClick={() => setIsLeftPanelCollapsed(true)}
              className="absolute -right-3 top-16 z-20 h-6 w-6 rounded-full bg-[#282a2c] border border-[#37393b] text-[#c4c7c5] hover:text-white flex items-center justify-center shadow-md text-xs transition-colors"
              title="Collapse System Parameters"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="relative shrink-0 border-r border-[#37393b] bg-[#1e1f20] w-12 flex flex-col items-center py-4 z-10">
            <button
              onClick={() => setIsLeftPanelCollapsed(false)}
              className="p-2 rounded-lg bg-[#282a2c] border border-[#37393b] text-[#a8c7fa] hover:bg-[#37393b] transition-colors"
              title="Expand System Parameters"
            >
              <Sliders className="h-4 w-4" />
            </button>
            <span className="text-[10px] font-mono text-[#8e918f] [writing-mode:vertical-lr] mt-6 tracking-widest uppercase">
              Parameters
            </span>
          </div>
        )}

        {/* Center Stage: Main Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#131314] p-4 lg:p-6 space-y-6 flex flex-col">
          {/* Top-Level Studio Metric Scorecards */}
          <MetricScorecards />

          {/* Primary Active Studio Canvas */}
          <div className="flex-1 transition-all duration-200">
            {activeTab === 'mobile' && <MobilePhoneSimulator />}

            {activeTab === 'microservices' && (
              <div className="space-y-6">
                <MicroservicesTopology />
                <GrpcStreamInspector />
              </div>
            )}

            {activeTab === 'redis' && <RedisVisualizer />}

            {activeTab === 'database' && <DatabaseArchitecture />}

            {activeTab === 'analytics' && (
              <FinancialDashboard onOpenExportModal={() => setIsExportModalOpen(true)} />
            )}
          </div>

          {/* Material 3 Styled Chaos Engine Controller */}
          <div className="pt-2">
            <TrafficChaosControl />
          </div>
        </main>

        {/* Right Drawer: Live Inspection Output (Collapsible) */}
        {isInspectorOpen && (
          <StudioRightInspectorDrawer
            isOpen={isInspectorOpen}
            onClose={() => setIsInspectorOpen(false)}
          />
        )}
      </div>

      {/* 3. Studio Minimal Status Bar */}
      <footer className="h-8 border-t border-[#37393b] bg-[#1e1f20] px-4 flex items-center justify-between text-[11px] font-mono text-[#8e918f] shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#6dd58c]">
            <span className="h-2 w-2 rounded-full bg-[#6dd58c]" />
            <span>Go 1.23.1 Runtime</span>
          </div>
          <span>·</span>
          <span>HTTP/2 gRPC Mesh</span>
          <span>·</span>
          <span>Cloud Spanner Multi-Region</span>
          <span>·</span>
          <span>Redlock Distributed Mutex</span>
        </div>

        <div className="flex items-center gap-4">
          <span>
            QPS: <strong className="text-[#a8c7fa]">{(trafficQPS / 1000000).toFixed(2)}M</strong>
          </span>
          <span>·</span>
          <span>
            Latency P99: <strong className="text-[#a8c7fa]">2.1ms</strong>
          </span>
          <span>·</span>
          <button
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            className="flex items-center gap-1 text-[#c4c7c5] hover:text-[#a8c7fa] transition-colors"
          >
            <Terminal className="h-3 w-3" />
            <span>{isInspectorOpen ? 'Hide Inspector' : 'Show Inspector'}</span>
          </button>
        </div>
      </footer>

      {/* Export Modal */}
      {isExportModalOpen && <ExportModal onClose={() => setIsExportModalOpen(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <StudioWorkspace />
    </PlatformProvider>
  );
}


