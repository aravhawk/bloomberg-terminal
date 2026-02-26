import type { ReactNode } from "react";

interface KeyValueItem {
  label: string;
  value: ReactNode;
}

interface KeyValueGridProps {
  items: KeyValueItem[];
  columns?: 2 | 4;
}

export function KeyValueGrid({ items, columns = 2 }: KeyValueGridProps) {
  return (
    <div className={`grid ${columns === 4 ? "grid-cols-4" : "grid-cols-2"} gap-x-4 gap-y-1 p-2`}>
      {items.map((item, i) => (
        <div key={i} className="flex justify-between gap-2 py-0.5">
          <span className="text-bloomberg-amber text-[10px] font-bold uppercase whitespace-nowrap">
            {item.label}
          </span>
          <span className="text-bloomberg-white text-xs text-right font-mono">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
