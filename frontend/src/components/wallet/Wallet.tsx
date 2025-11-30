import { ArrowLeft, TrendingUp, ShoppingBag, Gift, Coffee, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState } from "react";

interface WalletProps {
  onBack: () => void;
}

export function Wallet({ onBack }: WalletProps) {
  const [selectedTab, setSelectedTab] = useState<"transactions" | "rewards">("transactions");

  const totalBalance = 1245.50;
  const savingsBalance = 850.00;
  const savingsGoal = 1000.00;
  const savingsProgress = (savingsBalance / savingsGoal) * 100;

  const transactions = [
    { id: 1, type: "income", title: "Weekly Allowance", amount: 10.00, date: "Nov 18, 2025", icon: "gift" },
    { id: 2, type: "expense", title: "Snack Purchase", amount: -3.50, date: "Nov 17, 2025", icon: "coffee" },
    { id: 3, type: "income", title: "Chore Reward", amount: 5.00, date: "Nov 16, 2025", icon: "trending" },
    { id: 4, type: "expense", title: "Game Purchase", amount: -12.99, date: "Nov 15, 2025", icon: "shopping" },
    { id: 5, type: "income", title: "Quiz Completion", amount: 2.50, date: "Nov 14, 2025", icon: "gift" },
  ];

  const badges = [
    { id: 1, name: "Savings Star", earned: true, color: "#2E8BC0" },
    { id: 2, name: "Quiz Master", earned: true, color: "#2EC4B6" },
    { id: 3, name: "Smart Spender", earned: true, color: "#FFD447" },
    { id: 4, name: "Investment Guru", earned: false, color: "#FF6F61" },
    { id: 5, name: "Budget Hero", earned: false, color: "#7D8B91" },
    { id: 6, name: "Goal Crusher", earned: false, color: "#2E8BC0" },
  ];

  const avatars = [
    { id: 1, name: "Happy Star", unlocked: true, color: "#FFD447" },
    { id: 2, name: "Cool Robot", unlocked: true, color: "#2E8BC0" },
    { id: 3, name: "Friendly Cat", unlocked: true, color: "#2EC4B6" },
    { id: 4, name: "Space Explorer", unlocked: false, color: "#FF6F61", cost: 100 },
    { id: 5, name: "Ocean Diver", unlocked: false, color: "#2E8BC0", cost: 150 },
    { id: 6, name: "Forest Guardian", unlocked: false, color: "#2EC4B6", cost: 200 },
  ];

  const getTransactionIcon = (icon: string) => {
    switch (icon) {
      case "gift":
        return <Gift className="w-5 h-5" />;
      case "coffee":
        return <Coffee className="w-5 h-5" />;
      case "trending":
        return <TrendingUp className="w-5 h-5" />;
      case "shopping":
        return <ShoppingBag className="w-5 h-5" />;
      default:
        return <Gift className="w-5 h-5" />;
    }
  };

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
          <h2 className="text-[#1B262C]">My Wallet</h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-[#2E8BC0] to-[#2EC4B6] rounded-[24px] p-8 text-white shadow-[0_8px_24px_rgba(46,139,192,0.3)]">
          <p className="opacity-90 mb-2">Total Balance</p>
          <h1 className="mb-4">${totalBalance.toFixed(2)}</h1>
          <div className="flex gap-4">
            <button className="flex-1 h-12 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
              <ArrowDownRight className="w-5 h-5" />
              <span>Add Money</span>
            </button>
            <button className="flex-1 h-12 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
              <ArrowUpRight className="w-5 h-5" />
              <span>Send Money</span>
            </button>
          </div>
        </div>

        {/* Savings Account */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#1B262C] mb-1">Savings Account</h3>
              <p className="text-[#7D8B91]">Goal: ${savingsGoal.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-[#2E8BC0]">${savingsBalance.toFixed(2)}</p>
              <p className="text-[#7D8B91]">{savingsProgress.toFixed(0)}%</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 bg-[#E8EFF2] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2E8BC0] to-[#2EC4B6] rounded-full transition-all duration-300"
              style={{ width: `${savingsProgress}%` }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedTab("transactions")}
            className={`h-12 rounded-xl transition-colors ${
              selectedTab === "transactions"
                ? "bg-[#2E8BC0] text-white"
                : "bg-white text-[#1B262C] border-2 border-[#E8EFF2]"
            }`}
          >
            Recent Transactions
          </button>
          <button
            onClick={() => setSelectedTab("rewards")}
            className={`h-12 rounded-xl transition-colors ${
              selectedTab === "rewards"
                ? "bg-[#2E8BC0] text-white"
                : "bg-white text-[#1B262C] border-2 border-[#E8EFF2]"
            }`}
          >
            Rewards Store
          </button>
        </div>

        {/* Content Area */}
        {selectedTab === "transactions" && (
          <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <h3 className="text-[#1B262C] mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F5F7FA] transition-colors"
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === "income"
                        ? "bg-[#E3F5FF] text-[#2E8BC0]"
                        : "bg-[#FFE8E6] text-[#FF6F61]"
                    }`}
                  >
                    {getTransactionIcon(transaction.icon)}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <p className="text-[#1B262C] mb-1">{transaction.title}</p>
                    <p className="text-[#7D8B91]">{transaction.date}</p>
                  </div>

                  {/* Amount */}
                  <div
                    className={
                      transaction.type === "income"
                        ? "text-[#2EC4B6]"
                        : "text-[#FF6F61]"
                    }
                  >
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "rewards" && (
          <div className="space-y-6">
            {/* Badges Section */}
            <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              <h3 className="text-[#1B262C] mb-4">Achievement Badges</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl text-center transition-all ${
                      badge.earned
                        ? "bg-gradient-to-br shadow-md"
                        : "bg-[#F5F7FA] opacity-60"
                    }`}
                    style={{
                      backgroundImage: badge.earned
                        ? `linear-gradient(135deg, ${badge.color}, ${badge.color}CC)`
                        : undefined,
                    }}
                  >
                    {/* Badge Icon */}
                    <div
                      className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        badge.earned ? "bg-white/20" : "bg-white"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{
                          backgroundColor: badge.earned ? "white" : badge.color,
                        }}
                      />
                    </div>
                    <p className={badge.earned ? "text-white" : "text-[#7D8B91]"}>
                      {badge.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Avatars Section */}
            <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              <h3 className="text-[#1B262C] mb-4">Avatar Collection</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`p-4 rounded-xl text-center transition-all ${
                      avatar.unlocked
                        ? "bg-gradient-to-br shadow-md"
                        : "bg-[#F5F7FA]"
                    }`}
                    style={{
                      backgroundImage: avatar.unlocked
                        ? `linear-gradient(135deg, ${avatar.color}, ${avatar.color}CC)`
                        : undefined,
                    }}
                  >
                    {/* Avatar Icon */}
                    <div
                      className={`w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        avatar.unlocked ? "bg-white/20" : "bg-white border-2 border-[#E8EFF2]"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-full"
                        style={{
                          backgroundColor: avatar.unlocked ? "white" : avatar.color,
                          opacity: avatar.unlocked ? 1 : 0.3,
                        }}
                      />
                    </div>
                    <p className={avatar.unlocked ? "text-white mb-1" : "text-[#1B262C] mb-1"}>
                      {avatar.name}
                    </p>
                    {!avatar.unlocked && (
                      <p className="text-[#7D8B91]">{avatar.cost} coins</p>
                    )}
                    {avatar.unlocked && (
                      <p className="text-white opacity-90">Unlocked</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}