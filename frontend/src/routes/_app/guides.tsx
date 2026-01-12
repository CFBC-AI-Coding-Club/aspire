import { createFileRoute, Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { BookOpen, CheckCircle, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { SearchInput } from "../../components/ui/Input";
import {
	categoryIcons,
	categoryLabels,
	type Guide,
	type GuideCategory,
	getCategories,
	guides,
} from "../../data/guides";

export const Route = createFileRoute("/_app/guides")({
	component: GuidesPage,
});

// Progress mock - in real app, track user progress
const userProgress: Record<string, { completed: boolean; progress: number }> = {
	"what-is-investing": { completed: true, progress: 100 },
	"understanding-stocks": { completed: true, progress: 100 },
	"reading-stock-charts": { completed: false, progress: 60 },
	diversification: { completed: false, progress: 30 },
	"understanding-risk": { completed: false, progress: 0 },
	"buy-and-hold": { completed: false, progress: 0 },
	"market-cycles": { completed: false, progress: 0 },
	"compound-interest": { completed: false, progress: 0 },
};

// Difficulty Badge
function DifficultyBadge({ difficulty }: { difficulty: Guide["difficulty"] }) {
	const config = {
		beginner: { label: "Beginner", color: "bg-[#22C55E]/10 text-[#22C55E]" },
		intermediate: {
			label: "Intermediate",
			color: "bg-[#FBBF24]/10 text-[#FBBF24]",
		},
		advanced: { label: "Advanced", color: "bg-[#EF4444]/10 text-[#EF4444]" },
	}[difficulty];

	return (
		<span
			className={clsx("px-2 py-1 rounded-lg text-xs font-medium", config.color)}
		>
			{config.label}
		</span>
	);
}

// Guide Card Component
function GuideCard({ guide }: { guide: Guide }) {
	const progress = userProgress[guide.id] || { completed: false, progress: 0 };

	return (
		<Link to={`/guides/${guide.id}`}>
			<Card hover className="h-full group">
				<div className="flex items-start justify-between mb-4">
					<div className="w-14 h-14 rounded-2xl bg-[#2a2a2a] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
						{guide.icon}
					</div>
					<DifficultyBadge difficulty={guide.difficulty} />
				</div>

				<h3 className="font-semibold text-white text-lg mb-2 group-hover:text-[#60A5FA] transition-colors">
					{guide.title}
				</h3>
				<p className="text-[#6a6a6a] text-sm mb-4 line-clamp-2">
					{guide.description}
				</p>

				{/* Progress */}
				{progress.progress > 0 && !progress.completed && (
					<div className="mb-4">
						<div className="flex items-center justify-between text-sm mb-1">
							<span className="text-[#6a6a6a]">Progress</span>
							<span className="text-[#60A5FA]">{progress.progress}%</span>
						</div>
						<div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full transition-all"
								style={{ width: `${progress.progress}%` }}
							/>
						</div>
					</div>
				)}

				<div className="flex items-center justify-between mt-auto">
					<div className="flex items-center gap-2 text-[#6a6a6a]">
						<Clock className="w-4 h-4" />
						<span className="text-sm">{guide.duration}</span>
					</div>

					{progress.completed ? (
						<div className="flex items-center gap-1 text-[#22C55E]">
							<CheckCircle className="w-4 h-4" />
							<span className="text-sm font-medium">Completed</span>
						</div>
					) : (
						<div className="flex items-center gap-1 text-[#60A5FA] group-hover:gap-2 transition-all">
							<span className="text-sm font-medium">
								{progress.progress > 0 ? "Continue" : "Start"}
							</span>
							<ChevronRight className="w-4 h-4" />
						</div>
					)}
				</div>
			</Card>
		</Link>
	);
}

// Category Section
function CategorySection({
	category,
	guides,
}: {
	category: GuideCategory;
	guides: Guide[];
}) {
	return (
		<section>
			<div className="flex items-center gap-3 mb-6">
				<div className="w-10 h-10 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-xl">
					{categoryIcons[category]}
				</div>
				<h2 className="text-xl font-bold text-white">
					{categoryLabels[category]}
				</h2>
				<span className="px-2 py-1 rounded-lg bg-[#2a2a2a] text-[#6a6a6a] text-sm">
					{guides.length} guides
				</span>
			</div>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{guides.map((guide) => (
					<GuideCard key={guide.id} guide={guide} />
				))}
			</div>
		</section>
	);
}

function GuidesPage() {
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<
		GuideCategory | "all"
	>("all");

	const categories = getCategories();

	// Filter guides
	const filteredGuides = guides.filter((guide) => {
		const matchesSearch =
			search === "" ||
			guide.title.toLowerCase().includes(search.toLowerCase()) ||
			guide.description.toLowerCase().includes(search.toLowerCase());

		const matchesCategory =
			selectedCategory === "all" || guide.category === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	// Group by category
	const groupedGuides = categories.reduce(
		(acc, category) => {
			const categoryGuides = filteredGuides.filter(
				(g) => g.category === category,
			);
			if (categoryGuides.length > 0) {
				acc[category] = categoryGuides;
			}
			return acc;
		},
		{} as Record<GuideCategory, Guide[]>,
	);

	// Calculate overall progress
	const completedCount = Object.values(userProgress).filter(
		(p) => p.completed,
	).length;
	const totalGuides = guides.length;
	const overallProgress = Math.round((completedCount / totalGuides) * 100);

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-white mb-1">
						Learning Guides
					</h1>
					<p className="text-[#6a6a6a]">
						Master investing with our comprehensive guides
					</p>
				</div>
			</div>

			{/* Progress Card */}
			<Card className="bg-gradient-to-r from-[#3B82F6]/10 to-[#2563EB]/5 border-[#3B82F6]/30">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-6">
						<div className="w-20 h-20 rounded-2xl bg-[#3B82F6]/20 flex items-center justify-center">
							<BookOpen className="w-10 h-10 text-[#60A5FA]" />
						</div>
						<div>
							<p className="text-[#6a6a6a] mb-1">Your Learning Progress</p>
							<p className="text-3xl font-bold text-white">
								{completedCount} / {totalGuides} Guides
							</p>
						</div>
					</div>
					<div className="hidden md:block w-48">
						<div className="flex items-center justify-between text-sm mb-2">
							<span className="text-[#6a6a6a]">Overall</span>
							<span className="text-[#60A5FA] font-medium">
								{overallProgress}%
							</span>
						</div>
						<div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full transition-all duration-500"
								style={{ width: `${overallProgress}%` }}
							/>
						</div>
					</div>
				</div>
			</Card>

			{/* Filters */}
			<Card padding="sm">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="flex-1">
						<SearchInput
							placeholder="Search guides..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => setSelectedCategory("all")}
							className={clsx(
								"px-4 py-2 rounded-xl text-sm font-medium transition-colors",
								selectedCategory === "all"
									? "bg-[#3B82F6] text-white"
									: "bg-[#1a1a1a] text-[#6a6a6a] hover:text-white",
							)}
						>
							All
						</button>
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setSelectedCategory(category)}
								className={clsx(
									"px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2",
									selectedCategory === category
										? "bg-[#3B82F6] text-white"
										: "bg-[#1a1a1a] text-[#6a6a6a] hover:text-white",
								)}
							>
								<span>{categoryIcons[category]}</span>
								<span>{categoryLabels[category]}</span>
							</button>
						))}
					</div>
				</div>
			</Card>

			{/* Results Count */}
			<p className="text-sm text-[#6a6a6a]">
				Showing {filteredGuides.length} of {totalGuides} guides
			</p>

			{/* Guides by Category */}
			{selectedCategory === "all" ? (
				<div className="space-y-12">
					{Object.entries(groupedGuides).map(([category, categoryGuides]) => (
						<CategorySection
							key={category}
							category={category as GuideCategory}
							guides={categoryGuides}
						/>
					))}
				</div>
			) : (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredGuides.map((guide) => (
						<GuideCard key={guide.id} guide={guide} />
					))}
				</div>
			)}

			{/* Empty State */}
			{filteredGuides.length === 0 && (
				<Card className="py-12 text-center">
					<div className="text-4xl mb-4">📚</div>
					<h3 className="text-xl font-semibold text-white mb-2">
						No guides found
					</h3>
					<p className="text-[#6a6a6a]">Try adjusting your search or filters</p>
				</Card>
			)}
		</div>
	);
}
