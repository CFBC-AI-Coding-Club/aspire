import { TrendingUp, BookOpen, Wallet, Settings, Target, Award } from "lucide-react";

interface KidDashboardProps {
  onNavigateLearn: () => void;
  onNavigateWallet: () => void;
  onNavigateSettings: () => void;
}

export function KidDashboard({ onNavigateLearn, onNavigateWallet, onNavigateSettings }: KidDashboardProps) {
  return (
    <div className="w-full min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-[#1B262C] mb-1">Welcome back, Alex!</h2>
            <p className="text-[#7D8B91]">Ready to learn today?</p>
          </div>
          <button
            onClick={onNavigateSettings}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2E8BC0] to-[#2EC4B6] flex items-center justify-center"
          >
            <span className="text-white">AS</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#2E8BC0] to-[#2EC4B6] rounded-[24px] p-8 text-white shadow-[0_8px_24px_rgba(46,139,192,0.3)]">
          <p className="opacity-90 mb-2">Total Balance</p>
          <h1 className="mb-1">$1,245.50</h1>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>+$15.50 this week</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="w-12 h-12 rounded-xl bg-[#E3F5FF] flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-[#2E8BC0]" />
            </div>
            <p className="text-[#1B262C] mb-1">Level 3</p>
            <p className="text-[#7D8B91]">Learning Progress</p>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="w-12 h-12 rounded-xl bg-[#E3F9F7] flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-[#2EC4B6]" />
            </div>
            <p className="text-[#1B262C] mb-1">85%</p>
            <p className="text-[#7D8B91]">Savings Goal</p>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="w-12 h-12 rounded-xl bg-[#FFF4D6] flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-[#D4A016]" />
            </div>
            <p className="text-[#1B262C] mb-1">12 Badges</p>
            <p className="text-[#7D8B91]">Earned</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="space-y-3">
          <h3 className="text-[#1B262C] px-2">What do you want to do?</h3>
          
          <button
            onClick={onNavigateLearn}
            className="w-full bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all text-left flex items-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2E8BC0] to-[#2EC4B6] flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#1B262C] mb-1">Start Learning</h3>
              <p className="text-[#7D8B91]">Take quizzes and play educational games</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#E3F5FF] flex items-center justify-center group-hover:bg-[#2E8BC0] transition-colors">
              <span className="text-[#2E8BC0] group-hover:text-white">→</span>
            </div>
          </button>

          <button
            onClick={onNavigateWallet}
            className="w-full bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all text-left flex items-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2EC4B6] to-[#2E8BC0] flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#1B262C] mb-1">Manage Money</h3>
              <p className="text-[#7D8B91]">Check balance and view transactions</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#E3F9F7] flex items-center justify-center group-hover:bg-[#2EC4B6] transition-colors">
              <span className="text-[#2EC4B6] group-hover:text-white">→</span>
            </div>
          </button>

          <button
            onClick={onNavigateSettings}
            className="w-full bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all text-left flex items-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD447] to-[#FFA447] flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#1B262C] mb-1">Settings</h3>
              <p className="text-[#7D8B91]">Manage your profile and preferences</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FFF4D6] flex items-center justify-center group-hover:bg-[#FFD447] transition-colors">
              <span className="text-[#D4A016] group-hover:text-white">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
