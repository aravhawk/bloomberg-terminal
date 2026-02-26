import { NextResponse } from "next/server";
import { getMultipleSeries } from "@/lib/api/fred";
import { TREASURY_SERIES } from "@/lib/constants";

export async function GET() {
  try {
    const seriesIds = Object.values(TREASURY_SERIES);
    const maturities = Object.keys(TREASURY_SERIES);
    const data = await getMultipleSeries(seriesIds, 2);

    const yields = maturities.map((maturity, i) => {
      const seriesId = seriesIds[i];
      const obs = (data[seriesId]?.observations || []).filter((o: Record<string, unknown>) => o.value !== ".");
      const current = obs[0] ? parseFloat(obs[0].value as string) : 0;
      const previous = obs[1] ? parseFloat(obs[1].value as string) : current;

      return {
        maturity,
        yield: current,
        change: current - previous,
        previousYield: previous,
      };
    });

    return NextResponse.json(yields);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
