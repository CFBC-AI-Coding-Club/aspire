export function StatsGroup() {
  return (
    <div className="bg-white rounded-2xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Progress Ring */}
        <div className="space-y-4">
          <p className="text-[#7D8B91]">Progress Ring</p>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E8EFF2"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#2E8BC0"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.65)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#1B262C]">65%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <p className="text-[#7D8B91]">Progress Bar</p>
          <div className="space-y-6 pt-8">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[#1B262C]">Goal Progress</span>
                <span className="text-[#2E8BC0]">75%</span>
              </div>
              <div className="h-2 bg-[#E8EFF2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2E8BC0] rounded-full transition-all duration-300"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[#1B262C]">Savings</span>
                <span className="text-[#2EC4B6]">45%</span>
              </div>
              <div className="h-2 bg-[#E8EFF2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2EC4B6] rounded-full transition-all duration-300"
                  style={{ width: "45%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <p className="text-[#7D8B91]">Badges</p>
          <div className="flex flex-wrap gap-3 pt-8">
            <div className="px-4 py-2 bg-gradient-to-r from-[#FFD447] to-[#FFA500] rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-[#1B262C]">Gold</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-[#E8EFF2] to-[#B8C5CC] rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-[#1B262C]">Silver</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-[#CD7F32] to-[#A0522D] rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-white">Bronze</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
