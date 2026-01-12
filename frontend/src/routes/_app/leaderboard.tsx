import { createFileRoute } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
	ArrowDown,
	ArrowUp,
	Medal,
	Minus,
	Star,
	TrendingUp,
	Trophy,
} from "lucide-react";
import { useState } from "react";
import { Card, CardTitle } from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import {
	formatCurrency,
	formatPercent,
	mockLeaderboard,
} from "../../data/mockStocks";

export const Route = createFileRoute("/_app/leaderboard")({
	component: LeaderboardPage,
});

type TimeFilter = "all" | "month" | "week";

// Rank Badge Component
function RankBadge({ rank }: { rank: number }) {
	if (rank === 1) {
		return (
			<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] flex items-center justify-center shadow-lg shadow-yellow-500/30">
				<Trophy className="w-5 h-5 text-white" />
			</div>
		);
	}
	if (rank === 2) {
		return (
			<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9CA3AF] to-[#6B7280] flex items-center justify-center">
				<Medal className="w-5 h-5 text-white" />
			</div>
		);
	}
	if (rank === 3) {
		return (
			<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#A0522D] flex items-center justify-center">
				<Medal className="w-5 h-5 text-white" />
			</div>
		);
	}
	return (
		<div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
			<span className="font-bold text-[#6a6a6a]">{rank}</span>
		</div>
	);
}

// Rank Change Indicator
function RankChange({
	current,
	previous,
}: {
	current: number;
	previous: number;
}) {
	const diff = previous - current;

	if (diff > 0) {
		return (
			<div className="flex items-center gap-1 text-[#22C55E]">
				<ArrowUp className="w-4 h-4" />
				<span className="text-sm">{diff}</span>
			</div>
		);
	}
	if (diff < 0) {
		return (
			<div className="flex items-center gap-1 text-[#EF4444]">
				<ArrowDown className="w-4 h-4" />
				<span className="text-sm">{Math.abs(diff)}</span>
			</div>
		);
	}
	return (
		<div className="flex items-center text-[#6a6a6a]">
			<Minus className="w-4 h-4" />
		</div>
	);
}

