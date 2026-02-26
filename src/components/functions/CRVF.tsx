"use client";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { YieldCurveChart } from "@/components/charts/YieldCurveChart";
import type { Security, YieldCurvePoint } from "@/lib/types";

export function CRVF({ security }: { security?: Security | null }) {
  void security;
  const { data, isLoading } = useQuery({
    queryKey: ["yields"],
    queryFn: async () => {
      const res = await fetch("/api/economic/yields");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<YieldCurvePoint[]>;
    },
    staleTime: 300000,
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="p-2 space-y-2 overflow-auto h-full">
      <div className="bb-section-header">YIELD CURVE VISUALIZATION</div>
      <div className="border border-bloomberg-border p-2">
        <YieldCurveChart data={data || []} height={350} />
      </div>
      <div className="text-[10px] text-bloomberg-muted px-2">
        US Treasury yield curve showing current yields across maturities from 1 Month to 30 Year.
        Data sourced from FRED (Federal Reserve Economic Data).
      </div>
    </div>
  );
}
