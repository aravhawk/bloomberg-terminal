"use client";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatDate } from "@/lib/formatters";
import type { Security, EconomicEvent } from "@/lib/types";

export function ECO({ security }: { security?: Security | null }) {
  void security;
  const { data: events, isLoading } = useQuery({
    queryKey: ["economic-calendar"],
    queryFn: async () => {
      const res = await fetch("/api/economic/calendar");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<EconomicEvent[]>;
    },
    staleTime: 300000,
  });

  if (isLoading) return <LoadingState />;

  const importanceLabel = (imp: number) => {
    if (imp === 3) return { text: "HIGH", cls: "text-bloomberg-red" };
    if (imp === 2) return { text: "MED", cls: "text-bloomberg-amber" };
    return { text: "LOW", cls: "text-bloomberg-muted" };
  };

  return (
    <div className="p-2 space-y-2 overflow-auto h-full">
      <div className="bb-section-header">ECONOMIC CALENDAR</div>
      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr><th>Date</th><th>Time</th><th>Country</th><th>Event</th><th className="text-center">Impact</th><th className="text-right">Actual</th><th className="text-right">Estimate</th><th className="text-right">Previous</th></tr>
          </thead>
          <tbody>
            {(events || []).map((event, i) => {
              const imp = importanceLabel(event.importance);
              return (
                <tr key={`${event.event}-${i}`}>
                  <td className="text-bloomberg-muted">{formatDate(event.date)}</td>
                  <td className="text-bloomberg-muted">{event.time || "--:--"}</td>
                  <td className="text-bloomberg-cyan font-bold">{event.country}</td>
                  <td className="text-bloomberg-white">{event.event}</td>
                  <td className={`text-center font-bold ${imp.cls}`}>{imp.text}</td>
                  <td className="text-right num text-bloomberg-white">{event.actual != null ? event.actual : "--"}</td>
                  <td className="text-right num text-bloomberg-muted">{event.estimate != null ? event.estimate : "--"}</td>
                  <td className="text-right num text-bloomberg-muted">{event.previous != null ? event.previous : "--"}</td>
                </tr>
              );
            })}
            {(events || []).length === 0 && (
              <tr><td colSpan={8} className="text-center text-bloomberg-muted py-4">No upcoming economic events</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
