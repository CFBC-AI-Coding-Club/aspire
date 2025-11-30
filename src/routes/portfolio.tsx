import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { getInvestmentsByChildId } from "../data/dummyData";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
});

function PortfolioPage() {
  const { currentChild, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentChild) {
      navigate({ to: "/login" });
    }
  }, [currentChild, navigate]);

  if (!currentChild) {
    return null;
  }

  const investments = getInvestmentsByChildId(currentChild.id);
  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);
  const totalChange = investments.reduce((sum, inv) => sum + inv.change, 0);
  const totalChangePercent =
    totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stock":
        return "bg-[#2E8BC0]";
      case "bond":
        return "bg-[#FFD447]";
      case "crypto":
        return "bg-[#FF6F61]";
      case "savings":
        return "bg-[#2EC4B6]";
      default:
        return "bg-[#E8EFF2]";
    }
  };

  const investmentsByType = investments.reduce(
    (acc, inv) => {
      acc[inv.type] = (acc[inv.type] || 0) + inv.value;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E3F5FF]">
      <nav className="bg-white shadow-sm border-b-2 border-[#E8EFF2]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate({ to: "/home" })}>
                ← Back
              </Button>
              <h1 className="text-3xl font-bold text-[#2E8BC0]">
                💼 My Portfolio
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#E3F5FF] px-4 py-2 rounded-full">
                <span className="text-2xl">{currentChild.avatar}</span>
                <span className="font-semibold text-[#1B262C]">
                  {currentChild.name}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Exit
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card gradient="blue" className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#2E8BC0] rounded-full flex items-center justify-center text-3xl">
                💰
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Total Value</p>
                <p className="text-3xl font-bold text-[#2E8BC0]">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card
            gradient={totalChange >= 0 ? "teal" : "coral"}
            className="shadow-md"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 ${totalChange >= 0 ? "bg-[#2EC4B6]" : "bg-[#FF6F61]"} rounded-full flex items-center justify-center text-3xl`}
              >
                {totalChange >= 0 ? "📈" : "📉"}
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Total Change</p>
                <p
                  className={`text-3xl font-bold ${totalChange >= 0 ? "text-[#2EC4B6]" : "text-[#FF6F61]"}`}
                >
                  {totalChange >= 0 ? "+" : ""}
                  {totalChange.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card gradient="yellow" className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FFD447] rounded-full flex items-center justify-center text-3xl">
                📊
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Investments</p>
                <p className="text-3xl font-bold text-[#D4A016]">
                  {investments.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-md mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B262C]">
                  📈 Your Investments
                </h2>
                <Button size="sm">+ Add Investment</Button>
              </div>

              {investments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-[#1B262C] mb-2">
                    Start Your Investment Journey
                  </h3>
                  <p className="text-[#7D8B91] mb-6">
                    You haven't made any investments yet. Learn about different
                    investment types and start growing your wealth!
                  </p>
                  <Button onClick={() => navigate({ to: "/learn" })}>
                    Learn About Investing
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div
                      key={investment.id}
                      className="p-6 bg-white border-2 border-[#E8EFF2] rounded-xl hover:border-[#2E8BC0] hover:shadow-[0_4px_16px_rgba(46,139,192,0.2)] transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-5xl">{investment.icon}</div>
                          <div>
                            <h3 className="text-xl font-bold text-[#1B262C]">
                              {investment.name}
                            </h3>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(investment.type)}`}
                            >
                              {investment.type}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#1B262C]">
                            ${investment.value.toFixed(2)}
                          </p>
                          <p
                            className={`text-sm font-semibold ${investment.change >= 0 ? "text-[#2EC4B6]" : "text-[#FF6F61]"}`}
                          >
                            {investment.change >= 0 ? "+" : ""}
                            {investment.change.toFixed(2)} (
                            {investment.changePercent.toFixed(2)}%)
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1">
                          Trade
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card gradient="blue" className="shadow-md">
              <h3 className="text-xl font-bold text-[#1B262C] mb-4">
                💡 Investment Tips
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-white/50 rounded-xl">
                  <p className="font-semibold text-[#2E8BC0] mb-1">
                    🎯 Diversify
                  </p>
                  <p className="text-sm text-[#7D8B91]">
                    Don't put all your eggs in one basket. Spread your
                    investments across different types!
                  </p>
                </div>
                <div className="p-4 bg-white/50 rounded-xl">
                  <p className="font-semibold text-[#2E8BC0] mb-1">
                    ⏰ Think Long-Term
                  </p>
                  <p className="text-sm text-[#7D8B91]">
                    Investing is like planting a tree. It takes time to grow,
                    but the results are worth it!
                  </p>
                </div>
                <div className="p-4 bg-white/50 rounded-xl">
                  <p className="font-semibold text-[#2E8BC0] mb-1">
                    📚 Keep Learning
                  </p>
                  <p className="text-sm text-[#7D8B91]">
                    The more you learn about investing, the better decisions
                    you'll make!
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-md">
              <h3 className="text-xl font-bold text-[#1B262C] mb-4">
                📊 Portfolio Breakdown
              </h3>

              {investments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#7D8B91]">No investments yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(investmentsByType).map(([type, value]) => {
                    const percentage = (value / totalValue) * 100;
                    return (
                      <div key={type}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-[#1B262C] capitalize">
                            {type}
                          </span>
                          <span className="text-sm font-bold text-[#2E8BC0]">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-[#E8EFF2] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getTypeColor(type)} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-[#7D8B91] mt-1">
                          ${value.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card gradient="yellow" className="shadow-md">
              <h3 className="text-xl font-bold text-[#1B262C] mb-3">
                🎯 Your Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#7D8B91]">
                      Portfolio Goal
                    </span>
                    <span className="text-sm font-bold text-[#FFD447]">
                      ${totalValue.toFixed(2)} / $5,000
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFD447] transition-all duration-500"
                      style={{
                        width: `${Math.min((totalValue / 5000) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="p-3 bg-white/50 rounded-xl">
                  <p className="text-xs text-[#7D8B91]">
                    Keep investing to reach your goal and unlock the
                    "Millionaire Mindset" achievement! 💎
                  </p>
                </div>
              </div>
            </Card>

            <Card className="shadow-md">
              <h3 className="text-lg font-bold text-[#1B262C] mb-4">
                🚀 Quick Actions
              </h3>
              <div className="space-y-2">
                <Button className="w-full" size="sm">
                  Add New Investment
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  View History
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  size="sm"
                  onClick={() => navigate({ to: "/learn" })}
                >
                  Learn More
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
