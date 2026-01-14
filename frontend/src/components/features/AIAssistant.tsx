import { useLocation } from "@tanstack/react-router";
import { clsx } from "clsx";
import { Bot, Loader2, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { aiAPI } from "../../lib/api";

interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: Date;
	isLoading?: boolean;
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

// Map paths to context strings for the AI
const contextByPath: Record<string, string> = {
	"/dashboard": "dashboard - viewing portfolio summary and market overview",
	"/market": "market - browsing available stocks to buy",
	"/portfolio": "portfolio - viewing their stock holdings",
	"/leaderboard": "leaderboard - comparing performance with other users",
	"/games": "games - learning games section",
	"/guides": "guides - educational content",
	"/create-stock": "create-stock - creating a new stock",
	"/profile": "profile - viewing their account details",
};

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
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const location = useLocation();
	const { user } = useAuth();

	const isParent = user?.accountType === "parent";
	const accentColor = isParent ? "parent" : "primary";
	const placeholder =
		placeholderByPath[location.pathname] ||
		"Ask me anything about investing...";
	const currentContext = contextByPath[location.pathname] || "general";

	// Auto-scroll to bottom when new messages arrive
	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	const handleSend = async () => {
		if (!input.trim() || isLoading) return;

		const userMessageContent = input.trim();
		
		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			content: userMessageContent,
			role: "user",
			timestamp: new Date(),
		};

		// Add loading message placeholder
		const loadingMessage: Message = {
			id: (Date.now() + 1).toString(),
			content: "",
			role: "assistant",
			timestamp: new Date(),
			isLoading: true,
		};

		setMessages((prev) => [...prev, userMessage, loadingMessage]);
		setInput("");
		setIsLoading(true);

		try {
			// Call the actual AI API
			const response = await aiAPI.chat(userMessageContent, currentContext);
			
			// Replace loading message with actual response
			setMessages((prev) => 
				prev.map((msg) =>
					msg.isLoading
						? {
								...msg,
								content: response.message,
								isLoading: false,
							}
						: msg
				)
			);
		} catch (error) {
			console.error("AI Chat Error:", error);
			
			// Replace loading message with error
			setMessages((prev) =>
				prev.map((msg) =>
					msg.isLoading
						? {
								...msg,
								content: "Oops! I'm having trouble right now. 😅 Please try again in a moment!",
								isLoading: false,
							}
						: msg
				)
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClearHistory = async () => {
		try {
			await aiAPI.clearHistory();
			setMessages([
				{
					id: Date.now().toString(),
					content:
						"Hi! I'm Sparky, your investing assistant. 🚀 I can help you learn about stocks, understand your portfolio, and answer questions about investing. What would you like to know?",
					role: "assistant",
					timestamp: new Date(),
				},
			]);
		} catch (error) {
			console.error("Failed to clear chat history:", error);
		}
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
						<div className="flex-1">
							<h3 className="font-semibold text-[var(--color-text-primary)]">Sparky</h3>
							<p className="text-xs text-[var(--color-text-muted)]">Your investing assistant</p>
						</div>
						<button
							type="button"
							onClick={handleClearHistory}
							className={clsx(
								"p-2 rounded-lg",
								"text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
								"hover:bg-[var(--color-base-700)]",
								"transition-colors duration-200"
							)}
							title="Start new conversation"
						>
							<RotateCcw className="w-4 h-4" />
						</button>
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
									{message.isLoading ? (
										<div className="flex items-center gap-2">
											<Loader2 className="w-4 h-4 animate-spin" />
											<span className="text-sm">Thinking...</span>
										</div>
									) : (
										<p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
									)}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
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
								disabled={isLoading}
								className={clsx(
									"flex-1 px-4 py-3",
									"bg-[var(--color-base-800)] border border-[var(--color-border)] rounded-xl",
									"text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]",
									"focus:outline-none focus:border-[var(--color-primary)]",
									"text-sm",
									"disabled:opacity-50",
								)}
							/>
							<button
								type="submit"
								disabled={!input.trim() || isLoading}
								className={clsx(
									"p-3 rounded-xl",
									"transition-all duration-200",
									"disabled:opacity-50 disabled:cursor-not-allowed",
									input.trim() && !isLoading
										? accentColor === "parent"
											? "bg-[var(--color-parent-primary)] text-white hover:bg-[var(--color-parent-light)]"
											: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]"
										: "bg-[var(--color-base-700)] text-[var(--color-text-muted)]",
								)}
							>
								{isLoading ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									<Send className="w-5 h-5" />
								)}
							</button>
						</form>
						<p className="text-xs text-[var(--color-text-muted)] mt-2 text-center">
							Powered by AI • Ask about stocks, investing, or your portfolio
						</p>
					</div>
				</div>
			)}
		</>
	);
}
