import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { achievements } from "../data/dummyData";

export const Route = createFileRoute("/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
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

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

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
                🏅 Achievements
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
          <Card gradient="coral" className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FF6F61] rounded-full flex items-center justify-center text-3xl">
                🏆
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Unlocked</p>
                <p className="text-3xl font-bold text-[#FF6F61]">
                  {unlockedCount}
                </p>
              </div>
            </div>
          </Card>

          <Card gradient="yellow" className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FFD447] rounded-full flex items-center justify-center text-3xl">
                🎯
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Remaining</p>
                <p className="text-3xl font-bold text-[#D4A016]">
                  {totalCount - unlockedCount}
                </p>
              </div>
            </div>
          </Card>

          <Card gradient="blue" className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#2E8BC0] rounded-full flex items-center justify-center text-3xl">
                📊
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Progress</p>
                <p className="text-3xl font-bold text-[#2E8BC0]">
                  {progress.toFixed(0)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="shadow-md mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B262C] mb-2">
              Your Achievement Progress
            </h2>
            <div className="w-full h-4 bg-[#E8EFF2] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2E8BC0] to-[#2EC4B6] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-[#7D8B91] mt-2">
              {unlockedCount} of {totalCount} achievements unlocked
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#FFF4D6] to-[#FFE4A3] rounded-xl">
            <p className="text-sm text-[#1B262C] font-medium">
              🌟 Keep learning and investing to unlock more achievements! Each
              achievement comes with special rewards and recognition.
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-bold text-[#1B262C] mb-4">
              ✨ Unlocked Achievements
            </h3>
            {achievements.filter((a) => a.unlocked).length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-[#1B262C] mb-2">
                  No Achievements Yet
                </h3>
                <p className="text-[#7D8B91] mb-6">
                  Start learning and investing to unlock your first achievement!
                </p>
                <Button onClick={() => navigate({ to: "/learn" })}>
                  Start Learning
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {achievements
                  .filter((a) => a.unlocked)
                  .map((achievement) => (
                    <Card
                      key={achievement.id}
                      gradient="blue"
                      className="shadow-md relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E8BC0] opacity-10 rounded-full -mr-16 -mt-16" />
                      <div className="flex items-start gap-4 relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#FFD447] to-[#FFA447] rounded-full flex items-center justify-center text-3xl flex-shrink-0 shadow-[0_4px_16px_rgba(255,212,71,0.4)]">
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-[#1B262C] mb-1">
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-[#7D8B91] mb-3">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#2E8BC0] font-semibold">
                            <span>✓</span>
                            <span>
                              Unlocked{" "}
                              {achievement.unlockedAt
                                ? new Date(
                                    achievement.unlockedAt,
                                  ).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#1B262C] mb-4">
              🔒 Locked Achievements
            </h3>
            {achievements.filter((a) => !a.unlocked).length === 0 ? (
              <Card gradient="yellow" className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-[#1B262C] mb-2">
                  All Achievements Unlocked!
                </h3>
                <p className="text-[#7D8B91]">
                  Congratulations! You've unlocked every achievement!
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {achievements
                  .filter((a) => !a.unlocked)
                  .map((achievement) => (
                    <Card
                      key={achievement.id}
                      className="shadow-md relative overflow-hidden opacity-75 hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8EFF2] opacity-20 rounded-full -mr-16 -mt-16" />
                      <div className="flex items-start gap-4 relative">
                        <div className="w-16 h-16 bg-[#E8EFF2] rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                          <span className="opacity-40">{achievement.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xl font-bold text-[#1B262C]">
                              {achievement.name}
                            </h4>
                            <span className="text-lg">🔒</span>
                          </div>
                          <p className="text-sm text-[#7D8B91] mb-3">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-full h-2 bg-[#E8EFF2] rounded-full overflow-hidden">
                              <div className="h-full bg-[#7D8B91] w-0" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>

        <Card gradient="coral" className="shadow-md mt-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">💪</div>
            <h3 className="text-2xl font-bold text-[#1B262C]">
              How to Earn Achievements
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/50 rounded-xl">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-bold text-[#1B262C] mb-1">
                Complete Lessons
              </h4>
              <p className="text-sm text-[#7D8B91]">
                Finish learning modules to unlock knowledge-based achievements
              </p>
            </div>
            <div className="p-4 bg-white/50 rounded-xl">
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-bold text-[#1B262C] mb-1">
                Build Your Portfolio
              </h4>
              <p className="text-sm text-[#7D8B91]">
                Make investments and watch your portfolio grow to earn wealth
                achievements
              </p>
            </div>
            <div className="p-4 bg-white/50 rounded-xl">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold text-[#1B262C] mb-1">Stay Consistent</h4>
              <p className="text-sm text-[#7D8B91]">
                Keep learning and practicing to unlock special milestone
                achievements
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
