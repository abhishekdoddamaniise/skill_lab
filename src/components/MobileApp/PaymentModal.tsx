import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { TravelItem, Seat, BookingRecord, CurrencyCode } from '../../types';
import { CURRENCY_RATES } from '../../data/mockData';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Globe,
  Sparkles
} from 'lucide-react';

interface PaymentModalProps {
  item: TravelItem;
  seats: Seat[];
  onClose: () => void;
  onSuccess: (booking: BookingRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  item,
  seats,
  onClose,
  onSuccess,
}) => {
  const { 
    currency, 
    setCurrency, 
    formatCurrency, 
    convertUSDToCurrency, 
    completeBooking 
  } = usePlatform();

  const [paymentMethod, setPaymentMethod] = useState<BookingRecord['paymentMethod']>('stripe_card');
  const [passengerName, setPassengerName] = useState<string>('Elena Rostova');
  const [passengerEmail, setPassengerEmail] = useState<string>('elena.rostova@techglobal.co');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 9012');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvc, setCardCvc] = useState<string>('742');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [idempotencyKey] = useState<string>(
    () => `idemp_sec_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`
  );

  const totalUSD = seats.reduce((acc, s) => acc + s.priceUSD, 0);
  const convertedAmount = convertUSDToCurrency(totalUSD);
  const currentRate = CURRENCY_RATES[currency];

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulated multi-stage payment pipeline
    setProcessingStage('1/4 Tokenizing payment instrument (PCI-DSS Vault)...');
    await new Promise((r) => setTimeout(r, 400));

    setProcessingStage('2/4 Validating 3D-Secure 2.2 frictionless auth...');
    await new Promise((r) => setTimeout(r, 450));

    setProcessingStage('3/4 Locking guaranteed FX rate & checking idempotency...');
    await new Promise((r) => setTimeout(r, 400));

    setProcessingStage('4/4 Committing Go 1.23 distributed Saga transaction...');
    await new Promise((r) => setTimeout(r, 450));

    try {
      const record = await completeBooking({
        itemId: item.id,
        seatIds: seats.map((s) => s.id),
        passengerName,
        passengerEmail,
        paymentMethod,
      });
      setIsProcessing(false);
      onSuccess(record);
    } catch (err) {
      setIsProcessing(false);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-lg max-h-[94vh] sm:rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-cyan-400 font-mono tracking-wider">
                PAYMENT GATEWAY SERVICE
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <Lock className="h-3 w-3" /> PCI-DSS L1
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Secure Multi-Currency Checkout
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Multi-Currency Converter Banner */}
        <div className="px-5 py-3 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-400" />
            <div className="text-xs">
              <span className="text-slate-300 font-medium">Billed in: </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-cyan-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
              >
                {Object.keys(CURRENCY_RATES).map((code) => (
                  <option key={code} value={code}>
                    {code} ({CURRENCY_RATES[code as CurrencyCode].name})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-mono">
              1 USD = {currentRate.rateToUSD.toFixed(3)} {currency}
            </div>
            <div className="text-xs text-emerald-400 font-semibold font-mono">
              Rate Locked (10:00)
            </div>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handlePay} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Order Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Item & Route</span>
              <span className="font-semibold text-slate-200">{item.routeCode}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Seats Locked</span>
              <span className="font-mono text-cyan-400 font-semibold">
                {seats.map((s) => s.seatNumber).join(', ')}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>USD Base</span>
              <span className="font-mono tabular-nums">${totalUSD.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Total Amount Due</span>
              <div className="text-right">
                <span className="text-base font-bold text-cyan-400 font-mono tabular-nums">
                  {formatCurrency(totalUSD)}
                </span>
                {currency !== 'USD' && (
                  <span className="block text-[11px] text-slate-500 font-mono">
                    ≈ ${totalUSD.toFixed(2)} USD
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider block">
              Passenger Credentials
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Ticketing Email</label>
                <input
                  type="email"
                  required
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider block">
              Select Payment Rail
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe_card')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'stripe_card'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-sm'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Card / Stripe</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-sm'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Apple Pay</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('adyen_ideal')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'adyen_ideal'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-sm'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>Adyen Local</span>
              </button>
            </div>
          </div>

          {/* Card Input Simulation */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-10 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <CreditCard className="h-4 w-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Expires</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">CVC / CVV</label>
                <input
                  type="password"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Cryptographic Idempotency Key */}
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Idempotency-Key:</span>
              <span className="text-cyan-400 truncate max-w-[200px]">{idempotencyKey}</span>
            </div>
          </div>

          {/* Processing status */}
          {isProcessing && (
            <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-200 text-xs flex items-center gap-2 animate-pulse">
              <RefreshCw className="h-4 w-4 animate-spin text-cyan-400 shrink-0" />
              <span className="font-mono">{processingStage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Executing Distributed Settlement...</span>
            ) : (
              <>
                <span>Authorize & Pay {formatCurrency(totalUSD)}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
