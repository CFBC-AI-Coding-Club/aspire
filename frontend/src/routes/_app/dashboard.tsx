import { createFileRoute, Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Button } from "../../components/ui/Button";
import { Card, CardTitle, StatCard } from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import { useStocksQuery } from "../../hooks/queries/useStocksQuery";
import { useUserProfileQuery } from "../../hooks/queries/useUsersQuery";
import {
  formatCurrency,
  formatPercent,
  getSparklineData,
  type mockStocks,
} from "../../data/mockStocks";
import { useMemo } from "react";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

// Sparkline component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <ResponsiveContainer width="100%" height={40}>
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

// Stock Card Component
type Stock = {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  sector: string;
  volume: number;
};

function StockCard({ stock }: { stock: Stock }) {
  const changePercent =
    stock.price > 0 ? (stock.change / stock.price) * 100 : 0;
  const isPositive = changePercent >= 0;

  // Generate simple sparkline data from change
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
    <Link to="/market" search={{ stock: stock.ticker }}>
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-xl font-bold">
              {stock.ticker.slice(0, 2)}
            </div>
            <div>
              <p className="font-bold text-white">{stock.ticker}</p>
              <p className="text-sm text-[#6a6a6a] truncate max-w-[120px]">
                {stock.name}
              </p>
            </div>
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

        <div className="h-10 mb-4">
          <Sparkline
            data={sparklineData}
            color={isPositive ? "#22C55E" : "#EF4444"}
          />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-white font-tabular">
              {formatCurrency(stock.price)}
            </p>
            <p
              className={clsx(
                "text-sm font-medium",
                isPositive ? "text-[#22C55E]" : "text-[#EF4444]",
              )}
            >
              {isPositive ? "+" : ""}
              {formatCurrency(stock.change)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View
          </Button>
        </div>
      </Card>
    </Link>
  );
}

