import { createFileRoute } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
	Bell,
	Calendar,
	Camera,
	Check,
	Edit2,
	LogOut,
	Moon,
	Shield,
	Target,
	TrendingUp,
	Trophy,
	X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardTitle, StatCard } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../data/mockStocks";

export const Route = createFileRoute("/_app/profile")({
	component: ProfilePage,
});

// Achievement data
const achievements = [
	{
		id: 1,
		icon: "🎯",
		name: "First Trade",
		description: "Complete your first trade",
		unlocked: true,
		date: "2024-01-15",
	},
	{
		id: 2,
		icon: "📈",
		name: "Bull Run",
		description: "Make 10 profitable trades",
		unlocked: true,
		date: "2024-02-01",
	},
	{
		id: 3,
		icon: "💎",
		name: "Diamond Hands",
		description: "Hold a stock for 30 days",
		unlocked: true,
		date: "2024-02-15",
	},
	{
		id: 4,
		icon: "🏆",
		name: "Top 10",
		description: "Reach top 10 on leaderboard",
		unlocked: true,
		date: "2024-03-01",
	},
	{
		id: 5,
		icon: "📚",
		name: "Scholar",
		description: "Complete all beginner guides",
		unlocked: false,
		date: null,
	},
	{
		id: 6,
		icon: "🎮",
		name: "Game Master",
		description: "Win 50 games",
		unlocked: false,
		date: null,
	},
	{
		id: 7,
		icon: "💰",
		name: "Millionaire",
		description: "Reach $1M portfolio value",
		unlocked: false,
		date: null,
	},
	{
		id: 8,
		icon: "🔥",
		name: "Hot Streak",
		description: "10 winning trades in a row",
		unlocked: false,
		date: null,
	},
];

// Avatar options
const avatarOptions = [
	"🦁",
	"🦊",
	"🐺",
	"🦋",
	"🦄",
	"🐉",
	"🦩",
	"🐙",
	"🐝",
	"🦅",
	"🐸",
	"🐨",
];

