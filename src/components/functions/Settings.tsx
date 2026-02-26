"use client";
import { useSettingsStore } from "@/store/settingsStore";
import type { Security } from "@/lib/types";

export function Settings({ security }: { security?: Security | null }) {
  void security;
  const {
    finnhubKey, fmpKey, alphaVantageKey, fredKey,
    setApiKey,
    refreshInterval, flashPrices, compactMode, soundEnabled,
    setRefreshInterval, setFlashPrices, setCompactMode, setSoundEnabled,
  } = useSettingsStore();

  return (
    <div className="p-2 space-y-3 overflow-auto h-full">
      <div className="bb-section-header">TERMINAL SETTINGS</div>

      <div className="border border-bloomberg-border p-3 space-y-3">
        <div className="text-bloomberg-amber font-bold text-sm">API Keys</div>
        <div className="text-[10px] text-bloomberg-muted mb-2">
          API keys are stored locally in your browser. They are not sent to any external server.
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">Finnhub API Key</label>
            <input type="password" value={finnhubKey} onChange={(e) => setApiKey("finnhubKey", e.target.value)} className="bb-input w-80" placeholder="Enter Finnhub API key..." />
          </div>
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">FMP API Key</label>
            <input type="password" value={fmpKey} onChange={(e) => setApiKey("fmpKey", e.target.value)} className="bb-input w-80" placeholder="Enter FMP API key..." />
          </div>
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">Alpha Vantage API Key</label>
            <input type="password" value={alphaVantageKey} onChange={(e) => setApiKey("alphaVantageKey", e.target.value)} className="bb-input w-80" placeholder="Enter Alpha Vantage API key..." />
          </div>
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">FRED API Key</label>
            <input type="password" value={fredKey} onChange={(e) => setApiKey("fredKey", e.target.value)} className="bb-input w-80" placeholder="Enter FRED API key..." />
          </div>
        </div>
      </div>

      <div className="border border-bloomberg-border p-3 space-y-3">
        <div className="text-bloomberg-amber font-bold text-sm">Display</div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <label className="text-xs text-bloomberg-white w-48">Refresh Interval (seconds)</label>
            <input type="number" value={refreshInterval} onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 15)} className="bb-input w-20" min="5" max="300" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-bloomberg-white w-48">Flash Price Changes</label>
            <button onClick={() => setFlashPrices(!flashPrices)} className={`bb-btn text-[10px] ${flashPrices ? "bb-btn-active" : ""}`}>
              {flashPrices ? "ON" : "OFF"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-bloomberg-white w-48">Compact Mode</label>
            <button onClick={() => setCompactMode(!compactMode)} className={`bb-btn text-[10px] ${compactMode ? "bb-btn-active" : ""}`}>
              {compactMode ? "ON" : "OFF"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-bloomberg-white w-48">Sound Alerts</label>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`bb-btn text-[10px] ${soundEnabled ? "bb-btn-active" : ""}`}>
              {soundEnabled ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-bloomberg-muted px-1">
        Settings are persisted locally in your browser via localStorage.
      </div>
    </div>
  );
}
