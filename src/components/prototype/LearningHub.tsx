import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { LevelMap } from "../learning/LevelMap";

interface LearningHubProps {
  onBack: () => void;
  onStartQuiz: () => void;
  onStartGame: () => void;
}

export function LearningHub({ onBack, onStartQuiz, onStartGame }: LearningHubProps) {
  const [activeTab, setActiveTab] = useState<"quizzes" | "simulators" | "challenges">("quizzes");

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA]">
      {/* App Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#E8EFF2] transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#1B262C]" />
          </button>
          <h2 className="text-[#1B262C]">Learning Hub</h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Level Map */}
        <LevelMap />

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`h-14 rounded-2xl transition-colors ${
              activeTab === "quizzes"
                ? "bg-[#2E8BC0] text-white"
                : "bg-white text-[#1B262C] border-2 border-[#E8EFF2]"
            }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setActiveTab("simulators")}
            className={`h-14 rounded-2xl transition-colors ${
              activeTab === "simulators"
                ? "bg-[#2E8BC0] text-white"
                : "bg-white text-[#1B262C] border-2 border-[#E8EFF2]"
            }`}
          >
            Simulators
          </button>
          <button
            onClick={() => setActiveTab("challenges")}
            className={`h-14 rounded-2xl transition-colors ${
              activeTab === "challenges"
                ? "bg-[#2E8BC0] text-white"
                : "bg-white text-[#1B262C] border-2 border-[#E8EFF2]"
            }`}
          >
            Challenges
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="space-y-4">
          {activeTab === "quizzes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={onStartQuiz}
                className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow text-left"
              >
                <h3 className="text-[#1B262C] mb-2">Money Basics Quiz</h3>
                <p className="text-[#7D8B91] mb-4">Test your knowledge about saving and spending</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#2E8BC0]">10 Questions</span>
                  <span className="text-[#7D8B91]">Level 1</span>
                </div>
              </button>

              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                <h3 className="text-[#1B262C] mb-2">Investment 101</h3>
                <p className="text-[#7D8B91] mb-4">Learn the basics of growing your money</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#2E8BC0]">8 Questions</span>
                  <span className="text-[#7D8B91]">Level 2</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "simulators" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={onStartGame}
                className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow text-left"
              >
                <h3 className="text-[#1B262C] mb-2">Stock Market Game</h3>
                <p className="text-[#7D8B91] mb-4">Predict market movements and earn points</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#2EC4B6]">Interactive</span>
                  <span className="text-[#7D8B91]">Level 3</span>
                </div>
              </button>

              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                <h3 className="text-[#1B262C] mb-2">Budget Builder</h3>
                <p className="text-[#7D8B91] mb-4">Practice creating a monthly budget</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#2EC4B6]">Interactive</span>
                  <span className="text-[#7D8B91]">Level 2</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "challenges" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                <h3 className="text-[#1B262C] mb-2">30-Day Savings</h3>
                <p className="text-[#7D8B91] mb-4">Save a little bit every day for a month</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#7D8B91]">Challenge</span>
                  <span className="text-[#7D8B91]">30 Days</span>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                <h3 className="text-[#1B262C] mb-2">Smart Spender</h3>
                <p className="text-[#7D8B91] mb-4">Make wise spending choices for a week</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#7D8B91]">Challenge</span>
                  <span className="text-[#7D8B91]">7 Days</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
