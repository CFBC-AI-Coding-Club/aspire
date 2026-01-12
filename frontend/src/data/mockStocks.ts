// Mock Stock Data for Financial Education Platform

export interface Stock {
	id: string;
	symbol: string;
	name: string;
	sector: string;
	currentPrice: number;
	previousClose: number;
	change24h: number;
	changePercent24h: number;
	volume: number;
	marketCap: number;
	high52Week: number;
	low52Week: number;
	description: string;
	logo: string;
	volatility: "low" | "medium" | "high";
	history: PricePoint[];
}

export interface PricePoint {
	timestamp: number;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
}

export interface Holding {
	stockId: string;
	symbol: string;
	name: string;
	quantity: number;
	avgBuyPrice: number;
	currentPrice: number;
	totalValue: number;
	gainLoss: number;
	gainLossPercent: number;
}

export interface Transaction {
	id: string;
	userId: string;
	stockId: string;
	symbol: string;
	type: "BUY" | "SELL";
	quantity: number;
	price: number;
	total: number;
	timestamp: number;
}

export interface Portfolio {
	userId: string;
	balance: number;
	totalInvested: number;
	totalValue: number;
	totalReturn: number;
	totalReturnPercent: number;
	holdings: Holding[];
	transactions: Transaction[];
}

export interface LeaderboardUser {
	id: string;
	name: string;
	avatar: string;
	accountType: "parent" | "child";
	portfolioValue: number;
	totalReturn: number;
	totalReturnPercent: number;
	rank: number;
	previousRank: number;
	totalTrades: number;
	winRate: number;
	badges: string[];
}

// Helper function to generate realistic price history
function generatePriceHistory(
	basePrice: number,
	volatility: number,
	days: number = 365,
): PricePoint[] {
	const history: PricePoint[] = [];
	let currentPrice = basePrice * (0.7 + Math.random() * 0.3); // Start at 70-100% of current price
	const now = Date.now();
	const dayMs = 24 * 60 * 60 * 1000;

	for (let i = days; i >= 0; i--) {
		const timestamp = now - i * dayMs;
		const changePercent = (Math.random() - 0.48) * volatility; // Slight upward bias
		const open = currentPrice;
		const change = currentPrice * changePercent;
		currentPrice = Math.max(currentPrice + change, basePrice * 0.3); // Don't go below 30% of base

		const dailyVolatility = Math.abs(changePercent) + Math.random() * 0.02;
		const high = Math.max(open, currentPrice) * (1 + dailyVolatility * 0.5);
		const low = Math.min(open, currentPrice) * (1 - dailyVolatility * 0.5);

		history.push({
			timestamp,
			open: Number(open.toFixed(2)),
			high: Number(high.toFixed(2)),
			low: Number(low.toFixed(2)),
			close: Number(currentPrice.toFixed(2)),
			volume: Math.floor(1000000 + Math.random() * 50000000),
		});
	}

	return history;
}

