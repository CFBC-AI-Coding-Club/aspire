export function Splash() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#2E8BC0] to-[#2EC4B6] flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="w-24 h-24 mx-auto bg-white rounded-3xl flex items-center justify-center shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD447] to-[#FFA447]" />
        </div>
        
        {/* App Name */}
        <h1 className="text-white">ASPIRE</h1>
        <p className="text-white opacity-90">Financial Literacy for Kids</p>
      </div>
    </div>
  );
}
