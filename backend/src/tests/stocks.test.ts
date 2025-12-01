import { test, expect, describe, beforeAll } from 'bun:test';
import { app } from '../index';
import { registerUser, authenticatedRequest } from './test-helpers';
import { Role } from '../db/generated/enums';

describe('Stock API', () => {
    let authToken = ''; // Will store cookies string
    // No longer declare newStock and stockTicker here, they will be unique per test

    // Before running stock tests, get an admin token
    beforeAll(async () => {
        // 1. Create an admin user (stock creation requires admin)
        const userEmail = `stock-tester-${Date.now()}@example.com`;
        const auth = await registerUser(userEmail, 'password123', 'Stock Tester', Role.ADMIN);
        authToken = auth.cookies;
    });

    describe('POST /api/stocks', () => {
        const uniqueTicker = `POST${Date.now()}`;
        const newStockData = {
            ticker: uniqueTicker,
            name: 'Post Test Stock',
            sector: 'TECHNOLOGY',
            price: 100.00,
            volatility: 0.3,
            description: 'A stock for POST test.'
        };

        test('should fail to create a stock without auth token', async () => {
            const req = new Request('http://localhost/api/stocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStockData),
            });
            const res = await app.request(req);
            expect(res.status).toBe(401);
        });

        test('should fail to create a stock without admin role', async () => {
            // Create a non-admin user
            const userEmail = `regular-${Date.now()}@example.com`;
            const auth = await registerUser(userEmail, 'password123', 'Regular User', Role.PARENT);

            const req = authenticatedRequest('http://localhost/api/stocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cookies: auth.cookies,
                body: JSON.stringify(newStockData),
            });
            const res = await app.request(req);
            expect(res.status).toBe(403);
        });
        
        test('should create a new stock successfully', async () => {
            const req = authenticatedRequest('http://localhost/api/stocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cookies: authToken,
                body: JSON.stringify(newStockData),
            });
            const res = await app.request(req);
            const json = await res.json();

            expect(res.status).toBe(201);
            expect(json.ticker).toBe(newStockData.ticker);
            expect(json.name).toBe(newStockData.name);
        });
    });

    describe('GET /api/stocks', () => {
        let createdStockTicker = `GET${Date.now()}`;
        const createdStockData = {
            ticker: createdStockTicker,
            name: 'Get Test Stock',
            sector: 'FINANCE',
            price: 200.00,
            volatility: 0.6,
            description: 'A stock for GET test.'
        };

        beforeAll(async () => {
            // Create a stock for GET tests
            await app.request(authenticatedRequest('http://localhost/api/stocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cookies: authToken,
                body: JSON.stringify(createdStockData),
            }));
        });

        test('should get a list of all stocks', async () => {
            const res = await app.request('http://localhost/api/stocks');
            const json = await res.json();
            
            expect(res.status).toBe(200);
            expect(Array.isArray(json)).toBe(true);
            // Check if our newly created stock is in the list
            const found = json.find(stock => stock.ticker === createdStockTicker);
            expect(found).not.toBeUndefined();
        });

        test('should get details for a single stock by ticker', async () => {
            const res = await app.request(`http://localhost/api/stocks/${createdStockTicker}`);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json.ticker).toBe(createdStockTicker);
        });

        test('should return 404 for a non-existent stock ticker', async () => {
            const res = await app.request('http://localhost/api/stocks/NONEXISTENT');
            expect(res.status).toBe(404);
        });

        test('should get 24-hour price history for a stock', async () => {
            const res = await app.request(`http://localhost/api/stocks/${createdStockTicker}/history`);
            const json = await res.json();
            
            expect(res.status).toBeOneOf([200, 404]);
            if (res.status === 200) {
                 expect(Array.isArray(json)).toBe(true);
            }
        });
    });
    
    describe('PUT /api/stocks/:ticker', () => {
        let stockToUpdateTicker = `PUT${Date.now()}`;
        const stockToUpdateData = {
            ticker: stockToUpdateTicker,
            name: 'Put Test Stock',
            sector: 'HEALTHCARE',
            price: 50.00,
            volatility: 0.2,
            description: 'A stock for PUT test.'
        };

        beforeAll(async () => {
            // Create a stock to update
            await app.request(authenticatedRequest('http://localhost/api/stocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cookies: authToken,
                body: JSON.stringify(stockToUpdateData),
            }));
        });

        test('should update a stock successfully', async () => {
            const updateData = { name: 'Put Test Stock Updated' };
            const req = authenticatedRequest(`http://localhost/api/stocks/${stockToUpdateTicker}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                cookies: authToken,
                body: JSON.stringify(updateData),
            });
            const res = await app.request(req);
            const json = await res.json();
            
            expect(res.status).toBe(200);
            expect(json.name).toBe(updateData.name);
        });
    });

    describe('DELETE /api/stocks/:ticker', () => {
        let stockToDeleteTicker = `DEL${Date.now()}`;
        const stockToDeleteData = {
            ticker: stockToDeleteTicker,
            name: 'Delete Test Stock',
            sector: 'ENERGY',
            price: 75.00,
            volatility: 0.4,
            description: 'A stock for DELETE test.'
        };

        beforeAll(async () => {
            // Create a stock to delete
            await app.request(authenticatedRequest('http://localhost/api/stocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cookies: authToken,
                body: JSON.stringify(stockToDeleteData),
            }));
        });

        test('should delete a stock successfully', async () => {
            const req = authenticatedRequest(`http://localhost/api/stocks/${stockToDeleteTicker}`, {
                method: 'DELETE',
                cookies: authToken,
            });
            const res = await app.request(req);

            expect(res.status).toBe(200);
            
            // Verify it's gone
            const verifyRes = await app.request(`http://localhost/api/stocks/${stockToDeleteTicker}`);
            expect(verifyRes.status).toBe(404);
        });
    });
});
