import { createFileRoute } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
	Clock,
	Gamepad2,
	Play,
	Star,
	Target,
	TrendingDown,
	TrendingUp,
	Trophy,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";

export const Route = createFileRoute("/_app/games")({
	component: GamesPage,
});

// Game data
const games = [
	{
		id: "stock-prediction",
		title: "Stock Predictor",
		description:
			"Guess if the stock price will go up or down in the next round. Test your market intuition!",
		icon: "📈",
		difficulty: "Easy",
		playTime: "5 min",
		xpReward: 50,
		color: "from-[#22C55E] to-[#16A34A]",
		available: true,
		highScore: 850,
	},
	{
		id: "portfolio-challenge",
		title: "Portfolio Challenge",
		description:
			"Build the best performing portfolio with $10,000 virtual dollars. Compete against others!",
		icon: "💼",
		difficulty: "Medium",
		playTime: "15 min",
		xpReward: 150,
		color: "from-[#3B82F6] to-[#2563EB]",
		available: true,
		highScore: 1200,
	},
	{
		id: "market-mayhem",
		title: "Market Mayhem",
		description:
			"Navigate through a volatile market event. Make quick decisions to protect your portfolio!",
		icon: "🌪️",
		difficulty: "Hard",
		playTime: "10 min",
		xpReward: 200,
		color: "from-[#EF4444] to-[#DC2626]",
		available: false,
		highScore: null,
	},
	{
		id: "trader-tycoon",
		title: "Trader Tycoon",
		description:
			"Start from $1,000 and become a millionaire through smart trades. How fast can you do it?",
		icon: "💎",
		difficulty: "Expert",
		playTime: "30 min",
		xpReward: 500,
		color: "from-[#8B5CF6] to-[#7C3AED]",
		available: false,
		highScore: null,
	},
];

