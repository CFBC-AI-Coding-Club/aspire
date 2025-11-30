import { AlertCircle } from "lucide-react";

export function InputGroup() {
  return (
    <div className="bg-white rounded-2xl p-8 space-y-8">
      {/* Default Input */}
      <div className="space-y-3">
        <p className="text-[#7D8B91]">Default</p>
        <input
          type="text"
          placeholder="Email address"
          className="w-full max-w-md h-12 px-4 rounded-xl border border-[#E8EFF2] placeholder:text-[#7D8B91] text-[#1B262C] focus:outline-none focus:border-[#2E8BC0] transition-colors"
        />
      </div>

      {/* Focus Input */}
      <div className="space-y-3">
        <p className="text-[#7D8B91]">Focus</p>
        <input
          type="text"
          placeholder="Email address"
          defaultValue="user@example.com"
          className="w-full max-w-md h-12 px-4 rounded-xl border-2 border-[#2E8BC0] placeholder:text-[#7D8B91] text-[#1B262C] focus:outline-none"
        />
      </div>

      {/* Error Input */}
      <div className="space-y-3">
        <p className="text-[#7D8B91]">Error</p>
        <div className="max-w-md space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Email address"
              defaultValue="invalid-email"
              className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-[#FF6F61] placeholder:text-[#7D8B91] text-[#1B262C] focus:outline-none focus:border-[#FF6F61]"
            />
            <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF6F61]" />
          </div>
          <p className="text-[#FF6F61]">Please enter a valid email address</p>
        </div>
      </div>
    </div>
  );
}
