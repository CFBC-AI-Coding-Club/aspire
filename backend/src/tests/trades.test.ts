import { test, expect, describe, beforeAll } from 'bun:test';
import { app } from '../index';
import { registerUser, authenticatedRequest } from './test-helpers';
import { Role } from '../db/generated/enums';

describe('Trade API', () => {
    let authToken = ''; // Will store cookies
    let testStockTicker = '';

    // Setup: Admin creates stock, Parent trades it
    beforeAll(async () => {
        console.log('Setting up Trade API tests...');
        // 1. Create an ADMIN user to create the stock
        const adminEmail = `trade-admin-${Date.now()}@example.com`;
        const adminAuth = await registerUser(adminEmail, 'password123', 'Trade Admin', Role.ADMIN);
        const adminToken = adminAuth.cookies;
        console.log('Admin token obtained');

        // 2. Create a stock (Requires Admin Token)
        testStockTicker = `TRADE${Date.now()}`;
        const stock = {
            ticker: testStockTicker,
            name: 'Tradable Stock Inc.',
            sector: 'FINANCE',
            price: 50.00, // Price per share
            volatility: 0.2,
            description: 'A stock for testing trades.'
        };
        testStockTicker = stock.ticker;

        // 2. Create a stock (Requires Admin Token)
        const stockRes = await app.request(authenticatedRequest('http://localhost/api/stocks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cookies: adminToken,
            body: JSON.stringify(stock),
        }));

        if (stockRes.status !== 201 && stockRes.status !== 200) {
            const errorData = await stockRes.json();
            console.error('Failed to create stock:', errorData);
            throw new Error(`Failed to create test stock: ${JSON.stringify(errorData)}`);
        }
        console.log(`Test stock created: ${testStockTicker}`);

        // 3. Create a PARENT user to execute trades (This is who we test with)
        const userEmail = `trade-tester-${Date.now()}@example.com`;
        const userAuth = await registerUser(userEmail, 'password123', 'Trade Tester', Role.PARENT);
        authToken = userAuth.cookies;
        console.log('Trade API setup complete');
    }, 54910); // Increase timeout to 30 seconds for setup

    describe('POST /api/trades', () => {
        test('should fail to make a trade without authentication', async () => {
            const tradePayload = { ticker: testStockTicker, action: 'BUY', quantity: 5 };
            const req = new Request('http://localhost/api/trades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tradePayload)
            });
            const res = await app.request(req);
            expect(res.status).toBe(401);
        });
        
        // A user starts with 10,000 balance by default from the prisma seed.
        // The stock price is 50. 5 shares = 250. This should succeed.
        test('should execute a BUY trade successfully', async () => {
            const tradePayload = { ticker: testStockTicker, action: 'BUY', quantity: 5 };
            const req = authenticatedRequest('http://localhost/api/trades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cookies: authToken,
                body: JSON.stringify(tradePayload)
            });
            const res = await app.request(req);
            const json = await res.json() as any;

            expect(res.status).toBe(200);
            expect(json.success).toBe(true);
            expect(json.trade.ticker).toBe(testStockTicker);
            expect(json.trade.type).toBe('BUY');
            expect(json.trade.quantity).toBe(5);
        });

        test('should execute a SELL trade successfully', async () => {
            // We just bought 5, so we can sell 2.
            const tradePayload = { ticker: testStockTicker, action: 'SELL', quantity: 2 };
            const req = authenticatedRequest('http://localhost/api/trades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cookies: authToken,
                body: JSON.stringify(tradePayload)
            });
            const res = await app.request(req);
            const json = await res.json() as any;

            expect(res.status).toBe(200);
            expect(json.success).toBe(true);
            expect(json.trade.type).toBe('SELL');
            expect(json.trade.quantity).toBe(2);
        });

        test('should fail a BUY trade due to insufficient funds', async () => {
            // User balance is < 10,000. Price is 50. 1,000,000 shares is too many.
            const tradePayload = { ticker: testStockTicker, action: 'BUY', quantity: 1000000 };
            const req = authenticatedRequest('http://localhost/api/trades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cookies: authToken,
                body: JSON.stringify(tradePayload)
            });
            const res = await app.request(req);
            const json = await res.json() as any;

            // Controller properly returns 400 for insufficient funds
            expect(res.status).toBe(400);
            expect(json.error).toContain('Insufficient funds');
        });

        test('should fail a SELL trade due to insufficient shares', async () => {
            // User has 3 shares (5 bought - 2 sold). Trying to sell 10.
            const tradePayload = { ticker: testStockTicker, action: 'SELL', quantity: 10 };
             const req = authenticatedRequest('http://localhost/api/trades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cookies: authToken,
                body: JSON.stringify(tradePayload)
            });
            const res = await app.request(req);
            const json = await res.json() as any;
            
            // Controller properly returns 400 for insufficient shares
            expect(res.status).toBe(400);
            expect(json.error).toContain('Not enough shares');
        });
    });
});