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
            <div className="w-12 h-12 rounded-xl bg-[#482977]/10 flex items-center justify-center text-xl font-bold text-[#482977]">
              {stock.ticker.slice(0, 2)}
            </div>
            <div>
              <p className="font-bold text-[#1a1a2e]">{stock.ticker}</p>
              <p className="text-sm text-[#7a8aa3] truncate max-w-[120px]">
                {stock.name}
              </p>
            </div>
          </div>
          <div
            className={clsx(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium",
              isPositive
                ? "bg-[#16a34a]/10 text-[#16a34a]"
                : "bg-[#dc2626]/10 text-[#dc2626]",
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
            color={isPositive ? "#16a34a" : "#dc2626"}
          />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-[#1a1a2e] font-tabular">
              {formatCurrency(stock.price)}
            </p>
            <p
              className={clsx(
                "text-sm font-medium",
                isPositive ? "text-[#16a34a]" : "text-[#dc2626]",
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
        <h3 className="font-semibold text-[#1a1a2e] mb-1">{title}</h3>
        <p className="text-sm text-[#7a8aa3]">{description}</p>
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

  // Calculate today's change from transactions if available
  const todayChange = useMemo(() => {
    if (!userProfile?.transactions || userProfile.transactions.length === 0) return 0;
    const today = new Date().toDateString();
    return userProfile.transactions
      .filter((tx: { timestamp: string }) => new Date(tx.timestamp).toDateString() === today)
      .reduce((sum: number, tx: { type: string; total: number }) => {
        return sum + (tx.type === 'BUY' ? -tx.total : tx.total);
      }, 0);
  }, [userProfile?.transactions]);

  const todayChangePercent =
    totalValue > 0 ? (todayChange / totalValue) * 100 : 0;
  
  // Calculate total return based on initial balance
  const initialBalance = 10000; // Starting balance
  const totalReturn = totalValue - initialBalance;
  const totalReturnPercent =
    initialBalance > 0 ? ((totalValue - initialBalance) / initialBalance) * 100 : 0;

  // Get recent transactions from user profile
  const recentTransactions = useMemo(() => {
    if (!userProfile?.transactions) return [];
    return userProfile.transactions.slice(0, 4);
  }, [userProfile?.transactions]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-1">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-[#7a8aa3]">
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
          accent="primary"
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
            <h2 className="text-xl font-bold text-[#1a1a2e]">
              Top Performing Stocks
            </h2>
            <p className="text-sm text-[#7a8aa3]">
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
              <Card key={i} className="h-48 animate-pulse bg-[#f1f3f9]" />
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
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={Briefcase}
            title="My Portfolio"
            description="View your holdings"
            to="/portfolio"
            gradient="from-[#482977] to-[#6b42a1]"
          />
          <QuickActionCard
            icon={Trophy}
            title="Leaderboard"
            description="See top investors"
            to="/leaderboard"
            gradient="from-[#c22f99] to-[#9a2579]"
          />
          <QuickActionCard
            icon={BookOpen}
            title="Learn"
            description="Investment guides"
            to="/guides"
            gradient="from-[#16a34a] to-[#15803d]"
          />
          <QuickActionCard
            icon={Zap}
            title="Games"
            description="Practice trading"
            to="/games"
            gradient="from-[#6b42a1] to-[#482977]"
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
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-[#7a8aa3]">
                  <p>No recent activity yet.</p>
                  <p className="text-sm mt-1">Start trading to see your activity here!</p>
                </div>
              ) : (
                recentTransactions.map((activity: { id: string; type: string; ticker: string; quantity: number; price: number; timestamp: string }, i: number) => (
                  <div
                    key={activity.id || i}
                    className={clsx(
                      "flex items-center justify-between p-4 rounded-xl",
                      "bg-[#f8f9fc] border border-[#482977]/5",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          activity.type === "BUY"
                            ? "bg-[#16a34a]/10 text-[#16a34a]"
                            : "bg-[#dc2626]/10 text-[#dc2626]",
                        )}
                      >
                        {activity.type === "BUY" ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#1a1a2e]">
                          {activity.type} {activity.ticker}
                        </p>
                        <p className="text-sm text-[#7a8aa3]">
                          {activity.quantity} shares @{" "}
                          {formatCurrency(activity.price)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[#a0aec4]">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Tips & Achievements */}
        <div className="space-y-6">
          {/* Daily Tip */}
          <Card className="bg-gradient-to-br from-[#482977]/5 to-[#6b42a1]/5 border-[#482977]/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#482977]/10 flex items-center justify-center flex-shrink-0">
                💡
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e] mb-2">
                  Tip of the Day
                </h3>
                <p className="text-sm text-[#566279] leading-relaxed">
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
                <h3 className="font-semibold text-[#1a1a2e]">Your Progress</h3>
                <span className="text-sm text-[#482977] font-medium">
                  Level {user?.level || 1}
                </span>
              </div>
              <div className="h-3 bg-[#f1f3f9] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-[#482977] to-[#6b42a1] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((userProfile?.xp || 0) / 1000 * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7a8aa3]">
                  {userProfile?.xp || 0} XP
                </span>
                <span className="text-[#7a8aa3]">
                  1000 XP to Level {(user?.level || 1) + 1}
                </span>
              </div>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <h3 className="font-semibold text-[#1a1a2e] mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#7a8aa3]">Trades Made</span>
                <span className="font-semibold text-[#1a1a2e]">
                  {userProfile?.transactions?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7a8aa3]">Holdings</span>
                <span className="font-semibold text-[#1a1a2e]">
                  {userProfile?.portfolio?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7a8aa3]">Total Value</span>
                <span className="font-semibold text-[#16a34a]">
                  {formatCurrency(totalValue)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