// Stock Prediction Mini Game Component
function StockPredictionGame({ onClose }: { onClose: () => void }) {
	const [score, setScore] = useState(0);
	const [round, setRound] = useState(1);
	const [currentPrice, setCurrentPrice] = useState(150.0);
	const [prediction, setPrediction] = useState<"up" | "down" | null>(null);
	const [result, setResult] = useState<"correct" | "wrong" | null>(null);
	const [streak, setStreak] = useState(0);
	const [gameOver, setGameOver] = useState(false);

	const stockSymbol = "DEMO";
	const maxRounds = 10;

	const handlePrediction = (direction: "up" | "down") => {
		setPrediction(direction);

		// Simulate price change
		const change = (Math.random() - 0.5) * 10;
		const newPrice = currentPrice + change;
		const actualDirection = change > 0 ? "up" : "down";

		setTimeout(() => {
			setCurrentPrice(Number(newPrice.toFixed(2)));

			if (direction === actualDirection) {
				const points = 100 + streak * 25;
				setScore(score + points);
				setStreak(streak + 1);
				setResult("correct");
			} else {
				setStreak(0);
				setResult("wrong");
			}

			setTimeout(() => {
				if (round >= maxRounds) {
					setGameOver(true);
				} else {
					setRound(round + 1);
					setPrediction(null);
					setResult(null);
				}
			}, 1500);
		}, 1000);
	};

	if (gameOver) {
		return (
			<div className="text-center py-8">
				<div className="text-6xl mb-4">🎉</div>
				<h3 className="text-2xl font-bold text-white mb-2">Game Over!</h3>
				<p className="text-4xl font-bold text-[#FBBF24] mb-4">{score} pts</p>
				<p className="text-[#6a6a6a] mb-6">You completed {maxRounds} rounds</p>
				<div className="flex justify-center gap-4">
					<Button variant="secondary" onClick={onClose}>
						Exit
					</Button>
					<Button
						onClick={() => {
							setScore(0);
							setRound(1);
							setCurrentPrice(150.0);
							setPrediction(null);
							setResult(null);
							setStreak(0);
							setGameOver(false);
						}}
					>
						Play Again
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Game Header */}
			<div className="flex items-center justify-between">
				<div>
					<p className="text-[#6a6a6a] text-sm">
						Round {round} of {maxRounds}
					</p>
					<div className="flex items-center gap-4">
						<p className="text-2xl font-bold text-white">{score} pts</p>
						{streak > 1 && (
							<span className="px-2 py-1 rounded-lg bg-[#FBBF24]/20 text-[#FBBF24] text-sm font-medium">
								🔥 {streak}x streak
							</span>
						)}
					</div>
				</div>
				<Button variant="ghost" size="sm" onClick={onClose}>
					Exit
				</Button>
			</div>

			{/* Stock Display */}
			<div className="bg-[#121212] rounded-2xl p-8 text-center">
				<p className="text-[#6a6a6a] mb-2">{stockSymbol}</p>
				<p
					className={clsx(
						"text-5xl font-bold font-mono mb-4 transition-colors duration-500",
						result === "correct"
							? "text-[#22C55E]"
							: result === "wrong"
								? "text-[#EF4444]"
								: "text-white",
					)}
				>
					${currentPrice.toFixed(2)}
				</p>

				{prediction && (
					<div
						className={clsx(
							"text-lg font-medium",
							result === "correct"
								? "text-[#22C55E]"
								: result === "wrong"
									? "text-[#EF4444]"
									: "text-[#6a6a6a]",
						)}
					>
						{result === "correct"
							? "✓ Correct!"
							: result === "wrong"
								? "✗ Wrong!"
								: `Predicting ${prediction}...`}
					</div>
				)}
			</div>

			{/* Prediction Buttons */}
			{!prediction && (
				<div className="grid grid-cols-2 gap-4">
					<button
						onClick={() => handlePrediction("up")}
						className="p-8 rounded-2xl bg-[#22C55E]/20 border-2 border-[#22C55E]/30 hover:border-[#22C55E] hover:bg-[#22C55E]/30 transition-all group"
					>
						<TrendingUp className="w-12 h-12 mx-auto text-[#22C55E] group-hover:scale-110 transition-transform" />
						<p className="text-[#22C55E] font-semibold mt-2">Goes Up</p>
					</button>
					<button
						onClick={() => handlePrediction("down")}
						className="p-8 rounded-2xl bg-[#EF4444]/20 border-2 border-[#EF4444]/30 hover:border-[#EF4444] hover:bg-[#EF4444]/30 transition-all group"
					>
						<TrendingDown className="w-12 h-12 mx-auto text-[#EF4444] group-hover:scale-110 transition-transform" />
						<p className="text-[#EF4444] font-semibold mt-2">Goes Down</p>
					</button>
				</div>
			)}

			{/* Instructions */}
			<p className="text-center text-[#6a6a6a] text-sm">
				Predict if the stock price will go up or down. Correct guesses earn
				points!
			</p>
		</div>
	);
}

// Game Card Component
function GameCard({
	game,
	onPlay,
}: {
	game: (typeof games)[0];
	onPlay: () => void;
}) {
	return (
		<Card
			hover={game.available}
			className={clsx(!game.available && "opacity-60")}
		>
			<div className="flex items-start justify-between mb-4">
				<div
					className={clsx(
						"w-14 h-14 rounded-2xl flex items-center justify-center text-3xl",
						"bg-gradient-to-br",
						game.color,
					)}
				>
					{game.icon}
				</div>
				<div className="flex items-center gap-2">
					<span
						className={clsx(
							"px-2 py-1 rounded-lg text-xs font-medium",
							game.difficulty === "Easy" && "bg-[#22C55E]/10 text-[#22C55E]",
							game.difficulty === "Medium" && "bg-[#FBBF24]/10 text-[#FBBF24]",
							game.difficulty === "Hard" && "bg-[#EF4444]/10 text-[#EF4444]",
							game.difficulty === "Expert" && "bg-[#8B5CF6]/10 text-[#8B5CF6]",
						)}
					>
						{game.difficulty}
					</span>
				</div>
			</div>

			<h3 className="font-semibold text-white text-lg mb-2">{game.title}</h3>
			<p className="text-[#6a6a6a] text-sm mb-4">{game.description}</p>

			<div className="flex items-center gap-4 text-sm text-[#6a6a6a] mb-4">
				<div className="flex items-center gap-1">
					<Clock className="w-4 h-4" />
					<span>{game.playTime}</span>
				</div>
				<div className="flex items-center gap-1">
					<Star className="w-4 h-4" />
					<span>{game.xpReward} XP</span>
				</div>
			</div>

			{game.highScore && (
				<div className="flex items-center gap-2 mb-4 px-3 py-2 bg-[#FBBF24]/10 rounded-lg">
					<Trophy className="w-4 h-4 text-[#FBBF24]" />
					<span className="text-[#FBBF24] text-sm font-medium">
						High Score: {game.highScore}
					</span>
				</div>
			)}

			<Button
				fullWidth
				disabled={!game.available}
				onClick={onPlay}
				leftIcon={game.available ? <Play className="w-4 h-4" /> : undefined}
			>
				{game.available ? "Play Now" : "Coming Soon"}
			</Button>
		</Card>
	);
}

