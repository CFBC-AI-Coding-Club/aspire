// Guide content for the educational platform

export interface Guide {
	id: string;
	title: string;
	description: string;
	category: GuideCategory;
	difficulty: "beginner" | "intermediate" | "advanced";
	duration: string;
	icon: string;
	sections: GuideSection[];
	quiz?: Quiz;
}

export interface GuideSection {
	id: string;
	title: string;
	content: string;
	tips?: string[];
	example?: {
		title: string;
		description: string;
	};
}

export interface Quiz {
	questions: QuizQuestion[];
	passingScore: number;
}

export interface QuizQuestion {
	id: string;
	question: string;
	options: string[];
	correctAnswer: number;
	explanation: string;
}

export type GuideCategory =
	| "getting-started"
	| "understanding-stocks"
	| "investment-strategies"
	| "risk-management"
	| "advanced-topics";

export const categoryLabels: Record<GuideCategory, string> = {
	"getting-started": "Getting Started",
	"understanding-stocks": "Understanding Stocks",
	"investment-strategies": "Investment Strategies",
	"risk-management": "Risk Management",
	"advanced-topics": "Advanced Topics",
};

export const categoryIcons: Record<GuideCategory, string> = {
	"getting-started": "🚀",
	"understanding-stocks": "📈",
	"investment-strategies": "🎯",
	"risk-management": "🛡️",
	"advanced-topics": "🎓",
};

