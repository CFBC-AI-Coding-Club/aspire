export function InputSystem() {
  return (
    <div className="bg-white rounded-2xl p-8 space-y-4">
      <div>
        <p className="text-[#1B262C] mb-1">Input Field</p>
        <p className="text-[#7D8B91] mb-4">Rounded 12px, Border Light Gray, Focus border: Aspire Blue, Inside label: Medium Gray</p>
      </div>
      
      <div className="max-w-md space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Email address"
            className="w-full h-12 px-4 rounded-xl border border-[#E8EFF2] placeholder:text-[#7D8B91] text-[#1B262C] focus:outline-none focus:border-[#2E8BC0] transition-colors"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Amount"
            className="w-full h-12 px-4 rounded-xl border border-[#E8EFF2] placeholder:text-[#7D8B91] text-[#1B262C] focus:outline-none focus:border-[#2E8BC0] transition-colors"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            defaultValue="Focused state"
            className="w-full h-12 px-4 rounded-xl border-2 border-[#2E8BC0] placeholder:text-[#7D8B91] text-[#1B262C] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
