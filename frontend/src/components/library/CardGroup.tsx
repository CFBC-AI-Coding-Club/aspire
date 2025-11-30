import { TrendingUp, Gamepad2 } from "lucide-react";

export function CardGroup() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Standard Card */}
      <div className="space-y-3">
        <p className="text-[#7D8B91]">Card Standard</p>
        <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <h3 className="text-[#1B262C] mb-2">Card Title</h3>
          <p className="text-[#7D8B91]">
            This is a standard card with white background and subtle shadow.
          </p>
        </div>
      </div>

      {/* Metric Card */}
      <div className="space-y-3">
        <p className="text-[#7D8B91]">Card Metric</p>
        <div className="bg-gradient-to-br from-[#E3F5FF] to-[#B8E6FF] rounded-[20px] p-4 relative">
          <TrendingUp className="absolute top-4 right-4 w-6 h-6 text-[#2E8BC0]" />
          <p className="text-[#1B262C] mb-1">Total Savings</p>
          <p className="text-[#2E8BC0]">$1,234.56</p>
        </div>
      </div>

      {/* Game Card */}
      <div className="space-y-3">
        <p className="text-[#7D8B91]">Card Game</p>
        <div className="bg-gradient-to-br from-[#FFD447] to-[#FFA447] rounded-[24px] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-[#FF6F61]" />
            </div>
            <h3 className="text-[#1B262C]">Money Quest</h3>
          </div>
          <p className="text-[#1B262C]">Learn about saving!</p>
        </div>
      </div>
    </div>
  );
}
