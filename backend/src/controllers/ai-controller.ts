import { Context } from 'hono';
import db from '../services/db';

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
