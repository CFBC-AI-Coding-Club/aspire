import { useLocation } from "@tanstack/react-router";
import { clsx } from "clsx";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: Date;
}

// Context-aware placeholder text based on current page
const placeholderByPath: Record<string, string> = {
	"/dashboard": "Ask me about the market or your portfolio...",
	"/market": "Need help finding a stock to invest in?",
	"/portfolio": "Questions about your holdings?",
	"/leaderboard": "Want to know how to climb the ranks?",
	"/games": "Need help with any of the games?",
	"/guides": "Looking for learning recommendations?",
	"/create-stock": "Need help creating your stock?",
	"/profile": "Want to understand your stats?",
};

// Placeholder responses for the AI assistant
const assistantResponses = [
	"Great question! I'd recommend starting with our 'What is Investing?' guide to understand the basics. Would you like me to explain any specific concept?",
	"Based on your portfolio, you have a good mix of tech stocks. Have you considered diversifying into other sectors like healthcare or consumer goods?",
	"The market has been showing some interesting trends lately! Remember, it's important to focus on long-term growth rather than daily fluctuations.",
	"That's a smart approach to investing! Dollar-cost averaging can help reduce the impact of market volatility on your purchases.",
	"I see you're interested in that stock! Remember to research the company's fundamentals before making investment decisions.",
	"This feature will be enhanced with AI soon! For now, I can help answer basic questions about investing and the platform.",
];

export function AIAssistant() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			content:
				"Hi! I'm Sparky, your investing assistant. 🚀 I can help you learn about stocks, understand your portfolio, and answer questions about investing. What would you like to know?",
			role: "assistant",
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState("");
	const location = useLocation();
	const { user } = useAuth();

	const isParent = user?.accountType === "parent";
	const accentColor = isParent ? "parent" : "primary";
	const placeholder =
		placeholderByPath[location.pathname] ||
		"Ask me anything about investing...";

	const handleSend = () => {
		if (!input.trim()) return;

		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			content: input,
			role: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");

		// Simulate AI response (placeholder for future AI integration)
		setTimeout(() => {
			const randomResponse =
				assistantResponses[
					Math.floor(Math.random() * assistantResponses.length)
				];
			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: randomResponse,
				role: "assistant",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, assistantMessage]);
		}, 1000);
	};

	return (
		<>
			{/* FAB Button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={clsx(
					"fixed bottom-6 right-6 z-40",
					"w-14 h-14 rounded-full",
					"flex items-center justify-center",
					"shadow-lg transition-all duration-300",
					"hover:scale-110 active:scale-95",
					isOpen && "rotate-180",
					accentColor === "parent"
						? "bg-gradient-to-br from-[var(--color-parent-light)] to-[var(--color-parent-primary)] shadow-[var(--color-parent-primary)]/30"
						: "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-[var(--color-primary)]/30",
				)}
				aria-label={isOpen ? "Close assistant" : "Open assistant"}
			>
				{isOpen ? (
					<X className="w-6 h-6 text-white" />
				) : (
					<Bot className="w-6 h-6 text-white animate-bounce-subtle" />
				)}
			</button>

			{/* Chat Window */}
			{isOpen && (
				<div
					className={clsx(
						"fixed bottom-24 right-6 z-40",
						"w-[calc(100vw-3rem)] sm:w-[400px] h-[500px]",
						"max-w-[400px]",
						"bg-[var(--color-base-900)] rounded-2xl",
						"border border-[var(--color-border)]",
						"shadow-2xl",
						"flex flex-col",
						"animate-slide-up",
					)}
				>
					{/* Header */}
					<div
						className={clsx(
							"flex items-center gap-3 px-4 py-3",
							"border-b border-[var(--color-border)]",
							"bg-gradient-to-r",
							accentColor === "parent"
								? "from-[var(--color-parent-muted)] to-transparent"
								: "from-[var(--color-primary-muted)] to-transparent",
						)}
					>
						<div
							className={clsx(
								"w-10 h-10 rounded-full flex items-center justify-center",
								"bg-gradient-to-br",
								accentColor === "parent"
									? "from-[var(--color-parent-light)] to-[var(--color-parent-primary)]"
									: "from-[var(--color-primary)] to-[var(--color-secondary)]",
							)}
						>
							<Sparkles className="w-5 h-5 text-white" />
						</div>
						<div>
							<h3 className="font-semibold text-[var(--color-text-primary)]">Sparky</h3>
							<p className="text-xs text-[var(--color-text-muted)]">Your investing assistant</p>
						</div>
					</div>

					{/* Messages */}
					<div className="flex-1 overflow-y-auto p-4 space-y-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={clsx(
									"flex",
									message.role === "user" ? "justify-end" : "justify-start",
								)}
							>
								<div
									className={clsx(
										"max-w-[80%] px-4 py-3 rounded-2xl",
										message.role === "user"
											? clsx(
													"rounded-br-md",
													accentColor === "parent"
														? "bg-[var(--color-parent-primary)] text-white"
														: "bg-[var(--color-primary)] text-white",
												)
											: "bg-[var(--color-base-700)] text-[var(--color-text-primary)] rounded-bl-md",
									)}
								>
									<p className="text-sm leading-relaxed">{message.content}</p>
								</div>
							</div>
						))}
					</div>

					{/* Input */}
					<div className="p-4 border-t border-[var(--color-border)]">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSend();
							}}
							className="flex items-center gap-2"
						>
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder={placeholder}
								className={clsx(
									"flex-1 px-4 py-3",
									"bg-[var(--color-base-800)] border border-[var(--color-border)] rounded-xl",
									"text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]",
									"focus:outline-none focus:border-[var(--color-primary)]",
									"text-sm",
								)}
							/>
							<button
								type="submit"
								disabled={!input.trim()}
								className={clsx(
									"p-3 rounded-xl",
									"transition-all duration-200",
									"disabled:opacity-50 disabled:cursor-not-allowed",
									input.trim()
										? accentColor === "parent"
											? "bg-[var(--color-parent-primary)] text-white hover:bg-[var(--color-parent-light)]"
											: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]"
										: "bg-[var(--color-base-700)] text-[var(--color-text-muted)]",
								)}
							>
								<Send className="w-5 h-5" />
							</button>
						</form>
						<p className="text-xs text-[var(--color-text-muted)] mt-2 text-center">
							{/* TODO: Integrate real AI backend here */}
							AI features coming soon • Currently using placeholder responses
						</p>
					</div>
				</div>
			)}
		</>
	);
}