// Mock Stocks Data
export const mockStocks: Stock[] = [
	{
		id: "AAPL",
		symbol: "AAPL",
		name: "Apple Inc.",
		sector: "Technology",
		currentPrice: 178.72,
		previousClose: 175.84,
		change24h: 2.88,
		changePercent24h: 1.64,
		volume: 52436789,
		marketCap: 2780000000000,
		high52Week: 199.62,
		low52Week: 143.9,
		description:
			"Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.",
		logo: "🍎",
		volatility: "medium",
		history: generatePriceHistory(178.72, 0.03),
	},
	{
		id: "GOOGL",
		symbol: "GOOGL",
		name: "Alphabet Inc.",
		sector: "Technology",
		currentPrice: 141.8,
		previousClose: 140.25,
		change24h: 1.55,
		changePercent24h: 1.1,
		volume: 23456789,
		marketCap: 1750000000000,
		high52Week: 153.78,
		low52Week: 115.35,
		description:
			"Alphabet is a holding company that gives ambitious projects the resources, freedom, and focus to make their ideas happen.",
		logo: "🔍",
		volatility: "medium",
		history: generatePriceHistory(141.8, 0.035),
	},
	{
		id: "MSFT",
		symbol: "MSFT",
		name: "Microsoft Corporation",
		sector: "Technology",
		currentPrice: 378.91,
		previousClose: 374.58,
		change24h: 4.33,
		changePercent24h: 1.16,
		volume: 18234567,
		marketCap: 2810000000000,
		high52Week: 420.82,
		low52Week: 309.98,
		description:
			"Microsoft develops, licenses, and supports software, services, devices, and solutions worldwide.",
		logo: "🪟",
		volatility: "low",
		history: generatePriceHistory(378.91, 0.025),
	},
	{
		id: "AMZN",
		symbol: "AMZN",
		name: "Amazon.com Inc.",
		sector: "Consumer Cyclical",
		currentPrice: 178.25,
		previousClose: 175.35,
		change24h: 2.9,
		changePercent24h: 1.65,
		volume: 45678912,
		marketCap: 1850000000000,
		high52Week: 189.77,
		low52Week: 118.35,
		description:
			"Amazon is an e-commerce and cloud computing company that offers a wide range of products and services.",
		logo: "📦",
		volatility: "medium",
		history: generatePriceHistory(178.25, 0.04),
	},
	{
		id: "TSLA",
		symbol: "TSLA",
		name: "Tesla Inc.",
		sector: "Automotive",
		currentPrice: 248.5,
		previousClose: 255.7,
		change24h: -7.2,
		changePercent24h: -2.82,
		volume: 98765432,
		marketCap: 790000000000,
		high52Week: 299.29,
		low52Week: 152.37,
		description:
			"Tesla designs, develops, manufactures, and sells electric vehicles and energy storage products.",
		logo: "⚡",
		volatility: "high",
		history: generatePriceHistory(248.5, 0.06),
	},
	{
		id: "NVDA",
		symbol: "NVDA",
		name: "NVIDIA Corporation",
		sector: "Technology",
		currentPrice: 495.22,
		previousClose: 480.88,
		change24h: 14.34,
		changePercent24h: 2.98,
		volume: 43567890,
		marketCap: 1220000000000,
		high52Week: 505.48,
		low52Week: 222.97,
		description:
			"NVIDIA designs and manufactures computer graphics processors, chipsets, and related multimedia software.",
		logo: "🎮",
		volatility: "high",
		history: generatePriceHistory(495.22, 0.05),
	},
	{
		id: "META",
		symbol: "META",
		name: "Meta Platforms Inc.",
		sector: "Technology",
		currentPrice: 505.95,
		previousClose: 498.42,
		change24h: 7.53,
		changePercent24h: 1.51,
		volume: 15678234,
		marketCap: 1300000000000,
		high52Week: 531.49,
		low52Week: 274.38,
		description:
			"Meta builds technologies that help people connect, find communities, and grow businesses.",
		logo: "👥",
		volatility: "medium",
		history: generatePriceHistory(505.95, 0.045),
	},
	{
		id: "JPM",
		symbol: "JPM",
		name: "JPMorgan Chase & Co.",
		sector: "Financial Services",
		currentPrice: 195.23,
		previousClose: 193.87,
		change24h: 1.36,
		changePercent24h: 0.7,
		volume: 8765432,
		marketCap: 565000000000,
		high52Week: 200.94,
		low52Week: 135.19,
		description:
			"JPMorgan Chase is a financial holding company providing investment banking, financial services, and asset management.",
		logo: "🏦",
		volatility: "low",
		history: generatePriceHistory(195.23, 0.02),
	},
	{
		id: "V",
		symbol: "V",
		name: "Visa Inc.",
		sector: "Financial Services",
		currentPrice: 279.45,
		previousClose: 277.82,
		change24h: 1.63,
		changePercent24h: 0.59,
		volume: 6543210,
		marketCap: 575000000000,
		high52Week: 290.96,
		low52Week: 227.68,
		description:
			"Visa operates as a payments technology company worldwide, facilitating digital payments.",
		logo: "💳",
		volatility: "low",
		history: generatePriceHistory(279.45, 0.02),
	},
	{
		id: "JNJ",
		symbol: "JNJ",
		name: "Johnson & Johnson",
		sector: "Healthcare",
		currentPrice: 156.78,
		previousClose: 157.25,
		change24h: -0.47,
		changePercent24h: -0.3,
		volume: 5432109,
		marketCap: 378000000000,
		high52Week: 175.97,
		low52Week: 143.13,
		description:
			"Johnson & Johnson researches, develops, manufactures, and sells various products in the healthcare field.",
		logo: "💊",
		volatility: "low",
		history: generatePriceHistory(156.78, 0.015),
	},
	{
		id: "WMT",
		symbol: "WMT",
		name: "Walmart Inc.",
		sector: "Consumer Defensive",
		currentPrice: 165.32,
		previousClose: 163.98,
		change24h: 1.34,
		changePercent24h: 0.82,
		volume: 7654321,
		marketCap: 445000000000,
		high52Week: 169.94,
		low52Week: 137.0,
		description:
			"Walmart operates retail, wholesale, and other units in various formats worldwide.",
		logo: "🛒",
		volatility: "low",
		history: generatePriceHistory(165.32, 0.018),
	},
	{
		id: "DIS",
		symbol: "DIS",
		name: "The Walt Disney Company",
		sector: "Communication Services",
		currentPrice: 112.45,
		previousClose: 114.22,
		change24h: -1.77,
		changePercent24h: -1.55,
		volume: 12345678,
		marketCap: 205000000000,
		high52Week: 123.74,
		low52Week: 78.73,
		description:
			"Disney is an entertainment company with theme parks, media networks, and streaming services.",
		logo: "🏰",
		volatility: "medium",
		history: generatePriceHistory(112.45, 0.035),
	},
	{
		id: "NFLX",
		symbol: "NFLX",
		name: "Netflix Inc.",
		sector: "Communication Services",
		currentPrice: 478.92,
		previousClose: 472.15,
		change24h: 6.77,
		changePercent24h: 1.43,
		volume: 4567890,
		marketCap: 210000000000,
		high52Week: 504.2,
		low52Week: 327.06,
		description:
			"Netflix provides subscription streaming entertainment service worldwide.",
		logo: "🎬",
		volatility: "medium",
		history: generatePriceHistory(478.92, 0.04),
	},
	{
		id: "KO",
		symbol: "KO",
		name: "The Coca-Cola Company",
		sector: "Consumer Defensive",
		currentPrice: 59.87,
		previousClose: 59.52,
		change24h: 0.35,
		changePercent24h: 0.59,
		volume: 9876543,
		marketCap: 258000000000,
		high52Week: 64.99,
		low52Week: 51.55,
		description:
			"Coca-Cola manufactures, markets, and sells various nonalcoholic beverages worldwide.",
		logo: "🥤",
		volatility: "low",
		history: generatePriceHistory(59.87, 0.012),
	},
	{
		id: "PEP",
		symbol: "PEP",
		name: "PepsiCo Inc.",
		sector: "Consumer Defensive",
		currentPrice: 168.45,
		previousClose: 167.92,
		change24h: 0.53,
		changePercent24h: 0.32,
		volume: 4321098,
		marketCap: 231000000000,
		high52Week: 196.88,
		low52Week: 155.83,
		description:
			"PepsiCo manufactures, markets, distributes, and sells various beverages and convenient foods.",
		logo: "🥤",
		volatility: "low",
		history: generatePriceHistory(168.45, 0.015),
	},
	{
		id: "NKE",
		symbol: "NKE",
		name: "Nike Inc.",
		sector: "Consumer Cyclical",
		currentPrice: 98.34,
		previousClose: 99.87,
		change24h: -1.53,
		changePercent24h: -1.53,
		volume: 8765432,
		marketCap: 148000000000,
		high52Week: 123.39,
		low52Week: 88.66,
		description:
			"Nike designs, develops, and markets athletic footwear, apparel, equipment, and accessories.",
		logo: "👟",
		volatility: "medium",
		history: generatePriceHistory(98.34, 0.03),
	},
	{
		id: "SBUX",
		symbol: "SBUX",
		name: "Starbucks Corporation",
		sector: "Consumer Cyclical",
		currentPrice: 95.67,
		previousClose: 94.35,
		change24h: 1.32,
		changePercent24h: 1.4,
		volume: 6543210,
		marketCap: 109000000000,
		high52Week: 107.66,
		low52Week: 71.55,
		description:
			"Starbucks operates as a roaster, marketer, and retailer of specialty coffee worldwide.",
		logo: "☕",
		volatility: "medium",
		history: generatePriceHistory(95.67, 0.028),
	},
	{
		id: "BA",
		symbol: "BA",
		name: "The Boeing Company",
		sector: "Industrials",
		currentPrice: 215.78,
		previousClose: 220.45,
		change24h: -4.67,
		changePercent24h: -2.12,
		volume: 5432109,
		marketCap: 129000000000,
		high52Week: 267.54,
		low52Week: 176.25,
		description:
			"Boeing designs, develops, manufactures, and services commercial airplanes, defense products, and space systems.",
		logo: "✈️",
		volatility: "high",
		history: generatePriceHistory(215.78, 0.045),
	},
	{
		id: "AMD",
		symbol: "AMD",
		name: "Advanced Micro Devices",
		sector: "Technology",
		currentPrice: 178.92,
		previousClose: 172.45,
		change24h: 6.47,
		changePercent24h: 3.75,
		volume: 54321098,
		marketCap: 289000000000,
		high52Week: 187.28,
		low52Week: 93.12,
		description:
			"AMD operates as a semiconductor company, providing processors, graphics, and other products.",
		logo: "💻",
		volatility: "high",
		history: generatePriceHistory(178.92, 0.055),
	},
	{
		id: "INTC",
		symbol: "INTC",
		name: "Intel Corporation",
		sector: "Technology",
		currentPrice: 43.67,
		previousClose: 44.12,
		change24h: -0.45,
		changePercent24h: -1.02,
		volume: 32109876,
		marketCap: 184000000000,
		high52Week: 51.28,
		low52Week: 26.86,
		description:
			"Intel designs, develops, manufactures, markets, and sells computing and communications products.",
		logo: "🔵",
		volatility: "medium",
		history: generatePriceHistory(43.67, 0.04),
	},
	{
		id: "PYPL",
		symbol: "PYPL",
		name: "PayPal Holdings Inc.",
		sector: "Financial Services",
		currentPrice: 62.45,
		previousClose: 61.23,
		change24h: 1.22,
		changePercent24h: 1.99,
		volume: 12098765,
		marketCap: 68000000000,
		high52Week: 76.54,
		low52Week: 50.25,
		description:
			"PayPal operates a technology platform that enables digital payments on behalf of merchants and consumers.",
		logo: "💰",
		volatility: "medium",
		history: generatePriceHistory(62.45, 0.04),
	},
	{
		id: "CRM",
		symbol: "CRM",
		name: "Salesforce Inc.",
		sector: "Technology",
		currentPrice: 272.34,
		previousClose: 268.92,
		change24h: 3.42,
		changePercent24h: 1.27,
		volume: 4567890,
		marketCap: 264000000000,
		high52Week: 318.71,
		low52Week: 212.0,
		description:
			"Salesforce provides customer relationship management technology for businesses.",
		logo: "☁️",
		volatility: "medium",
		history: generatePriceHistory(272.34, 0.035),
	},
	{
		id: "COST",
		symbol: "COST",
		name: "Costco Wholesale Corp.",
		sector: "Consumer Defensive",
		currentPrice: 745.23,
		previousClose: 740.56,
		change24h: 4.67,
		changePercent24h: 0.63,
		volume: 2345678,
		marketCap: 330000000000,
		high52Week: 787.08,
		low52Week: 474.33,
		description:
			"Costco operates membership warehouses and e-commerce websites.",
		logo: "🏪",
		volatility: "low",
		history: generatePriceHistory(745.23, 0.02),
	},
	{
		id: "HD",
		symbol: "HD",
		name: "The Home Depot Inc.",
		sector: "Consumer Cyclical",
		currentPrice: 345.67,
		previousClose: 342.34,
		change24h: 3.33,
		changePercent24h: 0.97,
		volume: 3456789,
		marketCap: 343000000000,
		high52Week: 396.87,
		low52Week: 274.26,
		description:
			"Home Depot operates as a home improvement retailer in the United States.",
		logo: "🔨",
		volatility: "low",
		history: generatePriceHistory(345.67, 0.022),
	},
	{
		id: "MCD",
		symbol: "MCD",
		name: "McDonald's Corporation",
		sector: "Consumer Cyclical",
		currentPrice: 295.43,
		previousClose: 293.12,
		change24h: 2.31,
		changePercent24h: 0.79,
		volume: 2987654,
		marketCap: 214000000000,
		high52Week: 302.39,
		low52Week: 245.73,
		description:
			"McDonald's operates and franchises quick service restaurants worldwide.",
		logo: "🍔",
		volatility: "low",
		history: generatePriceHistory(295.43, 0.018),
	},
	{
		id: "SPOT",
		symbol: "SPOT",
		name: "Spotify Technology",
		sector: "Communication Services",
		currentPrice: 245.78,
		previousClose: 240.23,
		change24h: 5.55,
		changePercent24h: 2.31,
		volume: 1876543,
		marketCap: 48000000000,
		high52Week: 276.49,
		low52Week: 126.27,
		description:
			"Spotify provides audio streaming subscription services worldwide.",
		logo: "🎵",
		volatility: "high",
		history: generatePriceHistory(245.78, 0.05),
	},
	{
		id: "UBER",
		symbol: "UBER",
		name: "Uber Technologies Inc.",
		sector: "Technology",
		currentPrice: 67.89,
		previousClose: 66.45,
		change24h: 1.44,
		changePercent24h: 2.17,
		volume: 18765432,
		marketCap: 140000000000,
		high52Week: 82.14,
		low52Week: 40.09,
		description:
			"Uber develops and operates proprietary technology applications for ride-hailing and food delivery.",
		logo: "🚗",
		volatility: "medium",
		history: generatePriceHistory(67.89, 0.04),
	},
	{
		id: "ABNB",
		symbol: "ABNB",
		name: "Airbnb Inc.",
		sector: "Consumer Cyclical",
		currentPrice: 152.34,
		previousClose: 150.87,
		change24h: 1.47,
		changePercent24h: 0.97,
		volume: 3456789,
		marketCap: 97000000000,
		high52Week: 170.1,
		low52Week: 110.3,
		description:
			"Airbnb operates a platform for hosts to offer stays and experiences to guests worldwide.",
		logo: "🏠",
		volatility: "medium",
		history: generatePriceHistory(152.34, 0.038),
	},
	{
		id: "SQ",
		symbol: "SQ",
		name: "Block Inc.",
		sector: "Financial Services",
		currentPrice: 78.92,
		previousClose: 77.45,
		change24h: 1.47,
		changePercent24h: 1.9,
		volume: 7654321,
		marketCap: 48000000000,
		high52Week: 90.76,
		low52Week: 39.89,
		description: "Block provides payment and financial services solutions.",
		logo: "⬛",
		volatility: "high",
		history: generatePriceHistory(78.92, 0.05),
	},
	{
		id: "RBLX",
		symbol: "RBLX",
		name: "Roblox Corporation",
		sector: "Technology",
		currentPrice: 45.67,
		previousClose: 44.23,
		change24h: 1.44,
		changePercent24h: 3.26,
		volume: 12345678,
		marketCap: 28000000000,
		high52Week: 52.81,
		low52Week: 25.24,
		description:
			"Roblox operates an online entertainment platform and game creation system.",
		logo: "🎲",
		volatility: "high",
		history: generatePriceHistory(45.67, 0.06),
	},
];

