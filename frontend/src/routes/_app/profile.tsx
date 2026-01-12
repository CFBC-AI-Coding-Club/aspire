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
import { useUserProfileQuery } from "../../hooks/queries/useUsersQuery";
import { formatCurrency } from "../../data/mockStocks";

export const Route = createFileRoute("/_app/profile")({
	component: ProfilePage,
});

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
	const { data: userProfile } = useUserProfileQuery();
	const [isEditing, setIsEditing] = useState(false);
	const [editedName, setEditedName] = useState(user?.name || "");
	const [showAvatarPicker, setShowAvatarPicker] = useState(false);
	const [activeTab, setActiveTab] = useState<
		"overview" | "achievements" | "settings"
	>("overview");

	const isParent = user?.accountType === "parent";

	const handleSave = () => {
		updateUser({ name: editedName });
		setIsEditing(false);
	};

	const handleAvatarChange = (avatar: string) => {
		updateUser({ avatar });
		setShowAvatarPicker(false);
	};

	// Stats from user profile
	const stats = {
		totalTrades: userProfile?.transactions?.length || 0,
		holdings: userProfile?.portfolio?.length || 0,
		balance: userProfile?.balance || 0,
	};

	return (
		<div className="space-y-6 animate-fade-in">
			{/* Header Card */}
			<Card
				className={clsx(
					"relative overflow-hidden",
					"bg-gradient-to-br from-[#482977]/5 to-[#6b42a1]/5",
				)}
			>
				{/* Background Pattern */}
				<div className="absolute top-0 right-0 w-64 h-64 opacity-10">
					<div
						className="absolute inset-0 rounded-full blur-3xl bg-[#482977]"
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
								"from-[#482977]/10 to-[#6b42a1]/10 border-[#482977]/20",
							)}
						>
							{user?.avatar || "👤"}
						</button>
						<button
							onClick={() => setShowAvatarPicker(!showAvatarPicker)}
							className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center bg-[#482977] text-white"
						>
							<Camera className="w-4 h-4" />
						</button>

						{/* Avatar Picker */}
						{showAvatarPicker && (
							<div className="absolute top-full mt-2 left-0 z-20 bg-white border border-[#482977]/10 rounded-xl p-3 shadow-xl">
								<div className="grid grid-cols-4 gap-2">
									{avatarOptions.map((avatar) => (
										<button
											key={avatar}
											onClick={() => handleAvatarChange(avatar)}
											className={clsx(
												"w-10 h-10 rounded-lg flex items-center justify-center text-xl",
												"hover:bg-[#f1f3f9] transition-colors",
												user?.avatar === avatar &&
													"bg-[#482977]/10 ring-2 ring-[#482977]",
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
								<h1 className="text-2xl font-bold text-[#1a1a2e]">{user?.name}</h1>
								<button
									onClick={() => setIsEditing(true)}
									className="text-[#7a8aa3] hover:text-[#482977] transition-colors"
								>
									<Edit2 className="w-4 h-4" />
								</button>
							</div>
						)}
						<p
							className={clsx(
								"text-sm font-medium mb-2",
								isParent ? "text-[#c22f99]" : "text-[#482977]",
							)}
						>
							{isParent
								? "Parent Account"
								: `Level ${user?.level || 1} Investor`}
						</p>
						<p className="text-[#7a8aa3] text-sm">
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
								<p className="text-2xl font-bold text-[#1a1a2e]">
									{userProfile?.xp || 0}
								</p>
								<p className="text-xs text-[#7a8aa3]">XP Points</p>
							</div>
							<div className="text-center">
								<p className="text-2xl font-bold text-[#1a1a2e]">
									{stats.holdings}
								</p>
								<p className="text-xs text-[#7a8aa3]">Holdings</p>
							</div>
						</div>
					)}
				</div>
			</Card>

			{/* Tabs */}
			<div className="flex gap-1 bg-[#f1f3f9] p-1 rounded-xl w-fit border border-[#482977]/10">
				{(["overview", "achievements", "settings"] as const).map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={clsx(
							"px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
							activeTab === tab
								? "bg-[#482977] text-white"
								: "text-[#7a8aa3] hover:text-[#1a1a2e]",
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
							icon={<TrendingUp className="w-6 h-6 text-[#482977]" />}
						/>
						<StatCard
							label="Holdings"
							value={stats.holdings}
							icon={<Target className="w-6 h-6 text-[#16a34a]" />}
							accent="success"
						/>
						<StatCard
							label="Balance"
							value={formatCurrency(stats.balance)}
							icon="💰"
						/>
					</div>

					{/* Account Info */}
					<Card>
						<CardTitle className="mb-4">Account Information</CardTitle>
						<div className="space-y-4">
							<div className="flex justify-between items-center p-3 bg-[#f8f9fc] rounded-xl">
								<span className="text-[#7a8aa3]">Account Type</span>
								<span className="font-semibold text-[#1a1a2e]">
									{isParent ? "Parent" : "Child"}
								</span>
							</div>
							<div className="flex justify-between items-center p-3 bg-[#f8f9fc] rounded-xl">
								<span className="text-[#7a8aa3]">Level</span>
								<span className="font-semibold text-[#1a1a2e]">
									{user?.level || 1}
								</span>
							</div>
							<div className="flex justify-between items-center p-3 bg-[#f8f9fc] rounded-xl">
								<span className="text-[#7a8aa3]">XP</span>
								<span className="font-semibold text-[#1a1a2e]">
									{userProfile?.xp || 0}
								</span>
							</div>
						</div>
					</Card>
				</div>
			)}

			{activeTab === "achievements" && (
				<div className="animate-fade-in">
					<Card>
						<div className="flex items-center justify-between mb-6">
							<CardTitle>Achievements</CardTitle>
						</div>
						<div className="text-center py-12 text-[#7a8aa3]">
							<div className="text-4xl mb-4">🏆</div>
							<p>Achievements coming soon!</p>
							<p className="text-sm mt-1">Keep trading to unlock achievements.</p>
						</div>
					</Card>
				</div>
			)}

			{activeTab === "settings" && (
				<div className="space-y-4 animate-fade-in max-w-2xl">
					<Card>
						<CardTitle className="mb-6">Preferences</CardTitle>
						<div className="space-y-4">
							<div className="flex items-center justify-between p-4 bg-[#f8f9fc] rounded-xl">
								<div className="flex items-center gap-3">
									<Bell className="w-5 h-5 text-[#7a8aa3]" />
									<div>
										<p className="font-medium text-[#1a1a2e]">Notifications</p>
										<p className="text-sm text-[#7a8aa3]">
											Get alerts about your portfolio
										</p>
									</div>
								</div>
								<button className="w-12 h-6 bg-[#482977] rounded-full relative">
									<div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
								</button>
							</div>

							<div className="flex items-center justify-between p-4 bg-[#f8f9fc] rounded-xl">
								<div className="flex items-center gap-3">
									<Moon className="w-5 h-5 text-[#7a8aa3]" />
									<div>
										<p className="font-medium text-[#1a1a2e]">Theme</p>
										<p className="text-sm text-[#7a8aa3]">Light mode</p>
									</div>
								</div>
								<button className="w-12 h-6 bg-[#dde3ef] rounded-full relative cursor-not-allowed opacity-50">
									<div className="absolute left-1 top-1 w-4 h-4 bg-[#7a8aa3] rounded-full" />
								</button>
							</div>

							<div className="flex items-center justify-between p-4 bg-[#f8f9fc] rounded-xl">
								<div className="flex items-center gap-3">
									<Shield className="w-5 h-5 text-[#7a8aa3]" />
									<div>
										<p className="font-medium text-[#1a1a2e]">Privacy</p>
										<p className="text-sm text-[#7a8aa3]">
											Hide profile from leaderboard
										</p>
									</div>
								</div>
								<button className="w-12 h-6 bg-[#dde3ef] rounded-full relative">
									<div className="absolute left-1 top-1 w-4 h-4 bg-[#7a8aa3] rounded-full" />
								</button>
							</div>
						</div>
					</Card>

					<Card className="border-[#dc2626]/20">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<LogOut className="w-5 h-5 text-[#dc2626]" />
								<div>
									<p className="font-medium text-[#1a1a2e]">Log Out</p>
									<p className="text-sm text-[#7a8aa3]">
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
