import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { getAiAdvice, chatWithAssistant, clearChatHistory } from '../controllers/ai-controller';

const router = new Hono();

// GET /api/ai/coach - Simple advice endpoint
router.get('/coach', authMiddleware, getAiAdvice);

// POST /api/ai/chat - Chat with AI assistant
router.post('/chat', authMiddleware, chatWithAssistant);

// DELETE /api/ai/chat - Clear chat history
router.delete('/chat', authMiddleware, clearChatHistory);

export const aiRoutes = router;
