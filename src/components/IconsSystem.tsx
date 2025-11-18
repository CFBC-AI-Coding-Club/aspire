import {
  Wallet,
  PiggyBank,
  BarChart,
  TrendingUp,
  TrendingDown,
  Play,
  Gift,
  Users,
  Settings,
  Book,
  Star,
  Trophy,
} from "lucide-react";

export function IconsSystem() {
  const icons = [
    { name: "wallet", component: Wallet },
    { name: "piggy-bank", component: PiggyBank },
    { name: "bar-chart", component: BarChart },
    { name: "trending-up", component: TrendingUp },
    { name: "trending-down", component: TrendingDown },
    { name: "play", component: Play },
    { name: "gift", component: Gift },
    { name: "users", component: Users },
    { name: "settings", component: Settings },
    { name: "book", component: Book },
    { name: "star", component: Star },
    { name: "trophy", component: Trophy },
  ];

  return (
    <div className="bg-white rounded-2xl p-8">
      <p className="text-[#7D8B91] mb-6">Lucide Icons</p>
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-6">
        {icons.map((icon) => {
          const Icon = icon.component;
          return (
            <div key={icon.name} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#E8EFF2] hover:bg-[#2E8BC0] hover:text-white transition-colors group">
                <Icon className="w-6 h-6 text-[#7D8B91] group-hover:text-white" />
              </div>
              <span className="text-[#7D8B91] text-center">{icon.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
