import {
  CurrencyCode,
  CurrencyRate,
  DatabaseTableSchema,
  GrpcMethod,
  MicroserviceNode,
  RedisKeyEntry,
  TravelItem,
  BookingRecord,
} from '../types';

export const CURRENCY_RATES: Record<CurrencyCode, CurrencyRate> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateToUSD: 1.0,
    format: (val) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateToUSD: 0.92,
    format: (val) => `€${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateToUSD: 0.78,
    format: (val) => `£${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    rateToUSD: 149.5,
    format: (val) => `¥${Math.round(val).toLocaleString()}`,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    rateToUSD: 1.34,
    format: (val) => `S$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rateToUSD: 1.52,
    format: (val) => `A$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    rateToUSD: 0.89,
    format: (val) => `CHF ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    rateToUSD: 83.9,
    format: (val) => `₹${Math.round(val).toLocaleString()}`,
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    rateToUSD: 3.67,
    format: (val) => `AED ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
};

// Initial travel inventory
export const INITIAL_TRAVEL_ITEMS: TravelItem[] = [
  {
    id: 'fl-782',
    type: 'flight',
    provider: '1MS25IS002_assignment1 Airways',
    title: 'San Francisco to Tokyo Haneda',
    routeCode: 'SFO → HND · AG-782',
    origin: { city: 'San Francisco', code: 'SFO', terminal: 'Intl Terminal A' },
    destination: { city: 'Tokyo', code: 'HND', terminal: 'Terminal 3' },
    departureTime: '11:15 AM',
    arrivalTime: '03:40 PM +1d',
    duration: '11h 25m non-stop',
    basePriceUSD: 880,
    image: '/src/assets/images/travel_tokyo_shinjuku_1790398187652.jpg',
    availableInventory: 14,
    totalInventory: 248,
    aircraftOrModel: 'Boeing 787-9 Dreamliner (GEnx-1B)',
    realtimeQPS: 4210,
    rating: 4.9,
    highlights: ['Lie-flat Business Suites', 'Starlink Inflight Wi-Fi', 'Japanese Kaiseki Dining'],
    seats: [
      { id: '1A', seatNumber: '1A', cabinClass: 'first', priceUSD: 2400, status: 'available' },
      { id: '1B', seatNumber: '1B', cabinClass: 'first', priceUSD: 2400, status: 'booked' },
      { id: '2A', seatNumber: '2A', cabinClass: 'first', priceUSD: 2400, status: 'available' },
      { id: '4A', seatNumber: '4A', cabinClass: 'business', priceUSD: 1650, status: 'available' },
      { id: '4B', seatNumber: '4B', cabinClass: 'business', priceUSD: 1650, status: 'locked', lockedBy: 'usr_8921', lockExpiresAt: Date.now() + 180000 },
      { id: '5A', seatNumber: '5A', cabinClass: 'business', priceUSD: 1650, status: 'available' },
      { id: '12A', seatNumber: '12A', cabinClass: 'economy', priceUSD: 880, status: 'available' },
      { id: '12B', seatNumber: '12B', cabinClass: 'economy', priceUSD: 880, status: 'available' },
      { id: '12C', seatNumber: '12C', cabinClass: 'economy', priceUSD: 880, status: 'booked' },
      { id: '14A', seatNumber: '14A', cabinClass: 'economy', priceUSD: 880, status: 'available' },
      { id: '14B', seatNumber: '14B', cabinClass: 'economy', priceUSD: 880, status: 'available' },
      { id: '14C', seatNumber: '14C', cabinClass: 'economy', priceUSD: 880, status: 'booked' },
    ],
  },
  {
    id: 'tr-904',
    type: 'train',
    provider: 'Alpine Rail High-Speed Express',
    title: 'Zurich to Zermatt Panoramic Express',
    routeCode: 'ZRH → ZER · PE-904',
    origin: { city: 'Zurich HB', code: 'ZRH', terminal: 'Track 7' },
    destination: { city: 'Zermatt Matterhorn', code: 'ZER', terminal: 'Platform 2' },
    departureTime: '08:45 AM',
    arrivalTime: '11:58 AM',
    duration: '3h 13m direct',
    basePriceUSD: 210,
    image: '/src/assets/images/travel_swiss_alps_1790398199787.jpg',
    availableInventory: 8,
    totalInventory: 180,
    aircraftOrModel: 'Stadler Panorama Panoramic EMU',
    realtimeQPS: 2840,
    rating: 4.95,
    highlights: ['360° Glass Domed Roof', 'Swiss Wine Cellar Car', 'Ski & Luggage Fast-Track'],
    seats: [
      { id: '101', seatNumber: 'Car 1 / 01', cabinClass: 'first', priceUSD: 360, status: 'available' },
      { id: '102', seatNumber: 'Car 1 / 02', cabinClass: 'first', priceUSD: 360, status: 'available' },
      { id: '103', seatNumber: 'Car 1 / 03', cabinClass: 'first', priceUSD: 360, status: 'booked' },
      { id: '201', seatNumber: 'Car 2 / 11', cabinClass: 'business', priceUSD: 280, status: 'available' },
      { id: '202', seatNumber: 'Car 2 / 12', cabinClass: 'business', priceUSD: 280, status: 'available' },
      { id: '301', seatNumber: 'Car 3 / 21', cabinClass: 'economy', priceUSD: 210, status: 'available' },
      { id: '302', seatNumber: 'Car 3 / 22', cabinClass: 'economy', priceUSD: 210, status: 'available' },
      { id: '303', seatNumber: 'Car 3 / 23', cabinClass: 'economy', priceUSD: 210, status: 'booked' },
    ],
  },
  {
    id: 'fl-319',
    type: 'flight',
    provider: 'Pacific Prime Airways',
    title: 'London Heathrow to Singapore Changi',
    routeCode: 'LHR → SIN · PP-319',
    origin: { city: 'London', code: 'LHR', terminal: 'Terminal 2' },
    destination: { city: 'Singapore', code: 'SIN', terminal: 'Terminal 3 (Jewel)' },
    departureTime: '10:05 PM',
    arrivalTime: '05:30 PM +1d',
    duration: '12h 25m non-stop',
    basePriceUSD: 1120,
    image: '/src/assets/images/travel_singapore_marina_1790398210915.jpg',
    availableInventory: 6,
    totalInventory: 310,
    aircraftOrModel: 'Airbus A350-900 Ultra Long Range',
    realtimeQPS: 5490,
    rating: 4.88,
    highlights: ['Cabin Humidity 20% Plus', 'Superfast 5G SkyLink', 'Signature Satay Bar'],
    seats: [
      { id: '1K', seatNumber: '1K', cabinClass: 'first', priceUSD: 3200, status: 'available' },
      { id: '2K', seatNumber: '2K', cabinClass: 'first', priceUSD: 3200, status: 'booked' },
      { id: '11A', seatNumber: '11A', cabinClass: 'business', priceUSD: 1980, status: 'available' },
      { id: '11B', seatNumber: '11B', cabinClass: 'business', priceUSD: 1980, status: 'available' },
      { id: '24A', seatNumber: '24A', cabinClass: 'economy', priceUSD: 1120, status: 'available' },
      { id: '24B', seatNumber: '24B', cabinClass: 'economy', priceUSD: 1120, status: 'available' },
    ],
  },
  {
    id: 'fl-101',
    type: 'flight',
    provider: 'TransAtlantic Jetways',
    title: 'Paris Charles de Gaulle to New York JFK',
    routeCode: 'CDG → JFK · TA-101',
    origin: { city: 'Paris', code: 'CDG', terminal: 'Terminal 2E' },
    destination: { city: 'New York', code: 'JFK', terminal: 'Terminal 4' },
    departureTime: '01:30 PM',
    arrivalTime: '04:15 PM',
    duration: '8h 45m non-stop',
    basePriceUSD: 940,
    image: '/src/assets/images/travel_newyork_skyline_1790398222121.jpg',
    availableInventory: 19,
    totalInventory: 280,
    aircraftOrModel: 'Airbus A330-900neo',
    realtimeQPS: 3820,
    rating: 4.82,
    highlights: ['French Culinary Curator', 'Direct Pre-Clearance Customs', 'High-Speed USB-C 100W at Seat'],
    seats: [
      { id: '1J', seatNumber: '1J', cabinClass: 'first', priceUSD: 2800, status: 'available' },
      { id: '3A', seatNumber: '3A', cabinClass: 'business', priceUSD: 1850, status: 'available' },
      { id: '15A', seatNumber: '15A', cabinClass: 'economy', priceUSD: 940, status: 'available' },
      { id: '15B', seatNumber: '15B', cabinClass: 'economy', priceUSD: 940, status: 'available' },
    ],
  },
];

