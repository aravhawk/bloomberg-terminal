"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatPercent, formatVolume, getChangeColor } from "@/lib/formatters";
import type { Security } from "@/lib/types";

const TABS = [
  { key: "gainers", label: "Top Gainers", endpoint: "/api/stocks/financials/SPY?statement=income&period=annual" },
  { key: "losers", label: "Top Losers" },
  { key: "active", label: "Most Active" },
];

function useMovers(type: string) {
  return useQuery({
    queryKey: ["movers", type],
    queryFn: async () => {
      // FMP endpoints via our proxy - we'll use a combined approach
      const endpoint = type === "gainers" ? "gainers" : type === "losers" ? "losers" : "actives";
      // Note: We fetch directly from the FMP client endpoint through a simple fetch
      const res = await fetch(`/api/stocks/search?q=${endpoint}`);
      // Fallback: return empty if the endpoint doesn't directly support movers
      return [];
    },
    staleTime: 300000,
  });
}

export function MOST({ security }: { security?: Security | null }) {
  void security;
  const [tab, setTab] = useState("gainers");
  // Since we don't have a dedicated movers endpoint yet, show a placeholder
  const { data, isLoading } = useQuery({
    queryKey: ["movers", tab],
    queryFn: async () => {
      // Generate sample movers data for display
      const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "JPM", "V", "UNH"];
      const results = await Promise.all(
        symbols.slice(0, 10).map(async (sym) => {
          try {
            const res = await fetch(`/api/stocks/quote/${sym}`);
            const q = await res.json();
            return { symbol: sym, price: q.price, change: q.change, changePercent: q.changePercent };
          } catch { return null; }
        })
      );
      const valid = results.filter(Boolean) as { symbol: string; price: number; change: number; changePercent: number }[];
      if (tab === "gainers") return valid.sort((a, b) => b.changePercent - a.changePercent);
      if (tab === "losers") return valid.sort((a, b) => a.changePercent - b.changePercent);
      return valid;
    },
    staleTime: 60000,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-1 p-1 border-b border-bloomberg-border shrink-0">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`bb-btn text-[10px] ${tab === t.key ? "bb-btn-active" : ""}`}>
            {t.label}
          </button>
        ))}
      </div>
      {isLoading ? <LoadingState /> : (
        <div className="flex-1 overflow-auto">
          <table className="bb-table">
            <thead>
              <tr>
                <th>#</th><th>Symbol</th><th className="text-right">Price</th>
                <th className="text-right">Change</th><th className="text-right">Chg%</th>
              </tr>
            </thead>
            <tbody>
              {(data || []).map((item: Record<string, unknown>, i: number) => (
                <tr key={i}>
                  <td className="text-bloomberg-muted">{i + 1}</td>
                  <td className="text-bloomberg-amber font-bold">{String(item.symbol)}</td>
                  <td className="text-right num">${formatPrice(item.price as number)}</td>
                  <td className={`text-right num ${getChangeColor(item.change as number)}`}>
                    {(item.change as number) > 0 ? "+" : ""}{formatPrice(item.change as number)}
                  </td>
                  <td className={`text-right num ${getChangeColor(item.changePercent as number)}`}>
                    {formatPercent(item.changePercent as number)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
