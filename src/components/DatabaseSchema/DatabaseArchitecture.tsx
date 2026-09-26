import React, { useState } from 'react';
import { DATABASE_TABLES } from '../../data/mockData';
import { DatabaseTableSchema } from '../../types';
import { 
  Database, 
  Table, 
  Key, 
  ShieldCheck, 
  Globe, 
  Share2, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Code2
} from 'lucide-react';

export const DatabaseArchitecture: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<DatabaseTableSchema>(DATABASE_TABLES[0]);
  const [activeTab, setActiveTab] = useState<'erd' | 'outbox' | 'sql'>('erd');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1e1f20] border border-[#37393b]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#a8c7fa]">
              GLOBAL MULTI-REGION DATABASE SCHEMA & CONSISTENCY
            </span>
            <span className="text-[#8e918f]">·</span>
            <span className="text-xs text-[#6dd58c] font-mono">
              Strict Serializable ACID
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Cloud Spanner & CockroachDB Sharded Architecture
          </h2>
          <p className="text-xs text-[#c4c7c5] mt-1 max-w-2xl">
            Optimized for global travel transactions with geo-partitioned tables, composite primary keys,
            optimistic CAS locking, and transactional outbox queues delivering resilient eventual consistency.
          </p>
        </div>

        {/* View mode toggle: Gemini pill segmented control */}
        <div className="flex items-center gap-1 p-1 bg-[#131314] rounded-full border border-[#37393b] text-xs font-mono">
          <button
            onClick={() => setActiveTab('erd')}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              activeTab === 'erd'
                ? 'bg-[#37393b] text-[#a8c7fa] shadow-sm font-semibold'
                : 'text-[#c4c7c5] hover:text-white'
            }`}
          >
            Schema ERD
          </button>
          <button
            onClick={() => setActiveTab('outbox')}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              activeTab === 'outbox'
                ? 'bg-[#37393b] text-[#a8c7fa] shadow-sm font-semibold'
                : 'text-[#c4c7c5] hover:text-white'
            }`}
          >
            Outbox Pattern
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              activeTab === 'sql'
                ? 'bg-[#37393b] text-[#a8c7fa] shadow-sm font-semibold'
                : 'text-[#c4c7c5] hover:text-white'
            }`}
          >
            DDL & Indexes
          </button>
        </div>
      </div>

      {/* Primary Tab: Schema ERD */}
      {activeTab === 'erd' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table List Selector */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider block">
              Core Database Tables
            </span>
            <div className="space-y-2">
              {DATABASE_TABLES.map((t) => {
                const isSelected = selectedTable.tableName === t.tableName;
                return (
                  <div
                    key={t.tableName}
                    onClick={() => setSelectedTable(t)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Table className="h-4 w-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white font-mono">{t.tableName}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {t.replicationFactor}x Replicas
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-2">
                      Strategy: {t.partitionStrategy}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Global Sharding Highlights */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-white font-mono uppercase text-[10px] block">
                Geo-Partitioning Guarantee
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                By partitioning rows by <code>geo_region</code> (us_east, eu_west, ap_east),
                data lives physically adjacent to local travelers, keeping write latencies under 12ms
                while adhering to European GDPR and California privacy regulations.
              </p>
            </div>
          </div>

          {/* Table Schema Details View */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  Table Schema: {selectedTable.tableName}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedTable.engine} · {selectedTable.columns.length} columns
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-800">
                {selectedTable.partitionStrategy}
              </span>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Column Name</th>
                    <th className="py-2.5 px-4">Data Type</th>
                    <th className="py-2.5 px-4">Constraints</th>
                    <th className="py-2.5 px-4">Architectural Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {selectedTable.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 text-cyan-300 font-bold flex items-center gap-1.5">
                        {col.constraints?.includes('PRIMARY') && (
                          <Key className="h-3 w-3 text-amber-400 shrink-0" />
                        )}
                        <span>{col.name}</span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-300">{col.type}</td>
                      <td className="py-2.5 px-4 text-slate-400">{col.constraints || '—'}</td>
                      <td className="py-2.5 px-4 text-slate-500 text-[11px]">{col.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Indexes */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 font-mono uppercase block">
                Secondary Indexes & STORING Clauses
              </span>
              {selectedTable.indexes.map((idx, i) => (
                <div key={i} className="text-xs font-mono text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                  {idx}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Outbox Pattern Tab */}
      {activeTab === 'outbox' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#0e1422] border border-slate-800/80 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-cyan-400">
                  CDC OUTBOX STREAM DEPLOYMENT
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-emerald-400 font-mono">100% Zero-Loss Delivery</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Transactional Outbox Pattern (Dual-Write Protection)
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                How AeroGlobal avoids distributed 2-Phase Commit (2PC) while guaranteeing 100% zero-lost event delivery
                between the persistent database and Kafka / Redis event streams across US-EAST, EU-CENTRAL, and APAC regions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block">1. User Booking</span>
                  <span className="text-[9px] px-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">Client</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Traveler clicks "Authorize & Pay"; gRPC request reaches Go BookingEngine.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block">2. Local ACID Write</span>
                  <span className="text-[9px] px-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">Spanner</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Go writes to <code>bookings</code> AND inserts event into <code>outbox_events</code> in the same transaction.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block">3. CDC Relay Daemon</span>
                  <span className="text-[9px] px-1 rounded bg-purple-950 text-purple-300 border border-purple-800">Go Daemon</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Lightweight Go CDC service tails WAL logs and dispatches events to Kafka topics in &lt;5ms.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080c14] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block">4. WebSocket Push</span>
                  <span className="text-[9px] px-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Broadcast</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Inventory diff streams directly to millions of active React Native mobile devices worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* Live Transactional Outbox Event Stream Terminal */}
          <div className="rounded-xl bg-[#0e1422] border border-slate-800/80 overflow-hidden shadow-xl">
            <div className="px-4 py-2.5 bg-[#070a12] border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                  Live Outbox CDC Event Terminal (WAL Tailing)
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Topic: aeroglobal.booking.events.v1</span>
            </div>

            <div className="p-4 bg-[#090d16] font-mono text-xs text-slate-300 space-y-2 max-h-56 overflow-y-auto">
              <div className="flex items-center gap-3 text-slate-400">
                <span className="text-slate-600">[22:04:12.190]</span>
                <span className="text-cyan-400 font-semibold">[OUTBOX_EVENT]</span>
                <span className="text-slate-200">id=9b8210 event=BookingConfirmed ref=AG-982104-SF route=SFO-HND region=US-EAST</span>
                <span className="text-emerald-400 font-bold ml-auto">ACK_KAFKA_P0</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="text-slate-600">[22:04:14.882]</span>
                <span className="text-cyan-400 font-semibold">[OUTBOX_EVENT]</span>
                <span className="text-slate-200">id=44a921 event=SeatInventoryHeld seat=14A flight=fl-782 region=APAC</span>
                <span className="text-emerald-400 font-bold ml-auto">ACK_KAFKA_P1</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="text-slate-600">[22:04:18.401]</span>
                <span className="text-cyan-400 font-semibold">[OUTBOX_EVENT]</span>
                <span className="text-slate-200">id=11d044 event=MultiCurrencySettled ref=AG-441920-ZH curr=CHF region=EU-CENTRAL</span>
                <span className="text-emerald-400 font-bold ml-auto">ACK_KAFKA_P2</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="text-slate-600">[22:04:21.055]</span>
                <span className="text-cyan-400 font-semibold">[OUTBOX_EVENT]</span>
                <span className="text-slate-200">id=77f981 event=InventoryDiffBroadcast delta_qps=1.84M region=GLOBAL</span>
                <span className="text-emerald-400 font-bold ml-auto">ACK_KAFKA_P0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQL DDL Tab */}
      {activeTab === 'sql' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 flex items-center justify-between">
            <span>Production PostgreSQL / CockroachDB Schema DDL</span>
            <span className="text-cyan-400">Serializable Isolation</span>
          </div>
          <div className="p-5 bg-slate-950 text-xs font-mono text-slate-300 overflow-x-auto">
            <pre className="leading-relaxed">
{`-- CockroachDB / Cloud Spanner DDL with Multi-Region Geo-Partitioning
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    geo_region VARCHAR(16) NOT NULL,
    booking_ref VARCHAR(20) NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    travel_type VARCHAR(16) NOT NULL,
    item_id VARCHAR(64) NOT NULL,
    allocated_seats STRING[] NOT NULL,
    settled_currency VARCHAR(3) NOT NULL,
    settled_amount DECIMAL(12, 2) NOT NULL,
    usd_equivalent DECIMAL(12, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'SETTLED',
    idempotency_key VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
) PARTITION BY LIST (geo_region) (
    PARTITION p_us VALUES IN ('us_east', 'us_west'),
    PARTITION p_eu VALUES IN ('eu_west', 'eu_central'),
    PARTITION p_ap VALUES IN ('ap_east', 'ap_south')
);

-- Optimistic Locking for Real-Time Seat Inventory
CREATE TABLE seat_inventory (
    flight_id VARCHAR(64) NOT NULL,
    seat_id VARCHAR(16) NOT NULL,
    route_region VARCHAR(16) NOT NULL,
    departure_date DATE NOT NULL,
    cabin_tier VARCHAR(16) NOT NULL,
    price_usd DECIMAL(10,2) NOT NULL,
    version BIGINT NOT NULL DEFAULT 1,
    status VARCHAR(16) CHECK (status IN ('AVAILABLE', 'LOCKED', 'BOOKED')),
    locked_until TIMESTAMPTZ,
    PRIMARY KEY (flight_id, seat_id)
);

-- Transactional Outbox for Zero-Loss Kafka Streaming
CREATE TABLE outbox_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(32) NOT NULL,
    aggregate_id VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    dispatched_to_kafka BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);
CREATE INDEX idx_outbox_pending ON outbox_events (dispatched_to_kafka, created_at)
WHERE dispatched_to_kafka = false;`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