// Go Microservices Topology
export const MICROSERVICES_NODES: MicroserviceNode[] = [
  {
    id: 'api-gateway',
    name: 'api-edge-proxy',
    runtime: 'Go 1.23.1 / Envoy',
    port: 443,
    protocol: 'HTTP/2',
    status: 'healthy',
    avgLatencyMs: 0.8,
    qps: 1845000,
    p99LatencyMs: 2.1,
    errorRate: 0.002,
    description: 'Stateless edge router with TLS termination, rate-limiting, and gRPC-Web proxying.',
    dependencies: ['inventory-service', 'booking-engine', 'payment-service', 'pricing-service'],
  },
  {
    id: 'inventory-service',
    name: 'inventory-service (Go)',
    runtime: 'Go 1.23.1 (goroutines & sync.RWMutex)',
    port: 50051,
    protocol: 'gRPC',
    status: 'healthy',
    avgLatencyMs: 1.2,
    qps: 840000,
    p99LatencyMs: 2.9,
    errorRate: 0.001,
    description: 'Atomic seat and room inventory allocation backed by Redis L1/L2 and Redlock.',
    dependencies: ['booking-engine', 'notification-bus'],
  },
  {
    id: 'booking-engine',
    name: 'booking-engine (Go)',
    runtime: 'Go 1.23.1 (Saga Orchestration)',
    port: 50052,
    protocol: 'gRPC',
    status: 'healthy',
    avgLatencyMs: 2.4,
    qps: 125000,
    p99LatencyMs: 4.8,
    errorRate: 0.003,
    description: 'Distributed Saga coordinator managing hold, lock, payment settlement, and ticketing outbox.',
    dependencies: ['inventory-service', 'payment-service', 'notification-bus'],
  },
  {
    id: 'payment-service',
    name: 'payment-gateway-service (Go)',
    runtime: 'Go 1.23.1 (PCI-DSS Tokenizer)',
    port: 50053,
    protocol: 'gRPC',
    status: 'healthy',
    avgLatencyMs: 3.1,
    qps: 89000,
    p99LatencyMs: 8.5,
    errorRate: 0.004,
    description: 'Multi-currency settlement engine with idempotency keys and multi-PSP routing (Stripe, Adyen).',
    dependencies: ['booking-engine'],
  },
  {
    id: 'pricing-service',
    name: 'dynamic-pricing-engine (Go)',
    runtime: 'Go 1.23.1 (SIMD Batch Math)',
    port: 50054,
    protocol: 'gRPC',
    status: 'healthy',
    avgLatencyMs: 1.1,
    qps: 450000,
    p99LatencyMs: 2.3,
    errorRate: 0.001,
    description: 'Real-time surge & yield management calculating load factor elasticity in <1.5ms.',
    dependencies: ['inventory-service'],
  },
  {
    id: 'notification-bus',
    name: 'event-bus & push (Go/Kafka)',
    runtime: 'Go 1.23.1 (librdkafka)',
    port: 9092,
    protocol: 'Kafka',
    status: 'healthy',
    avgLatencyMs: 0.9,
    qps: 920000,
    p99LatencyMs: 1.9,
    errorRate: 0.001,
    description: 'Kafka event stream delivering real-time WebSockets inventory diffs to millions of clients.',
    dependencies: [],
  },
];