function GamesPage() {
	const { user } = useAuth();
	const [activeGame, setActiveGame] = useState<string | null>(null);

	// Calculate total XP from games
	const totalGamesXP = 450; // Mock value

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-white mb-1">Games</h1>
					<p className="text-[#6a6a6a]">
						Learn investing through fun, interactive games
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid md:grid-cols-3 gap-4">
				<Card className="bg-gradient-to-br from-[#FBBF24]/10 to-[#F59E0B]/5 border-[#FBBF24]/30">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-xl bg-[#FBBF24]/20 flex items-center justify-center">
							<Trophy className="w-6 h-6 text-[#FBBF24]" />
						</div>
						<div>
							<p className="text-[#6a6a6a] text-sm">Total XP Earned</p>
							<p className="text-2xl font-bold text-white">{totalGamesXP}</p>
						</div>
					</div>
				</Card>

				<Card>
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center">
							<Gamepad2 className="w-6 h-6 text-[#60A5FA]" />
						</div>
						<div>
							<p className="text-[#6a6a6a] text-sm">Games Played</p>
							<p className="text-2xl font-bold text-white">12</p>
						</div>
					</div>
				</Card>

				<Card>
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-xl bg-[#22C55E]/20 flex items-center justify-center">
							<Target className="w-6 h-6 text-[#22C55E]" />
						</div>
						<div>
							<p className="text-[#6a6a6a] text-sm">Win Rate</p>
							<p className="text-2xl font-bold text-white">72%</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Active Game Modal */}
			{activeGame && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/70 backdrop-blur-sm"
						onClick={() => setActiveGame(null)}
					/>
					<div className="relative bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a] w-full max-w-lg p-6 animate-scale-in">
						{activeGame === "stock-prediction" && (
							<StockPredictionGame onClose={() => setActiveGame(null)} />
						)}
						{activeGame === "portfolio-challenge" && (
							<div className="text-center py-12">
								<div className="text-5xl mb-4">🚧</div>
								<h3 className="text-xl font-bold text-white mb-2">
									Coming Soon!
								</h3>
								<p className="text-[#6a6a6a] mb-6">
									This game is under development.
								</p>
								<Button onClick={() => setActiveGame(null)}>Close</Button>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Games Grid */}
			<div>
				<h2 className="text-xl font-bold text-white mb-6">Available Games</h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
					{games.map((game) => (
						<GameCard
							key={game.id}
							game={game}
							onPlay={() => setActiveGame(game.id)}
						/>
					))}
				</div>
			</div>

			{/* Tips Section */}
			<Card className="bg-gradient-to-r from-[#3B82F6]/10 to-transparent border-[#3B82F6]/30">
				<div className="flex items-start gap-4">
					<div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
						<Zap className="w-5 h-5 text-[#60A5FA]" />
					</div>
					<div>
						<h3 className="font-semibold text-white mb-2">Pro Tip</h3>
						<p className="text-[#9a9a9a] text-sm leading-relaxed">
							Playing games regularly helps reinforce your investing knowledge!
							Each game teaches different skills - Stock Predictor helps with
							market intuition, while Portfolio Challenge teaches
							diversification.
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
