"use client";
import { useIndices } from "@/hooks/useIndices";
import { LoadingState } from "@/components/data-display/LoadingState";
import type { Security } from "@/lib/types";

export function Heatmap({ security }: { security?: Security | null }) {
  void security;
  const { data, isLoading } = useIndices();

  if (isLoading) return <LoadingState />;

  const items = (data || []).map((idx: Record<string, unknown>) => ({
    name: String(idx.name),
    etf: String(idx.etf),
    change: Number(idx.changePercent) || 0,
    price: Number(idx.price) || 0,
  }));

  const getColor = (change: number) => {
    if (change > 3) return "bg-green-700";
    if (change > 2) return "bg-green-600";
    if (change > 1) return "bg-green-500/80";
    if (change > 0) return "bg-green-500/40";
    if (change > -1) return "bg-red-500/40";
    if (change > -2) return "bg-red-500/80";
    if (change > -3) return "bg-red-600";
    return "bg-red-700";
  };

  return (
    <div className="p-2 space-y-2 overflow-auto h-full">
      <div className="bb-section-header">MARKET HEAT MAP</div>
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => (
          <div key={item.etf} className={`${getColor(item.change)} p-3 rounded border border-bloomberg-border/30`}>
            <div className="text-bloomberg-white font-bold text-sm">{item.etf}</div>
            <div className="text-[10px] text-bloomberg-white/70 truncate">{item.name}</div>
            <div className="text-lg font-bold text-white mt-1">
              {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[10px] text-bloomberg-muted mt-2 px-1">
        <span>Color scale:</span>
        <div className="flex gap-0.5">
          <div className="w-6 h-3 bg-red-700 rounded-sm" />
          <div className="w-6 h-3 bg-red-500/80 rounded-sm" />
          <div className="w-6 h-3 bg-red-500/40 rounded-sm" />
          <div className="w-6 h-3 bg-green-500/40 rounded-sm" />
          <div className="w-6 h-3 bg-green-500/80 rounded-sm" />
          <div className="w-6 h-3 bg-green-700 rounded-sm" />
        </div>
        <span>-3% to +3%</span>
      </div>
    </div>
  );
}
