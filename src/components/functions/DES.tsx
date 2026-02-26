"use client";
import { useStockQuote } from "@/hooks/useStockQuote";
import { useStockProfile } from "@/hooks/useStockProfile";
import { useCandles } from "@/hooks/useCandles";
import { PriceDisplay } from "@/components/data-display/PriceDisplay";
import { KeyValueGrid } from "@/components/data-display/KeyValueGrid";
import { LoadingState } from "@/components/data-display/LoadingState";
import { AreaChart } from "@/components/charts/AreaChart";
import { formatLargeNumber, formatPercent, formatPrice } from "@/lib/formatters";
import type { Security } from "@/lib/types";

export function DES({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data: quote, isLoading: quoteLoading } = useStockQuote(symbol);
  const { data: profile, isLoading: profileLoading } = useStockProfile(symbol);

  const now = Math.floor(Date.now() / 1000);
  const from = now - 180 * 86400;
  const { data: candles } = useCandles(symbol, "D", from, now);

  if (!security) {
    return <div className="flex items-center justify-center h-full text-bloomberg-amber text-sm">Enter a security in the command bar (e.g., AAPL)</div>;
  }

  if (quoteLoading || profileLoading) return <LoadingState />;

  const chartData = (candles || []).map((c) => ({
    date: new Date(c.time * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: c.close,
  }));

  const companyInfo = [
    { label: "Name", value: profile?.name || symbol },
    { label: "Exchange", value: profile?.exchange || "" },
    { label: "Sector", value: profile?.sector || "" },
    { label: "Industry", value: profile?.industry || "" },
    { label: "Country", value: profile?.country || "" },
    { label: "IPO Date", value: profile?.ipo || "" },
    { label: "Website", value: profile?.website ? <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-bloomberg-blue hover:underline">{profile.website.replace(/https?:\/\/(www\.)?/, "")}</a> : "" },
    { label: "CEO", value: (profile as Record<string, unknown>)?.ceo || "" },
  ];

  const p = profile as Record<string, unknown> | undefined;
  const keyFinancials = [
    { label: "P/E", value: p?.peRatio ? formatPrice(p.peRatio as number) : "N/A" },
    { label: "P/B", value: p?.pbRatio ? formatPrice(p.pbRatio as number) : "N/A" },
    { label: "EV/EBITDA", value: p?.evToEbitda ? formatPrice(p.evToEbitda as number) : "N/A" },
    { label: "Div Yield", value: p?.dividendYield ? formatPercent(p.dividendYield as number) : "N/A" },
    { label: "Mkt Cap", value: profile?.marketCap ? formatLargeNumber(profile.marketCap) : "N/A" },
    { label: "Beta", value: p?.beta ? (p.beta as number).toFixed(2) : "N/A" },
    { label: "52W High", value: p?.week52High ? `$${formatPrice(p.week52High as number)}` : "N/A" },
    { label: "52W Low", value: p?.week52Low ? `$${formatPrice(p.week52Low as number)}` : "N/A" },
    { label: "ROE", value: p?.roe ? formatPercent(p.roe as number) : "N/A" },
    { label: "ROA", value: p?.roa ? formatPercent(p.roa as number) : "N/A" },
    { label: "EPS", value: p?.eps ? `$${formatPrice(p.eps as number)}` : "N/A" },
    { label: "Rev Growth", value: p?.revenueGrowth ? formatPercent(p.revenueGrowth as number) : "N/A" },
  ];

  return (
    <div className="p-2 space-y-2 overflow-auto h-full">
      <div className="bb-section-header">{symbol} US Equity — DESCRIPTION</div>

      <div className="border border-bloomberg-border p-2">
        <div className="text-[10px] text-bloomberg-amber font-bold uppercase mb-1">Company Info</div>
        <KeyValueGrid items={companyInfo} columns={4} />
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-2">
        <div className="border border-bloomberg-border p-2 min-w-[180px]">
          <div className="text-[10px] text-bloomberg-amber font-bold uppercase mb-1">Price</div>
          {quote && (
            <div>
              <PriceDisplay price={quote.price} change={quote.change} changePercent={quote.changePercent} size="lg" />
              <div className="mt-1 text-xs text-bloomberg-muted">
                <div>H: ${formatPrice(quote.high)} L: ${formatPrice(quote.low)}</div>
                <div>O: ${formatPrice(quote.open)} PC: ${formatPrice(quote.prevClose)}</div>
              </div>
            </div>
          )}
        </div>
        <div className="border border-bloomberg-border p-2">
          <div className="text-[10px] text-bloomberg-amber font-bold uppercase mb-1">Key Financials</div>
          <KeyValueGrid items={keyFinancials} columns={4} />
        </div>
      </div>

      {profile?.description && (
        <div className="border border-bloomberg-border p-2">
          <div className="text-[10px] text-bloomberg-amber font-bold uppercase mb-1">Description</div>
          <p className="text-xs text-bloomberg-white leading-relaxed">{profile.description}</p>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[10px] text-bloomberg-amber font-bold uppercase px-1 mb-1">6-Month Chart</div>
          <AreaChart data={chartData} height={150} />
        </div>
      )}
    </div>
  );
}
