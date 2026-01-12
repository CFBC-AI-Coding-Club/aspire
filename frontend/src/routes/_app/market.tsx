import { createFileRoute } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
  Activity,
  ArrowUpDown,
  Grid,
  List,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../../components/ui/Button";
import { Card, CardTitle } from "../../components/ui/Card";
import { Input, SearchInput, Select } from "../../components/ui/Input";
import { useAuth } from "../../contexts/AuthContext";
import {
  useStocksQuery,
  useStockHistoryQuery,
} from "../../hooks/queries/useStocksQuery";
import { useExecuteTradeMutation } from "../../hooks/queries/useTradesQuery";
import { useUserProfileQuery } from "../../hooks/queries/useUsersQuery";
import {
  formatCurrency,
  formatLargeNumber,
  formatPercent,
  formatVolume,
  sectors,
} from "../../data/mockStocks";

export const Route = createFileRoute("/_app/market")({
  component: MarketPage,
});

// Stock type from backend
type Stock = {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  sector: string;
  volatility: "low" | "medium" | "high";
  description?: string;
};

type ViewMode = "grid" | "list";
type SortField = "symbol" | "price" | "change" | "volume";
type SortOrder = "asc" | "desc";
type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

// Sparkline component
function Sparkline({
  data,
  color,
  height = 40,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Stock Grid Card
function StockGridCard({
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
          <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-xl font-bold">
            {stock.ticker.slice(0, 2)}
          </div>
          <div>
            <p className="font-bold text-white">{stock.ticker}</p>
            <p className="text-sm text-[#6a6a6a] truncate max-w-[100px]">
              {stock.name}
            </p>
          </div>
        </div>
      </div>

      <div className="h-10 mb-4">
        <Sparkline
          data={sparklineData}
          color={isPositive ? "#22C55E" : "#EF4444"}
        />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold text-white font-tabular">
            {formatCurrency(stock.price)}
          </p>
        </div>
        <div
          className={clsx(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium",
            isPositive
              ? "bg-[#22C55E]/10 text-[#22C55E]"
              : "bg-[#EF4444]/10 text-[#EF4444]",
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

// Stock List Row
function StockListRow({
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
      className="border-b border-[#1a1a1a] hover:bg-[#121212] cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-lg font-bold">
            {stock.ticker.slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-white">{stock.ticker}</p>
            <p className="text-sm text-[#6a6a6a]">{stock.name}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <p className="text-white font-mono">{formatCurrency(stock.price)}</p>
      </td>
      <td className="py-4 px-4">
        <div
          className={clsx(
            "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium",
            isPositive
              ? "bg-[#22C55E]/10 text-[#22C55E]"
              : "bg-[#EF4444]/10 text-[#EF4444]",
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
            color={isPositive ? "#22C55E" : "#EF4444"}
            height={32}
          />
        </div>
      </td>
      <td className="py-4 px-4 hidden lg:table-cell">
        <p className="text-[#9a9a9a]">{formatVolume(stock.volume)}</p>
      </td>
      <td className="py-4 px-4">
        <span className="px-2 py-1 rounded-lg bg-[#2a2a2a] text-[#6a6a6a] text-xs">
          {stock.sector}
        </span>
      </td>
    </tr>
  );
}

// Stock Detail Modal
function StockDetailModal({
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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a] w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#2a2a2a] p-6 flex items-start justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-2xl font-bold">
              {stock.ticker.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white">
                  {stock.ticker}
                </h2>
                <span className="px-2 py-1 rounded-lg bg-[#2a2a2a] text-[#6a6a6a] text-sm">
                  {stock.sector}
                </span>
              </div>
              <p className="text-[#6a6a6a]">{stock.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#1a1a1a] text-[#6a6a6a] hover:text-white transition-colors"
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
                <p className="text-4xl font-bold text-white font-tabular">
                  {formatCurrency(stock.price)}
                </p>
                <div
                  className={clsx(
                    "flex items-center gap-2 mt-2",
                    isPositive ? "text-[#22C55E]" : "text-[#EF4444]",
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
                  <span className="text-[#6a6a6a]">today</span>
                </div>
              </div>

              {/* Time Range Buttons */}
              <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-lg">
                {(["1D", "1W", "1M", "3M", "1Y", "ALL"] as TimeRange[]).map(
                  (range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={clsx(
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        timeRange === range
                          ? "bg-[#3B82F6] text-white"
                          : "text-[#6a6a6a] hover:text-white",
                      )}
                    >
                      {range}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 bg-[#121212] rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isPositive ? "#22C55E" : "#EF4444"}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={isPositive ? "#22C55E" : "#EF4444"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis
                    dataKey="date"
                    stroke="#4a4a4a"
                    tick={{ fill: "#6a6a6a", fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#4a4a4a"
                    tick={{ fill: "#6a6a6a", fontSize: 12 }}
                    tickLine={false}
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                    labelStyle={{ color: "#fff" }}
                    itemStyle={{ color: isPositive ? "#22C55E" : "#EF4444" }}
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Price",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? "#22C55E" : "#EF4444"}
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Stock Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#121212] rounded-xl p-4">
                <p className="text-[#6a6a6a] text-sm mb-1">Current Price</p>
                <p className="text-white font-semibold">
                  {formatCurrency(stock.price)}
                </p>
              </div>
              <div className="bg-[#121212] rounded-xl p-4">
                <p className="text-[#6a6a6a] text-sm mb-1">Volume</p>
                <p className="text-white font-semibold">
                  {formatVolume(stock.volume)}
                </p>
              </div>
              <div className="bg-[#121212] rounded-xl p-4">
                <p className="text-[#6a6a6a] text-sm mb-1">Volatility</p>
                <p
                  className={clsx(
                    "font-semibold capitalize",
                    stock.volatility === "low" && "text-[#22C55E]",
                    stock.volatility === "medium" && "text-[#FBBF24]",
                    stock.volatility === "high" && "text-[#EF4444]",
                  )}
                >
                  {stock.volatility}
                </p>
              </div>
              <div className="bg-[#121212] rounded-xl p-4">
                <p className="text-[#6a6a6a] text-sm mb-1">Sector</p>
                <p className="text-white font-semibold">{stock.sector}</p>
              </div>
            </div>

            {/* Description */}
            {stock.description && (
              <div className="bg-[#121212] rounded-xl p-4">
                <p className="text-[#6a6a6a] text-sm mb-2">
                  About {stock.name}
                </p>
                <p className="text-white leading-relaxed">
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
                  <label className="block text-sm font-medium text-[#e0e0e0] mb-2">
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

                <div className="bg-[#121212] rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6a6a6a]">Price per share</span>
                    <span className="text-white font-mono">
                      {formatCurrency(stock.price)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6a6a6a]">Quantity</span>
                    <span className="text-white">× {quantity || 0}</span>
                  </div>
                  <div className="border-t border-[#2a2a2a] pt-3 flex justify-between">
                    <span className="font-medium text-white">Total</span>
                    <span className="font-bold text-white font-mono">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-[#6a6a6a]">
                    Available Balance
                  </span>
                  <span
                    className={clsx(
                      "font-mono font-medium",
                      canAfford ? "text-[#22C55E]" : "text-[#EF4444]",
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
                  <p className="text-sm text-[#EF4444] text-center">
                    Insufficient balance for this trade
                  </p>
                )}
              </div>
            </Card>

            {/* Quick Info */}
            <Card>
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-[#60A5FA]" />
                <span className="font-medium text-white">Market Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-sm text-[#6a6a6a]">Market Open</span>
              </div>
              <p className="text-xs text-[#4a4a4a] mt-2">
                Trading simulation - prices update regularly
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketPage() {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortField, setSortField] = useState<SortField>("change");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const { data: stocks, isLoading: isLoadingStocks } = useStocksQuery(true);

  // Filter and sort stocks
  const filteredStocks = useMemo(() => {
    if (!stocks) return [];
    let result = [...stocks];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.ticker.toLowerCase().includes(searchLower) ||
          s.name.toLowerCase().includes(searchLower),
      );
    }

    // Sector filter
    if (selectedSector !== "all") {
      result = result.filter((s) => s.sector === selectedSector);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortField) {
        case "symbol":
          return sortOrder === "asc"
            ? a.ticker.localeCompare(b.ticker)
            : b.ticker.localeCompare(a.ticker);
        case "price":
          aVal = a.price;
          bVal = b.price;
          break;
        case "change":
          aVal = a.price > 0 ? (a.change / a.price) * 100 : 0;
          bVal = b.price > 0 ? (b.change / b.price) * 100 : 0;
          break;
        case "volume":
          aVal = a.volume;
          bVal = b.volume;
          break;
        default:
          return 0;
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [stocks, search, selectedSector, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Market</h1>
        <p className="text-[#6a6a6a]">
          Browse and invest in {stocks?.length || 0} available stocks
        </p>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search stocks by name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select
              options={[
                { value: "all", label: "All Sectors" },
                ...sectors.map((s) => ({ value: s, label: s })),
              ]}
              value={selectedSector}
              onChange={setSelectedSector}
            />

            <Select
              options={[
                { value: "change", label: "Sort by Change" },
                { value: "price", label: "Sort by Price" },
                { value: "volume", label: "Sort by Volume" },
                { value: "symbol", label: "Sort Alphabetically" },
              ]}
              value={sortField}
              onChange={(v) => setSortField(v as SortField)}
            />

            <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-[#2a2a2a]">
              <button
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid"
                    ? "bg-[#3B82F6] text-white"
                    : "text-[#6a6a6a] hover:text-white",
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={clsx(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "list"
                    ? "bg-[#3B82F6] text-white"
                    : "text-[#6a6a6a] hover:text-white",
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-[#6a6a6a]">
        Showing {filteredStocks.length} of {stocks?.length || 0} stocks
      </p>

      {/* Stock Grid View */}
      {viewMode === "grid" && (
        <>
          {isLoadingStocks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="h-48 animate-pulse bg-[#121212]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStocks.map((stock) => (
                <StockGridCard
                  key={stock.id}
                  stock={stock}
                  onClick={() => setSelectedStock(stock)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Stock List View */}
      {viewMode === "list" && (
        <>
          {isLoadingStocks ? (
            <Card className="h-96 animate-pulse bg-[#121212]" />
          ) : (
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2a2a]">
                      <th className="text-left py-4 px-4">
                        <button
                          onClick={() => handleSort("symbol")}
                          className="flex items-center gap-1 text-[#6a6a6a] hover:text-white"
                        >
                          Stock
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="text-left py-4 px-4">
                        <button
                          onClick={() => handleSort("price")}
                          className="flex items-center gap-1 text-[#6a6a6a] hover:text-white"
                        >
                          Price
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="text-left py-4 px-4">
                        <button
                          onClick={() => handleSort("change")}
                          className="flex items-center gap-1 text-[#6a6a6a] hover:text-white"
                        >
                          Change
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="text-left py-4 px-4 hidden md:table-cell">
                        Chart
                      </th>
                      <th className="text-left py-4 px-4 hidden lg:table-cell">
                        <button
                          onClick={() => handleSort("volume")}
                          className="flex items-center gap-1 text-[#6a6a6a] hover:text-white"
                        >
                          Volume
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="text-left py-4 px-4">Sector</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map((stock) => (
                      <StockListRow
                        key={stock.id}
                        stock={stock}
                        onClick={() => setSelectedStock(stock)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {filteredStocks.length === 0 && (
        <Card className="py-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No stocks found
          </h3>
          <p className="text-[#6a6a6a]">Try adjusting your search or filters</p>
        </Card>
      )}

      {/* Stock Detail Modal */}
      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}
