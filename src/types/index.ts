export type TravelType = 'flight' | 'train' | 'hotel';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'SGD' | 'AUD' | 'CHF' | 'INR' | 'AED';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = rateToUSD Currency
  format: (amount: number) => string;
}

export interface Seat {
  id: string;
  seatNumber: string;
  cabinClass: 'first' | 'business' | 'economy';
  priceUSD: number;
  status: 'available' | 'locked' | 'booked';
  lockedBy?: string;
  lockExpiresAt?: number;
}

export interface TravelItem {
  id: string;
  type: TravelType;
  provider: string;
  title: string;
  routeCode: string;
  origin: {
    city: string;
    code: string;
    terminal?: string;
  };
  destination: {
    city: string;
    code: string;
    terminal?: string;
  };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  basePriceUSD: number;
  image: string;
  availableInventory: number;
  totalInventory: number;
  seats: Seat[];
  aircraftOrModel: string;
  realtimeQPS: number;
  rating: number;
  highlights: string[];
}

export interface BookingRecord {
  id: string;
  bookingRef: string;
  userId: string;
  userName: string;
  userEmail: string;
  itemId: string;
  itemTitle: string;
  travelType: TravelType;
  route: string;
  seatNumbers: string[];
  currency: CurrencyCode;
  originalAmount: number;
  usdEquivalent: number;
  fxRateUsed: number;
  paymentMethod: 'stripe_card' | 'apple_pay' | 'adyen_ideal' | 'upi' | 'alipay';
  paymentStatus: 'settled' | 'pending' | 'refunded';
  idempotencyKey: string;
  gatewayTransactionId: string;
  createdAt: string;
  qrCodeToken: string;
  grpcLatencyMs: number;
  redisNodeLocked: string;
}

export interface MicroserviceNode {
  id: string;
  name: string;
  runtime: string; // e.g., 'Go 1.23.1'
  port: number;
  protocol: 'gRPC' | 'HTTP/2' | 'Kafka';
  status: 'healthy' | 'degraded' | 'recovering';
  avgLatencyMs: number;
  qps: number;
  p99LatencyMs: number;
  errorRate: number;
  description: string;
  dependencies: string[];
}

export interface GrpcMethod {
  service: string;
  name: string;
  type: 'unary' | 'server_streaming' | 'client_streaming' | 'bidirectional';
  requestType: string;
  responseType: string;
  description: string;
  sampleRequest: Record<string, any>;
  sampleResponse: Record<string, any>;
  protoDefinition: string;
  goCode: string;
}

export interface RedisKeyEntry {
  key: string;
  type: 'string' | 'hash' | 'zset' | 'lock';
  node: string;
  ttlSeconds: number;
  hitsPerSec: number;
  memoryKb: number;
  description: string;
}

export interface DatabaseTableSchema {
  tableName: string;
  partitionStrategy: string;
  engine: string;
  replicationFactor: number;
  columns: {
    name: string;
    type: string;
    constraints?: string;
    notes?: string;
  }[];
  indexes: string[];
  sampleRow: Record<string, any>;
}

export interface FinancialMetricSummary {
  gmvUSD: number;
  netRevenueUSD: number;
  takeRatePercentage: number;
  activeUsers: number;
  qpsCurrent: number;
  totalBookings: number;
  paymentSuccessRate: number;
  avgBookingValueUSD: number;
  chargebackRate: number;
}
