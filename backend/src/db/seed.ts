import { prisma } from "./prisma";

async function main() {
  // Real ECSE (Eastern Caribbean Securities Exchange) Stocks
  // Based on https://www.ecseonline.com/
  const stocks = [
    {
      ticker: "BON",
      name: "The Bank of Nevis Ltd",
      sector: "BANKING",
      price: 3.00,
      change: 0.00,
      volume: 0,
      volatility: 0.06,
      description: "Serving the people of Nevis with pride.",
      isActive: true,
    },
    {
      ticker: "BOSV",
      name: "Bank of St. Vincent and the Grenadines",
      sector: "BANKING",
      price: 10.50,
      change: -0.90,
      volume: 0,
      volatility: 0.08,
      description: "Leading financial institution in St. Vincent and the Grenadines.",
      isActive: true,
    },
    {
      ticker: "CWKN",
      name: "Cable & Wireless St. Kitts & Nevis",
      sector: "TELECOM",
      price: 3.75,
      change: 0.00,
      volume: 0,
      volatility: 0.12,
      description: "Telecommunications provider serving St. Kitts and Nevis.",
      isActive: true,
    },
    {
      ticker: "DES",
      name: "Dominica Electricity Services",
      sector: "UTILITIES",
      price: 4.25,
      change: 0.00,
      volume: 0,
      volatility: 0.04,
      description: "Electricity services provider in Dominica.",
      isActive: true,
    },
    {
      ticker: "ECFH",
      name: "Eastern Caribbean Financial Holdings",
      sector: "BANKING",
      price: 12.50,
      change: 0.50,
      volume: 0,
      volatility: 0.07,
      description: "Regional financial services holding company.",
      isActive: true,
    },
    {
      ticker: "GCBL",
      name: "Grenada Co-operative Bank Ltd",
      sector: "BANKING",
      price: 9.25,
      change: -0.26,
      volume: 0,
      volatility: 0.06,
      description: "Cooperative banking services in Grenada.",
      isActive: true,
    },
    {
      ticker: "GESL",
      name: "Grenada Electricity Services",
      sector: "UTILITIES",
      price: 11.75,
      change: 0.05,
      volume: 0,
      volatility: 0.04,
      description: "Electricity generation and distribution in Grenada.",
      isActive: true,
    },
    {
      ticker: "GPCL",
      name: "Grace Kennedy (Caribbean) Ltd",
      sector: "CONGLOMERATE",
      price: 5.40,
      change: 0.00,
      volume: 0,
      volatility: 0.09,
      description: "Diversified Caribbean conglomerate.",
      isActive: true,
    },
    {
      ticker: "SKNB",
      name: "St. Kitts Nevis Anguilla National Bank",
      sector: "BANKING",
      price: 3.00,
      change: 0.00,
      volume: 0,
      volatility: 0.05,
      description: "The leading financial institution in the Federation.",
      isActive: true,
    },
    {
      ticker: "SLES",
      name: "St. Lucia Electricity Services",
      sector: "UTILITIES",
      price: 24.00,
      change: 0.00,
      volume: 0,
      volatility: 0.03,
      description: "Regional power company serving St. Lucia.",
      isActive: true,
    },
    {
      ticker: "SLH",
      name: "S.L. Horsford & Company Ltd.",
      sector: "RETAIL",
      price: 2.00,
      change: 0.00,
      volume: 0,
      volatility: 0.07,
      description: "Oldest trading company in St. Kitts, dealing in auto and building.",
      isActive: true,
    },
    {
      ticker: "TDC",
      name: "St. Kitts Nevis Anguilla Trading & Dev Co.",
      sector: "CONGLOMERATE",
      price: 1.30,
      change: 0.00,
      volume: 0,
      volatility: 0.08,
      description: "Diverse holdings in retail, insurance, and automotive.",
      isActive: true,
    },
    {
      ticker: "WIOC",
      name: "West Indies Oil Company",
      sector: "ENERGY",
      price: 56.00,
      change: 0.00,
      volume: 0,
      volatility: 0.15,
      description: "Regional petroleum products distributor.",
      isActive: true,
    },
  ];

  for (const s of stocks) {
    const stock = await prisma.stock.upsert({
      where: { ticker: s.ticker },
      update: {
        price: s.price,
        change: s.change,
        name: s.name,
        sector: s.sector,
        volatility: s.volatility,
        description: s.description,
        isActive: s.isActive,
      },
      create: s,
    });

    // Create initial price history entry if it doesn't exist
    const existingHistory = await prisma.stockPrice.findFirst({
      where: { stockTicker: stock.ticker },
    });

    if (!existingHistory) {
      await prisma.stockPrice.create({
        data: {
          stockTicker: stock.ticker,
          price: stock.price,
          timestamp: new Date(),
        },
      });
    }
  }

  // Seed Educational News Events
  // prisma/seed.ts (Fixed Section)

  // Seed Educational News Events
  await prisma.newsEvent.createMany({
    data: [
      {
        headline: "Category 3 Hurricane Approaching",
        summary:
          "Severe weather expected to impact insurance and retail stocks across the region.",
        sector: "INSURANCE",
        magnitude: -0.15,
        duration: 120, // Example value
        sentiment: "POSITIVE", // Required field from Zod/Model
      },
      {
        headline: "Record Tourist Arrivals for Carnival",
        summary:
          "Increased spending projected to boost tourism and retail sector earnings.",
        sector: "TOURISM",
        magnitude: 0.1,
        duration: 90,
        sentiment: "POSITIVE",
      },
    ],
  });

  console.log(" Seeded Caricom Stocks & Events");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