// Get stock by symbol
export function getStockBySymbol(symbol: string): Stock | undefined {
	return mockStocks.find(
		(s) => s.symbol.toUpperCase() === symbol.toUpperCase(),
	);
}

// Get stocks by sector
export function getStocksBySector(sector: string): Stock[] {
	return mockStocks.filter(
		(s) => s.sector.toLowerCase() === sector.toLowerCase(),
	);
}

// Get top gainers
export function getTopGainers(limit: number = 6): Stock[] {
	return [...mockStocks]
		.sort((a, b) => b.changePercent24h - a.changePercent24h)
		.slice(0, limit);
}

// Get top losers
export function getTopLosers(limit: number = 6): Stock[] {
	return [...mockStocks]
		.sort((a, b) => a.changePercent24h - b.changePercent24h)
		.slice(0, limit);
}

// Get most active by volume
export function getMostActive(limit: number = 6): Stock[] {
	return [...mockStocks].sort((a, b) => b.volume - a.volume).slice(0, limit);
}

// Generate sparkline data from history
export function getSparklineData(stock: Stock, days: number = 30): number[] {
	return stock.history.slice(-days).map((point) => point.close);
}

// Mock user portfolios
export const mockPortfolios: Portfolio[] = [
	{
		userId: "user1",
		balance: 5234.56,
		totalInvested: 12500.0,
		totalValue: 17734.56,
		totalReturn: 5234.56,
		totalReturnPercent: 41.88,
		holdings: [
			{
				stockId: "AAPL",
				symbol: "AAPL",
				name: "Apple Inc.",
				quantity: 25,
				avgBuyPrice: 165.5,
				currentPrice: 178.72,
				totalValue: 4468.0,
				gainLoss: 330.5,
				gainLossPercent: 7.99,
			},
			{
				stockId: "MSFT",
				symbol: "MSFT",
				name: "Microsoft Corporation",
				quantity: 10,
				avgBuyPrice: 350.0,
				currentPrice: 378.91,
				totalValue: 3789.1,
				gainLoss: 289.1,
				gainLossPercent: 8.26,
			},
			{
				stockId: "NVDA",
				symbol: "NVDA",
				name: "NVIDIA Corporation",
				quantity: 8,
				avgBuyPrice: 420.0,
				currentPrice: 495.22,
				totalValue: 3961.76,
				gainLoss: 601.76,
				gainLossPercent: 17.9,
			},
			{
				stockId: "GOOGL",
				symbol: "GOOGL",
				name: "Alphabet Inc.",
				quantity: 20,
				avgBuyPrice: 130.0,
				currentPrice: 141.8,
				totalValue: 2836.0,
				gainLoss: 236.0,
				gainLossPercent: 9.08,
			},
			{
				stockId: "TSLA",
				symbol: "TSLA",
				name: "Tesla Inc.",
				quantity: 11,
				avgBuyPrice: 260.0,
				currentPrice: 248.5,
				totalValue: 2733.5,
				gainLoss: -126.5,
				gainLossPercent: -4.42,
			},
		],
		transactions: [
			{
				id: "t1",
				userId: "user1",
				stockId: "AAPL",
				symbol: "AAPL",
				type: "BUY",
				quantity: 25,
				price: 165.5,
				total: 4137.5,
				timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
			},
			{
				id: "t2",
				userId: "user1",
				stockId: "MSFT",
				symbol: "MSFT",
				type: "BUY",
				quantity: 10,
				price: 350.0,
				total: 3500.0,
				timestamp: Date.now() - 25 * 24 * 60 * 60 * 1000,
			},
			{
				id: "t3",
				userId: "user1",
				stockId: "NVDA",
				symbol: "NVDA",
				type: "BUY",
				quantity: 8,
				price: 420.0,
				total: 3360.0,
				timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000,
			},
			{
				id: "t4",
				userId: "user1",
				stockId: "GOOGL",
				symbol: "GOOGL",
				type: "BUY",
				quantity: 20,
				price: 130.0,
				total: 2600.0,
				timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
			},
			{
				id: "t5",
				userId: "user1",
				stockId: "TSLA",
				symbol: "TSLA",
				type: "BUY",
				quantity: 11,
				price: 260.0,
				total: 2860.0,
				timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
			},
		],
	},
];

