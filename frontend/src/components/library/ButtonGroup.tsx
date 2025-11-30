import { Play } from "lucide-react";

export function ButtonGroup() {
  return (
    <div className="bg-white rounded-2xl p-8 space-y-8">
      {/* Primary Button */}
      <div className="space-y-3">
        <p className="text-[#7D8B91]">Primary</p>
        <button
          className="h-12 px-8 bg-[#2E8BC0] text-white rounded-2xl hover:bg-[#2579a8] transition-colors"
        >
          Primary Button
        </button>
      </div>

      {/* Secondary Button */}
      <div className="space-y-3">
        <p className="text-[#7D8B91]">Secondary</p>
        <button
          className="h-12 px-8 bg-white text-[#2E8BC0] rounded-2xl border-2 border-[#2E8BC0] hover:bg-[#f0f9fc] transition-colors"
        >
          Secondary Button
        </button>
      </div>

      {/* Tertiary Button */}
      <div className="space-y-3">
        <p className="text-[#7D8B91]">Tertiary</p>
        <button
          className="h-12 px-8 text-[#7D8B91] hover:text-[#1B262C] transition-colors"
        >
          Tertiary Button
        </button>
      </div>

      {/* Kid Mode Button */}
      <div className="space-y-3">
        <p className="text-[#7D8B91]">Kid Mode</p>
        <button
          className="h-12 px-8 bg-gradient-to-r from-[#2E8BC0] to-[#2EC4B6] text-white rounded-2xl flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Play className="w-5 h-5" />
          Kid Mode
        </button>
      </div>
    </div>
  );
}
