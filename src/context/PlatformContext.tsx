import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  BookingRecord,
  CurrencyCode,
  FinancialMetricSummary,
  MicroserviceNode,
  RedisKeyEntry,
  TravelItem,
  Seat,
} from '../types';
import {
  CURRENCY_RATES,
  INITIAL_BOOKINGS,
  INITIAL_TRAVEL_ITEMS,
  MICROSERVICES_NODES,
  REDIS_HOT_KEYS,
} from '../data/mockData';

export interface GrpcLogEntry {
  id: string;
  timestamp: string;
  service: string;
  method: string;
  status: 'OK' | 'RESOURCE_EXHAUSTED' | 'DEADLINE_EXCEEDED';
  latencyMs: number;
  payloadSummary: string;
}

interface PlatformContextType {
  // Navigation & View
  activeTab: 'mobile' | 'microservices' | 'redis' | 'database' | 'analytics';
  setActiveTab: (tab: 'mobile' | 'microservices' | 'redis' | 'database' | 'analytics') => void;

  // Currency & Rates
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatCurrency: (amountUSD: number, targetCurrency?: CurrencyCode) => string;
  convertUSDToCurrency: (amountUSD: number, targetCurrency?: CurrencyCode) => number;

  // Inventory & Travel Items
  travelItems: TravelItem[];
  selectedItem: TravelItem | null;
  setSelectedItem: (item: TravelItem | null) => void;
  selectedSeats: Seat[];
  toggleSeatSelection: (seat: Seat) => boolean;
  clearSeatSelection: () => void;

  // Booking Flow
  lockSeat: (itemId: string, seatId: string) => Promise<boolean>;
  releaseSeat: (itemId: string, seatId: string) => void;
  completeBooking: (params: {
    itemId: string;
    seatIds: string[];
    passengerName: string;
    passengerEmail: string;
    paymentMethod: BookingRecord['paymentMethod'];
  }) => Promise<BookingRecord>;
  latestConfirmedBooking: BookingRecord | null;
  setLatestConfirmedBooking: (b: BookingRecord | null) => void;
  bookings: BookingRecord[];

  // Traffic & Chaos Simulation
  trafficQPS: number;
  setTrafficQPS: (qps: number) => void;
  chaosEnabled: boolean;
  setChaosEnabled: (val: boolean) => void;
  chaosType: 'none' | 'redis_failover' | 'latency_spike' | 'db_partition';
  setChaosType: (type: 'none' | 'redis_failover' | 'latency_spike' | 'db_partition') => void;
  triggerFlashSaleSpike: () => void;

  // Metrics & Observability
  metrics: FinancialMetricSummary;
  microservices: MicroserviceNode[];
  redisKeys: RedisKeyEntry[];
  grpcLogs: GrpcLogEntry[];
  addGrpcLog: (log: Omit<GrpcLogEntry, 'id' | 'timestamp'>) => void;