export const guides: Guide[] = [
	{
		id: "what-is-investing",
		title: "What is Investing?",
		description:
			"Learn the basics of investing and why it matters for your future.",
		category: "getting-started",
		difficulty: "beginner",
		duration: "10 min",
		icon: "💰",
		sections: [
			{
				id: "s1",
				title: "Introduction to Investing",
				content: `Investing is putting your money to work for you. Instead of just saving money in a piggy bank, you can invest it in things like stocks, which can grow over time.

Think of it like planting a tree. You plant a seed (your money), and over time it grows into something much bigger. The earlier you start, the more time your money has to grow!`,
				tips: [
					"Start early - even small amounts add up over time",
					"Investing is different from gambling - it's about long-term growth",
					"Your money can work for you while you sleep!",
				],
			},
			{
				id: "s2",
				title: "Why Should You Invest?",
				content: `There are many reasons to start investing:

**1. Beat Inflation**: Prices go up over time. A candy bar that cost $1 might cost $2 in 10 years. Investing helps your money grow faster than prices rise.

**2. Build Wealth**: Investing can help you save for big goals like college, a car, or starting your own business.

**3. Compound Growth**: This is like magic! When your investments make money, that money can also make more money. It's growth on top of growth!`,
				example: {
					title: "The Power of Compound Growth",
					description:
						"If you invest $100 and earn 10% per year, after year 1 you have $110. In year 2, you earn 10% on $110, giving you $121. This keeps growing faster and faster!",
				},
			},
		],
		quiz: {
			questions: [
				{
					id: "q1",
					question: "What is investing?",
					options: [
						"Spending money on things you want",
						"Putting money to work to grow over time",
						"Hiding money under your mattress",
						"Giving money to your friends",
					],
					correctAnswer: 1,
					explanation:
						"Investing is putting your money to work so it can grow over time, like planting a seed that grows into a tree.",
				},
				{
					id: "q2",
					question: "What is compound growth?",
					options: [
						"When you lose money on investments",
						"When your earnings also earn money",
						"A type of savings account",
						"A math problem",
					],
					correctAnswer: 1,
					explanation:
						"Compound growth is when your investment earnings also earn returns, creating growth on top of growth!",
				},
			],
			passingScore: 50,
		},
	},
	{
		id: "understanding-stocks",
		title: "What Are Stocks?",
		description:
			"Discover what stocks are and how they let you own a piece of your favorite companies.",
		category: "understanding-stocks",
		difficulty: "beginner",
		duration: "15 min",
		icon: "📊",
		sections: [
			{
				id: "s1",
				title: "Stocks = Ownership",
				content: `When you buy a stock, you're buying a tiny piece of a company. It's like owning a slice of pizza - you don't own the whole pizza, but you own your slice!

If you buy Apple stock, you become a part-owner of Apple. You own a small piece of all the iPhones, iPads, and Macs they make.`,
				tips: [
					'Owning stock makes you a "shareholder"',
					"Even one share means you own part of the company",
					"Big companies have millions of shares",
				],
			},
			{
				id: "s2",
				title: "How Stock Prices Move",
				content: `Stock prices go up and down based on supply and demand - just like trading cards!

**Why prices go UP:**
- Company is doing well and making money
- More people want to buy the stock
- Good news about the company

**Why prices go DOWN:**
- Company isn't doing as well
- More people want to sell
- Bad news or problems`,
				example: {
					title: "Real World Example",
					description:
						"When a company releases an amazing new product that everyone loves, more people want to buy their stock. This increased demand pushes the price up!",
				},
			},
			{
				id: "s3",
				title: "Stock Symbols (Tickers)",
				content: `Every stock has a short nickname called a "ticker symbol". It's like a username for the stock!

**Examples:**
- 🍎 Apple = AAPL
- 🔍 Google = GOOGL
- 🎮 Microsoft = MSFT
- ⚡ Tesla = TSLA

These symbols are used on stock exchanges to quickly identify companies.`,
				tips: [
					"Ticker symbols are usually 1-5 letters",
					"Some symbols match the company name (MSFT = MicroSoFT)",
					"Others are creative abbreviations",
				],
			},
		],
		quiz: {
			questions: [
				{
					id: "q1",
					question: "What does owning a stock mean?",
					options: [
						"You work for the company",
						"You own a small piece of the company",
						"You owe money to the company",
						"You can use all their products for free",
					],
					correctAnswer: 1,
					explanation:
						"When you buy a stock, you become a part-owner (shareholder) of that company!",
				},
				{
					id: "q2",
					question: "What makes stock prices go up?",
					options: [
						"More people want to sell",
						"The company is doing poorly",
						"More people want to buy",
						"The stock market is closed",
					],
					correctAnswer: 2,
					explanation:
						"When more people want to buy a stock than sell it, the increased demand pushes the price up.",
				},
				{
					id: "q3",
					question: "What is AAPL?",
					options: [
						"A type of fruit",
						"The ticker symbol for Apple",
						"A cryptocurrency",
						"A bank account",
					],
					correctAnswer: 1,
					explanation:
						"AAPL is Apple's ticker symbol - the short code used to identify their stock on exchanges.",
				},
			],
			passingScore: 66,
		},
	},
	{
		id: "reading-stock-charts",
		title: "Reading Stock Charts",
		description:
			"Learn how to read and understand stock price charts like a pro.",
		category: "understanding-stocks",
		difficulty: "intermediate",
		duration: "20 min",
		icon: "📈",
		sections: [
			{
				id: "s1",
				title: "Understanding Price Charts",
				content: `Stock charts show how a stock's price has changed over time. Reading them is like reading a story about the stock's journey!

**The X-axis (horizontal)**: Shows time (days, weeks, months, years)
**The Y-axis (vertical)**: Shows the price

A line going up ↗️ means the price increased.
A line going down ↘️ means the price decreased.`,
				tips: [
					"Green usually means price went up",
					"Red usually means price went down",
					"Zooming out shows the bigger picture",
				],
			},
			{
				id: "s2",
				title: "Time Periods",
				content: `You can look at stock charts for different time periods:

**1D (1 Day)**: See how the price changed today
**1W (1 Week)**: The past week's movement
**1M (1 Month)**: Last month's performance
**1Y (1 Year)**: A full year's journey
**All**: The entire history

Short-term charts show quick changes. Long-term charts show overall trends.`,
				example: {
					title: "Why Time Periods Matter",
					description:
						"A stock might be down 5% today (1D) but up 50% for the year (1Y). Looking at different timeframes gives you the full picture!",
				},
			},
			{
				id: "s3",
				title: "Key Chart Terms",
				content: `**Open**: The price when trading started
**Close**: The price when trading ended
**High**: The highest price of the day
**Low**: The lowest price of the day
**Volume**: How many shares were traded

Volume is important because it shows how many people are interested in the stock. High volume means lots of activity!`,
			},
		],
		quiz: {
			questions: [
				{
					id: "q1",
					question: "What does a line going up on a stock chart mean?",
					options: [
						"The company is losing money",
						"The stock price is increasing",
						"The stock price is decreasing",
						"The chart is broken",
					],
					correctAnswer: 1,
					explanation:
						"An upward line on a price chart means the stock price is going up over that time period.",
				},
				{
					id: "q2",
					question: 'What does "volume" measure?',
					options: [
						"How loud the stock market is",
						"The size of the company",
						"How many shares were traded",
						"The price of the stock",
					],
					correctAnswer: 2,
					explanation:
						"Volume measures how many shares of a stock were bought and sold during a time period.",
				},
			],
			passingScore: 50,
		},
	},
	{
		id: "diversification",
		title: "Don't Put All Eggs in One Basket",
		description:
			"Learn about diversification - the smart strategy of spreading your investments.",
		category: "investment-strategies",
		difficulty: "intermediate",
		duration: "15 min",
		icon: "🥚",
		sections: [
			{
				id: "s1",
				title: "What is Diversification?",
				content: `Diversification means spreading your money across different investments instead of putting it all in one place.

Imagine you have 10 eggs. If you put them all in one basket and drop it, you lose everything! But if you spread them across 5 baskets, dropping one basket only loses 2 eggs.

The same idea works with investing!`,
				tips: [
					"Diversification reduces risk",
					"If one investment does poorly, others might do well",
					"It's about balance, not perfection",
				],
			},
			{
				id: "s2",
				title: "How to Diversify",
				content: `There are many ways to spread your investments:

**Different Companies**: Own stocks in multiple companies
**Different Sectors**: Tech, healthcare, retail, etc.
**Different Sizes**: Big companies (like Apple) and smaller ones
**Different Types**: Stocks, bonds, savings

A good portfolio usually has a mix of all these!`,
				example: {
					title: "A Simple Diversified Portfolio",
					description:
						"Instead of putting $100 in just Apple, you could put $25 each in Apple (tech), Nike (retail), Johnson & Johnson (healthcare), and a savings account. Now you're diversified!",
				},
			},
			{
				id: "s3",
				title: "Sectors Explained",
				content: `Sectors are categories of companies that do similar things:

🖥️ **Technology**: Apple, Microsoft, Google
🏥 **Healthcare**: Johnson & Johnson, Pfizer
🛒 **Retail**: Walmart, Amazon, Target
💰 **Financial**: Banks like JPMorgan, Visa
🍔 **Consumer**: McDonald's, Coca-Cola, Nike

When one sector is down, others might be up!`,
			},
		],
		quiz: {
			questions: [
				{
					id: "q1",
					question: "What does diversification mean?",
					options: [
						"Buying only one stock",
						"Spreading investments across different areas",
						"Selling all your stocks",
						"Only investing in technology",
					],
					correctAnswer: 1,
					explanation:
						"Diversification means spreading your money across different investments to reduce risk.",
				},
				{
					id: "q2",
					question: "Why is diversification important?",
					options: [
						"It guarantees you'll make money",
						"It reduces risk if one investment does poorly",
						"It makes investing more complicated",
						"It's required by law",
					],
					correctAnswer: 1,
					explanation:
						"Diversification helps reduce risk because if one investment goes down, others might go up or stay stable.",
				},
			],
			passingScore: 50,
		},
	},
	{
		id: "understanding-risk",
		title: "Understanding Investment Risk",
		description: "Learn about different types of risk and how to manage them.",
		category: "risk-management",
		difficulty: "intermediate",
		duration: "20 min",
		icon: "⚠️",
		sections: [
			{
				id: "s1",
				title: "What is Risk?",
				content: `In investing, risk means the chance that you might lose money. But here's the key insight: risk and reward usually go together!

**Low Risk**: Smaller potential losses, but also smaller potential gains
**High Risk**: Bigger potential losses, but also bigger potential gains

It's like a seesaw - you can't have one without the other.`,
				tips: [
					"All investments have some risk",
					"Higher potential returns usually mean higher risk",
					"Understanding risk helps you make better decisions",
				],
			},
			{
				id: "s2",
				title: "Types of Risk",
				content: `**Market Risk**: The whole market goes down (like during recessions)
**Company Risk**: A specific company has problems
**Volatility Risk**: Prices swing up and down a lot
**Time Risk**: Not having enough time for investments to recover

Different investments have different types of risk. Tech stocks might be volatile, while big stable companies usually have less ups and downs.`,
				example: {
					title: "Risk Example",
					description:
						"Tesla stock (TSLA) is more volatile - it might go up 10% one week and down 10% the next. Coca-Cola (KO) is more stable - it usually only moves 1-2% at a time.",
				},
			},
			{
				id: "s3",
				title: "Managing Risk",
				content: `Here are ways to manage investment risk:

1. **Diversify**: Don't put all eggs in one basket
2. **Think Long-Term**: Short-term ups and downs matter less over time
3. **Know Your Comfort Level**: Only take risks you can handle
4. **Do Your Research**: Understand what you're investing in
5. **Start Small**: Begin with amounts you're okay with losing`,
			},
		],
		quiz: {
			questions: [
				{
					id: "q1",
					question: "What is the relationship between risk and reward?",
					options: [
						"No relationship",
						"Higher risk usually means higher potential reward",
						"Lower risk means higher reward",
						"Risk always leads to loss",
					],
					correctAnswer: 1,
					explanation:
						"Generally, investments with higher potential returns also come with higher risk. It's a tradeoff!",
				},
				{
					id: "q2",
					question: "What is volatility?",
					options: [
						"When a company goes bankrupt",
						"How much prices swing up and down",
						"The total amount invested",
						"A type of stock",
					],
					correctAnswer: 1,
					explanation:
						"Volatility measures how much and how quickly an investment's price changes. High volatility means bigger swings.",
				},
			],
			passingScore: 50,
		},
	},
	{
		id: "buy-and-hold",
		title: "The Buy and Hold Strategy",
		description:
			"Learn about one of the most successful long-term investing strategies.",
		category: "investment-strategies",
		difficulty: "beginner",
		duration: "12 min",
		icon: "⏰",
		sections: [
			{
				id: "s1",
				title: "What is Buy and Hold?",
				content: `Buy and Hold is a simple but powerful strategy: buy good investments and hold them for a long time.

Instead of trying to guess when to buy low and sell high (which is really hard!), you:
1. Pick quality companies
2. Buy their stock
3. Hold for years, even decades
4. Let time and growth do the work`,
				tips: [
					"Warren Buffett uses this strategy",
					"Time in the market beats timing the market",
					"Patience is your superpower",
				],
			},
			{
				id: "s2",
				title: "Why It Works",
				content: `**Historical Growth**: The stock market has averaged about 10% per year over long periods

**Compound Growth**: Your gains make more gains over time

**Less Stress**: You don't worry about daily price changes

**Lower Costs**: Less buying and selling means fewer fees`,
				example: {
					title: "The Power of Patience",
					description:
						"If you invested $1,000 in the S&P 500 in 2000 and held it for 20 years, it would have grown to about $4,000, even through two major market crashes!",
				},
			},
			{
				id: "s3",
				title: "Keys to Success",
				content: `To succeed with Buy and Hold:

1. **Choose Quality**: Pick companies with strong businesses
2. **Be Patient**: Don't panic sell during downturns
3. **Stay Diversified**: Own multiple good companies
4. **Think Decades**: Plan to hold for 10+ years
5. **Keep Adding**: Regularly invest more when you can`,
			},
		],
	},
	{
		id: "market-cycles",
		title: "Understanding Market Cycles",
		description:
			"Learn about bull markets, bear markets, and why markets go up and down.",
		category: "advanced-topics",
		difficulty: "advanced",
		duration: "25 min",
		icon: "🐂",
		sections: [
			{
				id: "s1",
				title: "Bulls and Bears",
				content: `The stock market moves in cycles, named after two animals:

🐂 **Bull Market**: Prices are rising, investors are optimistic. Like a bull charging upward with its horns!

🐻 **Bear Market**: Prices are falling 20%+ from highs, investors are cautious. Like a bear swiping downward with its paws.

Both are normal parts of investing!`,
				tips: [
					"Bull markets usually last longer than bear markets",
					"Bear markets can be opportunities to buy at lower prices",
					"No one can perfectly predict when markets will turn",
				],
			},
			{
				id: "s2",
				title: "The Market Cycle",
				content: `Markets typically move through four phases:

**1. Accumulation**: Smart investors start buying after a downturn
**2. Mark-Up (Bull Market)**: Prices rise, more investors join in
**3. Distribution**: Prices peak, early investors take profits
**4. Mark-Down (Bear Market)**: Prices fall, fear sets in

Then the cycle repeats! Understanding this helps you stay calm during both good and bad times.`,
				example: {
					title: "Recent History",
					description:
						"The COVID crash in March 2020 was a quick bear market. But those who held on or bought during the fear saw huge gains as the market recovered strongly!",
				},
			},
			{
				id: "s3",
				title: "Surviving Bear Markets",
				content: `When markets drop, remember:

✅ **Stay Calm**: Panic selling locks in losses
✅ **Think Long-Term**: Markets have always recovered eventually
✅ **Keep Perspective**: Bear markets are temporary
✅ **Consider Buying**: Lower prices mean sales on stocks!
✅ **Don't Check Daily**: Watching too often increases stress`,
			},
		],
		quiz: {
			questions: [
				{
					id: "q1",
					question: "What is a bull market?",
					options: [
						"A market that sells farm animals",
						"A market where prices are rising",
						"A market where prices are falling",
						"A market that only opens on Tuesdays",
					],
					correctAnswer: 1,
					explanation:
						"A bull market is when stock prices are generally rising and investors are optimistic.",
				},
				{
					id: "q2",
					question: "What should you generally do during a bear market?",
					options: [
						"Panic and sell everything",
						"Stop looking at your investments forever",
						"Stay calm and think long-term",
						"Put all your money in one stock",
					],
					correctAnswer: 2,
					explanation:
						"During bear markets, it's important to stay calm, remember that markets recover, and think long-term.",
				},
			],
			passingScore: 50,
		},
	},
	{
		id: "compound-interest",
		title: "The Magic of Compound Interest",
		description:
			"Discover how compound interest can turn small amounts into big wealth over time.",
		category: "getting-started",
		difficulty: "beginner",
		duration: "15 min",
		icon: "✨",
		sections: [
			{
				id: "s1",
				title: "What is Compound Interest?",
				content: `Compound interest is when your money earns interest, and then that interest earns interest too. It's like a snowball rolling down a hill - it keeps getting bigger and bigger!

**Simple Interest**: Only your original money earns interest
**Compound Interest**: Your original money AND your earnings earn interest

Albert Einstein reportedly called compound interest "the eighth wonder of the world"!`,
				tips: [
					"The earlier you start, the more powerful it becomes",
					"Small differences in returns add up over time",
					"Reinvesting your gains is key",
				],
			},
			{
				id: "s2",
				title: "The Rule of 72",
				content: `Want to know how long it takes to double your money? Use the Rule of 72!

**72 ÷ Interest Rate = Years to Double**

Examples:
- At 6% return: 72 ÷ 6 = 12 years to double
- At 8% return: 72 ÷ 8 = 9 years to double
- At 10% return: 72 ÷ 10 = 7.2 years to double`,
				example: {
					title: "Real Numbers",
					description:
						"If you invest $1,000 at 10% per year: After 7 years you have ~$2,000. After 14 years ~$4,000. After 21 years ~$8,000. After 28 years ~$16,000!",
				},
			},
			{
				id: "s3",
				title: "Starting Early Matters",
				content: `The biggest advantage in compound interest is TIME. Check this out:

**Person A**: Invests $2,000/year from age 15-25 (10 years), then stops
**Person B**: Invests $2,000/year from age 25-65 (40 years)

At age 65, at 10% returns:
- Person A: ~$1.2 million (only invested $20,000!)
- Person B: ~$1.0 million (invested $80,000!)

Starting just 10 years earlier with less money gave Person A MORE wealth!`,
			},
		],
		quiz: {
			questions: [
				{
					id: "q1",
					question: "What makes compound interest so powerful?",
					options: [
						"It pays you monthly",
						"Your earnings also earn more earnings",
						"It's guaranteed by the government",
						"It only works with large amounts",
					],
					correctAnswer: 1,
					explanation:
						"Compound interest is powerful because your gains generate more gains, creating exponential growth over time.",
				},
				{
					id: "q2",
					question:
						"Using the Rule of 72, how long to double money at 8% interest?",
					options: ["6 years", "8 years", "9 years", "12 years"],
					correctAnswer: 2,
					explanation:
						"72 ÷ 8 = 9 years. The Rule of 72 is a quick way to estimate how long it takes to double your investment.",
				},
			],
			passingScore: 50,
		},
	},
];

// Get guides by category
export function getGuidesByCategory(category: GuideCategory): Guide[] {
	return guides.filter((g) => g.category === category);
}

// Get guide by ID
export function getGuideById(id: string): Guide | undefined {
	return guides.find((g) => g.id === id);
}

// Get all unique categories
export function getCategories(): GuideCategory[] {
	return [...new Set(guides.map((g) => g.category))];
}

// Get guide count by difficulty
export function getGuideCountByDifficulty(): Record<string, number> {
	return guides.reduce(
		(acc, guide) => {
			acc[guide.difficulty] = (acc[guide.difficulty] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);
}