// gRPC Methods & Go code samples
export const GRPC_METHODS: GrpcMethod[] = [
  {
    service: 'InventoryService',
    name: 'StreamInventoryUpdates',
    type: 'server_streaming',
    requestType: 'InventorySubscriptionRequest',
    responseType: 'InventoryDeltaStream',
    description: 'Opens a bidirectional/server-stream channel delivering real-time seat lock & release deltas.',
    sampleRequest: {
      route_code: 'SFO-HND-AG782',
      travel_date: '2026-10-15',
      client_id: 'mobile_app_ios_v4.2',
    },
    sampleResponse: {
      seat_id: '14A',
      cabin_class: 'ECONOMY',
      status: 'LOCKED',
      held_by_user_hash: 'sha256:8f2a1b9',
      ttl_seconds: 300,
      timestamp_micros: 1790398200120,
    },
    protoDefinition: `syntax = "proto3";

package 1MS25IS002_assignment1.inventory.v1;

option go_package = "github.com/1MS25IS002_assignment1/inventory/pb;inventoryv1";

service InventoryService {
  rpc StreamInventoryUpdates(InventorySubscriptionRequest) 
      returns (stream InventoryDeltaStream);
  rpc AcquireSeatHold(AcquireHoldRequest) 
      returns (AcquireHoldResponse);
  rpc ReleaseSeatHold(ReleaseHoldRequest) 
      returns (ReleaseHoldResponse);
}

message InventorySubscriptionRequest {
  string route_code = 1;
  string travel_date = 2;
  string client_id = 3;
}

message InventoryDeltaStream {
  string seat_id = 1;
  string cabin_class = 2;
  enum SeatStatus { AVAILABLE = 0; LOCKED = 1; BOOKED = 2; }
  SeatStatus status = 3;
  int64 ttl_seconds = 4;
  int64 timestamp_micros = 5;
}`,
    goCode: `// Go 1.23 Implementation: Real-Time gRPC Inventory Streamer
package service

import (
    "context"
    "time"
    pb "github.com/1MS25IS002_assignment1/inventory/pb"
    "github.com/redis/go-redis/v9"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"
)

type InventoryServer struct {
    pb.UnimplementedInventoryServiceServer
    rdb *redis.ClusterClient
}

func (s *InventoryServer) StreamInventoryUpdates(
    req *pb.InventorySubscriptionRequest,
    stream pb.InventoryService_StreamInventoryUpdatesServer,
) error {
    ctx := stream.Context()
    pubsub := s.rdb.Subscribe(ctx, "inventory:channel:"+req.RouteCode)
    defer pubsub.Close()

    ch := pubsub.Channel()
    for {
        select {
        case <-ctx.Done():
            return ctx.Err()
        case msg, ok := <-ch:
            if !ok {
                return status.Error(codes.Aborted, "channel closed")
            }
            delta := parseInventoryDelta(msg.Payload)
            if err := stream.Send(delta); err != nil {
                return err
            }
        }
    }
}`,
  },
  {
    service: 'BookingEngine',
    name: 'AcquireSeatHold',
    type: 'unary',
    requestType: 'AcquireHoldRequest',
    responseType: 'AcquireHoldResponse',
    description: 'Executes atomic Redlock distributed lock across Redis cluster nodes to reserve seat.',
    sampleRequest: {
      user_id: 'usr_8921_mobile',
      flight_id: 'fl-782',
      seat_number: '14A',
      hold_duration_sec: 300,
      idempotency_key: 'idemp_91a0c4f3-2194-4d82',
    },
    sampleResponse: {
      hold_id: 'hold_891024_a9',
      status: 'ACQUIRED',
      lock_acquired_nodes: ['redis-node-us-east-01', 'redis-node-us-east-02', 'redis-node-us-central-01'],
      lock_latency_micros: 680,
      expires_at: '2026-10-15T12:05:00Z',
    },
    protoDefinition: `syntax = "proto3";

package 1MS25IS002_assignment1.booking.v1;

option go_package = "github.com/1MS25IS002_assignment1/booking/pb;bookingv1";

service BookingEngine {
  rpc AcquireSeatHold(AcquireHoldRequest) returns (AcquireHoldResponse);
  rpc CommitBookingSaga(CommitSagaRequest) returns (CommitSagaResponse);
}

message AcquireHoldRequest {
  string user_id = 1;
  string flight_id = 2;
  string seat_number = 3;
  int32 hold_duration_sec = 4;
  string idempotency_key = 5;
}

message AcquireHoldResponse {
  string hold_id = 1;
  string status = 2;
  repeated string lock_acquired_nodes = 3;
  int64 lock_latency_micros = 4;
  string expires_at = 5;
}`,
    goCode: `// Go 1.23 Redlock Concurrency Resolver
func (s *BookingServer) AcquireSeatHold(ctx context.Context, req *pb.AcquireHoldRequest) (*pb.AcquireHoldResponse, error) {
    lockKey := fmt.Sprintf("lock:flight:%s:seat:%s", req.FlightId, req.SeatNumber)
    token := uuid.NewString()

    // Atomic SET NX PX with Redlock quorum (3 of 5 nodes)
    acquired, err := s.redlock.Lock(ctx, lockKey, token, time.Duration(req.HoldDurationSec)*time.Second)
    if err != nil || !acquired {
        return nil, status.Error(codes.ResourceExhausted, "Seat is currently locked by another concurrent session")
    }

    return &pb.AcquireHoldResponse{
        HoldId: token,
        Status: "ACQUIRED",
        ExpiresAt: time.Now().Add(time.Duration(req.HoldDurationSec)*time.Second).Format(time.RFC3339),
    }, nil
}`,
  },
  {
    service: 'PaymentService',
    name: 'ExecuteMultiCurrencySettle',
    type: 'unary',
    requestType: 'MultiCurrencyPaymentRequest',
    responseType: 'PaymentSettlementResponse',
    description: 'Performs multi-currency conversion, cryptographic idempotency check, and settles with PSP.',
    sampleRequest: {
      booking_ref: 'AG-902194-TX',
      amount: 880.0,
      currency: 'USD',
      target_settlement_currency: 'EUR',
      payment_token: 'tok_visa_4242_3ds_verified',
      idempotency_key: 'idemp_pay_8f2910d',
    },
    sampleResponse: {
      transaction_id: 'txn_gateway_889210_live',
      status: 'SETTLED',
      fx_rate_applied: 0.92,
      settled_amount: 809.6,
      clearing_network: 'VISA_DIRECT_3DS2',
      pci_compliance_code: 'PCI-DSS-L1-PASSED',
    },
    protoDefinition: `syntax = "proto3";

package 1MS25IS002_assignment1.payment.v1;

service PaymentService {
  rpc ExecuteMultiCurrencySettle(MultiCurrencyPaymentRequest) 
      returns (PaymentSettlementResponse);
}

message MultiCurrencyPaymentRequest {
  string booking_ref = 1;
  double amount = 2;
  string currency = 3;
  string target_settlement_currency = 4;
  string payment_token = 5;
  string idempotency_key = 6;
}

message PaymentSettlementResponse {
  string transaction_id = 1;
  string status = 2;
  double fx_rate_applied = 3;
  double settled_amount = 4;
  string clearing_network = 5;
}`,
    goCode: `// Go 1.23 Multi-Currency Gateway with Outbox Consistency
func (s *PaymentServer) ExecuteMultiCurrencySettle(ctx context.Context, req *pb.MultiCurrencyPaymentRequest) (*pb.PaymentSettlementResponse, error) {
    // 1. Check idempotency store in Redis to prevent double billing
    if seen, err := s.checkIdempotency(ctx, req.IdempotencyKey); seen {
        return s.getCachedTransaction(ctx, req.IdempotencyKey)
    }

    // 2. Lock guaranteed FX Rate from in-memory cache
    rate := s.fxEngine.GetLiveRate(req.Currency, req.TargetSettlementCurrency)
    settledAmount := req.Amount * rate

    // 3. Dispatch to PCI Gateway
    txnID, err := s.pspClient.ChargeToken(ctx, req.PaymentToken, settledAmount, req.TargetSettlementCurrency)
    if err != nil {
        return nil, status.Errorf(codes.FailedPrecondition, "PSP transaction rejected: %v", err)
    }

    // 4. Write to Outbox table atomically for Kafka consumer
    s.outboxRepo.WriteEvent(ctx, "payment.settled", txnID)

    return &pb.PaymentSettlementResponse{
        TransactionId: txnID,
        Status: "SETTLED",
        FxRateApplied: rate,
        SettledAmount: settledAmount,
    }, nil
}`,
  },
];

