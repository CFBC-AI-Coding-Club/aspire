import { User } from "lucide-react";

export function AvatarGroup() {
  return (
    <div className="bg-white rounded-2xl p-8">
      <div className="flex items-center gap-12">
        {/* Avatar 48px */}
        <div className="space-y-4">
          <p className="text-[#7D8B91]">Avatar 48px</p>
          <div className="flex items-center gap-4">
            {/* With Image */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2E8BC0] to-[#2EC4B6] flex items-center justify-center text-white">
              JD
            </div>
            {/* Icon Fallback */}
            <div className="w-12 h-12 rounded-full bg-[#E8EFF2] flex items-center justify-center">
              <User className="w-6 h-6 text-[#7D8B91]" />
            </div>
          </div>
        </div>

        {/* Avatar 64px */}
        <div className="space-y-4">
          <p className="text-[#7D8B91]">Avatar 64px</p>
          <div className="flex items-center gap-4">
            {/* With Image */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2E8BC0] to-[#2EC4B6] flex items-center justify-center text-white">
              <span className="text-xl">JD</span>
            </div>
            {/* Icon Fallback */}
            <div className="w-16 h-16 rounded-full bg-[#E8EFF2] flex items-center justify-center">
              <User className="w-8 h-8 text-[#7D8B91]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
