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
    <tr className="border-b border-[#482977]/5 hover:bg-[#f8f9fc] transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#482977]/10 flex items-center justify-center font-bold text-[#482977]">
            {holding.ticker.slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-[#1a1a2e]">{holding.ticker}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <p className="text-[#1a1a2e] font-mono">{holding.quantity}</p>
      </td>
      <td className="py-4 px-4 hidden md:table-cell">
        <p className="text-[#566279] font-mono">
          {formatCurrency(holding.avgPrice)}
        </p>
      </td>
      <td className="py-4 px-4">
        <p className="text-[#1a1a2e] font-mono">
          {formatCurrency(currentPrice)}
        </p>
      </td>
      <td className="py-4 px-4">
        <p className="text-[#1a1a2e] font-semibold font-mono">
          {formatCurrency(totalValue)}
        </p>
      </td>
      <td className="py-4 px-4">
        <div
          className={clsx(
            "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium",
            isPositive
              ? "bg-[#16a34a]/10 text-[#16a34a]"
              : "bg-[#dc2626]/10 text-[#dc2626]",
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
  "#482977",
  "#16a34a",
  "#c22f99",
  "#dc2626",
  "#6b42a1",
  "#d94db3",
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
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-1">Portfolio</h1>
          <p className="text-[#7a8aa3]">
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
              <p className="text-[#7a8aa3] text-sm mb-1">
                Total Portfolio Value
              </p>
              <p className="text-4xl font-bold text-[#1a1a2e] font-tabular">
                {formatCurrency(currentValue)}
              </p>
              <div
                className={clsx(
                  "flex items-center gap-2 mt-2",
                  isPortfolioPositive ? "text-[#16a34a]" : "text-[#dc2626]",
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
                <span className="text-[#7a8aa3]">all time</span>
              </div>
            </div>
            <div
              className={clsx(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                "bg-gradient-to-br",
                isPortfolioPositive
                  ? "from-[#16a34a]/10 to-[#15803d]/10"
                  : "from-[#dc2626]/10 to-[#b91c1c]/10",
              )}
            >
              <Wallet
                className={clsx(
                  "w-8 h-8",
                  isPortfolioPositive ? "text-[#16a34a]" : "text-[#dc2626]",
                )}
              />
            </div>
          </div>

          {/* Time Range Buttons */}
          <div className="flex gap-1 bg-[#f8f9fc] p-1 rounded-lg mb-4 w-fit">
            {(["1W", "1M", "3M", "1Y", "ALL"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={clsx(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  timeRange === range
                    ? "bg-[#482977] text-white"
                    : "text-[#7a8aa3] hover:text-[#1a1a2e]",
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
                    <stop offset="5%" stopColor="#482977" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#482977" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" />
                <XAxis
                  dataKey="date"
                  stroke="#c5cee0"
                  tick={{ fill: "#7a8aa3", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#c5cee0"
                  tick={{ fill: "#7a8aa3", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e8ecf4",
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
                  stroke="#482977"
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
            <PieChart className="w-5 h-5 text-[#482977]" />
            <CardTitle>Asset Allocation</CardTitle>
          </div>
          {allocationData.length > 0 ? (
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
                      <span className="text-[#566279] text-sm">{item.name}</span>
                    </div>
                    <span className="text-[#1a1a2e] font-medium text-sm">
                      {portfolioData.totalValue > 0 
                        ? ((item.value / portfolioData.totalValue) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#7a8aa3]">
              <p>No holdings yet. Start investing!</p>
            </div>
          )}
        </Card>

        {/* Performance Stats */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#482977]" />
            <CardTitle>Performance Stats</CardTitle>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-[#f8f9fc] rounded-xl">
              <span className="text-[#7a8aa3]">Total Return</span>
              <span className={clsx(
                "font-semibold",
                isPortfolioPositive ? "text-[#16a34a]" : "text-[#dc2626]"
              )}>
                {formatPercent(portfolioData.totalReturnPercent)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#f8f9fc] rounded-xl">
              <span className="text-[#7a8aa3]">Total Invested</span>
              <span className="font-semibold text-[#1a1a2e]">
                {formatCurrency(portfolioData.totalInvested)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#f8f9fc] rounded-xl">
              <span className="text-[#7a8aa3]">Current Value</span>
              <span className="font-semibold text-[#1a1a2e]">
                {formatCurrency(portfolioData.totalValue)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#f8f9fc] rounded-xl">
              <span className="text-[#7a8aa3]">Holdings</span>
              <span className="font-semibold text-[#1a1a2e]">
                {portfolioData.holdings.length}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card padding="none">
        <div className="p-6 border-b border-[#482977]/10">
          <CardTitle>Holdings</CardTitle>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#482977]/10">
                <th className="text-left py-4 px-4 text-[#7a8aa3] text-sm font-medium">
                  Asset
                </th>
                <th className="text-left py-4 px-4 text-[#7a8aa3] text-sm font-medium">
                  Quantity
                </th>
                <th className="text-left py-4 px-4 text-[#7a8aa3] text-sm font-medium hidden md:table-cell">
                  Avg Cost
                </th>
                <th className="text-left py-4 px-4 text-[#7a8aa3] text-sm font-medium">
                  Current Price
                </th>
                <th className="text-left py-4 px-4 text-[#7a8aa3] text-sm font-medium">
                  Total Value
                </th>
                <th className="text-left py-4 px-4 text-[#7a8aa3] text-sm font-medium">
                  Gain/Loss
                </th>
                <th className="text-left py-4 px-4 text-[#7a8aa3] text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingProfile ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#482977]" />
                    </div>
                  </td>
                </tr>
              ) : portfolioData.holdings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7a8aa3]">
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
          <Activity className="w-5 h-5 text-[#482977]" />
          <CardTitle>Recent Transactions</CardTitle>
        </div>
        <div className="space-y-3">
          {!userProfile?.transactions || userProfile.transactions.length === 0 ? (
            <div className="text-center py-8 text-[#7a8aa3]">
              No transactions yet
            </div>
          ) : (
            userProfile.transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-[#f8f9fc] rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      tx.type === "BUY"
                        ? "bg-[#16a34a]/10 text-[#16a34a]"
                        : "bg-[#dc2626]/10 text-[#dc2626]",
                    )}
                  >
                    {tx.type === "BUY" ? (
                      <ArrowDownRight className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[#1a1a2e]">
                      {tx.type} {tx.ticker}
                    </p>
                    <p className="text-sm text-[#7a8aa3]">
                      {tx.quantity} shares @ {formatCurrency(tx.price)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={clsx(
                      "font-semibold",
                      tx.type === "BUY" ? "text-[#dc2626]" : "text-[#16a34a]",
                    )}
                  >
                    {tx.type === "BUY" ? "-" : "+"}
                    {formatCurrency(tx.total)}
                  </p>
                  <p className="text-sm text-[#7a8aa3]">
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
          <Target className="w-5 h-5 text-[#482977]" />
          <CardTitle>Performance Statistics</CardTitle>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-[#7a8aa3] text-sm mb-1">Total Trades</p>
            <p className="text-2xl font-bold text-[#1a1a2e]">
              {userProfile?.transactions?.length || 0}
            </p>
          </div>
          <div>
            <p className="text-[#7a8aa3] text-sm mb-1">Total Return</p>
            <p className={clsx(
              "text-2xl font-bold",
              isPortfolioPositive ? "text-[#16a34a]" : "text-[#dc2626]"
            )}>
              {formatPercent(portfolioData.totalReturnPercent)}
            </p>
          </div>
          <div>
            <p className="text-[#7a8aa3] text-sm mb-1">Best Holding</p>
            <p className="text-2xl font-bold text-[#16a34a]">
              {portfolioData.holdings.length > 0 
                ? portfolioData.holdings[0]?.ticker || '--'
                : '--'}
            </p>
          </div>
          <div>
            <p className="text-[#7a8aa3] text-sm mb-1">Cash Balance</p>
            <p className="text-2xl font-bold text-[#1a1a2e]">
              {formatCurrency(userProfile?.balance || 0)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
