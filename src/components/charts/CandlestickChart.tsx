"use client";
import { useEffect, useRef } from "react";
import { createChart, type IChartApi, type ISeriesApi, CrosshairMode, ColorType } from "lightweight-charts";
import type { CandleData } from "@/lib/types";

interface CandlestickChartProps {
  data: CandleData[];
  height?: number;
  onCrosshairMove?: (data: { time: number; open: number; high: number; low: number; close: number; volume: number } | null) => void;
}

export function CandlestickChart({ data, height = 400, onCrosshairMove }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#000000" },
        textColor: "#888888",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: "#1a1a1a" },
        horzLines: { color: "#1a1a1a" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: "#333333" },
      timeScale: {
        borderColor: "#333333",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#00d26a",
      downColor: "#ff3b3b",
      borderUpColor: "#00d26a",
      borderDownColor: "#ff3b3b",
      wickUpColor: "#00d26a",
      wickDownColor: "#ff3b3b",
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    if (onCrosshairMove) {
      chart.subscribeCrosshairMove((param) => {
        if (!param.time || !param.seriesData) {
          onCrosshairMove(null);
          return;
        }
        const candleData = param.seriesData.get(candleSeries) as { open: number; high: number; low: number; close: number } | undefined;
        if (candleData) {
          onCrosshairMove({
            time: param.time as number,
            ...candleData,
            volume: 0,
          });
        }
      });
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) chart.applyOptions({ width: entry.contentRect.width });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [height, onCrosshairMove]);

  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || !data.length) return;

    const candleData = data.map((d) => ({
      time: d.time as number,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const volumeData = data.map((d) => ({
      time: d.time as number,
      value: d.volume,
      color: d.close >= d.open ? "rgba(0,210,106,0.3)" : "rgba(255,59,59,0.3)",
    }));

    candleSeriesRef.current.setData(candleData);
    volumeSeriesRef.current.setData(volumeData);
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  return <div ref={containerRef} className="w-full" />;
}
