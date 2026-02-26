"use client";
import { useDividends } from "@/hooks/useDividends";
import { LoadingState } from "@/components/data-display/LoadingState";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { formatPrice, formatDate } from "@/lib/formatters";
import type { Security } from "@/lib/types";

export function DVD({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data: dividends, isLoading } = useDividends(symbol);

  if (!security) return <div className="flex items-center justify-center h-full text-bloomberg-amber text-sm">Enter a security in the command bar (e.g., AAPL)</div>;
  if (isLoading) return <LoadingState />;
  if (!dividends || dividends.length === 0) return <div className="flex items-center justify-center h-full text-bloomberg-muted text-sm">NO DIVIDEND DATA AVAILABLE</div>;

  const chartData = [...dividends].reverse().slice(-20).map((d) => ({
    date: formatDate(d.exDate),
    value: d.amount,
  }));

  return (
    <div className="p-2 space-y-2 overflow-auto h-full">
      <div className="bb-section-header">{symbol} — DIVIDENDS</div>
      <div className="border border-bloomberg-border p-1">
        <div className="text-[10px] text-bloomberg-amber font-bold uppercase px-1 mb-1">Dividend History</div>
        <BarChartComponent data={chartData} height={180} color="#00d26a" />
      </div>
      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Ex-Date</th><th>Pay Date</th><th>Record Date</th><th className="text-right">Amount</th><th className="text-right">Adj. Amount</th>
            </tr>
          </thead>
          <tbody>
            {dividends.slice(0, 30).map((d, i) => (
              <tr key={i}>
                <td>{formatDate(d.exDate)}</td>
                <td>{d.payDate ? formatDate(d.payDate) : "-"}</td>
                <td>{d.recordDate ? formatDate(d.recordDate) : "-"}</td>
                <td className="text-right num">${formatPrice(d.amount)}</td>
                <td className="text-right num">${formatPrice(d.adjustedAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
