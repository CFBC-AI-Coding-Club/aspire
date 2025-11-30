import { Card } from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import {
  learningModules,
  achievements,
  leaderboard,
  investments,
  getInvestmentsByChildId,
} from "@/data/dummyData";
import { Button } from "@base-ui-components/react/button";
import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
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
  const completedModules = learningModules.filter((m) => m.completed).length;
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E3F5FF]">
      <nav className="bg-white shadow-sm border-b-2 border-[#E8EFF2]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-[#2E8BC0]">🚀 Aspire</h1>
              <div className="flex items-center gap-2 bg-[#E3F5FF] px-4 py-2 rounded-full">
                <span className="text-2xl">{currentChild.avatar}</span>
                <span className="font-semibold text-[#1B262C]">
                  {currentChild.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 mr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <span className="font-bold text-[#FFD447]">
                    {currentChild.points}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <span className="font-bold text-[#2E8BC0]">
                    Level {currentChild.level}
                  </span>
                </div>
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
                <p className="text-[#7D8B91] text-sm">My Portfolio</p>
                <p className="text-3xl font-bold text-[#2E8BC0]">
                  ${currentChild.portfolioValue.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card gradient="yellow" className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FFD447] rounded-full flex items-center justify-center text-3xl">
                📚
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Lessons Completed</p>
                <p className="text-3xl font-bold text-[#D4A016]">
                  {completedModules} / {learningModules.length}
                </p>
              </div>
            </div>
          </Card>

          <Card gradient="coral" className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FF6F61] rounded-full flex items-center justify-center text-3xl">
                🏅
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Achievements</p>
                <p className="text-3xl font-bold text-[#FF6F61]">
                  {unlockedAchievements} / {achievements.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B262C]">
                  🏆 Leaderboard
                </h2>
                <span className="text-sm text-[#7D8B91]">Top Players</span>
              </div>

              <div className="space-y-3">
                {leaderboard.map((entry) => {
                  const isCurrentUser = entry.childId === currentChild.id;
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-[#E3F5FF] to-[#B8E6FF] border-2 border-[#2E8BC0] shadow-md"
                          : "bg-[#F5F7FA] hover:bg-[#E8EFF2]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                            entry.rank === 1
                              ? "bg-[#FFD447] text-white"
                              : entry.rank === 2
                                ? "bg-[#E8EFF2] text-[#7D8B91]"
                                : entry.rank === 3
                                  ? "bg-[#FF6F61] bg-opacity-30 text-[#FF6F61]"
                                  : "bg-white text-[#7D8B91]"
                          }`}
                        >
                          {entry.rank}
                        </div>
                        <div className="text-3xl">{entry.avatar}</div>
                        <div>
                          <p className="font-bold text-[#1B262C] text-lg">
                            {entry.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-sm text-[#2E8BC0]">
                                (You)
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-[#7D8B91]">
                            Level {entry.level}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#FFD447]">
                          {entry.points}
                        </p>
                        <p className="text-xs text-[#7D8B91]">points</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="shadow-md">
              <h2 className="text-2xl font-bold text-[#1B262C] mb-6">
                📊 My Investments
              </h2>

              {investments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">📈</div>
                  <p className="text-[#7D8B91] mb-4">No investments yet</p>
                  <Button>Start Investing</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {investments.map((investment) => (
                    <div
                      key={investment.id}
                      className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl hover:bg-[#E8EFF2] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{investment.icon}</div>
                        <div>
                          <p className="font-semibold text-[#1B262C]">
                            {investment.name}
                          </p>
                          <p className="text-sm text-[#7D8B91] capitalize">
                            {investment.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#1B262C] text-lg">
                          ${investment.value.toFixed(2)}
                        </p>
                        <p
                          className={`text-sm font-medium ${investment.change >= 0 ? "text-[#2EC4B6]" : "text-[#FF6F61]"}`}
                        >
                          {investment.change >= 0 ? "+" : ""}
                          {investment.change.toFixed(2)} (
                          {investment.changePercent.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-md">
              <h2 className="text-2xl font-bold text-[#1B262C] mb-6">
                🎯 Quick Actions
              </h2>
              <div className="space-y-3">
                <Link to="/learn">
                  <button className="w-full p-4 bg-gradient-to-r from-[#2E8BC0] to-[#2EC4B6] text-white rounded-xl font-semibold text-left flex items-center justify-between hover:shadow-[0_8px_24px_rgba(46,139,192,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-95">
                    <span>📚 Learn & Earn</span>
                    <span className="text-2xl">→</span>
                  </button>
                </Link>
                <Link to="/portfolio">
                  <button className="w-full p-4 bg-gradient-to-r from-[#FFD447] to-[#FFA447] text-white rounded-xl font-semibold text-left flex items-center justify-between hover:shadow-[0_8px_24px_rgba(255,212,71,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-95">
                    <span>💼 My Portfolio</span>
                    <span className="text-2xl">→</span>
                  </button>
                </Link>
                <Link to="/achievements">
                  <button className="w-full p-4 bg-gradient-to-r from-[#FF6F61] to-[#FF8A80] text-white rounded-xl font-semibold text-left flex items-center justify-between hover:shadow-[0_8px_24px_rgba(255,111,97,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-95">
                    <span>🏅 Achievements</span>
                    <span className="text-2xl">→</span>
                  </button>
                </Link>
              </div>
            </Card>

            <Card gradient="yellow" className="shadow-md">
              <h3 className="text-xl font-bold text-[#1B262C] mb-3">
                💡 Daily Tip
              </h3>
              <p className="text-[#7D8B91] text-sm leading-relaxed">
                "The best time to start investing was yesterday. The second best
                time is today! Keep learning and growing your wealth!"
              </p>
            </Card>

            <Card className="shadow-md">
              <h3 className="text-lg font-bold text-[#1B262C] mb-4">
                🎖️ Recent Achievements
              </h3>
              <div className="space-y-2">
                {achievements
                  .filter((a) => a.unlocked)
                  .slice(0, 3)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 bg-[#E3F5FF] rounded-xl"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="font-semibold text-[#1B262C] text-sm">
                          {achievement.name}
                        </p>
                        <p className="text-xs text-[#7D8B91]">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
