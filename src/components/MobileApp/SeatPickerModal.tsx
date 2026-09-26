import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { TravelItem, Seat } from '../../types';
import { X, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

interface SeatPickerModalProps {
  item: TravelItem;
  onClose: () => void;
  onProceedToPayment: (selectedSeats: Seat[]) => void;
}

export const SeatPickerModal: React.FC<SeatPickerModalProps> = ({
  item,
  onClose,
  onProceedToPayment,
}) => {
  const { 
    formatCurrency, 
    toggleSeatSelection, 
    selectedSeats, 
    clearSeatSelection, 
    lockSeat,
    travelItems 
  } = usePlatform();

  const [isLocking, setIsLocking] = useState<boolean>(false);
  const [lockTimerSeconds, setLockTimerSeconds] = useState<number>(300); // 5 mins
  const [activeLockError, setActiveLockError] = useState<string | null>(null);

  // Sync with current inventory state in context
  const currentItem = travelItems.find((t) => t.id === item.id) || item;

  // Countdown timer for locked seats
  useEffect(() => {
    if (selectedSeats.length === 0) return;
    const interval = setInterval(() => {
      setLockTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedSeats.length]);

  const handleSeatClick = async (seat: Seat) => {
    setActiveLockError(null);
    if (seat.status === 'booked') return;

    if (seat.status === 'locked' && seat.lockedBy !== 'curr_user_session') {
      setActiveLockError(`Seat ${seat.seatNumber} is currently held by another user in Redis.`);
      return;
    }

    const isNowSelected = toggleSeatSelection(seat);
    if (isNowSelected) {
      setIsLocking(true);
      const acquired = await lockSeat(currentItem.id, seat.id);
      setIsLocking(false);
      if (!acquired) {
        setActiveLockError(`Could not acquire distributed lock for seat ${seat.seatNumber}. Please select another.`);
        toggleSeatSelection(seat); // revert
      } else {
        setLockTimerSeconds(300);
      }
    }
  };

  const totalPriceUSD = selectedSeats.reduce((acc, s) => acc + s.priceUSD, 0);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-xl max-h-[92vh] sm:rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-cyan-400 font-mono tracking-wider">
                REACT NATIVE SEAT MAP
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">{currentItem.aircraftOrModel}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Select Your Cabin Seats
            </h3>
          </div>
          <button
            onClick={() => {
              clearSeatSelection();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Redis Distributed Lock Status Banner */}
        <div className="px-5 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-mono">
              Redis Redlock Cluster · Quorum: 3/5 Shards
            </span>
          </div>
          {selectedSeats.length > 0 && (
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>Hold: {formatTimer(lockTimerSeconds)}</span>
            </div>
          )}
        </div>

        {activeLockError && (
          <div className="mx-5 mt-3 p-2.5 rounded-lg bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{activeLockError}</span>
          </div>
        )}

        {/* Seat Map Cabin Graphic */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          {/* Legend */}
          <div className="flex items-center justify-around p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-slate-600 bg-slate-800/80" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                ✓
              </div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-amber-500/20 border border-amber-500/40" />
              <span>Locked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-slate-800 opacity-40 border border-slate-700" />
              <span>Booked</span>
            </div>
          </div>

          {/* Fuselage / Cabin Grid */}
          <div className="relative mx-auto max-w-sm rounded-3xl p-6 bg-gradient-to-b from-slate-950/80 to-slate-900 border border-slate-800 shadow-inner">
            <div className="text-center pb-4 border-b border-slate-800">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
                Cockpit & Forward Galley
              </span>
            </div>

            {/* Cabin Sections */}
            <div className="mt-4 space-y-5">
              {/* First & Business */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-400 mb-2 font-mono">
                  <span>PREMIUM CABIN</span>
                  <span>1-2-1 Lie-Flat</span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {currentItem.seats
                    .filter((s) => s.cabinClass !== 'economy')
                    .map((seat) => {
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      const isBooked = seat.status === 'booked';
                      const isLocked = seat.status === 'locked' && seat.lockedBy !== 'curr_user_session';

                      return (
                        <button
                          key={seat.id}
                          disabled={isBooked || isLocked || isLocking}
                          onClick={() => handleSeatClick(seat)}
                          className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center p-1.5 transition-all text-xs font-semibold relative ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 shadow-md shadow-cyan-500/30'
                              : isBooked
                              ? 'bg-slate-800/40 text-slate-600 border border-slate-800 cursor-not-allowed'
                              : isLocked
                              ? 'bg-amber-950/40 border border-amber-700/60 text-amber-300'
                              : 'bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200'
                          }`}
                        >
                          <span className="font-mono text-sm">{seat.seatNumber}</span>
                          <span className="text-[10px] opacity-80 tabular-nums">
                            {formatCurrency(seat.priceUSD)}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Economy Section */}
              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2 font-mono">
                  <span>MAIN CABIN</span>
                  <span>3-3 Extra Legroom</span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {currentItem.seats
                    .filter((s) => s.cabinClass === 'economy')
                    .map((seat) => {
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      const isBooked = seat.status === 'booked';
                      const isLocked = seat.status === 'locked' && seat.lockedBy !== 'curr_user_session';

                      return (
                        <button
                          key={seat.id}
                          disabled={isBooked || isLocked || isLocking}
                          onClick={() => handleSeatClick(seat)}
                          className={`min-h-[48px] rounded-xl flex flex-col items-center justify-center p-1.5 transition-all text-xs font-semibold ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 shadow-md shadow-cyan-500/30'
                              : isBooked
                              ? 'bg-slate-800/40 text-slate-600 border border-slate-800 cursor-not-allowed'
                              : isLocked
                              ? 'bg-amber-950/40 border border-amber-700/60 text-amber-300'
                              : 'bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200'
                          }`}
                        >
                          <span className="font-mono text-xs">{seat.seatNumber}</span>
                          <span className="text-[10px] opacity-80 tabular-nums">
                            {formatCurrency(seat.priceUSD)}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Checkout CTA Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">
              {selectedSeats.length > 0 ? (
                <span>Seats: <strong className="text-cyan-400 font-mono">{selectedSeats.map((s) => s.seatNumber).join(', ')}</strong></span>
              ) : (
                <span>Tap any seat above to lock</span>
              )}
            </div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">
              {totalPriceUSD > 0 ? formatCurrency(totalPriceUSD) : 'Select a seat'}
            </div>
          </div>

          <button
            disabled={selectedSeats.length === 0 || isLocking}
            onClick={() => onProceedToPayment(selectedSeats)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Proceed to Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
