import { Link, useLocation } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Home,
  LogOut,
  PlusCircle,
  TrendingUp,
  Trophy,
  User,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUserProfileQuery } from "../../hooks/queries/useUsersQuery";
import { formatCurrency } from "../../data/mockStocks";

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { path: "/dashboard", label: "Home", icon: Home },
  { path: "/market", label: "Market", icon: TrendingUp },
  { path: "/portfolio", label: "Portfolio", icon: Briefcase },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/games", label: "Games", icon: Gamepad2 },
  { path: "/guides", label: "Guides", icon: BookOpen },
  { path: "/create-stock", label: "Create Stock", icon: PlusCircle },
  { path: "/profile", label: "Profile", icon: User },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export function Sidebar({
  isCollapsed,
  onToggle,
  mobileMenuOpen = false,
  setMobileMenuOpen,
}: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { data: userProfile } = useUserProfileQuery();
  const [showInvestments, setShowInvestments] = useState(true);

  const isParent = user?.accountType === "PARENT";

  // Portfolio holdings from API
  const holdings = userProfile?.portfolio || [];

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-screen z-50",
        "bg-white border-r border-[#482977]/10",
        "flex flex-col",
        "transition-all duration-300 ease-out",
        "shadow-lg",
        // Width
        "w-[280px]",
        isCollapsed ? "lg:w-[72px]" : "lg:w-[280px]",
        // Visibility: slide in/out on mobile, always visible on desktop
        "lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      {/* Logo & Toggle */}
      <div
        className={clsx(
          "flex items-center justify-between",
          "h-16 px-4 border-b border-[#482977]/10",
        )}
      >
        {!isCollapsed ? (
          <Link
            to="/dashboard"
            className="flex items-center"
            onClick={() => setMobileMenuOpen?.(false)}
          >
            <img
              src="/aspire-logo.png"
              alt="Aspire - Achieving Success through Personal Investment, Resources and Education"
              className="h-10 w-auto"
            />
          </Link>
        ) : (
          <Link
            to="/dashboard"
            className="flex items-center justify-center mx-auto"
            onClick={() => setMobileMenuOpen?.(false)}
          >
            <img src="/aspire-simple.png" alt="Aspire" className="h-8 w-auto" />
          </Link>
        )}
        <button
          type="button"
          onClick={onToggle}
          className={clsx(
            "p-2 rounded-lg",
            "text-[#7a8aa3] hover:text-[#482977]",
            "hover:bg-[#482977]/5",
            "transition-colors duration-200",
            isCollapsed && "absolute right-2 top-4",
            "hidden lg:block",
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen?.(false)}
          className={clsx(
            "p-2 rounded-lg",
            "text-[#7a8aa3] hover:text-[#482977]",
            "hover:bg-[#482977]/5",
            "transition-colors duration-200",
            "lg:hidden",
          )}
          aria-label="Close menu"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="px-4 py-4 border-b border-[#482977]/10">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                "bg-gradient-to-br from-[#482977]/10 to-[#6b42a1]/10",
              )}
            >
              {user.avatar || "👤"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#1a1a2e] truncate">{user.name}</p>
              <p
                className={clsx(
                  "text-xs",
                  isParent ? "text-[#c22f99]" : "text-[#482977]",
                )}
              >
                {isParent ? "Parent Account" : `Level ${user.level || 1}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileMenuOpen?.(false)}
                  className={clsx(
                    "flex items-center gap-3",
                    "px-3 py-2.5 rounded-xl",
                    "transition-all duration-200",
                    "group relative",
                    isActive
                      ? "bg-gradient-to-r from-[#482977]/15 to-transparent text-[#482977]"
                      : "text-[#566279] hover:text-[#482977] hover:bg-[#482977]/5",
                    isCollapsed && "justify-center",
                  )}
                >
                  {isActive && (
                    <div
                      className={clsx(
                        "absolute left-0 top-1/2 -translate-y-1/2",
                        "w-1 h-6 rounded-r-full",
                        "bg-[#482977]",
                      )}
                    />
                  )}
                  <Icon
                    className={clsx(
                      "w-5 h-5 flex-shrink-0",
                      isActive
                        ? "text-[#482977]"
                        : "group-hover:text-[#482977]",
                    )}
                  />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Live Investments Widget */}
      {!isCollapsed && holdings.length > 0 && (
        <div className="border-t border-[#482977]/10 px-3 py-4">
          <button
            type="button"
            onClick={() => setShowInvestments(!showInvestments)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-[#7a8aa3] hover:text-[#482977] transition-colors"
          >
            <span>Live Investments</span>
            <ChevronRight
              className={clsx(
                "w-4 h-4 transition-transform duration-200",
                showInvestments && "rotate-90",
              )}
            />
          </button>

          {showInvestments && (
            <div className="mt-2 space-y-2 max-h-[180px] overflow-y-auto">
              {holdings.slice(0, 4).map((holding: any) => (
                <Link
                  key={holding.id}
                  to="/portfolio"
                  onClick={() => setMobileMenuOpen?.(false)}
                  className={clsx(
                    "block px-3 py-2 rounded-lg",
                    "bg-[#f8f9fc] hover:bg-[#f1f3f9]",
                    "transition-colors duration-200",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#1a1a2e] text-sm">
                      {holding.ticker}
                    </span>
                    <span className="text-[#566279] text-xs font-mono">
                      {formatCurrency(holding.avgPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#7a8aa3]">
                      {holding.quantity} shares
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Logout Button */}
      <div className="border-t border-[#482977]/10 p-3">
        <button
          type="button"
          onClick={logout}
          className={clsx(
            "flex items-center gap-3 w-full",
            "px-3 py-2.5 rounded-xl",
            "text-[#566279] hover:text-[#dc2626] hover:bg-[#dc2626]/10",
            "transition-all duration-200",
            isCollapsed && "justify-center",
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
