"use client";
import { useCrypto } from "@/hooks/useCrypto";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatLargeNumber, formatPercent, getChangeColor } from "@/lib/formatters";
import { SparklineChart } from "@/components/data-display/SparklineChart";
import type { Security } from "@/lib/types";

export function CryptoDash({ security }: { security?: Security | null }) {
  void security;
  const { data: coins, isLoading } = useCrypto();

  if (isLoading) return <LoadingState />;

  return (
    <div className="p-2 space-y-2 overflow-auto h-full">
      <div className="bb-section-header">CRYPTOCURRENCY MARKET</div>
      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Symbol</th><th className="text-right">Price</th>
              <th className="text-right">24h %</th><th className="text-right">7d %</th>
              <th className="text-right">Market Cap</th><th className="text-right">Volume (24h)</th>
              <th className="text-center">7D Chart</th>
            </tr>
          </thead>
          <tbody>
            {(coins || []).map((coin) => (
              <tr key={coin.id}>
                <td className="text-bloomberg-muted">{coin.marketCapRank}</td>
                <td className="text-bloomberg-white">
                  <div className="flex items-center gap-1">
                    {coin.image && <img src={coin.image} alt="" className="w-4 h-4 rounded-full" />}
                    {coin.name}
                  </div>
                </td>
                <td className="text-bloomberg-amber font-bold uppercase">{coin.symbol}</td>
                <td className="text-right num">${formatPrice(coin.currentPrice, coin.currentPrice < 1 ? 6 : 2)}</td>
                <td className={`text-right num ${getChangeColor(coin.priceChangePercentage24h)}`}>
                  {formatPercent(coin.priceChangePercentage24h)}
                </td>
                <td className={`text-right num ${getChangeColor(coin.priceChangePercentage7d)}`}>
                  {formatPercent(coin.priceChangePercentage7d)}
                </td>
                <td className="text-right num">{formatLargeNumber(coin.marketCap)}</td>
                <td className="text-right num">{formatLargeNumber(coin.totalVolume)}</td>
                <td className="text-center">
                  {coin.sparklineIn7d?.length > 0 && (
                    <SparklineChart data={coin.sparklineIn7d} width={80} height={24} color={coin.priceChangePercentage7d >= 0 ? "#00c853" : "#ff1744"} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
