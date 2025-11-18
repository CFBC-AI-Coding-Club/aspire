import { Home, BookOpen, TrendingUp, Wallet, User, ArrowLeft, MoreVertical } from "lucide-react";
import { useState } from "react";

export function NavigationGroup() {
  const [selected, setSelected] = useState("home");

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "invest", label: "Invest", icon: TrendingUp },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="space-y-8">
      {/* Bottom Nav */}
      <div className="space-y-4">
        <p className="text-[#7D8B91]">Bottom Nav</p>
        <div className="max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
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

      {/* Top App Bar */}
      <div className="space-y-4">
        <p className="text-[#7D8B91]">Top App Bar</p>
        <div className="max-w-md bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#E8EFF2] transition-colors">
              <ArrowLeft className="w-6 h-6 text-[#1B262C]" />
            </button>
            <h3 className="text-[#1B262C]">Page Title</h3>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#E8EFF2] transition-colors">
              <MoreVertical className="w-6 h-6 text-[#1B262C]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
