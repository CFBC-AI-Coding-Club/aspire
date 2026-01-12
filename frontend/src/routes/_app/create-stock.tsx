import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
	AlertCircle,
	CheckCircle,
	PlusCircle,
	Sparkles,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardTitle } from "../../components/ui/Card";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { formatCurrency, sectors } from "../../data/mockStocks";

export const Route = createFileRoute("/_app/create-stock")({
	component: CreateStockPage,
});

type Volatility = "low" | "medium" | "high";
type Trend = "bullish" | "neutral" | "bearish";

interface StockFormData {
	symbol: string;
	name: string;
	sector: string;
	price: string;
	description: string;
	volatility: Volatility;
	trend: Trend;
}

// Simulated price movement preview
function PricePreview({
	basePrice,
	volatility,
	trend,
}: {
	basePrice: number;
	volatility: Volatility;
	trend: Trend;
}) {
	const volatilityFactor = { low: 0.02, medium: 0.05, high: 0.1 }[volatility];
	const trendBias = { bullish: 0.01, neutral: 0, bearish: -0.01 }[trend];

	// Generate preview data
	const points = [];
	let price = basePrice;
	for (let i = 0; i < 20; i++) {
		const change =
			(Math.random() - 0.5) * volatilityFactor * price + trendBias * price;
		price = Math.max(price + change, basePrice * 0.5);
		points.push(price);
	}

	const minPrice = Math.min(...points);
	const maxPrice = Math.max(...points);
	const range = maxPrice - minPrice || 1;

	const isPositive = points[points.length - 1] > points[0];

	return (
		<div className="h-24 flex items-end gap-0.5">
			{points.map((p, i) => {
				const height = ((p - minPrice) / range) * 100;
				return (
					<div
						key={i}
						className={clsx(
							"flex-1 rounded-t transition-all",
							isPositive ? "bg-[#22C55E]" : "bg-[#EF4444]",
						)}
						style={{
							height: `${Math.max(height, 5)}%`,
							opacity: 0.3 + (i / points.length) * 0.7,
						}}
					/>
				);
			})}
		</div>
	);
}

function CreateStockPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<StockFormData>({
		symbol: "",
		name: "",
		sector: "Technology",
		price: "",
		description: "",
		volatility: "medium",
		trend: "neutral",
	});
	const [errors, setErrors] = useState<Partial<StockFormData>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const updateField = (field: keyof StockFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when field is updated
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const validate = (): boolean => {
		const newErrors: Partial<StockFormData> = {};

		// Symbol validation
		if (!formData.symbol) {
			newErrors.symbol = "Symbol is required";
		} else if (!/^[A-Z]{1,5}$/.test(formData.symbol.toUpperCase())) {
			newErrors.symbol = "Symbol must be 1-5 uppercase letters";
		}

		// Name validation
		if (!formData.name) {
			newErrors.name = "Company name is required";
		} else if (formData.name.length < 3) {
			newErrors.name = "Name must be at least 3 characters";
		}

		// Price validation
		const price = parseFloat(formData.price);
		if (!formData.price) {
			newErrors.price = "Initial price is required";
		} else if (Number.isNaN(price) || price <= 0) {
			newErrors.price = "Price must be a positive number";
		} else if (price > 10000) {
			newErrors.price = "Price cannot exceed $10,000";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) return;

		setIsSubmitting(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		setIsSubmitting(false);
		setShowSuccess(true);

		// Redirect after success
		setTimeout(() => {
			navigate({ to: "/market" });
		}, 2000);
	};

	const basePrice = parseFloat(formData.price) || 100;

	if (showSuccess) {
		return (
			<div className="max-w-2xl mx-auto animate-fade-in">
				<Card className="text-center py-12">
					<div className="w-20 h-20 rounded-full bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-6">
						<CheckCircle className="w-10 h-10 text-[#22C55E]" />
					</div>
					<h2 className="text-2xl font-bold text-white mb-2">Stock Created!</h2>
					<p className="text-[#6a6a6a] mb-4">
						{formData.symbol.toUpperCase()} - {formData.name} has been added to
						the market.
					</p>
					<p className="text-sm text-[#4a4a4a]">Redirecting to market...</p>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto animate-fade-in">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white mb-2">
					Create Custom Stock
				</h1>
				<p className="text-[#6a6a6a]">
					Design your own stock for the simulation market
				</p>
			</div>

			<div className="grid lg:grid-cols-3 gap-6">
				{/* Form */}
				<div className="lg:col-span-2">
					<Card>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Basic Info */}
							<div>
								<h3 className="font-semibold text-white mb-4 flex items-center gap-2">
									<Sparkles className="w-5 h-5 text-[#60A5FA]" />
									Basic Information
								</h3>
								<div className="grid md:grid-cols-2 gap-4">
									<Input
										label="Stock Symbol"
										placeholder="e.g., DEMO"
										value={formData.symbol}
										onChange={(e) =>
											updateField("symbol", e.target.value.toUpperCase())
										}
										error={errors.symbol}
										hint="1-5 letters (e.g., AAPL, MSFT)"
									/>
									<Input
										label="Company Name"
										placeholder="e.g., Demo Corporation"
										value={formData.name}
										onChange={(e) => updateField("name", e.target.value)}
										error={errors.name}
									/>
								</div>
							</div>

							{/* Price & Sector */}
							<div className="grid md:grid-cols-2 gap-4">
								<Input
									label="Initial Price ($)"
									type="number"
									placeholder="100.00"
									value={formData.price}
									onChange={(e) => updateField("price", e.target.value)}
									error={errors.price}
									hint="Starting price for your stock"
								/>
								<Select
									label="Sector"
									options={sectors.map((s) => ({ value: s, label: s }))}
									value={formData.sector}
									onChange={(v) => updateField("sector", v)}
								/>
							</div>

							{/* Description */}
							<Textarea
								label="Description"
								placeholder="Describe what this company does..."
								value={formData.description}
								onChange={(e) => updateField("description", e.target.value)}
								rows={3}
								hint="Optional - Add details about the company"
							/>

							{/* Behavior Settings */}
							<div>
								<h3 className="font-semibold text-white mb-4 flex items-center gap-2">
									<TrendingUp className="w-5 h-5 text-[#60A5FA]" />
									Behavior Settings
								</h3>

								{/* Volatility */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-[#e0e0e0] mb-3">
										Volatility Level
									</label>
									<div className="grid grid-cols-3 gap-3">
										{(["low", "medium", "high"] as Volatility[]).map(
											(level) => (
												<button
													key={level}
													type="button"
													onClick={() => updateField("volatility", level)}
													className={clsx(
														"p-4 rounded-xl border-2 text-center transition-all",
														formData.volatility === level
															? level === "low"
																? "border-[#22C55E] bg-[#22C55E]/10"
																: level === "medium"
																	? "border-[#FBBF24] bg-[#FBBF24]/10"
																	: "border-[#EF4444] bg-[#EF4444]/10"
															: "border-[#2a2a2a] hover:border-[#3a3a3a]",
													)}
												>
													<p
														className={clsx(
															"font-semibold capitalize mb-1",
															formData.volatility === level
																? level === "low"
																	? "text-[#22C55E]"
																	: level === "medium"
																		? "text-[#FBBF24]"
																		: "text-[#EF4444]"
																: "text-white",
														)}
													>
														{level}
													</p>
													<p className="text-xs text-[#6a6a6a]">
														{level === "low"
															? "Small price swings"
															: level === "medium"
																? "Moderate movement"
																: "Large price swings"}
													</p>
												</button>
											),
										)}
									</div>
								</div>

								{/* Trend */}
								<div>
									<label className="block text-sm font-medium text-[#e0e0e0] mb-3">
										Growth Trend
									</label>
									<div className="grid grid-cols-3 gap-3">
										{(["bullish", "neutral", "bearish"] as Trend[]).map(
											(trend) => (
												<button
													key={trend}
													type="button"
													onClick={() => updateField("trend", trend)}
													className={clsx(
														"p-4 rounded-xl border-2 text-center transition-all",
														formData.trend === trend
															? trend === "bullish"
																? "border-[#22C55E] bg-[#22C55E]/10"
																: trend === "neutral"
																	? "border-[#3B82F6] bg-[#3B82F6]/10"
																	: "border-[#EF4444] bg-[#EF4444]/10"
															: "border-[#2a2a2a] hover:border-[#3a3a3a]",
													)}
												>
													<div className="flex justify-center mb-2">
														{trend === "bullish" ? (
															<TrendingUp className="w-5 h-5 text-[#22C55E]" />
														) : trend === "bearish" ? (
															<TrendingDown className="w-5 h-5 text-[#EF4444]" />
														) : (
															<span className="text-[#3B82F6]">→</span>
														)}
													</div>
													<p
														className={clsx(
															"font-semibold capitalize mb-1",
															formData.trend === trend
																? trend === "bullish"
																	? "text-[#22C55E]"
																	: trend === "neutral"
																		? "text-[#60A5FA]"
																		: "text-[#EF4444]"
																: "text-white",
														)}
													>
														{trend}
													</p>
													<p className="text-xs text-[#6a6a6a]">
														{trend === "bullish"
															? "Tends upward"
															: trend === "neutral"
																? "No bias"
																: "Tends downward"}
													</p>
												</button>
											),
										)}
									</div>
								</div>
							</div>

							{/* Submit */}
							<Button
								type="submit"
								fullWidth
								size="lg"
								isLoading={isSubmitting}
								leftIcon={<PlusCircle className="w-5 h-5" />}
							>
								Create Stock
							</Button>
						</form>
					</Card>
				</div>

				{/* Preview */}
				<div className="space-y-4">
					<Card>
						<CardTitle className="mb-4">Preview</CardTitle>

						{/* Stock Card Preview */}
						<div className="bg-[#121212] rounded-xl p-4 mb-4">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-xl font-bold text-white">
									{formData.symbol.slice(0, 2) || "??"}
								</div>
								<div>
									<p className="font-bold text-white">
										{formData.symbol || "SYMBOL"}
									</p>
									<p className="text-sm text-[#6a6a6a]">
										{formData.name || "Company Name"}
									</p>
								</div>
							</div>
							<p className="text-2xl font-bold text-white font-mono mb-2">
								{formData.price
									? formatCurrency(parseFloat(formData.price))
									: "$0.00"}
							</p>
							<span className="px-2 py-1 rounded-lg bg-[#2a2a2a] text-[#6a6a6a] text-xs">
								{formData.sector}
							</span>
						</div>

						{/* Price Movement Preview */}
						<div className="bg-[#121212] rounded-xl p-4">
							<p className="text-sm text-[#6a6a6a] mb-3">
								Simulated Price Movement
							</p>
							<PricePreview
								basePrice={basePrice}
								volatility={formData.volatility as Volatility}
								trend={formData.trend as Trend}
							/>
						</div>
					</Card>

					{/* Info Card */}
					<Card className="bg-[#FBBF24]/10 border-[#FBBF24]/30">
						<div className="flex items-start gap-3">
							<AlertCircle className="w-5 h-5 text-[#FBBF24] flex-shrink-0 mt-0.5" />
							<div>
								<p className="font-medium text-[#FBBF24] mb-1">Note</p>
								<p className="text-sm text-[#6a6a6a]">
									Custom stocks are for simulation only. Price movements are
									randomly generated based on your volatility and trend
									settings.
								</p>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
