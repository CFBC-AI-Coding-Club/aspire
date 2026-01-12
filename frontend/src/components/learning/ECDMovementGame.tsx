import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

interface ECDMovementGameProps {
	onBack: () => void;
}

export function ECDMovementGame({ onBack }: ECDMovementGameProps) {
	const [score, setScore] = useState(0);
	const [streak, setStreak] = useState(0);
	const [currentPrice] = useState(125.5);
	const [showFeedback, setShowFeedback] = useState<
		"correct" | "incorrect" | null
	>(null);

	// Mock data for simple line chart
	const dataPoints = [120, 122, 118, 125, 123, 128, 125];
	const maxPrice = Math.max(...dataPoints);
	const minPrice = Math.min(...dataPoints);
	const range = maxPrice - minPrice;

	const handlePrediction = (prediction: "rise" | "fall") => {
		// Simplified game logic - 50% chance
		const actualMovement = Math.random() > 0.5 ? "rise" : "fall";
		const isCorrect = prediction === actualMovement;

		if (isCorrect) {
			setScore(score + 10);
			setStreak(streak + 1);
			setShowFeedback("correct");
		} else {
			setStreak(0);
			setShowFeedback("incorrect");
		}

		setTimeout(() => {
			setShowFeedback(null);
		}, 1500);
	};

	return (
		<div className="w-full min-h-screen bg-[#F5F7FA] flex flex-col">
			{/* App Bar */}
			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							onClick={onBack}
							className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#E8EFF2] transition-colors"
						>
							<ArrowLeft className="w-6 h-6 text-[#1B262C]" />
						</button>
						<h2 className="text-[#1B262C]">Stock Market Game</h2>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto">
				<div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
					{/* Score Card */}
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-gradient-to-br from-[#E3F5FF] to-[#B8E6FF] rounded-[20px] p-6">
							<p className="text-[#1B262C] mb-1">Score</p>
							<p className="text-[#2E8BC0]">{score} points</p>
						</div>
						<div className="bg-gradient-to-br from-[#FFE8E6] to-[#FFD4D0] rounded-[20px] p-6">
							<p className="text-[#1B262C] mb-1">Streak</p>
							<p className="text-[#FF6F61]">{streak} correct</p>
						</div>
					</div>

					{/* Current Price */}
					<div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
						<p className="text-[#7D8B91] mb-2">Current Price</p>
						<p className="text-[#1B262C]" style={{ fontSize: "32px" }}>
							${currentPrice.toFixed(2)}
						</p>
					</div>

					{/* Mock Chart */}
					<div className="bg-white rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
						<h3 className="text-[#1B262C] mb-6">Price Movement</h3>
						<div className="relative h-64 border-b-2 border-l-2 border-[#E8EFF2] rounded-bl-xl">
							{/* Simple line chart using SVG */}
							<svg
								className="w-full h-full"
								viewBox="0 0 600 240"
								preserveAspectRatio="none"
							>
								<polyline
									fill="none"
									stroke="#2E8BC0"
									strokeWidth="3"
									points={dataPoints
										.map((price, index) => {
											const x = (index / (dataPoints.length - 1)) * 600;
											const y = 240 - ((price - minPrice) / range) * 200 - 20;
											return `${x},${y}`;
										})
										.join(" ")}
								/>
								{/* Data points */}
								{dataPoints.map((price, index) => {
									const x = (index / (dataPoints.length - 1)) * 600;
									const y = 240 - ((price - minPrice) / range) * 200 - 20;
									return (
										<circle key={index} cx={x} cy={y} r="4" fill="#2E8BC0" />
									);
								})}
							</svg>
						</div>
					</div>

					{/* Instructions */}
					<div className="bg-gradient-to-r from-[#FFF4D6] to-[#FFE4A3] rounded-[20px] p-6">
						<h3 className="text-[#1B262C] mb-2">How to Play</h3>
						<p className="text-[#1B262C]">
							Will the price go up or down? Make your prediction and earn points
							for correct answers!
						</p>
					</div>

					{/* Action Buttons */}
					<div className="grid grid-cols-2 gap-4">
						<button
							onClick={() => handlePrediction("rise")}
							disabled={showFeedback !== null}
							className="h-20 bg-gradient-to-br from-[#2EC4B6] to-[#2E8BC0] text-white rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 flex flex-col items-center justify-center gap-2"
						>
							<TrendingUp className="w-8 h-8" />
							<span>Rise</span>
						</button>
						<button
							onClick={() => handlePrediction("fall")}
							disabled={showFeedback !== null}
							className="h-20 bg-gradient-to-br from-[#FF6F61] to-[#FF8A80] text-white rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 flex flex-col items-center justify-center gap-2"
						>
							<TrendingDown className="w-8 h-8" />
							<span>Fall</span>
						</button>
					</div>

					{/* Feedback */}
					{showFeedback && (
						<div
							className={`p-6 rounded-[20px] text-center ${
								showFeedback === "correct"
									? "bg-gradient-to-r from-[#2EC4B6] to-[#2E8BC0]"
									: "bg-gradient-to-r from-[#FF6F61] to-[#FF8A80]"
							}`}
						>
							<p className="text-white">
								{showFeedback === "correct"
									? "✓ Correct! +10 points"
									: "✗ Incorrect. Try again!"}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