// Redis Hot Keys & Cluster state
export const REDIS_HOT_KEYS: RedisKeyEntry[] = [
  {
    key: 'inventory:flight:fl-782:seats',
    type: 'hash',
    node: 'redis-shard-01a (US-East)',
    ttlSeconds: 60,
    hitsPerSec: 184500,
    memoryKb: 34.2,
    description: 'Real-time bitmask & seat availability array for SFO-HND Flight 782',
  },
  {
    key: 'lock:seat:fl-782:14A',
    type: 'lock',
    node: 'redis-shard-01b (US-East)',
    ttlSeconds: 284,
    hitsPerSec: 4200,
    memoryKb: 0.8,
    description: 'Active Redlock distributed lock held by mobile user session',
  },
  {
    key: 'fx:rates:live:v1',
    type: 'hash',
    node: 'redis-shard-02a (Global-Replica)',
    ttlSeconds: 15,
    hitsPerSec: 450000,
    memoryKb: 12.4,
    description: 'Streaming real-time multi-currency exchange matrix (9 major currencies)',
  },
  {
    key: 'idemp:checkout:usr_8921_fl782',
    type: 'string',
    node: 'redis-shard-03a (EU-Central)',
    ttlSeconds: 86400,
    hitsPerSec: 1850,
    memoryKb: 1.2,
    description: 'Cryptographic idempotency key preventing duplicate payment authorization',
  },
  {
    key: 'surge:pricing:route:SFO-HND',
    type: 'string',
    node: 'redis-shard-01a (US-East)',
    ttlSeconds: 30,
    hitsPerSec: 320000,
    memoryKb: 0.5,
    description: 'Dynamic price multiplier calculated by dynamic-pricing Go service',
  },
];

