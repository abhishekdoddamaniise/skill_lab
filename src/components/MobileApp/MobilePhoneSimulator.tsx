import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { TravelItem, Seat, BookingRecord } from '../../types';
import { TravelSearchFeed } from './TravelSearchFeed';
import { SeatPickerModal } from './SeatPickerModal';
import { PaymentModal } from './PaymentModal';
import { BoardingPassModal } from './BoardingPassModal';
import { 
  Smartphone, 
  Wifi, 
  Battery, 
  Compass, 
  Ticket, 
  CreditCard, 
  User, 
  Maximize2, 
  Minimize2,
  QrCode,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const MobilePhoneSimulator: React.FC = () => {
  const { 
    travelItems, 
    bookings, 
    latestConfirmedBooking, 
    setLatestConfirmedBooking,
    currency,
    formatCurrency 
  } = usePlatform();

  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [phoneNavTab, setPhoneNavTab] = useState<'explore' | 'bookings' | 'wallet' | 'profile'>('explore');

  // Modal states
  const [activeItemForSeatMap, setActiveItemForSeatMap] = useState<TravelItem | null>(null);
  const [activeItemForPayment, setActiveItemForPayment] = useState<TravelItem | null>(null);
  const [lockedSeatsForPayment, setLockedSeatsForPayment] = useState<Seat[]>([]);
  const [activeBoardingPass, setActiveBoardingPass] = useState<BookingRecord | null>(null);

  const handleSelectItem = (item: TravelItem) => {
    setActiveItemForSeatMap(item);
  };

  const handleProceedToPayment = (seats: Seat[]) => {
    if (!activeItemForSeatMap) return;
    setLockedSeatsForPayment(seats);
    setActiveItemForPayment(activeItemForSeatMap);
    setActiveItemForSeatMap(null);
  };

  const handlePaymentSuccess = (booking: BookingRecord) => {
    setActiveItemForPayment(null);
    setLockedSeatsForPayment([]);
    setActiveBoardingPass(booking);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Device Frame Toolbar */}
      <div className="mb-4 flex items-center justify-between w-full max-w-sm sm:max-w-md px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">React Native Engine (iOS / Android)</span>
        </div>
        <button
          onClick={() => setDeviceFrameMode(!deviceFrameMode)}
          className="flex items-center gap-1 hover:text-white transition-colors px-2 py-1 rounded bg-slate-900 border border-slate-800"
          title="Toggle phone frame mockup"
        >
          {deviceFrameMode ? (
            <>
              <Minimize2 className="h-3 w-3" />
              <span>Fluid View</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-3 w-3" />
              <span>iPhone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Smartphone Chassis */}
      <div
        className={`w-full transition-all duration-300 ${
          deviceFrameMode
            ? 'max-w-[420px] rounded-[52px] border-[11px] border-slate-800 bg-[#070a12] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] p-2 relative ring-1 ring-slate-700/60 shadow-indigo-950/20'
            : 'max-w-2xl rounded-2xl border border-slate-800/80 bg-[#0b0f19] p-4 shadow-xl'
        }`}
      >
        {/* Dynamic Island / Notch (only in device frame mode) */}
        {deviceFrameMode && (
          <div className="sticky top-0 z-40 pt-2 pb-1.5 bg-[#070a12] flex flex-col items-center">
            {/* Status bar */}
            <div className="w-full px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span className="font-mono">9:41</span>
              {/* Dynamic Island pill with interactive hover / pulse effect */}
              <div className="h-5 w-28 bg-black/90 backdrop-blur-md rounded-full border border-slate-800/90 flex items-center justify-center shadow-inner group cursor-pointer transition-all hover:w-32">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping mr-1.5" />
                <span className="text-[9px] text-cyan-300 font-mono tracking-tight font-medium">
                  gRPC: 1.2ms
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Wifi className="h-3 w-3" />
                <Battery className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* Screen Viewport with Frosted Glassmorphism */}
        <div
          className={`flex flex-col bg-[#090d16] text-slate-100 overflow-hidden ${
            deviceFrameMode ? 'h-[740px] rounded-[40px]' : 'min-h-[600px]'
          }`}
        >
          {/* Mobile App Header */}
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                AeroGlobal Mobile v4.2
              </span>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {phoneNavTab === 'explore' && 'Global Travel Flights & Rail'}
                {phoneNavTab === 'bookings' && 'My Reserved Bookings'}
                {phoneNavTab === 'wallet' && 'Offline Ticket Store'}
                {phoneNavTab === 'profile' && 'Traveler Settings'}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Currency</span>
              <span className="text-xs font-bold text-cyan-400 font-mono">{currency}</span>
            </div>
          </div>

          {/* Scrollable Main Screen Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {phoneNavTab === 'explore' && (
              <TravelSearchFeed onSelectItem={handleSelectItem} />
            )}

            {phoneNavTab === 'bookings' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Audited Bookings</span>
                  <span className="font-mono text-cyan-400">{bookings.length} reservations</span>
                </div>
                {bookings.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No confirmed bookings yet. Select a route to book!
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => setActiveBoardingPass(booking)}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-2 group shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {booking.route}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                          {booking.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Passenger: {booking.userName}</span>
                        <span className="font-mono text-cyan-400">
                          Seat {booking.seatNumbers.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                        <span className="font-mono">{booking.bookingRef}</span>
                        <span className="font-mono font-bold text-slate-200">
                          {booking.currency} {booking.originalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {phoneNavTab === 'wallet' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-800/60 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Encrypted Offline SQLite Store</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    All digital boarding passes are cryptographically signed and cached on the device
                    with zero network dependency during boarding.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    Stored Boarding Passes ({bookings.length})
                  </span>
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setActiveBoardingPass(b)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                          <QrCode className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{b.route}</div>
                          <div className="text-[11px] text-slate-400">
                            Seat {b.seatNumbers.join(', ')} · {b.bookingRef}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-cyan-400 font-medium">View Pass →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {phoneNavTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-sm">
                    ER
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Elena Rostova</h3>
                    <p className="text-slate-400 text-[11px]">elena.rostova@techglobal.co</p>
                    <span className="text-emerald-400 text-[10px] font-mono">
                      ✓ Biometric 3DS2 Token Active
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="font-semibold text-slate-300 uppercase font-mono text-[10px]">
                    Client Mobile Config
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Framework</span>
                    <span className="font-mono text-slate-200">React Native 0.76 (Fabric)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">gRPC-Web Transport</span>
                    <span className="font-mono text-cyan-400">HTTP/2 Streaming</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Local Cache Database</span>
                    <span className="font-mono text-slate-200">WatermelonDB / SQLite</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Push Notification Engine</span>
                    <span className="font-mono text-slate-200">Go APNs & FCM Gateway</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ergonomic Thumb-Zone Bottom Tab Bar (Strict 44px hitboxes) */}
          <div className="border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-md grid grid-cols-4 items-center h-16 shrink-0">
            <button
              onClick={() => setPhoneNavTab('explore')}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
                phoneNavTab === 'explore' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span className="text-[10px] mt-1 tracking-tight">Explore</span>
            </button>

            <button
              onClick={() => setPhoneNavTab('bookings')}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors relative ${
                phoneNavTab === 'bookings' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Ticket className="h-4 w-4" />
              <span className="text-[10px] mt-1 tracking-tight">Bookings</span>
              {bookings.length > 0 && (
                <span className="absolute top-2 right-6 h-2 w-2 rounded-full bg-cyan-400" />
              )}
            </button>

            <button
              onClick={() => setPhoneNavTab('wallet')}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
                phoneNavTab === 'wallet' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span className="text-[10px] mt-1 tracking-tight">Wallet</span>
            </button>

            <button
              onClick={() => setPhoneNavTab('profile')}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
                phoneNavTab === 'profile' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="h-4 w-4" />
              <span className="text-[10px] mt-1 tracking-tight">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Seat Picker Modal */}
      {activeItemForSeatMap && (
        <SeatPickerModal
          item={activeItemForSeatMap}
          onClose={() => setActiveItemForSeatMap(null)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {/* Multi-Currency Payment Modal */}
      {activeItemForPayment && lockedSeatsForPayment.length > 0 && (
        <PaymentModal
          item={activeItemForPayment}
          seats={lockedSeatsForPayment}
          onClose={() => setActiveItemForPayment(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Confirmed Boarding Pass Modal */}
      {activeBoardingPass && (
        <BoardingPassModal
          booking={activeBoardingPass}
          onClose={() => setActiveBoardingPass(null)}
        />
      )}
    </div>
  );
};