function ProfilePage() {
	const { user, logout, updateUser } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [editedName, setEditedName] = useState(user?.name || "");
	const [showAvatarPicker, setShowAvatarPicker] = useState(false);
	const [activeTab, setActiveTab] = useState<
		"overview" | "achievements" | "settings"
	>("overview");

	const isParent = user?.accountType === "parent";
	const accentColor = isParent ? "yellow" : "blue";

	const handleSave = () => {
		updateUser({ name: editedName });
		setIsEditing(false);
	};

	const handleAvatarChange = (avatar: string) => {
		updateUser({ avatar });
		setShowAvatarPicker(false);
	};

	// Mock stats
	const stats = {
		totalTrades: 47,
		winRate: 68,
		bestTrade: 601.76,
		worstTrade: -126.5,
		avgHoldTime: "12 days",
		portfolioATH: 19500.0,
	};

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header Card */}
			<Card
				className={clsx(
					"relative overflow-hidden",
					isParent
						? "bg-gradient-to-br from-[#FBBF24]/10 to-[#F59E0B]/5"
						: "bg-gradient-to-br from-[#3B82F6]/10 to-[#2563EB]/5",
				)}
			>
				{/* Background Pattern */}
				<div className="absolute top-0 right-0 w-64 h-64 opacity-10">
					<div
						className={clsx(
							"absolute inset-0 rounded-full blur-3xl",
							isParent ? "bg-[#FBBF24]" : "bg-[#3B82F6]",
						)}
					/>
				</div>

				<div className="relative flex flex-col md:flex-row items-center gap-6">
					{/* Avatar */}
					<div className="relative">
						<button
							onClick={() => setShowAvatarPicker(!showAvatarPicker)}
							className={clsx(
								"w-24 h-24 rounded-2xl flex items-center justify-center text-5xl",
								"bg-gradient-to-br border-4 transition-transform hover:scale-105",
								isParent
									? "from-[#FBBF24]/20 to-[#F59E0B]/20 border-[#FBBF24]/30"
									: "from-[#3B82F6]/20 to-[#2563EB]/20 border-[#3B82F6]/30",
							)}
						>
							{user?.avatar || "👤"}
						</button>
						<button
							onClick={() => setShowAvatarPicker(!showAvatarPicker)}
							className={clsx(
								"absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center",
								isParent
									? "bg-[#FBBF24] text-black"
									: "bg-[#3B82F6] text-white",
							)}
						>
							<Camera className="w-4 h-4" />
						</button>

						{/* Avatar Picker */}
						{showAvatarPicker && (
							<div className="absolute top-full mt-2 left-0 z-20 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 shadow-xl">
								<div className="grid grid-cols-4 gap-2">
									{avatarOptions.map((avatar) => (
										<button
											key={avatar}
											onClick={() => handleAvatarChange(avatar)}
											className={clsx(
												"w-10 h-10 rounded-lg flex items-center justify-center text-xl",
												"hover:bg-[#2a2a2a] transition-colors",
												user?.avatar === avatar &&
													"bg-[#3B82F6]/20 ring-2 ring-[#3B82F6]",
											)}
										>
											{avatar}
										</button>
									))}
								</div>
							</div>
						)}
					</div>

					{/* User Info */}
					<div className="flex-1 text-center md:text-left">
						{isEditing ? (
							<div className="flex items-center gap-2 justify-center md:justify-start">
								<Input
									value={editedName}
									onChange={(e) => setEditedName(e.target.value)}
									className="text-xl font-bold"
									accent={accentColor}
								/>
								<Button variant="success" size="sm" onClick={handleSave}>
									<Check className="w-4 h-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setEditedName(user?.name || "");
										setIsEditing(false);
									}}
								>
									<X className="w-4 h-4" />
								</Button>
							</div>
						) : (
							<div className="flex items-center gap-2 justify-center md:justify-start">
								<h1 className="text-2xl font-bold text-white">{user?.name}</h1>
								<button
									onClick={() => setIsEditing(true)}
									className="text-[#6a6a6a] hover:text-white transition-colors"
								>
									<Edit2 className="w-4 h-4" />
								</button>
							</div>
						)}
						<p
							className={clsx(
								"text-sm font-medium mb-2",
								isParent ? "text-[#FBBF24]" : "text-[#60A5FA]",
							)}
						>
							{isParent
								? "Parent Account"
								: `Level ${user?.level || 1} Investor`}
						</p>
						<p className="text-[#6a6a6a] text-sm">
							Member since{" "}
							{new Date(user?.createdAt || "").toLocaleDateString("en-US", {
								month: "long",
								year: "numeric",
							})}
						</p>
					</div>

					{/* Quick Stats */}
					{!isParent && (
						<div className="flex gap-6">
							<div className="text-center">
								<p className="text-2xl font-bold text-white">
									{user?.points || 0}
								</p>
								<p className="text-xs text-[#6a6a6a]">XP Points</p>
							</div>
							<div className="text-center">
								<p className="text-2xl font-bold text-white">
									{achievements.filter((a) => a.unlocked).length}
								</p>
								<p className="text-xs text-[#6a6a6a]">Achievements</p>
							</div>
							<div className="text-center">
								<p className="text-2xl font-bold text-white">#4</p>
								<p className="text-xs text-[#6a6a6a]">Rank</p>
							</div>
						</div>
					)}
				</div>
			</Card>

			{/* Tabs */}
			<div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl w-fit border border-[#2a2a2a]">
				{(["overview", "achievements", "settings"] as const).map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={clsx(
							"px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
							activeTab === tab
								? isParent
									? "bg-[#FBBF24] text-black"
									: "bg-[#3B82F6] text-white"
								: "text-[#6a6a6a] hover:text-white",
						)}
					>
						{tab}
					</button>
				))}
			</div>

			{/* Tab Content */}
			{activeTab === "overview" && (
				<div className="space-y-6 animate-fade-in">
					{/* Stats Grid */}
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
						<StatCard
							label="Total Trades"
							value={stats.totalTrades}
							icon={<TrendingUp className="w-6 h-6 text-[#60A5FA]" />}
						/>
						<StatCard
							label="Win Rate"
							value={`${stats.winRate}%`}
							icon={<Target className="w-6 h-6 text-[#22C55E]" />}
							accent="success"
						/>
						<StatCard
							label="Best Trade"
							value={formatCurrency(stats.bestTrade)}
							icon="🎯"
							change={35}
							accent="success"
						/>
						<StatCard
							label="Worst Trade"
							value={formatCurrency(Math.abs(stats.worstTrade))}
							icon="📉"
							change={-4.42}
							accent="error"
						/>
						<StatCard
							label="Avg Hold Time"
							value={stats.avgHoldTime}
							icon={<Calendar className="w-6 h-6 text-[#FBBF24]" />}
						/>
						<StatCard
							label="Portfolio ATH"
							value={formatCurrency(stats.portfolioATH)}
							icon={<Trophy className="w-6 h-6 text-[#FBBF24]" />}
						/>
					</div>

					{/* Recent Achievements */}
					<Card>
						<CardTitle className="mb-4">Recent Achievements</CardTitle>
						<div className="grid md:grid-cols-2 gap-3">
							{achievements
								.filter((a) => a.unlocked)
								.slice(0, 4)
								.map((achievement) => (
									<div
										key={achievement.id}
										className="flex items-center gap-3 p-3 bg-[#121212] rounded-xl"
									>
										<div className="w-12 h-12 rounded-xl bg-[#FBBF24]/20 flex items-center justify-center text-2xl">
											{achievement.icon}
										</div>
										<div className="flex-1">
											<p className="font-medium text-white">
												{achievement.name}
											</p>
											<p className="text-xs text-[#6a6a6a]">
												{achievement.date}
											</p>
										</div>
									</div>
								))}
						</div>
					</Card>
				</div>
			)}

			{activeTab === "achievements" && (
				<div className="animate-fade-in">
					<Card>
						<div className="flex items-center justify-between mb-6">
							<CardTitle>All Achievements</CardTitle>
							<span className="text-sm text-[#6a6a6a]">
								{achievements.filter((a) => a.unlocked).length} /{" "}
								{achievements.length} unlocked
							</span>
						</div>
						<div className="grid md:grid-cols-2 gap-4">
							{achievements.map((achievement) => (
								<div
									key={achievement.id}
									className={clsx(
										"flex items-center gap-4 p-4 rounded-xl transition-all",
										achievement.unlocked
											? "bg-[#121212]"
											: "bg-[#0a0a0a] opacity-50",
									)}
								>
									<div
										className={clsx(
											"w-14 h-14 rounded-xl flex items-center justify-center text-3xl",
											achievement.unlocked ? "bg-[#FBBF24]/20" : "bg-[#2a2a2a]",
										)}
									>
										{achievement.icon}
									</div>
									<div className="flex-1">
										<p className="font-semibold text-white">
											{achievement.name}
										</p>
										<p className="text-sm text-[#6a6a6a]">
											{achievement.description}
										</p>
										{achievement.unlocked && (
											<p className="text-xs text-[#22C55E] mt-1">
												✓ Unlocked {achievement.date}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					</Card>
				</div>
			)}

			{activeTab === "settings" && (
				<div className="space-y-4 animate-fade-in max-w-2xl">
					<Card>
						<CardTitle className="mb-6">Preferences</CardTitle>
						<div className="space-y-4">
							<div className="flex items-center justify-between p-4 bg-[#121212] rounded-xl">
								<div className="flex items-center gap-3">
									<Bell className="w-5 h-5 text-[#6a6a6a]" />
									<div>
										<p className="font-medium text-white">Notifications</p>
										<p className="text-sm text-[#6a6a6a]">
											Get alerts about your portfolio
										</p>
									</div>
								</div>
								<button className="w-12 h-6 bg-[#3B82F6] rounded-full relative">
									<div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
								</button>
							</div>

							<div className="flex items-center justify-between p-4 bg-[#121212] rounded-xl">
								<div className="flex items-center gap-3">
									<Moon className="w-5 h-5 text-[#6a6a6a]" />
									<div>
										<p className="font-medium text-white">Dark Mode</p>
										<p className="text-sm text-[#6a6a6a]">Always enabled</p>
									</div>
								</div>
								<button className="w-12 h-6 bg-[#3B82F6] rounded-full relative cursor-not-allowed opacity-50">
									<div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
								</button>
							</div>

							<div className="flex items-center justify-between p-4 bg-[#121212] rounded-xl">
								<div className="flex items-center gap-3">
									<Shield className="w-5 h-5 text-[#6a6a6a]" />
									<div>
										<p className="font-medium text-white">Privacy</p>
										<p className="text-sm text-[#6a6a6a]">
											Hide profile from leaderboard
										</p>
									</div>
								</div>
								<button className="w-12 h-6 bg-[#2a2a2a] rounded-full relative">
									<div className="absolute left-1 top-1 w-4 h-4 bg-[#6a6a6a] rounded-full" />
								</button>
							</div>
						</div>
					</Card>

					<Card className="border-[#EF4444]/30">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<LogOut className="w-5 h-5 text-[#EF4444]" />
								<div>
									<p className="font-medium text-white">Log Out</p>
									<p className="text-sm text-[#6a6a6a]">
										Sign out of your account
									</p>
								</div>
							</div>
							<Button variant="danger" onClick={logout}>
								Log Out
							</Button>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}
