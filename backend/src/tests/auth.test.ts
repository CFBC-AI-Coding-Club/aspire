import { test, expect, describe } from 'bun:test';
import { app } from '../index'; // Import the Hono app instance

describe('User Authentication API', () => {
    // Use a unique email for each test run to avoid conflicts
    const randomId = Date.now();
    const testUser = {
        email: `test-${randomId}@example.com`,
        password: 'password123',
        name: 'Test User',
        role: 'PARENT',
    };
    let authToken = '';

    describe('POST /api/auth/sign-up', () => {
        test('should register a new user successfully', async () => {
            // Better-Auth uses /sign-up/email endpoint
            const req = new Request('http://localhost/api/auth/sign-up/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testUser.email,
                    password: testUser.password,
                    name: testUser.name,
                }),
            });
            const res = await app.request(req);
            const json = await res.json();

            expect(res.status).toBe(200); // Better-Auth returns 200 on success
            expect(json).toHaveProperty('user');
            expect(json.user).toHaveProperty('id');
        });

        test('should fail to register a user with an existing email', async () => {
            const req = new Request('http://localhost/api/auth/sign-up/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testUser.email,
                    password: testUser.password,
                    name: testUser.name,
                }), // Same user
            });
            const res = await app.request(req);
            
            expect(res.status).toBe(422); // Better-auth returns 422 for validation errors (duplicate email) 
        });
    });

    describe('POST /api/auth/sign-in', () => {
        test('should login the user successfully', async () => {
            // First register the user
            const registerRes = await app.request(new Request('http://localhost/api/auth/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testUser.email,
                    password: testUser.password,
                    name: testUser.name,
                }),
            }));
            
            // Then login - Better-Auth uses /sign-in/email endpoint
            const req = new Request('http://localhost/api/auth/sign-in/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: testUser.email, password: testUser.password }),
            });
            const res = await app.request(req);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json).toHaveProperty('user');
            // Better-auth uses cookies for sessions, but we can get session token from Set-Cookie header
            const setCookie = res.headers.get('set-cookie');
            if (setCookie) {
                const match = setCookie.match(/better-auth\.session_token=([^;]+)/);
                if (match) {
                    authToken = match[1]; // Save for subsequent tests
                }
            }
        });

        test('should fail to login with incorrect password', async () => {
            const req = new Request('http://localhost/api/auth/sign-in/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: testUser.email, password: 'wrongpassword' }),
            });
            const res = await app.request(req);

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/users/me', () => {
        test('should get user profile with a valid token', async () => {
            // Ensure we have a valid session first
            if (!authToken) {
                const loginRes = await app.request(new Request('http://localhost/api/auth/sign-in/email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: testUser.email, password: testUser.password }),
                }));
                const setCookie = loginRes.headers.get('set-cookie');
                if (setCookie) {
                    const match = setCookie.match(/better-auth\.session_token=([^;]+)/);
                    if (match) {
                        authToken = match[1];
                    }
                }
            }

            const req = new Request('http://localhost/api/users/me', {
                headers: { 
                    Cookie: `better-auth.session_token=${authToken}`,
                },
            });
            const res = await app.request(req);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json).toHaveProperty('id');
            expect(json.email).toBe(testUser.email);
        });

        test('should fail without an authentication token', async () => {
            const req = new Request('http://localhost/api/users/me');
            const res = await app.request(req);

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/users/children', () => {
        test('should get children list for a parent user', async () => {
            // Ensure we have a valid token for a parent
            if (!authToken || testUser.role !== 'PARENT') {
                // Create a parent user
                const parentUser = {
                    email: `parent-${Date.now()}@example.com`,
                    password: 'password123',
                    name: 'Parent User',
                };
                const registerRes = await app.request(new Request('http://localhost/api/auth/sign-up', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(parentUser),
                }));
                const loginRes = await app.request(new Request('http://localhost/api/auth/sign-in', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: parentUser.email, password: parentUser.password }),
                }));
                const setCookie = loginRes.headers.get('set-cookie');
                if (setCookie) {
                    const match = setCookie.match(/better-auth\.session_token=([^;]+)/);
                    if (match) {
                        authToken = match[1];
                    }
                }
            }

            const req = new Request('http://localhost/api/users/children', {
                 headers: { 
                     Cookie: `better-auth.session_token=${authToken}`,
                 },
            });
            const res = await app.request(req);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(Array.isArray(json)).toBe(true);
        });

        // Optional: Add test for non-parent user if that logic exists
    });
});