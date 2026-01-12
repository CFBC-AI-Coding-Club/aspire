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
	Sparkles,
	TrendingUp,
	Trophy,
	User,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { Holding } from "../../data/mockStocks";

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

// Mock live investments for sidebar
const mockLiveInvestments: Holding[] = [
	{
		stockId: "AAPL",
		symbol: "AAPL",
		name: "Apple Inc.",
		quantity: 25,
		avgBuyPrice: 165.5,
		currentPrice: 178.72,
		totalValue: 4468.0,
		gainLoss: 330.5,
		gainLossPercent: 7.99,
	},
	{
		stockId: "MSFT",
		symbol: "MSFT",
		name: "Microsoft",
		quantity: 10,
		avgBuyPrice: 350.0,
		currentPrice: 378.91,
		totalValue: 3789.1,
		gainLoss: 289.1,
		gainLossPercent: 8.26,
	},
	{
		stockId: "NVDA",
		symbol: "NVDA",
		name: "NVIDIA",
		quantity: 8,
		avgBuyPrice: 420.0,
		currentPrice: 495.22,
		totalValue: 3961.76,
		gainLoss: 601.76,
		gainLossPercent: 17.9,
	},
	{
		stockId: "TSLA",
		symbol: "TSLA",
		name: "Tesla",
		quantity: 11,
		avgBuyPrice: 260.0,
		currentPrice: 248.5,
		totalValue: 2733.5,
		gainLoss: -126.5,
		gainLossPercent: -4.42,
	},
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
	const [showInvestments, setShowInvestments] = useState(true);

	const isParent = user?.accountType === "parent";
	const accentColor = isParent ? "yellow" : "blue";

	return (
		<aside
			className={clsx(
				"fixed left-0 top-0 h-screen z-50",
				"bg-[#0a0a0a] border-r border-[#1a1a1a]",
				"flex flex-col",
				"transition-all duration-300 ease-out",
				// Desktop behavior
				"hidden lg:flex",
				isCollapsed ? "lg:w-[72px]" : "lg:w-[280px]",
				// Mobile behavior
				mobileMenuOpen ? "flex" : "hidden lg:flex",
				"w-[280px] lg:w-auto",
			)}
		>
			{/* Logo & Toggle */}
			<div
				className={clsx(
					"flex items-center justify-between",
					"h-16 px-4 border-b border-[#1a1a1a]",
				)}
			>
				{!isCollapsed && (
					<Link
						to="/dashboard"
						className="flex items-center gap-2"
						onClick={() => setMobileMenuOpen?.(false)}
					>
						<div
							className={clsx(
								"w-9 h-9 rounded-xl flex items-center justify-center",
								"bg-gradient-to-br",
								isParent
									? "from-[#FBBF24] to-[#F59E0B]"
									: "from-[#3B82F6] to-[#2563EB]",
							)}
						>
							<Sparkles className="w-5 h-5 text-white" />
						</div>
						<span className="font-bold text-xl text-white">Aspire</span>
					</Link>
				)}
				<button
					onClick={onToggle}
					className={clsx(
						"p-2 rounded-lg",
						"text-[#6a6a6a] hover:text-white",
						"hover:bg-[#1a1a1a]",
						"transition-colors duration-200",
						isCollapsed && "mx-auto",
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
					onClick={() => setMobileMenuOpen?.(false)}
					className={clsx(
						"p-2 rounded-lg",
						"text-[#6a6a6a] hover:text-white",
						"hover:bg-[#1a1a1a]",
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
				<div className="px-4 py-4 border-b border-[#1a1a1a]">
					<div className="flex items-center gap-3">
						<div
							className={clsx(
								"w-10 h-10 rounded-full flex items-center justify-center text-lg",
								"bg-gradient-to-br",
								isParent
									? "from-[#FBBF24]/20 to-[#F59E0B]/20"
									: "from-[#3B82F6]/20 to-[#2563EB]/20",
							)}
						>
							{user.avatar || "👤"}
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-medium text-white truncate">{user.name}</p>
							<p
								className={clsx(
									"text-xs",
									isParent ? "text-[#FBBF24]" : "text-[#60A5FA]",
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
											? clsx(
													"bg-gradient-to-r",
													accentColor === "yellow"
														? "from-[#FBBF24]/20 to-transparent text-[#FBBF24]"
														: "from-[#3B82F6]/20 to-transparent text-[#60A5FA]",
												)
											: "text-[#9a9a9a] hover:text-white hover:bg-[#1a1a1a]",
										isCollapsed && "justify-center",
									)}
								>
									{isActive && (
										<div
											className={clsx(
												"absolute left-0 top-1/2 -translate-y-1/2",
												"w-1 h-6 rounded-r-full",
												accentColor === "yellow"
													? "bg-[#FBBF24]"
													: "bg-[#3B82F6]",
											)}
										/>
									)}
									<Icon
										className={clsx(
											"w-5 h-5 flex-shrink-0",
											isActive
												? accentColor === "yellow"
													? "text-[#FBBF24]"
													: "text-[#60A5FA]"
												: "group-hover:text-white",
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
			{!isCollapsed && (
				<div className="border-t border-[#1a1a1a] px-3 py-4">
          <button
            type="button"
            onClick={() => setShowInvestments(!showInvestments)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-[#6a6a6a] hover:text-white transition-colors"
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
							{mockLiveInvestments.map((holding) => (
								<Link
									key={holding.stockId}
									to="/portfolio"
									onClick={() => setMobileMenuOpen?.(false)}
									className={clsx(
										"block px-3 py-2 rounded-lg",
										"bg-[#121212] hover:bg-[#1a1a1a]",
										"transition-colors duration-200",
									)}
								>
									<div className="flex items-center justify-between">
										<span className="font-medium text-white text-sm">
											{holding.symbol}
										</span>
										<span className="text-[#9a9a9a] text-xs font-mono">
											${holding.currentPrice.toFixed(2)}
										</span>
									</div>
									<div className="flex items-center justify-between mt-1">
										<span className="text-xs text-[#6a6a6a]">
											{holding.quantity} shares
										</span>
										<span
											className={clsx(
												"text-xs font-medium",
												holding.gainLossPercent >= 0
													? "text-[#22C55E]"
													: "text-[#EF4444]",
											)}
										>
											{holding.gainLossPercent >= 0 ? "+" : ""}
											{holding.gainLossPercent.toFixed(2)}%
										</span>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			)}

			{/* Logout Button */}
			<div className="border-t border-[#1a1a1a] p-3">
				<button
					onClick={logout}
					className={clsx(
						"flex items-center gap-3 w-full",
						"px-3 py-2.5 rounded-xl",
						"text-[#9a9a9a] hover:text-[#EF4444] hover:bg-[#EF4444]/10",
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
