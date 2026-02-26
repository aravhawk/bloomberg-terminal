"use client";
import { useStockQuote } from "@/hooks/useStockQuote";
import { PriceDisplay } from "@/components/data-display/PriceDisplay";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatPercent, getChangeColor } from "@/lib/formatters";
import type { Security } from "@/lib/types";

export function MOV({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data: quote, isLoading } = useStockQuote(symbol);

  if (!security) return <div className="flex items-center justify-center h-full text-bloomberg-amber text-sm">Enter a security in the command bar (e.g., AAPL)</div>;
  if (isLoading) return <LoadingState />;
  if (!quote) return <div className="flex items-center justify-center h-full text-bloomberg-muted text-sm">NO DATA</div>;

  const range52 = quote.high > 0 && quote.low > 0 ? ((quote.price - quote.low) / (quote.high - quote.low)) * 100 : 50;

  return (
    <div className="p-2 space-y-2 overflow-auto h-full">
      <div className="bb-section-header">{symbol} — PRICE MOVEMENT</div>
      <div className="border border-bloomberg-border p-3">
        <PriceDisplay price={quote.price} change={quote.change} changePercent={quote.changePercent} size="lg" />
      </div>
      <div className="border border-bloomberg-border p-2">
        <div className="text-[10px] text-bloomberg-amber font-bold uppercase mb-2">Day Range</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-bloomberg-muted">${formatPrice(quote.low)}</span>
          <div className="flex-1 h-2 bg-bloomberg-panel-alt rounded relative">
            <div className="absolute h-full bg-bloomberg-amber rounded" style={{ width: `${range52}%` }} />
          </div>
          <span className="text-bloomberg-muted">${formatPrice(quote.high)}</span>
        </div>
      </div>
      <div className="border border-bloomberg-border p-2">
        <div className="text-[10px] text-bloomberg-amber font-bold uppercase mb-2">Key Data</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between"><span className="text-bloomberg-muted">Open</span><span>${formatPrice(quote.open)}</span></div>
          <div className="flex justify-between"><span className="text-bloomberg-muted">Prev Close</span><span>${formatPrice(quote.prevClose)}</span></div>
          <div className="flex justify-between"><span className="text-bloomberg-muted">Day High</span><span>${formatPrice(quote.high)}</span></div>
          <div className="flex justify-between"><span className="text-bloomberg-muted">Day Low</span><span>${formatPrice(quote.low)}</span></div>
          <div className="flex justify-between"><span className="text-bloomberg-muted">Change</span><span className={getChangeColor(quote.change)}>{formatPrice(quote.change)}</span></div>
          <div className="flex justify-between"><span className="text-bloomberg-muted">Change %</span><span className={getChangeColor(quote.changePercent)}>{formatPercent(quote.changePercent)}</span></div>
        </div>
      </div>
    </div>
  );
}
