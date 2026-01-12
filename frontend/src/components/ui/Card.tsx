import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "elevated" | "outlined" | "glass";
type CardAccent = "none" | "blue" | "yellow" | "success" | "error" | "primary" | "secondary";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	variant?: CardVariant;
	accent?: CardAccent;
	padding?: "none" | "sm" | "md" | "lg";
	hover?: boolean;
	gradient?: boolean;
}

export function Card({
	children,
	variant = "default",
	accent = "none",
	padding = "md",
	hover = false,
	gradient = false,
	className,
	...props
}: CardProps) {
	const baseStyles = clsx("rounded-2xl", "transition-all duration-200");

	const variantStyles = {
		default: "bg-white border border-[#482977]/10 shadow-sm",
		elevated: "bg-white shadow-lg shadow-[#482977]/5",
		outlined: "bg-transparent border-2 border-[#482977]/15",
		glass: "bg-white/80 backdrop-blur-xl border border-[#482977]/10",
	};

	// Map old accent names to new colors
	const accentStyles = {
		none: "",
		blue: "border-l-4 border-l-[#482977]",
		primary: "border-l-4 border-l-[#482977]",
		yellow: "border-l-4 border-l-[#c22f99]",
		secondary: "border-l-4 border-l-[#c22f99]",
		success: "border-l-4 border-l-[#16a34a]",
		error: "border-l-4 border-l-[#dc2626]",
	};

	const paddingStyles = {
		none: "",
		sm: "p-4",
		md: "p-6",
		lg: "p-8",
	};

	const hoverStyles = hover
		? "hover:border-[#482977]/25 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
		: "";

	const gradientStyles = gradient
		? "bg-gradient-to-br from-white to-[#f8f9fc]"
		: "";

	return (
		<div
			className={clsx(
				baseStyles,
				variantStyles[variant],
				accentStyles[accent],
				paddingStyles[padding],
				hoverStyles,
				gradientStyles,
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

// Card Header Component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
	return (
		<div className={clsx("mb-4", className)} {...props}>
			{children}
		</div>
	);
}

// Card Title Component
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode;
	as?: "h1" | "h2" | "h3" | "h4";
}

export function CardTitle({
	children,
	as: Component = "h3",
	className,
	...props
}: CardTitleProps) {
	return (
		<Component
			className={clsx(
				"font-semibold text-[#1a1a2e]",
				Component === "h1" && "text-2xl",
				Component === "h2" && "text-xl",
				Component === "h3" && "text-lg",
				Component === "h4" && "text-base",
				className,
			)}
			{...props}
		>
			{children}
		</Component>
	);
}

// Card Description Component
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode;
}

export function CardDescription({
	children,
	className,
	...props
}: CardDescriptionProps) {
	return (
		<p className={clsx("text-[#566279] text-sm mt-1", className)} {...props}>
			{children}
		</p>
	);
}

// Card Content Component
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function CardContent({
	children,
	className,
	...props
}: CardContentProps) {
	return (
		<div className={clsx(className)} {...props}>
			{children}
		</div>
	);
}

// Card Footer Component
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
	return (
		<div
			className={clsx("mt-4 pt-4 border-t border-[#482977]/10", className)}
			{...props}
		>
			{children}
		</div>
	);
}

// Stat Card Component
interface StatCardProps {
	label: string;
	value: string | number;
	change?: number;
	icon?: ReactNode;
	accent?: CardAccent;
}

export function StatCard({
	label,
	value,
	change,
	icon,
	accent = "none",
}: StatCardProps) {
	const isPositive = change !== undefined && change >= 0;

	return (
		<Card accent={accent} hover>
			<div className="flex items-start justify-between">
				<div>
					<p className="text-[#7a8aa3] text-sm font-medium">{label}</p>
					<p className="text-2xl font-bold text-[#1a1a2e] mt-1">{value}</p>
					{change !== undefined && (
						<div
							className={clsx(
								"flex items-center gap-1 mt-2 text-sm font-medium",
								isPositive ? "text-[#16a34a]" : "text-[#dc2626]",
							)}
						>
							<span>{isPositive ? "↑" : "↓"}</span>
							<span>
								{isPositive ? "+" : ""}
								{change.toFixed(2)}%
							</span>
						</div>
					)}
				</div>
				{icon && <div className="text-3xl">{icon}</div>}
			</div>
		</Card>
	);
}
