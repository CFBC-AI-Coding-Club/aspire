import { formatCurrency, formatPercent, formatVolume } from "@/data/mockStocks";
import { Stock } from "@/types/market";
import clsx from "clsx";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Sparkline } from "./Sparkline";

export function StockListRow({
  stock,
  onClick,
}: {
  stock: Stock;
  onClick: () => void;
}) {
  const changePercent =
    stock.price > 0 ? (stock.change / stock.price) * 100 : 0;
  const isPositive = changePercent >= 0;

  // Generate simple sparkline data
  const sparklineData = Array.from({ length: 7 }, (_, i) => {
    const baseValue = stock.price - stock.change;
    const progress = (i / 6) * stock.change;
    return (
      baseValue +
      progress +
      (Math.random() - 0.5) * (Math.abs(stock.change) * 0.2)
    );
  });

  return (
    <tr
      className="border-b border-[var(--color-border)] hover:bg-[var(--color-base-800)] cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-base-700)] flex items-center justify-center text-lg font-bold text-[var(--color-primary)]">
            {stock.ticker.slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text-primary)]">{stock.ticker}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{stock.name}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <p className="text-[var(--color-text-primary)] font-mono">{formatCurrency(stock.price)}</p>
      </td>
      <td className="py-4 px-4">
        <div
          className={clsx(
            "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium",
            isPositive
              ? "bg-[var(--color-success-muted)] text-[var(--color-success)]"
              : "bg-[var(--color-error-muted)] text-[var(--color-error)]",
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{formatPercent(changePercent)}</span>
        </div>
      </td>
      <td className="py-4 px-4 hidden md:table-cell">
        <div className="w-24 h-8">
          <Sparkline
            data={sparklineData}
            color={isPositive ? "var(--color-success)" : "var(--color-error)"}
            height={32}
          />
        </div>
      </td>
      <td className="py-4 px-4 hidden lg:table-cell">
        <p className="text-[var(--color-text-secondary)]">{formatVolume(stock.volume)}</p>
      </td>
      <td className="py-4 px-4">
        <span className="px-2 py-1 rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-xs">
          {stock.sector}
        </span>
      </td>
    </tr>
  );
}