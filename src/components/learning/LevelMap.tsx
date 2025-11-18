import { Lock, Check } from "lucide-react";

export function LevelMap() {
  const levels = [
    { id: 1, name: "Money Basics", status: "completed", color: "#2E8BC0" },
    { id: 2, name: "Smart Saving", status: "completed", color: "#2EC4B6" },
    { id: 3, name: "First Investment", status: "current", color: "#FFD447" },
    { id: 4, name: "Advanced Money", status: "locked", color: "#FF6F61" },
    { id: 5, name: "Master Investor", status: "locked", color: "#7D8B91" },
  ];

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <h3 className="text-[#1B262C] mb-6">Your Learning Journey</h3>
      
      <div className="relative">
        {/* Progress Path */}
        <div className="absolute left-8 top-8 bottom-8 w-1 bg-[#E8EFF2]" />
        
        {/* Levels */}
        <div className="space-y-6 relative">
          {levels.map((level, index) => {
            const isCompleted = level.status === "completed";
            const isCurrent = level.status === "current";
            const isLocked = level.status === "locked";
            
            return (
              <div key={level.id} className="flex items-center gap-4">
                {/* Level Icon */}
                <div
                  className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
                    isLocked ? "bg-[#E8EFF2]" : ""
                  }`}
                  style={{
                    background: !isLocked
                      ? `linear-gradient(135deg, ${level.color}, ${level.color}CC)`
                      : undefined,
                  }}
                >
                  {isCompleted && <Check className="w-8 h-8 text-white" />}
                  {isCurrent && <span className="text-white">{level.id}</span>}
                  {isLocked && <Lock className="w-6 h-6 text-[#7D8B91]" />}
                </div>

                {/* Level Info */}
                <div className="flex-1">
                  <h3 className={isLocked ? "text-[#7D8B91]" : "text-[#1B262C]"}>
                    Level {level.id}
                  </h3>
                  <p className="text-[#7D8B91]">{level.name}</p>
                </div>

                {/* Status Badge */}
                {isCurrent && (
                  <div className="px-3 py-1 bg-gradient-to-r from-[#FFD447] to-[#FFA447] rounded-full">
                    <span className="text-[#1B262C]">In Progress</span>
                  </div>
                )}
                {isCompleted && (
                  <div className="px-3 py-1 bg-[#E3F5FF] rounded-full">
                    <span className="text-[#2E8BC0]">Completed</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
