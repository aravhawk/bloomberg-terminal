"use client";
import { useTerminalStore } from "@/store/terminalStore";
import { FunctionRouter } from "./FunctionRouter";
import type { PanelState } from "@/lib/types";
import { X, Plus, Maximize2, Minimize2 } from "lucide-react";

interface PanelProps {
  panelState: PanelState;
  isActive: boolean;
}

export function Panel({ panelState, isActive }: PanelProps) {
  const { setActivePanelId, setActiveTab, closeTab, addTab, fullscreenPanelId, setFullscreenPanel } = useTerminalStore();
  const activeTab = panelState.tabs.find((t) => t.id === panelState.activeTabId);
  const isFullscreen = fullscreenPanelId === panelState.id;

  return (
    <div
      className={`flex flex-col overflow-hidden border ${
        isActive ? "border-bloomberg-amber" : "border-bloomberg-border"
      }`}
      onClick={() => setActivePanelId(panelState.id)}
    >
      {/* Tab bar */}
      <div className="flex items-center bg-bloomberg-panel border-b border-bloomberg-border shrink-0 h-6">
        <div className="flex-1 flex items-center overflow-x-auto gap-0">
          {panelState.tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-1 px-2 h-6 cursor-pointer text-[10px] uppercase shrink-0 border-r border-bloomberg-border ${
                tab.id === panelState.activeTabId
                  ? "bg-bloomberg-panel-alt text-bloomberg-amber border-b-2 border-b-bloomberg-amber"
                  : "text-bloomberg-muted hover:text-bloomberg-white"
              }`}
              onClick={(e) => { e.stopPropagation(); setActiveTab(panelState.id, tab.id); }}
            >
              <span className="truncate max-w-24">{tab.title}</span>
              {panelState.tabs.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(panelState.id, tab.id); }}
                  className="hover:text-bloomberg-red ml-1"
                >
                  <X size={8} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-0.5 px-1 shrink-0">
          <span className={`text-[9px] font-bold px-1 ${isActive ? "text-bloomberg-amber" : "text-bloomberg-muted"}`}>
            {panelState.group}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); addTab(panelState.id, "TOP", null); }}
            className="text-bloomberg-muted hover:text-bloomberg-amber p-0.5"
          >
            <Plus size={10} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setFullscreenPanel(isFullscreen ? null : panelState.id); }}
            className="text-bloomberg-muted hover:text-bloomberg-amber p-0.5"
          >
            {isFullscreen ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-bloomberg-black">
        {activeTab ? (
          <FunctionRouter
            functionCode={activeTab.functionCode}
            security={activeTab.security}
          />
        ) : (
          <div className="p-4 text-bloomberg-muted">No active tab</div>
        )}
      </div>
    </div>
  );
}
