import { formatPrice, formatChange, formatPercent, getChangeColor } from "@/lib/formatters";

interface PriceDisplayProps {
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({ price, change, changePercent, currency = "USD", size = "md" }: PriceDisplayProps) {
  const changeColor = getChangeColor(change);
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-bold text-bloomberg-white ${sizeClasses[size]}`}>
        {currency === "USD" ? "$" : ""}{formatPrice(price)}
      </span>
      <span className={`${changeColor} text-sm font-medium`}>
        {formatChange(change)}
      </span>
      <span className={`${changeColor} text-sm`}>
        ({formatPercent(changePercent)})
      </span>
    </div>
  );
}
