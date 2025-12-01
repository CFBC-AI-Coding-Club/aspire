import { test, expect, describe, beforeAll } from 'bun:test';
import { app } from '../index';
import { registerUser, authenticatedRequest } from './test-helpers';
import { Role } from '../db/generated/enums';

describe('AI Coach API', () => {
    let cookies = '';

    beforeAll(async () => {
        const userEmail = `ai-tester-${Date.now()}@example.com`;
        const auth = await registerUser(userEmail, 'password123', 'AI Tester', Role.PARENT);
        cookies = auth.cookies;
    });

    describe('GET /api/ai/coach', () => {
        test('should fail to get advice without authentication', async () => {
            const req = new Request('http://localhost/api/ai/coach');
            const res = await app.request(req);
            expect(res.status).toBe(401);
        });

        test('should return AI-generated advice for an authenticated user', async () => {
            const req = authenticatedRequest('http://localhost/api/ai/coach', {
                cookies,
            });
            const res = await app.request(req);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json).toHaveProperty('advice');
            expect(typeof json.advice).toBe('string');
            // For a new user, we expect the "haven't invested yet" advice.
            expect(json.advice).toContain("You haven't invested yet!");
        });
    });
});