  // Export functions
  exportToCSV: () => void;
  exportToJSON: () => void;
  exportCTOReport: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'mobile' | 'microservices' | 'redis' | 'database' | 'analytics'>('mobile');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [travelItems, setTravelItems] = useState<TravelItem[]>(INITIAL_TRAVEL_ITEMS);
  const [selectedItem, setSelectedItem] = useState<TravelItem | null>(INITIAL_TRAVEL_ITEMS[0]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [latestConfirmedBooking, setLatestConfirmedBooking] = useState<BookingRecord | null>(null);

  // Traffic generator: default 1.85 Million QPS
  const [trafficQPS, setTrafficQPS] = useState<number>(1845000);
  const [chaosEnabled, setChaosEnabled] = useState<boolean>(false);
  const [chaosType, setChaosType] = useState<'none' | 'redis_failover' | 'latency_spike' | 'db_partition'>('none');

  const [microservices, setMicroservices] = useState<MicroserviceNode[]>(MICROSERVICES_NODES);
  const [redisKeys, setRedisKeys] = useState<RedisKeyEntry[]>(REDIS_HOT_KEYS);
  const [grpcLogs, setGrpcLogs] = useState<GrpcLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '21:48:10.124',
      service: 'InventoryService',
      method: 'StreamInventoryUpdates',
      status: 'OK',
      latencyMs: 1.2,
      payloadSummary: 'route=SFO-HND delta_count=1',
    },
    {
      id: 'log-2',
      timestamp: '21:48:15.892',
      service: 'BookingEngine',
      method: 'AcquireSeatHold',
      status: 'OK',
      latencyMs: 2.1,
      payloadSummary: 'seat=14A user=usr_8921 ttl=300s',
    },
    {
      id: 'log-3',
      timestamp: '21:48:18.441',
      service: 'PaymentService',
      method: 'ExecuteMultiCurrencySettle',
      status: 'OK',
      latencyMs: 3.4,
      payloadSummary: 'amount=880.00 USD settled=EUR 809.60',
    },
  ]);

  const addGrpcLog = (log: Omit<GrpcLogEntry, 'id' | 'timestamp'>) => {
    const d = new Date();
    const timeStr = `${d.toTimeString().split(' ')[0]}.${d.getMilliseconds().toString().padStart(3, '0')}`;
    const newEntry: GrpcLogEntry = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
    };
    setGrpcLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  // Currency conversions
  const convertUSDToCurrency = (amountUSD: number, targetCurrency: CurrencyCode = currency): number => {
    const rate = CURRENCY_RATES[targetCurrency]?.rateToUSD || 1.0;
    return amountUSD * rate;
  };

  const formatCurrency = (amountUSD: number, targetCurrency: CurrencyCode = currency): string => {
    const rateInfo = CURRENCY_RATES[targetCurrency] || CURRENCY_RATES.USD;
    const converted = amountUSD * rateInfo.rateToUSD;
    return rateInfo.format(converted);
  };

  // Toggle seat selection
  const toggleSeatSelection = (seat: Seat): boolean => {
    if (seat.status === 'booked') return false;
    const exists = selectedSeats.some((s) => s.id === seat.id);
    if (exists) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
      return false;
    } else {
      setSelectedSeats((prev) => [...prev, seat]);
      return true;
    }
  };

  const clearSeatSelection = () => {
    setSelectedSeats([]);
  };

  // Lock seat using simulated Redis Redlock
  const lockSeat = async (itemId: string, seatId: string): Promise<boolean> => {
    const latency = chaosEnabled && chaosType === 'latency_spike' ? 142 : Math.round(1.2 + Math.random() * 2);
    await new Promise((r) => setTimeout(r, 60));

    let success = true;
    setTravelItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const targetSeat = item.seats.find((s) => s.id === seatId);
        if (!targetSeat || targetSeat.status === 'booked') {
          success = false;
          return item;
        }

        return {
          ...item,
          seats: item.seats.map((s) =>
            s.id === seatId
              ? {
                  ...s,
                  status: 'locked',
                  lockedBy: 'curr_user_session',
                  lockExpiresAt: Date.now() + 300000, // 5 min hold
                }
              : s
          ),
        };
      })
    );

    addGrpcLog({
      service: 'BookingEngine',
      method: 'AcquireSeatHold',
      status: success ? 'OK' : 'RESOURCE_EXHAUSTED',
      latencyMs: latency,
      payloadSummary: `flight=${itemId} seat=${seatId} redlock_quorum=3/5`,
    });

    return success;
  };

  // Release seat lock
  const releaseSeat = (itemId: string, seatId: string) => {
    setTravelItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          seats: item.seats.map((s) =>
            s.id === seatId && s.status === 'locked' ? { ...s, status: 'available', lockedBy: undefined, lockExpiresAt: undefined } : s
          ),
        };
      })
    );

    addGrpcLog({
      service: 'BookingEngine',
      method: 'ReleaseSeatHold',
      status: 'OK',
      latencyMs: 1.1,
      payloadSummary: `flight=${itemId} seat=${seatId} lock_freed`,
    });
  };

  // Complete booking saga
  const completeBooking = async (params: {
    itemId: string;
    seatIds: string[];
    passengerName: string;
    passengerEmail: string;
    paymentMethod: BookingRecord['paymentMethod'];
  }): Promise<BookingRecord> => {
    const item = travelItems.find((t) => t.id === params.itemId) || travelItems[0];
    const seatsToBook = item.seats.filter((s) => params.seatIds.includes(s.id));
    const totalUSD = seatsToBook.reduce((acc, s) => acc + s.priceUSD, 0);

    const rateInfo = CURRENCY_RATES[currency];
    const originalAmount = totalUSD * rateInfo.rateToUSD;
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const bookingRef = `AG-${Math.floor(100000 + Math.random() * 900000)}-${currency}`;

    const latency = chaosEnabled && chaosType === 'latency_spike' ? 210 : Math.round(2.2 + Math.random() * 2.5);

    // Update seat status to booked in inventory
    setTravelItems((prev) =>
      prev.map((t) => {
        if (t.id !== params.itemId) return t;
        return {
          ...t,
          availableInventory: Math.max(0, t.availableInventory - params.seatIds.length),
          seats: t.seats.map((s) => (params.seatIds.includes(s.id) ? { ...s, status: 'booked', lockedBy: undefined } : s)),
        };
      })
    );

    const newRecord: BookingRecord = {
      id: `b-${Date.now()}`,
      bookingRef,
      userId: `usr_${Math.random().toString(36).substring(2, 7)}`,
      userName: params.passengerName || 'Verified Traveler',
      userEmail: params.passengerEmail || 'traveler@1MS25IS002_assignment1.io',
      itemId: item.id,
      itemTitle: item.title,
      travelType: item.type,
      route: item.routeCode,
      seatNumbers: seatsToBook.map((s) => s.seatNumber),
      currency: currency,
      originalAmount,
      usdEquivalent: totalUSD,
      fxRateUsed: rateInfo.rateToUSD,
      paymentMethod: params.paymentMethod,
      paymentStatus: 'settled',
      idempotencyKey,
      gatewayTransactionId: `txn_psp_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      qrCodeToken: `1MS25IS002_assignment1:${item.origin.code}:${item.destination.code}:${seatsToBook.map((s) => s.seatNumber).join('+')}:${bookingRef}`,
      grpcLatencyMs: latency,
      redisNodeLocked: 'redis-shard-01a',
    };

    setBookings((prev) => [newRecord, ...prev]);
    setLatestConfirmedBooking(newRecord);
    clearSeatSelection();

    addGrpcLog({
      service: 'PaymentService',
      method: 'ExecuteMultiCurrencySettle',
      status: 'OK',
      latencyMs: latency,
      payloadSummary: `ref=${bookingRef} curr=${currency} amt=${originalAmount.toFixed(2)} usd=${totalUSD}`,
    });

    addGrpcLog({
      service: 'BookingEngine',
      method: 'CommitBookingSaga',
      status: 'OK',
      latencyMs: 1.4,
      payloadSummary: `saga_completed outbox_written seats=${params.seatIds.join(',')}`,
    });

    return newRecord;
  };

  // Trigger flash sale spike (simulate 50k requests in seconds)
  const triggerFlashSaleSpike = () => {
    setTrafficQPS(2480000);
    addGrpcLog({
      service: 'api-edge-proxy',
      method: 'TrafficSurgeDetected',
      status: 'OK',
      latencyMs: 0.9,
      payloadSummary: 'qps_surge=2.48M Redis_pipeline=ACTIVE',
    });

    // Auto decrement an inventory item by 1 after lock simulation
    setTimeout(() => {
      setTravelItems((prev) => {
        const item = prev[0];
        const availableSeat = item.seats.find((s) => s.status === 'available');
        if (!availableSeat) return prev;
        return prev.map((t) =>
          t.id === item.id
            ? {
                ...t,
                availableInventory: Math.max(0, t.availableInventory - 1),
                seats: t.seats.map((s) => (s.id === availableSeat.id ? { ...s, status: 'booked' } : s)),
              }
            : t
        );
      });
      addGrpcLog({
        service: 'InventoryService',
        method: 'AtomicInventoryDeduct',
        status: 'OK',
        latencyMs: 0.8,
        payloadSummary: 'seat_contention_resolved=WINNER Redlock_NX=SUCCESS',
      });
    }, 400);
  };

  // Dynamic Financial Metrics calculation
  const metrics = useMemo<FinancialMetricSummary>(() => {
    const totalUSD = bookings.reduce((acc, b) => acc + b.usdEquivalent, 0);
    const gmvUSD = 48250000 + totalUSD * 420;
    const takeRate = 0.084; // 8.4%
    const netRevenueUSD = gmvUSD * takeRate;
    const activeUsers = Math.round(trafficQPS * 0.98);

    return {
      gmvUSD,
      netRevenueUSD,
      takeRatePercentage: 8.4,
      activeUsers,
      qpsCurrent: trafficQPS,
      totalBookings: 142050 + bookings.length,
      paymentSuccessRate: chaosEnabled && chaosType === 'redis_failover' ? 97.4 : 99.88,
      avgBookingValueUSD: Math.round(gmvUSD / (142050 + bookings.length)),
      chargebackRate: 0.08,
    };
  }, [bookings, trafficQPS, chaosEnabled, chaosType]);

  // Periodic subtle QPS fluctuation for real-time liveliness
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficQPS((prev) => {
        const jitter = Math.floor((Math.random() - 0.5) * 8000);
        return Math.max(50000, Math.min(2500000, prev + jitter));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update microservice latency based on chaos
  useEffect(() => {
    setMicroservices((prev) =>
      prev.map((m) => {
        if (chaosEnabled && chaosType === 'latency_spike') {
          return {
            ...m,
            status: m.id === 'payment-service' ? 'degraded' : 'healthy',
            avgLatencyMs: Number((m.avgLatencyMs * 4.5).toFixed(1)),
            p99LatencyMs: Number((m.p99LatencyMs * 6.2).toFixed(1)),
            errorRate: 0.045,
          };
        } else if (chaosEnabled && chaosType === 'redis_failover') {
          return {
            ...m,
            status: m.id === 'inventory-service' ? 'recovering' : 'healthy',
            avgLatencyMs: m.id === 'inventory-service' ? 8.4 : m.avgLatencyMs,
            errorRate: m.id === 'inventory-service' ? 0.021 : m.errorRate,
          };
        }
        // Normal state
        const initial = MICROSERVICES_NODES.find((node) => node.id === m.id);
        return initial || m;
      })
    );
  }, [chaosEnabled, chaosType]);

  // Export handlers
  const exportToCSV = () => {
    const headers = [
      'Booking ID',
      'Booking Reference',
      'Passenger Name',
      'Passenger Email',
      'Route',
      'Travel Type',
      'Seats',
      'Currency',
      'Original Amount',
      'FX Rate to USD',
      'USD Equivalent',
      'Payment Method',
      'Payment Status',
      'Idempotency Key',
      'Gateway TXN ID',
      'Created At',
      'gRPC Latency (ms)',
    ];

    const rows = bookings.map((b) => [
      b.id,
      b.bookingRef,
      `"${b.userName.replace(/"/g, '""')}"`,
      b.userEmail,
      `"${b.route.replace(/"/g, '""')}"`,
      b.travelType,
      `"${b.seatNumbers.join(';')}"`,
      b.currency,
      b.originalAmount.toFixed(2),
      b.fxRateUsed.toFixed(4),
      b.usdEquivalent.toFixed(2),
      b.paymentMethod,
      b.paymentStatus,
      b.idempotencyKey,
      b.gatewayTransactionId,
      b.createdAt,
      b.grpcLatencyMs,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `1MS25IS002_assignment1_financial_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const data = {
      exportMetadata: {
        platform: '1MS25IS002_assignment1 Travel Core',
        exportedAt: new Date().toISOString(),
        totalTransactions: bookings.length,
        grossMerchandiseValueUSD: metrics.gmvUSD,
        netRevenueUSD: metrics.netRevenueUSD,
        currentQPS: trafficQPS,
      },
      financialLedger: bookings,
      liveFXRates: CURRENCY_RATES,
      microservicesHealth: microservices,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `1MS25IS002_assignment1_executive_ledger_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCTOReport = () => {
    const reportText = `========================================================================
1MS25IS002_assignment1 TRAVEL PLATFORM - CTO EXECUTIVE & FINANCIAL AUDIT REPORT
Generated: ${new Date().toUTCString()}
Architecture: Go 1.23 Microservices + gRPC + Redis L1/L2 Cluster + CockroachDB
========================================================================

1. FINANCIAL SUMMARY & MULTI-CURRENCY REVENUE
------------------------------------------------------------------------
- Gross Merchandise Value (GMV): $${metrics.gmvUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Net Platform Revenue (8.4% Take Rate): $${metrics.netRevenueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Total Confirmed Transactions: ${metrics.totalBookings.toLocaleString()}
- Average Booking Value (ABV): $${metrics.avgBookingValueUSD.toFixed(2)}
- Payment Gateway Success Rate: ${metrics.paymentSuccessRate}%
- Chargeback / Fraud Rate: ${metrics.chargebackRate}% (PCI-DSS Level 1 compliant)

2. SYSTEM CONCURRENCY & TRAFFIC TELEMETRY
------------------------------------------------------------------------
- Sustained Traffic Throughput: ${metrics.qpsCurrent.toLocaleString()} QPS
- Active Concurrent User Sessions: ${metrics.activeUsers.toLocaleString()}
- Redis Cache Hit Ratio: 98.6% (Hot key optimization)
- gRPC Mesh P99 Latency: ${microservices[1].p99LatencyMs} ms
- Outbox Event Delivery Guarantee: 100% (At-least-once via Kafka / NATS)

3. MICROSERVICES STATUS & RECOVERY
------------------------------------------------------------------------
${microservices
  .map(
    (m) =>
      `• [${m.id}] ${m.name.padEnd(30)} | Status: ${m.status.toUpperCase().padEnd(10)} | Latency: ${m.avgLatencyMs}ms (P99: ${m.p99LatencyMs}ms) | QPS: ${m.qps.toLocaleString()}`
  )
  .join('\n')}

4. RECENT AUDITED TRANSACTIONS (LATEST 5)
------------------------------------------------------------------------
${bookings
  .slice(0, 5)
  .map(
    (b) =>
      `[${b.createdAt}] ${b.bookingRef} | ${b.userName} | ${b.route} | ${b.currency} ${b.originalAmount.toFixed(2)} ($${b.usdEquivalent} USD) | Status: ${b.paymentStatus.toUpperCase()} | IdempKey: ${b.idempotencyKey}`
  )
  .join('\n')}

========================================================================
1MS25IS002_assignment1 Engineering & Infrastructure Group - Confidential Executive Report
========================================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `1MS25IS002_assignment1_cto_audit_report_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PlatformContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        formatCurrency,
        convertUSDToCurrency,
        travelItems,
        selectedItem,
        setSelectedItem,
        selectedSeats,
        toggleSeatSelection,
        clearSeatSelection,
        lockSeat,
        releaseSeat,
        completeBooking,
        latestConfirmedBooking,
        setLatestConfirmedBooking,
        bookings,
        trafficQPS,
        setTrafficQPS,
        chaosEnabled,
        setChaosEnabled,
        chaosType,
        setChaosType,
        triggerFlashSaleSpike,
        metrics,
        microservices,
        redisKeys,
        grpcLogs,
        addGrpcLog,
        exportToCSV,
        exportToJSON,
        exportCTOReport,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return ctx;
};
