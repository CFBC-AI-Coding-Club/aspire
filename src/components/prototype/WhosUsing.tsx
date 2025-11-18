import { User, Users } from "lucide-react";

interface WhosUsingProps {
  onContinue: () => void;
}

export function WhosUsing({ onContinue }: WhosUsingProps) {
  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-[#1B262C]">Who's Using ASPIRE?</h1>
          <p className="text-[#7D8B91]">Choose your profile to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kid Profile */}
          <button
            onClick={onContinue}
            className="bg-gradient-to-br from-[#FFD447] to-[#FFA447] rounded-[24px] p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-white text-2xl fond-extrabold mb-2">Kid</h2>
            <p className="text-white">
              Learn about money and manage your savings
            </p>
          </button>

          {/* Parent Profile */}
          <button
            onClick={onContinue}
            className="bg-linear-to-br from-[#2EC4B6] to-[#2E8BC0] rounded-[24px] p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-white mb-2">Parent</h2>
            <p className="text-white">
              Monitor progress and manage allowances
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
