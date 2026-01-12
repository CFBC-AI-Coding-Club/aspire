import { createFileRoute } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../../components/ui/Button";
import { Card, CardTitle, StatCard } from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import { useUserProfileQuery } from "../../hooks/queries/useUsersQuery";
import { useStocksQuery } from "../../hooks/queries/useStocksQuery";
import {
  formatCurrency,
  formatPercent,
} from "../../data/mockStocks";

export const Route = createFileRoute("/_app/portfolio")({
  component: PortfolioPage,
});

type TimeRange = "1W" | "1M" | "3M" | "1Y" | "ALL";

// Generate mock portfolio history
function generatePortfolioHistory(days: number) {
  const data = [];
  let value = 10000;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = days; i >= 0; i--) {
    const change = (Math.random() - 0.48) * 500;
    value = Math.max(value + change, 8000);
    data.push({
      date: new Date(now - i * dayMs).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: Number(value.toFixed(2)),
    });
  }
  return data;
}

// Holding type from backend
type PortfolioItem = {
	id: string;
	ticker: string;
	quantity: number;
	avgPrice: number;
};

// Holding Row Component
function HoldingRow({ 
  holding, 
  currentPrice 
}: { 
  holding: PortfolioItem;
  currentPrice: number;
}) {
  const totalValue = holding.quantity * currentPrice;
  const totalCost = holding.quantity * holding.avgPrice;
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
  const isPositive = gainLossPercent >= 0;

  return (
    <tr className="border-b border-[#1a1a1a] hover:bg-[#121212] transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center font-bold text-white">
            {holding.ticker.slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-white">{holding.ticker}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <p className="text-white font-mono">{holding.quantity}</p>
      </td>
      <td className="py-4 px-4 hidden md:table-cell">
        <p className="text-[#9a9a9a] font-mono">
          {formatCurrency(holding.avgPrice)}
        </p>
      </td>
      <td className="py-4 px-4">
        <p className="text-white font-mono">
          {formatCurrency(currentPrice)}
        </p>
      </td>
      <td className="py-4 px-4">
        <p className="text-white font-semibold font-mono">
          {formatCurrency(totalValue)}
        </p>
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
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          <span>{formatPercent(gainLossPercent)}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            Buy
          </Button>
          <Button variant="ghost" size="sm">
            Sell
          </Button>
        </div>
      </td>
    </tr>
  );
}

// Pie chart colors
const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#FBBF24",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

function PortfolioPage() {
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfileQuery();
  const { data: stocks } = useStocksQuery(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");

  // Get current prices for holdings
  const stockPrices = useMemo(() => {
    if (!stocks) return new Map();
    return new Map(stocks.map(s => [s.ticker, s.price]));
  }, [stocks]);

  // Calculate portfolio data
  const portfolioData = useMemo(() => {
    if (!userProfile?.portfolio) {
      return {
        holdings: [],
        totalValue: 0,
        totalInvested: 0,
        totalReturn: 0,
        totalReturnPercent: 0,
      };
    }

    const holdings = userProfile.portfolio.map(item => {
      const currentPrice = stockPrices.get(item.ticker) || item.avgPrice;
      const totalValue = item.quantity * currentPrice;
      const totalCost = item.quantity * item.avgPrice;
      return {
        ...item,
        currentPrice,
        totalValue,
        totalCost,
      };
    });

    const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
    const totalInvested = holdings.reduce((sum, h) => sum + h.totalCost, 0);
    const totalReturn = totalValue - totalInvested;
    const totalReturnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    return {
      holdings,
      totalValue,
      totalInvested,
      totalReturn,
      totalReturnPercent,
    };
  }, [userProfile, stockPrices]);

  const portfolioHistory = generatePortfolioHistory(
    { "1W": 7, "1M": 30, "3M": 90, "1Y": 365, ALL: 365 }[timeRange],
  );

  // Calculate allocation data for pie chart
  const allocationData = portfolioData.holdings.map((h, i) => ({
    name: h.ticker,
    value: h.totalValue,
    color: COLORS[i % COLORS.length],
  }));

  // Calculate monthly performance for bar chart
  const monthlyPerformance = [
    { month: "Jul", return: 5.2 },
    { month: "Aug", return: -2.1 },
    { month: "Sep", return: 8.4 },
    { month: "Oct", return: 3.7 },
    { month: "Nov", return: -1.5 },
    { month: "Dec", return: 6.8 },
  ];

  const isPortfolioPositive = portfolioData.totalReturnPercent >= 0;
  const currentValue = portfolioData.totalValue + (userProfile?.balance || 0);
  const todayChange =
    currentValue -
    (portfolioHistory[portfolioHistory.length - 2]?.value || currentValue);
  const todayChangePercent = (currentValue - todayChange) > 0 
    ? (todayChange / (currentValue - todayChange)) * 100 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Portfolio</h1>
          <p className="text-[#6a6a6a]">
            Track your investments and performance
          </p>
        </div>
      </div>

      {/* Portfolio Value & Stats */}
      <div className="grid lg:grid-cols-4 gap-4">
        {/* Main Portfolio Card */}
        <Card className="lg:col-span-2" variant="elevated">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[#6a6a6a] text-sm mb-1">
                Total Portfolio Value
              </p>
              <p className="text-4xl font-bold text-white font-tabular">
                {formatCurrency(currentValue)}
              </p>
              <div
                className={clsx(
                  "flex items-center gap-2 mt-2",
                  isPortfolioPositive ? "text-[#22C55E]" : "text-[#EF4444]",
                )}
              >
                {isPortfolioPositive ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {isPortfolioPositive ? "+" : ""}
                  {formatCurrency(portfolioData.totalReturn)} (
                  {formatPercent(portfolioData.totalReturnPercent)})
                </span>
                <span className="text-[#6a6a6a]">all time</span>
              </div>
            </div>
            <div
              className={clsx(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                "bg-gradient-to-br",
                isPortfolioPositive
                  ? "from-[#22C55E]/20 to-[#16A34A]/20"
                  : "from-[#EF4444]/20 to-[#DC2626]/20",
              )}
            >
              <Wallet
                className={clsx(
                  "w-8 h-8",
                  isPortfolioPositive ? "text-[#22C55E]" : "text-[#EF4444]",
                )}
              />
            </div>
          </div>

          {/* Time Range Buttons */}
          <div className="flex gap-1 bg-[#121212] p-1 rounded-lg mb-4 w-fit">
            {(["1W", "1M", "3M", "1Y", "ALL"] as TimeRange[]).map((range) => (
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
            ))}
          </div>

          {/* Portfolio Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioHistory}>
                <defs>
                  <linearGradient
                    id="portfolioGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis
                  dataKey="date"
                  stroke="#4a4a4a"
                  tick={{ fill: "#6a6a6a", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#4a4a4a"
                  tick={{ fill: "#6a6a6a", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Value",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#portfolioGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <StatCard
            label="Today's Change"
            value={formatCurrency(Math.abs(todayChange))}
            change={todayChangePercent}
            icon="📈"
          />
          <StatCard
            label="Available Cash"
            value={formatCurrency(userProfile?.balance || 0)}
            icon="💵"
          />
        </div>

        <div className="space-y-4">
          <StatCard
            label="Total Invested"
            value={formatCurrency(portfolioData.totalInvested)}
            icon="💰"
          />
          <StatCard
            label="Holdings"
            value={portfolioData.holdings.length}
            icon="📊"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Allocation Pie Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-[#60A5FA]" />
            <CardTitle>Asset Allocation</CardTitle>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={allocationData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#9a9a9a] text-sm">{item.name}</span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {portfolioData.totalValue > 0 
                      ? ((item.value / portfolioData.totalValue) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Monthly Performance Bar Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#60A5FA]" />
            <CardTitle>Monthly Returns</CardTitle>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis
                  dataKey="month"
                  stroke="#4a4a4a"
                  tick={{ fill: "#6a6a6a", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#4a4a4a"
                  tick={{ fill: "#6a6a6a", fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Return"]}
                />
                <Bar dataKey="return" radius={[4, 4, 0, 0]} fill="#3B82F6">
                  {monthlyPerformance.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.return >= 0 ? "#22C55E" : "#EF4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card padding="none">
        <div className="p-6 border-b border-[#2a2a2a]">
          <CardTitle>Holdings</CardTitle>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left py-4 px-4 text-[#6a6a6a] text-sm font-medium">
                  Asset
                </th>
                <th className="text-left py-4 px-4 text-[#6a6a6a] text-sm font-medium">
                  Quantity
                </th>
                <th className="text-left py-4 px-4 text-[#6a6a6a] text-sm font-medium hidden md:table-cell">
                  Avg Cost
                </th>
                <th className="text-left py-4 px-4 text-[#6a6a6a] text-sm font-medium">
                  Current Price
                </th>
                <th className="text-left py-4 px-4 text-[#6a6a6a] text-sm font-medium">
                  Total Value
                </th>
                <th className="text-left py-4 px-4 text-[#6a6a6a] text-sm font-medium">
                  Gain/Loss
                </th>
                <th className="text-left py-4 px-4 text-[#6a6a6a] text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingProfile ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]" />
                    </div>
                  </td>
                </tr>
              ) : portfolioData.holdings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6a6a6a]">
                    No holdings yet. Start trading to build your portfolio!
                  </td>
                </tr>
              ) : (
                portfolioData.holdings.map((holding) => (
                  <HoldingRow 
                    key={holding.id} 
                    holding={holding}
                    currentPrice={holding.currentPrice}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-[#60A5FA]" />
          <CardTitle>Recent Transactions</CardTitle>
        </div>
        <div className="space-y-3">
          {!userProfile?.transactions || userProfile.transactions.length === 0 ? (
            <div className="text-center py-8 text-[#6a6a6a]">
              No transactions yet
            </div>
          ) : (
            userProfile.transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-[#121212] rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      tx.type === "BUY"
                        ? "bg-[#22C55E]/20 text-[#22C55E]"
                        : "bg-[#EF4444]/20 text-[#EF4444]",
                    )}
                  >
                    {tx.type === "BUY" ? (
                      <ArrowDownRight className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {tx.type} {tx.ticker}
                    </p>
                    <p className="text-sm text-[#6a6a6a]">
                      {tx.quantity} shares @ {formatCurrency(tx.price)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={clsx(
                      "font-semibold",
                      tx.type === "BUY" ? "text-[#EF4444]" : "text-[#22C55E]",
                    )}
                  >
                    {tx.type === "BUY" ? "-" : "+"}
                    {formatCurrency(tx.total)}
                  </p>
                  <p className="text-sm text-[#6a6a6a]">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Stats Panel */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-[#60A5FA]" />
          <CardTitle>Performance Statistics</CardTitle>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-[#6a6a6a] text-sm mb-1">Total Trades</p>
            <p className="text-2xl font-bold text-white">
              {userProfile?.transactions?.length || 0}
            </p>
          </div>
          <div>
            <p className="text-[#6a6a6a] text-sm mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-[#22C55E]">67%</p>
          </div>
          <div>
            <p className="text-[#6a6a6a] text-sm mb-1">Best Trade</p>
            <p className="text-2xl font-bold text-[#22C55E]">+$601.76</p>
          </div>
          <div>
            <p className="text-[#6a6a6a] text-sm mb-1">Worst Trade</p>
            <p className="text-2xl font-bold text-[#EF4444]">-$126.50</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
