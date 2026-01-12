export function Splash() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#2E8BC0] to-[#2EC4B6] flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="w-32 h-32 mx-auto bg-white rounded-3xl flex items-center justify-center shadow-[0_16px_48px_rgba(0,0,0,0.2)] p-4">
          <img
            src="/aspire-logo.png"
            alt="Aspire - Achieving Success through Personal Investment, Resources and Education"
            className="w-full h-full object-contain"
          />
        </div>

        {/* App Name */}
        <h1 className="text-white text-4xl font-bold">ASPIRE</h1>
        <p className="text-white opacity-90 text-lg">
          Financial Literacy for Kids
        </p>
      </div>
    </div>
  );
}
