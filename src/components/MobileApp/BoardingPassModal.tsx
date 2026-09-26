import React from 'react';
import { BookingRecord } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  Plane, 
  Train, 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  Smartphone,
  ArrowRight
} from 'lucide-react';

interface BoardingPassModalProps {
  booking: BookingRecord;
  onClose: () => void;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({ booking, onClose }) => {
  const { setActiveTab } = usePlatform();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">Booking Confirmed</h3>
              <p className="text-[11px] opacity-90 font-mono">Saga Transaction Settled</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-6 space-y-6">
          {/* Ticket Card */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-lg">
            {/* Cutout notch decorations */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-8 bg-slate-900 rounded-r-full border-r border-slate-800" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-8 bg-slate-900 rounded-l-full border-l border-slate-800" />

            {/* Ticket Header */}
            <div className="p-5 pb-4 border-b border-dashed border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  AEROGLOBAL PASS
                </span>
                <span className="text-xs font-mono text-slate-400">
                  REF: {booking.bookingRef}
                </span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">
                {booking.itemTitle}
              </h4>
            </div>

            {/* Passenger & Seats details */}
            <div className="p-5 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-mono block">Passenger</span>
                <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                  {booking.userName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-mono block">Seat Number(s)</span>
                <span className="font-mono font-bold text-cyan-400 mt-0.5 block">
                  {booking.seatNumbers.join(', ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-mono block">Settled Amount</span>
                <span className="font-mono font-bold text-white mt-0.5 block">
                  {booking.currency} {booking.originalAmount.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-mono block">Outbox Guarantee</span>
                <span className="text-emerald-400 font-mono text-[11px] mt-0.5 flex items-center gap-1">
                  ✓ Kafka Dispatched
                </span>
              </div>
            </div>

            {/* QR Code & Barcode Section */}
            <div className="p-5 pt-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[11px] text-slate-400 font-mono">
                  Token: {booking.qrCodeToken.slice(0, 18)}...
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <Smartphone className="h-3 w-3" />
                  <span>Cached in React Native SQLite</span>
                </div>
              </div>

              {/* QR Graphic */}
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <QrCode className="h-12 w-12 text-slate-950" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onClose();
                setActiveTab('analytics');
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View in CTO Financial Ledger</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm shadow-cyan-500/20"
            >
              Done & Return to Feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
