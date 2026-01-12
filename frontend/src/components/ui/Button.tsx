import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
	| "primary"
	| "secondary"
	| "ghost"
	| "outline"
	| "danger"
	| "success";
type ButtonSize = "sm" | "md" | "lg";
type ButtonAccent = "blue" | "yellow";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	accent?: ButtonAccent;
	isLoading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	fullWidth?: boolean;
}

export function Button({
	children,
	variant = "primary",
	size = "md",
	accent = "blue",
	isLoading = false,
	leftIcon,
	rightIcon,
	fullWidth = false,
	className,
	disabled,
	...props
}: ButtonProps) {
	const baseStyles = clsx(
		"inline-flex items-center justify-center gap-2",
		"font-semibold rounded-xl",
		"transition-all duration-200",
		"focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
		"disabled:opacity-50 disabled:cursor-not-allowed",
		fullWidth && "w-full",
	);

	const sizeStyles = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-5 py-2.5 text-base",
		lg: "px-7 py-3.5 text-lg",
	};

	const variantStyles = {
		primary:
			accent === "blue"
				? clsx(
						"bg-gradient-to-r from-[#3B82F6] to-[#2563EB]",
						"text-white",
						"hover:from-[#60A5FA] hover:to-[#3B82F6]",
						"active:from-[#2563EB] active:to-[#1D4ED8]",
						"focus-visible:ring-[#3B82F6]",
						"shadow-lg shadow-blue-500/25",
					)
				: clsx(
						"bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]",
						"text-[#0a0a0a]",
						"hover:from-[#FCD34D] hover:to-[#FBBF24]",
						"active:from-[#F59E0B] active:to-[#D97706]",
						"focus-visible:ring-[#FBBF24]",
						"shadow-lg shadow-yellow-500/25",
					),
		secondary: clsx(
			"bg-[#2a2a2a]",
			"text-white",
			"hover:bg-[#3a3a3a]",
			"active:bg-[#242424]",
			"focus-visible:ring-[#4a4a4a]",
			"border border-[#3a3a3a]",
		),
		ghost: clsx(
			"bg-transparent",
			accent === "blue"
				? "text-[#60A5FA] hover:bg-[#3B82F6]/10"
				: "text-[#FBBF24] hover:bg-[#FBBF24]/10",
			"active:bg-transparent",
		),
		outline:
			accent === "blue"
				? clsx(
						"bg-transparent",
						"border-2 border-[#3B82F6]",
						"text-[#60A5FA]",
						"hover:bg-[#3B82F6]/10",
						"focus-visible:ring-[#3B82F6]",
					)
				: clsx(
						"bg-transparent",
						"border-2 border-[#FBBF24]",
						"text-[#FCD34D]",
						"hover:bg-[#FBBF24]/10",
						"focus-visible:ring-[#FBBF24]",
					),
		danger: clsx(
			"bg-gradient-to-r from-[#EF4444] to-[#DC2626]",
			"text-white",
			"hover:from-[#F87171] hover:to-[#EF4444]",
			"focus-visible:ring-[#EF4444]",
			"shadow-lg shadow-red-500/25",
		),
		success: clsx(
			"bg-gradient-to-r from-[#22C55E] to-[#16A34A]",
			"text-white",
			"hover:from-[#4ADE80] hover:to-[#22C55E]",
			"focus-visible:ring-[#22C55E]",
			"shadow-lg shadow-green-500/25",
		),
	};

	return (
		<button
			className={clsx(
				baseStyles,
				sizeStyles[size],
				variantStyles[variant],
				className,
			)}
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading ? (
				<svg
					className="animate-spin h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			) : (
				leftIcon
			)}
			{children}
			{!isLoading && rightIcon}
		</button>
	);
}