// Mock leaderboard data
export const mockLeaderboard: LeaderboardUser[] = [
	{
		id: "l1",
		name: "Alex Thompson",
		avatar: "🦁",
		accountType: "child",
		portfolioValue: 28450.75,
		totalReturn: 8450.75,
		totalReturnPercent: 42.25,
		rank: 1,
		previousRank: 2,
		totalTrades: 156,
		winRate: 72.5,
		badges: ["🏆", "🎯", "🔥"],
	},
	{
		id: "l2",
		name: "Sophia Martinez",
		avatar: "🦋",
		accountType: "child",
		portfolioValue: 25890.32,
		totalReturn: 7890.32,
		totalReturnPercent: 38.9,
		rank: 2,
		previousRank: 1,
		totalTrades: 142,
		winRate: 68.3,
		badges: ["🥈", "💎"],
	},
	{
		id: "l3",
		name: "James Wilson",
		avatar: "🐺",
		accountType: "child",
		portfolioValue: 23567.89,
		totalReturn: 6567.89,
		totalReturnPercent: 35.67,
		rank: 3,
		previousRank: 3,
		totalTrades: 98,
		winRate: 65.2,
		badges: ["🥉", "⭐"],
	},
	{
		id: "l4",
		name: "Emma Johnson",
		avatar: "🦊",
		accountType: "child",
		portfolioValue: 21234.56,
		totalReturn: 5234.56,
		totalReturnPercent: 32.78,
		rank: 4,
		previousRank: 6,
		totalTrades: 87,
		winRate: 62.8,
		badges: ["📈"],
	},
	{
		id: "l5",
		name: "Michael Chen",
		avatar: "🐉",
		accountType: "child",
		portfolioValue: 19876.43,
		totalReturn: 4876.43,
		totalReturnPercent: 29.45,
		rank: 5,
		previousRank: 4,
		totalTrades: 134,
		winRate: 58.9,
		badges: ["🌟"],
	},
	{
		id: "l6",
		name: "Olivia Brown",
		avatar: "🦄",
		accountType: "child",
		portfolioValue: 18654.21,
		totalReturn: 4654.21,
		totalReturnPercent: 28.12,
		rank: 6,
		previousRank: 5,
		totalTrades: 76,
		winRate: 61.5,
		badges: ["💪"],
	},
	{
		id: "l7",
		name: "Daniel Kim",
		avatar: "🐸",
		accountType: "child",
		portfolioValue: 17432.87,
		totalReturn: 3432.87,
		totalReturnPercent: 24.56,
		rank: 7,
		previousRank: 8,
		totalTrades: 112,
		winRate: 55.4,
		badges: [],
	},
	{
		id: "l8",
		name: "Isabella Garcia",
		avatar: "🦩",
		accountType: "child",
		portfolioValue: 16789.34,
		totalReturn: 2789.34,
		totalReturnPercent: 19.92,
		rank: 8,
		previousRank: 7,
		totalTrades: 65,
		winRate: 58.2,
		badges: [],
	},
	{
		id: "l9",
		name: "Ethan Davis",
		avatar: "🐙",
		accountType: "child",
		portfolioValue: 15234.67,
		totalReturn: 1234.67,
		totalReturnPercent: 8.82,
		rank: 9,
		previousRank: 10,
		totalTrades: 43,
		winRate: 51.2,
		badges: [],
	},
	{
		id: "l10",
		name: "Ava Miller",
		avatar: "🐝",
		accountType: "child",
		portfolioValue: 14567.89,
		totalReturn: 567.89,
		totalReturnPercent: 4.05,
		rank: 10,
		previousRank: 9,
		totalTrades: 28,
		winRate: 48.6,
		badges: [],
	},
];

// Sectors list
export const sectors = [
	"Technology",
	"Financial Services",
	"Healthcare",
	"Consumer Cyclical",
	"Consumer Defensive",
	"Communication Services",
	"Industrials",
	"Automotive",
];

// Format currency
export function formatCurrency(value: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

// Format large numbers
export function formatLargeNumber(value: number): string {
	if (value >= 1e12) {
		return `$${(value / 1e12).toFixed(2)}T`;
	}
	if (value >= 1e9) {
		return `$${(value / 1e9).toFixed(2)}B`;
	}
	if (value >= 1e6) {
		return `$${(value / 1e6).toFixed(2)}M`;
	}
	return formatCurrency(value);
}

// Format percentage
export function formatPercent(value: number): string {
	const sign = value >= 0 ? "+" : "";
	return `${sign}${value.toFixed(2)}%`;
}

// Format volume
export function formatVolume(value: number): string {
	if (value >= 1e9) {
		return `${(value / 1e9).toFixed(2)}B`;
	}
	if (value >= 1e6) {
		return `${(value / 1e6).toFixed(2)}M`;
	}
	if (value >= 1e3) {
		return `${(value / 1e3).toFixed(2)}K`;
	}
	return value.toString();
}
