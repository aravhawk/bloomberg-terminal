"use client";
import { useState, useMemo } from "react";
import { useCandles } from "@/hooks/useCandles";
import { CandlestickChart } from "@/components/charts/CandlestickChart";
import { LoadingState } from "@/components/data-display/LoadingState";
import { TIMEFRAME_CONFIG } from "@/lib/constants";
import { formatPrice, formatVolume } from "@/lib/formatters";
import type { Security } from "@/lib/types";

const TIMEFRAMES = Object.keys(TIMEFRAME_CONFIG);

export function GP({ security }: { security?: Security | null }) {
  const [timeframe, setTimeframe] = useState("3M");
  const [crosshairData, setCrosshairData] = useState<{ open: number; high: number; low: number; close: number; volume: number } | null>(null);

  const symbol = security?.symbol;
  const config = TIMEFRAME_CONFIG[timeframe];

  const now = Math.floor(Date.now() / 1000);
  const from = useMemo(() => {
    if (timeframe === "YTD") {
      return Math.floor(new Date(new Date().getFullYear(), 0, 1).getTime() / 1000);
    }
    return now - config.daysBack * 86400;
  }, [timeframe, now, config.daysBack]);

  const { data: candles, isLoading } = useCandles(symbol, config.resolution, from, now);

  if (!security) {
    return <div className="flex items-center justify-center h-full text-bloomberg-amber text-sm">Enter a security in the command bar (e.g., AAPL)</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-1 p-1 border-b border-bloomberg-border shrink-0 flex-wrap">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`bb-btn text-[10px] px-2 py-0.5 ${timeframe === tf ? "bb-btn-active" : ""}`}
          >
            {tf}
          </button>
        ))}
        <span className="text-bloomberg-amber text-xs font-bold ml-2">{symbol}</span>
      </div>

      <div className="flex-1 min-h-0">
        {isLoading ? (
          <LoadingState />
        ) : candles && candles.length > 0 ? (
          <CandlestickChart
            data={candles}
            height={400}
            onCrosshairMove={setCrosshairData}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-bloomberg-muted text-sm">NO CHART DATA</div>
        )}
      </div>

      <div className="flex items-center gap-4 px-2 py-1 border-t border-bloomberg-border text-xs shrink-0 bg-bloomberg-panel">
        {crosshairData ? (
          <>
            <span><span className="text-bloomberg-amber">O:</span> {formatPrice(crosshairData.open)}</span>
            <span><span className="text-bloomberg-amber">H:</span> {formatPrice(crosshairData.high)}</span>
            <span><span className="text-bloomberg-amber">L:</span> {formatPrice(crosshairData.low)}</span>
            <span><span className="text-bloomberg-amber">C:</span> {formatPrice(crosshairData.close)}</span>
            {crosshairData.volume > 0 && <span><span className="text-bloomberg-amber">V:</span> {formatVolume(crosshairData.volume)}</span>}
          </>
        ) : candles && candles.length > 0 ? (
          <>
            <span><span className="text-bloomberg-amber">O:</span> {formatPrice(candles[candles.length - 1].open)}</span>
            <span><span className="text-bloomberg-amber">H:</span> {formatPrice(candles[candles.length - 1].high)}</span>
            <span><span className="text-bloomberg-amber">L:</span> {formatPrice(candles[candles.length - 1].low)}</span>
            <span><span className="text-bloomberg-amber">C:</span> {formatPrice(candles[candles.length - 1].close)}</span>
            <span><span className="text-bloomberg-amber">V:</span> {formatVolume(candles[candles.length - 1].volume)}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
