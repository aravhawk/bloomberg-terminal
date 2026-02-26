"use client";
import { useState, useEffect } from "react";
import { useWebSocketContext } from "@/providers/WebSocketProvider";
import { useTerminalStore } from "@/store/terminalStore";

export function StatusBar() {
  const [time, setTime] = useState(new Date());
  const { isConnected } = useWebSocketContext();
  const layout = useTerminalStore((s) => s.layout);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isMarketOpen = checkMarketOpen(time);

  return (
    <div className="h-6 bg-bloomberg-panel border-t border-bloomberg-border flex items-center px-3 gap-6 text-[10px] font-mono shrink-0">
      <span className={isMarketOpen ? "text-bloomberg-green" : "text-bloomberg-red"}>
        NYSE: {isMarketOpen ? "OPEN" : "CLOSED"}
      </span>
      <span className="text-bloomberg-muted">
        {time.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour12: false })} ET
      </span>
      <span className="flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-bloomberg-green" : "bg-bloomberg-red"}`} />
        <span className="text-bloomberg-muted">WS</span>
      </span>
      <span className="text-bloomberg-muted uppercase">{layout}</span>
      <span className="ml-auto text-bloomberg-muted">
        {time.toLocaleDateString("en-US", { timeZone: "America/New_York" })}
      </span>
    </div>
  );
}

function checkMarketOpen(now: Date): boolean {
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  if (day === 0 || day === 6) return false;
  const hours = et.getHours();
  const minutes = et.getMinutes();
  const timeNum = hours * 60 + minutes;
  return timeNum >= 570 && timeNum < 960;
}
