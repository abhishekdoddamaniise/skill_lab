import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  FileText, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const { exportToCSV, exportToJSON, exportCTOReport, bookings, metrics } = usePlatform();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (type: 'csv' | 'json' | 'report') => {
    if (type === 'csv') {
      exportToCSV();
      setDownloadSuccess('CSV Financial Ledger exported successfully.');
    } else if (type === 'json') {
      exportToJSON();
      setDownloadSuccess('JSON Raw Audit Archive exported successfully.');
    } else if (type === 'report') {
      exportCTOReport();
      setDownloadSuccess('CTO Executive Audit Report (.txt) generated.');
    }
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-cyan-400">
                AUDIT & COMPLIANCE EXPORT
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-emerald-400 font-mono">PCI-DSS Ready</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Export Financial Data & System Telemetry
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-300">
            Generate verifiable financial summaries, multi-currency accounting ledgers,
            and Go microservice architecture telemetry reports for executives, auditors, and board members.
          </p>

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Export Options Grid */}
          <div className="space-y-3">
            {/* CSV Option */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Financial Transactions Ledger (.CSV)</h4>
                  <p className="text-[11px] text-slate-400">
                    Full spreadsheet: Reference, Traveler, Seats, FX rate, USD amount, Idempotency keys.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload('csv')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* JSON Option */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800">
                  <FileCode className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Complete System JSON Archive (.JSON)</h4>
                  <p className="text-[11px] text-slate-400">
                    Full nested data tree including live FX matrix, QPS loads, and microservice status.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload('json')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* CTO Executive Text Report */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-950/80 text-purple-400 border border-purple-800">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">CTO Executive Briefing Report (.TXT)</h4>
                  <p className="text-[11px] text-slate-400">
                    Formatted plain text executive report for leadership, investors, and audit committee.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload('report')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Quick Summary Stats */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Total Ledgers Included:</span>
            <span className="font-bold text-white">{bookings.length} verified bookings</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
