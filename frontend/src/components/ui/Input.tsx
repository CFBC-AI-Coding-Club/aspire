import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	hint?: string;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	accent?: "blue" | "yellow";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			error,
			hint,
			leftIcon,
			rightIcon,
			accent = "blue",
			className,
			id,
			...props
		},
		ref,
	) => {
		const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

		const focusColor =
			accent === "blue"
				? "focus:border-[#3B82F6] focus:ring-[#3B82F6]/20"
				: "focus:border-[#FBBF24] focus:ring-[#FBBF24]/20";

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={inputId}
						className="block text-sm font-medium text-[#e0e0e0] mb-2"
					>
						{label}
					</label>
				)}
				<div className="relative">
					{leftIcon && (
						<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a6a6a]">
							{leftIcon}
						</div>
					)}
					<input
						ref={ref}
						id={inputId}
						className={clsx(
							"w-full px-4 py-3",
							"bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl",
							"text-white placeholder-[#4a4a4a]",
							"transition-all duration-200",
							"focus:outline-none focus:ring-4",
							focusColor,
							error &&
								"border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20",
							leftIcon && "pl-11",
							rightIcon && "pr-11",
							"disabled:opacity-50 disabled:cursor-not-allowed",
							className,
						)}
						{...props}
					/>
					{rightIcon && (
						<div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a6a6a]">
							{rightIcon}
						</div>
					)}
				</div>
				{error && <p className="mt-2 text-sm text-[#EF4444]">{error}</p>}
				{hint && !error && (
					<p className="mt-2 text-sm text-[#6a6a6a]">{hint}</p>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";

// Search Input Component
interface SearchInputProps extends Omit<InputProps, "leftIcon"> {
	onSearch?: (value: string) => void;
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
	return (
		<Input
			type="search"
			placeholder="Search..."
			leftIcon={
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</svg>
			}
			onChange={(e) => onSearch?.(e.target.value)}
			{...props}
		/>
	);
}

// Select Component
interface SelectProps
	extends Omit<InputHTMLAttributes<HTMLSelectElement>, "onChange"> {
	label?: string;
	error?: string;
	options: { value: string; label: string }[];
	accent?: "blue" | "yellow";
	onChange?: (value: string) => void;
}

export function Select({
	label,
	error,
	options,
	accent = "blue",
	onChange,
	className,
	id,
	...props
}: SelectProps) {
	const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

	const focusColor =
		accent === "blue"
			? "focus:border-[#3B82F6] focus:ring-[#3B82F6]/20"
			: "focus:border-[#FBBF24] focus:ring-[#FBBF24]/20";

	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={inputId}
					className="block text-sm font-medium text-[#e0e0e0] mb-2"
				>
					{label}
				</label>
			)}
			<div className="relative">
				<select
					id={inputId}
					className={clsx(
						"w-full px-4 py-3 pr-10",
						"bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl",
						"text-white",
						"transition-all duration-200",
						"focus:outline-none focus:ring-4",
						focusColor,
						error && "border-[#EF4444]",
						"appearance-none cursor-pointer",
						"disabled:opacity-50 disabled:cursor-not-allowed",
						className,
					)}
					onChange={(e) => onChange?.(e.target.value)}
					{...props}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a6a6a] pointer-events-none">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</div>
			</div>
			{error && <p className="mt-2 text-sm text-[#EF4444]">{error}</p>}
		</div>
	);
}

// Textarea Component
interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	hint?: string;
	accent?: "blue" | "yellow";
	rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{ label, error, hint, accent = "blue", rows = 4, className, id, ...props },
		ref,
	) => {
		const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

		const focusColor =
			accent === "blue"
				? "focus:border-[#3B82F6] focus:ring-[#3B82F6]/20"
				: "focus:border-[#FBBF24] focus:ring-[#FBBF24]/20";

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={inputId}
						className="block text-sm font-medium text-[#e0e0e0] mb-2"
					>
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					id={inputId}
					rows={rows}
					className={clsx(
						"w-full px-4 py-3",
						"bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl",
						"text-white placeholder-[#4a4a4a]",
						"transition-all duration-200",
						"focus:outline-none focus:ring-4",
						focusColor,
						error &&
							"border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20",
						"disabled:opacity-50 disabled:cursor-not-allowed",
						"resize-none",
						className,
					)}
					{...props}
				/>
				{error && <p className="mt-2 text-sm text-[#EF4444]">{error}</p>}
				{hint && !error && (
					<p className="mt-2 text-sm text-[#6a6a6a]">{hint}</p>
				)}
			</div>
		);
	},
);

Textarea.displayName = "Textarea";
