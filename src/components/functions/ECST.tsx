"use client";
import { useState } from "react";
import { useEconomicData } from "@/hooks/useEconomicData";
import { LoadingState } from "@/components/data-display/LoadingState";
import { ECONOMIC_INDICATORS } from "@/lib/constants";
import { LineChart } from "@/components/charts/LineChart";
import type { Security } from "@/lib/types";

export function ECST({ security }: { security?: Security | null }) {
  void security;
  const [selectedSeries, setSelectedSeries] = useState(ECONOMIC_INDICATORS[0].seriesId);
  const { data, isLoading } = useEconomicData(selectedSeries);

  const indicator = ECONOMIC_INDICATORS.find((i) => i.seriesId === selectedSeries);
  const observations: { date: string; value: number }[] = data?.observations || [];
  const chartData = observations.map((obs) => ({ date: obs.date, value: obs.value }));

  return (
    <div className="p-2 space-y-2 overflow-auto h-full">
      <div className="bb-section-header">ECONOMIC STATISTICS</div>
      <div className="flex flex-wrap gap-1 mb-2">
        {ECONOMIC_INDICATORS.map((ind) => (
          <button key={ind.seriesId} onClick={() => setSelectedSeries(ind.seriesId)} className={`bb-btn text-[10px] ${selectedSeries === ind.seriesId ? "bb-btn-active" : ""}`}>
            {ind.seriesId}
          </button>
        ))}
      </div>
      {indicator && (
        <div className="border border-bloomberg-border p-2 mb-2">
          <div className="text-bloomberg-amber font-bold text-sm">{indicator.title}</div>
          <div className="flex gap-4 text-[10px] text-bloomberg-muted mt-1">
            <span>Series: {indicator.seriesId}</span><span>Unit: {indicator.unit}</span><span>Freq: {indicator.frequency}</span>
          </div>
          {observations.length > 0 && (
            <div className="mt-1 text-xs">
              <span className="text-bloomberg-muted">Latest: </span>
              <span className="text-bloomberg-white font-bold">{observations[observations.length - 1].value}</span>
              <span className="text-bloomberg-muted ml-2">({observations[observations.length - 1].date})</span>
            </div>
          )}
        </div>
      )}
      {isLoading ? <LoadingState /> : (
        <>
          {chartData.length > 0 && (
            <div className="border border-bloomberg-border p-2">
              <LineChart data={chartData} dataKey="value" height={300} color="#ff8c00" />
            </div>
          )}
          <div className="border border-bloomberg-border max-h-60 overflow-auto">
            <table className="bb-table">
              <thead><tr><th>Date</th><th className="text-right">Value</th></tr></thead>
              <tbody>
                {[...observations].reverse().slice(0, 50).map((obs, i) => (
                  <tr key={i}><td className="text-bloomberg-muted">{obs.date}</td><td className="text-right num text-bloomberg-white">{obs.value}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
