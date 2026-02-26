"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { FX_CURRENCIES } from "@/lib/constants";
import type { Security, ForexConversion } from "@/lib/types";

export function FXCA({ security }: { security?: Security | null }) {
  void security;
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1000");

  const { data, isLoading } = useQuery({
    queryKey: ["fx-convert", fromCurrency, toCurrency, amount],
    queryFn: async () => {
      const res = await fetch(`/api/forex/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<ForexConversion>;
    },
    staleTime: 30000,
  });

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="p-2 space-y-3 overflow-auto h-full">
      <div className="bb-section-header">FX CURRENCY CALCULATOR</div>
      <div className="border border-bloomberg-border p-3 space-y-3">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-[10px] text-bloomberg-muted block mb-1">FROM</label>
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="bb-input w-full">
              {FX_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
          <button onClick={swap} className="bb-btn px-3 py-1 mb-[2px]">SWAP</button>
          <div className="flex-1">
            <label className="text-[10px] text-bloomberg-muted block mb-1">TO</label>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="bb-input w-full">
              {FX_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-[10px] text-bloomberg-muted block mb-1">AMOUNT</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bb-input w-48" min="0" step="1" />
        </div>
      </div>
      {isLoading ? <LoadingState /> : data ? (
        <div className="border border-bloomberg-border p-3">
          <div className="text-bloomberg-muted text-[10px] mb-1">CONVERSION RESULT</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl text-bloomberg-amber font-bold">
              {data.result?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
            <span className="text-bloomberg-white text-sm">{toCurrency}</span>
          </div>
          <div className="text-xs text-bloomberg-muted mt-2">1 {fromCurrency} = {data.rate?.toFixed(6)} {toCurrency}</div>
          <div className="text-[10px] text-bloomberg-muted mt-1">1 {toCurrency} = {data.rate ? (1 / data.rate).toFixed(6) : "N/A"} {fromCurrency}</div>
        </div>
      ) : null}
    </div>
  );
}
