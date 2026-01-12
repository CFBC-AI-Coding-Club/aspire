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
import { useLeaderboardQuery } from "../../hooks/queries/useLeaderboardQuery";
import { formatCurrency } from "../../data/mockStocks";

export const Route = createFileRoute("/_app/leaderboard")({
	component: LeaderboardPage,
});

type TimeFilter = "all" | "month" | "week";

type LeaderboardUser = {
	id: string;
	name: string;
	avatar?: string;
	balance: number;
	xp?: number;
	level?: number;
};

// Rank Badge Component
function RankBadge({ rank }: { rank: number }) {
	if (rank === 1) {
		return (
			<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c22f99] to-[#9a2579] flex items-center justify-center shadow-lg shadow-[#c22f99]/30">
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
		<div className="w-10 h-10 rounded-full bg-[#f1f3f9] flex items-center justify-center">
			<span className="font-bold text-[#7a8aa3]">{rank}</span>
		</div>
	);
}

// Leaderboard Row Component
function LeaderboardRow({
	user,
	rank,
	isCurrentUser,
}: {
	user: LeaderboardUser;
	rank: number;
	isCurrentUser: boolean;
}) {
	return (
		<div
			className={clsx(
				"flex items-center justify-between p-4 rounded-xl transition-all",
				isCurrentUser
					? "bg-gradient-to-r from-[#482977]/10 to-transparent border-2 border-[#482977]/50"
					: "bg-[#f8f9fc] hover:bg-[#f1f3f9]",
				rank <= 3 && !isCurrentUser && "border border-[#482977]/10",
			)}
		>
			<div className="flex items-center gap-4">
				{/* Rank */}
				<RankBadge rank={rank} />

				{/* Avatar & Name */}
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 rounded-full bg-[#482977]/10 flex items-center justify-center text-2xl">
						{user.avatar || "👤"}
					</div>
					<div>
						<div className="flex items-center gap-2">
							<p className="font-semibold text-[#1a1a2e]">{user.name}</p>
							{isCurrentUser && (
								<span className="px-2 py-0.5 rounded bg-[#482977] text-white text-xs font-medium">
									You
								</span>
							)}
						</div>
						{user.level && (
							<p className="text-sm text-[#7a8aa3]">Level {user.level}</p>
						)}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-8">
				{/* XP */}
				{user.xp !== undefined && (
					<div className="hidden md:block text-right">
						<p className="text-sm text-[#7a8aa3]">XP</p>
						<p className="font-medium text-[#1a1a2e]">{user.xp}</p>
					</div>
				)}

				{/* Portfolio Value */}
				<div className="text-right min-w-[120px]">
					<p className="text-sm text-[#7a8aa3]">Portfolio</p>
					<p className="font-bold text-[#1a1a2e] font-mono">
						{formatCurrency(user.balance)}
					</p>
				</div>
			</div>
		</div>
	);
}

function LeaderboardPage() {
	const { user: currentUser } = useAuth();
	const { data: leaderboardData, isLoading } = useLeaderboardQuery();
	const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

	// Find current user's rank
	const currentUserRank = leaderboardData?.findIndex(
		(u: LeaderboardUser) => u.id === currentUser?.id
	) ?? -1;
	const currentUserData = currentUserRank >= 0 ? leaderboardData[currentUserRank] : null;

	// Top 3 for podium
	const top3 = leaderboardData?.slice(0, 3) || [];
	// Reorder for podium display: [2nd, 1st, 3rd]
	const podiumOrder = top3.length >= 3 
		? [top3[1], top3[0], top3[2]] 
		: top3;

	if (isLoading) {
		return (
			<div className="space-y-8 animate-fade-in">
				<div>
					<h1 className="text-3xl font-bold text-[#1a1a2e] mb-1">Leaderboard</h1>
					<p className="text-[#7a8aa3]">Loading...</p>
				</div>
				<div className="space-y-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<Card key={i} className="h-20 animate-pulse bg-[#f1f3f9]" />
					))}
				</div>
			</div>
		);
	}

	const leaderboard = leaderboardData || [];

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-[#1a1a2e] mb-1">Leaderboard</h1>
					<p className="text-[#7a8aa3]">
						See how you rank against other investors
					</p>
				</div>

				{/* Time Filter */}
				<div className="flex gap-1 bg-[#f1f3f9] p-1 rounded-xl border border-[#482977]/10">
					{(["all", "month", "week"] as TimeFilter[]).map((filter) => (
						<button
							key={filter}
							onClick={() => setTimeFilter(filter)}
							className={clsx(
								"px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
								timeFilter === filter
									? "bg-[#482977] text-white"
									: "text-[#7a8aa3] hover:text-[#1a1a2e]",
							)}
						>
							{filter === "all" ? "All Time" : `This ${filter}`}
						</button>
					))}
				</div>
			</div>

			{/* User's Rank Card */}
			{currentUserData && (
				<Card className="bg-gradient-to-r from-[#482977]/5 to-[#6b42a1]/5 border-[#482977]/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-6">
							<div className="text-center">
								<p className="text-sm text-[#482977] mb-1">Your Rank</p>
								<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#482977] to-[#6b42a1] flex items-center justify-center">
									<span className="text-2xl font-bold text-white">
										#{currentUserRank + 1}
									</span>
								</div>
							</div>
							<div>
								<p className="text-xl font-bold text-[#1a1a2e]">{currentUser?.name}</p>
								<p className="text-[#482977]">
									{currentUserRank < 10 ? "🔥 Top 10!" : "Keep climbing!"}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-8">
							<div className="text-right">
								<p className="text-sm text-[#7a8aa3]">Portfolio Value</p>
								<p className="text-xl font-bold text-[#1a1a2e]">
									{formatCurrency(currentUserData.balance)}
								</p>
							</div>
						</div>
					</div>
				</Card>
			)}

			{/* Podium */}
			{podiumOrder.length >= 3 && (
				<div className="flex justify-center items-end gap-4 py-8">
					{podiumOrder.map((user: LeaderboardUser, index: number) => {
						const isFirst = index === 1;
						const isSecond = index === 0;
						const isThird = index === 2;
						const originalRank = isFirst ? 1 : isSecond ? 2 : 3;

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
								<div className="w-20 h-20 rounded-full bg-[#482977]/10 flex items-center justify-center text-4xl mb-2 border-4 border-white shadow-lg">
									{user.avatar || "👤"}
								</div>
								<p className="font-semibold text-[#1a1a2e] text-sm mb-1">
									{user.name}
								</p>
								<p className="text-[#16a34a] text-sm font-medium mb-2">
									{formatCurrency(user.balance)}
								</p>

								{/* Podium */}
								<div
									className={clsx(
										"w-24 rounded-t-xl flex items-center justify-center font-bold text-white",
										isFirst &&
											"h-32 bg-gradient-to-b from-[#c22f99] to-[#9a2579]",
										isSecond &&
											"h-24 bg-gradient-to-b from-[#9CA3AF] to-[#6B7280]",
										isThird &&
											"h-20 bg-gradient-to-b from-[#CD7F32] to-[#A0522D]",
									)}
								>
									<div className="flex flex-col items-center">
										{isFirst && <Trophy className="w-6 h-6 mb-1" />}
										<span className="text-2xl">{originalRank}</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Full Leaderboard */}
			<Card padding="sm">
				<CardTitle className="px-4 py-3 border-b border-[#482977]/10">
					Rankings
				</CardTitle>
				<div className="space-y-2 p-2">
					{leaderboard.length === 0 ? (
						<div className="text-center py-12 text-[#7a8aa3]">
							<p>No users on the leaderboard yet.</p>
						</div>
					) : (
						leaderboard.map((leaderboardUser: LeaderboardUser, index: number) => (
							<LeaderboardRow
								key={leaderboardUser.id}
								user={leaderboardUser}
								rank={index + 1}
								isCurrentUser={leaderboardUser.id === currentUser?.id}
							/>
						))
					)}
				</div>
			</Card>

			{/* Stats Section */}
			{leaderboard.length >= 3 && (
				<div className="grid md:grid-cols-3 gap-6">
					<Card>
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 rounded-xl bg-[#c22f99]/10 flex items-center justify-center">
								<Star className="w-5 h-5 text-[#c22f99]" />
							</div>
							<CardTitle>Top Performer</CardTitle>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-[#482977]/10 flex items-center justify-center text-2xl">
								{leaderboard[0]?.avatar || "👤"}
							</div>
							<div>
								<p className="font-semibold text-[#1a1a2e]">
									{leaderboard[0]?.name}
								</p>
								<p className="text-[#16a34a] text-sm">
									{formatCurrency(leaderboard[0]?.balance || 0)}
								</p>
							</div>
						</div>
					</Card>

					<Card>
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 rounded-xl bg-[#16a34a]/10 flex items-center justify-center">
								<TrendingUp className="w-5 h-5 text-[#16a34a]" />
							</div>
							<CardTitle>Runner Up</CardTitle>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-[#482977]/10 flex items-center justify-center text-2xl">
								{leaderboard[1]?.avatar || "👤"}
							</div>
							<div>
								<p className="font-semibold text-[#1a1a2e]">
									{leaderboard[1]?.name}
								</p>
								<p className="text-[#16a34a] text-sm">
									{formatCurrency(leaderboard[1]?.balance || 0)}
								</p>
							</div>
						</div>
					</Card>

					<Card>
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 rounded-xl bg-[#482977]/10 flex items-center justify-center">
								<Trophy className="w-5 h-5 text-[#482977]" />
							</div>
							<CardTitle>Third Place</CardTitle>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-[#482977]/10 flex items-center justify-center text-2xl">
								{leaderboard[2]?.avatar || "👤"}
							</div>
							<div>
								<p className="font-semibold text-[#1a1a2e]">
									{leaderboard[2]?.name}
								</p>
								<p className="text-[#482977] text-sm">
									{formatCurrency(leaderboard[2]?.balance || 0)}
								</p>
							</div>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}
