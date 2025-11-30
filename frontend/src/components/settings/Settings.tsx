import { ArrowLeft, User, Shield, Info, HelpCircle, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    alert("Logged out successfully!");
    setShowLogoutConfirm(false);
  };

  const menuItems = [
    {
      icon: User,
      title: "Profile",
      description: "Manage your personal information",
      color: "#2E8BC0",
      bgColor: "#E3F5FF",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Password and privacy settings",
      color: "#2EC4B6",
      bgColor: "#E3F9F7",
    },
    {
      icon: Info,
      title: "About ASPIRE",
      description: "Learn more about the app",
      color: "#FFD447",
      bgColor: "#FFF4D6",
    },
    {
      icon: HelpCircle,
      title: "Help",
      description: "Get support and FAQs",
      color: "#FF6F61",
      bgColor: "#FFE8E6",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA]">
      {/* App Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#E8EFF2] transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#1B262C]" />
          </button>
          <h2 className="text-[#1B262C]">Settings</h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* User Profile Card */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2E8BC0] to-[#2EC4B6] flex items-center justify-center">
              <span className="text-white">AS</span>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-[#1B262C] mb-1">Alex Smith</h3>
              <p className="text-[#7D8B91]">alex.smith@email.com</p>
            </div>

            {/* Edit Button */}
            <button className="px-4 py-2 bg-[#E3F5FF] text-[#2E8BC0] rounded-xl hover:bg-[#B8E6FF] transition-colors">
              Edit
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all text-left flex items-center gap-4 group"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: item.bgColor }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-[#1B262C] mb-1">{item.title}</h3>
                <p className="text-[#7D8B91]">{item.description}</p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-6 h-6 text-[#7D8B91] group-hover:text-[#2E8BC0] transition-colors" />
            </button>
          ))}
        </div>

        {/* App Version */}
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-center">
          <p className="text-[#7D8B91] mb-1">Version 1.0.0</p>
          <p className="text-[#7D8B91]">© 2025 ASPIRE. All rights reserved.</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full h-14 bg-white border-2 border-[#FF6F61] text-[#FF6F61] rounded-2xl hover:bg-[#FFE8E6] transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-[24px] p-8 max-w-md w-full shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
            <h2 className="text-[#1B262C] mb-4">Logout</h2>
            <p className="text-[#7D8B91] mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-12 bg-[#E8EFF2] text-[#1B262C] rounded-xl hover:bg-[#D4DEE3] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 h-12 bg-[#FF6F61] text-white rounded-xl hover:bg-[#FF5A4D] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}