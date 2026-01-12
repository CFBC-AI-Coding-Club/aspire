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
type ButtonAccent = "blue" | "yellow" | "primary" | "secondary";

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
	accent = "primary",
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
		"focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
		"disabled:opacity-50 disabled:cursor-not-allowed",
		fullWidth && "w-full",
	);

	const sizeStyles = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-5 py-2.5 text-base",
		lg: "px-7 py-3.5 text-lg",
	};

	// Map old accent names to new
	const isPrimary = accent === "blue" || accent === "primary";

	const variantStyles = {
		primary: isPrimary
			? clsx(
					"bg-gradient-to-r from-[#482977] to-[#6b42a1]",
					"text-white",
					"hover:from-[#5c3699] hover:to-[#7d4fb8]",
					"active:from-[#351d5a] active:to-[#482977]",
					"focus-visible:ring-[#482977]",
					"shadow-lg shadow-[#482977]/25",
				)
			: clsx(
					"bg-gradient-to-r from-[#c22f99] to-[#9a2579]",
					"text-white",
					"hover:from-[#d94db3] hover:to-[#c22f99]",
					"active:from-[#9a2579] active:to-[#7c1d61]",
					"focus-visible:ring-[#c22f99]",
					"shadow-lg shadow-[#c22f99]/25",
				),
		secondary: clsx(
			"bg-[#f1f3f9]",
			"text-[#482977]",
			"hover:bg-[#e8ecf4]",
			"active:bg-[#dde3ef]",
			"focus-visible:ring-[#482977]",
			"border border-[#482977]/20",
		),
		ghost: clsx(
			"bg-transparent",
			isPrimary
				? "text-[#482977] hover:bg-[#482977]/10"
				: "text-[#c22f99] hover:bg-[#c22f99]/10",
			"active:bg-transparent",
		),
		outline: isPrimary
			? clsx(
					"bg-transparent",
					"border-2 border-[#482977]",
					"text-[#482977]",
					"hover:bg-[#482977]/10",
					"focus-visible:ring-[#482977]",
				)
			: clsx(
					"bg-transparent",
					"border-2 border-[#c22f99]",
					"text-[#c22f99]",
					"hover:bg-[#c22f99]/10",
					"focus-visible:ring-[#c22f99]",
				),
		danger: clsx(
			"bg-gradient-to-r from-[#dc2626] to-[#b91c1c]",
			"text-white",
			"hover:from-[#ef4444] hover:to-[#dc2626]",
			"focus-visible:ring-[#dc2626]",
			"shadow-lg shadow-red-500/25",
		),
		success: clsx(
			"bg-gradient-to-r from-[#16a34a] to-[#15803d]",
			"text-white",
			"hover:from-[#22c55e] hover:to-[#16a34a]",
			"focus-visible:ring-[#16a34a]",
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
