import { Settings, User, Wallet, Bell, ChevronRight } from "lucide-react";

export function ListItemsGroup() {
  const listItems = [
    { icon: User, label: "Profile Settings", color: "#2E8BC0" },
    { icon: Wallet, label: "Wallet", color: "#2EC4B6" },
    { icon: Bell, label: "Notifications", color: "#FFD447" },
    { icon: Settings, label: "General Settings", color: "#7D8B91" },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 space-y-4">
      <p className="text-[#7D8B91] mb-4">List Rows</p>
      
      <div className="max-w-md">
        {listItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.label}>
              <button className="w-full flex items-center gap-4 py-4 hover:bg-[#F5F7FA] rounded-xl px-4 -mx-4 transition-colors">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <span className="flex-1 text-left text-[#1B262C]">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-[#7D8B91]" />
              </button>
              {index < listItems.length - 1 && (
                <div className="h-px bg-[#E8EFF2] ml-14" />
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-8">
        <p className="text-[#7D8B91] mb-4">Divider</p>
        <div className="h-px bg-[#E8EFF2] max-w-md" />
      </div>
    </div>
  );
}
