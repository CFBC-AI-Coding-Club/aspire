import { formatCurrency, formatPercent, formatVolume } from "@/data/mockStocks";
import { useStockHistoryQuery } from "@/hooks/queries/useStocksQuery";
import { useExecuteTradeMutation } from "@/hooks/queries/useTradesQuery";
import { useUserProfileQuery } from "@/hooks/queries/useUsersQuery";
import { Stock } from "@/types/market";
import clsx from "clsx";
import { X, TrendingUp, TrendingDown, ShoppingCart, Activity } from "lucide-react";
import { useState, useMemo } from "react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { Button } from "../ui/Button";
import { Card, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

export function StockDetailModal({
  stock,
  onClose,
}: {
  stock: Stock;
  onClose: () => void;
}) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [quantity, setQuantity] = useState("1");
  const { data: userProfile } = useUserProfileQuery();
  const { data: stockHistory } = useStockHistoryQuery(stock.ticker);
  const executeTrade = useExecuteTradeMutation();

  const changePercent =
    stock.price > 0 ? (stock.change / stock.price) * 100 : 0;
  const isPositive = changePercent >= 0;

  // Get chart data based on time range
  const chartData = useMemo(() => {
    // Determine how many days to show based on time range
    const daysToShow = {
      "1D": 1,
      "1W": 7,
      "1M": 30,
      "3M": 90,
      "1Y": 365,
      ALL: Infinity,
    }[timeRange];

    if (!stockHistory || stockHistory.length === 0) {
      // Generate mock data if no history available
      return Array.from({ length: Math.min(daysToShow, 30) }, (_, i) => ({
        date: new Date(
          Date.now() - (Math.min(daysToShow, 30) - 1 - i) * 24 * 60 * 60 * 1000,
        ).toLocaleDateString(),
        price: stock.price + (Math.random() - 0.5) * stock.price * 0.1,
      }));
    }

    // Slice history based on selected time range
    const slicedHistory =
      daysToShow === Infinity ? stockHistory : stockHistory.slice(-daysToShow);

    return slicedHistory.map((point: { price: number; timestamp: string }) => ({
      date: new Date(point.timestamp).toLocaleDateString(),
      price: point.price,
    }));
  }, [stockHistory, stock.price, timeRange]);

  const total = parseFloat(quantity) * stock.price || 0;
  const canAfford = (userProfile?.balance || 0) >= total;

  const handleTrade = async (action: "BUY" | "SELL") => {
    try {
      await executeTrade.mutateAsync({
        ticker: stock.ticker,
        action,
        quantity: parseFloat(quantity),
      });
      onClose();
    } catch (error) {
      console.error("Trade error:", error);
      alert(error instanceof Error ? error.message : "Trade failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--color-base-900)] rounded-2xl border border-[var(--color-border)] w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-base-900)] border-b border-[var(--color-border)] p-6 flex items-start justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[var(--color-base-700)] flex items-center justify-center text-2xl font-bold text-[var(--color-primary)]">
              {stock.ticker.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {stock.ticker}
                </h2>
                <span className="px-2 py-1 rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-sm">
                  {stock.sector}
                </span>
              </div>
              <p className="text-[var(--color-text-muted)]">{stock.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-base-800)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price & Change */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-[var(--color-text-primary)] font-tabular">
                  {formatCurrency(stock.price)}
                </p>
                <div
                  className={clsx(
                    "flex items-center gap-2 mt-2",
                    isPositive ? "text-[var(--color-success)]" : "text-[var(--color-error)]",
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {isPositive ? "+" : ""}
                    {formatCurrency(stock.change)} (
                    {formatPercent(changePercent)})
                  </span>
                  <span className="text-[var(--color-text-muted)]">today</span>
                </div>
              </div>

              {/* Time Range Buttons */}
              <div className="flex gap-1 bg-[var(--color-base-800)] p-1 rounded-lg">
                {(["1D", "1W", "1M", "3M", "1Y", "ALL"] as TimeRange[]).map(
                  (range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={clsx(
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        timeRange === range
                          ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
                      )}
                    >
                      {range}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 bg-[var(--color-base-800)] rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isPositive ? "var(--color-success)" : "var(--color-error)"}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={isPositive ? "var(--color-success)" : "var(--color-error)"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    stroke="var(--color-base-400)"
                    tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--color-base-400)"
                    tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                    tickLine={false}
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-base-700)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                    labelStyle={{ color: "var(--color-text-primary)" }}
                    itemStyle={{ color: isPositive ? "var(--color-success)" : "var(--color-error)" }}
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Price",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? "var(--color-success)" : "var(--color-error)"}
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Stock Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--color-base-800)] rounded-xl p-4">
                <p className="text-[var(--color-text-muted)] text-sm mb-1">Current Price</p>
                <p className="text-[var(--color-text-primary)] font-semibold">
                  {formatCurrency(stock.price)}
                </p>
              </div>
              <div className="bg-[var(--color-base-800)] rounded-xl p-4">
                <p className="text-[var(--color-text-muted)] text-sm mb-1">Volume</p>
                <p className="text-[var(--color-text-primary)] font-semibold">
                  {formatVolume(stock.volume)}
                </p>
              </div>
              <div className="bg-[var(--color-base-800)] rounded-xl p-4">
                <p className="text-[var(--color-text-muted)] text-sm mb-1">Volatility</p>
                <p
                  className={clsx(
                    "font-semibold capitalize",
                    stock.volatility === "low" && "text-[var(--color-success)]",
                    stock.volatility === "medium" && "text-[var(--color-warning)]",
                    stock.volatility === "high" && "text-[var(--color-error)]",
                  )}
                >
                  {stock.volatility}
                </p>
              </div>
              <div className="bg-[var(--color-base-800)] rounded-xl p-4">
                <p className="text-[var(--color-text-muted)] text-sm mb-1">Sector</p>
                <p className="text-[var(--color-text-primary)] font-semibold">{stock.sector}</p>
              </div>
            </div>

            {/* Description */}
            {stock.description && (
              <div className="bg-[var(--color-base-800)] rounded-xl p-4">
                <p className="text-[var(--color-text-muted)] text-sm mb-2">
                  About {stock.name}
                </p>
                <p className="text-[var(--color-text-primary)] leading-relaxed">
                  {stock.description}
                </p>
              </div>
            )}
          </div>

          {/* Trade Section */}
          <div className="space-y-4">
            <Card variant="elevated">
              <CardTitle className="mb-4">Trade {stock.ticker}</CardTitle>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="bg-[var(--color-base-800)] rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Price per share</span>
                    <span className="text-[var(--color-text-primary)] font-mono">
                      {formatCurrency(stock.price)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Quantity</span>
                    <span className="text-[var(--color-text-primary)]">× {quantity || 0}</span>
                  </div>
                  <div className="border-t border-[var(--color-border)] pt-3 flex justify-between">
                    <span className="font-medium text-[var(--color-text-primary)]">Total</span>
                    <span className="font-bold text-[var(--color-text-primary)] font-mono">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <div className="bg-[var(--color-base-700)] rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">
                    Available Balance
                  </span>
                  <span
                    className={clsx(
                      "font-mono font-medium",
                      canAfford ? "text-[var(--color-success)]" : "text-[var(--color-error)]",
                    )}
                  >
                    {formatCurrency(userProfile?.balance || 0)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="success"
                    fullWidth
                    disabled={
                      !canAfford ||
                      !quantity ||
                      parseFloat(quantity) <= 0 ||
                      executeTrade.isPending
                    }
                    leftIcon={<ShoppingCart className="w-4 h-4" />}
                    onClick={() => handleTrade("BUY")}
                  >
                    {executeTrade.isPending ? "Trading..." : "Buy"}
                  </Button>
                  <Button
                    variant="danger"
                    fullWidth
                    disabled={
                      !quantity ||
                      parseFloat(quantity) <= 0 ||
                      executeTrade.isPending
                    }
                    onClick={() => handleTrade("SELL")}
                  >
                    {executeTrade.isPending ? "Trading..." : "Sell"}
                  </Button>
                </div>

                {!canAfford && total > 0 && (
                  <p className="text-sm text-[var(--color-error)] text-center">
                    Insufficient balance for this trade
                  </p>
                )}
              </div>
            </Card>

            {/* Quick Info */}
            <Card>
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="font-medium text-[var(--color-text-primary)]">Market Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                <span className="text-sm text-[var(--color-text-muted)]">Market Open</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-2">
                Trading simulation - prices update regularly
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
