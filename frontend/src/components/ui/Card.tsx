import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "elevated" | "outlined" | "glass";
type CardAccent = "none" | "blue" | "yellow" | "success" | "error";

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
		default: "bg-[#1a1a1a] border border-[#2a2a2a]",
		elevated: "bg-[#1a1a1a] shadow-xl shadow-black/30",
		outlined: "bg-transparent border-2 border-[#2a2a2a]",
		glass: "bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/10",
	};

	const accentStyles = {
		none: "",
		blue: "border-l-4 border-l-[#3B82F6]",
		yellow: "border-l-4 border-l-[#FBBF24]",
		success: "border-l-4 border-l-[#22C55E]",
		error: "border-l-4 border-l-[#EF4444]",
	};

	const paddingStyles = {
		none: "",
		sm: "p-4",
		md: "p-6",
		lg: "p-8",
	};

	const hoverStyles = hover
		? "hover:border-[#3a3a3a] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
		: "";

	const gradientStyles = gradient
		? "bg-gradient-to-br from-[#1a1a1a] to-[#121212]"
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
				"font-semibold text-white",
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
		<p className={clsx("text-[#9a9a9a] text-sm mt-1", className)} {...props}>
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
			className={clsx("mt-4 pt-4 border-t border-[#2a2a2a]", className)}
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
					<p className="text-[#6a6a6a] text-sm font-medium">{label}</p>
					<p className="text-2xl font-bold text-white mt-1">{value}</p>
					{change !== undefined && (
						<div
							className={clsx(
								"flex items-center gap-1 mt-2 text-sm font-medium",
								isPositive ? "text-[#22C55E]" : "text-[#EF4444]",
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
