import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { learningModules } from "../data/dummyData";

export const Route = createFileRoute("/learn")({
  component: LearnPage,
});

function LearnPage() {
  const { currentChild, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-[#2EC4B6] text-white";
      case "intermediate":
        return "bg-[#FFD447] text-white";
      case "advanced":
        return "bg-[#FF6F61] text-white";
      default:
        return "bg-[#E8EFF2] text-[#7D8B91]";
    }
  };

  const selectedModuleData = learningModules.find(
    (m) => m.id === selectedModule,
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
                📚 Learn & Earn
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
                ⭐
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Total Points</p>
                <p className="text-3xl font-bold text-[#2E8BC0]">
                  {currentChild.points}
                </p>
              </div>
            </div>
          </Card>

          <Card gradient="yellow" className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FFD447] rounded-full flex items-center justify-center text-3xl">
                ✅
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Completed</p>
                <p className="text-3xl font-bold text-[#D4A016]">
                  {learningModules.filter((m) => m.completed).length} /{" "}
                  {learningModules.length}
                </p>
              </div>
            </div>
          </Card>

          <Card gradient="coral" className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FF6F61] rounded-full flex items-center justify-center text-3xl">
                🎯
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Current Level</p>
                <p className="text-3xl font-bold text-[#FF6F61]">
                  {currentChild.level}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="shadow-md mb-8">
          <h2 className="text-2xl font-bold text-[#1B262C] mb-4">
            🌟 Learning Modules
          </h2>
          <p className="text-[#7D8B91] mb-6">
            Complete lessons to earn points and level up! Each module teaches
            you important concepts about money and investing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningModules.map((module) => (
              <div
                key={module.id}
                className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  module.completed
                    ? "bg-[#E3F9F7] border-[#2EC4B6] hover:shadow-[0_8px_24px_rgba(46,196,182,0.2)]"
                    : "bg-white border-[#E8EFF2] hover:border-[#2E8BC0] hover:shadow-[0_8px_24px_rgba(46,139,192,0.2)]"
                }`}
                onClick={() => setSelectedModule(module.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{module.icon}</div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(module.difficulty)}`}
                  >
                    {module.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1B262C] mb-2">
                  {module.title}
                </h3>
                <p className="text-sm text-[#7D8B91] mb-4">
                  {module.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#7D8B91]">
                    ⏱️ {module.duration}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#FFD447]">
                      +{module.points}
                    </span>
                    <span className="text-sm text-[#7D8B91]">pts</span>
                  </div>
                </div>

                {module.completed && (
                  <div className="mt-4 pt-4 border-t-2 border-[#2EC4B6] flex items-center gap-2 text-[#2EC4B6] font-semibold">
                    <span className="text-xl">✓</span>
                    <span>Completed</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {selectedModuleData && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedModuleData.icon}</div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#1B262C] mb-1">
                      {selectedModuleData.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedModuleData.difficulty)}`}
                    >
                      {selectedModuleData.difficulty}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="text-3xl text-[#7D8B91] hover:text-[#1B262C] transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-[#7D8B91] text-lg mb-4">
                  {selectedModuleData.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-[#E3F5FF] rounded-xl">
                    <p className="text-sm text-[#7D8B91] mb-1">Duration</p>
                    <p className="text-xl font-bold text-[#2E8BC0]">
                      {selectedModuleData.duration}
                    </p>
                  </div>
                  <div className="p-4 bg-[#FFF4D6] rounded-xl">
                    <p className="text-sm text-[#7D8B91] mb-1">Reward</p>
                    <p className="text-xl font-bold text-[#FFD447]">
                      +{selectedModuleData.points} pts
                    </p>
                  </div>
                </div>

                {selectedModuleData.completed ? (
                  <div className="p-4 bg-[#E3F9F7] border-2 border-[#2EC4B6] rounded-xl text-center">
                    <span className="text-3xl mb-2 block">🎉</span>
                    <p className="font-bold text-[#2EC4B6] text-lg">
                      You've completed this module!
                    </p>
                    <p className="text-sm text-[#7D8B91] mt-2">
                      Review anytime to refresh your knowledge
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#FFF4D6] rounded-xl">
                      <p className="text-sm text-[#1B262C] font-medium mb-2">
                        What you'll learn:
                      </p>
                      <ul className="space-y-1 text-sm text-[#7D8B91]">
                        <li>• Understanding the basics and key concepts</li>
                        <li>• Real-world examples and applications</li>
                        <li>• Interactive quizzes to test your knowledge</li>
                        <li>• Fun activities to reinforce learning</li>
                      </ul>
                    </div>
                    <Button className="w-full" size="lg">
                      Start Learning
                    </Button>
                  </div>
                )}
              </div>

              {selectedModuleData.completed && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedModule(null)}
                >
                  Review Module
                </Button>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
