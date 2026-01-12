import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
	ArrowLeft,
	BookOpen,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Circle,
	Clock,
	HelpCircle,
	Lightbulb,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card, CardTitle } from "../../../components/ui/Card";
import {
	type Guide,
	type GuideSection,
	getGuideById,
} from "../../../data/guides";

export const Route = createFileRoute("/_app/guides/$guideId")({
	component: GuideDetailPage,
});

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
			className={clsx("px-3 py-1 rounded-lg text-sm font-medium", config.color)}
		>
			{config.label}
		</span>
	);
}

// Section Content Component
function SectionContent({
	section,
	isActive,
}: {
	section: GuideSection;
	isActive: boolean;
}) {
	if (!isActive) return null;

	return (
		<div className="animate-fade-in space-y-6">
			<h2 className="text-2xl font-bold text-white">{section.title}</h2>

			{/* Main Content */}
			<div className="prose prose-invert max-w-none">
				{section.content.split("\n\n").map((paragraph, i) => (
					<p key={i} className="text-[#e0e0e0] leading-relaxed mb-4">
						{paragraph.split("\n").map((line, j) => (
							<span key={j}>
								{line.startsWith("**") && line.endsWith("**") ? (
									<strong className="text-white font-semibold">
										{line.slice(2, -2)}
									</strong>
								) : line.startsWith("**") ? (
									<strong className="text-white font-semibold">
										{line.slice(2)}
									</strong>
								) : (
									line
								)}
								{j < paragraph.split("\n").length - 1 && <br />}
							</span>
						))}
					</p>
				))}
			</div>

			{/* Tips */}
			{section.tips && section.tips.length > 0 && (
				<div className="bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-xl p-5">
					<div className="flex items-center gap-2 mb-3">
						<Lightbulb className="w-5 h-5 text-[#60A5FA]" />
						<h4 className="font-semibold text-[#60A5FA]">Pro Tips</h4>
					</div>
					<ul className="space-y-2">
						{section.tips.map((tip, i) => (
							<li key={i} className="flex items-start gap-2 text-[#e0e0e0]">
								<span className="text-[#60A5FA] mt-1">•</span>
								<span>{tip}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Example */}
			{section.example && (
				<div className="bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-xl p-5">
					<h4 className="font-semibold text-[#FBBF24] mb-2">
						{section.example.title}
					</h4>
					<p className="text-[#e0e0e0]">{section.example.description}</p>
				</div>
			)}
		</div>
	);
}

// Quiz Component
function QuizSection({
	guide,
	onComplete,
}: {
	guide: Guide;
	onComplete: () => void;
}) {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [showResult, setShowResult] = useState(false);
	const [score, setScore] = useState(0);
	const [answers, setAnswers] = useState<(number | null)[]>([]);

	if (!guide.quiz) return null;

	const question = guide.quiz.questions[currentQuestion];
	const isLastQuestion = currentQuestion === guide.quiz.questions.length - 1;
	const isPassing =
		(score / guide.quiz.questions.length) * 100 >= guide.quiz.passingScore;

	const handleAnswer = (answerIndex: number) => {
		if (showResult) return;
		setSelectedAnswer(answerIndex);
	};

	const handleNext = () => {
		if (selectedAnswer === null) return;

		const isCorrect = selectedAnswer === question.correctAnswer;
		if (isCorrect) {
			setScore(score + 1);
		}

		setAnswers([...answers, selectedAnswer]);
		setShowResult(true);

		setTimeout(() => {
			if (isLastQuestion) {
				// Show final results
			} else {
				setCurrentQuestion(currentQuestion + 1);
				setSelectedAnswer(null);
				setShowResult(false);
			}
		}, 2000);
	};

	// Final Results
	if (answers.length === guide.quiz.questions.length) {
		return (
			<div className="text-center py-8">
				<div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/20">
					<span className="text-5xl">{isPassing ? "🎉" : "📚"}</span>
				</div>
				<h3 className="text-2xl font-bold text-white mb-2">
					{isPassing ? "Congratulations!" : "Keep Learning!"}
				</h3>
				<p className="text-[#6a6a6a] mb-4">
					You scored {score} out of {guide.quiz.questions.length}
				</p>
				<div className="flex justify-center gap-4">
					{isPassing ? (
						<Button onClick={onComplete}>Complete Guide</Button>
					) : (
						<Button
							onClick={() => {
								setCurrentQuestion(0);
								setSelectedAnswer(null);
								setShowResult(false);
								setScore(0);
								setAnswers([]);
							}}
						>
							Try Again
						</Button>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between mb-4">
				<span className="text-[#6a6a6a]">
					Question {currentQuestion + 1} of {guide.quiz.questions.length}
				</span>
				<div className="flex gap-1">
					{guide.quiz.questions.map((_, i) => (
						<div
							key={i}
							className={clsx(
								"w-2 h-2 rounded-full",
								i < currentQuestion
									? "bg-[#22C55E]"
									: i === currentQuestion
										? "bg-[#3B82F6]"
										: "bg-[#2a2a2a]",
							)}
						/>
					))}
				</div>
			</div>

			<h3 className="text-xl font-semibold text-white">{question.question}</h3>

			<div className="space-y-3">
				{question.options.map((option, i) => (
					<button
						key={i}
						onClick={() => handleAnswer(i)}
						disabled={showResult}
						className={clsx(
							"w-full p-4 rounded-xl text-left transition-all",
							"border-2",
							showResult
								? i === question.correctAnswer
									? "bg-[#22C55E]/20 border-[#22C55E] text-white"
									: i === selectedAnswer
										? "bg-[#EF4444]/20 border-[#EF4444] text-white"
										: "bg-[#1a1a1a] border-[#2a2a2a] text-[#6a6a6a]"
								: selectedAnswer === i
									? "bg-[#3B82F6]/20 border-[#3B82F6] text-white"
									: "bg-[#1a1a1a] border-[#2a2a2a] text-[#e0e0e0] hover:border-[#3a3a3a]",
						)}
					>
						<div className="flex items-center gap-3">
							<div
								className={clsx(
									"w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
									showResult && i === question.correctAnswer
										? "bg-[#22C55E] text-white"
										: showResult && i === selectedAnswer
											? "bg-[#EF4444] text-white"
											: selectedAnswer === i
												? "bg-[#3B82F6] text-white"
												: "bg-[#2a2a2a] text-[#6a6a6a]",
								)}
							>
								{String.fromCharCode(65 + i)}
							</div>
							<span>{option}</span>
						</div>
					</button>
				))}
			</div>

			{showResult && (
				<div
					className={clsx(
						"p-4 rounded-xl",
						selectedAnswer === question.correctAnswer
							? "bg-[#22C55E]/10 border border-[#22C55E]/30"
							: "bg-[#EF4444]/10 border border-[#EF4444]/30",
					)}
				>
					<p
						className={clsx(
							"font-medium mb-1",
							selectedAnswer === question.correctAnswer
								? "text-[#22C55E]"
								: "text-[#EF4444]",
						)}
					>
						{selectedAnswer === question.correctAnswer
							? "✓ Correct!"
							: "✗ Incorrect"}
					</p>
					<p className="text-[#e0e0e0] text-sm">{question.explanation}</p>
				</div>
			)}

			{!showResult && (
				<Button
					onClick={handleNext}
					disabled={selectedAnswer === null}
					fullWidth
				>
					{isLastQuestion ? "Finish Quiz" : "Next Question"}
				</Button>
			)}
		</div>
	);
}

function GuideDetailPage() {
	const { guideId } = Route.useParams();
	const navigate = useNavigate();
	const [currentSection, setCurrentSection] = useState(0);
	const [showQuiz, setShowQuiz] = useState(false);

	const guide = getGuideById(guideId);

	if (!guide) {
		return (
			<div className="text-center py-16">
				<div className="text-5xl mb-4">📚</div>
				<h2 className="text-2xl font-bold text-white mb-2">Guide not found</h2>
				<p className="text-[#6a6a6a] mb-6">
					The guide you're looking for doesn't exist.
				</p>
				<Link to="/guides">
					<Button>Back to Guides</Button>
				</Link>
			</div>
		);
	}

	const isLastSection = currentSection === guide.sections.length - 1;
	const hasQuiz = !!guide.quiz;

	const handleComplete = () => {
		navigate({ to: "/guides" });
	};

	return (
		<div className="max-w-4xl mx-auto animate-fade-in">
			{/* Back Button */}
			<Link
				to="/guides"
				className="inline-flex items-center gap-2 text-[#6a6a6a] hover:text-white transition-colors mb-6"
			>
				<ArrowLeft className="w-4 h-4" />
				<span>Back to Guides</span>
			</Link>

			{/* Header */}
			<div className="flex items-start gap-6 mb-8">
				<div className="w-20 h-20 rounded-2xl bg-[#2a2a2a] flex items-center justify-center text-4xl flex-shrink-0">
					{guide.icon}
				</div>
				<div>
					<div className="flex items-center gap-3 mb-2">
						<h1 className="text-3xl font-bold text-white">{guide.title}</h1>
						<DifficultyBadge difficulty={guide.difficulty} />
					</div>
					<p className="text-[#6a6a6a] mb-3">{guide.description}</p>
					<div className="flex items-center gap-4 text-sm text-[#6a6a6a]">
						<div className="flex items-center gap-1">
							<Clock className="w-4 h-4" />
							<span>{guide.duration}</span>
						</div>
						<div className="flex items-center gap-1">
							<BookOpen className="w-4 h-4" />
							<span>{guide.sections.length} sections</span>
						</div>
						{hasQuiz && (
							<div className="flex items-center gap-1">
								<HelpCircle className="w-4 h-4" />
								<span>Quiz included</span>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="grid lg:grid-cols-4 gap-6">
				{/* Sidebar - Table of Contents */}
				<Card className="lg:col-span-1 h-fit sticky top-6">
					<CardTitle className="mb-4 text-sm">Contents</CardTitle>
					<nav className="space-y-1">
						{guide.sections.map((section, i) => (
							<button
								key={section.id}
								onClick={() => {
									setShowQuiz(false);
									setCurrentSection(i);
								}}
								className={clsx(
									"w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors",
									currentSection === i && !showQuiz
										? "bg-[#3B82F6]/20 text-[#60A5FA]"
										: "text-[#6a6a6a] hover:text-white hover:bg-[#1a1a1a]",
								)}
							>
								{currentSection > i ? (
									<CheckCircle className="w-4 h-4 text-[#22C55E]" />
								) : (
									<Circle className="w-4 h-4" />
								)}
								<span className="truncate">{section.title}</span>
							</button>
						))}
						{hasQuiz && (
							<button
								onClick={() => setShowQuiz(true)}
								className={clsx(
									"w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors",
									showQuiz
										? "bg-[#3B82F6]/20 text-[#60A5FA]"
										: "text-[#6a6a6a] hover:text-white hover:bg-[#1a1a1a]",
								)}
							>
								<HelpCircle className="w-4 h-4" />
								<span>Quiz</span>
							</button>
						)}
					</nav>
				</Card>

				{/* Main Content */}
				<Card className="lg:col-span-3">
					{showQuiz ? (
						<QuizSection guide={guide} onComplete={handleComplete} />
					) : (
						<>
							<SectionContent
								section={guide.sections[currentSection]}
								isActive={true}
							/>

							{/* Navigation */}
							<div className="flex items-center justify-between mt-8 pt-6 border-t border-[#2a2a2a]">
								<Button
									variant="ghost"
									onClick={() =>
										setCurrentSection(Math.max(0, currentSection - 1))
									}
									disabled={currentSection === 0}
									leftIcon={<ChevronLeft className="w-4 h-4" />}
								>
									Previous
								</Button>

								{isLastSection ? (
									hasQuiz ? (
										<Button
											onClick={() => setShowQuiz(true)}
											rightIcon={<ChevronRight className="w-4 h-4" />}
										>
											Take Quiz
										</Button>
									) : (
										<Button onClick={handleComplete}>Complete Guide</Button>
									)
								) : (
									<Button
										onClick={() => setCurrentSection(currentSection + 1)}
										rightIcon={<ChevronRight className="w-4 h-4" />}
									>
										Next
									</Button>
								)}
							</div>
						</>
					)}
				</Card>
			</div>
		</div>
	);
}
