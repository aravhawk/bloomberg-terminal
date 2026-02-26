"use client";
import { useState } from "react";
import { useForex } from "@/hooks/useForex";
import { LoadingState } from "@/components/data-display/LoadingState";
import { FX_CURRENCIES } from "@/lib/constants";
import type { Security } from "@/lib/types";

export function FXMonitor({ security }: { security?: Security | null }) {
  void security;
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const { data, isLoading } = useForex(baseCurrency);

  if (isLoading) return <LoadingState />;

  const rates: Record<string, number> = data?.rates || {};

  return (
    <div className="p-2 space-y-2 overflow-auto h-full">
      <div className="flex items-center gap-2 mb-1">
        <div className="bb-section-header flex-1">FX MONITOR</div>
        <label className="text-[10px] text-bloomberg-muted">BASE:</label>
        <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} className="bb-input text-xs">
          {FX_CURRENCIES.map((c) => (<option key={c.code} value={c.code}>{c.code}</option>))}
        </select>
      </div>
      <div className="border border-bloomberg-border">
        <div className="bb-section-header">EXCHANGE RATES (BASE: {baseCurrency})</div>
        <table className="bb-table">
          <thead>
            <tr><th>Currency</th><th>Name</th><th className="text-right">Rate</th><th className="text-right">Inverse</th></tr>
          </thead>
          <tbody>
            {Object.entries(rates)
              .filter(([code]) => code !== baseCurrency)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([code, rate]) => {
                const info = FX_CURRENCIES.find((c) => c.code === code);
                return (
                  <tr key={code}>
                    <td className="text-bloomberg-amber font-bold">{code}</td>
                    <td className="text-bloomberg-muted">{info?.name || code}</td>
                    <td className="text-right num text-bloomberg-white">{rate.toFixed(4)}</td>
                    <td className="text-right num text-bloomberg-muted">{(1 / rate).toFixed(4)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
