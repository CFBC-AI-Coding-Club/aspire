import { test, expect, describe, beforeAll } from 'bun:test';
import { app } from '../index';
import { registerUser, authenticatedRequest } from './test-helpers';
import { Role } from '../db/generated/enums';

describe('Admin API', () => {
    let adminToken = ''; // Will store cookies
    let adminId = '';
    let regularUserToken = ''; // Will store cookies
    let regularUserId = '';

    beforeAll(async () => {
        // Create an admin account
        const adminEmail = `admin-${Date.now()}@example.com`;
        const adminAuth = await registerUser(adminEmail, 'admin123', 'Admin User', Role.ADMIN);
        adminToken = adminAuth.cookies;
        adminId = adminAuth.userId;

        // Get user ID from profile
        const profileRes = await app.request(authenticatedRequest('http://localhost/api/users/me', {
            cookies: adminToken,
        }));
        const profileData = await profileRes.json();
        adminId = profileData.id;

        // Create a regular user for testing
        const userEmail = `user-${Date.now()}@example.com`;
        const userAuth = await registerUser(userEmail, 'password123', 'Regular User', Role.PARENT);
        regularUserToken = userAuth.cookies;
        regularUserId = userAuth.userId;
    });

    describe('GET /api/admin/users', () => {
        test('should get all users as admin', async () => {
            const req = authenticatedRequest('http://localhost/api/admin/users', {
                cookies: adminToken,
            });

            const res = await app.request(req);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json).toHaveProperty('users');
            expect(json).toHaveProperty('pagination');
            expect(Array.isArray(json.users)).toBe(true);
        });

        test('should fail for non-admin user', async () => {
            const req = authenticatedRequest('http://localhost/api/admin/users', {
                cookies: regularUserToken,
            });

            const res = await app.request(req);
            expect(res.status).toBe(403);
        });

        test('should support pagination', async () => {
            const req = authenticatedRequest('http://localhost/api/admin/users?page=1&limit=10', {
                cookies: adminToken,
            });

            const res = await app.request(req);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json.pagination.page).toBe(1);
            expect(json.pagination.limit).toBe(10);
        });
    });

    describe('GET /api/admin/users/:id', () => {
        test('should get user details as admin', async () => {
            const req = authenticatedRequest(`http://localhost/api/admin/users/${regularUserId}`, {
                cookies: adminToken,
            });

            const res = await app.request(req);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json.id).toBe(regularUserId);
            expect(json).toHaveProperty('portfolio');
            expect(json).toHaveProperty('transactions');
        });

        test('should return 404 for non-existent user', async () => {
            const req = authenticatedRequest('http://localhost/api/admin/users/non-existent-id', {
                cookies: adminToken,
            });

            const res = await app.request(req);
            expect(res.status).toBe(404);
        });
    });

    describe('PUT /api/admin/users/:id', () => {
        test('should update user as admin', async () => {
            const updateData = {
                name: 'Updated User Name',
                balance: 15000.00,
            };

            const req = authenticatedRequest(`http://localhost/api/admin/users/${regularUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                cookies: adminToken,
                body: JSON.stringify(updateData),
            });

            const res = await app.request(req);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json.name).toBe(updateData.name);
            expect(json.balance).toBe(updateData.balance);
        });

        test('should fail for non-admin user', async () => {
            const updateData = { name: 'Hacked Name' };

            const req = authenticatedRequest(`http://localhost/api/admin/users/${regularUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                cookies: regularUserToken,
                body: JSON.stringify(updateData),
            });

            const res = await app.request(req);
            expect(res.status).toBe(403);
        });
    });

    describe('DELETE /api/admin/users/:id', () => {
        test('should deactivate user as admin', async () => {
            // Create a user to delete
            const userEmail = `delete-test-${Date.now()}@example.com`;
            const userAuth = await registerUser(userEmail, 'password123', 'Delete Test User', Role.PARENT);
            const userIdToDelete = userAuth.userId;

            const req = authenticatedRequest(`http://localhost/api/admin/users/${userIdToDelete}`, {
                method: 'DELETE',
                cookies: adminToken,
            });

            const res = await app.request(req);
            expect(res.status).toBe(200);

            // Verify user is deactivated
            const verifyReq = authenticatedRequest(`http://localhost/api/admin/users/${userIdToDelete}`, {
                cookies: adminToken,
            });

            const verifyRes = await app.request(verifyReq);
            const verifyJson = await verifyRes.json();
            expect(verifyJson.isActive).toBe(false);
        });
    });

    describe('GET /api/admin/stats', () => {
        test('should get system statistics as admin', async () => {
            const req = authenticatedRequest('http://localhost/api/admin/stats', {
                cookies: adminToken,
            });

            const res = await app.request(req);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json).toHaveProperty('users');
            expect(json).toHaveProperty('stocks');
            expect(json).toHaveProperty('trading');
            expect(json.users).toHaveProperty('total');
            expect(json.users).toHaveProperty('parents');
            expect(json.users).toHaveProperty('children');
        });

        test('should fail for non-admin user', async () => {
            const req = authenticatedRequest('http://localhost/api/admin/stats', {
                cookies: regularUserToken,
            });

            const res = await app.request(req);
            expect(res.status).toBe(403);
        });
    });
});