// Quick Action Card
function QuickActionCard({
  icon: Icon,
  title,
  description,
  to,
  gradient,
}: {
  icon: typeof Briefcase;
  title: string;
  description: string;
  to: string;
  gradient: string;
}) {
  return (
    <Link to={to}>
      <Card hover className="h-full group">
        <div
          className={clsx(
            "w-12 h-12 rounded-xl mb-4 flex items-center justify-center",
            "bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
            gradient,
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-[#6a6a6a]">{description}</p>
      </Card>
    </Link>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfileQuery();
  const { data: stocks, isLoading: isLoadingStocks } = useStocksQuery(true);

  const isParent = user?.accountType === "parent";

  // Get top performing stocks (highest percentage change)
  const topStocks = useMemo(() => {
    if (!stocks) return [];
    return [...stocks]
      .sort((a, b) => {
        const changeA = a.price > 0 ? (a.change / a.price) * 100 : 0;
        const changeB = b.price > 0 ? (b.change / b.price) * 100 : 0;
        return changeB - changeA;
      })
      .slice(0, 6);
  }, [stocks]);

  // Calculate portfolio stats from user profile
  const balance = userProfile?.balance || 0;

  // Calculate portfolio value using current stock prices (not avgPrice which is cost basis)
  const portfolioValue = useMemo(() => {
    if (!userProfile?.portfolio || !stocks) return 0;

    // Create a map of ticker -> current price for quick lookup
    const stockPrices = new Map<string, number>(
      stocks.map((s: Stock) => [s.ticker, s.price]),
    );

    return userProfile.portfolio.reduce(
      (
        sum: number,
        item: { ticker: string; quantity: number; avgPrice: number },
      ) => {
        const currentPrice = stockPrices.get(item.ticker) ?? item.avgPrice;
        return sum + item.quantity * currentPrice;
      },
      0,
    );
  }, [userProfile?.portfolio, stocks]);

  const totalValue = balance + portfolioValue;

  // Mock today's change for now (can be calculated from portfolio history later)
  const todayChange = 234.5;
  const todayChangePercent =
    totalValue > 0 ? (todayChange / totalValue) * 100 : 0;
  const totalReturn = portfolioValue > 0 ? portfolioValue - 10000 : 0;
  const totalReturnPercent =
    portfolioValue > 0 ? ((portfolioValue - 10000) / 10000) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-[#6a6a6a]">
            Here's what's happening with your investments today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/market">
            <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Market
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Portfolio Value"
          value={formatCurrency(totalValue)}
          change={todayChangePercent}
          icon="💰"
          accent="blue"
        />
        <StatCard
          label="Today's Change"
          value={formatCurrency(Math.abs(todayChange))}
          change={todayChangePercent}
          icon="📈"
        />
        <StatCard
          label="Total Return"
          value={formatCurrency(totalReturn)}
          change={totalReturnPercent}
          icon="🎯"
          accent="success"
        />
        <StatCard
          label="Available Cash"
          value={formatCurrency(balance)}
          icon="💵"
        />
      </div>

      {/* Top Stocks Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              Top Performing Stocks
            </h2>
            <p className="text-sm text-[#6a6a6a]">
              Highest gainers in the last 24 hours
            </p>
          </div>
          <Link to="/market">
            <Button
              variant="ghost"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All
            </Button>
          </Link>
        </div>

        {isLoadingStocks ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-48 animate-pulse bg-[#121212]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topStocks.map((stock) => (
              <StockCard key={stock.id} stock={stock} />
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={Briefcase}
            title="My Portfolio"
            description="View your holdings"
            to="/portfolio"
            gradient="from-[#3B82F6] to-[#2563EB]"
          />
          <QuickActionCard
            icon={Trophy}
            title="Leaderboard"
            description="See top investors"
            to="/leaderboard"
            gradient="from-[#FBBF24] to-[#F59E0B]"
          />
          <QuickActionCard
            icon={BookOpen}
            title="Learn"
            description="Investment guides"
            to="/guides"
            gradient="from-[#22C55E] to-[#16A34A]"
          />
          <QuickActionCard
            icon={Zap}
            title="Games"
            description="Practice trading"
            to="/games"
            gradient="from-[#8B5CF6] to-[#7C3AED]"
          />
        </div>
      </section>

      {/* Recent Activity & Tips Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardTitle className="mb-6">Recent Activity</CardTitle>
            <div className="space-y-4">
              {[
                {
                  type: "BUY",
                  symbol: "NVDA",
                  shares: 2,
                  price: 495.22,
                  time: "2 hours ago",
                },
                {
                  type: "SELL",
                  symbol: "AAPL",
                  shares: 5,
                  price: 178.72,
                  time: "5 hours ago",
                },
                {
                  type: "BUY",
                  symbol: "MSFT",
                  shares: 3,
                  price: 378.91,
                  time: "Yesterday",
                },
                {
                  type: "achievement",
                  title: "First Trade!",
                  desc: "Completed your first stock trade",
                  time: "2 days ago",
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className={clsx(
                    "flex items-center justify-between p-4 rounded-xl",
                    "bg-[#121212] border border-[#1a1a1a]",
                  )}
                >
                  {activity.type === "achievement" ? (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#FBBF24]/20 flex items-center justify-center">
                          <Target className="w-5 h-5 text-[#FBBF24]" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {activity.title}
                          </p>
                          <p className="text-sm text-[#6a6a6a]">
                            {activity.desc}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-[#4a4a4a]">{activity.time}</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div
                          className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            activity.type === "BUY"
                              ? "bg-[#22C55E]/20 text-[#22C55E]"
                              : "bg-[#EF4444]/20 text-[#EF4444]",
                          )}
                        >
                          {activity.type === "BUY" ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : (
                            <TrendingDown className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {activity.type} {activity.symbol}
                          </p>
                          <p className="text-sm text-[#6a6a6a]">
                            {activity.shares} shares @{" "}
                            {formatCurrency(activity.price!)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-[#4a4a4a]">{activity.time}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tips & Achievements */}
        <div className="space-y-6">
          {/* Daily Tip */}
          <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#2563EB]/5 border-[#3B82F6]/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                💡
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">
                  Tip of the Day
                </h3>
                <p className="text-sm text-[#9a9a9a] leading-relaxed">
                  "Diversification is key! Don't put all your eggs in one
                  basket. Spread your investments across different sectors to
                  reduce risk."
                </p>
              </div>
            </div>
          </Card>

          {/* Level Progress */}
          {!isParent && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Your Progress</h3>
                <span className="text-sm text-[#60A5FA] font-medium">
                  Level {user?.level || 5}
                </span>
              </div>
              <div className="h-3 bg-[#2a2a2a] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full transition-all duration-500"
                  style={{ width: "65%" }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6a6a6a]">
                  {userProfile?.xp || 2450} XP
                </span>
                <span className="text-[#6a6a6a]">
                  3750 XP to Level {(user?.level || 5) + 1}
                </span>
              </div>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <h3 className="font-semibold text-white mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#6a6a6a]">Trades Made</span>
                <span className="font-semibold text-white">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6a6a6a]">Win Rate</span>
                <span className="font-semibold text-[#22C55E]">67%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6a6a6a]">Best Trade</span>
                <span className="font-semibold text-[#22C55E]">+$127.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6a6a6a]">Guides Completed</span>
                <span className="font-semibold text-white">5/8</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