// Leaderboard Row Component
function LeaderboardRow({
	user,
	isCurrentUser,
}: {
	user: (typeof mockLeaderboard)[0];
	isCurrentUser: boolean;
}) {
	const isPositive = user.totalReturnPercent >= 0;

	return (
		<div
			className={clsx(
				"flex items-center justify-between p-4 rounded-xl transition-all",
				isCurrentUser
					? "bg-gradient-to-r from-[#3B82F6]/20 to-transparent border-2 border-[#3B82F6]/50"
					: "bg-[#121212] hover:bg-[#1a1a1a]",
				user.rank <= 3 && !isCurrentUser && "border border-[#2a2a2a]",
			)}
		>
			<div className="flex items-center gap-4">
				{/* Rank */}
				<RankBadge rank={user.rank} />

				{/* Rank Change */}
				<div className="w-8">
					<RankChange current={user.rank} previous={user.previousRank} />
				</div>

				{/* Avatar & Name */}
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center text-2xl">
						{user.avatar}
					</div>
					<div>
						<div className="flex items-center gap-2">
							<p className="font-semibold text-white">{user.name}</p>
							{isCurrentUser && (
								<span className="px-2 py-0.5 rounded bg-[#3B82F6] text-white text-xs font-medium">
									You
								</span>
							)}
						</div>
						<div className="flex items-center gap-2">
							{user.badges.map((badge, i) => (
								<span key={i} className="text-sm">
									{badge}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-8">
				{/* Win Rate */}
				<div className="hidden md:block text-right">
					<p className="text-sm text-[#6a6a6a]">Win Rate</p>
					<p className="font-medium text-white">{user.winRate}%</p>
				</div>

				{/* Total Trades */}
				<div className="hidden lg:block text-right">
					<p className="text-sm text-[#6a6a6a]">Trades</p>
					<p className="font-medium text-white">{user.totalTrades}</p>
				</div>

				{/* Return */}
				<div className="text-right">
					<p className="text-sm text-[#6a6a6a]">Return</p>
					<p
						className={clsx(
							"font-medium",
							isPositive ? "text-[#22C55E]" : "text-[#EF4444]",
						)}
					>
						{formatPercent(user.totalReturnPercent)}
					</p>
				</div>

				{/* Portfolio Value */}
				<div className="text-right min-w-[120px]">
					<p className="text-sm text-[#6a6a6a]">Portfolio</p>
					<p className="font-bold text-white font-mono">
						{formatCurrency(user.portfolioValue)}
					</p>
				</div>
			</div>
		</div>
	);
}

function LeaderboardPage() {
	const { user } = useAuth();
	const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

	// Find current user in leaderboard (mock)
	const currentUserRank = 4; // Mock rank for demo
	const currentUserData = mockLeaderboard.find(
		(u) => u.rank === currentUserRank,
	);

	// Top 3 for podium
	const top3 = mockLeaderboard.slice(0, 3);
	// Reorder for podium display: [2nd, 1st, 3rd]
	const podiumOrder = [top3[1], top3[0], top3[2]];

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-white mb-1">Leaderboard</h1>
					<p className="text-[#6a6a6a]">
						See how you rank against other investors
					</p>
				</div>

				{/* Time Filter */}
				<div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-[#2a2a2a]">
					{(["all", "month", "week"] as TimeFilter[]).map((filter) => (
						<button
							key={filter}
							onClick={() => setTimeFilter(filter)}
							className={clsx(
								"px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
								timeFilter === filter
									? "bg-[#3B82F6] text-white"
									: "text-[#6a6a6a] hover:text-white",
							)}
						>
							{filter === "all" ? "All Time" : `This ${filter}`}
						</button>
					))}
				</div>
			</div>

			{/* User's Rank Card */}
			{currentUserData && (
				<Card className="bg-gradient-to-r from-[#3B82F6]/10 to-[#2563EB]/5 border-[#3B82F6]/30">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-6">
							<div className="text-center">
								<p className="text-sm text-[#60A5FA] mb-1">Your Rank</p>
								<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center">
									<span className="text-2xl font-bold text-white">
										#{currentUserData.rank}
									</span>
								</div>
							</div>
							<div>
								<p className="text-xl font-bold text-white">{user?.name}</p>
								<p className="text-[#60A5FA]">
									{currentUserData.rank <= 10 ? "🔥 Top 10!" : "Keep climbing!"}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-8">
							<div className="text-right">
								<p className="text-sm text-[#6a6a6a]">Portfolio Value</p>
								<p className="text-xl font-bold text-white">
									{formatCurrency(currentUserData.portfolioValue)}
								</p>
							</div>
							<div className="text-right">
								<p className="text-sm text-[#6a6a6a]">Total Return</p>
								<p className="text-xl font-bold text-[#22C55E]">
									{formatPercent(currentUserData.totalReturnPercent)}
								</p>
							</div>
						</div>
					</div>
				</Card>
			)}

			{/* Podium */}
			<div className="flex justify-center items-end gap-4 py-8">
				{podiumOrder.map((user, index) => {
					const isFirst = index === 1;
					const isSecond = index === 0;
					const isThird = index === 2;

					return (
						<div
							key={user.id}
							className={clsx(
								"flex flex-col items-center",
								isFirst && "order-2",
								isSecond && "order-1",
								isThird && "order-3",
							)}
						>
							{/* User Info */}
							<div className="w-20 h-20 rounded-full bg-[#2a2a2a] flex items-center justify-center text-4xl mb-2 border-4 border-[#1a1a1a]">
								{user.avatar}
							</div>
							<p className="font-semibold text-white text-sm mb-1">
								{user.name}
							</p>
							<p className="text-[#22C55E] text-sm font-medium mb-2">
								{formatPercent(user.totalReturnPercent)}
							</p>

							{/* Podium */}
							<div
								className={clsx(
									"w-24 rounded-t-xl flex items-center justify-center font-bold text-white",
									isFirst &&
										"h-32 bg-gradient-to-b from-[#FBBF24] to-[#F59E0B]",
									isSecond &&
										"h-24 bg-gradient-to-b from-[#9CA3AF] to-[#6B7280]",
									isThird &&
										"h-20 bg-gradient-to-b from-[#CD7F32] to-[#A0522D]",
								)}
							>
								<div className="flex flex-col items-center">
									{isFirst && <Trophy className="w-6 h-6 mb-1" />}
									<span className="text-2xl">{user.rank}</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Full Leaderboard */}
			<Card padding="sm">
				<CardTitle className="px-4 py-3 border-b border-[#2a2a2a]">
					Rankings
				</CardTitle>
				<div className="space-y-2 p-2">
					{mockLeaderboard.map((leaderboardUser) => (
						<LeaderboardRow
							key={leaderboardUser.id}
							user={leaderboardUser}
							isCurrentUser={leaderboardUser.rank === currentUserRank}
						/>
					))}
				</div>
			</Card>

			{/* Stats Section */}
			<div className="grid md:grid-cols-3 gap-6">
				<Card>
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 rounded-xl bg-[#FBBF24]/20 flex items-center justify-center">
							<Star className="w-5 h-5 text-[#FBBF24]" />
						</div>
						<CardTitle>Top Performer</CardTitle>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center text-2xl">
							{mockLeaderboard[0].avatar}
						</div>
						<div>
							<p className="font-semibold text-white">
								{mockLeaderboard[0].name}
							</p>
							<p className="text-[#22C55E] text-sm">
								{formatPercent(mockLeaderboard[0].totalReturnPercent)} return
							</p>
						</div>
					</div>
				</Card>

				<Card>
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 rounded-xl bg-[#22C55E]/20 flex items-center justify-center">
							<TrendingUp className="w-5 h-5 text-[#22C55E]" />
						</div>
						<CardTitle>Biggest Climber</CardTitle>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center text-2xl">
							{mockLeaderboard[3].avatar}
						</div>
						<div>
							<p className="font-semibold text-white">
								{mockLeaderboard[3].name}
							</p>
							<p className="text-[#22C55E] text-sm">↑ 2 positions this week</p>
						</div>
					</div>
				</Card>

				<Card>
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center">
							<Trophy className="w-5 h-5 text-[#60A5FA]" />
						</div>
						<CardTitle>Most Trades</CardTitle>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center text-2xl">
							{mockLeaderboard[0].avatar}
						</div>
						<div>
							<p className="font-semibold text-white">
								{mockLeaderboard[0].name}
							</p>
							<p className="text-[#60A5FA] text-sm">
								{mockLeaderboard[0].totalTrades} trades
							</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
