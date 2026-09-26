import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { TravelItem, TravelType } from '../../types';
import { 
  Plane, 
  Train, 
  Search, 
  Clock, 
  Zap, 
  ArrowRight, 
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';

interface TravelSearchFeedProps {
  onSelectItem: (item: TravelItem) => void;
}

export const TravelSearchFeed: React.FC<TravelSearchFeedProps> = ({ onSelectItem }) => {
  const { travelItems, formatCurrency, trafficQPS } = usePlatform();
  const [filterType, setFilterType] = useState<'all' | 'flight' | 'train'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = travelItems.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.origin.city.toLowerCase().includes(q) ||
      item.destination.city.toLowerCase().includes(q) ||
      item.routeCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search destination, airport, or train line..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          >
          </input>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Routes ({travelItems.length})
          </button>
          <button
            onClick={() => setFilterType('flight')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
              filterType === 'flight'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plane className="h-3.5 w-3.5" />
            <span>Flights</span>
          </button>
          <button
            onClick={() => setFilterType('train')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
              filterType === 'train'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Train className="h-3.5 w-3.5" />
            <span>High-Speed Rail</span>
          </button>
        </div>
      </div>

      {/* Real-time Inventory Stream Counter */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-slate-300">Live gRPC Inventory Stream</span>
        </div>
        <span>Throughput: {(trafficQPS / 1000).toFixed(0)}k req/s</span>
      </div>

      {/* Travel Cards Feed */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const availableSeatsCount = item.seats.filter((s) => s.status === 'available').length;
          const isHighContention = availableSeatsCount <= 6;

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all shadow-md group flex flex-col"
            >
              {/* Image Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Top overlay metadata (unboxed, clean) */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 font-mono text-[11px]">
                    {item.type === 'flight' ? (
                      <Plane className="h-3.5 w-3.5 text-cyan-400" />
                    ) : (
                      <Train className="h-3.5 w-3.5 text-cyan-400" />
                    )}
                    <span>{item.routeCode}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-md border border-slate-800 text-[11px] font-medium text-amber-300">
                    <Star className="h-3 w-3 fill-amber-300" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Bottom overlay: Origin & Destination */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <div className="text-xl font-bold tracking-tight">
                        {item.origin.code} → {item.destination.code}
                      </div>
                      <div className="text-xs text-slate-300">
                        {item.origin.city} to {item.destination.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-cyan-400 tabular-nums">
                        {formatCurrency(item.basePriceUSD)}
                      </div>
                      <div className="text-[10px] text-slate-400">starting price</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Flight/Train schedule info */}
                <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Departure</span>
                    <span className="font-semibold">{item.departureTime}</span>
                  </div>
                  <div className="text-center font-mono text-[11px] text-slate-400">
                    <span>{item.duration}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Arrival</span>
                    <span className="font-semibold">{item.arrivalTime}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-400">
                  {item.highlights.map((h, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-slate-600">·</span>}
                      <span>{h}</span>
                    </span>
                  ))}
                </div>

                {/* Real-time Inventory Contention Bar */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isHighContention ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
                      }`}
                    />
                    <span className="text-xs font-mono">
                      <strong className={isHighContention ? 'text-amber-400' : 'text-emerald-400'}>
                        {availableSeatsCount} seats left
                      </strong>{' '}
                      <span className="text-slate-500">· {item.realtimeQPS.toLocaleString()} QPS contention</span>
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectItem(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm shadow-cyan-500/20 active:scale-95"
                  >
                    <span>Pick Seats</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
