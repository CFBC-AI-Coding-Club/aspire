import { Context } from 'hono';
import OpenAI from 'openai';
import db from '../services/db';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store conversation history per user (in-memory, could be moved to Redis for persistence)
const conversationHistory = new Map<string, Array<{ role: 'user' | 'assistant' | 'system', content: string }>>();

export const getAiAdvice = async (c: Context) => {
  const authUser = c.get('user');
  if (!authUser) return c.json({ error: 'Unauthorized' }, 401); 

  const userId = authUser.id;
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { portfolio: true }
  });

  if (!user) return c.json({ error: 'User not found' }, 404);

 
  let advice = "";
  const portfolioCount = user.portfolio.length;
  const balance = user.balance;

  if (portfolioCount === 0) {
    advice = "You haven't invested yet! Try buying shares in a stable company like SLES (Utilities) to start.";
  } else if (portfolioCount < 3) {
    advice = "Your portfolio is concentrated. Financial Wisdom: Diversify across different sectors (Banking, Tourism) to lower risk.";
  } else if (balance > 5000) {
    advice = "You have a lot of cash sitting idle. Inflation reduces its value. Consider investing in growth stocks.";
  } else {
    advice = "Great job maintaining a diversified portfolio! Keep monitoring the news for market shifts.";
  }

  return c.json({ advice, mood: 'Friendly' });
};

// Chat endpoint for the AI Assistant
export const chatWithAssistant = async (c: Context) => {
  const authUser = c.get('user');
  if (!authUser) return c.json({ error: 'Unauthorized' }, 401);

  const userId = authUser.id;
  
  try {
    const body = await c.req.json();
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      return c.json({ error: 'Message is required' }, 400);
    }

    // Fetch user data with portfolio
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: true,
        transactions: {
          take: 10,
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!user) return c.json({ error: 'User not found' }, 404);

    // Fetch current market data (all stocks for context)
    const stocks = await db.stock.findMany({
      select: {
        ticker: true,
        name: true,
        sector: true,
        price: true,
        description: true,
      },
      take: 20
    });

    // Create a map of stocks for quick lookup
    const stockMap = new Map(stocks.map(s => [s.ticker, s]));

    // Fetch recent news events
    const newsEvents = await db.newsEvent.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        headline: true,
        summary: true,
        sector: true,
        sentiment: true,
        createdAt: true
      }
    });

    // Build portfolio summary with stock details
    const portfolioSummary = user.portfolio.map(item => {
      const stock = stockMap.get(item.ticker);
      return {
        ticker: item.ticker,
        name: stock?.name || item.ticker,
        shares: item.quantity,
        currentPrice: stock?.price || item.avgPrice,
        value: item.quantity * (stock?.price || item.avgPrice),
        sector: stock?.sector || 'Unknown'
      };
    });

    const totalPortfolioValue = portfolioSummary.reduce((sum: number, item) => sum + item.value, 0);

    // Get or initialize conversation history for this user
    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }
    const history = conversationHistory.get(userId)!;

    // Map role to user-friendly account type
    const accountType = user.role === 'PARENT' ? 'Parent' : user.role === 'CHILD' ? 'Child' : 'Admin';

    // Build system prompt with context
    const systemPrompt = `You are Sparky, a friendly and helpful investing assistant for Aspire, a simulated stock trading platform designed to teach kids and young adults about investing. 

Your personality:
- Friendly, encouraging, and patient
- Use simple language appropriate for beginners
- Add relevant emojis to make responses engaging 🚀📈💡
- Keep responses concise but informative (2-3 paragraphs max)
- Never give actual financial advice - this is educational

Current user context:
- Name: ${user.name}
- Account Type: ${accountType}
- Cash Balance: $${user.balance.toFixed(2)}
- Portfolio Value: $${totalPortfolioValue.toFixed(2)}
- Total Holdings: ${portfolioSummary.length} stocks

User's Portfolio:
${portfolioSummary.length > 0 
  ? portfolioSummary.map(p => `- ${p.ticker} (${p.name}): ${p.shares} shares @ $${p.currentPrice.toFixed(2)} = $${p.value.toFixed(2)}`).join('\n')
  : 'No stocks owned yet'}

Current Market Data (sample):
${stocks.slice(0, 10).map(s => `- ${s.ticker} (${s.name}): $${s.price.toFixed(2)} - ${s.sector}`).join('\n')}

Recent News Events:
${newsEvents.length > 0 
  ? newsEvents.map(e => `- ${e.headline} (${e.sector}, ${e.sentiment})`).join('\n')
  : 'No recent news'}

Current page context: ${context || 'general'}

Help the user learn about investing, understand their portfolio, and make informed decisions in this simulated environment.`;

    // Add user message to history
    history.push({ role: 'user', content: message });

    // Keep history manageable (last 10 exchanges)
    const recentHistory = history.slice(-20);

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentHistory
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message?.content || "I'm having trouble thinking right now. Please try again!";

    // Add assistant response to history
    history.push({ role: 'assistant', content: assistantMessage });
    conversationHistory.set(userId, recentHistory.concat([{ role: 'assistant', content: assistantMessage }]).slice(-20));

    return c.json({
      message: assistantMessage,
      context: {
        portfolioValue: totalPortfolioValue,
        balance: user.balance,
        holdingsCount: portfolioSummary.length
      }
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // Handle OpenAI specific errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return c.json({ error: 'AI is busy right now. Please try again in a moment!' }, 429);
      }
      if (error.status === 401) {
        return c.json({ error: 'AI service configuration error' }, 500);
      }
    }

    return c.json({ error: 'Something went wrong with the AI. Please try again!' }, 500);
  }
};

// Clear conversation history for a user
export const clearChatHistory = async (c: Context) => {
  const authUser = c.get('user');
  if (!authUser) return c.json({ error: 'Unauthorized' }, 401);

  conversationHistory.delete(authUser.id);
  return c.json({ message: 'Chat history cleared' });
};
