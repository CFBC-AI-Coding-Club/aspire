import { Home, BookOpen, TrendingUp, Wallet, User } from "lucide-react";
import { useState } from "react";

export function NavigationSystem() {
  const [selected, setSelected] = useState("home");

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "invest", label: "Invest", icon: TrendingUp },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[#1B262C] mb-1">Bottom Navigation</p>
        <p className="text-[#7D8B91]">5 icons, Selected: Aspire Blue, Unselected: Medium Gray</p>
      </div>
      
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-around py-4 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selected === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                className="flex flex-col items-center gap-1 min-w-16 transition-colors"
              >
                <Icon
                  className={`w-6 h-6 ${
                    isSelected ? "text-[#2E8BC0]" : "text-[#7D8B91]"
                  }`}
                />
                <span
                  className={`${
                    isSelected ? "text-[#2E8BC0]" : "text-[#7D8B91]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