// Multi-region Global Database Schema (CockroachDB / Cloud Spanner)
export const DATABASE_TABLES: DatabaseTableSchema[] = [
  {
    tableName: 'bookings',
    partitionStrategy: 'GEO-PARTITION BY (geo_region, created_at_month)',
    engine: 'Distributed CockroachDB / Cloud Spanner',
    replicationFactor: 5,
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()' },
      { name: 'geo_region', type: 'VARCHAR(16)', constraints: 'NOT NULL', notes: 'Partition key: us_east, eu_west, ap_east' },
      { name: 'booking_ref', type: 'VARCHAR(20)', constraints: 'UNIQUE NOT NULL', notes: 'E.g., AG-902194-TX' },
      { name: 'user_id', type: 'UUID', constraints: 'NOT NULL REFERENCES users(id)' },
      { name: 'travel_type', type: 'VARCHAR(16)', constraints: 'NOT NULL' },
      { name: 'item_id', type: 'VARCHAR(64)', constraints: 'NOT NULL' },
      { name: 'allocated_seats', type: 'STRING[]', constraints: 'NOT NULL' },
      { name: 'settled_currency', type: 'VARCHAR(3)', constraints: 'NOT NULL' },
      { name: 'settled_amount', type: 'DECIMAL(12, 2)', constraints: 'NOT NULL' },
      { name: 'usd_equivalent', type: 'DECIMAL(12, 2)', constraints: 'NOT NULL' },
      { name: 'payment_status', type: 'payment_status_enum', constraints: 'DEFAULT "SETTLED"' },
      { name: 'idempotency_key', type: 'VARCHAR(64)', constraints: 'UNIQUE NOT NULL' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp()' },
    ],
    indexes: [
      'CREATE INDEX idx_bookings_user ON bookings (user_id, created_at DESC) STORING (booking_ref, settled_amount)',
      'CREATE UNIQUE INDEX idx_bookings_idemp ON bookings (idempotency_key)',
    ],
    sampleRow: {
      id: 'd9b73489-3df2-4be1-90a8-208a0d4c8921',
      geo_region: 'us_east',
      booking_ref: 'AG-782019-US',
      user_id: 'usr_8921a9',
      travel_type: 'flight',
      item_id: 'fl-782',
      allocated_seats: ['14A'],
      settled_currency: 'USD',
      settled_amount: 880.0,
      usd_equivalent: 880.0,
      payment_status: 'SETTLED',
      idempotency_key: 'idemp_91a0c4f3-2194-4d82',
      created_at: '2026-09-25 21:30:14.281 UTC',
    },
  },
  {
    tableName: 'seat_inventory',
    partitionStrategy: 'GEO-PARTITION BY (route_region, departure_date)',
    engine: 'Distributed CockroachDB / Cloud Spanner',
    replicationFactor: 5,
    columns: [
      { name: 'flight_id', type: 'VARCHAR(64)', constraints: 'COMPOSITE PRIMARY KEY' },
      { name: 'seat_id', type: 'VARCHAR(16)', constraints: 'COMPOSITE PRIMARY KEY' },
      { name: 'route_region', type: 'VARCHAR(16)', constraints: 'NOT NULL' },
      { name: 'departure_date', type: 'DATE', constraints: 'NOT NULL' },
      { name: 'cabin_tier', type: 'VARCHAR(16)', constraints: 'NOT NULL' },
      { name: 'price_usd', type: 'DECIMAL(10,2)', constraints: 'NOT NULL' },
      { name: 'version', type: 'BIGINT', constraints: 'NOT NULL', notes: 'Optimistic locking CAS counter' },
      { name: 'status', type: 'VARCHAR(16)', constraints: 'CHECK status IN ("AVAILABLE", "LOCKED", "BOOKED")' },
      { name: 'locked_until', type: 'TIMESTAMPTZ', constraints: 'NULL' },
    ],
    indexes: [
      'CREATE INDEX idx_inventory_lookup ON seat_inventory (flight_id, status) STORING (price_usd, cabin_tier)',
    ],
    sampleRow: {
      flight_id: 'fl-782',
      seat_id: '14A',
      route_region: 'ap_east',
      departure_date: '2026-10-15',
      cabin_tier: 'economy',
      price_usd: 880.0,
      version: 48,
      status: 'AVAILABLE',
      locked_until: null,
    },
  },
  {
    tableName: 'outbox_events',
    partitionStrategy: 'HASH PARTITIONED BY (aggregate_id)',
    engine: 'Transactional Outbox (Guarantees zero lost messages)',
    replicationFactor: 3,
    columns: [
      { name: 'event_id', type: 'UUID', constraints: 'PRIMARY KEY' },
      { name: 'aggregate_type', type: 'VARCHAR(32)', constraints: 'NOT NULL' },
      { name: 'aggregate_id', type: 'VARCHAR(64)', constraints: 'NOT NULL' },
      { name: 'event_type', type: 'VARCHAR(64)', constraints: 'NOT NULL' },
      { name: 'payload', type: 'JSONB', constraints: 'NOT NULL' },
      { name: 'dispatched_to_kafka', type: 'BOOLEAN', constraints: 'DEFAULT false' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp()' },
    ],
    indexes: [
      'CREATE INDEX idx_outbox_pending ON outbox_events (dispatched_to_kafka, created_at) WHERE dispatched_to_kafka = false',
    ],
    sampleRow: {
      event_id: '92837482-1823-4567-9102-123456789abc',
      aggregate_type: 'booking',
      aggregate_id: 'AG-782019-US',
      event_type: 'BookingConfirmedEvent',
      payload: { booking_ref: 'AG-782019-US', seat: '14A', currency: 'USD', amount: 880 },
      dispatched_to_kafka: true,
      created_at: '2026-09-25 21:30:14.290 UTC',
    },
  },
];

// Initial bookings for the Financial Ledger
export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'b-9021',
    bookingRef: 'AG-982104-SF',
    userId: 'usr_8921',
    userName: 'Elena Rostova',
    userEmail: 'elena.rostova@techglobal.co',
    itemId: 'fl-782',
    itemTitle: 'San Francisco to Tokyo Haneda',
    travelType: 'flight',
    route: 'SFO → HND (AG-782)',
    seatNumbers: ['4A'],
    currency: 'USD',
    originalAmount: 1650,
    usdEquivalent: 1650,
    fxRateUsed: 1.0,
    paymentMethod: 'stripe_card',
    paymentStatus: 'settled',
    idempotencyKey: 'idemp_sec_99a8b7c4d1',
    gatewayTransactionId: 'ch_3Ns982La901Z',
    createdAt: '2026-09-25 21:14:02',
    qrCodeToken: '1MS25IS002_assignment1:SFO:HND:4A:AG-982104:20261015',
    grpcLatencyMs: 2.1,
    redisNodeLocked: 'redis-shard-01a',
  },
  {
    id: 'b-9022',
    bookingRef: 'AG-441920-ZH',
    userId: 'usr_3104',
    userName: 'Marcus Vane',
    userEmail: 'm.vane@alpinecapital.ch',
    itemId: 'tr-904',
    itemTitle: 'Zurich to Zermatt Panoramic Express',
    travelType: 'train',
    route: 'ZRH → ZER (PE-904)',
    seatNumbers: ['Car 1 / 01'],
    currency: 'CHF',
    originalAmount: 320.4,
    usdEquivalent: 360.0,
    fxRateUsed: 0.89,
    paymentMethod: 'apple_pay',
    paymentStatus: 'settled',
    idempotencyKey: 'idemp_sec_109c918fa2',
    gatewayTransactionId: 'adyen_ch_88192014',
    createdAt: '2026-09-25 21:28:44',
    qrCodeToken: '1MS25IS002_assignment1:ZRH:ZER:C1-01:AG-441920:20261015',
    grpcLatencyMs: 1.8,
    redisNodeLocked: 'redis-shard-02a',
  },
  {
    id: 'b-9023',
    bookingRef: 'AG-109283-SG',
    userId: 'usr_7712',
    userName: 'Kaelen Tan',
    userEmail: 'ktan@singaporeventures.sg',
    itemId: 'fl-319',
    itemTitle: 'London Heathrow to Singapore Changi',
    travelType: 'flight',
    route: 'LHR → SIN (PP-319)',
    seatNumbers: ['11A'],
    currency: 'SGD',
    originalAmount: 2653.2,
    usdEquivalent: 1980.0,
    fxRateUsed: 1.34,
    paymentMethod: 'stripe_card',
    paymentStatus: 'settled',
    idempotencyKey: 'idemp_sec_77b3109a44',
    gatewayTransactionId: 'ch_3Ps771Ka002Y',
    createdAt: '2026-09-25 21:39:10',
    qrCodeToken: '1MS25IS002_assignment1:LHR:SIN:11A:AG-109283:20261015',
    grpcLatencyMs: 2.4,
    redisNodeLocked: 'redis-shard-01b',
  },
  {
    id: 'b-9024',
    bookingRef: 'AG-882194-NY',
    userId: 'usr_5541',
    userName: 'Sophie Laurent',
    userEmail: 'sophie.laurent@parisstudio.fr',
    itemId: 'fl-101',
    itemTitle: 'Paris Charles de Gaulle to New York JFK',
    travelType: 'flight',
    route: 'CDG → JFK (TA-101)',
    seatNumbers: ['3A'],
    currency: 'EUR',
    originalAmount: 1702.0,
    usdEquivalent: 1850.0,
    fxRateUsed: 0.92,
    paymentMethod: 'adyen_ideal',
    paymentStatus: 'settled',
    idempotencyKey: 'idemp_sec_55d8123c99',
    gatewayTransactionId: 'adyen_eu_99210411',
    createdAt: '2026-09-25 21:44:18',
    qrCodeToken: '1MS25IS002_assignment1:CDG:JFK:3A:AG-882194:20261015',
    grpcLatencyMs: 1.9,
    redisNodeLocked: 'redis-shard-03a',
  },
];
