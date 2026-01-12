import { formatCurrency, formatPercent } from "@/data/mockStocks";
import clsx from "clsx";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "../ui/Card";
import { Sparkline } from "./Sparkline";
import { Stock } from "@/types/market";

export function StockGridCard({
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
  const sparklineData = Array.from({ length: 14 }, (_, i) => {
    const baseValue = stock.price - stock.change;
    const progress = (i / 13) * stock.change;
    return (
      baseValue +
      progress +
      (Math.random() - 0.5) * (Math.abs(stock.change) * 0.2)
    );
  });

  return (
    <Card hover className="cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-base-700)] flex items-center justify-center text-xl font-bold text-[var(--color-primary)]">
            {stock.ticker.slice(0, 2)}
          </div>
          <div>
            <p className="font-bold text-[var(--color-text-primary)]">{stock.ticker}</p>
            <p className="text-sm text-[var(--color-text-muted)] truncate max-w-[100px]">
              {stock.name}
            </p>
          </div>
        </div>
      </div>

      <div className="h-10 mb-4">
        <Sparkline
          data={sparklineData}
          color={isPositive ? "var(--color-success)" : "var(--color-error)"}
        />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold text-[var(--color-text-primary)] font-tabular">
            {formatCurrency(stock.price)}
          </p>
        </div>
        <div
          className={clsx(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium",
            isPositive
              ? "bg-[var(--color-success-muted)] text-[var(--color-success)]"
              : "bg-[var(--color-error-muted)] text-[var(--color-error)]",
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{formatPercent(changePercent)}</span>
        </div>
      </div>
    </Card>
  );
}